import { useState, type CSSProperties, type RefObject } from 'react'
import { flushSync } from 'react-dom'
import { FONT_OPTIONS, SIZE_OPTIONS, type TextFormat } from '@/data/editorOptions'
import { gsap, useGSAP } from '@/plugins/gsap'
import { useFontEasterEggs } from '@/hooks/useFontEasterEggs'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

/**
 * Estado del editor en vivo de "Sobre mí": formatos de texto, fuente y tamaño. Cambiar la fuente o
 * el tamaño nunca da saltos: el texto se desenfoca, se aplica el cambio, la tarjeta se ajusta
 * suavemente a su nueva altura y las palabras vuelven una tras otra. Elegir ciertas fuentes revela
 * sus secretos.
 *
 * @param {import('react').RefObject<HTMLElement | null>} scope - Elemento raíz del editor.
 * @returns {{ formats: ReadonlySet<TextFormat>, toggleFormat: (format: TextFormat) => void, font: number, size: number, selectFont: (index: number) => void, selectSize: (index: number) => void, className: string, style: import('react').CSSProperties }}
 * Formatos, índices de fuente y tamaño seleccionados, sus setters y el estilo en línea del editor.
 * @example
 * const editor = useEditor(root)
 * <div className={`editor ${editor.className}`} style={editor.style} />
 */
export const useEditor = (scope: RefObject<HTMLElement | null>) => {
  const reduced = usePrefersReducedMotion()
  const onFontPicked = useFontEasterEggs()
  const { contextSafe } = useGSAP({ scope })
  const [formats, setFormats] = useState<ReadonlySet<TextFormat>>(new Set())
  const [font, setFont] = useState(0)
  const [size, setSize] = useState(1)

  /**
   * Activa o desactiva un formato de texto.
   *
   * @param {TextFormat} format - Formato que se alterna.
   * @returns {void} No devuelve nada.
   * @example
   * toggleFormat('bold')
   */
  const toggleFormat = (format: TextFormat) =>
    setFormats((previous) => {
      const next = new Set(previous)
      if (next.has(format)) next.delete(format)
      else next.add(format)
      return next
    })

  /**
   * Aplica un cambio de fuente o tamaño con la transición de desenfoque y ajuste de altura.
   *
   * @param {() => void} apply - Actualización de estado que se aplica a mitad de la transición.
   * @returns {void} No devuelve nada.
   * @example
   * morph(() => setFont(2))
   */
  const morph = contextSafe((apply: () => void) => {
    const root = scope.current
    if (reduced || !root) return apply()
    const paragraphs = root.querySelectorAll('.editor__text p')
    gsap
      .timeline()
      .to(paragraphs, {
        opacity: 0,
        y: -6,
        filter: 'blur(5px)',
        duration: 0.18,
        stagger: 0.04,
        ease: 'power2.in',
      })
      .add(() => {
        const from = root.offsetHeight
        flushSync(apply)
        gsap.fromTo(
          root,
          { height: from },
          { height: root.offsetHeight, duration: 0.55, ease: 'power3.inOut', clearProps: 'height' },
        )
      })
      .set(paragraphs, { y: 0, filter: 'blur(0px)', opacity: 1 })
      .fromTo(
        root.querySelectorAll('.editor__text .w'),
        { yPercent: 70, opacity: 0, filter: 'blur(4px)' },
        {
          yPercent: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.45,
          stagger: 0.006,
          ease: 'power3.out',
          clearProps: 'filter',
        },
      )
  })

  const fontValue = FONT_OPTIONS[font]?.value
  const sizeValue = SIZE_OPTIONS[size]?.value
  const style = {
    ...(fontValue && { '--ed-font': fontValue }),
    ...(sizeValue && { '--ed-size': sizeValue }),
  } as CSSProperties

  return {
    formats,
    toggleFormat,
    font,
    size,
    selectFont: (index: number) => {
      morph(() => setFont(index))
      onFontPicked(index)
    },
    selectSize: (index: number) => morph(() => setSize(index)),
    className: [...formats].join(' '),
    style,
  }
}
