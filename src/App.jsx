import { useState } from 'react'
import { Link, NavLink, Route, Routes } from 'react-router-dom'
import { useStore } from './store.jsx'
import Home from './pages/Home.jsx'
import VenuePage from './pages/Venue.jsx'
import MyBookings from './pages/MyBookings.jsx'
import LoginModal from './components/LoginModal.jsx'

export default function App() {
  const { user, logout, toast } = useStore()
  const [loginOpen, setLoginOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <header className="topbar">
        <div className="container topbar-inner">
          <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
            <img src="/favicon.svg" alt="" width="30" height="30" />
            <span>SportGo</span>
          </Link>
          <button className="menu-btn" aria-label="Menu" onClick={() => setMenuOpen((o) => !o)}>
            ☰
          </button>
          <nav className={`nav ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(false)}>
            <NavLink to="/" end>Tìm sân</NavLink>
            <NavLink to="/lich-cua-toi">Lịch của tôi</NavLink>
            {user ? (
              <div className="user-chip">
                <span className="avatar">{user.name.charAt(0).toUpperCase()}</span>
                <span className="user-name">{user.name}</span>
                <button className="link-btn" onClick={logout}>Đăng xuất</button>
              </div>
            ) : (
              <button className="btn btn-primary btn-sm" onClick={() => setLoginOpen(true)}>
                Đăng nhập
              </button>
            )}
          </nav>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/san/:id" element={<VenuePage onNeedLogin={() => setLoginOpen(true)} />} />
          <Route path="/lich-cua-toi" element={<MyBookings onNeedLogin={() => setLoginOpen(true)} />} />
          <Route
            path="*"
            element={
              <div className="container empty">
                <h2>Không tìm thấy trang</h2>
                <Link to="/" className="btn btn-primary">Về trang chủ</Link>
              </div>
            }
          />
        </Routes>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div>
            <strong>SportGo</strong>
            <p>Nền tảng đặt lịch sân thể thao nhanh chóng, minh bạch giá.</p>
          </div>
          <div>
            <strong>Hỗ trợ</strong>
            <p>Hotline: 1900 0000 · hotro@sportgo.local</p>
          </div>
          <div>
            <strong>Dành cho chủ sân</strong>
            <p>Đăng ký đưa sân lên SportGo để quản lý lịch đặt online.</p>
          </div>
        </div>
        <div className="container copyright">© {new Date().getFullYear()} SportGo. Dữ liệu demo.</div>
      </footer>

      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  )
}
