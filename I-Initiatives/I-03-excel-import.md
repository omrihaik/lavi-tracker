# Initiative: I-03 Excel Import

## Strategic Link
- [[S-Strategy/Strategic-Bets]]: Bet 3 — Structured events make insights automatic
- Why this bet now: Brings existing history into the app so the insights screen has data on day one, and lets us stop using Excel.

## Outcome (must be measurable)
- Metric: % of Excel rows mapped to one of the 4 event types without manual fixing
- Desired change: ≥ 95% of rows mapped; the rest listed for review
- Time horizon: Before I-04 starts

## Scope
- One-time import, run by Claude locally — not a feature in the app
- Rules mapping the free-text labels (e.g. "אכל" / "אוכל" / "האכלה" → Feeding)
- Fix mixed date formats; fill missing dates from the row above
- Report of unmapped rows

## Out of scope
- Repeated or in-app import; importing other files

## Linked Hypotheses
- [[H-Hypotheses/HYP-04-insights-without-cleanup]]

## Ownership
- PM Owner: Parent 1
- Team: Claude (build)

## Stakeholders
- Both parents (users)

## Milestone
v1 — Insights

## Stage
Defined

## Status
Active

## Decision Needed?
No

## Source
- The live Google Sheet (still in use as of 2026-11-02), exported at import time — not the September copy in `data/`.
- The sheet's link stays private: never in this repo, issues, or commits.

## Open Questions
- Import once at MVP release, or again later if the Sheet keeps running in parallel?

## Last Updated
2026-11-02
