# PRD: LavieTracker MVP (I-01 Fast Logger + I-02 Shared Live Status)

**Version:** 1.0
**Status:** Draft
**Owner:** Parent 1
**Last updated:** 2026-11-02
**Target reader:** Engineering (Claude builds, Parent 1 reviews)
**GitHub:** Milestone `MVP` — issues I-01, I-02

---

## Strategic Context

- **Bet 1 — Speed drives completeness.** Without fast logging there is no data.
- **Bet 2 — A shared live status replaces asking each other.** A logger on one phone is abandoned within a day.
- **Why now:** Every later initiative (import, insights) depends on complete data, and complete data depends on this MVP.

---

## Problem Statement

Logging Lavie's day in a shared Excel is slow at the worst moments (3 a.m., one hand free), so events get skipped, and the two parents can't see each other's logs at a glance.

- **Who has this problem:** The Logger — both parents (see `R-Relationships/Users/Personas.md`).
- **Current workaround:** Shared Excel on phones — scroll to the row, type free text; ask each other "when did he last eat?"
- **Cost of the problem:** Only 65% of sleeps have a recorded wake-up; 44% of feeds have an ml amount; 23 free-text labels for ~6 event types. None of the five questions can be answered.

---

## Success Definition

- **North Star for this PRD:** Complete sleep logs — % of sleeps with fell asleep + woke up.
- **Target:** 65% → ≥ 95% by week 4 after MVP release.
- **Supporting signals:**
  - Taps to log: ≤ 3 for every event type (checked at release)
  - Complete feeding logs (ml + rating): ≥ 90% by week 2
  - Each parent logs ≥ 25% of events by week 2
- **What failure looks like:**
  - Complete sleep logs < 80% in week 4 (HYP-01)
  - Complete feeding logs < 70% in week 2 (HYP-02)
  - Either parent < 10% of events in week 2 (HYP-03)

---

## Users & Devices

- Exactly two users: Parent 1 and Parent 2.
- One iPhone, one Android. Installed to the home screen as a web app (PWA).
- Used one-handed, often in the dark.

---

## Functional Requirements

### FR-1 Home screen
- Opens directly to the logging screen — no menu, no navigation first.
- Top: live status (FR-6). Below: four large buttons — Sleep · Feeding · Put-down · Activity.

### FR-2 Sleep
- One button. If Lavie is awake → logs "fell asleep". If asleep → logs "woke up".
- 1 tap.
- The button always shows the current state: "Asleep 4h 20m — woke up?" / "Awake 1h 15m — fell asleep?"
- If "woke up" is tapped more than 6 hours after "fell asleep", the app asks for the actual wake-up time (default: now).
- No put-down required before "fell asleep".

### FR-3 Feeding
- Tap Feeding → pick ml (presets 120 / **150** / 180 + "other"; 150 highlighted as most common) → pick Good / OK / Hard.
- 3 taps.
- ml and rating can be added later if skipped.
- If Lavie is marked asleep, saving a feeding also logs "woke up" (added 2026-11-04). It is stored as automatic and shown as such in the list. Undo removes both; deleting the wake-up row keeps the feeding, which covers feeding him in his sleep. After 6 hours asleep, the app asks for the wake-up time instead (FR-2).

### FR-4 Put-down
- Tap Put-down → pick crying Yes / No.
- 2 taps.
- **Optional.** Logged when it happens; never required before "fell asleep".

### FR-5 Activity
- Tap Activity → pick tummy time / trampoline / skin to skin / talking.
- 2 taps.

### FR-6 Live status
- "Last fed: 2h 10m ago · 120 ml"
- "Asleep 40m" or "Awake 1h 15m"
- Updates on both phones within 5 seconds of a log.

### FR-7 Edit and undo
- Every log time defaults to "now".
- After saving: a short "Undo" option.
- Today's events listed below the buttons; tap one to change its time or details, or delete it.

### FR-8 Sync and login
- Each parent signs in once per device; stays signed in.
- Only the two parents can read or write data.
- An event logged offline is saved and synced when the connection returns.

### FR-9 Self-measurement
- Every event stores: type, time, details, who logged it, when it was logged.
- Automatic wake-ups are marked, so HYP-01 can count sleep logs with and without them.
- Enough to compute HYP-01–03 metrics later — no metrics screen in the MVP.

### FR-10 Language and display
- Hebrew, right-to-left.
- Dark mode by default; large tap targets.

---

## Scope

**In scope:** FR-1 to FR-10.

**Out of scope:**
- Insights screen (I-04), Excel import (I-03)
- Notifications, reminders
- Timers or durations for activities
- Free text or notes
- More than two users, invitations, roles
- Medical data, age-norm comparisons, advice

---

## Hypothesis Summary

| Hypothesis | Status | Confidence |
|---|---|---|
| HYP-01 Fast logging completes sleep logs | Untested | Medium |
| HYP-02 Feeding details in three taps | Untested | Medium |
| HYP-03 Both parents log | Untested | Low |

All three are untested. The MVP is the test: FR-9 provides the data to read them.

---

## Constraints

- **$0** — free tiers only.
- **Builder time: minimal** — small steps, each finished in one short session.
- **Public repo, private data** — no real data in the repo; data lives in a managed service behind login.
- **iPhone + Android** — one web app for both.
- **Managed services only** — nothing to run or maintain.
- Technical choices: see `I-Initiatives/DEC-01-tech-stack.md`.

---

## Open Questions

| # | Question | Owner | Needed by |
|---|---|---|---|
| 1 | The Google Sheet and the app are running in parallel with no end date. On what date does the Sheet stop? | Parent 1 | Week 1 review (2026-11-11) |
| 2 | Is "Other" ml needed, or are 120 / 150 / 180 enough? Check after week 1. | Parent 1 | Week 1 review |
| 3 | Will put-down be logged often enough to answer Q2 (best bedtime)? Watch the put-down share. | Parent 1 | Week 2 review |

### Resolved (2026-11-04)
- Google Sheet on release → run both for now (Parent 1). The hypothesis clocks start on the day the Sheet stops; HYP-01 to HYP-03 stay Untested until then.

### Resolved (2026-11-02)
- ml presets → 120 / 150 / 180 + other; 150 is the common amount (every ~3 hours).
- Forgotten "woke up" → button shows current state; > 6 hours asks for wake-up time.
- "Fell asleep in arms" → no put-down needed; put-down is optional. North Star redefined accordingly (KPIs.md).

---

## Risks

- **Q2 starves:** put-down is optional, so best-bedtime may lack data. Mitigation: watch the put-down share (KPIs.md); revisit at week 2.
- **Stale sleep state:** a missed "woke up" makes the Sleep button do the wrong thing. Mitigation: state shown on the button; 6-hour rule (FR-2).
- **Two trackers in parallel:** if the Google Sheet keeps running, logs split between two places. Mitigation: open question 1.
- **iPhone PWA limits:** installing to the home screen takes a few manual steps in Safari. Mitigation: a one-time install guide.
- **Free-tier changes:** a provider changes its free plan. Mitigation: keep the data exportable.

---

## Structural Flags

- All linked hypotheses are **Untested**. Accepted: this MVP exists to test them, and FR-9 makes them measurable.
