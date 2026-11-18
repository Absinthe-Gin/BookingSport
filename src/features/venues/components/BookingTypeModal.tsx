import { useNavigate } from 'react-router-dom';
import { Modal } from '@/components/common/Modal';
import { Icon } from '@/components/common/Icon';

/** "CHỌN HÌNH THỨC ĐẶT": court booking grid or social tickets. */
export function BookingTypeModal({ slug, onClose }: { slug: string | null; onClose: () => void }) {
  const navigate = useNavigate();
  const go = (to: string) => { onClose(); navigate(to); };

  return (
    <Modal open={!!slug} onClose={onClose} title="Chọn hình thức đặt" className="max-w-[600px]">
      <div className="space-y-4 p-4 pt-5">
        <button type="button" onClick={() => go(`/userBooking/${slug}`)}
          className="relative block w-full rounded-lg bg-[#d4fbcf] px-3 pt-3 pb-4 text-left hover:brightness-[0.98]">
          <span className="block text-lg font-bold text-[#1e8e15] uppercase">Đặt lịch theo sân - trực quan</span>
          <span className="mt-2 block pr-16 text-[15px] text-[#2c6b25]">Đặt lịch theo sân trên bảng trạng thái sân, có thể lựa chọn nhiều khung giờ, nhiều sân</span>
          <span className="absolute right-0 bottom-0 flex h-[30px] w-[60px] items-center justify-center rounded-tl-xl rounded-br-lg bg-[#3fc72b] text-white">
            <Icon name="arrow-right" size={20} strokeWidth={2.4} />
          </span>
        </button>
        <button type="button" onClick={() => go('/socialNearby')}
          className="relative block w-full rounded-lg bg-[#fcdcfa] px-3 pt-3 pb-4 text-left hover:brightness-[0.98]">
          <span className="block text-lg font-bold text-[#c21fb8] uppercase">Mua vé social</span>
          <span className="mt-2 block pr-16 text-[15px] text-[#b42ba9]">Mua vé social ngay hôm nay hoặc các ngày tiếp theo để tham gia sự kiện Social/xé vé.</span>
          <span className="absolute -top-1 right-2 flex h-10 w-10 rotate-[-12deg] items-center justify-center text-[10px] font-bold text-white italic"
            style={{ clipPath: 'polygon(50% 0,61% 15%,79% 9%,79% 27%,97% 32%,87% 48%,97% 65%,79% 71%,79% 90%,61% 84%,50% 100%,39% 84%,21% 90%,21% 71%,3% 65%,13% 48%,3% 32%,21% 27%,21% 9%,39% 15%)', backgroundColor: '#e5484d' }}>
            New
          </span>
          <span className="absolute right-0 bottom-0 flex h-[30px] w-[60px] items-center justify-center rounded-tl-xl rounded-br-lg bg-[#e58ee0] text-white">
            <Icon name="arrow-right" size={20} strokeWidth={2.4} />
          </span>
        </button>
      </div>
    </Modal>
  );
}
