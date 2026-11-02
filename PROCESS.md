# Process Log

How LavieTracker was built — each step, what was decided, and why.

---

## Step 0 — Setup (2026-09-29)

**What:** Created a dedicated AI-SHIPR instance for LavieTracker and a Git repository.

**Decisions:**
- **One repo for product + code.** Strategy docs and app code live together so a PR can reference the hypothesis or initiative it serves.
- **Public repo.** Real tracking data (`data/`, `*.xlsx`) is git-ignored. The app will ship with synthetic sample data only.
- **AI-SHIPR framework files stay local** (`A-AI/`, `.claude/`, templates) — they are third-party material; only our own product docs are published.
- **Users:** two parents, logging from two phones — sync between devices is a requirement from day one.

**Starting evidence (from the Excel, 13.9–28.9):**
- 384 rows in ~2 weeks.
- 23 different free-text labels for ~6 real event types ("אכל" / "אוכל" / "האכלה"...). Data can't be analyzed without cleaning.
- Sleep duration is never recorded — must be derived from "נרדם" → "התעורר" pairs, some of which are unmatched.
- Inconsistent date formats (number, datetime, missing).
- Valuable context captured only as free text ("השכבה מלווה בבכי והתנגדות").

**Git learned:** `git init`, `.gitignore`, first commit, push to GitHub.

---

## Step 1 — Strategy (2026-10-01)

**What:** Filled the five `S-Strategy/` files through two rounds of questions, with gaps flagged before accepting answers.

**Decisions:**
- **Three questions, not four.** "Does bath time help?" dropped — bath is out of scope.
- **Compare Lavie to himself**, not to age norms (keeps us away from medical data).
- **"Best bedtime" = fastest to fall asleep** → put-down must be logged, not optional.
- **One insights screen**, not a dashboard per activity.
- **Three event types only:** sleep, feeding (with ml), put-down (with crying yes/no).
- **North Star = complete sleep logs** (put-down + asleep + woke up). Baseline 36%, target ≥ 80%.

**Gap that shaped the strategy:** the Excel baseline showed only 36% of sleeps have a put-down logged — so "best bedtime" is unanswerable today. That made data completeness, not dashboards, the North Star.

**Scope change (same day):** added "How are feedings going?" (Good / OK / Hard rating) and Activity as a 4th event type (tummy time, trampoline, skin to skin, talking — one tap, no duration). Each addition was accepted only after naming the question it answers.

**Git learned:** a second commit on top of the first — `git diff`, then commit + push. Also: a rejected push after editing on the GitHub website → `git pull --rebase`, then push.

---

## Step 3 — Hypotheses (2026-10-01)

**What:** Turned each Strategic Bet into falsifiable hypotheses (`H-Hypotheses/HYP-01…04`). Each has a metric, a success threshold, a failure threshold, and a time limit.

| ID | Claim | Risk |
|---|---|---|
| HYP-01 | ≤ 3 taps raises complete sleep logs 36% → ≥ 80% in 4 weeks | High |
| HYP-02 | Feeding with ml + rating stays at 3 taps, logged ≥ 90% | Medium |
| HYP-03 | Shared live status → both parents log ≥ 25%, stop asking | High |
| HYP-04 | Structured events answer all 5 questions, no cleanup | Low |

**Key insight:** the riskiest assumption isn't speed — it's *memory*. Put-down is forgotten because Lavie falls asleep in arms, not because logging is slow. HYP-01's failure threshold names the fallback.

**Requirement discovered:** the app must measure its own hypotheses — who logged each event, which fields were filled, completeness per week.

**Persona decision (Step 2):** Parent 1 answered for both parents → one shared persona. Accepted as a known risk (a proxy, not an interview); HYP-03's data will validate it, and a < 10% share for Parent 2 triggers a direct interview.

---

## Step 4 — Initiatives (2026-11-02)

**What:** Four initiatives in `I-Initiatives/`, each linked to a bet and a hypothesis. Hypotheses now link back to their initiatives.

