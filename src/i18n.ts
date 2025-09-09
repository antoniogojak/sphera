import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/translation.json";
import hr from "./locales/hr/translation.json";

const resources = {
  en: { translation: en },
  hr: { translation: hr },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    debug: process.env.NODE_ENV !== "production",
  });

export default i18n;