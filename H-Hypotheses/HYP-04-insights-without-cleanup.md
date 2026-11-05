# HYP-04 — Structured events answer all four questions with zero manual cleanup

> We believe the Excel can't answer our questions because of free text and missing fields, not because the questions are hard.
> If every event is one of 4 fixed types with preset details, then after 14 days of use the insights screen will answer all four questions from app data alone, with no manual fixes.

## Related Bet
- Bet 3 — Structured events make insights automatic

## Related Initiative
- [[I-Initiatives/I-03-excel-import]]
- [[I-Initiatives/I-04-insights-screen]]

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
- Metric: Number of the four questions answered with ≥ 5 data points each (narrowed to three on 2026-11-05, food added back the same day).
- Success threshold: 4 / 4 on day 28.
- Failure threshold: ≤ 3 / 5 on day 28 → drop or redefine the unanswered questions.

## Status
Untested

## Last Updated
2026-10-01
