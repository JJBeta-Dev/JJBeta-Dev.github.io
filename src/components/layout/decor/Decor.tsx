import shape10 from '@/assets/images/illustrations/shapes/shape-10.svg'
import shape11 from '@/assets/images/illustrations/shapes/shape-11.svg'
import shape3 from '@/assets/images/illustrations/shapes/shape-3.svg'
import shape5 from '@/assets/images/illustrations/shapes/shape-5.svg'
import shape8 from '@/assets/images/illustrations/shapes/shape-8.svg'
import shape9 from '@/assets/images/illustrations/shapes/shape-9.svg'

/**
 * Capa decorativa detrás del contenido: formas orgánicas blancas pegadas a los bordes (con parallax de
 * ratón o de scroll) y una esfera que se puede reventar. Queda oculta por completo a las tecnologías de apoyo.
 *
 * @returns {import('react').JSX.Element} La capa decorativa.
 * @example
 * <Decor />
 */
export default function Decor() {
  return (
    <div className="decor" aria-hidden="true">
      <img
        className="decor__shape decor__shape--a"
        data-depth="0.6"
        src={shape3}
        alt=""
        width="812"
        height="577"
      />
      <img
        className="decor__shape decor__shape--b"
        data-depth="0.4"
        src={shape5}
        alt=""
        width="479"
        height="567"
      />
      <img className="decor__shape decor__shape--c" data-speed="-0.25" src={shape10} alt="" loading="lazy" />
      <img className="decor__shape decor__shape--d" data-speed="-0.15" src={shape8} alt="" loading="lazy" />
      <span className="ball pop decor__ball" data-speed="-0.4" />
      <img className="decor__shape decor__shape--e" data-speed="-0.2" src={shape11} alt="" loading="lazy" />
      <img className="decor__shape decor__shape--f" data-speed="-0.1" src={shape9} alt="" loading="lazy" />
    </div>
  )
}
