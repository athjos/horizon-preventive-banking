# Horizon Preventive Banking

Horizon is a judge-ready interactive MVP for proactive financial safety. It
detects early cash-flow pressure and demonstrates consent-based guardrails
before a user reaches a crisis:

- Guardian Lock for high-value and near-floor spending
- BounceGuard for prioritizing loan/EMI payments over subscriptions
- Subscription Bleed Shield for surfacing unused recurring charges
- Utility Pre-Amortizer for smoothing predictable seasonal bill spikes
- An explainable Financial Distress Score with graduated interventions

## Run locally

```bash
pnpm install
pnpm --filter @workspace/horizon-app run dev
```

The app is a self-contained demo and uses local state only. It does not move
money, send real guardian messages, or connect to a bank. Every simulated
action is labeled in the interface so the demo is transparent to judges.

## Recommended judge walkthrough

1. Start the live demo from the dashboard.
2. Launch the `Rs. 16,000` UPI attempt.
3. Approve the guardian authorization.
4. Resolve the upcoming collision: keep the `Rs. 1,800` EMI and pause the
   `Rs. 1,500` gym subscription.
5. Review the recovered score and preserved safety floor.
6. Explore the subscription leakage and seasonal buffer modules.

## Repository layout

The deployable app lives in `artifacts/horizon-app`. The monorepo includes a
shared API server and component preview tooling, but the Horizon MVP does not
require either service for its demo flow.

## Product boundary

This prototype represents the product experience and risk logic with
deterministic demo data. A production implementation would replace those
adapters with consented Account Aggregator feeds, NPCI mandate actions, and a
real notification provider while keeping the user in final control of every
payment decision.