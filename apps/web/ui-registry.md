# UI Registry — Rayan Tech E-Commerce

Consistency reference for all UI components. Read this before building any new component.

## Baseline — Established 2026-06-28

| Property | Correct Pattern |
| --- | --- |
| Page container | `mx-auto max-w-[1440px] p-4 sm:p-6 lg:p-8` |
| Card component | shadcn `<Card>` with `<CardHeader>` / `<CardContent>` |
| Card spacing | Uses `--card-spacing` via shadcn internals (no manual `p-*`) |
| Tab navigation | shadcn `<Tabs>` + `<TabsList variant="line">` + `<TabsTrigger>` |
| Tab icons | `data-icon="inline-start"` on lucide icons inside TabsTrigger |
| Badge / status | shadcn `<Badge variant="secondary|default|outline">` |
| Avatar | shadcn `<Avatar size="lg">` + `<AvatarFallback>` (always include fallback) |
| Loading state | shadcn `<Skeleton>` — never manual `animate-pulse` divs |
| Dividers | shadcn `<Separator>` — never `<hr>` or `border-t` divs |
| Buttons | shadcn `<Button variant="" size="">` with `data-icon` for icons |
| Toast/feedback | `sonner` via `toast()` — never custom notification UI |
| Spacing between sections | `flex flex-col gap-6` (page sections), `gap-4` (within cards) |
| Text — primary | `text-card-foreground` (inside Card) or `text-foreground` (outside) |
| Text — muted | `text-muted-foreground` — never `text-gray-*` |
| Destructive actions | `text-destructive` + `hover:bg-destructive/10` — never raw red classes |

---

## Profile Dashboard

File: `apps/web/src/routes/profile/route.tsx`
Last updated: 2026-06-28

| Property | Class / Pattern |
| --- | --- |
| Layout | `mx-auto max-w-[1440px] flex flex-col gap-6 p-4 sm:p-6 lg:p-8` |
| Card usage | shadcn `<Card>` with proper `CardHeader`/`CardContent` composition |
| Avatar | `<Avatar size="lg">` with 2-char `<AvatarFallback>` |
| Role indicator | `<Badge variant>` mapped from user role enum |
| Tab system | `<Tabs>` controlled by Zustand store, `<TabsList variant="line">` |
| Tab transitions | Framer Motion `AnimatePresence mode="wait"` with y:8 enter / y:-8 exit |
| Page entrance | `initial={{ opacity: 0, y: 16 }}` with ease `[0.22, 1, 0.36, 1]` |
| Skeleton loading | Full-page `<DashboardSkeleton>` using `<Card>` + `<Skeleton>` composition |
| Logout | `<Button variant="ghost" size="sm">` with destructive text color |
| Separator | Between tab list and content: `<Separator className="my-4">` |
| Auth guard | Client-side: check `useSession()`, show Skeleton during resolution, redirect if unauthed |

**Pattern notes:**
- Tabs use `onValueChange` controlled mode synced with `useDashboardStore`
- Icons always use `data-icon="inline-start"` per shadcn conventions
- No raw Tailwind color classes — all via semantic tokens (`destructive`, `muted-foreground`, etc.)
- Avatar hover uses Framer Motion spring: `stiffness: 400, damping: 20`
- Badge entrance uses `delay: 0.2` for staggered reveal feel

---

## Animation Standards

| Context | Pattern |
| --- | --- |
| Page entrance | `opacity: 0→1, y: 16→0`, duration `0.5s`, ease `[0.22, 1, 0.36, 1]` |
| Tab content swap | `opacity: 0→1, y: 8→0` enter, `y: -8` exit, duration `0.25s` |
| Interactive hover (avatar, cards) | `whileHover={{ scale: 1.05 }}`, spring `stiffness: 400, damping: 20` |
| Badge/element stagger | `delay: 0.2` on secondary elements |
| Logout/destructive transitions | `300ms` timeout before navigation |

---

## Color Token Mapping

| Semantic Need | Use This | NOT This |
| --- | --- | --- |
| Success states | `bg-success-light text-success` | `bg-emerald-*`, `text-green-*` |
| Error/danger | `text-destructive`, `bg-destructive/10` | `text-red-*`, `bg-danger` |
| Warning | `bg-warning-light text-warning` | `text-amber-*` |
| Muted/secondary text | `text-muted-foreground` | `text-gray-*`, `text-text-muted` |
| Card backgrounds | shadcn `<Card>` (uses `bg-card`) | manual `bg-surface`, `bg-[--glass-backdrop]` |
| Borders | Via `<Card>` ring or `<Separator>` | manual `border-border`, `border-[--glass-border]` |

