import { useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { LineIconName } from '@/components/ui/icons/lineIconPaths'
import { SECRET_KEYS, SecretsContext, type SecretKey } from '@/contexts/SecretsContext'
import { rainConfetti } from '@/helpers/confetti'
import { useFinePointer } from '@/hooks/useFinePointer'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'
import { useToast } from '@/hooks/useToast'

const ICONS: Record<SecretKey, LineIconName> = {
  name: 'type',
  beta: 'beta',
  pop: 'bubble',
  paint: 'trail',
  font: 'pen',
}

/**
 * Lleva la cuenta de los easter eggs que encuentra el visitante y celebra cada uno con un toast.
 * El juego solo funciona con ratón: en pantallas táctiles varios secretos son imposibles
 * (escribir "beta", dibujar la estela), así que ahí queda desactivado.
 *
 * @param {{ children: ReactNode }} props - Subárbol de la aplicación.
 * @returns {import('react').JSX.Element} El provider de secretos.
 * @example
 * <SecretsProvider><HomeView /></SecretsProvider>
 */
export default function SecretsProvider({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  const { show } = useToast()
  const enabled = useFinePointer()
  const reduced = usePrefersReducedMotion()
  const [found, setFound] = useState<ReadonlySet<SecretKey>>(new Set())
  const revealed = useRef(new Set<SecretKey>())

  /**
   * Marca un secreto como encontrado, lo anuncia y lanza confeti al completar todos. El registro
   * síncrono (`revealed`) evita anuncios repetidos si se llama varias veces antes de volver a renderizar.
   *
   * @param {SecretKey} key - Secreto descubierto.
   * @returns {void} No devuelve nada.
   * @example
   * reveal('beta')
   */
  const reveal = (key: SecretKey) => {
    if (!enabled || revealed.current.has(key)) return
    revealed.current.add(key)
    const next = new Set(revealed.current)
    setFound(next)
    if (next.size < SECRET_KEYS.length) {
      show(t(`secrets.found.${key}`), ICONS[key])
      return
    }
    show(t('secrets.all'), 'trophy', 5000)
    rainConfetti(80, reduced)
  }

  return <SecretsContext value={{ enabled, found, reveal }}>{children}</SecretsContext>
}
