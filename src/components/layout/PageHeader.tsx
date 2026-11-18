import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@/components/common/Icon';

interface Props {
  title: ReactNode;
  onBack?: () => void;
  right?: ReactNode;
  variant?: 'solid' | 'transparent' | 'gradient';
  className?: string;
}

/** Green title bar with a back button, used by full-screen pages. */
export function PageHeader({ title, onBack, right, variant = 'solid', className = '' }: Props) {
  const navigate = useNavigate();
  const back = onBack ?? (() => (window.history.length > 1 ? navigate(-1) : navigate('/')));
  const bg = variant === 'solid' ? 'bg-primary' : variant === 'gradient' ? 'bg-linear-to-r from-[#0b8a3e] to-[#006d38]' : '';
  return (
    <header className={`sticky top-0 z-(--z-header) flex h-14 items-center px-1 text-white ${bg} ${className}`}>
      <button type="button" onClick={back} aria-label="Quay lại" className="flex h-14 w-14 items-center justify-center">
        <Icon name="chevron-left" size={24} strokeWidth={2.4} />
      </button>
      <h1 className="flex-1 truncate text-center text-xl font-bold">{title}</h1>
      <div className="flex min-w-14 justify-end pr-2">{right}</div>
    </header>
  );
}
