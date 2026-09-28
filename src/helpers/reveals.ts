import { gsap, SplitText } from '@/plugins/gsap'

/**
 * Divide un título grande en caracteres y hace que suban y se enderecen cuando el título entra en
 * el viewport.
 *
 * @param {Element} title - Elemento del título (texto estático).
 * @returns {SplitText} La instancia de la división; la revierte el contexto de GSAP que la rodea.
 * @example
 * revealTitle(section.querySelector('.big-title')!)
 */
export const revealTitle = (title: Element): SplitText => {
  const split = new SplitText(title, { type: 'chars', charsClass: 'char' })
  gsap.from(split.chars, {
    yPercent: 110,
    rotate: 10,
    opacity: 0,
    stagger: 0.035,
    duration: 1,
    ease: 'power4.out',
    scrollTrigger: { trigger: title, start: 'top 85%' },
  })
  return split
}

/**
 * Hace aparecer y subir los elementos hasta su sitio cuando entran en el viewport.
 *
 * @param {gsap.TweenTarget} targets - Elementos que se animan.
 * @param {Element | string} trigger - Elemento cuya entrada inicia la animación.
 * @param {gsap.TweenVars} vars - Variables extra del tween (desplazamientos, stagger, easing…).
 * @param {string} start - Posición de inicio de ScrollTrigger.
 * @returns {gsap.core.Tween} El tween creado.
 * @example
 * riseIn('.slink', links, { y: 40, stagger: 0.08 })
 */
export const riseIn = (
  targets: gsap.TweenTarget,
  trigger: Element | string,
  vars: gsap.TweenVars,
  start = 'top 85%',
) =>
  gsap.from(targets, {
    opacity: 0,
    duration: 1,
    ease: 'power4.out',
    ...vars,
    scrollTrigger: { trigger, start },
  })
