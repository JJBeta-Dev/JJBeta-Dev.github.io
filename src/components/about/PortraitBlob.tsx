import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import leaning from '@/assets/images/photos/jero-apoyado.webp'
import { useCurvedLabel } from '@/hooks/useCurvedLabel'

/**
 * Retrato apoyado sobre la forma orgánica blanca, con una esfera que flota a su lado y el texto
 * curvo que sigue el borde interior de la forma.
 *
 * @returns {import('react').JSX.Element} Composición decorativa del retrato.
 * @example
 * <PortraitBlob />
 */
export default function PortraitBlob() {
  const { t } = useTranslation()
  const blob = useRef<HTMLSpanElement>(null)
  const arc = useCurvedLabel(blob)

  return (
    <div className="about__right" aria-hidden="true">
      <span className="photo-blob" ref={blob} />
      <span className="ball pop side-ball" />
      {arc && (
        <svg
          className="curve"
          viewBox={`0 0 ${arc.width} ${arc.height}`}
          style={{ left: arc.left, top: arc.top, width: arc.width, height: arc.height }}
        >
          <path id="arc" d={arc.d} fill="none" />
          <text>
            <textPath href="#arc" startOffset="50%" textAnchor="middle">
              {t('about.curve')}
            </textPath>
          </text>
        </svg>
      )}
      <img
        className="leaning"
        data-depth="0.35"
        src={leaning}
        alt=""
        width="408"
        height="612"
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}
