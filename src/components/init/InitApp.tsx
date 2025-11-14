import { supabase } from '@/utils/utils-supabase';
import React, { useEffect } from 'react';

type TInitAppProps = { children?: React.ReactNode };

const InitApp = ({ children }: TInitAppProps) => {
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      // setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  return <></>;
};

export default InitApp;
