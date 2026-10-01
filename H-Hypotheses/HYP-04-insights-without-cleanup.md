# HYP-04 — Structured events answer all five questions with zero manual cleanup

> We believe the Excel can't answer our questions because of free text and missing fields, not because the questions are hard.
> If every event is one of 4 fixed types with preset details, then after 14 days of use the insights screen will answer all five questions from app data alone, with no manual fixes.

## Related Bet
- Bet 3 — Structured events make insights automatic

## Related Initiative
- _TBD — Step 4_

## Risk Level
Low — mostly an engineering question, once HYP-01 and HYP-02 deliver complete data.

## Why this might fail
- Not enough data per question: Q2 (best bedtime) needs several put-down → asleep pairs per time slot; 14 days may be too few.
- Q5 (does activity help) needs activities logged before naps — may be too rare to compare.
- Imported Excel data adds noise (23 free-text labels mapped by rules).

## Test Plan
- Method: On day 14, open the insights screen and check each question has an answer backed by data, without editing any event.
- Who/where: Parent 1.
- Duration: Day 14 check; repeat on day 28.

## Metric + Threshold
- Metric: Number of the five questions answered with ≥ 5 data points each.
- Success threshold: 5 / 5 on day 28.
- Failure threshold: ≤ 3 / 5 on day 28 → drop or redefine the unanswered questions.

## Status
Untested

## Last Updated
2026-10-01
