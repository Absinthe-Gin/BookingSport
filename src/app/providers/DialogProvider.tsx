import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { Modal } from '@/components/common/Modal';

interface DialogState {
  message: string;
  variant: 'info' | 'warning';
  confirmLabel: string;
  resolve: () => void;
}

interface DialogApi {
  /** Shows a single-button notice. Resolves when it is closed. */
  alert: (message: string, opts?: { variant?: 'info' | 'warning'; confirmLabel?: string }) => Promise<void>;
}

const DialogContext = createContext<DialogApi | null>(null);

export function DialogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DialogState | null>(null);

  const alert = useCallback<DialogApi['alert']>((message, opts = {}) => new Promise<void>((resolve) => {
    setState({ message, variant: opts.variant ?? 'info', confirmLabel: opts.confirmLabel ?? 'OK', resolve });
  }), []);

  const close = useCallback(() => {
    setState((s) => { s?.resolve(); return null; });
  }, []);

  return (
    <DialogContext.Provider value={{ alert }}>
      {children}
      <Modal open={!!state} onClose={close} className="max-w-[500px]" showClose={state?.variant === 'info'}>
        {state?.variant === 'warning' ? (
          <div className="px-6 py-7 text-center">
            <h2 className="text-2xl font-bold text-warning">Thông báo</h2>
            <p className="mt-5 text-lg text-primary-deep">{state.message}</p>
            <button type="button" onClick={close} className="mt-5 rounded-lg bg-warning px-11 py-1.5 text-lg font-bold text-white">{state.confirmLabel}</button>
          </div>
        ) : (
          <div className="px-4 pt-9 pb-4">
            <p className="px-2 text-center text-[17px] text-primary-deep">{state?.message}</p>
            <button type="button" onClick={close} className="mt-6 h-[50px] w-full rounded bg-primary text-lg font-bold text-white hover:bg-primary-dark">{state?.confirmLabel}</button>
          </div>
        )}
      </Modal>
    </DialogContext.Provider>
  );
}

export function useDialog(): DialogApi {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error('useDialog must be used inside DialogProvider');
  return ctx;
}
