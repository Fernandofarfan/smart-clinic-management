import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      es: {
        translation: {
          welcome: "Bienvenido a Smart Clinic",
          login: {
            title: "Iniciar Sesión",
            email: "Correo Electrónico",
            password: "Contraseña",
            submit: "Ingresar",
            forgotPassword: "¿Olvidaste tu contraseña?"
          },
          dashboard: {
            title: "Panel de Control",
            patients: "Pacientes",
            appointments: "Citas",
            doctors: "Doctores"
          }
        }
      },
      en: {
        translation: {
          welcome: "Welcome to Smart Clinic",
          login: {
            title: "Login",
            email: "Email",
            password: "Password",
            submit: "Sign In",
            forgotPassword: "Forgot password?"
          },
          dashboard: {
            title: "Dashboard",
            patients: "Patients",
            appointments: "Appointments",
            doctors: "Doctors"
          }
        }
      }
    }
  });

export default i18n;
