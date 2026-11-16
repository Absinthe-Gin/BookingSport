import { Link } from 'react-router-dom'
import { sportById } from '../data.js'
import { fmtMoney, minPrice, venueImage } from '../utils.js'
import { useStore } from '../store.jsx'

export function FavButton({ id }) {
  const { favorites, toggleFavorite } = useStore()
  const on = favorites.includes(id)
  return (
    <button
      className={`fav ${on ? 'on' : ''}`}
      aria-label={on ? 'Bỏ yêu thích' : 'Yêu thích'}
      aria-pressed={on}
      onClick={(e) => {
        e.preventDefault()
        toggleFavorite(id)
      }}
    >
      {on ? '♥' : '♡'}
    </button>
  )
}

export default function VenueCard({ venue: v }) {
  return (
    <Link to={`/san/${v.id}`} className="card venue-card">
      <div className="cover" style={{ background: venueImage(v.hue) }}>
        <span className="cover-icons" aria-hidden>
          {v.sports.map((s) => sportById(s).icon).join(' ')}
        </span>
        <FavButton id={v.id} />
      </div>
      <div className="card-body">
        <h3>{v.name}</h3>
        <p className="muted small">{v.address}, {v.district}</p>
        <div className="tags">
          {v.sports.map((s) => (
            <span key={s} className="tag">{sportById(s).name}</span>
          ))}
        </div>
        <div className="card-foot">
          <span className="rating">★ {v.rating} <span className="muted">({v.reviews})</span></span>
          <span className="price">từ <strong>{fmtMoney(minPrice(v))}</strong>/giờ</span>
        </div>
        <p className="muted small">🕒 {v.open}:00 – {v.close}:00 · {v.courts.length} sân</p>
      </div>
    </Link>
  )
}
