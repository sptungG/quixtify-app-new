// in-memory fallback for SSR (non-persistent between reloads)
type StorageLike = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
};

// Simple in-memory fallback for SSR (non-persistent across requests)
const memoryStore = new Map<string, string>();
export const memoryStorage: StorageLike = {
  getItem: k => (memoryStore.has(k) ? (memoryStore.get(k) as string) : null),
  setItem: (k, v) => void memoryStore.set(k, v),
  removeItem: k => void memoryStore.delete(k),
  clear: () => void memoryStore.clear(),
};
