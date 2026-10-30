import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { emptyStore, storageKey, storeSchema, type PlanStore } from './model';

type StoreContext = { store: PlanStore; ready: boolean; error: 'save' | 'load' | null; update: (next: PlanStore | ((previous: PlanStore) => PlanStore)) => boolean };
const Context = createContext<StoreContext | null>(null);
export function PlanningProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<PlanStore>(emptyStore);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<StoreContext['error']>(null);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setStore(storeSchema.parse(JSON.parse(saved)));
    } catch { setError('load'); }
    setReady(true);
    const sync = (e: StorageEvent) => {
      if (e.key !== storageKey || !e.newValue) return;
      try { setStore(storeSchema.parse(JSON.parse(e.newValue))); setError(null); } catch { setError('load'); }
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);
  const update: StoreContext['update'] = next => {
    if (!ready || error === 'load') return false;
    try {
      const value = typeof next === 'function' ? next(store) : next;
      localStorage.setItem(storageKey, JSON.stringify(storeSchema.parse(value)));
      setStore(value); setError(null); return true;
    } catch { setError('save'); return false; }
  };
  return <Context.Provider value={{ store, ready, error, update }}>{children}</Context.Provider>;
}
export function usePlanning() {
  const context = useContext(Context);
  if (!context) throw new Error('PlanningProvider missing');
  return context;
}
