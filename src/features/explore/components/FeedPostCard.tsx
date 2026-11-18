import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/common/Icon';
import { Avatar } from '@/components/common/Avatar';
import { useToast } from '@/app/providers/ToastProvider';
import { useDialog } from '@/app/providers/DialogProvider';
import { formatVnd } from '@shared/schedule';
import type { FeedPost } from '@shared/types';

type Item = FeedPost['items'][number];
const str = (v: Item[string]) => String(v ?? '');
const num = (v: Item[string]) => Number(v ?? 0);

function postedLabel(iso: string) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} • ${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function Badge({ n, children, className }: { n: number; children: ReactNode; className: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-r-full py-0.5 pr-3 pl-0.5 text-xs font-bold ${className}`}>
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] text-ink">{n}</span>{children}
    </span>
  );
}

function EventItem({ item, onBook, onShare }: { item: Item; onBook: () => void; onShare: () => void }) {
  const taken = num(item.taken);
  const cap = num(item.capacity);
  return (
    <div className="w-[380px] max-w-[80vw] shrink-0 rounded-xl border border-line bg-white">
      <div className="flex gap-3 p-3">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="flex items-center gap-1 rounded-md border border-[#c21fb8] px-1.5 text-[#c21fb8]"><Icon name="ticket" size={12} />Xé vé</span>
            <span className="rounded-md bg-[#ececec] px-1.5 text-muted">{str(item.code)}</span>
          </div>
          <div className="mt-2 flex gap-3">
            <div className="flex w-14 shrink-0 flex-col items-center rounded-lg border border-[#b9d3f7] bg-[#eef5ff] py-1 text-[13px] leading-5 text-[#1f4fa8]">
              <b>{str(item.start)}</b><b>{str(item.end)}</b><span className="text-[10px]">{str(item.date)}</span>
            </div>
            <div className="min-w-0">
              <p className="truncate text-[15px] font-bold text-ink">{str(item.title)}</p>
              <span className="mt-1 inline-block rounded-md bg-[#1f4fa8] px-1.5 text-[11px] text-white">{str(item.level)}</span>
              <p className="mt-1 flex items-center gap-1 text-xs text-ink"><Icon name="map-fold" size={13} className="text-primary" />{str(item.court)}</p>
              <p className="mt-1 text-[15px] font-bold text-[#f08c00]">{formatVnd(num(item.price))} <span className="text-xs font-normal text-muted">/ vé</span></p>
            </div>
          </div>
        </div>
        <button type="button" onClick={onShare} aria-label="Chia sẻ" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-ink"><Icon name="share" size={16} /></button>
      </div>
      <div className="border-t border-dashed border-line px-3 py-2">
        <span className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-semibold text-primary">{taken}/{cap}</span>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#e6e6e6]"><div className="h-full rounded-full bg-primary" style={{ width: `${cap ? (taken / cap) * 100 : 0}%` }} /></div>
        <div className="mt-2 flex justify-between">
          <button type="button" onClick={onBook} className="flex items-center gap-1 rounded-full bg-[#ececec] px-2.5 py-1 text-xs text-muted"><Icon name="eye" size={14} />Xem chi tiết</button>
          <button type="button" onClick={onBook} className="flex items-center gap-1 rounded-md border border-primary px-2.5 py-1 text-xs font-semibold text-primary"><Icon name="plus" size={14} />Đặt chỗ</button>
        </div>
      </div>
    </div>
  );
}

function MembershipItem({ item, n, onRegister }: { item: Item; n: number; onRegister: () => void }) {
  return (
    <div className="w-[380px] max-w-[80vw] shrink-0 overflow-hidden rounded-xl border border-line bg-white">
      <div className="p-3 pb-0">
        <Badge n={n} className="-ml-3 bg-primary text-white">{str(item.badge)}</Badge>
        <p className="mt-2 text-[11px] font-bold text-primary">{str(item.subtitle)}</p>
        <p className="text-[13px] font-bold text-ink">{str(item.title)}</p>
        <p className="mt-1 flex items-center gap-1 text-[11px] text-muted"><Icon name="calendar" size={12} />Mở bán : {str(item.sale)}</p>
        <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted"><Icon name="clock" size={12} />Giờ áp dụng: <b className="text-ink">{str(item.scope)}</b></p>
        <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] text-muted">
          <p><Icon name="clock" size={12} className="mr-1 inline text-primary" />Thời hạn<br /><b className="text-[13px] text-accent">{str(item.duration)}</b></p>
          <p><Icon name="check" size={12} className="mr-1 inline text-primary" />Miễn phí<br /><b className="text-[13px] text-accent">{str(item.free)}</b></p>
          <p><Icon name="court" size={12} className="mr-1 inline text-primary" />Loại sân<br /><b className="text-[13px] text-accent">{str(item.courtType)}</b></p>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between pl-3">
        <b className="text-[15px] text-ink">{formatVnd(num(item.price))}</b>
        <button type="button" onClick={onRegister} className="flex items-center gap-1 rounded-tl-xl bg-primary px-4 py-2 text-xs font-bold text-white">Đăng ký <Icon name="chevron-right" size={14} /></button>
      </div>
    </div>
  );
}

function CourseItem({ item, n }: { item: Item; n: number }) {
  const phone = str(item.phone);
  return (
    <div className="w-full rounded-xl border border-line bg-white p-3">
      <div className="flex justify-between">
        <Badge n={n} className="-ml-3 bg-[#fde2e6] text-[#c0263f]">Khoá học</Badge>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fde2e6] text-[#c0263f]"><Icon name="trophy" size={18} /></span>
      </div>
      <p className="mt-1 text-[15px] font-bold text-ink">{str(item.title)}</p>
      <p className="text-xs font-semibold text-primary">{str(item.schedule)}</p>
      <p className="mt-1 flex items-center gap-1 text-xs text-ink"><Icon name="info" size={13} />{str(item.price)}</p>
      <p className="mt-1 flex items-center gap-1 text-xs text-ink"><Icon name="phone" size={13} />{phone}</p>
      <div className="mt-2 flex items-center justify-between border-t border-line pt-2">
        <p className="flex items-center gap-2 text-xs text-muted"><Icon name="user" size={18} />Huấn luyện viên:<br /><b className="text-ink">{str(item.coach)}</b></p>
        <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-1 text-xs font-bold text-primary">Liên hệ ngay <Icon name="chevron-right" size={14} /></a>
      </div>
    </div>
  );
}

function NoticeItem({ item, n, onDetail }: { item: Item; n: number; onDetail: () => void }) {
  const [open, setOpen] = useState(false);
  const blocks = str(item.courts).split('||').map((b) => b.split('|'));
  const shown = open ? blocks : blocks.slice(0, 2);
  return (
    <div className="w-full rounded-xl border border-line bg-white p-3">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">{n}</span>
          <span className="rounded border border-brand-green px-1.5 text-[11px] text-brand-green">Sân trống</span></span>
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex items-center gap-1 text-xs text-primary">
          Xem thêm ({num(item.more)}) <Icon name={open ? 'chevron-up' : 'chevron-down'} size={14} />
        </button>
      </div>
      <p className="mt-2 text-[15px] font-bold text-ink">{str(item.date)}</p>
      {shown.map(([court, times]) => (
        <p key={court} className="mt-1 text-[13px] text-ink"><b>{court}</b><br />{times}</p>
      ))}
      {open && blocks.length <= 2 && <p className="mt-1 text-xs text-muted">Liên hệ chủ sân để biết thêm khung giờ trống.</p>}
      <button type="button" onClick={onDetail} className="mt-3 h-9 w-full rounded-md bg-primary text-xs font-bold text-white">Xem chi tiết</button>
    </div>
  );
}

export function FeedPostCard({ post }: { post: FeedPost }) {
  const navigate = useNavigate();
  const toast = useToast();
  const dialog = useDialog();
  const share = async () => {
    const url = `${window.location.origin}/explore`;
    try {
      if (navigator.share) await navigator.share({ title: post.ownerName, text: post.text, url });
      else { await navigator.clipboard.writeText(url); toast.show('Đã sao chép liên kết'); }
    } catch { /* share sheet dismissed */ }
  };
  const horizontal = post.kind === 'event' || post.kind === 'membership';

  return (
    <article className="break-inside-avoid rounded-2xl bg-white p-3 shadow-card">
      <header className="flex items-center gap-2.5">
        <Avatar src={post.ownerLogo} name={post.ownerName} size={44} />
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-bold text-ink">{post.ownerName}</h3>
          <p className="truncate text-[11px] text-muted"><span className="text-brand-green">({post.distanceKm}km)</span> {post.address}</p>
          <p className="text-[11px] text-muted">{postedLabel(post.postedAt)}</p>
        </div>
      </header>
      <p className="mt-3 text-[15px] text-ink">{post.text}</p>
      <p className="text-[13px] text-brand-green">{post.hashtags.map((h) => `#${h}`).join(' ')}</p>
      <div className={`mt-2 rounded-xl bg-primary-soft/70 p-2 ${horizontal ? 'no-scrollbar flex gap-3 overflow-x-auto' : 'space-y-3'}`}>
        {post.items.map((item, i) => {
          switch (post.kind) {
            case 'event': return <EventItem key={i} item={item} onShare={share} onBook={() => navigate('/socialNearby')} />;
            case 'membership': return <MembershipItem key={i} n={i + 1} item={item} onRegister={() => dialog.alert(`Vui lòng liên hệ ${post.ownerName} để đăng ký gói "${str(item.title)}".`)} />;
            case 'course': return <CourseItem key={i} n={i + 1} item={item} />;
            case 'notice': return <NoticeItem key={i} n={i + 1} item={item} onDetail={() => dialog.alert(`Liên hệ ${post.ownerName} (${post.address}) để đặt khung giờ trống.`)} />;
          }
        })}
      </div>
      {post.kind === 'membership' && (
        <button type="button" onClick={() => toast.show('Chi nhánh chưa có thêm ưu đãi khác')} className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-line text-xs font-semibold text-primary-deep">
          <Icon name="gift" size={16} className="text-accent" />Khám phá ưu đãi khác tại chi nhánh <Icon name="chevron-right" size={14} />
        </button>
      )}
      <img src="/assets/images/pickleball_cover.png" alt="" loading="lazy" className="mt-3 aspect-[5/2] w-full rounded-xl object-cover" />
    </article>
  );
}
