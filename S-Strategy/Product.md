# Product Context

Captures what the product does, who it serves, and what problem it solves.
Agents read this when they need customer context, use case clarity, or competitive framing.
Update when your audience or product scope changes.

---

## Description (1–2 sentences)

A shared, phone-first tracker for Lavie's sleep, feeding and activity. Two parents log events in 2–3 taps, see a live status ("last fed 2h 10m ago"), and get one insights screen that answers four questions.

## Target customer segment(s)

- **Primary:** Lavie's two parents — both log, mainly from their phones, often one-handed and at night.
- **Baby:** Lavie, born 2026-07-09 (~12 weeks old at project start).
- **Not a segment (for now):** other families, caregivers, grandparents. One baby, two users.

## Core user problem

1. **Logging is slow at the worst moments.** At 3 a.m., holding Lavie, finding the 03:15 row in Excel and typing takes too long.
2. **The two parents are out of sync.** "When did he last eat?" requires asking the other parent instead of looking.
3. **Events get lost.** Both parents confirm logs are skipped (see baseline below).
4. **The data can't answer our questions.** 23 free-text labels for ~6 event types, mixed date formats, no sleep duration.

## The four questions the data must answer

| # | Question | Measured as |
|---|---|---|
| 1 | Is he sleeping enough? | Total sleep per 24h vs. his own 7-day average (no age norms) |
| 2 | What's the best bedtime? | Put-down time slot with the shortest put-down → asleep time (only sleeps that had a put-down) |
| 3 | Is it getting better? | Week-over-week change in total sleep and time-to-fall-asleep |
| 4 | How much did he eat? | Feedings per day, and ml per day only when ≥ 80% of feedings have an amount |

Dropped: "Does bath time help?" — not needed. "Does activity help him sleep?" — removed from Insights on 2026-11-05; the events are still logged until the review around 2026-12-02. Feeding ratings stay out of Insights.

## Event types (the only four)

| Event | Fields | Why it's needed |
|---|---|---|
| Sleep | fell asleep, woke up | Q1, Q3 — sleep duration |
| Feeding | time, amount (ml), experience (Good / OK / Hard) | Live status "last fed"; Q4 |
| Put-down | time, with crying/resistance (yes/no) — **optional** | Q2, Q5 — time to fall asleep starts here |
| Activity | time, type: tummy time / trampoline / skin to skin / talking | Q5 — one tap, no duration |

## Baseline (Excel, 13.9–28.9, 384 rows)

| Signal | Value |
|---|---|
| Sleeps with a recorded wake-up | 77 / 119 = **65%** |
| Feeds with an ml amount | 45 / 102 = **44%** |
| Sleeps preceded by a put-down log | 43 / 119 = **36%** |

Q2 needs put-down + sleep pairs — today only about 1 in 3 sleeps has one.

## Current alternative

A shared Google Sheet, filled from phones — still in use as of 2026-11-02. A September export lives in `data/` (git-ignored). The sheet's link is private and never goes into this repo.
