import { createHash } from 'node:crypto'
import { copyFile, readdir, readFile, writeFile } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'

const CLIENT = 'build/client'
const SITE_URL = process.env.VITE_SITE_URL ?? 'https://jjbeta-dev.github.io/'

/**
 * Recorre una carpeta y devuelve las rutas de todos los HTML que contiene.
 *
 * @param {string} folder - Carpeta a recorrer.
 * @returns {Promise<string[]>} Rutas de los archivos `.html`.
 * @example
 * await listHtml('build/client')
 */
const listHtml = async (folder) => {
  const entries = await readdir(folder, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map((entry) => {
      const path = join(folder, entry.name)
      if (entry.isDirectory()) return listHtml(path)
      return entry.name.endsWith('.html') ? [path] : []
    }),
  )
  return nested.flat()
}

/**
 * Calcula el hash SHA-256 (en base64) de cada script en línea ejecutable de un HTML, para
 * autorizarlo en la política de seguridad sin recurrir a `'unsafe-inline'`.
 *
 * @param {string} html - Documento HTML.
 * @returns {string[]} Fuentes CSP con la forma `'sha256-…'`.
 * @example
 * inlineScriptHashes('<script>alert(1)</script>')
 */
const inlineScriptHashes = (html) =>
  [...html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*application\/ld\+json)[^>]*>([\s\S]*?)<\/script>/g)].map(
    ([, code]) => `'sha256-${createHash('sha256').update(code).digest('base64')}'`,
  )

/**
 * Construye la Content-Security-Policy de una página: solo recursos propios, los scripts en
 * línea autorizados por hash y la API pública de GitHub como único origen externo.
 *
 * @param {string[]} hashes - Hashes de los scripts en línea de la página.
 * @returns {string} Política lista para un `<meta http-equiv>`.
 * @example
 * buildPolicy(["'sha256-abc='"])
 */
const buildPolicy = (hashes) =>
  [
    "default-src 'self'",
    `script-src 'self' ${hashes.join(' ')}`,
    "style-src 'self'",
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self' https://api.github.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    'upgrade-insecure-requests',
  ].join('; ')

/**
 * Inserta la política de seguridad justo después del `<meta charset>` de cada página generada.
 *
 * @param {string[]} files - HTML generados por el pre-render.
 * @returns {Promise<void>} Se resuelve cuando todas las páginas quedan protegidas.
 * @example
 * await protectPages(await listHtml('build/client'))
 */
const protectPages = async (files) => {
  await Promise.all(
    files.map(async (file) => {
      const html = await readFile(file, 'utf8')
      const meta = `<meta http-equiv="Content-Security-Policy" content="${buildPolicy(inlineScriptHashes(html))}"/>`
      await writeFile(file, html.replace(/(<meta charSet="utf-8"\/>)/i, `$1${meta}`))
    }),
  )
}

/**
 * Convierte la ruta de un HTML generado en su URL pública.
 *
 * @param {string} file - Ruta del archivo dentro de la carpeta del build.
 * @returns {string} URL absoluta de la página.
 * @example
 * pageUrl('build/client/casos/perfil/index.html') // 'https://…/casos/perfil'
 */
const pageUrl = (file) => {
  const path = relative(CLIENT, file)
    .split(sep)
    .join('/')
    .replace(/index\.html$/, '')
    .replace(/\/$/, '')
  return new URL(path, SITE_URL).href
}

/**
 * Escribe el `sitemap.xml` con las páginas indexables y el `robots.txt` que lo anuncia.
 *
 * @param {string[]} files - HTML generados por el pre-render.
 * @returns {Promise<void>} Se resuelve cuando ambos archivos quedan escritos.
 * @example
 * await writeSeoFiles(files)
 */
const writeSeoFiles = async (files) => {
  const today = new Date().toISOString().slice(0, 10)
  const urls = files
    .filter((file) => file.endsWith('index.html'))
    .map((file) => `  <url><loc>${pageUrl(file)}</loc><lastmod>${today}</lastmod></url>`)
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
  await writeFile(join(CLIENT, 'sitemap.xml'), sitemap)
  await writeFile(
    join(CLIENT, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap.xml', SITE_URL).href}\n`,
  )
}

const files = await listHtml(CLIENT)
await protectPages(files)
await writeSeoFiles(files.filter((file) => !file.includes('__spa-fallback')))
const fallback = files.find((file) => file.includes('__spa-fallback')) ?? join(CLIENT, 'index.html')
await copyFile(fallback, join(CLIENT, '404.html'))
console.log(`postbuild: ${files.length} páginas protegidas, sitemap y 404 listos`)
