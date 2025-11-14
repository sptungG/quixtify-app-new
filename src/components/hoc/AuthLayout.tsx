import React, { useEffect, useState } from 'react';

import { useAppContext } from '@/contexts/AppContext';

import { Navigate, useLocation } from '@modern-js/runtime/router';
import { LoadingScreen } from '../results/Loading';

type TAuthLayoutProps = { children?: React.ReactNode };

const AuthLayout = ({ children }: TAuthLayoutProps) => {
  const { pathname } = useLocation();

  const { currentUser, currentUserDataStaff, currentBusiness } =
    useAppContext();
  const currentUserData = currentUser.data;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    // Cleanup the timeout if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || currentUser.isLoading) {
    return <LoadingScreen className="fixed inset-0" />; // Replace with your custom loading indicator
  }

  if (!currentUserData?.id) {
    return (
      <Navigate
        to={`/login?callbackUrl=${[window?.location.pathname, window?.location.search].filter(Boolean).join('')}`}
      />
    );
  }

  // if (pathname === "/account-setup" && currentUserDataStaff?.id) {
  //   return <Navigate to={`/calendar?day=${formatDateTz(new Date(), "YYYY-MM-DD")}`} />;
  // }

  if (
    currentUserDataStaff?.id &&
    !currentBusiness.isLoading &&
    currentBusiness.data == null &&
    pathname !== '/account'
  ) {
    return <Navigate to="/account" />;
  }

  if (
    pathname !== '/account-setup' &&
    currentUserData?.id &&
    !currentUserDataStaff?.id
  ) {
    return <Navigate to="/account-setup" />;
  }

  return <>{children}</>;
};

export default AuthLayout;
