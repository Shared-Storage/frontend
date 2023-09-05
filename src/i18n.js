import i18n from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    backend: {
      // Translation file path
      loadPath: "/assets/i18n/{{ns}}/{{lng}}.json",
    },
    fallbackLng: "en",
    debug: process.env.REACT_APP_ENABLE_DEBUG === "true" ? true : false,
    ns: [
      "common",
      "Dashboard",
      "EmailNotVerified",
      "ForgotPassword",
      "PageNotFound",
      "SignIn",
      "SignUp",
      "UserAccount",
      "UserPreferences",
      "VerifyEmail",
      "VerifyForgotPassword",
      "ChangePasswordDialog",
      "Support",
    ],
    interpolation: {
      escapeValue: false,
      formatSeparator: ",",
    },
    react: {
      // wait: true,
    },
  });

export default i18n;
