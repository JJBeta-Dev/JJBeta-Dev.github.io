import type { ImageAsset } from '@/data/projects'

/**
 * Props de {@link BrowserWindow}.
 */
export interface BrowserWindowProps {
  image: ImageAsset
  alt: string
}

/**
 * Captura enmarcada como una ventana de navegador (barra con tres puntos, esquinas redondeadas, sombra
 * larga). Las imágenes bajo el pliegue cargan en diferido y siempre declaran su tamaño para evitar saltos
 * de maquetación.
 *
 * @param {Readonly<BrowserWindowProps>} props - Recurso de imagen y su texto alternativo.
 * @returns {import('react').JSX.Element} La captura enmarcada.
 * @example
 * <BrowserWindow image={PROJECT_IMAGES.perfil} alt="Portada del perfil" />
 */
export default function BrowserWindow({ image, alt }: BrowserWindowProps) {
  return (
    <div className="win">
      <i aria-hidden="true" />
      <img
        src={image.src}
        alt={alt}
        width={image.width}
        height={image.height}
        loading="lazy"
        decoding="async"
      />
    </div>
  )
}
