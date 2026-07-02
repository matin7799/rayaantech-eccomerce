## 📄 `ui-rules.md` (Fully Expanded with Light & Dark Invariants)

```markdown
# UI Rules — Rayan Tech E-Commerce Platform

This document serves as the absolute single source of truth for visual consistency, user experience invariants, micro-interaction behaviors, and cross-theme adaptations across the localized Rayan Tech storefront (`apps/web/`) and Admin Control Panel. Every interface component must structurally conform to these strict architectural guidelines to maximize core web vitals and eliminate presentation drift.

---

## 1. RTL Invariants & Logical Alignment (shadcn/ui Master Rules)

### 1.1 Document Core Directionality
- The global application framework must enforce `dir="rtl"` explicitly injected at the server rendering tier (`<html>` node).
- Layout grids, directional flow sequences, and absolute spatial vectors must evaluate from right-to-left.

### 1.2 Absolute Elimination of Static Properties
- **Strict Prohibition:** Utilizing directional CSS properties or explicit left/right utility classes (`ml-*`, `mr-*`, `pl-*`, `pr-*`, `left-*`, `right-*`, `rounded-l-*`, `rounded-r-*`) is strictly banned under all deployment circumstances.
- **Enforced Architecture:** All padding, margins, absolute positions, and border radii must map through Tailwind CSS v4 logical properties to guarantee native `shadcn/ui` primitive compliance without template code manipulation:
  - `ps-*` (padding-inline-start) / `pe-*` (padding-inline-end)
  - `ms-*` (margin-inline-start) / `me-*` (margin-inline-end)
  - `start-*` (absolute position start) / `end-*` (absolute position end)
  - `rounded-s-*` (border-start-radius) / `rounded-e-*` (border-end-radius)
- **Icon Flips:** Functional linear arrows, navigation chevrons, and direction-bound vectors must declare the `rtl:rotate-180` micro-utility to accurately align with local cognitive expectations.

---

## 2. Local Font Architecture & Typography Hierarchy

### 2.1 Yekan Bakh Asset Strategy
- The application suite must rely exclusively on **Yekan Bakh** as its primary typeface. Font assets are bundled locally inside `apps/web/public/fonts/` to minimize remote handshake roundtrips.
- **Core Web Vitals Invariant:** To eliminate layout jumps and preserve Cumulative Layout Shift (CLS) budgets, all `@font-face` definitions must execute with `font-display: swap`. Fallback configurations are forbidden.
- The font scale must bind directly to the `--font-sans` variable token compile target inside Tailwind v4.

### 2.2 Typography Scale Matrix
The layout engine enforces four sequential typographic limits. Arbitrary sizing additions are rejected by design:

| Target Application | Sizing Token | Weight Token | Line Height | Color Variable |
| :--- | :--- | :--- | :--- | :--- |
| **Big Dashboard Metrics** | `30px` | `600` (Bold) | `36px` | `text-text-primary` |
| **Section Titles / Card Titles** | `16px` | `600` (Demibold) | `24px` | `text-text-primary` |
| **Primary Text / Descriptions / Prices** | `14px` | `500` (Medium) | `20px` | `text-text-primary` |
| **System Labels / Tooltips / Timestamps**| `12px` | `400` (Regular) | `16px` | `text-text-muted` |

---

## 3. Theme Optimization (Light & Dark Mode Invariants)

To ensure seamless execution of high-end dark modes without screen flickering or design degradation, developers must strictly adhere to the unified semantic configuration block.

### 3.1 Eliminating Hydration Flickering (Flash of Unstyled Content)
- The application runtime must parse the active theme selection (from LocalStorage or native user agent preference) via an inline, blocking script placed directly at the top of the Document Head layer (`<head>`).
- Direct configuration class mutations (`.dark`) must compile into the global document frame before the TanStack Start hydration script kicks off.

### 3.2 Dynamic Color Tokens Architecture
- **Strict Prohibition:** Never toggle themes inside components manually using double utility strings (e.g., `bg-white dark:bg-black`). 
- **Enforced Protocol:** Elements must carry a singular, fluid semantic theme token class (`bg-surface`, `text-text-primary`, `border-border`). The exact hex inversion metrics are controlled automatically at compilation via the `@variant dark` rules within `globals.css`.

### 3.3 Liquid Glassmorphism Adaptation Core Specs
The visual depth values of semi-transparent layers must automatically re-calibrate under Dark theme states to preserve premium readability:
- **Light Theme Glass State:** Backdrop blur coefficient `backdrop-blur-md`, surface base background color set to white with high alpha opacity (`bg-surface/80`), bordered securely by a minimal layout vector (`border-border/50`).
- **Dark Theme Glass State:** Background configuration opacity shifts natively to absorb high contrast light sources while darkening base card structures (`bg-surface/40`), combined with a lightened border layer to maintain visual division layout bounds (`border-border/20`).

---

## 4. Hardware-Accelerated Micro-Animations (Framer Motion Integration)

To deliver a cinematic, high-end digital shopping experience, all reactive interface transitions must execute via **Framer Motion** (`motion.*` compiler targets) mapped to the system GPU pipeline.

### 4.1 Standard Physics Engine Configurations
- **Spring Overrides:** Avoid raw time-duration curves for layout transitions (e.g., Modals, Drawers, Cart Side-sheets). Enforce high-performance uniform spring dynamics:
  ```typescript
  const SYSTEM_SPRING = { type: "spring", stiffness: 300, damping: 30 };

