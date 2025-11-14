import { AppProvider } from '@/contexts/AppContext';
import { Notifications } from '@mantine/notifications';
import { NavigationProgress } from '@mantine/nprogress';
import React from 'react';
import { SWRConfig } from 'swr';
import MantineProvider from './MantineProvider';

const swrConfig = {
  shouldRetryOnError: false,
  revalidateOnFocus: false,
};

type TProvidersProps = { children?: React.ReactNode };

const Providers = ({ children }: TProvidersProps) => {
  return (
    <SWRConfig value={swrConfig}>
      <MantineProvider>
        <AppProvider>{children}</AppProvider>
        <Notifications position="top-center" />
        <NavigationProgress />
      </MantineProvider>
    </SWRConfig>
  );
};

export default Providers;
