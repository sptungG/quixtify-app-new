import { default as _dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import weekday from 'dayjs/plugin/weekday';
// import updateLocale from 'dayjs/plugin/updateLocale';

// _dayjs.locale('en');
_dayjs.extend(utc);
_dayjs.extend(timezone);
_dayjs.extend(weekday);
_dayjs.extend(isBetween);
_dayjs.extend(customParseFormat);
_dayjs.extend(relativeTime);
_dayjs.extend(isSameOrAfter);
_dayjs.extend(isSameOrBefore);

export const dayjs = _dayjs;

export const DATE_FORMAT = 'YYYY-MM-DD';

export const parseDate = (date: any, pFormat?: string) => {
  const parsed =
    typeof date === 'number'
      ? dayjs.unix(date)
      : date
        ? dayjs.isDayjs(date)
          ? date
          : dayjs(date, pFormat)
        : undefined;
  return parsed;
};

export const formatFromNow = (date: any) => parseDate(date)?.fromNow();

export const formatDate = (date: any, format = DATE_FORMAT) =>
  parseDate(date)?.format(format) || '';
