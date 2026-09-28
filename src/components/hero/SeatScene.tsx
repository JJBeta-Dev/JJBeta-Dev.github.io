import seated from '@/assets/images/photos/jero-sentado.webp'
import bandA from '@/assets/images/illustrations/shapes/banda-a.svg'
import bandB from '@/assets/images/illustrations/shapes/banda-b.svg'

/**
 * Retrato sentado que reposa sobre la franja blanca, recreado con las medidas exactas del frame "Shapes
 * Down" de Figma. Toda la escena está reflejada para que la foto conserve la orientación real de la cámara.
 *
 * @returns {import('react').JSX.Element} La escena decorativa.
 * @example
 * <SeatScene />
 */
export default function SeatScene() {
  return (
    <div className="hero__sit" aria-hidden="true">
      <div className="sit-scene">
        <div className="sit-shape sit-shape--a">
          <img src={bandA} alt="" width="481" height="176" />
        </div>
        <div className="sit-shape sit-shape--b">
          <img src={bandB} alt="" width="404" height="113" />
        </div>
        <div className="sit-person">
          <div className="sit-crop">
            <img src={seated} alt="" width="408" height="612" fetchPriority="high" />
          </div>
        </div>
      </div>
    </div>
  )
}
