import { Logger } from "@nestjs/common";
import { sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { z } from "zod";
import { router } from "../../trpc.init";
import { adminProcedure } from "./admin.procedure";

// ─── AvalAI User API (live cost & credit data) ───────────────────────────────

const AVALAI_USER_API = "https://api.avalai.ir/user/v1";

/**
 * Cache TTL — the AvalAI User API is rate-limited per tier (3–750 RPM) and
 * STALLS over-limit requests instead of returning 429. With a 2-minute cache
 * and sequential calls we stay at ≤1.5 RPM even on tier 0.
 */
const COST_METRICS_CACHE_TTL_MS = 120_000;

/** Backoff after a fully-failed refresh so we don't hammer a stalled API. */
const COST_METRICS_FAILURE_BACKOFF_MS = 30_000;

export interface AiCostMetrics {
  creditRemainingIrt: number;
  totalCostToday: number;
  totalTranscriptionMinutes: number;
  modelsUsed: number;
  recentTransactions: Array<{
    id: string;
    model: string;
    provider: string;
    inputTokens: number;
    outputTokens: number;
    costIrt: number;
    timestamp: string;
  }>;
}

const EMPTY_COST_METRICS: AiCostMetrics = {
  creditRemainingIrt: 0,
  totalCostToday: 0,
  totalTranscriptionMinutes: 0,
  modelsUsed: 0,
  recentTransactions: [],
};

let costMetricsCache: { data: AiCostMetrics; fetchedAt: number; failed: boolean } | null = null;

/** Deduplicate concurrent refreshes (e.g. two admin tabs) into one API sweep. */
let costMetricsInFlight: Promise<AiCostMetrics> | null = null;

const costLogger = new Logger("AiCostMetrics");

/** Authenticated GET/POST against the AvalAI User API with a 12s timeout. */
async function avalaiUserApi<T>(
  path: string,
  apiKey: string,
  init?: { method?: "POST"; body?: unknown },
): Promise<T | null> {
  try {
    const response = await fetch(`${AVALAI_USER_API}${path}`, {
      method: init?.method ?? "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: init?.body ? JSON.stringify(init.body) : undefined,
      signal: AbortSignal.timeout(12_000),
    });
    if (!response.ok) {
      costLogger.warn(`[AiCostMetrics] ${path} → HTTP ${response.status}`);
      return null;
    }
    return (await response.json()) as T;
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown";
    costLogger.warn(`[AiCostMetrics] ${path} failed: ${msg}`);
    return null;
  }
}

/**
 * Fetch exact per-transaction IRT costs + audio durations via the lookup
 * endpoint. Skipped entirely on tier-0 accounts (3 RPM budget is already
 * consumed by the three primary calls).
 */
async function fetchExactCosts(
  apiKey: string,
  accountTier: number,
  transactions: Array<{ id: string }>,
): Promise<Map<string, { costIrt: number; audioSeconds: number }>> {
  const costById = new Map<string, { costIrt: number; audioSeconds: number }>();
  if (accountTier < 1 || transactions.length === 0) return costById;

  const lookup = await avalaiUserApi<{
    transactions: Array<{
      id: string;
      cost: { paid_irt: string; paid_grant_irt: string };
      tokens: { prompt_details?: { audio_input_duration?: number } };
    }>;
  }>("/transactions/lookup", apiKey, {
    method: "POST",
    body: { transaction_ids: transactions.map((t) => t.id) },
  });

  for (const tx of lookup?.transactions ?? []) {
    costById.set(tx.id, {
      costIrt: Number(tx.cost.paid_irt) + Number(tx.cost.paid_grant_irt),
      audioSeconds: tx.tokens.prompt_details?.audio_input_duration ?? 0,
    });
  }
  return costById;
}

/**
 * Assemble live cost metrics from the AvalAI User API.
 *
 * IMPORTANT: calls run SEQUENTIALLY. Low account tiers allow as little as
 * 3 requests/minute, and AvalAI stalls over-limit requests instead of
 * returning 429 — a parallel burst makes every call hang until timeout.
 *
 *  1. GET /credit                              → remaining IRT + account tier
 *  2. GET /transactions/summary?group_by=model → today's spend + models used
 *  3. GET /transactions?page_size=15           → recent request rows (tokens)
 *  4. POST /transactions/lookup (tier ≥ 1 only) → exact per-request IRT cost
 *
 * Successful results cache for 2 minutes; total failures back off 30s and
 * are retried, never poisoning the cache with long-lived zeros.
 */
async function fetchAvalAiCostMetrics(): Promise<AiCostMetrics> {
  const now = Date.now();
  if (costMetricsCache) {
    const age = now - costMetricsCache.fetchedAt;
    const ttl = costMetricsCache.failed
      ? COST_METRICS_FAILURE_BACKOFF_MS
      : COST_METRICS_CACHE_TTL_MS;
    if (age < ttl) return costMetricsCache.data;
  }
  if (costMetricsInFlight) return costMetricsInFlight;

  costMetricsInFlight = (async () => {
    const apiKey = process.env.AVALAI_API_KEY ?? "";
    if (!apiKey) {
      costLogger.warn("[AiCostMetrics] AVALAI_API_KEY not configured — returning zeros");
      return EMPTY_COST_METRICS;
    }

    // 1. Credit balance + account tier (drives whether we can afford call #4)
    const credit = await avalaiUserApi<{ remaining_irt: number; account_tier?: number }>(
      "/credit",
      apiKey,
    );

    // 2. Today's aggregate spend, grouped by model
    const summary = await avalaiUserApi<{
      totals: { cost: { paid_irt: string; paid_grant_irt: string } };
      by_model: Array<{ model: string }> | null;
    }>("/transactions/summary?group_by=model", apiKey);

    // 3. Recent transactions (tokens are included; exact cost is not)
    const txList = await avalaiUserApi<{
      transactions: Array<{
        id: string;
        created_at: string;
        model: string;
        provider: string;
        tokens: { prompt: number; completion: number };
      }>;
    }>("/transactions?page_size=15", apiKey);

    const transactions = txList?.transactions ?? [];

    // 4. Exact per-transaction cost — only on tier ≥ 1 (15+ RPM); on tier 0
    //    this would be the 4th call in the window and would stall.
    const costById = await fetchExactCosts(apiKey, credit?.account_tier ?? 0, transactions);

    const totalAudioSeconds = [...costById.values()].reduce((sum, v) => sum + v.audioSeconds, 0);
    const totals = summary?.totals.cost;
    const allFailed = !(credit || summary || txList);

    const data: AiCostMetrics = {
      creditRemainingIrt: Math.round(credit?.remaining_irt ?? 0),
      totalCostToday: Math.round(
        Number(totals?.paid_irt ?? 0) + Number(totals?.paid_grant_irt ?? 0),
      ),
      totalTranscriptionMinutes: Math.round(totalAudioSeconds / 60),
      modelsUsed: summary?.by_model?.length ?? 0,
      recentTransactions: transactions.map((tx) => ({
        id: tx.id,
        model: tx.model,
        provider: tx.provider,
        inputTokens: tx.tokens.prompt,
        outputTokens: tx.tokens.completion,
        costIrt: Math.round(costById.get(tx.id)?.costIrt ?? 0),
        timestamp: new Date(tx.created_at).toLocaleString("fa-IR", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      })),
    };

    costMetricsCache = { data, fetchedAt: Date.now(), failed: allFailed };
    if (allFailed) {
      costLogger.warn("[AiCostMetrics] all User API calls failed — retrying in 30s");
    }
    return data;
  })().finally(() => {
    costMetricsInFlight = null;
  });

  return costMetricsInFlight;
}

const listSystemLogsSchema = z.object({
  level: z.enum(["info", "warn", "error", "debug"]).optional(),
  /** Free-text search across message + context (case-insensitive) */
  search: z.string().trim().max(200).optional(),
  /** Exact context/source filter (e.g. "PaymentService") */
  context: z.string().trim().max(255).optional(),
  limit: z.number().int().min(1).max(200).optional().default(50),
  offset: z.number().int().min(0).optional().default(0),
});

export function createAdminStatsRouter(db: NodePgDatabase) {
  return router({
    /**
     * Get overview KPI metrics for the admin dashboard.
     */
    getOverviewStats: adminProcedure.query(async () => {
      const productsResult = await db.execute<{ count: string } & Record<string, unknown>>(
        sql`SELECT COUNT(*)::text AS count FROM products WHERE is_active = true`,
      );
      const ordersResult = await db.execute<{ count: string } & Record<string, unknown>>(
        sql`SELECT COUNT(*)::text AS count FROM orders WHERE created_at >= CURRENT_DATE`,
      );
      const tokensResult = await db.execute<{ count: string } & Record<string, unknown>>(
        sql`SELECT COUNT(*)::text AS count FROM api_tokens WHERE (expires_at IS NULL OR expires_at > NOW())`,
      );
      const revenueResult = await db.execute<{ total: string | null } & Record<string, unknown>>(
        sql`SELECT COALESCE(SUM(total_amount::bigint), 0)::text AS total FROM orders WHERE created_at >= CURRENT_DATE AND status != 'cancelled'`,
      );

      return {
        activeProducts: Number(productsResult.rows[0]?.count ?? 0),
        ordersToday: Number(ordersResult.rows[0]?.count ?? 0),
        activeTokens: Number(tokensResult.rows[0]?.count ?? 0),
        activeVoiceSessions: 0,
        revenueToday: Number(revenueResult.rows[0]?.total ?? 0),
        onlineUsers: 0,
      };
    }),

    /**
     * List distinct log contexts (sources) for the filter dropdown.
     */
    listLogContexts: adminProcedure.query(async () => {
      const result = await db.execute<{ context: string } & Record<string, unknown>>(
        sql`SELECT DISTINCT context FROM system_logs ORDER BY context ASC LIMIT 200`,
      );
      return { contexts: result.rows.map((r) => r.context).filter(Boolean) };
    }),

    /**
     * List system logs with optional level filter, free-text search, context
     * filter, and pagination. Returns a total count for the current filter set.
     */
    listSystemLogs: adminProcedure.input(listSystemLogsSchema).query(async ({ input }) => {
      const conditions = [];
      if (input.level) conditions.push(sql`level = ${input.level}`);
      if (input.context) conditions.push(sql`context = ${input.context}`);
      if (input.search) {
        const pattern = `%${input.search}%`;
        conditions.push(sql`(message ILIKE ${pattern} OR context ILIKE ${pattern})`);
      }
      const whereClause =
        conditions.length > 0 ? sql`WHERE ${sql.join(conditions, sql` AND `)}` : sql``;

      const result = await db.execute<
        {
          id: string;
          level: string;
          context: string;
          message: string;
          metadata: Record<string, unknown> | null;
          trace_id: string | null;
          created_at: string;
        } & Record<string, unknown>
      >(
        sql`SELECT id, level, context, message, metadata, trace_id, created_at
              FROM system_logs
              ${whereClause}
              ORDER BY created_at DESC
              LIMIT ${input.limit} OFFSET ${input.offset}`,
      );

      const countResult = await db.execute<{ count: string } & Record<string, unknown>>(
        sql`SELECT COUNT(*)::text AS count FROM system_logs ${whereClause}`,
      );

      return {
        total: Number(countResult.rows[0]?.count ?? 0),
        logs: result.rows.map((r) => ({
          id: r.id,
          level: r.level,
          context: r.context,
          message: r.message,
          metadata: r.metadata,
          traceId: r.trace_id,
          createdAt: r.created_at,
        })),
      };
    }),

    /**
     * Get AvalAI cost metrics and credit balance — live data from the
     * AvalAI User API (docs/avalAi/en/api-reference/user.md), cached 60s
     * to stay well inside per-tier RPM limits.
     */
    getAiCostMetrics: adminProcedure.query(async () => {
      return fetchAvalAiCostMetrics();
    }),
  });
}