---

## AI Consultation Console

File: `apps/web/src/components/ai/ai-console.tsx`
Last updated: 2026-06-29

| Property | Class / Pattern |
| --- | --- |
| Panel container | `fixed inset-e-5 bottom-20 md:bottom-6 z-50 h-[520px] w-[380px] rounded-2xl` |
| Panel background | `bg-surface/60 backdrop-blur-xl border border-[--glass-border] shadow-[--shadow-glass]` |
| Panel entry animation | Framer Motion spring: `stiffness: 300, damping: 25`, `y: 24, scale: 0.94` |
| Header | `border-b border-border px-4 py-3` — solid border, no glass variable |
| Tab switcher | Custom buttons (not shadcn Tabs) — `text-[11px] font-medium`, active: `text-accent border-b-2 border-accent bg-surface-secondary/60` |
| User bubble | `bg-accent text-white rounded-2xl rounded-ee-md px-3.5 py-2.5 text-xs` |
| Assistant bubble | `bg-surface-secondary text-text-primary border border-border rounded-2xl rounded-es-md px-3.5 py-2.5 text-xs` |
| Bubble entrance | `opacity: 0→1, y: 6→0, scale: 0.96→1`, duration `0.2s`, easeOut |
| Input field | `bg-surface-secondary border border-border rounded-xl px-3.5 py-2.5 text-xs` |
| Input focus | `focus:ring-1 focus:ring-accent` |
| Send button | `bg-accent text-white rounded-xl h-9 w-9`, hover glow: `shadow-[0_0_12px_var(--color-accent)]` |
| Send tap | `whileTap={{ scale: 0.92 }}` |
| Product card | `border border-border bg-surface-secondary rounded-xl px-3 py-2` |
| Product card hover | `hover:border-accent/30 hover:shadow-sm` |
| Product icon wrapper | `rounded-lg bg-accent/10 h-8 w-8` |
| Product text | Name: `text-[11px] font-medium text-text-primary`, Price: `text-[10px] text-text-muted` |
| Stock indicator | In-stock: `text-success`, Out-of-stock: `text-danger` — both `text-[10px] font-medium` |
| FAB trigger | `fixed bottom-24 md:bottom-6 inset-e-5 rounded-full h-14 w-14 bg-accent text-white shadow-lg` |
| FAB tap | `whileTap={{ scale: 0.95 }}` |
| FAB entry | Spring: `stiffness: 300, damping: 25`, `scale: 0→1` |
| Pulse animation | `scale: [1, 1.06, 1], opacity: [0.8, 1, 0.8]`, duration: 2s, infinite, easeInOut |
| Streaming dots | 3× `h-1.5 w-1.5 rounded-full bg-accent` with opacity pulse `[0.4, 1, 0.4]` |
| Loading badge text | `text-[10px] text-text-muted` |
| Close button | `rounded-lg p-1.5 text-text-muted hover:bg-surface-secondary hover:text-text-primary` |
| Empty state icon | `h-14 w-14 rounded-full bg-accent/10` with pulse ring |
| RTL enforcement | `dir="rtl"` on panel root |
| Voice tab (placeholder) | Concentric pulse rings: `border-accent/15`, `border-accent/25`, `bg-accent/10` |

**Pattern notes:**
- This component uses `bg-surface/60 backdrop-blur-xl` instead of shadcn `<Card>` because it's a floating overlay needing visual separation from page content while preserving glass depth.
- Borders use `border-border` (semantic) — not `border-[--glass-border]` — for all internal dividers (header, tabs, input). Only the outer panel shell uses `border-[--glass-border]` for the glassmorphism edge.
- Text sizing follows a micro-scale for the compact widget: `text-xs` (body), `text-[11px]` (product names), `text-[10px]` (meta/labels).
- The component avoids shadcn `<Tabs>` because the compact widget needs inline button-style tab triggers without the full TabsList chrome.
- Spring physics: `stiffness: 300, damping: 25` is the AI console standard. Profile uses `stiffness: 400, damping: 20` for snappier interactions. Both are valid — the AI console intentionally uses softer springs for a calmer, conversational feel.
- `inset-e-5` (logical property) handles RTL positioning — never `right-5`.
- The streaming dots pattern (`h-1.5 w-1.5 rounded-full bg-accent`) is reusable for any AI-loading indicator.
