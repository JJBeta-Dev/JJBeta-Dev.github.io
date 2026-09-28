import { useRef, useState } from 'react'
import { Outlet, useMatch } from 'react-router'
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
import { useHomeMotion } from '@/hooks/useHomeMotion'

/**
 * Página principal del portafolio. Mientras un caso de estudio está abierto (ruta hija), todo lo
 * que queda debajo se marca como `inert` para que el teclado y los lectores de pantalla solo
 * recorran el diálogo.
 *
 * @returns {import('react').JSX.Element} Página completa con su capa de casos de estudio.
 * @example
 * <HomeView />
 */
export default function HomeView() {
  const main = useRef<HTMLElement>(null)
  const [introReady, setIntroReady] = useState(false)
  const caseOpen = Boolean(useMatch('/casos/:slug'))
  useHomeMotion(main, introReady)

  return (
    <>
      <SkipLink />
      <Loader onReveal={() => setIntroReady(true)} />
      <Cursor />
      <InkTrail />
      <Navigation inert={caseOpen} />
      <SecretsBadge inert={caseOpen} />
      <main id="contenido" ref={main} inert={caseOpen}>
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
      <Footer inert={caseOpen} />
      <WireOverlay />
    </>
  )
}
