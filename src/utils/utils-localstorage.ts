import { memoryStorage } from './utils-instorage';

/**
 * LocalStorage utility to handle nested objects
 */
type Path = string | string[];

type StorageLike = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
};

const isBrowser =
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const getStorage = (): StorageLike =>
  isBrowser ? window.localStorage : memoryStorage;

const LocalStorage = {
  /**
   * Get a value from storage, supports nested keys
   * @param key - main key in storage
   * @param path - nested path, e.g. 'user.name' or ['user','name']
   * @param defaultValue - value if not found
   */
  get<T = unknown>(
    key: string,
    path?: Path,
    defaultValue: T | null = null,
  ): T | null {
    const storage = getStorage();
    const raw = storage.getItem(key);
    if (!raw) return defaultValue;

    try {
      const data: any = JSON.parse(raw);
      if (!path) return data;
      const pathArray = Array.isArray(path) ? path : path.split('.');
      let result: any = data;

      for (const p of pathArray) {
        if (result == null || typeof result !== 'object' || !(p in result))
          return defaultValue;
        result = result[p];
      }
      return result as T;
    } catch (e) {
      if (isBrowser) console.error('LocalStorageUtil.get parse error', e);
      return defaultValue;
    }
  },

  /**
   * Set a value in storage, supports nested keys
   * @param key - main key
   * @param path - nested path
   * @param value - value to set
   */
  set<T = unknown>(key: string, path: Path | undefined, value: T): void {
    const storage = getStorage();
    const raw = storage.getItem(key);
    let data: any;
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      data = {};
    }

    const pathArray = Array.isArray(path) ? path : path?.split('.') || [];

    if (pathArray.length === 0) {
      data = value; // set root
    } else {
      let cursor = data;
      for (let i = 0; i < pathArray.length - 1; i++) {
        const p = pathArray[i];
        if (cursor[p] == null || typeof cursor[p] !== 'object') cursor[p] = {};
        cursor = cursor[p];
      }
      cursor[pathArray[pathArray.length - 1]] = value;
    }

    try {
      storage.setItem(key, JSON.stringify(data));
    } catch (e) {
      if (isBrowser) console.error('LocalStorageUtil.set error', e);
    }
  },

  /**
   * Remove a key or nested path from storage
   */
  remove(key: string, path?: Path): void {
    const storage = getStorage();

    if (!path) {
      storage.removeItem(key);
      return;
    }

    const raw = storage.getItem(key);
    if (!raw) return;

    try {
      const data: any = JSON.parse(raw);
      const pathArray = Array.isArray(path) ? path : path.split('.');

      let cursor = data;
      for (let i = 0; i < pathArray.length - 1; i++) {
        const p = pathArray[i];
        if (cursor == null || typeof cursor !== 'object' || cursor[p] == null)
          return; // path not exist
        cursor = cursor[p];
      }

      if (cursor && typeof cursor === 'object') {
        delete cursor[pathArray[pathArray.length - 1]];
        storage.setItem(key, JSON.stringify(data));
      }
    } catch (e) {
      if (isBrowser) console.error('LocalStorageUtil.remove error', e);
    }
  },

  /**
   * Check if a nested key exists
   */
  has(key: string, path: Path): boolean {
    const val = this.get(key, path);
    return val !== null && val !== undefined;
  },

  /**
   * Clear storage (localStorage in browser, memoryStore on server)
   */
  clear(): void {
    const storage = getStorage();
    storage.clear();
  },
};

export default LocalStorage;
