import { useState } from 'react'
import { Link } from 'react-router-dom'
import { sportById, venueById } from '../data.js'
import { fmtDate, fmtMoney, isPast, slotLabel } from '../utils.js'
import { useStore } from '../store.jsx'

const STATUS = {
  confirmed: { label: 'Đã xác nhận', cls: 'ok' },
  pending: { label: 'Chờ đặt cọc', cls: 'warn' },
  cancelled: { label: 'Đã hủy', cls: 'off' },
  done: { label: 'Đã hoàn thành', cls: 'muted' },
}

const isFinished = (b) => isPast(b.date, Math.max(...b.ranges.map((r) => r.end)))

export default function MyBookings({ onNeedLogin }) {
  const { user, bookings, cancelBooking, notify } = useStore()
  const [tab, setTab] = useState('upcoming')

  if (!user) {
    return (
      <div className="container empty">
        <h2>Lịch của tôi</h2>
        <p>Đăng nhập để xem các lịch đã đặt.</p>
        <button className="btn btn-primary" onClick={onNeedLogin}>Đăng nhập</button>
      </div>
    )
  }

  const mine = bookings.filter((b) => b.phone === user.phone)
  const upcoming = mine.filter((b) => b.status !== 'cancelled' && !isFinished(b))
  const history = mine.filter((b) => b.status === 'cancelled' || isFinished(b))
  const list = tab === 'upcoming' ? upcoming : history

  const cancel = (b) => {
    if (!window.confirm(`Hủy lịch ${b.code}?`)) return
    cancelBooking(b.code)
    notify('Đã hủy lịch.')
  }

  return (
    <div className="container page">
      <h1>Lịch của tôi</h1>
      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === 'upcoming'} className={tab === 'upcoming' ? 'active' : ''} onClick={() => setTab('upcoming')}>
          Sắp tới ({upcoming.length})
        </button>
        <button role="tab" aria-selected={tab === 'history'} className={tab === 'history' ? 'active' : ''} onClick={() => setTab('history')}>
          Lịch sử ({history.length})
        </button>
      </div>

      {!list.length ? (
        <div className="empty">
          <p>Chưa có lịch nào.</p>
          <Link to="/" className="btn btn-primary">Tìm sân ngay</Link>
        </div>
      ) : (
        <div className="booking-list">
          {list.map((b) => {
            const venue = venueById(b.venueId)
            const st = b.status !== 'cancelled' && isFinished(b) ? STATUS.done : STATUS[b.status]
            return (
              <article key={b.code} className="card booking">
                <div className="booking-head">
                  <div>
                    <Link to={`/san/${b.venueId}`}><h3>{b.venueName}</h3></Link>
                    <p className="muted small">{sportById(b.sport).icon} {sportById(b.sport).name} · Mã <strong>{b.code}</strong></p>
                  </div>
                  <span className={`badge ${st.cls}`}>{st.label}</span>
                </div>
                <p>{fmtDate(b.date)}</p>
                <ul className="sel-list">
                  {b.ranges.map((r) => (
                    <li key={`${r.courtId}-${r.start}`}>
                      <span>{venue?.courts.find((c) => c.id === r.courtId)?.name || r.courtId}</span>
                      <span>{slotLabel(r.start)} – {slotLabel(r.end)}</span>
                    </li>
                  ))}
                </ul>
                <div className="booking-foot">
                  <span>
                    Tổng <strong>{fmtMoney(b.total)}</strong>
                    {b.deposit > 0 && <span className="muted small"> · cọc {fmtMoney(b.deposit)}</span>}
                  </span>
                  {tab === 'upcoming' && (
                    <button className="btn btn-danger btn-sm" onClick={() => cancel(b)}>Hủy lịch</button>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
