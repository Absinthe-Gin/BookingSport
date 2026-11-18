import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: ReactNode;
  className?: string;
  showClose?: boolean;
  labelledBy?: string;
}

/** Centered dialog with backdrop, Escape-to-close and focus handling. */
export function Modal({ open, onClose, children, title, className = '', showClose = true }: ModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      prev?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    <div className="animate-fade fixed inset-0 z-(--z-modal) flex items-center justify-center bg-black/45 p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div ref={ref} tabIndex={-1} role="dialog" aria-modal="true"
        className={`animate-pop relative max-h-[90vh] w-full overflow-auto rounded-[14px] bg-white outline-none ${className}`}>
        {showClose && (
          <button type="button" onClick={onClose} className="absolute top-3 right-3 z-10 rounded-full p-1 text-ink hover:bg-black/5" aria-label="Đóng">
            <Icon name="x" size={24} strokeWidth={2.6} />
          </button>
        )}
        {title && <h2 className="px-6 pt-6 text-center text-xl font-bold text-primary uppercase">{title}</h2>}
        {children}
      </div>
    </div>,
    document.body,
  );
}

interface SheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  side?: 'left' | 'right' | 'bottom';
  className?: string;
  label: string;
}

/** Side or bottom panel over a dimmed backdrop. */
export function Sheet({ open, onClose, children, side = 'right', className = '', label }: SheetProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  const pos = side === 'left' ? 'left-0 top-0 h-full animate-slide-left' : side === 'right' ? 'right-0 top-0 h-full animate-slide-right' : 'bottom-0 left-0 right-0 animate-fade rounded-t-2xl';
  return createPortal(
    <div className="animate-fade fixed inset-0 z-(--z-panel) bg-black/45" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-label={label} className={`absolute bg-white shadow-2xl ${pos} ${className}`}>
        {children}
      </div>
    </div>,
    document.body,
  );
}
