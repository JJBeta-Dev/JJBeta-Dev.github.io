import type { RefObject } from 'react'
import { threadPoints } from '@/helpers/threadPoints'
import { gsap, ScrollTrigger, useGSAP } from '@/plugins/gsap'
import { catmullRomPath } from '@/utils/catmullRomPath'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/**
 * El hilo discontinuo del diseño de Figma: dos curvas suaves que se dibujan solas al hacer scroll y
 * cosen todas las secciones, con una flecha de cursor montada en la punta. Las posiciones se miden en
 * cada refresco de ScrollTrigger, así que ni la galería fijada ni los cambios de tamaño lo rompen. Con
 * movimiento reducido el hilo simplemente se dibuja completo.
 *
 * @param {import('react').RefObject<HTMLElement | null>} scope - Elemento principal que contiene el SVG
 * `.thread` y todas las secciones.
 * @returns {void} No devuelve nada.
 * @example
 * useThread(main)
 */
export const useThread = (scope: RefObject<HTMLElement | null>): void => {
  const reduced = usePrefersReducedMotion()

  useGSAP(
    () => {
      const main = scope.current
      const svg = main?.querySelector<SVGSVGElement>('.thread')
      const rider = main?.querySelector('.rider')
      if (!main || !svg || !rider) return
      const paths = (['a', 'b'] as const).map((key) => ({
        path: svg.querySelector<SVGPathElement>(`.thread-${key}`),
        mask: svg.querySelector<SVGPathElement>(`.thread-mask-${key}`),
      }))
      if (paths.some(({ path, mask }) => !path || !mask)) return
      const threads = (paths as { path: SVGPathElement; mask: SVGPathElement }[]).map(({ path, mask }) => ({
        path,
        mask,
        length: 0,
        from: 0,
        to: 0,
      }))

      /**
       * Mide las secciones, redimensiona el SVG y recalcula el trazado, la longitud y el tramo
       * vertical de cada hilo.
       *
       * @returns {void} No devuelve nada.
       * @example
       * window.addEventListener('resize', layout)
       */
      const layout = () => {
        const points = threadPoints(main)
        if (!points) return
        const width = main.scrollWidth
        const height = main.scrollHeight
        svg.setAttribute('width', String(width))
        svg.setAttribute('height', String(height))
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
        threads.forEach((thread, i) => {
          const list = points[i] ?? []
          const d = catmullRomPath(list)
          thread.path.setAttribute('d', d)
          thread.mask.setAttribute('d', d)
          thread.length = thread.path.getTotalLength()
          thread.mask.style.strokeDasharray = `${thread.length} ${thread.length}`
          thread.mask.style.strokeDashoffset = reduced ? '0' : String(thread.length)
          thread.from = list[0]?.[1] ?? 0
          thread.to = list[list.length - 1]?.[1] ?? 0
        })
      }

      if (reduced) {
        layout()
        window.addEventListener('resize', layout)
        return () => window.removeEventListener('resize', layout)
      }

      /**
       * Distancia desde el inicio del documento hasta el elemento principal.
       *
       * @returns {number} Desplazamiento vertical en píxeles.
       * @example
       * const top = offset()
       */
      const offset = () => main.getBoundingClientRect().top + window.scrollY
      threads.forEach((thread, i) => {
        ScrollTrigger.create({
          start: () => {
            if (i === 0) layout()
            return thread.from + offset() - window.innerHeight * 0.6
          },
          end: () => thread.to + offset() - window.innerHeight * 0.6,
          onUpdate: ({ progress }) => {
            thread.mask.style.strokeDashoffset = String(thread.length * (1 - progress))
            if (progress <= 0 || progress >= 1) return
            const point = thread.path.getPointAtLength(thread.length * progress)
            gsap.set(rider, { x: point.x, y: point.y, opacity: 1 })
          },
          onToggle: ({ isActive }) => {
            if (!isActive) gsap.to(rider, { opacity: 0, duration: 0.3 })
          },
        })
      })
    },
    { scope, dependencies: [reduced] },
  )
}
