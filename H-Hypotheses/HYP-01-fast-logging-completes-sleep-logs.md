# HYP-01 — Logging in ≤ 3 taps raises complete sleep logs from 36% to ≥ 80%

> We believe that Lavie's parents skip sleep events because logging in Excel is slow at the worst moments.
> If every event (put-down, fell asleep, woke up) takes ≤ 3 taps with time defaulting to "now", then complete sleep logs will rise from 36% to ≥ 80% within 4 weeks.

## Related Bet
- Bet 1 — Speed drives completeness

## Related Initiative
- _TBD — Step 4_

## Risk Level
High — this is the North Star. If it fails, every insight fails with it.

## Why this might fail
- **Put-down is forgotten, not slow.** Lavie falls asleep in arms; nobody thinks to tap "put-down" first. Speed doesn't fix memory.
- **Wake-ups at night are logged in the morning — or never.** A parent who just got him back to sleep won't open a phone.
- Logging fatigue: novelty wears off after the first week.

## Test Plan
- Method: Use the app as the only tracker (Excel stopped). The app computes the metric weekly from its own data.
- Who/where: Both parents, daily life.
- Duration: 4 weeks from first day of daily use.

## Metric + Threshold
- Metric: % of sleeps in a week with put-down + fell asleep + woke up all logged.
- Success threshold: ≥ 80% in week 4.
- Failure threshold: < 60% in week 4 → speed is not the bottleneck; investigate reminders or a "fell asleep in arms" shortcut.

## Status
Untested

## Last Updated
2026-10-01
