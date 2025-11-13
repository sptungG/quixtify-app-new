'use client';

// import { UseQueryResult } from '@tanstack/react-query';
// import { User } from 'firebase/auth';
import { pick } from 'lodash';
import { createContext, memo, useContext, useEffect, useMemo } from 'react';

// import { LoadingScreen } from '@/components/results/Loading';
// import { parsedFUser } from '@/components/ui-layout/InitApp';
// import { useFindBusinessById } from '@/modules/businesses/hooks/useBusinessApi';
// import { TBusinessEntity } from '@/modules/businesses/types/business-type';
// import { TERoles, TStaffEntity } from '@/modules/staffs/types/staffs-type';
// import { useFindCurrentUser } from '@/modules/users/hooks/useUserApi';
// import { TUserEntity } from '@/modules/users/types/user-type';

import InitApp from '@/components/init/InitApp';
import { useAppStore as useAppStoreHook } from './app-store';

// const InitOneSignal = dynamic(() => import("@/components/ui-layout/InitOneSignal"), { ssr: false });

const AppContext = createContext<TContextValues>({} as any);

export const useAppStore = useAppStoreHook;
export const useAppContext = () => useContext(AppContext);

const Provider = ({
  children,
  ...props
}: React.PropsWithChildren & TContextValues) => (
  <AppContext.Provider value={props}>{children}</AppContext.Provider>
);
const MemoProvider = memo(Provider);

export const INITIAL_CALENDAR_CONFIGS = {
  calendar_interval: 15,
  calendar_slot_size: 4,
  calendar_day_start_at: '09:00:00',
  calendar_week_starts_on: 0,
};

// MAIN
export const AppProvider = ({ children }: React.PropsWithChildren) => {
  const selectedStaff = useAppStoreHook(s => s.staff);
  // const fUser0 = useAppStoreHook(s => s.fUser);
  // const fUser = parsedFUser(fUser0) as any;

  // const currentUserReq = useFindCurrentUser();
  // const currentUserData = currentUserReq.data;
  // const currentUserStaffs = currentUserData?.staffs || [];
  // const currentUserDataStaff = useMemo(() => {
  //   const foundItem0 = currentUserStaffs?.[0];
  //   const foundItem1 = currentUserStaffs?.find(e => e?.id === selectedStaff);
  //   return selectedStaff
  //     ? {
  //         ...foundItem1,
  //         email: foundItem1?.email || currentUserData?.email || fUser?.email,
  //       }
  //     : (currentUserStaffs?.length < 2 &&
  //         foundItem0 && {
  //           ...(foundItem0 || {}),
  //           email: foundItem0?.email || currentUserData?.email || fUser?.email,
  //         }) ||
  //         ({} as TStaffEntity);
  // }, [JSON.stringify(currentUserData), selectedStaff]);

  // const isRole_O =
  //   String(currentUserDataStaff?.role) === String(TERoles.ROLE_OWNER);

  // const currentBusinessReq = useFindBusinessById(
  //   currentUserDataStaff?.business?.id || '',
  // );

  // const calendarConfigs = (
  //   currentBusinessReq.data?.id
  //     ? pick(currentBusinessReq.data, [
  //         'calendar_interval',
  //         'calendar_slot_size',
  //         'calendar_day_start_at',
  //         'calendar_week_starts_on',
  //       ])
  //     : INITIAL_CALENDAR_CONFIGS
  // ) as TCalendarConfigs;

  // -----------------------------------------------------
  const data: TContextValues = {
    // fUser: fUser as any,
    // currentUserDataStaff: currentUserDataStaff,
    // currentBusiness: pick(currentBusinessReq, [
    //   'data',
    //   'isFetching',
    //   'refetch',
    //   'isLoading',
    //   'error',
    // ]),
    // currentUser: pick(currentUserReq, [
    //   'data',
    //   'isFetching',
    //   'refetch',
    //   'isLoading',
    // ]),
    calendarConfigs: INITIAL_CALENDAR_CONFIGS,
    // calendarConfigs: calendarConfigs || INITIAL_CALENDAR_CONFIGS,
  };
  return (
    <MemoProvider {...data}>
      {children}
      <InitApp />
      {/* <InitNetwork /> */}
      {/* <InitOneSignal /> */}
    </MemoProvider>
  );
};

// type TCalendarConfigs = Required<
//   Pick<
//     TBusinessEntity,
//     | 'calendar_interval'
//     | 'calendar_slot_size'
//     | 'calendar_day_start_at'
//     | 'calendar_week_starts_on'
//   >
// >;

interface TContextValues {
  // fUser:
  //   | Pick<
  //       User,
  //       'email' | 'phoneNumber' | 'photoURL' | 'displayName' | 'providerData'
  //     >
  //   | undefined;
  // currentBusiness: Pick<
  //   UseQueryResult<TBusinessEntity | undefined, any>,
  //   'data' | 'isFetching' | 'refetch' | 'isLoading' | 'error'
  // >;
  // currentUser: Pick<
  //   UseQueryResult<TUserEntity | undefined, any>,
  //   'data' | 'isFetching' | 'refetch' | 'isLoading'
  // >;
  // currentUserDataStaff: TStaffEntity;
  calendarConfigs: any;
}
