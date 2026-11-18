import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, Link } from 'react-router-dom';
import { AppShell } from '@/layouts/AppShell';
import { LoadingBlock } from '@/components/feedback/States';
import HomePage from '@/pages/HomePage';

const page = (load: () => Promise<{ default: () => ReactNode }>) => {
  const C = lazy(load);
  return <Suspense fallback={<LoadingBlock />}><C /></Suspense>;
};

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-6xl font-bold text-primary">404</p>
      <p className="text-ink">Không tìm thấy trang bạn yêu cầu.</p>
      <Link to="/" className="rounded bg-primary px-6 py-2 font-bold text-white">Về trang chủ</Link>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/san/:slug', element: <HomePage /> },
    ],
  },
  { path: '/userBooking/:slug', element: page(() => import('@/pages/BookingPage')) },
  { path: '/userBooking/:slug/prices', element: page(() => import('@/pages/PricePage')) },
  { path: '/userBooking/:slug/confirm', element: page(() => import('@/pages/BookingConfirmPage')) },
  { path: '/booking/:code', element: page(() => import('@/pages/BookingResultPage')) },
  { path: '*', element: page(async () => ({ default: NotFound })) },
]);
