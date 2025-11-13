import { AppProvider } from '@/components/contexts/AppContext';
import { Notifications } from '@mantine/notifications';
import { NavigationProgress } from '@mantine/nprogress';
import React from 'react';
import MantineProvider from './MantineProvider';

type TProvidersProps = { children?: React.ReactNode };

const Providers = ({ children }: TProvidersProps) => {
  return (
    <MantineProvider>
      <AppProvider>{children}</AppProvider>
      <Notifications position="top-center" />
      <NavigationProgress />
    </MantineProvider>
  );
};

export default Providers;
