const UNITS: ReadonlyArray<[Intl.RelativeTimeFormatUnit, number]> = [
  ['year', 365 * 24 * 3600],
  ['month', 30 * 24 * 3600],
  ['week', 7 * 24 * 3600],
  ['day', 24 * 3600],
  ['hour', 3600],
  ['minute', 60],
]

/**
 * Describe hace cuánto ocurrió algo usando la unidad más grande que encaje
 * (por ejemplo `hace 2 días` o `hace 3 horas`).
 *
 * @param {Date} date - Instante pasado que se describe.
 * @param {Date} now - Instante de referencia; `new Date()` por defecto.
 * @param {string} locale - Locale BCP 47 usado para la redacción.
 * @returns {string} Un tiempo relativo legible, o `ahora` si ocurrió hace menos de un minuto.
 * @example
 * formatRelativeTime(new Date('2026-09-26'), new Date('2026-09-28')) // 'hace 2 días'
 */
export const formatRelativeTime = (date: Date, now = new Date(), locale = 'es'): string => {
  const seconds = Math.round((date.getTime() - now.getTime()) / 1000)
  const format = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return format.format(Math.round(seconds / size), unit)
  }
  return format.format(0, 'second')
}
