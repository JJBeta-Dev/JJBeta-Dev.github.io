/**
 * Geometría necesaria para dibujar la etiqueta curva dentro del blob de la foto.
 */
export interface BlobArc {
  d: string
  width: number
  height: number
}

/**
 * Construye el arco que sigue la etiqueta curva. Recorre el borde interior inferior del blob orgánico
 * de la foto con los dos cuartos de elipse que define su `border-radius`
 * (62% 38% 46% 54% / 48% 40% 60% 52%), desplazado hacia dentro `inset` píxeles.
 *
 * @param {number} width - Ancho del blob en píxeles.
 * @param {number} height - Alto del blob en píxeles.
 * @param {number} margin - Espacio extra alrededor del blob para que el texto nunca se recorte.
 * @param {number} inset - Distancia al borde del blob; los valores negativos meten el texto hacia dentro.
 * @returns {BlobArc} El trazado SVG y el tamaño del lienzo SVG (blob más márgenes).
 * @example
 * blobArcPath(380, 480, 70, -16).d // 'M… A… 0 0 0 … A… 0 0 0 …'
 */
export const blobArcPath = (width: number, height: number, margin = 70, inset = -16): BlobArc => {
  const left = { cx: 0.54 * width, cy: 0.48 * height, rx: 0.54 * width + inset, ry: 0.52 * height + inset }
  const right = { cx: 0.54 * width, cy: 0.4 * height, rx: 0.46 * width + inset, ry: 0.6 * height + inset }
  /**
   * Calcula el punto de una elipse en un ángulo dado, ya desplazado por el margen.
   *
   * @param {typeof left} e - Elipse con centro y radios.
   * @param {number} degrees - Ángulo en grados.
   * @returns {[number, number]} Coordenadas `[x, y]` del punto.
   * @example
   * at(left, 90)
   */
  const at = (e: typeof left, degrees: number): [number, number] => {
    const radians = (degrees * Math.PI) / 180
    return [e.cx + e.rx * Math.cos(radians) + margin, e.cy + e.ry * Math.sin(radians) + margin]
  }
  const [x1, y1] = at(left, 165)
  const [xb, yb] = at(left, 90)
  const [x2, y2] = at(right, 15)
  return {
    d: `M${x1} ${y1} A${left.rx} ${left.ry} 0 0 0 ${xb} ${yb} A${right.rx} ${right.ry} 0 0 0 ${x2} ${y2}`,
    width: width + 2 * margin,
    height: height + 2 * margin,
  }
}
