# Implementation Plan

| # | Milestone | Scope | Quality gate |
|---|---|---|---|
| 1 | Foundation | Tooling, design tokens, API + DB + seed, assets, app shell, header, toolbar, venue grid, detail panel, booking-type modal, onboarding | build passes, API smoke test, home renders on desktop and mobile |
| 2 | Booking flow | `/userBooking/:slug` grid (dates, legend, zoom, select, summary), price page, confirm form + validation, payment page, booking result | can book a free slot end to end, double booking is rejected |
| 3 | Auth + account | `/uLogin` (phone/email tabs), `/uRegister`, `/account` (menu + booking list, cancel), guest dialog, favourites page | register, login, logout, favourites persist |
| 4 | Search + map | `/search` with filter panel (sport, keyword chips, distance), `/map` (Leaflet, sport chips, markers, list toggle) | filters change the results, markers open the venue |
| 5 | Social + Explore | `/socialNearby` and the Explore Social tab (filters, date strip, venue groups, tickets, join), Explore feed tabs, `/featured` banners | filters work, joining updates the spot count |
| 6 | Responsive + QA | Tablet/mobile checks, visual comparison with the reference shots, e2e script | no layout breaks at 390/768/1440, e2e passes |
