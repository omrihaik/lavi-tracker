# Process Log

How Lavi Tracker was built — each step, what was decided, and why.

---

## Step 0 — Setup (2026-09-29)

**What:** Created a dedicated AI-SHIPR instance for Lavi Tracker and a Git repository.

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
