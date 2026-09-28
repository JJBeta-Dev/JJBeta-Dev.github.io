import { gsap } from '@/plugins/gsap'

/**
 * Hace que las letras (`.char`) de un título grande suban y se enderecen cuando el título entra
 * en pantalla. Las letras las pinta React con `SplitChars`.
 *
 * @param {Element} title - Título ya dividido en letras.
 * @returns {gsap.core.Tween} La animación de entrada; la revierte el contexto de GSAP que la rodea.
 * @example
 * revealTitle(section.querySelector('.big-title')!)
 */
export const revealTitle = (title: Element): gsap.core.Tween =>
  gsap.from(title.querySelectorAll('.char'), {
    yPercent: 110,
    rotate: 10,
    opacity: 0,
    stagger: 0.035,
    duration: 1,
    ease: 'power4.out',
    scrollTrigger: { trigger: title, start: 'top 85%' },
  })

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
