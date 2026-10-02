import { QueryClient } from '@tanstack/react-query'

/**
 * Crea el cliente de TanStack Query. Los datos remotos (actividad pública de GitHub) son decorativos, así
 * que se guardan en caché diez minutos, se reintentan una vez y nunca se vuelven a pedir solo porque la
 * ventana recupere el foco.
 *
 * @returns {QueryClient} Un {@link QueryClient} configurado.
 * @example
 * const queryClient = createQueryClient()
 */
export const createQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: { staleTime: 10 * 60 * 1000, gcTime: 30 * 60 * 1000, retry: 1, refetchOnWindowFocus: false },
    },
  })
