import React from 'react';

import { useAppContext } from '@/contexts/AppContext';
import { getCallbackUrl } from '@/utils/utils';

import { useDateTz } from '@/hooks/useDateTz';
import { useGetAuth } from '@/hooks/useSupabase';
import { Navigate } from '@modern-js/runtime/router';
import { LoadingScreen } from '../results/Loading';

type TWithoutAuthLayoutProps = { children?: React.ReactNode };

const WithoutAuthLayout = ({ children }: TWithoutAuthLayoutProps) => {
  const GetAuthReq = useGetAuth();
  const { currentUser, currentUserDataStaff } = useAppContext();
  const currentUserData = currentUser.data;

  const { formatDateTz } = useDateTz({});

  const at = GetAuthReq?.data?.data?.session.access_token;

  if (!currentUser.isLoading && !!currentUserData?.id) {
    if (!currentUserDataStaff?.id) return <Navigate to="/account-setup" />;
    const callbackUrlValue = (getCallbackUrl(window?.location.search) ||
      '') as string;
    const defaultUrl = `/calendar?day=${formatDateTz(new Date(), 'YYYY-MM-DD')}`;
    const callbackUrl = callbackUrlValue || defaultUrl;

    return <Navigate to={callbackUrl} />;
  }

  return (
    <>
      {children}
      {(currentUser.isLoading || at) && (
        <LoadingScreen className="fixed inset-0" />
      )}
    </>
  );
};

export default WithoutAuthLayout;
