import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

/**
 * Configuración de Vitest: entorno jsdom, pruebas en `test/` y un mínimo de cobertura del 90 % sobre la
 * lógica de la aplicación (utils, helpers, services, hooks, contexts, providers y componentes de UI).
 *
 * @example
 * npm run test:coverage
 */
export default defineConfig({
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['test/**/*.spec.{ts,tsx}'],
    setupFiles: ['./test/setupTest.ts'],
    css: false,
    coverage: {
      provider: 'v8',
      include: [
        'src/utils/**',
        'src/helpers/**',
        'src/services/**',
        'src/hooks/**',
        'src/contexts/**',
        'src/providers/**',
        'src/components/ui/**',
      ],
      thresholds: { lines: 90, functions: 90, statements: 90, branches: 85 },
    },
  },
})
