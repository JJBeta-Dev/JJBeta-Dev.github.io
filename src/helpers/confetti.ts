import { gsap } from '@/plugins/gsap'

/**
 * Crea una pequeña esfera morada añadida a `document.body` para un efecto de confeti.
 *
 * @param {number} size - Diámetro en píxeles.
 * @returns {HTMLElement} El elemento creado; se elimina solo cuando termina su animación.
 * @example
 * const sphere = createSphere(12)
 */
const createSphere = (size: number): HTMLElement => {
  const sphere = document.createElement('i')
  sphere.className = 'confetti ball'
  sphere.setAttribute('aria-hidden', 'true')
  Object.assign(sphere.style, { width: `${size}px`, height: `${size}px` })
  document.body.append(sphere)
  return sphere
}

/**
 * Hace estallar diez esferas pequeñas hacia fuera desde un punto; se usa al reventar una esfera.
 *
 * @param {number} x - Coordenada horizontal del estallido en el viewport.
 * @param {number} y - Coordenada vertical del estallido en el viewport.
 * @returns {void} No devuelve nada.
 * @example
 * burstAt(event.clientX, event.clientY)
 */
export const burstAt = (x: number, y: number): void => {
  for (let i = 0; i < 10; i++) {
    const sphere = createSphere(gsap.utils.random(6, 14))
    const angle = (i / 10) * Math.PI * 2
    gsap.fromTo(
      sphere,
      { x, y },
      {
        x: x + Math.cos(angle) * gsap.utils.random(40, 90),
        y: y + Math.sin(angle) * gsap.utils.random(40, 90),
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        onComplete: () => sphere.remove(),
      },
    )
  }
}

/**
 * Hace llover esferas desde la parte superior del viewport; se usa al encontrar todos los secretos.
 *
 * @param {number} count - Número de esferas.
 * @param {boolean} reduced - Si es `true`, la caída es más corta y sencilla.
 * @returns {void} No devuelve nada.
 * @example
 * rainConfetti(80, false)
 */
export const rainConfetti = (count: number, reduced: boolean): void => {
  for (let i = 0; i < count; i++) {
    const sphere = createSphere(gsap.utils.random(10, 34))
    const x = gsap.utils.random(0, window.innerWidth)
    gsap.fromTo(
      sphere,
      { x, y: -40 },
      {
        x: x + gsap.utils.random(-160, 160),
        y: window.innerHeight + 60,
        duration: reduced ? 1.2 : gsap.utils.random(1.4, 2.6),
        delay: gsap.utils.random(0, 0.6),
        ease: 'power1.in',
        onComplete: () => sphere.remove(),
      },
    )
  }
}
