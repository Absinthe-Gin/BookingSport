import { NavLink } from 'react-router-dom';
import { Icon, type IconName } from '@/components/common/Icon';

const items: { to: string; label: string; icon: IconName; active: IconName; end?: boolean }[] = [
  { to: '/', label: 'Trang chủ', icon: 'home', active: 'home-fill', end: true },
  { to: '/map', label: 'Bản đồ', icon: 'map-pin', active: 'map-pin-fill' },
  { to: '/explore', label: 'Khám phá', icon: 'newspaper', active: 'newspaper' },
  { to: '/featured', label: 'Nổi bật', icon: 'flame', active: 'flame-fill' },
  { to: '/account', label: 'Tài khoản', icon: 'user', active: 'user-fill' },
];

export const BOTTOM_NAV_HEIGHT = 80;

export function BottomNav() {
  return (
    <nav aria-label="Điều hướng chính" className="fixed right-0 bottom-0 left-0 z-(--z-nav) h-20 rounded-t-[18px] bg-white shadow-nav">
      <ul className="grid h-full grid-cols-5">
        {items.map((it) => {
          const center = it.to === '/explore';
          return (
            <li key={it.to} className="relative flex">
              <NavLink to={it.to} end={it.end}
                className={({ isActive }) => `flex flex-1 flex-col items-center justify-end pb-3 text-[13px] sm:text-[15px] ${isActive ? 'font-bold text-brand-green' : 'text-[#8a8f8c]'}`}>
                {({ isActive }) => (
                  <>
                    {center ? (
                      <span className="absolute -top-[26px] left-1/2 flex h-[76px] w-[76px] -translate-x-1/2 items-start justify-center rounded-full bg-white pt-[6px] shadow-[0_-6px_12px_rgb(29_180_90/0.18)]">
                        <span className={`flex h-16 w-16 items-center justify-center rounded-full border-[2.5px] border-brand-green ${isActive ? 'bg-brand-green text-white' : 'bg-white text-primary'}`}>
                          <Icon name="newspaper" size={30} strokeWidth={1.7} />
                        </span>
                      </span>
                    ) : (
                      <Icon name={isActive ? it.active : it.icon} size={26} strokeWidth={1.6} className={isActive ? 'text-brand-green' : 'text-[#8a8f8c]'} />
                    )}
                    <span className={center ? 'mt-auto' : 'mt-1'}>{it.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
