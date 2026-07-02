import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CalendarDays, Clock, MessageCircle, Sparkles } from "lucide-react";
import { useCallback, useState } from "react";
import { useAIConsultantStore } from "../../../lib/store";
import { trpc } from "../../../lib/trpc";
import { cn } from "../../../lib/utils";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Separator } from "../../ui/separator";
import { Skeleton } from "../../ui/skeleton";

// ─── Types ───────────────────────────────────────────────────────────────────

interface SessionItem {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface MessageItem {
  id: string;
  role: "user" | "assistant";
  messageType: string;
  content: string;
  createdAt: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHr = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMin < 1) return "همین الان";
  if (diffMin < 60) return `${diffMin} دقیقه پیش`;
  if (diffHr < 24) return `${diffHr} ساعت پیش`;
  if (diffDays < 7) return `${diffDays} روز پیش`;
  return date.toLocaleDateString("fa-IR");
}

function formatFullDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Skeletons ───────────────────────────────────────────────────────────────

function SessionListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border p-4">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      ))}
    </div>
  );
}

function MessageSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className={cn("flex", i % 2 === 0 ? "justify-end" : "justify-start")}>
          <Skeleton className={cn("h-10 rounded-2xl", i % 2 === 0 ? "w-2/3" : "w-3/4")} />
        </div>
      ))}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function ChatHistoryTab() {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const sessionsQuery = trpc.ai.getHistoricalSessions.useQuery(undefined, {
    staleTime: 30_000,
    retry: false,
  });

  const messagesQuery = trpc.ai.getSessionMessageChain.useQuery(
    { sessionId: activeSessionId ?? "" },
    { enabled: !!activeSessionId, staleTime: 60_000 },
  );

  const handleSelectSession = useCallback((id: string) => {
    setActiveSessionId(id);
  }, []);

  const handleBack = useCallback(() => {
    setActiveSessionId(null);
  }, []);

  const setSession = useAIConsultantStore((s) => s.setSession);
  const setIsOpen = useAIConsultantStore((s) => s.setIsOpen);

  const handleContinueChat = useCallback(() => {
    if (!activeSessionId) return;
    const msgs = messagesQuery.data?.messages ?? [];
    const activeSession = (sessionsQuery.data?.sessions ?? []).find(
      (s) => s.id === activeSessionId,
    );
    setSession(
      activeSessionId,
      activeSession?.title ?? null,
      msgs.map((m) => ({ role: m.role, content: m.content })),
    );
    setIsOpen(true);
  }, [activeSessionId, messagesQuery.data, sessionsQuery.data, setSession, setIsOpen]);

  const sessions: SessionItem[] = sessionsQuery.data?.sessions ?? [];
  const messages: MessageItem[] = messagesQuery.data?.messages ?? [];
  const activeSession = sessions.find((s) => s.id === activeSessionId);

  // ─── Mobile: Thread View ───
  if (activeSessionId) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="thread"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 8 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={handleBack} data-icon="inline-start">
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
              بازگشت
            </Button>
            {activeSession && (
              <Badge variant="secondary" className="text-[10px]">
                {formatRelativeDate(activeSession.updatedAt)}
              </Badge>
            )}
          </div>

          {/* Session Title */}
          {activeSession && (
            <div className="flex items-center gap-2 px-1">
              <Sparkles className="h-4 w-4 text-accent shrink-0" />
              <h3 className="text-sm font-semibold text-card-foreground line-clamp-1">
                {activeSession.title}
              </h3>
            </div>
          )}

          <Separator />

          {/* Messages */}
          <Card>
            <CardContent className="p-0">
              {messagesQuery.isLoading ? (
                <MessageSkeleton />
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-12">
                  <MessageCircle className="h-8 w-8 text-muted-foreground/30" />
                  <p className="text-xs text-muted-foreground">هنوز پیامی در این گفتگو نیست</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2.5 p-4 max-h-[360px] overflow-y-auto">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed",
                          msg.role === "user"
                            ? "bg-accent text-white rounded-ee-md"
                            : "border border-border bg-surface-secondary text-card-foreground rounded-es-md",
                        )}
                      >
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Continue CTA */}
          <Button onClick={handleContinueChat} className="w-full gap-2" size="lg">
            <Sparkles className="h-4 w-4" />
            ادامه گفتگو
          </Button>
        </motion.div>
      </AnimatePresence>
    );
  }

  // ─── Session List View ───
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="list"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col gap-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-accent" />
            <h2 className="text-base font-semibold text-card-foreground">تاریخچه مشاوره‌ها</h2>
          </div>
          <Badge variant="outline" className="text-[10px]">
            {sessions.length} گفتگو
          </Badge>
        </div>

        <Separator />

        {/* Session Cards */}
        {sessionsQuery.isLoading ? (
          <SessionListSkeleton />
        ) : sessions.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-4 py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                <MessageCircle className="h-7 w-7 text-accent/60" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium text-card-foreground">هنوز گفتگویی ثبت نشده</p>
                <p className="text-xs text-muted-foreground mt-1">
                  با مشاور هوشمند رایان‌تک گفتگو کنید تا تاریخچه اینجا نمایش داده شود
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {sessions.map((session, idx) => (
              <motion.button
                key={session.id}
                type="button"
                onClick={() => handleSelectSession(session.id)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                whileTap={{ scale: 0.98 }}
                className="group flex items-start gap-3 rounded-xl border border-border bg-surface-secondary/30 p-4 text-start transition-all hover:border-accent/40 hover:bg-surface-secondary/60 hover:shadow-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 transition-colors group-hover:bg-accent/20">
                  <Sparkles className="h-4 w-4 text-accent" />
                </div>
                <div className="flex flex-1 flex-col gap-1 overflow-hidden">
                  <span className="text-sm font-medium text-card-foreground line-clamp-1 group-hover:text-accent transition-colors">
                    {session.title}
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatRelativeDate(session.updatedAt)}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <CalendarDays className="h-3 w-3" />
                      {formatFullDate(session.createdAt)}
                    </span>
                  </div>
                </div>
                <ArrowLeft className="h-4 w-4 text-muted-foreground/40 shrink-0 rtl:rotate-180 transition-colors group-hover:text-accent" />
              </motion.button>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
