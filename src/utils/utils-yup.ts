import * as Yup from 'yup';

export const passwordSchema = Yup.string()
  .matches(/(?=.*[A-Z])/, 'Password must contain at least 01 uppercase letter')
  .matches(/(?=.*[a-z])/, 'Password must contain at least 01 lowercase letter')
  .matches(/(?=.*\d)/, 'Password must contain at least 01 digit');
// .matches(/[$&+,:;=?@#|'<>.^*()%!-]/, "Password must contain at least 01 special character");

export const workingHoursSchema = Yup.mixed<Record<string, any>>().test(
  'validate-working-hours',
  'Invalid working hours',
  (value, { createError }) => {
    if (!value) return false;
    const days = Object.keys(value);
    for (const day of days) {
      const dayData = value[day];
      if (dayData.is_working) {
        if (!dayData.to || !dayData.from) {
          return createError({
            message: 'Working time range is required when active working day',
          });
        }
      }
    }
    return true;
  },
);

export default Yup;
