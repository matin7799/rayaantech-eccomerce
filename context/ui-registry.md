# UI Registry

Living document. Updated after every component is built. Read this before building any new component — match existing patterns exactly before inventing new ones.

---

## How to Use

Before building any component:

1. Check if a similar component already exists here
2. If yes — match its exact classes
3. If no — build it following ui-rules.md and ui-tokens.md, then add it here

After building any component — update this file with the component name, file path, and exact classes used.

---

## Design System Tokens (Quick Reference)

| Token Class | Light | Dark |
| --- | --- | --- |
| `bg-background` | #F8FAFC | #05070F |
| `bg-surface` | #FFFFFF | #0F1420 |
| `bg-surface-secondary` | #F1F5F9 | #1E2640 |
| `bg-surface-glass` | rgba(255,255,255,0.85) | rgba(15,20,32,0.65) |
| `bg-surface-action` | rgba(5,150,105,0.08) | rgba(52,211,153,0.12) |
| `border-border` | #CBD5E1 | #334155 |
| `border-border-light` | #E2E8F0 | #1E293B |
| `text-text-primary` | #020617 | #FFFFFF |
| `text-text-secondary` | #1E293B | #E2E8F0 |
| `text-text-muted` | #475569 | #94A3B8 |
| `text-accent` / `bg-accent` | #059669 | #34D399 |
| `bg-accent-light` | #D1FAE5 | #064E3B |

