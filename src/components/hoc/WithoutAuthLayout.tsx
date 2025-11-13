'use client';

import React from 'react';

import { useAppContext } from '@/contexts/AppContext';
import { getCallbackUrl } from '@/utils/utils';

import { useDateTz } from '@/hooks/useDateTz';
import { Navigate } from '@modern-js/runtime/router';
import { LoadingScreen } from '../results/Loading';

type TWithoutAuthLayoutProps = { children?: React.ReactNode };

const WithoutAuthLayout = ({ children }: TWithoutAuthLayoutProps) => {
  // const { currentUser, currentUserDataStaff } = useAppContext();
  // const currentUserData = currentUser.data;
  const { formatDateTz } = useDateTz({});

  // if (!currentUser.isFetching && !!currentUserData?.id) {
  //   if (!currentUserDataStaff?.id) return <Navigate to="/account-setup" />;
  //   const callbackUrlValue = (getCallbackUrl(window?.location.search) ||
  //     '') as string;
  //   const defaultUrl = `/calendar?day=${formatDateTz(new Date(), 'yyyy-MM-dd')}`;
  //   const callbackUrl = callbackUrlValue || defaultUrl;

  //   return <Navigate to={callbackUrl} />;
  // }

  return (
    <>
      {children}
      {/* {currentUser.isFetching && <LoadingScreen className="fixed inset-0" />} */}
    </>
  );
};

export default WithoutAuthLayout;
