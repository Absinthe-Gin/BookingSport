import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@/components/common/Icon';
import { useLocation } from '@/app/providers/LocationProvider';

function SearchTrigger({ className = '' }: { className?: string }) {
  const navigate = useNavigate();
  return (
    <button type="button" onClick={() => navigate('/search')} className={`flex min-w-0 flex-1 items-center gap-2 text-left ${className}`}>
      <img src="/assets/icons/ic_alobo.png" alt="" className="h-7 w-7 rounded-full" />
      <span className="h-7 w-px bg-line max-lg:hidden" />
      <span className="truncate text-[15px] text-[#9aa29e]">Tìm kiếm</span>
    </button>
  );
}

function SocialPill({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/socialNearby"
      className={`flex items-center gap-2 rounded-full bg-primary font-bold text-white ${compact ? 'h-[46px] rounded-md px-6 text-lg' : 'h-[38px] py-1 pr-4 pl-1 text-[15px]'}`}>
      <span className={`flex items-center justify-center rounded-full ${compact ? '' : 'h-8 w-8 bg-[#8ef0a9] text-primary'}`}>
        <Icon name="navigation" size={compact ? 22 : 16} />
      </span>
      Social gần đây
    </Link>
  );
}

/** Search + quick links bar under the home header. Wide screens show one bar; small screens a compact layout. */
export function HomeToolbar() {
  const navigate = useNavigate();
  const { locate, locating } = useLocation();

  return (
    <>
      <div className="relative z-10 mx-2 hidden h-12 items-center rounded-lg bg-white pr-6 pl-3 shadow-bar lg:flex">
        <SearchTrigger />
        <button type="button" onClick={locate} aria-label="Dùng vị trí của tôi" className={`mx-3 text-primary ${locating ? 'animate-pulse' : ''}`}>
          <Icon name="locate" size={22} />
        </button>
        <button type="button" onClick={() => navigate('/search?filters=1')} aria-label="Bộ lọc" className="mr-4 text-primary">
          <Icon name="sliders" size={22} />
        </button>
        <span className="mr-16 h-8 w-px bg-line" />
        <SocialPill />
        <div className="ml-auto flex items-center gap-12 text-[15px] text-primary-deep">
          <Link to="/map" className="flex items-center gap-2"><Icon name="map-fold" size={22} className="text-primary" />Bản đồ</Link>
          <Link to="/account" className="flex items-center gap-2"><Icon name="calendar-check" size={22} className="text-primary" />Sân đã đặt</Link>
          <Link to="/favorites" className="flex items-center gap-2"><Icon name="heart-fill" size={22} className="text-primary" />Yêu thích</Link>
        </div>
      </div>

      <div className="relative z-10 -mt-[21px] px-2 sm:-mt-[23px] lg:hidden">
        <div className="flex gap-2.5">
          <div className="flex h-[42px] min-w-0 flex-1 items-center rounded-lg bg-white px-3 shadow-bar">
            <SearchTrigger />
            <Icon name="search" size={22} className="text-primary" strokeWidth={2.4} />
          </div>
          <button type="button" onClick={locate} aria-label="Dùng vị trí của tôi" className="flex h-[42px] w-[42px] items-center justify-center rounded-lg bg-white text-primary shadow-bar">
            <Icon name="locate" size={22} />
          </button>
          <Link to="/favorites" aria-label="Yêu thích" className="flex h-[42px] w-[42px] items-center justify-center rounded-lg bg-white text-primary shadow-bar">
            <Icon name="heart" size={22} strokeWidth={2} />
          </Link>
        </div>
        <div className="mt-3 flex gap-2">
          <SocialPill compact />
        </div>
      </div>
    </>
  );
}