**Accent:** Cool Emerald Green (#059669 light / #34D399 dark)

**Glass Pattern:** `bg-surface-glass backdrop-blur-xl border-border-light shadow-[--shadow-glass]`

**High-Opacity Glass:** `bg-surface/95 backdrop-blur-xl shadow-2xl` (MegaMenu)

**Header Glass:** `bg-surface/92 backdrop-blur-xl` (sticky header)

**Font:** "Yekan Bakh" variable font (`/public/fonts/YekanBakh-VF.woff2`), weights 400/500/600

**Theme Transition:** View Transitions API with circular clip-path reveal

---

## Components

---

### DesktopHeader (Desktop Orchestrator ≥1024px)

File: `apps/web/src/components/layout/header/DesktopHeader.tsx`
Last updated: 2026-06-21

| Property | Class |
| --- | --- |
| Outer | `sticky top-0 z-50 w-full border-b border-border bg-surface/92 backdrop-blur-xl` |
| Inner | `mx-auto flex h-16 max-w-[1440px] items-center gap-4 px-[--spacing-container-padding]` |
| Nav box | `shrink-0 rounded-xl border border-border-light bg-surface-secondary/50 shadow-md px-1.5 py-1` |
| Nav link default | `text-sm font-medium text-text-secondary rounded-lg px-3 py-1.5` |
| Nav link hover | `hover:bg-surface-action hover:text-accent` |
| Nav link active | `text-accent bg-surface-action` |
| Search wrapper | `min-w-0 flex-1` (fills remaining space) |
| Action buttons | `shrink-0 gap-2.5` (cart, theme, profile grouped end/left) |
| Action button | `h-9 w-9 rounded-xl border border-border-light bg-surface shadow-sm hover:shadow-md hover:border-accent hover:text-accent` |
| MegaMenu position | Absolute overlay below header, centered, 80vw wide (doesn't push content) |

**Nav links:** صفحه اصلی, محصولات, جدول محصولات, اقساط, مجله, درباره ما + دسته‌بندی trigger

**Pattern notes:**
MegaMenu renders below the header bar within the sticky container — constrained to the same max-w-1440 as the header content. No more absolute full-width. Action buttons and nav use `shrink-0` to prevent layout shift when MegaMenu opens.

---

### MegaMenu (Tabbed Dual-Pane Category Browser)

File: `apps/web/src/components/layout/header/MegaMenu.tsx`
Last updated: 2026-06-21

| Property | Class |
| --- | --- |
| Panel | `w-[80vw] bg-surface/95 backdrop-blur-xl border border-border-light rounded-2xl shadow-2xl` |
| Position | Absolute overlay centered below header (`absolute inset-x-0 top-full flex justify-center pt-2`) |
| Decorative line | `bg-gradient-to-l from-transparent via-accent to-transparent opacity-50` |
| Category sidebar | `w-52 border-e border-border-light` |
| Active category | `bg-surface-action text-accent shadow-sm rounded-xl` |
| Active indicator | `w-[3px] bg-accent rounded-full` (layoutId) |
| Tab switcher | `rounded-lg border border-border-light bg-surface-secondary/50 p-0.5` |
| Active tab | `bg-surface text-accent shadow-sm rounded-md` |
| Brand chip | `border border-border-light rounded-lg hover:border-accent hover:text-accent` |
| Price card | `border border-border-light bg-surface-secondary/30 rounded-xl hover:border-accent hover:bg-surface-action` |
| Spring | stiffness: 280, damping: 22 |

**Categories:** لپ‌تاپ, موبایل, کنسول بازی, آل‌این‌وان, پرینتر, کیس, مانیتور

**Tab panels:** همه | زیرمجموعه | برند | قیمت

**Pattern notes:**
MegaMenu is an absolute overlay (doesn't push content). Width is 80vw, centered horizontally below the header with a small gap (pt-2). Full rounded-2xl corners since it's a floating panel. High-opacity glass with heavy shadow for clear elevation.

---

### MobileTopBar (Mobile Header <1024px)

File: `apps/web/src/components/layout/header/MobileTopBar.tsx`
Last updated: 2026-06-21

| Property | Class |
| --- | --- |
| Position | `sticky top-0 z-50 lg:hidden` |
| Background | `bg-surface border-b border-border` |
| Height | `h-14` |
| Logo | `logo-icon.svg h-7 w-7` |
| Search | `bg-surface-secondary border border-border rounded-xl focus-within:border-accent` |
| Dropdown hover | `hover:bg-surface-action` |

---

### MobileBottomNav (Floating Bottom Tab Bar <1024px)

File: `apps/web/src/components/layout/header/MobileBottomNav.tsx`
Last updated: 2026-06-21

| Property | Class |
| --- | --- |
| Position | `fixed inset-x-0 bottom-0 z-50 lg:hidden` |
| Background | `bg-surface/95 backdrop-blur-xl border-t border-border` |
| Safe area | `pb-[env(safe-area-inset-bottom)]` |
| Bar height | `h-[72px]` |
| Active icon pill | `h-12 w-12 rounded-2xl bg-accent shadow-lg shadow-accent/30` |
| Active icon pop | `y: -14, scale: 0.4→1` (stiffness: 500, damping: 24) |
| Active icon color | `text-white` |
| Inactive icon | `h-5 w-5 text-text-muted` in `h-10 w-10` container |
| Active label | animated `color: var(--color-accent), fontWeight: 600` |
| Tab tap | `whileTap={{ scale: 0.93 }}` |

**Tabs:** محصولات, علاقه‌مندی, خانه, سبد, پروفایل

**Pattern notes:**
Active tab pops UP above the bar as a large green pill with glow shadow. The pill floats 14px above the nav bar creating a distinctive "floating bubble" effect. AnimatePresence mode="wait" for smooth transitions between tabs.

---

### ThemeToggle (Dark/Light Switch)

File: `apps/web/src/components/layout/header/ThemeToggle.tsx`
Last updated: 2026-06-21

| Property | Class |
| --- | --- |
| Size | `h-9 w-9 rounded-xl` |
| Border | `border border-border-light` |
| Shadow | `shadow-sm hover:shadow-md` |
| Hover | `hover:border-accent hover:text-accent` |
| Icon animation | 180deg rotation spring (260/20) |
| Page animation | View Transitions circular clip-path (500ms) |

---

### CartDropdown (Hover Mini Cart)

File: `apps/web/src/components/layout/header/CartDropdown.tsx`
Last updated: 2026-06-21

| Property | Class |
| --- | --- |
| Trigger | `h-9 w-9 rounded-xl border border-border-light shadow-sm hover:shadow-md hover:border-accent` |
| Badge | `bg-accent text-white text-[10px] rounded-full h-4 w-4` |
| Dropdown | `bg-surface-glass backdrop-blur-xl border-border-light shadow-[--shadow-glass] rounded-xl w-80` |

---

### PredictiveSearchBar (Inline Search)

File: `apps/web/src/components/layout/header/PredictiveSearchBar.tsx`
Last updated: 2026-06-21

| Property | Class |
| --- | --- |
| Container | `relative w-full` (fills flex-1 parent) |
| Input | `bg-surface-secondary border border-border rounded-xl focus-within:border-accent` |
| Dropdown | `bg-surface-glass backdrop-blur-xl border-border-light shadow-[--shadow-glass] rounded-xl` |
| Item hover | `hover:bg-surface-action` |

---

### FooterShell + SocialGrid + TrustBadges

File: `apps/web/src/components/layout/footer/`
Last updated: 2026-06-21

| Property | Class |
| --- | --- |
| Footer bg | `bg-surface border-t border-border` |
| Contact card | `rounded-2xl border border-border p-5 hover:border-accent/30 hover:shadow-md` |
| Social icon | `h-9 w-9 rounded-full [brand-color] shadow-sm hover:shadow-md` |
| Trust badge | `h-[72px] w-[72px] rounded-2xl border-border-light bg-surface-secondary hover:border-accent hover:shadow-md` |

---

### NotFound (404 Page)

File: `apps/web/src/routes/__root.tsx` (inline)
Last updated: 2026-06-21

| Property | Class |
| --- | --- |
| Number | `text-6xl font-bold text-accent` |
| CTA | `rounded-xl bg-accent px-6 py-2.5 text-sm font-medium text-white hover:bg-accent/90` |

---

## Interaction Patterns (Global)

| Pattern | Value |
| --- | --- |
| Primary CTA tap | `whileTap={{ scale: 0.85 }}` |
| Icon/badge tap | `whileTap={{ scale: 0.85 }}` |
| Action icon hover | `whileHover={{ scale: 1.1 }}` |
| Mobile tab tap | `whileTap={{ scale: 0.93 }}` |
| Card hover lift | `whileHover={{ y: -4, scale: 1.02 }}` |
| Standard spring | `{ type: "spring", stiffness: 300, damping: 20 }` |
| MegaMenu spring | `{ stiffness: 280, damping: 22 }` |
| Pop-out spring | `{ stiffness: 500, damping: 24 }` |
| Content spring | `{ stiffness: 350, damping: 30 }` |
| QuickView entry | `initial={{ opacity: 0, scale: 0.96 }}` → `animate={{ opacity: 1, scale: 1 }}` |
| Dropdown entry | `initial={{ opacity: 0, y: -4 }}` → `animate={{ opacity: 1, y: 0 }}` |
| Color transition | `transition-colors duration-300 ease-in-out` |
| All transitions | `transition-all duration-300 ease-in-out` |
| Active nav | `text-accent bg-surface-action` |
| Hover | `hover:bg-surface-action hover:text-accent` |
| Action buttons | `border-border-light shadow-sm hover:shadow-md hover:border-accent` |

---

## Spacing Conventions

| Context | Value |
| --- | --- |
| Page max width | `max-w-[1440px]` |
| Container padding | `px-[--spacing-container-padding]` (32px) |
| Section gap | `gap-[--spacing-layout-gap]` (24px) |
| Action button gap | `gap-2.5` |
| Nav box gap | `gap-0.5` |
| Button sizing | `h-9 w-9` |
| Active mobile pill | `h-12 w-12` |
| Icon sizing | `h-4 w-4` (desktop), `h-5 w-5` (mobile) |
| Border radius | `rounded-xl` (buttons/panels), `rounded-2xl` (mega menu bottom, mobile pill, cards) |


---

### ProductCard (Multi-Variant Luxury Card)

File: `apps/web/src/components/storefront/product/ProductCard.tsx`
Last updated: 2026-06-24

**Props:** `variant: 'compact' | 'glass' | 'extended'` (default: `'glass'`)

| Property | Class |
| --- | --- |
| Background | `bg-surface/70 backdrop-blur-md` |
| Border | `border border-[--glass-border]` |
| Border radius | `rounded-2xl` |
| Text — title (glass/extended) | `text-xs font-semibold text-text-primary sm:text-sm line-clamp-2` |
| Text — title (compact) | `text-[11px] font-semibold text-text-primary line-clamp-1` |
| Text — price | `text-sm font-bold text-text-primary` (compact: `text-xs`) |
| Text — muted | `text-[10px] text-text-muted` |
| Spacing | `p-3` (glass/extended content), `p-2.5` (compact) |
| Hover state | `hover:shadow-lg` + `whileHover={{ y: -4, scale: 1.02 }}` |
| Shadow | Via hover only |
| Accent usage | Grade badge `bg-accent/10 text-accent`, Cart button `bg-accent text-white` |
| OOS treatment | `opacity-60 grayscale` on wrapper, overlay `bg-surface/60 backdrop-blur-[2px]` |
| Action icons | `h-7 w-7 rounded-lg border-[--glass-border] bg-[--glass-backdrop] backdrop-blur-md` |
| Action visibility | `opacity-0 group-hover:opacity-100 transition-all` |
| Action hover | `whileHover={{ scale: 1.1 }}` |
| Cart button | Circular `rounded-full h-8 w-8` (compact: `h-7 w-7`) |
| Tap feedback | `whileTap={{ scale: 0.85 }}` on all interactive elements |
| Card spring | `{ type: "spring", stiffness: 300, damping: 20 }` |

**Variant differences:**
- `compact`: horizontal flex layout, `h-24 w-24` image, inline grade text, no badge overlay
- `glass`: vertical flex, `aspect-square` image, absolute grade badge, full content area
- `extended`: same as glass + extra description/attribute snippet below title

**Pattern notes:**
All variants share ActionButton (Eye + Heart), circular Add to Cart, and PriceDisplay sub-components. Bottom row always: price left-aligned, cart icon right-aligned. Action cluster appears on group-hover with transition-all. Consistent spring config across all interactions.

---

### QuickView (Two-Column Product Preview Dialog)

File: `apps/web/src/components/storefront/product/QuickView.tsx`
Last updated: 2026-06-24

| Property | Class |
| --- | --- |
| Position | `fixed inset-0 z-50 flex items-center justify-center p-4` |
| Backdrop | `fixed inset-0 z-50 bg-black/60 backdrop-blur-sm` |
| Modal container | `w-full max-w-[1200px] min-h-[600px] rounded-2xl` |
| Background | `bg-[--glass-backdrop] backdrop-blur-xl` |
| Border | `border border-[--glass-border]` |
| Shadow | `shadow-[--shadow-glass]` |
| Layout | `grid grid-cols-1 md:grid-cols-5` (3/5 image + 2/5 details) |
| Left panel | `bg-surface-secondary p-10 md:col-span-3` |
| Right panel | `p-6 gap-4 md:col-span-2 overflow-y-auto` |
| Title | `text-lg font-bold text-text-primary leading-snug` |
| Price | `text-2xl font-bold text-text-primary` |
| Attributes | `grid grid-cols-2 gap-1.5`, cards: `border border-border-light bg-surface-secondary/50 rounded-lg` |
| CTA | `rounded-xl bg-accent text-white py-3.5 font-semibold shadow-md` |
| CTA tap | `whileTap={{ scale: 0.85 }}` |
| Entry animation | `initial={{ opacity: 0, scale: 0.95, y: 10 }}` → `animate={{ opacity: 1, scale: 1, y: 0 }}` |
| Panel spring | `{ type: "spring", stiffness: 300, damping: 20 }` |

**Anti-jank:** Uses custom fixed overlay (not Dialog primitives) to prevent parent layout influence. min-h-[600px] prevents content collapse during fetch.

**Data-fetching pattern:**
```tsx
trpc.products.bySlug.useQuery({ slug }, { enabled: open && !!slug, staleTime: 30_000 })
```

---

### PriceInput (Currency InputGroup)

File: `apps/web/src/components/ui/PriceInput.tsx`
Last updated: 2026-06-24

| Property | Class |
| --- | --- |
| Container height | `h-10` (consistent with Input registry) |
| Border | `border border-[--glass-border]` |
| Background | `bg-surface-secondary` |
| Border radius | `rounded-lg` |
| Focus state | `focus-within:ring-1 focus-within:ring-accent focus-within:border-accent` |
| Error state | `border-danger ring-1 ring-danger/30` |
| Input text | `text-sm font-medium text-text-primary text-start` |
| Input direction | `dir="ltr"` (numeric cursor correctness in RTL) |
| Placeholder | `placeholder:text-text-muted` (Persian digits via toPersianDigits) |
| Suffix container | `border-s border-[--glass-border] bg-surface-secondary/50 px-3` |
| Suffix text | `text-[11px] font-medium text-text-muted` |
| Label | `text-[11px] font-medium text-text-secondary` |
| Error text | `text-[10px] font-medium text-danger` |
| Disabled | `pointer-events-none opacity-50` |

**Props:** `value: number`, `onChange: (v: number) => void`, `label?`, `suffix?`, `placeholder?`, `error?`, `disabled?`

**Technical patterns:**
- Validation: `z.number().int().min(0)` via zod safeParse
- Formatting: `Intl.NumberFormat("fa-IR")` for thousand separators
- Input handling: `stripNonDigits()` normalizes Persian/Arabic/Western → integer
- RTL: Container is RTL (inherits), input is `dir="ltr"` for correct numeric cursor
- Sync: External value changes sync display via ref comparison (no useEffect)
- Font: Inherits `--font-sans` (Yekan Bakh) from theme

---

### SmartSearch (Async Autocomplete)

File: `apps/web/src/components/storefront/SmartSearch.tsx`
Last updated: 2026-06-24

| Property | Class |
| --- | --- |
| Input container | `border border-[--glass-border] bg-[--glass-backdrop] backdrop-blur-md rounded-xl px-3 py-2` |
| Input text | `text-sm text-text-primary placeholder:text-text-muted bg-transparent` |
| Dropdown | `border border-[--glass-border] bg-[--glass-backdrop] backdrop-blur-xl shadow-[--shadow-glass] rounded-xl` |
| Result item | `px-3 py-2.5 rounded-lg hover:bg-surface-secondary` |
| Result text | `text-xs font-medium text-text-primary` |
| Result price | `text-[11px] text-text-muted` |
| Animation | `initial={{ opacity: 0, y: -4 }}` → `animate={{ opacity: 1, y: 0 }}` (150ms) |

**Pattern notes:**
300ms debounce. Max 8 results via ScrollArea. Closes on outside click or Escape. Uses glassmorphism tokens consistently with filter sidebar and sort bar.

---

### ProductGrid (Zero-Jank Listing Container)

File: `apps/web/src/components/storefront/product/ProductGrid.tsx`
Last updated: 2026-06-24

| Property | Class |
| --- | --- |
| Grid container | `grid min-h-[900px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3` |
| Fetching state | `opacity-40 pointer-events-none transition-opacity duration-200` |
| Normal state | `transition-opacity duration-200` (only opacity transitions — no height/width) |
| Skeleton card border | `border border-[--glass-border] bg-surface/70 rounded-2xl` |
| Skeleton image | `aspect-square animate-pulse bg-surface-secondary` |
| Skeleton content | `p-3 gap-2`, bars: `animate-pulse rounded bg-surface-secondary` |
| Skeleton price row | `h-4 w-20` (price) + `h-8 w-8 rounded-full` (cart button) |
| Card entrance | `initial={{ opacity: 0, y: 16 }}` → `whileInView={{ opacity: 1, y: 0 }}` |
| Stagger delay | `Math.min(index * 0.04, 0.5)`, duration: 0.35s |

**Anti-jank rules:**
- `min-h-[900px]` on ALL grid states (loading, empty, loaded) prevents container collapse
- Only `transition-opacity` on the grid — NO height/width/transform transitions
- `ProductCardSkeleton` matches exact card structure (aspect-square + p-3 + price row + circular button)
- Filter changes: existing items fade to 40% opacity, no unmount/remount

---

### ProductFiltersSidebar (Multi-Select Faceted Panel)

File: `apps/web/src/components/storefront/product/ProductFiltersSidebar.tsx`
Last updated: 2026-06-24

| Property | Class |
| --- | --- |
| Position | `sticky top-[calc(var(--header-height,5rem)+1rem)] z-30` |
| Max height | `max-h-[calc(100vh-7rem)] overflow-y-auto` |
| Section panel | `border border-[--glass-border] bg-[--glass-backdrop] backdrop-blur-md shadow-[--shadow-glass] rounded-xl p-3` |
| Section title | `text-xs font-semibold text-text-primary` |
| Filter chip default | `border border-[--glass-border] bg-[--glass-backdrop] backdrop-blur-sm text-text-secondary rounded-lg px-2.5 py-1 text-[11px]` |
| Filter chip active | `bg-accent text-white shadow-sm` |
| Filter chip hover | `hover:border-accent/50 hover:text-accent` |
| Category node active | `bg-accent/10 text-accent` |
| Category node hover | `hover:bg-surface-secondary hover:text-text-primary` |
| ScrollArea per section | `max-h-48` (categories), `max-h-40` (brands), `max-h-36` (others) |
| Checkbox accent | `accent-[var(--color-accent)]` |

**Pattern notes:**
Multi-select via comma-separated URL params. Uses `toggleFilterValue()` helper for category/brand. Each section wraps its content in ScrollArea for bounded overflow. Glassmorphism applied uniformly to all section panels.

---

### MobileFilterDrawer (Bottom Sheet)

File: `apps/web/src/components/storefront/product/MobileFilterDrawer.tsx`
Last updated: 2026-06-24

| Property | Class |
| --- | --- |
| Trigger position | `fixed bottom-6 left-1/2 -translate-x-1/2 z-40 lg:hidden` |
| Trigger style | `border border-[--glass-border] bg-[--glass-backdrop] backdrop-blur-md shadow-[--shadow-glass] rounded-full px-5 py-3` |
| Trigger text | `text-sm font-semibold text-text-primary` |
| Sheet container | `max-h-[85vh] rounded-t-2xl border-t border-[--glass-border] bg-[--glass-backdrop] backdrop-blur-xl` |
| Drag handle | `mx-auto h-1 w-10 rounded-full bg-border` |
| Auto-close | On filter change via useEffect on filterKey |

**Pattern notes:**
Floating pill button centered at bottom. Only visible below `lg` breakpoint. Contains full ProductFiltersSidebar with 1:1 parity. Auto-closes after any filter interaction to reduce friction.

---

### ProductSortBar (Segmented Sort Control)

File: `apps/web/src/components/storefront/product/ProductSortBar.tsx`
Last updated: 2026-06-24

| Property | Class |
| --- | --- |
| Container | `border border-[--glass-border] bg-[--glass-backdrop] backdrop-blur-md shadow-[--shadow-glass] rounded-xl px-4 py-2.5` |
| Segmented group | `border border-[--glass-border] bg-surface-secondary/50 rounded-lg p-0.5` |
| Active segment | `bg-surface text-accent shadow-sm rounded-md` |
| Inactive segment | `text-text-muted hover:text-text-secondary` |
| Segment size | `px-3 py-1.5 text-xs font-medium` |
| Cache behavior | Removes all `products.list` queries on sort change |

**Pattern notes:**
Cache Cleanse pattern: on sort change, invalidates all product list queries so fresh data loads in correct order, then smooth-scrolls to top.

---

## Filter Utilities Pattern

File: `apps/web/src/lib/filter-utils.ts`

| Function | Purpose |
| --- | --- |
| `parseFilterString(str)` | Split comma-separated string → string[] |
| `toggleFilterValue(current, value)` | Add/remove value from comma string, returns undefined if empty |
| `isFilterActive(current, value)` | Check if value exists in comma string |

**URL Format:** `?category=laptop,mobile&brand=apple,samsung&grade=stock&attrs=uuid1,uuid2`

All multi-select filters use comma-separated strings. Single source of truth is the URL search params via TanStack Router.
