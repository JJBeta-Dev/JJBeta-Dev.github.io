import { useRef, useState } from 'react'
import { Outlet } from 'react-router'
import About from '@/components/about/About'
import Band from '@/components/band/Band'
import Contact from '@/components/contact/Contact'
import Hero from '@/components/hero/Hero'
import Cursor from '@/components/layout/cursor/Cursor'
import Decor from '@/components/layout/decor/Decor'
import Footer from '@/components/layout/footer/Footer'
import InkTrail from '@/components/layout/ink-trail/InkTrail'
import Loader from '@/components/layout/loader/Loader'
import Navigation from '@/components/layout/navigation/Navigation'
import SecretsBadge from '@/components/layout/secrets-badge/SecretsBadge'
import SkipLink from '@/components/layout/skip-link/SkipLink'
import Thread from '@/components/layout/thread/Thread'
import WireOverlay from '@/components/layout/wire-overlay/WireOverlay'
import Tech from '@/components/tech/Tech'
import Work from '@/components/work/Work'
import { useCaseOpen } from '@/hooks/useCaseOpen'
import { useHomeMotion } from '@/hooks/useHomeMotion'
import { useMenu } from '@/hooks/useMenu'

/**
 * Página principal del portafolio. Mientras el menú o un caso de estudio (ruta hija) cubren la
 * página, todo lo que queda debajo se marca como `inert` (contenido, footer, secretos y el enlace
 * para saltar al contenido) y el modo beta se desactiva, para que el teclado y los lectores de
 * pantalla solo recorran la capa visible.
 *
 * @returns {import('react').JSX.Element} Página completa con su capa de casos de estudio.
 * @example
 * <HomeView />
 */
export default function HomeView() {
  const main = useRef<HTMLElement>(null)
  const [introReady, setIntroReady] = useState(false)
  const caseOpen = useCaseOpen()
  const menu = useMenu()
  const covered = caseOpen || menu.open
  useHomeMotion(main, introReady)

  return (
    <>
      <SkipLink inert={covered} />
      <Loader onReveal={() => setIntroReady(true)} />
      <Cursor />
      <InkTrail />
      <Navigation open={menu.open} setMenu={menu.setMenu} inert={caseOpen} />
      <SecretsBadge inert={covered} />
      <main id="contenido" ref={main} inert={covered}>
        <Decor />
        <Thread />
        <Hero />
        <Work />
        <Band />
        <About />
        <Tech />
        <Contact />
      </main>
      <Outlet />
      <Footer inert={covered} />
      <WireOverlay enabled={!covered} />
    </>
  )
}
