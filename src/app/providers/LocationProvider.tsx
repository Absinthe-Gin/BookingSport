import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { DEFAULT_LOCATION } from '@shared/schedule';
import { useToast } from './ToastProvider';

interface Location { lat: number; lng: number; precise: boolean }
interface LocationApi {
  location: Location;
  locate: () => void;
  locating: boolean;
}

const LocationContext = createContext<LocationApi | null>(null);

export function LocationProvider({ children }: { children: ReactNode }) {
  const toast = useToast();
  const [location, setLocation] = useState<Location>({ ...DEFAULT_LOCATION, precise: false });
  const [locating, setLocating] = useState(false);

  const locate = useCallback(() => {
    if (!('geolocation' in navigator)) { toast.show('Trình duyệt không hỗ trợ định vị', 'error'); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, precise: true }); setLocating(false); toast.show('Đã cập nhật vị trí của bạn'); },
      () => { setLocating(false); toast.show('Không lấy được vị trí, đang dùng vị trí mặc định', 'error'); },
      { enableHighAccuracy: false, timeout: 10000 },
    );
  }, [toast]);

  return <LocationContext.Provider value={{ location, locate, locating }}>{children}</LocationContext.Provider>;
}

export function useLocation(): LocationApi {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used inside LocationProvider');
  return ctx;
}
