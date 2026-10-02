/**
 * Forma mínima de un tween o timeline que se puede pausar.
 */
export interface Pausable {
  paused: (value: boolean) => unknown
}

/**
 * Mantiene una animación infinita en marcha solo mientras su elemento está en pantalla. Se apoya en
 * IntersectionObserver (lo que de verdad se ve), que sigue siendo correcto aunque las secciones fijadas
 * añadan miles de píxeles de scroll antes del elemento.
 *
 * @param {Pausable} animation - Tween o timeline que se pausa y se reanuda.
 * @param {Element} element - Elemento cuya visibilidad controla la animación.
 * @returns {() => void} Una función que deja de observar.
 * @example
 * const stop = pauseOffscreen(gsap.to('.band__track', { xPercent: 0, repeat: -1 }), band)
 */
export const pauseOffscreen = (animation: Pausable, element: Element): (() => void) => {
  const observer = new IntersectionObserver(([entry]) => animation.paused(!entry?.isIntersecting))
  observer.observe(element)
  return () => observer.disconnect()
}
