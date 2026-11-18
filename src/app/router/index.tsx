import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter, Link, useRouteError } from 'react-router-dom';
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

function RouteError() {
  const error = useRouteError() as Error | undefined;
  console.error(error);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
      <p className="text-2xl font-bold text-warning">Thông báo</p>
      <p className="text-ink">Đã có lỗi xảy ra khi hiển thị trang này.</p>
      <div className="flex gap-3">
        <button type="button" onClick={() => window.location.reload()} className="rounded bg-warning px-6 py-2 font-bold text-white">Tải lại</button>
        <Link to="/" className="rounded bg-primary px-6 py-2 font-bold text-white">Về trang chủ</Link>
      </div>
    </div>
  );
}

const withErrors = <T extends object>(routes: T[]) => routes.map((r) => ({ ...r, errorElement: <RouteError /> }));

export const router = createBrowserRouter(withErrors([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/san/:slug', element: <HomePage /> },
      { path: '/account', element: page(() => import('@/pages/AccountPage')) },
      { path: '/favorites', element: page(() => import('@/pages/FavoritesPage')) },
      { path: '/map', element: page(() => import('@/pages/MapPage')) },
    ],
  },
  { path: '/search', element: page(() => import('@/pages/SearchPage')) },
  { path: '/uLogin', element: page(() => import('@/pages/LoginPage')) },
  { path: '/uRegister', element: page(() => import('@/pages/RegisterPage')) },
  { path: '/userBooking/:slug', element: page(() => import('@/pages/BookingPage')) },
  { path: '/userBooking/:slug/prices', element: page(() => import('@/pages/PricePage')) },
  { path: '/userBooking/:slug/confirm', element: page(() => import('@/pages/BookingConfirmPage')) },
  { path: '/booking/:code', element: page(() => import('@/pages/BookingResultPage')) },
  { path: '*', element: page(async () => ({ default: NotFound })) },
]));