```

* **Micro-Scaling Factors:** Interactive tactile components (Buttons, Product Cards, Shoppable Story Anchors, Admin Action Links) must compress dynamically under physical pressure inputs:
* Main Checkout & Form CTAs: `whileTap={{ scale: 0.98 }}`
* Badges, Icons, Row Actions: `whileTap={{ scale: 0.95 }}`



### 4.2 Component Animation Specifications

* **Liquid Glassmorphism Voice AI Console:** The real-time interactive voice dialog module utilizes asynchronous fluid mesh indicators. The active voice capturing node must run an infinite scale-and-blur keyframe animation sequence:
```typescript
animate={{ scale: [1, 1.06, 1], opacity: [0.8, 1, 0.8] }}
transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}

```


* **Shoppable Video Post Viewports:** Transitioning from the blog list index to full-screen shoppable stories must invoke Framer Motion's `layoutId` synchronization strategy to fluidly morph content bounds at 60fps.
* **Theme Switching Interpolation:** When transitioning states across the global application framework, elements must gracefully blend color channels avoiding sharp, jarring hex flashes. Use: `transition-colors duration-300 ease-in-out`.

---

## 5. Structural Layout, Navigation & Spacing

* **Maximum Page Constraint:** Standard application layouts must restrict content expandability to exactly `1440px` horizontally centered (`mx-auto`).
* **Global Spacing Budget:** Section gaps default to exactly `24px` (`gap-6`). Base layout wrapper padding scales to a uniform `32px` (`p-8`).
* **Global Navigation Architecture:** - Standard storefront routes run a full-viewport, unified top-horizontal navigation framework (`h-16`). Side nav drawers are prohibited for public views.
* Left-hand structural multi-level column menus are restricted strictly to private Admin Dashboard views.


* **Active Navigation States:** Current active paths indicate location exclusively via a color shift to `text-accent` (#7C5CFC) with medium weight (`font-medium`). Visual border flashes, underline extensions, and structural block color changes are unauthorized.

---

## 6. Admin Panel Data Tables & Control Surfaces

The Admin API Engine requires pristine data display clarity to manage production configurations safely (e.g., API Token matrices, Catalog sync metrics, Torob integration paths).

* **Grid Background Invariant:** Alternating background row tints (Zebra grids) are completely banned. Tables must maintain structural uniformity utilizing a flat `bg-surface` layout.
* **Isolation Layout:** Row boundaries are segmented cleanly using a uniform `1px solid border-border` layout token.
* **Admin Table Columns Header:** Must parse as uppercase, `12px`, `font-medium`, inheriting `text-text-secondary` color characteristics.

---

## 7. Frontend Performance & Code-Splitting Budgets

To keep initial First Input Delay (FID) and Largest Contentful Paint (LCP) under production limits, specific runtime boundaries are enforced across `apps/web/`:

* **Voice AI Computation Isolation:** The live real-time voice capture orchestration layer, WebRTC streaming contexts, and complex canvas audio visualization matrices must be cleanly isolated behind dynamic, lazy-loaded lazy-import bundles. They are entirely stripped from the application entry bundle.
* **Layout Shift Prevention:** Image tags, video containers inside Shoppable Stories, and marketing asset nodes must specify native `aspect-ratio` utility frameworks directly within compile markup to eliminate dynamic client DOM readjustments.

---

## 8. Strict Codebase "Do Nots"

1. **No Core Tailwind Colors:** Raw system tailwind color primitives (e.g., `bg-blue-500`, `text-slate-700`) are banned. Use explicit design variables matching the `@theme` specifications.
2. **No tailwind.config.ts Alterations:** Tailwind configuration files are deprecated. Visual tokens exist solely within `@theme` mappings inside `globals.css`.
3. **No Database Exception Leaks:** Raw server exceptions, Postgres Drizzle stack dumps, or internal validation codes must never reach client UI rendering ports. Intercept error bounds and present clean, localized Persian error text blocks.
4. **No Multiple Radii Overloads:** Components must never contain more than two distinct nesting levels of varying `border-radius` variables.
5. **No Fixed Flow Breaks:** Standard workflow interfaces must never invoke `position: fixed` or explicit z-index stacks to force layout ordering outside the semantic document outline.
