/**
 * Ajusta un canvas a pantalla completa respetando la densidad de píxeles, para que la estela se vea
 * nítida en pantallas retina sin agrandar su tamaño visual.
 *
 * @param {HTMLCanvasElement} canvas - Canvas a ajustar.
 * @param {number} ratio - Densidad de píxeles que se usa para dibujar.
 * @returns {void} No devuelve nada.
 * @example
 * fitCanvas(canvas, Math.min(window.devicePixelRatio, 2))
 */
export const fitCanvas = (canvas: HTMLCanvasElement, ratio: number): void => {
  canvas.width = window.innerWidth * ratio
  canvas.height = window.innerHeight * ratio
  canvas.style.width = `${window.innerWidth}px`
  canvas.style.height = `${window.innerHeight}px`
}
