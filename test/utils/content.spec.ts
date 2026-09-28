import { describe, expect, it } from 'vitest'
import { buildCaseSchema } from '@/utils/caseSchema'
import { formatIndex } from '@/utils/formatIndex'
import { isModifiedClick } from '@/utils/isModifiedClick'
import { serializeJsonLd } from '@/utils/jsonLd'
import { NotFoundError } from '@/utils/notFoundError'
import { parseRichText, splitWords } from '@/utils/parseRichText'
import { toggleLock } from '@/utils/scrollLocks'

describe('parseRichText y splitWords', () => {
  it('separa el texto plano de cada énfasis en orden', () => {
    expect(parseRichText('Hola <b>mundo</b> y <acc>más</acc>.')).toEqual([
      { text: 'Hola ', tag: null },
      { text: 'mundo', tag: 'b' },
      { text: ' y ', tag: null },
      { text: 'más', tag: 'acc' },
      { text: '.', tag: null },
    ])
  })

  it('deja intactas las etiquetas desconocidas o sin cerrar', () => {
    expect(parseRichText('<i>no</i> <b>abierta')).toEqual([{ text: '<i>no</i> <b>abierta', tag: null }])
    expect(parseRichText('')).toEqual([])
  })

  it('conserva los espacios como partes propias', () => {
    expect(splitWords(' se  cuida ')).toEqual([' ', 'se', '  ', 'cuida', ' '])
  })
})

describe('isModifiedClick', () => {
  const plain = { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false }

  it('solo el clic principal sin teclas es un clic normal', () => {
    expect(isModifiedClick(plain)).toBe(false)
    expect(isModifiedClick({ ...plain, button: 1 })).toBe(true)
    expect(isModifiedClick({ ...plain, metaKey: true })).toBe(true)
    expect(isModifiedClick({ ...plain, ctrlKey: true })).toBe(true)
    expect(isModifiedClick({ ...plain, shiftKey: true })).toBe(true)
    expect(isModifiedClick({ ...plain, altKey: true })).toBe(true)
  })
})

describe('toggleLock', () => {
  it('agrega y quita motivos sin mutar el conjunto original', () => {
    const empty: ReadonlySet<'menu' | 'case'> = new Set()
    const locked = toggleLock(empty, 'menu', true)
    expect([...locked]).toEqual(['menu'])
    expect(empty.size).toBe(0)
    expect([...toggleLock(locked, 'menu', false)]).toEqual([])
  })

  it('devuelve el mismo conjunto cuando no hay cambio', () => {
    const locks: ReadonlySet<'menu' | 'case'> = new Set(['case'])
    expect(toggleLock(locks, 'case', true)).toBe(locks)
    expect(toggleLock(locks, 'menu', false)).toBe(locks)
  })
})

describe('formatIndex', () => {
  it('numera desde uno con dos cifras', () => {
    expect(formatIndex(0)).toBe('01')
    expect(formatIndex(11)).toBe('12')
  })
})

describe('buildCaseSchema', () => {
  it('describe el caso y su ruta de migas desde la raíz', () => {
    const schema = buildCaseSchema({
      siteUrl: 'https://x.dev/',
      path: '/casos/perfil/',
      title: 'Perfil',
      description: 'Un caso',
      homeLabel: 'Inicio',
    })
    const [work, breadcrumbs] = schema['@graph']
    expect(work).toMatchObject({
      '@type': 'CreativeWork',
      url: 'https://x.dev/casos/perfil/',
      name: 'Perfil',
      author: { '@id': 'https://x.dev/#persona' },
    })
    expect(breadcrumbs).toMatchObject({
      itemListElement: [
        { position: 1, item: 'https://x.dev/' },
        { position: 2, item: 'https://x.dev/casos/perfil/' },
      ],
    })
  })
})

describe('serializeJsonLd', () => {
  it('escapa los signos que podrían cerrar la etiqueta script', () => {
    const json = serializeJsonLd({ name: '</script><b>' })
    expect(json).not.toContain('<')
    expect(JSON.parse(json)).toEqual({ name: '</script><b>' })
  })
})

describe('NotFoundError', () => {
  it('identifica el recurso y se distingue por su nombre', () => {
    const error = new NotFoundError('/casos/otro')
    expect(error).toBeInstanceOf(Error)
    expect(error.name).toBe('NotFoundError')
    expect(error.message).toContain('/casos/otro')
  })
})
