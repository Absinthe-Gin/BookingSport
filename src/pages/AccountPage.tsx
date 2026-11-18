import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon, type IconName } from '@/components/common/Icon';
import { Modal } from '@/components/common/Modal';
import { BrandLogo } from '@/components/layout/HomeHeader';
import { BookingList } from '@/features/booking/components/BookingList';
import { useAuth } from '@/app/providers/AuthProvider';
import { useDialog } from '@/app/providers/DialogProvider';
import { useToast } from '@/app/providers/ToastProvider';
import { useIsDesktop } from '@/hooks/useMediaQuery';

const APP_VERSION = '2.10.7';

function MenuRow({ icon, label, onClick }: { icon: IconName; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex h-[51px] w-full items-center gap-3 border-b border-line px-3 text-left text-[17px] text-ink last:border-0 hover:bg-primary-soft/60">
      <Icon name={icon} size={24} className="text-primary-deep" />
      <span className="flex-1">{label}</span>
      <Icon name="chevron-right" size={20} className="text-ink" />
    </button>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-4">
      <h2 className="mb-2 text-[17px] font-bold text-primary">{title}</h2>
      <div className="overflow-hidden rounded-lg bg-white">{children}</div>
    </section>
  );
}

const WHATS_NEW = [
  'Đặt lịch theo sân trên bảng trạng thái trực quan, chọn nhiều khung giờ và nhiều sân.',
  'Mua vé Social, lọc theo khoảng cách, môn thể thao, buổi và mức giá.',
  'Bản đồ sân xung quanh, lưu sân yêu thích và quản lý lịch đã đặt.',
];

export default function AccountPage() {
  const { user, ready, logout } = useAuth();
  const dialog = useDialog();
  const toast = useToast();
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const [modal, setModal] = useState<'terms' | 'news' | null>(null);
  const [showList, setShowList] = useState(false);
  const prompted = useRef(false);

  useEffect(() => {
    if (ready && !user && !prompted.current) {
      prompted.current = true;
      void dialog.alert('Tạo tài khoản để dễ dàng quản lý và lưu trữ lịch đặt của bạn.');
    }
  }, [ready, user, dialog]);

  const listVisible = isDesktop || showList;

  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      <aside className={`${listVisible && !isDesktop ? 'hidden' : 'flex'} w-full flex-col bg-linear-to-b from-[#3f9a5c] to-primary-soft to-[160px] lg:w-[469px] lg:shrink-0`}>
        <div className="mt-[82px] flex-1 rounded-t-[28px] bg-[#eaf7ef] px-5 pt-5 pb-8">
          <div className="flex items-start gap-4">
            <BrandLogo size={72} />
            <div className="min-w-0">
              {user ? (
                <>
                  <p className="text-[19px] font-bold text-ink">{user.fullName}</p>
                  <p className="text-sm text-muted">{user.phone}{user.email ? ` · ${user.email}` : ''}</p>
                </>
              ) : (
                <>
                  <p className="text-[19px] leading-6 font-bold text-ink">ALOBO - Đặt lịch online sân thể thao</p>
                  <p className="mt-1 text-sm text-accent">Tạo tài khoản để nhận nhiều ưu đãi hơn</p>
                  <div className="mt-2 flex gap-5">
                    <Link to="/uLogin" state={{ from: '/account' }} className="flex h-8 w-28 items-center justify-center rounded bg-primary text-[15px] font-semibold text-white">Đăng nhập</Link>
                    <Link to="/uRegister" state={{ from: '/account' }} className="flex h-8 w-28 items-center justify-center rounded border border-ink text-[15px] font-semibold text-ink">Đăng kí</Link>
                  </div>
                </>
              )}
            </div>
          </div>

          <Section title="Hoạt động">
            <MenuRow icon="calendar-list" label="Danh sách lịch đã đặt" onClick={() => (isDesktop ? document.getElementById('booking-list')?.focus() : setShowList(true))} />
          </Section>
          <Section title="Hệ thống">
            <MenuRow icon="info" label={`Thông tin phiên bản: ${APP_VERSION}`} onClick={() => toast.show(`Bạn đang dùng phiên bản ${APP_VERSION}`)} />
            <MenuRow icon="shield" label="Điều khoản và chính sách" onClick={() => setModal('terms')} />
            <MenuRow icon="sparkle" label="Ứng dụng có gì mới" onClick={() => setModal('news')} />
            <MenuRow icon="translate" label="Ngôn ngữ - Tiếng Việt" onClick={() => toast.show('Hiện chỉ hỗ trợ Tiếng Việt')} />
            {user && (
              <MenuRow icon="logout" label="Đăng xuất" onClick={async () => {
                if (await dialog.confirm('Bạn muốn đăng xuất khỏi tài khoản?', 'Đăng xuất')) { logout(); toast.show('Đã đăng xuất'); navigate('/account'); }
              }} />
            )}
          </Section>
        </div>
      </aside>

      {listVisible && (
        <section id="booking-list" tabIndex={-1} aria-label="Danh sách đặt lịch" className="min-w-0 flex-1 bg-white outline-none">
          <header className="flex h-14 items-center bg-linear-to-r from-primary to-[#12b04f] px-2 text-white">
            {!isDesktop && (
              <button type="button" onClick={() => setShowList(false)} aria-label="Quay lại" className="flex h-12 w-12 items-center justify-center"><Icon name="chevron-left" size={24} strokeWidth={2.4} /></button>
            )}
            <h1 className="flex-1 text-center text-xl font-semibold">Danh sách đặt lịch</h1>
            {!isDesktop && <span className="w-12" />}
          </header>
          <BookingList />
        </section>
      )}

      <Modal open={modal !== null} onClose={() => setModal(null)} title={modal === 'terms' ? 'Điều khoản và chính sách' : 'Ứng dụng có gì mới'} className="max-w-[560px]">
        {modal === 'terms' ? (
          <p className="px-6 pt-4 pb-8 text-center text-[15px] text-ink">Nội dung điều khoản và chính sách đang được cập nhật.</p>
        ) : (
          <ul className="list-disc space-y-2 px-10 pt-4 pb-8 text-[15px] text-ink">
            <li className="list-none -ml-4 font-bold text-primary">Phiên bản {APP_VERSION}</li>
            {WHATS_NEW.map((t) => <li key={t}>{t}</li>)}
          </ul>
        )}
      </Modal>
    </div>
  );
}
