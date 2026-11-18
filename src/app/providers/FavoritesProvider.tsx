import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { api } from '@/services/api';
import { useAuth } from './AuthProvider';
import { useToast } from './ToastProvider';

const GUEST_KEY = 'ab_guest_favorites';

function readGuest(): string[] {
  try { return JSON.parse(localStorage.getItem(GUEST_KEY) ?? '[]'); } catch { return []; }
}
function writeGuest(slugs: string[]) {
  try { localStorage.setItem(GUEST_KEY, JSON.stringify(slugs)); } catch { /* storage unavailable */ }
}

interface FavoritesApi {
  slugs: string[];
  isFavorite: (slug: string) => boolean;
  toggle: (slug: string) => void;
}

const FavoritesContext = createContext<FavoritesApi | null>(null);

/** Guests keep favourites in this browser; signed-in users keep them on the server (guest ones are merged on login). */
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const toast = useToast();
  const [slugs, setSlugs] = useState<string[]>(readGuest);

  useEffect(() => {
    if (!user) { setSlugs(readGuest()); return; }
    let alive = true;
    (async () => {
      const guest = readGuest();
      await Promise.all(guest.map((s) => api.addFavorite(s).catch(() => undefined)));
      if (guest.length) writeGuest([]);
      const server = await api.favorites();
      if (alive) setSlugs(server);
    })().catch(() => undefined);
    return () => { alive = false; };
  }, [user]);

  const toggle = useCallback((slug: string) => {
    const has = slugs.includes(slug);
    const next = has ? slugs.filter((s) => s !== slug) : [slug, ...slugs];
    setSlugs(next);
    if (!user) {
      writeGuest(next);
      toast.show(has ? 'Đã bỏ khỏi danh sách yêu thích' : 'Đã thêm vào danh sách yêu thích');
      return;
    }
    (has ? api.removeFavorite(slug) : api.addFavorite(slug))
      .then(() => toast.show(has ? 'Đã bỏ khỏi danh sách yêu thích' : 'Đã thêm vào danh sách yêu thích'))
      .catch((e: Error) => { setSlugs(slugs); toast.show(e.message, 'error'); });
  }, [slugs, user, toast]);

  const isFavorite = useCallback((slug: string) => slugs.includes(slug), [slugs]);
  return <FavoritesContext.Provider value={{ slugs, isFavorite, toggle }}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesApi {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used inside FavoritesProvider');
  return ctx;
}
