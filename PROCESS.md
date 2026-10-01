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

**Persona decision:** Parent 1 answered for both parents → one shared persona. Accepted as a known risk (a proxy, not an interview); HYP-03's data will validate it, and a < 10% share for Parent 2 triggers a direct interview.
