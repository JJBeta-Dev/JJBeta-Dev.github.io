import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import RichText from '@/components/ui/rich-text/RichText'
import SplitChars from '@/components/ui/split-text/SplitChars'
import SplitWords from '@/components/ui/split-text/SplitWords'

describe('RichText', () => {
  it('pinta cada énfasis como su elemento real, sin HTML crudo', () => {
    const { container } = render(
      <p>
        <RichText text="Hola <b>mundo</b>, <em>sí</em> <acc>acento</acc> <script>x</script>" />
      </p>,
    )
    expect(container.querySelector('b')).toHaveTextContent('mundo')
    expect(container.querySelector('em')).toHaveTextContent('sí')
    expect(container.querySelector('.acc')).toHaveTextContent('acento')
    expect(container.querySelector('script')).toBeNull()
    expect(container.textContent).toBe('Hola mundo, sí acento <script>x</script>')
  })
})

describe('SplitWords', () => {
  it('envuelve cada palabra en .w, respeta los énfasis y conserva los espacios al cambiar de texto', () => {
    const { container, rerender } = render(
      <h1>
        <SplitWords text="Un perfil que se <acc>cuida solo</acc>" />
      </h1>,
    )
    expect(container.querySelectorAll('.w')).toHaveLength(6)
    expect(container.querySelectorAll('.acc .w')).toHaveLength(2)
    expect(container.textContent).toBe('Un perfil que se cuida solo')
    rerender(
      <h1>
        <SplitWords text="Otro <b>caso</b> aparte" />
      </h1>,
    )
    expect(container.querySelector('b .w')).toHaveTextContent('caso')
    expect(container.textContent).toBe('Otro caso aparte')
  })
})

describe('SplitChars', () => {
  it('divide en letras animables ocultas y deja una copia legible para lectores de pantalla', () => {
    const { container } = render(
      <h2>
        <SplitChars text="Hola mundo" />
      </h2>,
    )
    expect(container.querySelectorAll('.char')).toHaveLength(9)
    expect(container.querySelectorAll('.word')).toHaveLength(2)
    expect(container.querySelector('[aria-hidden="true"]')?.textContent).toBe('Hola mundo')
    expect(screen.getByRole('heading')).toHaveAccessibleName('Hola mundo')
  })
})
