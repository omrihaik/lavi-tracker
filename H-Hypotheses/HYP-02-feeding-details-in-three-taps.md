# HYP-02 — Feeding with ml + rating stays at 3 taps and gets logged ≥ 90% of the time

> We believe that feeding details (ml, how it went) are skipped today because they must be typed.
> If feeding is logged as Feed → ml preset → Good/OK/Hard (3 taps), then ≥ 90% of feedings will include both ml and a rating within 2 weeks.

## Related Bet
- Bet 1 — Speed drives completeness
- Bet 3 — Structured events make insights automatic

## Related Initiative
- _TBD — Step 4_

## Risk Level
Medium — the scope change (rating added) costs a tap; this checks we didn't break the 3-tap promise.

## Why this might fail
- ml presets don't match real amounts (e.g. 75, 110) → parent skips or picks wrong value.
- Amount is unknown at the start of a feed; parent logs "start" and never returns to add ml.
- Rating feels unimportant at 3 a.m. and gets skipped.

## Test Plan
- Method: App logs every feeding with which fields were filled. Weekly computed %.
- Who/where: Both parents.
- Duration: 2 weeks.

## Metric + Threshold
- Metric: % of feeding events with both ml and rating.
- Success threshold: ≥ 90%.
- Failure threshold: < 70% → make rating optional or allow adding details later from the live status.

## Status
Untested

## Last Updated
2026-10-01
