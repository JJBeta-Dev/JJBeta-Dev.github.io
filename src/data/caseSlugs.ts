/**
 * Slugs de los casos de estudio. Cada uno se convierte en una ruta pre-renderizada en `/casos/:slug`.
 */
export const CASE_SLUGS = ['perfil', 'tailwind', 'asistente'] as const

/**
 * Un slug de caso de estudio válido.
 */
export type CaseSlug = (typeof CASE_SLUGS)[number]

/**
 * Reduce un parámetro de ruta cualquiera a un slug de caso conocido.
 *
 * @param {string | undefined} value - Valor en bruto que llega desde la URL.
 * @returns {value is CaseSlug} `true` cuando el valor es uno de {@link CASE_SLUGS}.
 * @example
 * isCaseSlug('perfil') // true
 * isCaseSlug('otro') // false
 */
export const isCaseSlug = (value: string | undefined): value is CaseSlug =>
  CASE_SLUGS.includes(value as CaseSlug)
