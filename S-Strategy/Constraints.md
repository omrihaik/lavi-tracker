# Constraints

Documents what limits the roadmap — capacity, technology, budget, and real-life reality.
Agents read this when planning sprints or sequencing initiatives to avoid plans that can't ship.

---

## Team / Capacity

- **Builder time: as little as possible.** One PM-parent with a newborn. Claude writes the code; the PM decides, reviews and tests. Every step must be small enough to finish in one short session.
- **No dedicated designer or developer.** Use standard, well-documented UI patterns over custom design.
- **One build thread at a time.** No parallel initiatives.

## Tech / Platform constraints

- **Phone-first, two devices: one iPhone, one Android.** Decision: a web app installed to the home screen (PWA) — one codebase, both platforms, no app-store accounts or fees.
- **One-handed, at night.** Dark mode, large tap targets.
- **Real-time sync between two phones is required** — without it, Bet 2 fails.
- **Hebrew UI, right-to-left.**
- **Public repo, private data.** Code is public; Lavie's data must live outside the repo, behind login. No real data in commits, ever.
- **Excel import is required.** The ~2 weeks of existing data (23 free-text labels) must be mapped into the 3 event types once.

## Budget / Life constraints

- **Budget: $0.** Free tiers only — hosting, database, auth. No paid app-store accounts.
- **No maintenance burden.** Prefer managed services over anything we have to run or update ourselves.
