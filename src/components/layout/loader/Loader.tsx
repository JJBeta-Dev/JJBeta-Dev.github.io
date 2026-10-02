import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLoader } from '@/hooks/useLoader'

/**
 * Precargador con el color de marca y un contador. Se desmonta cuando termina de deslizarse.
 *
 * @param {{ onReveal: () => void }} props - `onReveal` se dispara cuando la página empieza a asomar debajo.
 * @returns {import('react').JSX.Element | null} El precargador, o nada cuando ya terminó.
 * @example
 * <Loader onReveal={() => setIntroReady(true)} />
 */
export default function Loader({ onReveal }: { onReveal: () => void }) {
  const { t } = useTranslation()
  const root = useRef<HTMLDivElement>(null)
  const [finished, setFinished] = useState(false)
  useLoader(root, {
    onReveal,
    onFinish: () => setFinished(true),
  })

  if (finished) return null
  return (
    <div className="loader" ref={root} aria-hidden="true">
      <div>
        <div className="loader__count">0</div>
        <div className="loader__tag">{t('loader.tag')}</div>
      </div>
    </div>
  )
}
