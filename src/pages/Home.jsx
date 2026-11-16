import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { DISTRICTS, SPORTS, VENUES } from '../data.js'
import { minPrice } from '../utils.js'
import { useStore } from '../store.jsx'
import VenueCard from '../components/VenueCard.jsx'

export default function Home() {
  const [params, setParams] = useSearchParams()
  const { favorites } = useStore()
  const q = params.get('q') || ''
  const sport = params.get('sport') || ''
  const district = params.get('district') || ''
  const sort = params.get('sort') || 'rating'
  const favOnly = params.get('fav') === '1'

  const set = (key, value) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const list = useMemo(() => {
    const term = q.trim().toLowerCase()
    const out = VENUES.filter(
      (v) =>
        (!sport || v.sports.includes(sport)) &&
        (!district || v.district === district) &&
        (!favOnly || favorites.includes(v.id)) &&
        (!term || `${v.name} ${v.address} ${v.district}`.toLowerCase().includes(term)),
    )
    const sorters = {
      rating: (a, b) => b.rating - a.rating,
      priceAsc: (a, b) => minPrice(a) - minPrice(b),
      priceDesc: (a, b) => minPrice(b) - minPrice(a),
      reviews: (a, b) => b.reviews - a.reviews,
    }
    return out.sort(sorters[sort] || sorters.rating)
  }, [q, sport, district, sort, favOnly, favorites])

  return (
    <>
      <section className="hero">
        <div className="container">
          <h1>Đặt sân thể thao trong 30 giây</h1>
          <p>Xem lịch trống theo thời gian thực, chọn khung giờ và giữ chỗ ngay.</p>
          <div className="search-box">
            <input
              type="search"
              placeholder="Tìm tên sân, địa chỉ…"
              value={q}
              onChange={(e) => set('q', e.target.value)}
              aria-label="Tìm kiếm sân"
            />
            <select value={district} onChange={(e) => set('district', e.target.value)} aria-label="Khu vực">
              <option value="">Tất cả khu vực</option>
              {DISTRICTS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <div className="container">
        <div className="chips" role="tablist" aria-label="Môn thể thao">
          <button className={`chip ${!sport ? 'active' : ''}`} onClick={() => set('sport', '')}>
            Tất cả
          </button>
          {SPORTS.map((s) => (
            <button key={s.id} className={`chip ${sport === s.id ? 'active' : ''}`} onClick={() => set('sport', s.id)}>
              <span aria-hidden>{s.icon}</span> {s.name}
            </button>
          ))}
        </div>

        <div className="list-head">
          <h2>{list.length} sân phù hợp</h2>
          <div className="list-tools">
            <label className="check">
              <input type="checkbox" checked={favOnly} onChange={(e) => set('fav', e.target.checked ? '1' : '')} />
              Sân yêu thích
            </label>
            <select value={sort} onChange={(e) => set('sort', e.target.value)} aria-label="Sắp xếp">
              <option value="rating">Đánh giá cao</option>
              <option value="reviews">Nhiều lượt đánh giá</option>
              <option value="priceAsc">Giá thấp → cao</option>
              <option value="priceDesc">Giá cao → thấp</option>
            </select>
          </div>
        </div>

        {list.length ? (
          <div className="grid">
            {list.map((v) => (
              <VenueCard key={v.id} venue={v} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <p>Không có sân nào khớp bộ lọc.</p>
            <button className="btn" onClick={() => setParams({}, { replace: true })}>Xóa bộ lọc</button>
          </div>
        )}
      </div>
    </>
  )
}
