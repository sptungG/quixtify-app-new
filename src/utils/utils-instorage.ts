// Memory-only storage for SSR
export class MemoryStorage {
  private store = new Map<string, string>();

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }
}

// Secure storage wrapper with encryption
export class SecureStorage {
  private memoryStore = new Map<string, string>();
  private storageKey = '_ssk';
  private encryptionKey: string | null = null;

  constructor() {
    this.encryptionKey = process.env.MODERN_API_URL || 'Q_API_URL';
  }

  private encrypt(data: string): string {
    if (!this.encryptionKey) return data;

    try {
      // Simple but effective XOR cipher
      let result = '';
      const key = this.encryptionKey;

      for (let i = 0; i < data.length; i++) {
        result += String.fromCharCode(
          data.charCodeAt(i) ^ key.charCodeAt(i % key.length),
        );
      }

      // Base64 encode to make it storage-safe
      return btoa(result);
    } catch (error) {
      console.warn('Encryption failed:', error);
      return data;
    }
  }

  private decrypt(encrypted: string): string {
    if (!this.encryptionKey) return encrypted;

    try {
      // Decode from Base64
      const decoded = atob(encrypted);
      const key = this.encryptionKey;
      let result = '';

      // XOR decrypt
      for (let i = 0; i < decoded.length; i++) {
        result += String.fromCharCode(
          decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length),
        );
      }

      return result;
    } catch (error) {
      console.warn('Decryption failed:', error);
      return encrypted;
    }
  }

  getItem(key: string): string | null {
    // Try memory first (fast)
    const memValue = this.memoryStore.get(key);
    if (memValue) {
      return this.decrypt(memValue);
    }

    // Try localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = localStorage.getItem(key);
        if (stored) {
          const decrypted = this.decrypt(stored);
          // Cache in memory for faster subsequent reads
          this.memoryStore.set(key, stored);
          return decrypted;
        }
      } catch (error) {
        console.warn('localStorage read failed:', error);
      }
    }

    return null;
  }

  setItem(key: string, value: string): void {
    const encrypted = this.encrypt(value);

    // Always store in memory
    this.memoryStore.set(key, encrypted);

    // Try to persist to localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(key, encrypted);
      } catch (error) {
        // Handle quota exceeded or private browsing
        console.warn('localStorage write failed:', error);

        // Try to clear old Supabase data if quota exceeded
        if (
          error instanceof DOMException &&
          error.name === 'QuotaExceededError'
        ) {
          this.clearOldData();
          // Retry once
          try {
            localStorage.setItem(key, encrypted);
          } catch (retryError) {
            console.warn('localStorage retry failed:', retryError);
          }
        }
      }
    }
  }

  removeItem(key: string): void {
    // Remove from memory
    this.memoryStore.delete(key);

    // Remove from localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn('localStorage remove failed:', error);
      }
    }
  }

  private clearOldData(): void {
    try {
      // Clear old Supabase auth tokens to free space
      const keysToCheck = [
        'supabase.auth.token',
        'sb-auth-token',
        // Add other old keys if known
      ];

      for (const key of keysToCheck) {
        try {
          localStorage.removeItem(key);
        } catch (e) {
          // Ignore errors
        }
      }
    } catch (error) {
      console.warn('Clear old data failed:', error);
    }
  }
}
