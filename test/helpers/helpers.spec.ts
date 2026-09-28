import { afterEach, describe, expect, it, vi } from 'vitest'
import { burstAt, rainConfetti } from '@/helpers/confetti'
import { cursorTarget } from '@/helpers/cursorTarget'
import { drawRibbon, ribbonPalettes } from '@/helpers/drawRibbon'
import { fitCanvas } from '@/helpers/fitCanvas'
import { greetConsole } from '@/helpers/greetConsole'
import { createMediaQueryStore } from '@/helpers/mediaQueryStore'
import { caseMeta, homeMeta, notFoundMeta } from '@/helpers/pageMeta'
import { pauseOffscreen } from '@/helpers/pauseOffscreen'
import { readToken } from '@/helpers/readToken'
import { revealTitle, riseIn } from '@/helpers/reveals'
import { threadPoints } from '@/helpers/threadPoints'
import { describeLayer, labelFrames, pickLayer } from '@/helpers/wireFrames'
import { intersectAll, observers } from '../setupTest'

afterEach(() => {
  document.body.innerHTML = ''
  vi.restoreAllMocks()
})

describe('cursorTarget', () => {
  it('lee la etiqueta de data-cursor o detecta elementos clicables', () => {
    document.body.innerHTML =
      '<div data-cursor="Arrastra"><span id="a"></span></div><a href="#" id="b"><i id="c"></i></a><p id="d"></p>'
    expect(cursorTarget(document.getElementById('a'))).toEqual({ label: 'Arrastra', link: false })
    expect(cursorTarget(document.getElementById('c'))).toEqual({ label: '', link: true })
    expect(cursorTarget(document.getElementById('d'))).toEqual({ label: '', link: false })
    expect(cursorTarget(null)).toEqual({ label: '', link: false })
  })
})

describe('confetti', () => {
  it('crea esferas decorativas para la explosión y la lluvia', () => {
    burstAt(10, 10)
    expect(document.querySelectorAll('.confetti')).toHaveLength(10)
    rainConfetti(3, true)
    rainConfetti(2, false)
    expect(document.querySelectorAll('.confetti[aria-hidden="true"]')).toHaveLength(15)
  })
})

describe('drawRibbon', () => {
  it('traza la cinta y la punta con los colores de la paleta', () => {
    const gradient = { addColorStop: vi.fn() }
    const context = {
      createLinearGradient: vi.fn(() => gradient),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      quadraticCurveTo: vi.fn(),
      closePath: vi.fn(),
      fill: vi.fn(),
      arc: vi.fn(),
    } as unknown as CanvasRenderingContext2D
    const palette = { from: 'a', mid: 'b', to: 'c', glow: 'd', tip: 'e' }
    const points = [
      { x: 0, y: 0, t: 0 },
      { x: 5, y: 5, t: 10 },
      { x: 10, y: 0, t: 20 },
    ]
    drawRibbon(context, points, { now: 20, life: 900, ratio: 2, painting: true, palette })
    drawRibbon(context, points, { now: 500, life: 900, ratio: 1, painting: false, palette })
    expect(gradient.addColorStop).toHaveBeenCalledTimes(6)
    expect(context.fill).toHaveBeenCalledTimes(4)
    expect(context.fillStyle).toBe('e')
  })

  it('arma las paletas clara y de marca desde los tokens', () => {
    document.documentElement.style.setProperty('--color-main', 'oklch(50% 0.2 280)')
    document.documentElement.style.setProperty('--color-on-brand', 'oklch(100% 0 0)')
    const palettes = ribbonPalettes()
    expect(palettes.light.tip).toBe('oklch(50% 0.2 280)')
    expect(palettes.brand.from).toBe('oklch(100% 0 0 / 0)')
  })
})

describe('fitCanvas, readToken y greetConsole', () => {
  it('ajusta el canvas a la densidad de píxeles', () => {
    const canvas = document.createElement('canvas')
    fitCanvas(canvas, 2)
    expect(canvas.width).toBe(window.innerWidth * 2)
    expect(canvas.style.width).toBe(`${window.innerWidth}px`)
  })

  it('lee tokens del tema', () => {
    document.documentElement.style.setProperty('--color-hover', ' oklch(60% 0.2 320) ')
    expect(readToken('--color-hover')).toBe('oklch(60% 0.2 320)')
  })

  it('saluda en la consola con el color de marca', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {})
    greetConsole('Hola', 'Escríbeme', 'purple')
    expect(log).toHaveBeenCalledTimes(2)
    expect(log.mock.calls[0]?.[1]).toContain('color: purple')
  })
})

