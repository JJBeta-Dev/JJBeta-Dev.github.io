/**
 * Formatea un instante como hora local corta (por ejemplo `9:05 a. m.`) en una zona horaria dada.
 *
 * @param {Date} date - Instante que se formatea.
 * @param {string} timeZone - Zona horaria IANA, como `America/Bogota`.
 * @param {string} locale - Locale BCP 47 usado para el formato.
 * @returns {string} La hora y los minutos formateados.
 * @example
 * formatClock(new Date('2026-09-28T14:05:00Z'), 'America/Bogota') // '9:05 a. m.'
 */
export const formatClock = (date: Date, timeZone: string, locale = 'es-CO'): string =>
  new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit', timeZone }).format(date)
