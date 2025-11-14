import { useAppContext } from '@/contexts/AppContext';
import { useAppStore } from '@/contexts/app-store';
import { getAuthContext } from '@/utils/utils-api';
import { notifyError, notifySuccess } from '@/utils/utils-mantine';
import { supabase } from '@/utils/utils-supabase';
import { useNavigate } from '@modern-js/runtime/router';
import { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';

export function useGetAuth() {
  const Req = useSWR(null, getAuthContext, {
    refreshInterval: 1000 * 60 * 59,
    revalidateOnFocus: true,
  });
  return Req;
}

export function useLogout() {
  const { mutate } = useSWRConfig();

  const navigate = useNavigate();
  const setLogout = useAppStore(s => s.logout);
  const [isLoading, setIsLoading] = useState(false);

  const runAsync = async () => {
    setIsLoading(true);
    try {
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      // Clear any local storage
      setLogout();

      mutate(
        key => true, // which cache keys are updated
        undefined, // update cache data to `undefined`
        { revalidate: false }, // do not revalidate
      );

      // Show success notification
      notifySuccess({
        title: 'Logged out',
        message: 'You have been successfully logged out',
      });

      // Navigate to login page
      navigate(
        `/login?callbackUrl=${[window?.location.pathname, window?.location.search].filter(Boolean).join('')}`,
        { replace: true },
      );
    } catch (error: any) {
      console.error('Logout error:', error);

      // Show error notification
      notifyError({
        title: 'Logout failed',
        message: error.message || 'Failed to log out. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { runAsync, isLoading };
}
