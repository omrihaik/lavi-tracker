# HYP-03 — With a shared live status, both parents log and stop asking "when did he last eat?"

> We believe that the two parents are out of sync because only one can see the Excel at a time and it's hard to read on a phone.
> If both phones show the same live status ("last fed 2h 10m ago · asleep for 40m"), then each parent will log ≥ 25% of events every week, and "when did he last eat?" will stop being asked, within 2 weeks of shared sync working.

## Related Bet
- Bet 2 — A shared live status replaces asking each other

## Related Initiative
- _TBD — Step 4_

## Risk Level
High — Parent 2's profile comes from Parent 1's description, not a direct interview. Accepted risk; the app data will show it within 2 weeks.

## Why this might fail
- Parent 2 prefers asking over opening an app — the habit is social, not informational.
- Parent 2 checks but doesn't log → status goes stale when Parent 2 is with Lavie → trust drops.
- Sync delay or login friction on the Android phone.

## Test Plan
- Method: App records who logged each event. Weekly review: one yes/no question to each parent — "did you ask the other when he last ate this week?"
- Who/where: Both parents.
- Duration: 2 weeks after sync works on both phones.

## Metric + Threshold
- Metric 1: Share of events logged by each parent.
- Metric 2: Weekly self-report — "asked when he last ate?" (yes/no, per parent).
- Success threshold: Each parent ≥ 25% of events AND both answer "no" in week 2.
- Failure threshold: Either parent < 10% of events in week 2 → the app is a one-parent tool; rethink Parent 2's entry point.

## Status
Untested

## Last Updated
2026-10-01
