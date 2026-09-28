import { describe, expect, it } from 'vitest'
import { withAlpha } from '@/utils/colorAlpha'
import { eventOrigin } from '@/utils/eventOrigin'
import { formatClock } from '@/utils/formatClock'
import { formatRelativeTime } from '@/utils/formatRelativeTime'
import { layerName } from '@/utils/layerName'
import { buildPersonSchema } from '@/utils/personSchema'
import { buildMeta } from '@/utils/seoMeta'
import { appendTypedKey } from '@/utils/typedBuffer'

describe('formatClock', () => {
  it('formatea la hora local de Bogotá', () => {
    expect(formatClock(new Date('2026-09-28T14:05:00Z'), 'America/Bogota')).toMatch(/9:05/)
  })
})

describe('formatRelativeTime', () => {
  const now = new Date('2026-09-28T12:00:00Z')

  it('usa la unidad más grande que cabe', () => {
    expect(formatRelativeTime(new Date('2026-09-24T12:00:00Z'), now)).toBe('hace 4 días')
    expect(formatRelativeTime(new Date('2026-09-26T12:00:00Z'), now)).toBe('anteayer')
    expect(formatRelativeTime(new Date('2026-09-28T09:00:00Z'), now)).toBe('hace 3 horas')
  })

  it('dice «ahora» cuando pasó menos de un minuto', () => {
    expect(formatRelativeTime(new Date('2026-09-28T11:59:40Z'), now)).toBe('ahora')
  })

  it('usa la fecha actual por defecto', () => {
    expect(formatRelativeTime(new Date())).toBe('ahora')
  })
})

describe('withAlpha', () => {
  it('agrega el canal alfa', () => {
    expect(withAlpha('oklch(53.87% 0.2584 286.8)', 0.5)).toBe('oklch(53.87% 0.2584 286.8 / 0.5)')
  })

  it('reemplaza un alfa existente', () => {
    expect(withAlpha('oklch(50% 0.1 20 / .3)', 1)).toBe('oklch(50% 0.1 20 / 1)')
  })
})

describe('layerName', () => {
  it('prefiere el id', () => {
    expect(layerName({ tagName: 'SECTION', id: 'inicio', classList: ['hero'] })).toBe('section#inicio')
  })

  it('ignora las clases auxiliares de las letras divididas', () => {
    expect(layerName({ tagName: 'DIV', id: '', classList: ['char', 'editor'] })).toBe('div.editor')
  })

  it('usa solo la etiqueta si no hay clase útil', () => {
    expect(layerName({ tagName: 'SPAN', id: '', classList: ['w'] })).toBe('span')
  })
})

describe('appendTypedKey', () => {
  it('conserva solo las últimas letras en minúscula', () => {
    expect(appendTypedKey('xbet', 'A', 4)).toBe('beta')
  })

  it('ignora teclas especiales', () => {
    expect(appendTypedKey('bet', 'Shift', 4)).toBe('bet')
  })
})

describe('eventOrigin', () => {
  const currentTarget = { getBoundingClientRect: () => ({ left: 100, top: 200, width: 50, height: 20 }) }

  it('usa la posición del puntero en un clic', () => {
    expect(eventOrigin({ clientX: 10, clientY: 20, detail: 1, currentTarget })).toEqual({ x: 10, y: 20 })
  })

  it('usa el centro del elemento con teclado', () => {
    expect(eventOrigin({ clientX: 0, clientY: 0, detail: 0, currentTarget })).toEqual({ x: 125, y: 210 })
  })
})

describe('buildMeta', () => {
  const meta = buildMeta({
    title: 'JJBeta',
    description: 'Portafolio',
    socialDescription: 'Diseño y código',
    imageAlt: 'Portada',
    siteUrl: 'https://jjbeta-dev.github.io/',
    path: '/casos/perfil',
    siteName: 'JJBeta',
    type: 'article',
  })

  it('incluye canónico, Open Graph y Twitter con URLs absolutas', () => {
    expect(meta).toContainEqual({
      tagName: 'link',
      rel: 'canonical',
      href: 'https://jjbeta-dev.github.io/casos/perfil',
    })
    expect(meta).toContainEqual({ property: 'og:type', content: 'article' })
    expect(meta).toContainEqual({ name: 'twitter:image', content: 'https://jjbeta-dev.github.io/og.png' })
  })

  it('usa «website» por defecto', () => {
    const home = buildMeta({
      title: 'a',
      description: 'b',
      socialDescription: 'c',
      imageAlt: 'd',
      siteUrl: 'https://x.dev/',
      path: '/',
      siteName: 'e',
    })
    expect(home).toContainEqual({ property: 'og:type', content: 'website' })
  })
})

describe('buildPersonSchema', () => {
  it('describe a la persona con sus perfiles', () => {
    const schema = buildPersonSchema({
      siteUrl: 'https://x.dev/',
      email: 'a@b.co',
      profiles: ['https://github.com/x'],
    })
    expect(schema['@type']).toBe('Person')
    expect(schema.email).toBe('mailto:a@b.co')
    expect(schema.sameAs).toEqual(['https://github.com/x'])
    expect(schema.image).toBe('https://x.dev/og.png')
  })
})
