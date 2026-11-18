import { useSearchParams } from 'react-router-dom';
import { Icon, type IconName } from '@/components/common/Icon';
import { EmptyState, ErrorState, LoadingBlock } from '@/components/feedback/States';
import { SocialBoard } from '@/features/social/components/SocialBoard';
import { FeedPostCard } from '@/features/explore/components/FeedPostCard';
import { useAsync } from '@/hooks/useAsync';
import { api } from '@/services/api';
import type { FeedKind } from '@shared/types';

const TABS: { id: string; label: string; icon: IconName; kind?: FeedKind }[] = [
  { id: 'social', label: 'Social', icon: 'social' },
  { id: 'event', label: 'Sự kiện', icon: 'ticket', kind: 'event' },
  { id: 'membership', label: 'Gói hội viên', icon: 'crown', kind: 'membership' },
  { id: 'course', label: 'Khóa học', icon: 'book', kind: 'course' },
  { id: 'notice', label: 'Thông báo', icon: 'bell', kind: 'notice' },
  { id: 'offer', label: 'Ưu đãi', icon: 'gift' },
  { id: 'pass', label: 'Pass sân', icon: 'pass' },
];

function Feed({ kind }: { kind?: FeedKind }) {
  const feed = useAsync(() => (kind ? api.feed(kind) : Promise.resolve([])), [kind]);
  if (feed.loading) return <LoadingBlock />;
  if (feed.error) return <ErrorState message={feed.error.message} onRetry={feed.reload} />;
  if (!feed.data?.length) return <div className="py-16"><EmptyState message="Chưa có chủ sân nào gần bạn đăng bài." /></div>;
  return (
    <div className="columns-1 gap-6 px-3 py-5 md:columns-2 lg:px-6 [&>*]:mb-6">
      {feed.data.map((p) => <FeedPostCard key={p.id} post={p} />)}
    </div>
  );
}

export default function ExplorePage() {
  const [params, setParams] = useSearchParams();
  const tab = TABS.find((t) => t.id === params.get('tab')) ?? TABS[0];

  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-(--z-header) flex flex-col gap-2 bg-linear-to-r from-[#0b9a3e] via-primary to-primary-deep px-4 py-3 lg:h-[68px] lg:flex-row lg:items-center lg:py-0">
        <h1 className="text-2xl font-extrabold tracking-wide text-white italic lg:w-[240px]">KHÁM PHÁ</h1>
        <nav role="tablist" aria-label="Danh mục khám phá" className="no-scrollbar flex gap-2 overflow-x-auto lg:flex-1 lg:justify-center">
          {TABS.map((t) => {
            const on = t.id === tab.id;
            return (
              <button key={t.id} type="button" role="tab" aria-selected={on} onClick={() => setParams({ tab: t.id }, { replace: true })}
                className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold ${on ? 'bg-white text-primary' : 'bg-primary-deep/70 text-white hover:bg-primary-deep'}`}>
                <Icon name={t.icon} size={16} />{t.label}
              </button>
            );
          })}
        </nav>
        <span className="hidden lg:block lg:w-[240px]" />
      </header>
      <div role="tabpanel" aria-label={tab.label}>
        {tab.id === 'social' ? <SocialBoard /> : <Feed kind={tab.kind} />}
      </div>
    </div>
  );
}
