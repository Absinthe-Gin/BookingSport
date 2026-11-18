import type { ReactNode } from 'react';

/** Dotted ring spinner, matching the source's loading indicator. */
export function Spinner({ size = 44, className = '' }: { size?: number; className?: string }) {
  const dots = Array.from({ length: 10 });
  return (
    <div role="status" aria-label="Đang tải" className={`relative animate-spin ${className}`} style={{ width: size, height: size, animationDuration: '1.1s' }}>
      {dots.map((_, i) => {
        const angle = (i / dots.length) * Math.PI * 2;
        const r = size / 2 - 5;
        const dot = 2 + (i / dots.length) * 6;
        return (
          <span key={i} className="absolute rounded-full bg-primary"
            style={{ width: dot, height: dot, left: size / 2 + Math.cos(angle) * r - dot / 2, top: size / 2 + Math.sin(angle) * r - dot / 2 }} />
        );
      })}
    </div>
  );
}

export function LoadingBlock({ className = 'py-24' }: { className?: string }) {
  return <div className={`flex justify-center ${className}`}><Spinner /></div>;
}

function EmptyIllustration() {
  return (
    <svg width="100" height="92" viewBox="0 0 100 92" fill="none" aria-hidden="true">
      <ellipse cx="50" cy="86" rx="40" ry="3.5" fill="#e3e8e5" />
      <rect x="16" y="16" width="60" height="50" rx="7" stroke="#006d38" strokeWidth="3.5" />
      <path d="M16 28h60M44 9h6" stroke="#006d38" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="25" cy="22" r="2" fill="#006d38" /><circle cx="32" cy="22" r="2" fill="#006d38" />
      <path d="M26 38h24M26 46h28M26 54h20" stroke="#006d38" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="74" cy="52" r="12" fill="#fff" stroke="#006d38" strokeWidth="3.5" />
      <path d="M74 46v7M74 58v.5" stroke="#006d38" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

export function EmptyState({ message, icon, action }: { message: string; icon?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      {icon ?? <EmptyIllustration />}
      <p className="mt-4 text-sm text-ink">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <p className="text-lg font-bold text-warning">Thông báo</p>
      <p className="mt-2 text-ink">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="mt-4 rounded-lg bg-warning px-8 py-1.5 font-bold text-white">Thử lại</button>
      )}
    </div>
  );
}
