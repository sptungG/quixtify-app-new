// import { useTranslation as useNTranslation } from "react-i18next";

import { useAppStore } from '@/components/contexts/AppContext';
// import en from "@/i18n/en.json";

function useTranslation() {
  // const { t, i18n, ...rest } = useNTranslation();
  const changeAppLanguage = useAppStore(s => s.changeLanguage);

  const handleChangeLang = (lang: string) => {
    changeAppLanguage(lang);
    // i18n.changeLanguage(lang);
  };

  return {
    // t: (key: keyof typeof en, values?: Record<string, string | number>) => t(key, values),
    // debug check i18nKeys
    t: (key: any, values?: Record<string, string | number>) => key,
    // i18n,
    changeLanguage: handleChangeLang,
    // ...rest,
  };
}

export default useTranslation;
