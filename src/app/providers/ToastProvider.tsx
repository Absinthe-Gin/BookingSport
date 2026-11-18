import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { Icon } from '@/components/common/Icon';

type ToastKind = 'success' | 'error';
interface Toast { id: number; kind: ToastKind; title: string; message: string }

interface ToastApi {
  show: (message: string, kind?: ToastKind, title?: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const show = useCallback((message: string, kind: ToastKind = 'success', title = 'Thông báo') => {
    const id = nextId.current++;
    setToasts((t) => [...t.slice(-2), { id, kind, title, message }]);
    window.setTimeout(() => dismiss(id), 3500);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="pointer-events-none fixed top-4 right-4 left-4 z-(--z-toast) flex flex-col items-end gap-2 sm:left-auto" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} role="status"
            className={`animate-toast pointer-events-auto flex w-full max-w-[380px] items-center gap-4 rounded-xl border-2 px-5 py-3 shadow-bar ${t.kind === 'error' ? 'border-danger bg-danger-soft' : 'border-brand-green bg-[#eafbf0]'}`}>
            <Icon name={t.kind === 'error' ? 'x-circle' : 'check'} size={26} className={t.kind === 'error' ? 'text-ink' : 'text-brand-green'} />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] text-ink">{t.title}</p>
              <p className="text-sm text-muted">{t.message}</p>
            </div>
            <button type="button" onClick={() => dismiss(t.id)} className="text-muted" aria-label="Đóng thông báo">
              <Icon name="x" size={18} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}
