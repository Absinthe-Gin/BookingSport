# BookingSport (ALO Booking clone)

A clone of [datlich.alobo.vn](https://datlich.alobo.vn/), the ALO Booking sports-court booking site, built with React and an Express API.
The repository owner has permission from Alobo to reuse its branding, images and data.

## Requirements

- Node.js 24 or newer. The API runs TypeScript directly and uses the built-in `node:sqlite`.

## Getting started

```bash
npm install
npm run dev          # API on http://localhost:4000, web on http://localhost:5180
```

The SQLite database (`server/data/booking.db`) is created and seeded on first start.
To reset it, run `npm run seed -- --force`.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Starts the API (watch mode) and the Vite dev server |
| `npm run build` | Type-checks everything and builds the frontend into `dist/` |
| `npm run start:api` | Starts the API in production mode and serves `dist/` if it exists. Set `JWT_SECRET` first |
| `npm run seed` | Seeds an empty database. Add `-- --force` to wipe it and seed again |
| `npm run test:e2e` | Runs the Playwright end-to-end checks. Needs `npm run dev` running |

## Documentation

- [docs/website-inventory.md](docs/website-inventory.md): what the source site has and how it was surveyed
- [docs/architecture.md](docs/architecture.md): code structure, data flow, design decisions
- [docs/implementation-plan.md](docs/implementation-plan.md): milestones
- [docs/progress.md](docs/progress.md): progress log
