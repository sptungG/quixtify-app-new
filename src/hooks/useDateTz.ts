import { useCallback } from 'react';

import { useAppContext } from '@/components/contexts/AppContext';
import { CurrentTimeZone, findTimeZoneValid } from '@/utils/constants';
import { dayjs, parseDate } from '@/utils/utils-date';

type TuseDateTzProps = {};
export function useDateTz({}: TuseDateTzProps) {
  // const { currentBusiness } = useAppContext();
  const currentBusinessTimezone =
    findTimeZoneValid(
      // currentBusiness.data?.timezone,
    );
  const fnsTz = currentBusinessTimezone?.fnsTz || CurrentTimeZone;

  const toZonedTime = useCallback(
    (value: any, timeZone?: string) => {
      try {
        if (!value) return undefined as any;
        const parsed = parseDate(value);
        if (!parsed) return undefined as any;
        return parsed.tz(timeZone || fnsTz).toDate();
      } catch (error) {
        return undefined as any;
      }
    },
    [fnsTz, parseDate],
  );

  const fromZonedTime = useCallback(
    (value: any, timeZone?: string) => {
      try {
        if (!value) return undefined as any;
        const parsed = parseDate(value);
        if (!parsed) return undefined as any;
        return dayjs
          .tz(parsed.format('YYYY-MM-DD HH:mm:ss'), timeZone || fnsTz)
          .toDate();
      } catch (error) {
        return undefined as any;
      }
    },
    [fnsTz, parseDate],
  );

  const isToday = useCallback(
    (value: any, timeZone?: string) => {
      try {
        if (!value) return false;
        const parsed = parseDate(value);
        if (!parsed) return false;
        const zonedDate = parsed.tz(timeZone || fnsTz);
        const zonedNow = dayjs().tz(timeZone || fnsTz);
        return zonedDate.isSame(zonedNow, 'day');
      } catch (error) {
        return false;
      }
    },
    [fnsTz, parseDate],
  );

  const formatDateTz = useCallback(
    (value: any, formatString = 'DD/MM/YYYY', timeZone?: string) => {
      try {
        if (!value) return '';
        const parsed = parseDate(value);
        if (!parsed) return '';
        return parsed.tz(timeZone || fnsTz).format(formatString);
      } catch (error) {
        return '';
      }
    },
    [fnsTz, parseDate],
  );

  return {
    fnsTz,
    formatDateTz,
    toZonedTime,
    fromZonedTime,
    isToday,
    parseDate,
  };
}
