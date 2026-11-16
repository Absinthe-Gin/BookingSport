import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AMENITIES, sportById, venueById } from '../data.js'
import {
  fmtDate, fmtMoney, groupSelection, isBookedByOthers, isPast, isPeak, nextDays,
  slotLabel, slotPrice, slotsFor, toISODate, venueImage, weekdayShort,
} from '../utils.js'
import { useStore } from '../store.jsx'
import { FavButton } from '../components/VenueCard.jsx'
import CheckoutModal from '../components/CheckoutModal.jsx'

export default function VenueRoute(props) {
  const { id } = useParams()
  return <VenuePage key={id} id={id} {...props} />
}

function VenuePage({ id, onNeedLogin }) {
  const venue = venueById(id)
  const { user, myTakenSlots } = useStore()
  const days = useMemo(() => nextDays(14), [])
  const [date, setDate] = useState(() => toISODate(days[0]))
  const [sport, setSport] = useState(venue?.sports[0])
  const [selected, setSelected] = useState(() => new Set())
  const [checkout, setCheckout] = useState(false)

  const pickDate = (iso) => { setDate(iso); setSelected(new Set()) }
  const pickSport = (s) => { setSport(s); setSelected(new Set()) }

  const mine = myTakenSlots(id, date)

  if (!venue) {
    return (
      <div className="container empty">
        <h2>Không tìm thấy sân</h2>
        <Link to="/" className="btn btn-primary">Quay lại danh sách</Link>
      </div>
    )
  }

  const slots = slotsFor(venue)
  const courts = venue.courts.filter((c) => c.sport === sport)

  const status = (courtId, s) => {
    if (mine.has(`${courtId}:${s}`)) return 'mine'
    if (isPast(date, s)) return 'past'
    if (isBookedByOthers(venue.id, courtId, date, s)) return 'booked'
    return selected.has(`${courtId}:${s}`) ? 'selected' : 'free'
  }

  const toggle = (courtId, s) => {
    const key = `${courtId}:${s}`
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const ranges = groupSelection(selected)
  const total = [...selected].reduce((sum, k) => sum + slotPrice(venue, date, Number(k.split(':')[1])), 0)
  const shortRange = ranges.some((r) => r.end - r.start < 2)

  const startCheckout = () => {
    if (!user) return onNeedLogin()
    setCheckout(true)
  }

  return (
    <>
      <section className="venue-hero" style={{ background: venueImage(venue.hue) }}>
        <div className="container">
          <Link to="/" className="back">← Danh sách sân</Link>
          <div className="venue-title">
            <h1>{venue.name}</h1>
            <FavButton id={venue.id} />
          </div>
          <p>📍 {venue.address}, {venue.district}, Hà Nội</p>
          <p>★ {venue.rating} ({venue.reviews} đánh giá) · 🕒 {venue.open}:00 – {venue.close}:00 · ☎ {venue.phone}</p>
        </div>
      </section>

      <div className="container venue-layout">
        <div className="venue-main">
          <section className="panel">
            <h2>Chọn lịch</h2>

            {venue.sports.length > 1 && (
              <div className="chips">
                {venue.sports.map((s) => (
                  <button key={s} className={`chip ${sport === s ? 'active' : ''}`} onClick={() => pickSport(s)}>
                    {sportById(s).icon} {sportById(s).name}
                  </button>
                ))}
              </div>
            )}

            <div className="date-strip" role="listbox" aria-label="Chọn ngày">
              {days.map((d) => {
                const iso = toISODate(d)
                return (
                  <button
                    key={iso}
                    role="option"
                    aria-selected={iso === date}
                    className={`date-pill ${iso === date ? 'active' : ''} ${d.getDay() % 6 === 0 ? 'weekend' : ''}`}
                    onClick={() => pickDate(iso)}
                  >
                    <span>{weekdayShort(d)}</span>
                    <strong>{d.getDate()}</strong>
                    <span>Th{d.getMonth() + 1}</span>
                  </button>
                )
              })}
            </div>

            <div className="legend">
              <span><i className="cell free" /> Trống</span>
              <span><i className="cell selected" /> Đang chọn</span>
              <span><i className="cell booked" /> Đã đặt</span>
              <span><i className="cell mine" /> Lịch của bạn</span>
              <span><i className="cell past" /> Đã qua</span>
              <span><i className="peak-dot" /> Giờ cao điểm</span>
            </div>

            <div className="timetable-wrap">
              <table className="timetable">
                <thead>
                  <tr>
                    <th className="sticky-col">Sân</th>
                    {slots.map((s) => (
                      <th key={s} className={isPeak(s) ? 'peak' : ''}>
                        {s % 2 === 0 ? slotLabel(s) : ''}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {courts.map((c) => (
                    <tr key={c.id}>
                      <th className="sticky-col">{c.name}</th>
                      {slots.map((s) => {
                        const st = status(c.id, s)
                        const clickable = st === 'free' || st === 'selected'
                        return (
                          <td key={s}>
                            <button
                              className={`cell ${st}`}
                              disabled={!clickable}
                              aria-pressed={st === 'selected'}
                              aria-label={`${c.name} ${slotLabel(s)}–${slotLabel(s + 1)}`}
                              title={`${c.name} · ${slotLabel(s)}–${slotLabel(s + 1)} · ${fmtMoney(slotPrice(venue, date, s))}`}
                              onClick={() => toggle(c.id, s)}
                            />
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="muted small">Mỗi ô = 30 phút. Đặt tối thiểu 1 giờ (2 ô liền nhau) mỗi sân.</p>
          </section>

          <section className="panel">
            <h2>Giới thiệu</h2>
            <p>{venue.description}</p>
            <h3>Tiện ích</h3>
            <ul className="amenities">
              {venue.amenities.map((a) => (
                <li key={a}>✓ {AMENITIES[a]}</li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="venue-side">
          <section className="panel">
            <h2>Bảng giá</h2>
            <table className="price-table">
              <tbody>
                <tr><td>T2–T6, ngoài giờ cao điểm</td><td>{fmtMoney(venue.price.base)}/h</td></tr>
                <tr><td>T2–T6, 17:00–21:00</td><td>{fmtMoney(venue.price.peak)}/h</td></tr>
                <tr><td>Thứ 7, Chủ nhật</td><td>{fmtMoney(venue.price.weekend)}/h</td></tr>
              </tbody>
            </table>
          </section>
          <section className="panel summary">
            <h2>Lịch đã chọn</h2>
            <p className="muted small">{fmtDate(date)}</p>
            {ranges.length ? (
              <ul className="sel-list">
                {ranges.map((r) => (
                  <li key={`${r.courtId}-${r.start}`}>
                    <span>{venue.courts.find((c) => c.id === r.courtId).name}</span>
                    <span>{slotLabel(r.start)} – {slotLabel(r.end)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">Chưa chọn khung giờ nào.</p>
            )}
            {shortRange && <p className="error small">Mỗi khung phải từ 1 giờ trở lên.</p>}
            <div className="total">
              <span>Tổng tiền</span>
              <strong>{fmtMoney(total)}</strong>
            </div>
            <button className="btn btn-primary btn-block" disabled={!ranges.length || shortRange} onClick={startCheckout}>
              Đặt lịch
            </button>
            {ranges.length > 0 && (
              <button className="link-btn small" onClick={() => setSelected(new Set())}>Bỏ chọn tất cả</button>
            )}
          </section>
        </aside>
      </div>

      {ranges.length > 0 && (
        <div className="mobile-bar">
          <div>
            <span className="muted small">{selected.size * 30} phút</span>
            <strong>{fmtMoney(total)}</strong>
          </div>
          <button className="btn btn-primary" disabled={shortRange} onClick={startCheckout}>Đặt lịch</button>
        </div>
      )}

      {checkout && (
        <CheckoutModal
          venue={venue}
          date={date}
          sport={sport}
          ranges={ranges}
          total={total}
          onClose={() => setCheckout(false)}
          onDone={() => setSelected(new Set())}
        />
      )}
    </>
  )
}