| ID | Initiative | Bet | Hypotheses | Milestone |
|---|---|---|---|---|
| I-01 | Fast Logger | 1 | HYP-01, HYP-02 | MVP |
| I-02 | Shared Live Status | 2 | HYP-03 | MVP |
| I-03 | Excel Import | 3 | HYP-04 | v1 — Insights |
| I-04 | Insights Screen | 3 | HYP-04 | v1 — Insights |

**Decisions:**
- **I-01 and I-02 ship together as the MVP.** A logger on one phone is abandoned within a day — sync is not a "later" feature.
- **Excel import moved after the MVP.** It's needed for insights, not for logging; doing it first would delay the thing we use every day.
- **Insights wait for ~2 weeks of complete data.** Insights on incomplete data would mislead.
- **Open decision (I-02):** sync/database provider — decided in Step 5 against: $0, real-time, managed, iPhone + Android.

**GitHub learned:** Issues, Milestones, Labels — one issue per initiative.

---

## Step 5 — PRD (2026-11-02)

**What:** One PRD for the MVP (`I-Initiatives/PRD-MVP.md`) covering I-01 + I-02, plus a decision record for the tech stack (`I-Initiatives/DEC-01-tech-stack.md`).

**PRD highlights:**
- 10 functional requirements (FR-1…FR-10), each traceable to a bet or hypothesis.
- Tap budget per event: Sleep 1, Put-down 2, Activity 2, Feeding 3.
- FR-9 (self-measurement) makes the hypotheses readable from day one — no metrics screen needed yet.
- 4 open questions — a PRD with none hasn't been stress-tested.

**Tech decision (approved):** Firebase (real-time + offline built in) · Google sign-in · GitHub Pages · React + TypeScript + Vite PWA. Deciding criterion: offline logging protects the North Star.

**Structural flag accepted:** all hypotheses are Untested — the MVP is the test.

**North Star redefined (same day):** Parent 1 decided put-down is optional — "fell asleep in arms" is logged as just "fell asleep". Complete sleep log = fell asleep + woke up (baseline 65%, target ≥ 95%). Trade-off accepted: less friction at night vs. slower data for Q2 (best bedtime), which now uses only sleeps that had a put-down.

**Other answers:** ml presets 120 / 150 / 180; forgotten wake-up handled by a state-showing button + 6-hour rule; the tracker is now a Google Sheet, still in use — its link never enters the repo.

---

## Step 6.1 — App skeleton + automatic deploy (2026-11-02)

**What:** A minimal React + TypeScript + Vite app in `app/` (Hebrew, right-to-left, dark), and a GitHub Actions workflow (`.github/workflows/deploy.yml`) that builds and publishes it to GitHub Pages on every push to `main`.

**Why first:** Proves the whole pipeline — code → GitHub → live URL on both phones — before any feature exists. Every later step ships the same way.

**GitHub learned:** GitHub Actions (a workflow file = instructions GitHub runs on its own servers), GitHub Pages (free hosting from the repo), the Actions tab (watching a deploy run).

---

## Step 6.2 — Fast logger (2026-11-02)

**What:** The logging screen, on branch `feature/fast-logger` — FR-1 to FR-5 and FR-7 from the PRD. Data is stored on the phone only (localStorage); `app/src/store.ts` is the single place that changes in 6.3 when Firebase arrives.

**Tap counts, tested in the browser:** Sleep 1 · Put-down 2 · Activity 2 · Feeding 3 — all within the ≤ 3 budget.

**Also tested:** undo toast, edit/delete from today's list, the 6-hour wake-up rule, and FR-9 fields (`loggedBy`, `loggedAt`) on every event.

**Design choices:**
- Sleep is two events (`sleep_start` / `sleep_end`), not one record with a duration — logging never has to "find" an open record, and both parents can log either half.
- Choices open in a bottom sheet — within thumb reach, one-handed.
- 150 ml is highlighted as the common amount.

**GitHub learned:** branches (`git switch -c`), pushing a branch, Pull Requests.
