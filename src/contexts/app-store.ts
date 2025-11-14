import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { MemoryStorage } from './../utils/utils-instorage';

export interface AppState {
  lang: string;
  theme: string;
  business: string;
  staff: string;
  calendarView: string;
  calendarUnassign: string;
  sidebarCollapsed: string;
  calendarColWidth: string;
}

export type AppActions = {
  changeLanguage: (value: string) => void;
  changeTheme: (value: string) => void;
  setSelectedBusiness: (value: string) => void;
  setSelectedStaff: (value: string) => void;
  setCalendarView: (value: string) => void;
  setCalendarUnassign: (value: string) => void;
  setSidebarCollapsed: (value: string) => void;
  setCalendarColWidth: (value: string) => void;
  logout: () => void;
};

export type AppStore = AppState & AppActions;

export const defaultInitState: AppState = {
  lang: 'en',
  theme: 'light',
  business: '',
  staff: '',
  calendarView: 'day',
  calendarUnassign: '1',
  sidebarCollapsed: '1',
  calendarColWidth: '230px',
};

// const cookieStorage = {
//   getItem: (name: string): string | null => {
//     const value = Cookies.get(name);
//     return value ? JSON.parse(value) : null;
//   },
//   setItem: (name: string, value: string): void => {
//     const config = cookieConfig[name] || {};
//     Cookies.set(name, JSON.stringify(value), config);
//   },
//   removeItem: (name: string): void => {
//     Cookies.remove(name, cookieConfig[name]);
//   },
// };

const isBrowser =
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
const storageProvider = () => (isBrowser ? localStorage : new MemoryStorage());

export const useAppStore = create<AppStore>()(
  persist(
    set => ({
      ...defaultInitState,
      changeLanguage: value => set(() => ({ lang: value })),
      changeTheme: value => set(() => ({ theme: value })),
      setSelectedBusiness: value => set(() => ({ business: value })),
      setSelectedStaff: value => set(() => ({ staff: value })),
      setCalendarView: value => set(() => ({ calendarView: value })),
      setSidebarCollapsed: value => set(() => ({ sidebarCollapsed: value })),
      setCalendarUnassign: value => set(() => ({ calendarUnassign: value })),
      setCalendarColWidth: value => set(() => ({ calendarColWidth: value })),
      logout: () =>
        set(() => ({
          business: '',
          staff: '',
          calendarView: 'day',
        })),
    }),
    {
      name: 'appStorage',
      storage: createJSONStorage(storageProvider),
    },
  ),
);
