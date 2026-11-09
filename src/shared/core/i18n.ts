import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';

i18n
    .use(HttpApi)
    .use(initReactI18next)
    .init({
        lng: 'en', 
        fallbackLng: 'en',
        backend: {
            loadPath: `${import.meta.env.VITE_API_BASE_URL}api/public/resources/page/{{lng}}/{{ns}} `,
        },
    });

export default i18n;