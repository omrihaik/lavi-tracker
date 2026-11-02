# DEC-01 — Tech stack for the MVP

**Status:** Decided — 2026-11-02
**Date:** 2026-11-02
**Linked:** PRD-MVP (FR-6, FR-8), I-02, Constraints.md

---

## Decision criteria (from Constraints.md and the PRD)

1. **$0** — free tier, no credit card required
2. **Real-time sync** between two phones (FR-6: < 5 seconds)
3. **Works offline**, syncs later (FR-8 — logging at night with weak signal)
4. **Managed** — nothing to run, update or keep alive
5. **Private data, public code** — access controlled by login, not by hiding the code

---

## Decision 1 — Database + sync + login

| Criterion | Firebase (Firestore + Auth) | Supabase (Postgres + Auth) |
|---|---|---|
| $0 | Yes — free plan | Yes — free plan |
| Real-time | Yes, built in | Yes, built in |
| **Offline, sync later** | **Yes, built in** | No — must be built by hand |
| **Stays alive without attention** | **Yes** | Free projects pause after a period of inactivity |
| Analysis queries (for I-04) | Weaker (no SQL) — fine at our size, computed in the app | Strong (SQL) |
| Data export | Yes | Yes |

**Recommendation: Firebase.** Offline logging is a direct requirement of the North Star — a log lost at 3 a.m. because of no signal is an incomplete sleep. Supabase's advantage (SQL) matters for I-04, but with ~30 events a day the app can compute the insights itself.

**Login:** Sign in with Google — one tap, nothing to remember. Requires both parents to have a Google account.

**Access rule:** Only two specific user IDs can read or write. The rule lives in the public repo, so it uses anonymous IDs — never emails or names.

---

## Decision 2 — Hosting

| Option | Why |
|---|---|
| **GitHub Pages (recommended)** | Free for public repos; deploys automatically on every push via GitHub Actions — the next GitHub skill to learn |
| Firebase Hosting | Also free; one less account, but nothing new to learn |

---

## Decision 3 — App code

**React + TypeScript + Vite, as an installable web app (PWA).**
- Widely documented — easiest for Claude to build and for anyone to read later.
- One codebase for iPhone and Android.
- Lives in `app/`.

---

## Verify before building

Free-plan limits change. At setup (Step 6), confirm on the providers' current pricing pages that the free plans still cover: 2 users, ~1,000 events/month, real-time, offline.

---

## Decision

- [x] Firebase + Google sign-in (both parents have Google accounts)
- [x] GitHub Pages
- [x] React + TypeScript + Vite PWA

Decided by: Parent 1 · Date: 2026-11-02
