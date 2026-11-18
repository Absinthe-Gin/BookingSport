// Explore feed posts and featured banners observed on 2026-11-18.
import type { Banner, FeedPost } from '../../shared/types.ts';

export const banners: Omit<Banner, 'id'>[] = [
  { title: 'SWIN Pickleball Quận 7', image: '/assets/images/banners/swin-q7.jpg', cta: 'ĐẶT LỊCH NGAY', link: '/' },
  { title: 'Coco Pickleclub - Chơi nhiều tặng nhiều', image: '/assets/images/banners/coco-pickleclub.jpg', cta: 'ĐẶT LỊCH NGAY', link: '/' },
  { title: 'Gold Pickleball - Sân Quận 3', image: '/assets/images/banners/gold-pickleball-q3.jpg', cta: 'ĐẶT LỊCH NGAY', link: '/' },
  { title: 'WinX Pickleball - Bảng giá dịch vụ', image: '/assets/images/banners/winx-pickleball.jpg', cta: 'ĐẶT LỊCH NGAY', link: '/' },
  { title: 'Top Pickleball - Mới nhất Quận 2', image: '/assets/images/banners/top-pickleball.jpg', cta: 'ĐẶT LỊCH NGAY', link: '/' },
  { title: 'ALOBO - Phần mềm quản lý sân thể thao', image: '/assets/images/banners/alobo-software.jpg', cta: 'XEM NGAY', link: 'https://alobo.vn' },
];

type PostSeed = Omit<FeedPost, 'id'>;

const ECO = { ownerName: 'ECO PICK', ownerLogo: null, address: 'Ngõ 53 Nguyễn Khoái, Phường Hồng Hà, Hà Nội', distanceKm: 2.6 };
const TM = { ownerName: 'TM PICKLEBALL TƯƠNG MAI', ownerLogo: null, address: 'NGÕ 104 NGUYỄN AN NINH | CÁCH NHÀ THI ĐẤU TƯƠNG MAI 30m', distanceKm: 3.7 };
const NET = { ownerName: 'NET Sports', ownerLogo: null, address: '18 Tam Trinh - Hoàng Mai - Hà Nội (cạnh gara oto 199)', distanceKm: 4.2 };
const CT2 = { ownerName: 'Pickleball Tòa Nhà CT2 Đô Thị Mới Định Công Phương Liệt Hà Nội ( Có Mái Che )', ownerLogo: null, address: 'Tòa Nhà CT2 Đô Thị Mới Định Công, phương liệt , Hà Nội', distanceKm: 4.4 };

