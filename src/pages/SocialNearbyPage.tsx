import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/common/Icon';
import { SocialBoard } from '@/features/social/components/SocialBoard';

export default function SocialNearbyPage() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  return (
    <div className="min-h-screen bg-page">
      <header className="sticky top-0 z-(--z-header) flex flex-wrap items-center gap-2 bg-linear-to-r from-[#0b9a3e] via-primary to-primary-deep px-2 py-2 lg:h-[68px] lg:flex-nowrap lg:py-0">
        <button type="button" onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/'))} aria-label="Quay lại"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white"><Icon name="chevron-left" size={22} strokeWidth={2.4} /></button>
        <h1 className="flex-1 text-xl font-bold text-white">Social gần đây</h1>
        <label className="flex h-10 w-full items-center gap-2 rounded-full bg-primary-deep/60 px-4 text-white lg:w-[360px]">
          <Icon name="search" size={18} />
          <span className="sr-only">Tìm sân hoặc sự kiện</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm sân / sự kiện"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/70" />
        </label>
      </header>
      <SocialBoard query={q} />
    </div>
  );
}
