'use client';

import { useCallback, useSyncExternalStore } from 'react';

const favoriteKey = 'cpk.favoriteProgramIds';
const compareKey = 'cpk.compareProgramIds';

type ProgramStorageSnapshot = {
  favoriteIds: ReadonlyArray<string>;
  compareIds: ReadonlyArray<string>;
};

const emptySnapshot: ProgramStorageSnapshot = { favoriteIds: [], compareIds: [] };
let snapshot: ProgramStorageSnapshot = emptySnapshot;
let isLoaded = false;
const listeners = new Set<() => void>();

function readIds(key: string): ReadonlyArray<string> {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

function loadSnapshot(): ProgramStorageSnapshot {
  if (typeof window === 'undefined') return emptySnapshot;
  return {
    favoriteIds: readIds(favoriteKey),
    compareIds: readIds(compareKey)
  };
}

function ensureLoaded(): void {
  if (isLoaded) return;
  snapshot = loadSnapshot();
  isLoaded = true;
}

function emit(nextSnapshot: ProgramStorageSnapshot): void {
  snapshot = nextSnapshot;
  listeners.forEach((listener) => listener());
}

function writeIds(key: string, ids: ReadonlyArray<string>): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify([...new Set(ids)]));
  const nextSnapshot = key === favoriteKey
    ? { ...snapshot, favoriteIds: [...new Set(ids)] }
    : { ...snapshot, compareIds: [...new Set(ids)] };
  emit(nextSnapshot);
}

function subscribe(listener: () => void): () => void {
  ensureLoaded();
  listeners.add(listener);
  const reload = () => emit(loadSnapshot());
  window.addEventListener('storage', reload);
  window.addEventListener('program-storage-updated', reload);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', reload);
    window.removeEventListener('program-storage-updated', reload);
  };
}

function getSnapshot(): ProgramStorageSnapshot {
  ensureLoaded();
  return snapshot;
}

function getServerSnapshot(): ProgramStorageSnapshot {
  return emptySnapshot;
}

export function useProgramStorage() {
  const current = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleFavorite = useCallback((id: string) => {
    const currentIds = getSnapshot().favoriteIds;
    const next = currentIds.includes(id) ? currentIds.filter((item) => item !== id) : [...currentIds, id];
    writeIds(favoriteKey, next);
  }, []);

  const toggleCompare = useCallback((id: string) => {
    const currentIds = getSnapshot().compareIds;
    const next = currentIds.includes(id) ? currentIds.filter((item) => item !== id) : [...currentIds, id].slice(-4);
    writeIds(compareKey, next);
  }, []);

  const clearFavorites = useCallback(() => {
    writeIds(favoriteKey, []);
  }, []);

  const clearCompare = useCallback(() => {
    writeIds(compareKey, []);
  }, []);

  return { favoriteIds: current.favoriteIds, compareIds: current.compareIds, toggleFavorite, toggleCompare, clearFavorites, clearCompare };
}
