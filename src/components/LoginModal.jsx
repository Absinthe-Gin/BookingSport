import { useState } from 'react'
import { useStore } from '../store.jsx'
import Modal from './Modal.jsx'

const PHONE_RE = /^0\d{9}$/

export default function LoginModal({ onClose }) {
  const { login, notify } = useStore()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const p = phone.replace(/\s/g, '')
    if (!name.trim()) return setError('Vui lòng nhập họ tên.')
    if (!PHONE_RE.test(p)) return setError('Số điện thoại gồm 10 chữ số, bắt đầu bằng 0.')
    login({ name: name.trim(), phone: p })
    notify(`Xin chào ${name.trim()}!`)
    onClose()
  }

  return (
    <Modal title="Đăng nhập" onClose={onClose}>
      <form onSubmit={submit} className="form">
        <label>
          Họ và tên
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nguyễn Văn A" autoFocus />
        </label>
        <label>
          Số điện thoại
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09xx xxx xxx" inputMode="tel" />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="btn btn-primary btn-block" type="submit">Tiếp tục</button>
        <p className="muted small">Bản demo: thông tin chỉ lưu trên trình duyệt của bạn.</p>
      </form>
    </Modal>
  )
}