describe('createMediaQueryStore', () => {
  it('se suscribe, lee el estado y usa el valor de servidor', () => {
    const add = vi.fn()
    const remove = vi.fn()
    window.matchMedia = vi.fn(() => ({
      matches: true,
      addEventListener: add,
      removeEventListener: remove,
    })) as never
    const store = createMediaQueryStore('(pointer: fine)', true)
    const unsubscribe = store.subscribe(() => {})
    unsubscribe()
    expect(add).toHaveBeenCalled()
    expect(remove).toHaveBeenCalled()
    expect(store.getSnapshot()).toBe(true)
    expect(store.getServerSnapshot()).toBe(true)
  })
})

describe('pageMeta', () => {
  it('genera título y metadatos de inicio, casos y 404', () => {
    expect(homeMeta()[0]).toEqual({ title: 'JJBeta · Diseñador UX/UI y desarrollador Front-End' })
    expect(caseMeta('tailwind')).toContainEqual({ property: 'og:type', content: 'article' })
    expect(notFoundMeta()).toContainEqual({ name: 'robots', content: 'noindex' })
  })
})

describe('pauseOffscreen', () => {
  it('pausa y reanuda según la visibilidad', () => {
    const animation = { paused: vi.fn() }
    const stop = pauseOffscreen(animation, document.body)
    intersectAll(false)
    expect(animation.paused).toHaveBeenLastCalledWith(true)
    intersectAll(true)
    expect(animation.paused).toHaveBeenLastCalledWith(false)
    stop()
    expect(observers.at(-1)?.disconnect).toHaveBeenCalled()
  })
})

describe('reveals', () => {
  it('divide el título en letras y anima la entrada', () => {
    document.body.innerHTML = '<h2 class="big-title">Hola</h2>'
    const split = revealTitle(document.querySelector('h2') as Element)
    expect(split.chars.length).toBeGreaterThan(0)
    expect(riseIn('h2', 'h2', { y: 10 })).toBeTruthy()
  })
})

describe('threadPoints', () => {
  it('devuelve null si falta una sección y dos listas cuando todo existe', () => {
    const main = document.createElement('main')
    document.body.append(main)
    expect(threadPoints(main)).toBeNull()
    main.innerHTML = [
      '<section class="hero"><div class="hero__sit"></div></section>',
      '<section class="work"><h2 id="t-work"></h2></section>',
      '<div class="editor__side"></div><div class="about__right"></div><div class="tech__intro"></div>',
      '<div class="playground"></div><h2 id="t-contact"></h2><button class="mag"></button>',
    ].join('')
    const threads = threadPoints(main)
    expect(threads?.[0]).toHaveLength(4)
    expect(threads?.[1]).toHaveLength(8)
  })
})

describe('wireFrames', () => {
  it('etiqueta los frames, elige la capa útil y la describe', () => {
    document.body.innerHTML =
      '<main><section id="inicio"><h1 class="me"><span class="char">J</span></h1></section><section id="x"></section></main><div class="wire-ui"><b id="ui"></b></div>'
    const main = document.querySelector('main') as HTMLElement
    labelFrames(main, { inicio: 'Hero' })
    expect(main.querySelector('#inicio')?.getAttribute('data-frame')).toMatch(/^Frame · Hero/)
    expect(main.querySelector('#x')?.getAttribute('data-frame')).toMatch(/^Frame · x/)
    expect(pickLayer(document.querySelector('.char'))?.className).toBe('me')
    expect(pickLayer(document.body)).toBeNull()
    expect(pickLayer(null)).toBeNull()
    expect(pickLayer(document.getElementById('ui'))).toBeNull()
    expect(describeLayer(document.querySelector('.me') as Element)).toMatchObject({
      name: 'h1.me',
      size: '0 × 0',
    })
  })
})
