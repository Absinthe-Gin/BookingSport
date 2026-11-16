# SportGo – Sports court booking

A demo web app for booking sports courts (badminton, pickleball, football, tennis, basketball, volleyball, table tennis). Built with React 19, Vite and React Router. It has no backend: data lives in `src/data.js`, and bookings are stored in the browser's `localStorage`.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production output in dist/
```

## Features

- Venue search by name or address, filters by sport and district, sorting by rating or price, favorites.
- Venue page: 14-day date strip and a court × 30-minute timetable showing free, booked, past and your own slots. Peak hours (17:00–21:00) and weekend pricing apply.
- Booking requires at least 1 hour per court. Pay at the venue or transfer a 30% deposit. Each booking gets a code.
- "Lịch của tôi": upcoming bookings and history, with cancellation.
- Mock login (name + phone number).
- Responsive layout with a sticky booking bar on mobile.

## Structure

```
src/
  data.js            sports, districts, venues, courts, prices
  utils.js           slots, pricing, date helpers, demo occupancy
  store.jsx          user / bookings / favorites state + localStorage
  pages/             Home, Venue, MyBookings
  components/        VenueCard, Modal, LoginModal, CheckoutModal
```

Slots that other customers have booked are generated deterministically from a hash, so they are demo data. To go to production, replace `isBookedByOthers` and `addBooking` with real API calls.
