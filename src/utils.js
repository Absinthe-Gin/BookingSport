export const SLOT_MIN = 30

export const fmtMoney = (n) => n.toLocaleString('vi-VN') + 'đ'

export const toISODate = (d) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export const parseISODate = (s) => {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
export const weekdayShort = (d) => WEEKDAYS[d.getDay()]

export const fmtDate = (iso) => {
  const d = parseISODate(iso)
  const names = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
  return `${names[d.getDay()]}, ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`
}

export const nextDays = (n) => {
  const out = []
  const today = new Date()
  for (let i = 0; i < n; i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i)
    out.push(d)
  }
  return out
}

/** Slot index s = minutes from midnight / 30. */
export const slotsFor = (venue) => {
  const out = []
  for (let s = venue.open * 2; s < venue.close * 2; s++) out.push(s)
  return out
}

export const slotLabel = (s) => {
  const h = Math.floor(s / 2)
  const m = s % 2 ? '30' : '00'
  return `${String(h % 24).padStart(2, '0')}:${m}`
}

export const isWeekend = (iso) => {
  const day = parseISODate(iso).getDay()
  return day === 0 || day === 6
}

export const isPeak = (s) => s >= 34 && s < 42 // 17:00 – 21:00

/** Price for one 30-minute slot. */
export const slotPrice = (venue, iso, s) => {
  const hourly = isWeekend(iso) ? venue.price.weekend : isPeak(s) ? venue.price.peak : venue.price.base
  return hourly / 2
}

const hash = (str) => {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  // final avalanche so near-identical keys spread evenly
  h ^= h >>> 16
  h = Math.imul(h, 0x85ebca6b)
  h ^= h >>> 13
  h = Math.imul(h, 0xc2b2ae35)
  h ^= h >>> 16
  return (h >>> 0) / 4294967295
}

/** Deterministic "booked by other customers" demo data, in 1-hour blocks. */
export const isBookedByOthers = (venueId, courtId, iso, s) => {
  const block = Math.floor(s / 2)
  const busy = isPeak(s) ? 0.55 : 0.22
  return hash(`${venueId}|${courtId}|${iso}|${block}`) < busy
}

export const isPast = (iso, s) => {
  const now = new Date()
  const d = parseISODate(iso)
  d.setMinutes(s * SLOT_MIN)
  return d <= now
}

/** Group selected slot keys into contiguous ranges per court. */
export const groupSelection = (selected) => {
  const byCourt = {}
  for (const key of selected) {
    const [courtId, s] = key.split(':')
    ;(byCourt[courtId] ||= []).push(Number(s))
  }
  const ranges = []
  for (const [courtId, list] of Object.entries(byCourt)) {
    list.sort((a, b) => a - b)
    let start = list[0]
    let prev = list[0]
    for (let i = 1; i <= list.length; i++) {
      if (list[i] !== prev + 1) {
        ranges.push({ courtId, start, end: prev + 1 })
        start = list[i]
      }
      prev = list[i]
    }
  }
  return ranges
}

export const bookingCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let c = 'SG'
  for (let i = 0; i < 6; i++) c += chars[Math.floor(Math.random() * chars.length)]
  return c
}

export const venueImage = (hue) =>
  `linear-gradient(135deg, hsl(${hue} 60% 42%), hsl(${(hue + 40) % 360} 55% 30%))`

export const minPrice = (v) => Math.min(v.price.base, v.price.peak, v.price.weekend)
