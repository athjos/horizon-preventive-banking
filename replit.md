# Horizon Preventive Banking

An interactive hackathon MVP that demonstrates proactive, consent-based banking guardrails before financial distress compounds.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/horizon-app` — deployable React + Vite MVP
- `artifacts/horizon-app/src/App.tsx` — product surface and interactive demo state
- `artifacts/horizon-app/src/index.css` — visual system and responsive layout
- `README.md` — GitHub handoff and judge walkthrough

## Architecture decisions

- The first MVP is intentionally self-contained with deterministic local demo data so judges can run it without banking credentials.
- The interface exposes the user-consent boundary at every simulated intervention instead of presenting autonomous account controls.
- The live demo follows the story in the pitch: UPI attempt, guardian approval, obligation collision, then score recovery.

## Product

- Explainable Financial Distress Score
- Guardian Lock for high-value and near-floor spending
- BounceGuard priority resolution for colliding debits
- Subscription Bleed Shield with annualized leakage
- Utility Pre-Amortizer with seasonal reserve planning

## User preferences

- The MVP must be ready for GitHub-based hackathon submission.

## Gotchas

- The banking actions are simulations only; do not describe them as live integrations until a real consented provider is connected.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
