import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '@/components/common/Icon';
import { VnFlag } from '@/components/forms/Fields';
import { useAuth } from '@/app/providers/AuthProvider';
import { useToast } from '@/app/providers/ToastProvider';
import { longDate, todayLocal } from '@/utils/date';

export function BrandLogo({ size = 64 }: { size?: number }) {
  return (
    <span className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-deep" style={{ width: size, height: size }}>
      <img src="/assets/icons/ic_alobo.png" alt="ALO Booking" className="h-full w-full object-cover" />
    </span>
  );
}

/** Green header with the date, login/register or the signed-in user. */
export function HomeHeader() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  return (
    <div className="header-bg relative h-[104px] px-2 pt-2 sm:h-[118px] lg:h-[108px]">
      <div className="flex items-start gap-2.5">
        <Link to="/" aria-label="Trang chủ"><BrandLogo size={64} /></Link>
        <div className="min-w-0 pt-2.5">
          <p className="text-[15px] text-white">{longDate(todayLocal())}</p>
          {user ? (
            <button type="button" onClick={() => navigate('/account')} className="mt-1.5 max-w-[60vw] truncate text-lg font-bold text-white">
              Xin chào, {user.fullName}
            </button>
          ) : (
            <div className="mt-2.5 hidden gap-2.5 sm:flex">
              <Link to="/uLogin" className="flex h-8 w-[180px] items-center justify-center rounded bg-white text-[15px] font-semibold text-primary-deep lg:w-[240px]">Đăng nhập</Link>
              <Link to="/uRegister" className="flex h-8 w-[180px] items-center justify-center rounded border-2 border-white/90 text-[15px] font-semibold text-white lg:w-[240px]">Đăng kí</Link>
            </div>
          )}
        </div>
        <div className="ml-auto flex items-center gap-4 pt-2 pr-2">
          <button type="button" aria-label="Tin nhắn" onClick={() => (user ? toast.show('Chưa có cuộc trò chuyện nào') : navigate('/uLogin'))} className="text-white">
            <Icon name="chat-round" size={26} strokeWidth={2} />
          </button>
          <button type="button" aria-label="Đổi ngôn ngữ" onClick={() => toast.show('Hiện chỉ hỗ trợ Tiếng Việt')}>
            <VnFlag size={26} />
          </button>
        </div>
      </div>
    </div>
  );
}
