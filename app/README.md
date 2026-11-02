# app

The LavieTracker web app — React + TypeScript + Vite, installable to the home screen (PWA).
Tech choices: `../I-Initiatives/DEC-01-tech-stack.md`. Requirements: `../I-Initiatives/PRD-MVP.md`.

## Run locally

```bash
cd app
npm install
npm run dev
```

## Deploy

Every push to `main` that touches `app/` builds and deploys to GitHub Pages
(`.github/workflows/deploy.yml`): https://omrihaik.github.io/lavi-tracker/
