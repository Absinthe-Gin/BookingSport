import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const KEY = 'sportgo:v1'

const load = () => {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* storage unavailable */
  }
  return { user: null, bookings: [], favorites: [] }
}

const StoreCtx = createContext(null)

export function StoreProvider({ children }) {
  const [state, setState] = useState(load)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* storage unavailable */
    }
  }, [state])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(t)
  }, [toast])

  const login = useCallback((user) => setState((s) => ({ ...s, user })), [])
  const logout = useCallback(() => setState((s) => ({ ...s, user: null })), [])

  const addBooking = useCallback((b) => setState((s) => ({ ...s, bookings: [b, ...s.bookings] })), [])

  const cancelBooking = useCallback(
    (code) =>
      setState((s) => ({
        ...s,
        bookings: s.bookings.map((b) => (b.code === code ? { ...b, status: 'cancelled' } : b)),
      })),
    [],
  )

  const toggleFavorite = useCallback(
    (id) =>
      setState((s) => ({
        ...s,
        favorites: s.favorites.includes(id) ? s.favorites.filter((f) => f !== id) : [...s.favorites, id],
      })),
    [],
  )

  /** Set of "courtId:slot" keys the current device already booked for a venue/date. */
  const myTakenSlots = useCallback(
    (venueId, date) => {
      const set = new Set()
      for (const b of state.bookings) {
        if (b.venueId !== venueId || b.date !== date || b.status === 'cancelled') continue
        for (const r of b.ranges) for (let s = r.start; s < r.end; s++) set.add(`${r.courtId}:${s}`)
      }
      return set
    },
    [state.bookings],
  )

  const value = useMemo(
    () => ({ ...state, login, logout, addBooking, cancelBooking, toggleFavorite, myTakenSlots, toast, notify: setToast }),
    [state, login, logout, addBooking, cancelBooking, toggleFavorite, myTakenSlots, toast],
  )

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useStore = () => useContext(StoreCtx)
