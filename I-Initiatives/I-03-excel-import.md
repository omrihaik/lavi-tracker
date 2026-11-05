# Initiative: I-03 Excel Import

## Strategic Link
- [[S-Strategy/Strategic-Bets]]: Bet 3 — Structured events make insights automatic
- Why this bet now: Brings existing history into the app so the insights screen has data on day one, and lets us stop using Excel.

## Outcome (must be measurable)
- Metric: % of Excel rows mapped to one of the 4 event types without manual fixing
- Desired change: ≥ 95% of rows mapped; the rest listed for review
- Time horizon: Before I-04 starts

## Scope
- One-time conversion by `tools/convert_sheet.py`, then a hidden `#import` page where a signed-in parent picks the file
- Stored as one document, so opening the app costs one read instead of 1,100 on the free plan
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
In Development

## Status
Active

## Decision Needed?
No

## Source
- The live Google Sheet (still in use as of 2026-11-02), exported at import time — not the September copy in `data/`.
- The sheet's link stays private: never in this repo, issues, or commits.

## Open Questions
- Resolved: import once. The Sheet stopped on 2026-11-04, and any imported row at or after the first app event is ignored.

## Last Updated
2026-11-05
