import { Link } from 'react-router-dom';

const items = [
  { label: 'Trống', cls: 'bg-white' },
  { label: 'Đã đặt', cls: 'bg-slot-booked' },
  { label: 'Khoá', cls: 'bg-slot-locked' },
];

export function Legend({ priceHref, onEvents }: { priceHref: string; onEvents: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-2.5 py-2.5 text-[13px] font-semibold text-white">
      {items.map((i) => (
        <span key={i.label} className="flex items-center gap-2.5">
          <span className={`h-6 w-6 rounded ${i.cls}`} />{i.label}
        </span>
      ))}
      <button type="button" onClick={onEvents} className="flex items-center gap-2.5">
        <span className="flex h-6 w-6 items-center justify-center rounded bg-event text-xs font-bold text-primary-deep">!</span>Sự kiện
      </button>
      <Link to={priceHref} className="text-accent underline underline-offset-2">Xem sân & bảng giá</Link>
    </div>
  );
}
