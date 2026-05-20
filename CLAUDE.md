# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Cyberpunk-style recruitment dashboard prototype. React 19 + Vite 8 + TailwindCSS v3 + Framer Motion 12. No backend, no auth, no database — pure frontend. Deployed to Vercel via GitHub integration.

## Commands

```bash
npm run dev      # dev server at localhost:5173
npm run build    # production build → dist/
npm run preview  # serve the production build locally
npm run lint     # ESLint
```

No test runner is configured.

## Git workflow

After every change: commit with a clean message and push immediately.

```bash
git add <specific files>   # never use git add -A or git add .
git commit -m "type: short description"   # feat / fix / chore / refactor
git push
```

## Architecture

**App shell** (`src/App.jsx`): owns a single `isLoading` boolean. `AnimatePresence mode="wait"` swaps `LoadingScreen` → `Dashboard` on boot completion. `ScanlineOverlay` renders outside that swap — always visible, fixed, `pointer-events: none`.

**Single page** (`src/pages/Dashboard.jsx`): composes all components into a responsive grid. Entrance animation uses Framer Motion `staggerChildren` on a container `motion.div`.

**Components** (`src/components/`):

| Component | Key behaviour |
|---|---|
| `LoadingScreen` | Typewriter boot sequence via `setTimeout` chain; calls `onComplete()` prop when done |
| `Navbar` | Glitch effect via conditional React state + overlay `<span>`s (not CSS pseudo-elements) |
| `GlowButton` | `color` prop (`yellow` \| `cyan` \| `red`); colors resolved from a static lookup map, never interpolated into Tailwind class strings |
| `TerminalPanel` | `lines` array `{ text, type, delay }`; reveals one line at a time, auto-scrolls |
| `AnalyticsCard` | Counter animated 0 → `value` via `requestAnimationFrame` + `easeOutCubic`; `index` prop controls stagger delay |
| `HUDPanel` | Wrapper with 4 positioned `<span>` corner brackets, glassmorphism bg, idle glow pulse |
| `ScanlineOverlay` | `body::before` static scanlines + `motion.div` moving scan band |

## Styling

Design tokens live in `tailwind.config.js`:
- Backgrounds: `cyber-black` / `cyber-dark` / `cyber-muted` / `cyber-dim`
- Accents: `neon-yellow`, `neon-cyan`, `neon-red` (and `*2` softer variants)
- Font: `font-mono` → JetBrains Mono (loaded via Google Fonts in `index.html`)

Glow utilities in `src/index.css` `@layer utilities`: `.text-glow-yellow`, `.text-glow-cyan`, `.text-glow-red`, `.border-glow-{yellow|cyan|red}` — prefer these over inline `textShadow`/`boxShadow`.

Glitch animation (`animate-glitch`) is a CSS `@keyframes` in `tailwind.config.js`. Never drive `clip-path` via Framer Motion `animate` — it is not in Framer's animatable set.

## Deployment

```bash
npx vercel --prod
```

`vercel.json` has SPA rewrites configured; no extra setup needed.

---

## Behaviour instructions for Claude

**Context:** At the start of a session, read the codebase and understand the architecture inside and out before making any changes. Ask questions if anything is unclear.

**Eagerness:** Implement changes rather than only suggesting them. Infer the user's intent and proceed using tools to discover missing details. Use reads and searches before guessing.

**Parallel tool calls:** When multiple tool calls have no dependencies between them, fire them all in a single message simultaneously. Never block on one when others can run in parallel.

**Grounded answers:** Never speculate about code you have not read. Read the relevant file before answering any question about it. Make no claims about the codebase without prior investigation.

**After tool use:** Provide a concise summary of what was done.
