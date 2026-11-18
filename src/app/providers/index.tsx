import type { ReactNode } from 'react';
import { ToastProvider } from './ToastProvider';
import { DialogProvider } from './DialogProvider';
import { AuthProvider } from './AuthProvider';
import { FavoritesProvider } from './FavoritesProvider';
import { LocationProvider } from './LocationProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <DialogProvider>
        <AuthProvider>
          <LocationProvider>
            <FavoritesProvider>{children}</FavoritesProvider>
          </LocationProvider>
        </AuthProvider>
      </DialogProvider>
    </ToastProvider>
  );
}
