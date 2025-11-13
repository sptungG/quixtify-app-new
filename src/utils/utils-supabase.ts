import { createClient } from '@supabase/supabase-js';
import { memoryStorage } from './utils-instorage';

const isBrowser =
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
const storageProvider = () => (isBrowser ? localStorage : memoryStorage);

export const supabase = createClient<any>(
  String(process.env.MODERN_SUPABASE_URL),
  String(process.env.MODERN_SUPABASE_PUBLISHABLE_KEY),
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: storageProvider(),
    },
  },
);
