import { Outlet } from 'react-router-dom';
import { BottomNav } from '@/components/navigation/BottomNav';

/** Pages reachable from the bottom navigation. */
export function AppShell() {
  return (
    <div className="min-h-full pb-20">
      <Outlet />
      <BottomNav />
    </div>
  );
}
