import { useAppContext } from '@/contexts/AppContext';
import { useLogout } from '@/hooks/useSupabase';
import { useUrlState } from '@/hooks/useUrlState';
import { Button } from '@mantine/core';
import React from 'react';

type TPageProps = {};

const Page = ({}: TPageProps) => {
  const { currentUser } = useAppContext();

  const [pageUrlState, setPageUrlState] = useUrlState({ day: '' });

  const LogoutReq = useLogout();

  return (
    <div>
      <div className="flex items-center p-2">
        <h1 className="text-3xl font-bold underline mr-2">
          Calendar! {pageUrlState.day}
        </h1>
        <Button
          loading={LogoutReq.isLoading}
          className="font-sora"
          onClick={() => LogoutReq.runAsync()}
        >
          Logout
        </Button>
      </div>
      <pre className="text-sm">{JSON.stringify(currentUser.data, null, 2)}</pre>
    </div>
  );
};

export default Page;
