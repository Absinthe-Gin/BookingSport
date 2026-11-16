import { useState } from 'react'
import { Link } from 'react-router-dom'
import { sportById } from '../data.js'
import { bookingCode, fmtDate, fmtMoney, slotLabel } from '../utils.js'
import { useStore } from '../store.jsx'
import Modal from './Modal.jsx'

export default function CheckoutModal({ venue, date, sport, ranges, total, onClose, onDone }) {
  const { user, addBooking, notify } = useStore()
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [note, setNote] = useState('')
  const [pay, setPay] = useState('venue')
  const [error, setError] = useState('')
  const [done, setDone] = useState(null)

  const deposit = pay === 'transfer' ? Math.round(total * 0.3) : 0

  const submit = (e) => {
    e.preventDefault()
    if (!name.trim()) return setError('Vui lòng nhập họ tên.')
    if (!/^0\d{9}$/.test(phone.replace(/\s/g, ''))) return setError('Số điện thoại không hợp lệ.')
    const booking = {
      code: bookingCode(),
      venueId: venue.id,
      venueName: venue.name,
      sport,
      date,
      ranges,
      total,
      deposit,
      pay,
      name: name.trim(),
      phone: phone.replace(/\s/g, ''),
      note: note.trim(),
      status: pay === 'transfer' ? 'pending' : 'confirmed',
      createdAt: new Date().toISOString(),
    }
    addBooking(booking)
    onDone()
    setDone(booking)
    notify('Đặt lịch thành công!')
  }

  const courtName = (id) => venue.courts.find((c) => c.id === id)?.name

  if (done) {
    return (
      <Modal title="Đặt lịch thành công" onClose={onClose}>
        <div className="success">
          <div className="success-icon" aria-hidden>✓</div>
          <p>Mã đặt lịch của bạn</p>
          <p className="code">{done.code}</p>
          {done.pay === 'transfer' ? (
            <div className="transfer">
              <p>Chuyển khoản cọc <strong>{fmtMoney(done.deposit)}</strong> với nội dung <strong>{done.code}</strong>.</p>
              <p className="muted small">Lịch được giữ 15 phút. Chủ sân xác nhận sau khi nhận cọc.</p>
            </div>
          ) : (
            <p className="muted">Thanh toán {fmtMoney(done.total)} tại quầy khi đến sân.</p>
          )}
          <div className="row-actions">
            <button className="btn" onClick={onClose}>Đặt thêm</button>
            <Link to="/lich-cua-toi" className="btn btn-primary">Xem lịch của tôi</Link>
          </div>
        </div>
      </Modal>
    )
  }

  return (
    <Modal title="Xác nhận đặt lịch" onClose={onClose} wide>
      <div className="checkout">
        <div className="checkout-summary">
          <h4>{venue.name}</h4>
          <p className="muted small">{sportById(sport).name} · {fmtDate(date)}</p>
          <ul className="sel-list">
            {ranges.map((r) => (
              <li key={`${r.courtId}-${r.start}`}>
                <span>{courtName(r.courtId)}</span>
                <span>{slotLabel(r.start)} – {slotLabel(r.end)}</span>
              </li>
            ))}
          </ul>
          <div className="total"><span>Tổng tiền</span><strong>{fmtMoney(total)}</strong></div>
          {deposit > 0 && <div className="total sub"><span>Đặt cọc (30%)</span><strong>{fmtMoney(deposit)}</strong></div>}
        </div>

        <form className="form" onSubmit={submit}>
          <label>Họ và tên<input value={name} onChange={(e) => setName(e.target.value)} /></label>
          <label>Số điện thoại<input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" /></label>
          <label>Ghi chú<textarea rows="2" value={note} onChange={(e) => setNote(e.target.value)} placeholder="VD: cần thuê vợt, nước…" /></label>
          <fieldset className="pay">
            <legend>Thanh toán</legend>
            <label className="radio">
              <input type="radio" name="pay" checked={pay === 'venue'} onChange={() => setPay('venue')} />
              Thanh toán tại sân
            </label>
            <label className="radio">
              <input type="radio" name="pay" checked={pay === 'transfer'} onChange={() => setPay('transfer')} />
              Chuyển khoản đặt cọc 30%
            </label>
          </fieldset>
          {error && <p className="error">{error}</p>}
          <button className="btn btn-primary btn-block" type="submit">Xác nhận đặt lịch</button>
        </form>
      </div>
    </Modal>
  )
}
