import type { ReactNode } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';

export function AuthLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="auth-bg min-h-screen pb-10">
      <PageHeader title={<span className="font-semibold">{title}</span>} variant="transparent" />
      <div className="mx-auto w-full max-w-[600px] px-3">{children}</div>
    </div>
  );
}

export function useRedirectTarget(state: unknown): string {
  const from = (state as { from?: string } | null)?.from;
  return from && from.startsWith('/') && !from.startsWith('//') ? from : '/';
}
