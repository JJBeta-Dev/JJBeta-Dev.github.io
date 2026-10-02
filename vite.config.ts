import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

/**
 * Configuración de Vite: Tailwind 4, React Router en modo framework y el alias `@` apuntando a `src/`.
 *
 * @example
 * npm run dev
 */
export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
})
