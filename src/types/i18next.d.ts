import 'i18next'
import type es from '@/data/locales/es.json'

/**
 * Tipado de i18next con los recursos reales: cada clave de traducción se valida en compilación y
 * los arreglos u objetos solo se piden de forma explícita con `returnObjects`.
 */
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: { translation: typeof es }
  }
}
