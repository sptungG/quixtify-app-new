import { AppProvider } from '@/contexts/AppContext';
import { Notifications } from '@mantine/notifications';
import React from 'react';
import MantineProvider from './MantineProvider';

type TProvidersProps = { children?: React.ReactNode };

const Providers = ({ children }: TProvidersProps) => {
  return (
    <MantineProvider>
      <AppProvider>{children}</AppProvider>
      <Notifications position="top-center" />
    </MantineProvider>
  );
};

export default Providers;
