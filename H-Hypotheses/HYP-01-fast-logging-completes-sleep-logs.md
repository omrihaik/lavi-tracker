# HYP-01 — A one-tap sleep button raises complete sleep logs from 65% to ≥ 95%

> We believe that Lavie's parents skip sleep events because logging in Excel is slow at the worst moments.
> If "fell asleep" / "woke up" is a single tap with time defaulting to "now", and the button always shows the current state, then complete sleep logs (fell asleep + woke up) will rise from 65% to ≥ 95% within 4 weeks.

## Related Bet
- Bet 1 — Speed drives completeness

## Related Initiative
- [[I-Initiatives/I-01-fast-logger]]

## Risk Level
High — this is the North Star. If it fails, every insight fails with it.

## Why this might fail
- **Wake-ups at night are logged in the morning — or never.** A parent who just got him back to sleep won't open a phone. (Mitigation: button shows "asleep 4h 20m — woke up?"; after 6 hours the app asks for the wake-up time.)
- Logging fatigue: novelty wears off after the first week.
- Excel still running in parallel splits the logging between two places.

## Test Plan
- Method: Use the app as the only tracker. The app computes the metric weekly from its own data.
- Who/where: Both parents, daily life.
- Duration: 4 weeks from first day of daily use.

## Metric + Threshold
- Metric: % of sleeps in a week with both "fell asleep" and "woke up" logged.
- Success threshold: ≥ 95% in week 4.
- Failure threshold: < 80% in week 4 → speed is not the bottleneck; investigate reminders.

## Revision note
2026-11-02 — Put-down made optional ("fell asleep in arms" needs no put-down). Metric changed from put-down + asleep + woke up (baseline 36%) to asleep + woke up (baseline 65%). Cost: Q2 (best bedtime) uses only sleeps that had a put-down.

## Status
Testing (started 2026-11-04, the day the Sheet stopped)

## Last Updated
2026-11-02
