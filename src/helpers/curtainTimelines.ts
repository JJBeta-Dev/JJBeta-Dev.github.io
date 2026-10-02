import type { CurtainOrigin } from '@/contexts/CurtainContext'
import { gsap } from '@/plugins/gsap'

/**
 * Pasos de animación de la cortina de transición.
 */
export type CurtainStep = 'cover' | 'lift' | 'drop' | 'close'

/**
 * Construye la animación de un paso de la cortina. Mientras la cortina está visible bloquea los
 * clics (`pointer-events: auto`), para que nadie pueda volver a activar una transición a medias.
 *
 * @param {HTMLElement} element - Elemento de la cortina.
 * @param {CurtainStep} step - Paso a animar.
 * @param {CurtainOrigin} origin - Punto desde el que crece la cortina en el paso `cover`.
 * @returns {gsap.core.Timeline} La línea de tiempo del paso.
 * @example
 * curtainTimeline(curtain, 'cover', { x: 120, y: 340 })
 */
export const curtainTimeline = (
  element: HTMLElement,
  step: CurtainStep,
  origin: CurtainOrigin,
): gsap.core.Timeline => {
  const timeline = gsap.timeline()
  /**
   * Arma el valor de `clip-path` de un círculo.
   *
   * @param {number} size - Radio en porcentaje.
   * @param {string} x - Posición horizontal del centro.
   * @param {string} y - Posición vertical del centro.
   * @returns {string} Valor CSS `circle(...)`.
   * @example
   * circle(150, '50%', '50%')
   */
  const circle = (size: number, x: string, y: string) => `circle(${size}% at ${x} ${y})`
  if (step === 'cover') {
    const x = `${origin.x}px`
    const y = `${origin.y}px`
    return timeline
      .set(element, { visibility: 'visible', pointerEvents: 'auto', yPercent: 0, clipPath: circle(0, x, y) })
      .to(element, { clipPath: circle(150, x, y), duration: 0.75, ease: 'power3.inOut' })
  }
  if (step === 'lift') {
    return timeline
      .to(element, { yPercent: -100, duration: 0.8, ease: 'power4.inOut', delay: 0.05 })
      .set(element, { visibility: 'hidden', pointerEvents: 'none', yPercent: 0 })
  }
  if (step === 'drop') {
    return timeline
      .set(element, {
        visibility: 'visible',
        pointerEvents: 'auto',
        clipPath: circle(150, '50%', '50%'),
        yPercent: 100,
      })
      .to(element, { yPercent: 0, duration: 0.65, ease: 'power4.inOut' })
  }
  return timeline
    .to(element, { clipPath: circle(0, '50%', '50%'), duration: 0.7, ease: 'power3.inOut', delay: 0.05 })
    .set(element, { visibility: 'hidden', pointerEvents: 'none' })
}

/**
 * Convierte una línea de tiempo de GSAP en una promesa que se resuelve cuando termina.
 *
 * @param {gsap.core.Timeline} timeline - Animación a esperar.
 * @returns {Promise<void>} Promesa que se resuelve al completar la animación.
 * @example
 * await finished(curtainTimeline(curtain, 'lift', origin))
 */
export const finished = (timeline: gsap.core.Timeline): Promise<void> =>
  new Promise((resolve) => timeline.eventCallback('onComplete', () => resolve()))
