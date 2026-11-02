# Initiative: I-02 Shared Live Status

## Strategic Link
- [[S-Strategy/Strategic-Bets]]: Bet 2 — A shared live status replaces asking each other
- Why this bet now: A logger on one phone only is abandoned within a day. Sync ships together with I-01 as the MVP.

## Outcome (must be measurable)
- Metric: Share of events logged by each parent; "asked when he last ate?" (weekly yes/no)
- Desired change: Each parent ≥ 25% of events; both answer "no"
- Time horizon: 2 weeks after MVP release

## Scope
- Login for exactly two users (free tier, no passwords to manage — e.g. email magic link)
- Real-time sync: an event logged on one phone appears on the other within seconds
- Live status above the log buttons: "Last fed 2h 10m ago · 120 ml" and "Asleep 40m" / "Awake 1h 15m"
- Installable to home screen on iPhone and Android (PWA)
- Data stored outside the repo (public repo, private data)

## Out of scope
- More than two users, invitations, roles, notifications

## Linked Hypotheses
- [[H-Hypotheses/HYP-03-both-parents-log]]

## Ownership
- PM Owner: Parent 1
- Team: Claude (build)

## Stakeholders
- Both parents (users)

## Milestone
MVP

## Stage
Defined

## Status
Active

## Decision Needed?
Yes
- Decision by (date): Start of Step 6 (Build)
- Decision criteria: $0, real-time sync, managed (no server to maintain), works on iPhone + Android
- Options considered: Supabase, Firebase — decided in Step 5 (PRD)

## Open Questions
- Does the live status need to work offline (e.g. no signal at night)?

## Last Updated
2026-11-02
