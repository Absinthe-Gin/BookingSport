# Progress

Last updated: 2026-11-18. Branch: `main`, remote `origin` (github.com/Absinthe-Gin/BookingSport).

## How to resume

1. `npm install`, then `npm run dev` (API on :4000, web on :5180).
2. `node scripts/e2e.mjs` runs every end-to-end suite. `node scripts/responsive.mjs` checks phone, tablet and desktop layouts.
   Both need the dev servers running.
3. Screenshots go to `docs/reference/compare/` (git-ignored). Source reference shots are in `docs/reference/{desktop,mobile,tablet,interactions}`.

## Milestones

| # | Milestone | Commits | Push | Tests |
|---|---|---|---|---|
| 1 | Foundation: tooling, inventory, API + SQLite, shell, home, detail panel, onboarding | `66a8be6`, `d97e2e1`, `e7cb587`, `b4dcb09` | pushed | build OK, API smoke test (venues, availability, booking, double booking, auth, favourites, social) |
| 2 | Booking flow: grid, prices, confirm, payment | `19453cb`, `8a762b9` | pushed | e2e `booking`, `booking-conflict` |
| 3 | Auth + account + favourites | `8eca07c`, `ba97462` | pushed | e2e `auth` |
| 4 | Search with filters, map | `130c8d2`, `264c6cc` | pushed | e2e `search`, `map` |
| 5 | Social, Explore feed, Featured | `9d49c2a` and the test commit before it | pushed | e2e `social`, `explore` |
| 6 | Responsive QA, docs | see `git log` | pushed | `responsive.mjs`: no overflow and no runtime errors on 14 routes × 3 sizes; all 7 e2e suites pass; production build serves `dist/` and deep links |

## Visual comparison (source vs clone)

| Screen | Result |
|---|---|
| Home (desktop, mobile) | Same layout, toolbar, 3/2/1-column grid, cards, chips, bottom nav |
| Onboarding | Near pixel match |
| Booking grid, confirm form | Same structure, colours and copy |
| Venue detail panel | Same 592px left panel, pills, info card, six tabs |
| Login, register, account | Same layout and copy |
| Search filter panel | Same sections and controls |
| Explore Social, feed tabs | Same two-column layout, filters, ticket cards and post cards |
| Map | Leaflet + OSM instead of Google Maps. Same search pill, sport chips, controls |

## Known gaps

- Payment is simulated (bank-transfer screen and a "Tôi đã chuyển khoản" button). There is no payment gateway.
- Occupancy on the booking grid is simulated with a fixed seed. Real bookings made in the clone are added on top.
- Prices, court counts and coordinates are **estimated** for every venue except "Pickleball cổng B Ga Hà Nội". The UI says so on the price tables.
- Chat, Google sign-in, password reset, the "Thêm dịch vụ" catalogue and the terms text could not be observed without an account. They show a notice instead.
- Two promo banners ("Gold Pickleball Q3", "WinX") were cropped from screenshots and are missing their top part.
- Headless browsers cannot load OSM map tiles. Real browsers can.
- The Averta font is replaced with Mulish for licensing reasons.
- A dev server from the old prototype is still listening on port 5173. That is why the clone uses port 5180.
