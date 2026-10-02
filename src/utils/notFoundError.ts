/**
 * Error que indica que la URL no corresponde a ningún contenido. El `ErrorBoundary` raíz lo
 * reconoce y muestra la página 404 sin registrarlo como un fallo inesperado.
 */
export class NotFoundError extends Error {
  /**
   * Crea el error con un mensaje que identifica lo que no se encontró.
   *
   * @param {string} resource - Recurso solicitado, por ejemplo la ruta.
   * @example
   * throw new NotFoundError('/casos/otro')
   */
  constructor(resource: string) {
    super(`Not found: ${resource}`)
    this.name = 'NotFoundError'
  }
}
