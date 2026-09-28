import { useEffect, useEffectEvent } from 'react'
import { appendTypedKey } from '@/utils/typedBuffer'

/**
 * Llama a `onMatch` cada vez que el visitante escribe `word` en cualquier parte de la página (fuera
 * de los campos de formulario).
 *
 * @param {string} word - Palabra en minúsculas que se detecta.
 * @param {() => void} onMatch - Se ejecuta cada vez que se completa la palabra.
 * @returns {void} No devuelve nada.
 * @example
 * useTypedWord('beta', () => setWire((on) => !on))
 */
export const useTypedWord = (word: string, onMatch: () => void): void => {
  const match = useEffectEvent(onMatch)

  useEffect(() => {
    let buffer = ''
    /**
     * Añade la tecla al búfer y avisa cuando coincide con la palabra, ignorando los campos de texto.
     *
     * @param {KeyboardEvent} event - Tecla pulsada.
     * @returns {void} No devuelve nada.
     * @example
     * document.addEventListener('keydown', onKey)
     */
    const onKey = (event: KeyboardEvent) => {
      if ((event.target as Element).closest?.('input, textarea, [contenteditable]')) return
      buffer = appendTypedKey(buffer, event.key, word.length)
      if (buffer === word) match()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [word])
}
