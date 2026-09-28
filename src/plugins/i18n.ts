import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import es from '@/data/locales/es.json'

/**
 * Instancia compartida de i18next. Los recursos van empaquetados y se inicializan de forma síncrona para
 * que los mismos textos se pinten al pre-renderizar y al hidratar, sin parpadeo de carga.
 */
export const i18n = i18next.createInstance()

i18n.use(initReactI18next).init({
  lng: 'es',
  fallbackLng: 'es',
  resources: { es: { translation: es } },
  initAsync: false,
  interpolation: { escapeValue: false },
  returnObjects: true,
})
