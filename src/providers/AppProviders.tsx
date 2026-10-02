import { QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import { i18n } from '@/plugins/i18n'
import { createQueryClient } from '@/plugins/queryClient'
import CurtainProvider from '@/providers/CurtainProvider'
import ScrollProvider from '@/providers/ScrollProvider'
import SecretsProvider from '@/providers/SecretsProvider'
import ToastProvider from '@/providers/ToastProvider'

/**
 * Compone todos los providers globales de la aplicación en orden de dependencia: datos, traducciones,
 * feedback, el juego de secretos, el scroll suave y la cortina de transición.
 *
 * @param {{ children: ReactNode }} props - Subárbol de la aplicación.
 * @returns {import('react').JSX.Element} El árbol de providers.
 * @example
 * <AppProviders><Outlet /></AppProviders>
 */
export default function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient)
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <ToastProvider>
          <SecretsProvider>
            <ScrollProvider>
              <CurtainProvider>{children}</CurtainProvider>
            </ScrollProvider>
          </SecretsProvider>
        </ToastProvider>
      </I18nextProvider>
    </QueryClientProvider>
  )
}
