# 📄 `ui-tokens.md` (Rayan Tech Enterprise Design Tokens)

```markdown
# UI Tokens — Rayan Tech Design System

This document contains the absolute cryptographic design tokens and hex value matrices for the Rayan Tech platform. All tokens are bound directly to the Tailwind CSS v4 `@theme` engine via the global stylesheet (`apps/web/styles/globals.css`). Hardcoding raw hex numbers or utilizing default Tailwind unassigned colors inside components is strictly prohibited.

---

## 1. Engine Configuration (`globals.css` Core Layout)

Tailwind v4 automatically derives structural utilities (e.g., `bg-surface`, `text-text-primary`, `border-border`) directly from these defined custom properties.

```css
@theme {
  /* System Typography Mappings */
  --font-sans: "Yekan Bakh", "Inter", sans-serif;

  /* Global Layout Spacing Constraints */
  --spacing-page-max: 1440px;
  --spacing-layout-gap: 24px;
  --spacing-container-padding: 32px;

  /* --- LIGHT THEME METRICS --- */
  --color-background: #F8FAFC;
  --color-surface: #FFFFFF;
  --color-surface-secondary: #F1F5F9;
  
  --color-text-primary: #0F172A;
  --color-text-secondary: #475569;
  --color-text-muted: #94A3B8;
  
  --color-accent: #6366F1;         /* Electric Indigo */
  --color-accent-light: #EEF2FF;
  
  --color-border: #E2E8F0;
  --color-border-light: #F1F5F9;

  /* Functional Indicators */
  --color-success: #10B981;
  --color-success-light: #D1FAE5;
  --color-warning: #F59E0B;
  --color-warning-light: #FEF3C7;
  --color-danger: #EF4444;
  --color-danger-light: #FEE2E2;
  
  /* Liquid Glassmorphism Light Tokens */
  --glass-backdrop: rgba(255, 255, 255, 0.8);
  --glass-border: rgba(226, 232, 240, 0.5);

  /* --- DARK THEME METRICS OVERRIDES --- */
  @variant dark {
    --color-background: #090D16;   /* Cyber Slate Black */
    --color-surface: #121824;      /* Deep Titanium Card */
    --color-surface-secondary: #1E2640;
    
    --color-text-primary: #F8FAFC;
    --color-text-secondary: #94A3B8;
    --color-text-muted: #64748B;
    
    --color-accent: #818CF8;
    --color-accent-light: #1E2240;
    
    --color-border: #1E293B;
    --color-border-light: #161F30;

    /* Liquid Glassmorphism Dark Tokens */
    --glass-backdrop: rgba(18, 24, 36, 0.4);
    --glass-border: rgba(30, 41, 59, 0.3);
  }
}

```

---

## 2. Color Application Guide (Semantic Layout Matrix)

Developers must look up context placements inside this map before committing classes to `shadcn/ui` layouts:

### 2.1 Core Page Shell Layout

| Architectural Target | Tailwind v4 Utility Class | Hex Light Target | Hex Dark Target |
| --- | --- | --- | --- |
| HTML Root Core Viewport | `bg-background` | `#F8FAFC` | `#090D16` |
| Primary Card Layer / Tables | `bg-surface` | `#FFFFFF` | `#121824` |
| Inner Fields / Meta Strips | `bg-surface-secondary` | `#F1F5F9` | `#1E2640` |
| Standard Grid Structural Line | `border-border` | `#E2E8F0` | `#1E293B` |
| Micro Border Details | `border-border-light` | `#F1F5F9` | `#161F30` |

### 2.2 Text Token Assignments

| Cognitive Value | Tailwind v4 Utility Class | Light Hex Value | Dark Hex Value |
| --- | --- | --- | --- |
| Bold Headings & Catalog Prices | `text-text-primary` | `#0F172A` | `#F8FAFC` |
| Descriptions & Menu Active Links | `text-text-secondary` | `#475569` | `#94A3B8` |
| Time Invariants & Table Headers | `text-text-muted` | `#94A3B8` | `#64748B` |

---

## 3. High-End Subsystem Specialized Mappings

### 3.1 Admin Panel API Token Engine

To clearly visualize the token scope and live status in the credentials configuration ledger, standard table statuses apply:

* **Active / Verified API Token Key:** Background: `bg-success-light`, Text: `text-success`
* **Revoked / Expired Token Boundary:** Background: `bg-danger-light`, Text: `text-danger`
* **Read-Only Data Sync Token Scope:** Background: `bg-surface-secondary`, Text: `text-text-secondary`

### 3.2 Real-Time Conversational Voice AI Console

The floating AI interaction modal maps to strict hardware-accelerated glass layers to emphasize premium technical depth:

* **Base Backdrop:** Class: `bg-[--glass-backdrop] backdrop-blur-md`
* **Sealing Edge Ring:** Class: `border border-[--glass-border]`
* **Active Audio Streaming State (Pulse Ring):** Radial Gradient Layer expanding dynamically from `--color-accent` to `rgba(99, 102, 241, 0)`.

### 3.3 Torob Hub Sync Monitoring Ledger (`/api/v1/torob/`)

Inside the Admin crawler tracking panel, visual dots map out background processing states of the `/products` payload:

* **Live Scraper Crawling Request Active:** Dot: `bg-accent` with a continuous pulse.
* **Cache Hit (Zero Database Read Strain):** Dot: `bg-success` (Indicates product prices fetched from high-speed Redis isolation layer).
* **Throttled IP Request Dropped:** Dot: `bg-warning` (Triggered when a crawler exceeds the IP rate-limiting parameters).

---

## 4. Architectural Design System Invariants

1. **Strict Class Single-String Policy:** Toggling colors inside codebases must never contain double declarations like `bg-white dark:bg-slate-900`. Use the compiled semantic abstraction: `bg-surface`.
2. **Yekan Bakh Integration Boundary:** Local assets must provide clear font metrics for weights `400` (Regular), `500` (Medium), and `600` (Demibold/Bold). No other font styling weights may be called.
3. **Chart Visual Framework Data Sets:** Admin statistics graphs (`orders-ledger`, `api-traffic-streams`) rendered via `recharts` must pick color values explicitly using system design property tags: `var(--color-accent)`, `var(--color-success)`. Raw inline hex mappings inside JavaScript files are blocked at continuous integration validation checks.