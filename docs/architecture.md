# Architecture

## Overview

```
BookingSport/
├─ index.html, vite.config.ts      Vite + React 19 + Tailwind v4 frontend
├─ src/                            Frontend (TypeScript)
│  ├─ app/router                   Route table (React Router 7, lazy pages)
│  ├─ app/providers                Toast, Dialog, Auth, Location, Favorites contexts
│  ├─ components/common            Icon, Modal/Sheet, Button, Avatar
│  ├─ components/feedback          Spinner, LoadingBlock, EmptyState, ErrorState
│  ├─ components/forms             Field, TextInput, PasswordInput, PhoneInput, TextArea
│  ├─ components/layout            HomeHeader, PageHeader
│  ├─ components/navigation        BottomNav, HomeToolbar
│  ├─ features/<name>/components   Feature UI (venues, booking, social, explore, auth, onboarding)
│  ├─ layouts/AppShell             Pages that show the bottom navigation
│  ├─ pages/                       One file per route
│  ├─ services/api.ts              Typed fetch client for /api
│  ├─ hooks/                       useAsync, useMediaQuery
│  ├─ constants/, data/, utils/    Sports list, static copy, date helpers
│  └─ styles/index.css             Design tokens (@theme) and global styles
├─ shared/                         Types and schedule helpers used by both sides
├─ server/                         Express 5 API, runs TypeScript directly on Node 24
│  ├─ db.ts                        node:sqlite schema (no native modules)
│  ├─ seed.ts, data/               Seed data taken from the source site
│  ├─ lib/                         auth (JWT), venues + availability, time (VN timezone), seeded random
│  └─ routes/                      auth, venues, bookings, favorites, social, content
├─ public/assets/                  Images and icons from the source site
├─ scripts/                        Playwright: source capture, screenshots, e2e tests
└─ docs/                           Inventory, architecture, plan, progress, reference screenshots
```

## Runtime

- `npm run dev` starts the API on `:4000` (`node --watch server/index.ts`) and Vite on `:5180`.
  Vite sends `/api` requests to the API.
- `npm run build` type-checks the frontend and the server, then builds `dist/`.
  `npm run start:api` serves the API and, when `dist/` exists, the built frontend.
- The database is SQLite at `server/data/booking.db` (git-ignored). It is created and seeded on first start.
  `npm run seed -- --force` resets it.

## Data flow

1. Pages call `api.*` from `src/services/api.ts` through `useAsync`. That gives `data`, `loading`, `error` and `reload`,
   so every page has loading, error and empty states.
2. The JWT is kept in `localStorage` and sent as `Authorization: Bearer`. `optionalAuth` adds `req.user` to every API call.
   `requireAuth` protects favourites and "my bookings".
3. Guests keep favourites in `localStorage`. When they sign in, these are merged into the server list.

## Booking model

- A day is split into 30-minute slots from `openHour` to `closeHour` (`shared/schedule.ts`).
- `computeAvailability(venue, date)` fills the grid in this order:
  1. Simulated occupancy from a seeded random generator, so a venue and date always show the same pattern,
     like a busy real venue.
  2. Real bookings from `booking_slots`.
  3. Past slots for today, in Vietnam time.
- `POST /api/bookings` checks the price and checks again that every slot is still free inside one transaction.
  The `UNIQUE(venue_slug, date, court, slot)` index stops double bookings when two requests race.
- Prices use the venue's walk-in ("Vãng lai") rate per hour, split into 30-minute halves.
- Payment is **simulated**. The clone has no payment gateway: `POST /api/bookings/:code/pay` marks a booking as paid.
- To look up a booking by code, you must give the booking's phone number or be its signed-in owner.

## Design tokens

Defined once in `src/styles/index.css` under `@theme`: colours, radii, shadows, z-index and the `lg` = 1024px breakpoint.
Components only use these tokens through Tailwind classes such as `bg-primary`, `text-distance` and `shadow-card`.

## Decisions

| Decision | Reason |
|---|---|
| React + Vite + TS instead of Flutter | Matches the brief. The source's canvas output cannot be reused anyway |
| Mulish instead of Averta | Averta is a paid font. Mulish is OFL and is already listed in the source's font manifest |
| `node:sqlite` | No native build step on Windows; built into Node 24 |
| Leaflet + OSM instead of Google Maps | No API key needed |
| Seeded simulated occupancy | The source's live occupancy API needs signed requests. The grid needs realistic data to be useful |
