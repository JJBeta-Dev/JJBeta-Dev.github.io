/**
 * Serializa datos estructurados para incrustarlos en un `<script type="application/ld+json">`.
 * Escapa `<` para que ningún texto pueda cerrar la etiqueta `</script>` antes de tiempo.
 *
 * @param {unknown} data - Objeto schema.org.
 * @returns {string} JSON seguro para insertar dentro de la etiqueta script.
 * @example
 * serializeJsonLd({ name: '</script>' }) // '{"name":"\\u003c/script>"}'
 */
export const serializeJsonLd = (data: unknown): string => JSON.stringify(data).replace(/</g, '\\u003c')