export const feedPosts: PostSeed[] = [
  {
    kind: 'event', ...ECO, postedAt: '2026-11-16T06:23:00', text: 'Xé vé ngay hôm nay', hashtags: ['sukiensocial'],
    items: [{ code: '#8537', title: 'Trình> 9 tháng ( tặng 1 nước)', level: '2.5 → 3.0', court: 'Pickleball 1', start: '08:00', end: '11:00', date: '21/11', price: 70000, taken: 0, capacity: 8 }],
  },
  {
    kind: 'event', ...TM, postedAt: '2026-11-11T00:01:00', text: 'Xé vé ngay hôm nay', hashtags: ['sukiensocial'],
    items: [
      { code: '#2445', title: 'Pro Căng Tay', level: '3.0 → 3.5', court: 'VIP 1', start: '13:00', end: '18:00', date: '18/11', price: 90000, taken: 0, capacity: 8 },
      { code: '#2446', title: 'Pro Căng Tay', level: '3.0 → 3.5', court: 'Pickleball 2', start: '13:00', end: '18:00', date: '18/11', price: 90000, taken: 2, capacity: 8 },
      { code: '#2447', title: 'Trên 1 Năm', level: '2.5 → 3.0', court: 'Pickleball 5', start: '13:00', end: '18:00', date: '18/11', price: 90000, taken: 4, capacity: 8 },
      { code: '#2448', title: '6/9 Tháng', level: '1.5 → 2.0', court: 'VIP 2', start: '13:00', end: '17:00', date: '18/11', price: 80000, taken: 1, capacity: 8 },
      { code: '#2451', title: 'Trên 1 Năm', level: '2.5 → 3.0', court: 'Pickleball 2', start: '08:00', end: '11:00', date: '19/11', price: 60000, taken: 0, capacity: 8 },
      { code: '#2452', title: '9/12 Tháng', level: '2.0 → 2.5', court: 'Pickleball 3', start: '08:00', end: '11:00', date: '19/11', price: 60000, taken: 0, capacity: 8 },
    ],
  },
  {
    kind: 'membership', ...TM, postedAt: '2026-10-17T00:01:00', text: '🔥 Ưu đãi gói hội viên mới', hashtags: ['uudaigoihoivien'],
    items: [
      { badge: 'Thẻ hội viên', subtitle: 'XÉ VÉ SÁNG 8H-11H : GIÁ 60K/VÉ', title: 'COMBO SÁNG 8H-11H: 20 VÉ TẶNG 2 VÉ', sale: '13/05/2026 - 31/12/2026', scope: 'Không giới hạn', duration: '9 Tháng', free: 22, courtType: 'Pickleball', price: 1080000 },
      { badge: 'Thẻ hội viên', subtitle: 'XÉ VÉ CHIỀU 14H-17H : GIÁ 80K/VÉ', title: 'COMBO CHIỀU 14H-17H : 10 VÉ TẶNG 1 VÉ', sale: '14/05/2026 - 31/12/2026', scope: 'Không giới hạn', duration: '6 Tháng', free: 11, courtType: 'Pickleball', price: 720000 },
    ],
  },
  {
    kind: 'membership', ...TM, postedAt: '2026-05-18T09:15:00', text: 'Chơi thả ga với gói hội viên ưu đãi', hashtags: ['uudaigoihoivien'],
    items: [
      { badge: 'Thẻ hội viên', subtitle: 'XÉ VÉ CHIỀU 14H-17H : GIÁ 80K/VÉ', title: 'COMBO CHIỀU 14H-17H : 10 VÉ TẶNG 1 VÉ', sale: '14/05/2026 - 31/12/2026', scope: 'Không giới hạn', duration: '6 Tháng', free: 11, courtType: 'Pickleball', price: 720000 },
    ],
  },
  {
    kind: 'course', ...ECO, postedAt: '2026-06-07T22:36:00', text: '🔥 Khoá học mới', hashtags: ['thongbaokhoahoc', 'academy'],
    items: [{ title: 'Lớp học Pickleball', schedule: '07:00 - 23:00 | T2, T3, T4, T5, T6, T7, CN', price: 'Chỉ từ 330.000 đ/Buổi', phone: '+84 869963344', coach: 'minh hoàng' }],
  },
  {
    kind: 'course', ...NET, postedAt: '2026-09-12T14:10:00', text: 'Tham gia khoá học cùng huấn luyện viên', hashtags: ['thongbaokhoahoc', 'academy'],
    items: [{ title: 'Lớp học Pickleball', schedule: '05:00 - 23:00 | T2, T3, T4, T5, T6, T7, CN', price: 'Chỉ từ 250 đ/Buổi', phone: '+84 378641235', coach: 'Coach Mạnh' }],
  },
  {
    kind: 'notice', ...ECO, postedAt: '2026-11-18T08:16:00', text: '🔥 Sân trống trong hôm nay', hashtags: ['thongbaosantrong'],
    items: [{ date: '18/11/2026', courts: 'Pickleball 5:|16:00 - 18:00 , 21:30 - 23:30||Pickleball 6:|16:00 - 17:00 , 21:30 - 23:30', more: 2 }],
  },
  {
    kind: 'notice', ...CT2, postedAt: '2026-11-15T13:03:00', text: '🔥 Sân trống trong hôm nay', hashtags: ['thongbaosantrong'],
    items: [
      { date: '18/11/2026', courts: 'Pickleball 1:|13:30 - 18:00 , 21:00 - 22:00||Pickleball 2:|13:30 - 18:00', more: 6 },
      { date: '19/11/2026', courts: 'Pickleball 1:|06:00 - 07:00 , 11:00 - 18:00||Pickleball 2:|06:00 - 17:00', more: 6 },
    ],
  },
];
