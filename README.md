# Portafolio JJBeta

Portafolio de **Jerónimo Jiménez Betancur (JJBeta)**, diseñador UX/UI y desarrollador Front-End.
Sitio estático pre-renderizado: cada ruta se genera como HTML real (SEO y vista previa en redes sin
depender de JavaScript), y luego React hidrata la experiencia animada.

## Stack

| Área       | Herramientas                                                                                                     |
| ---------- | ---------------------------------------------------------------------------------------------------------------- |
| Base       | Vite 8, React 19, TypeScript (estricto), React Router 8 en modo framework con pre-render                         |
| Estilos    | Tailwind CSS 4 (tokens de diseño en OKLCH), CSS por sección                                                      |
| Datos      | TanStack Query + Axios + Zod (actividad pública de GitHub en los casos de estudio)                               |
| Textos     | i18next / react-i18next (`src/data/locales/es.json`)                                                             |
| Movimiento | GSAP (ScrollTrigger, SplitText, Draggable, Inertia) y Lenis                                                      |
| Calidad    | Vitest + Testing Library, ESLint (JSDoc tipado obligatorio, cero comentarios `//`), Prettier, Husky + Commitlint |

## Scripts

```bash
npm run dev            # servidor de desarrollo
npm run build          # build + pre-render + CSP con hashes + sitemap/robots/404
npm run preview        # sirve el build de producción
npm run test           # pruebas con cobertura (reporte HTML en html/)
npm run verify         # tipos + lint + formato + pruebas + build (lo que corre el CI)
```

Copia `.env.example` como `.env` si el sitio se publica en otra URL.

## Estructura

```text
src/
  assets/          fuentes e imágenes (fotos, ilustraciones)
  components/      componentes por sección (hero, work, about…) y ui/ reutilizables
  contexts/        contextos de React (toast, secretos, scroll, cortina)
  data/            datos tipados y textos i18n
  helpers/         funciones con efectos sobre el DOM o GSAP
  hooks/           lógica reactiva (una responsabilidad por hook)
  plugins/         configuración de i18n, Axios, GSAP y TanStack Query
  providers/       proveedores de la app
  routes/          rutas de React Router (metadatos SEO nativos)
  services/        acceso a APIs y al navegador sin React
  styles/          tokens (theme.css) y estilos por sección
  utils/           funciones puras y probadas
  views/           vistas completas
test/              pruebas unitarias e integración (Vitest)
scripts/           post-build (CSP, sitemap, robots, 404)
```

## Convenciones

- Toda función, hook y componente se documenta con JSDoc en español, con tipos y un `@example`.
- No se permiten comentarios `//` (regla local de ESLint).
- Commits con el formato `tipo(alcance): mensaje`; ramas `feature/*`, `bugfix/*`, `hotfix/*`.
- Accesibilidad: HTML semántico, foco gestionado, `prefers-reduced-motion` respetado y cursor
  personalizado solo con mouse.
