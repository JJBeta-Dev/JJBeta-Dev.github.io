import { useTranslation } from 'react-i18next'
import { FONT_OPTIONS } from '@/data/editorOptions'
import { useSecrets } from '@/hooks/useSecrets'
import { useToast } from '@/hooks/useToast'

const DEFAULT_FONT = 0
const COMIC_SANS = FONT_OPTIONS.findIndex((option) => option.label === 'Comic Sans')

/**
 * Reacciones del editor al elegir una fuente: Comic Sans recibe un guiño y cualquier otra fuente
 * distinta a la original revela el secreto «el editor funciona de verdad».
 *
 * @returns {(index: number) => void} Manejador que se llama con el índice de la fuente elegida.
 * @example
 * const onFontPicked = useFontEasterEggs()
 * onFontPicked(5)
 */
export const useFontEasterEggs = (): ((index: number) => void) => {
  const { t } = useTranslation()
  const { show } = useToast()
  const secrets = useSecrets()

  return (index: number) => {
    if (index === COMIC_SANS) show(t('about.comic'), 'font')
    else if (index !== DEFAULT_FONT) secrets.reveal('font')
  }
}
