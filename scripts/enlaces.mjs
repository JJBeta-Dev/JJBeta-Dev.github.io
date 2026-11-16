import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'

const REGISTRO = 'data/enlaces.json'
const CARPETA = 'public/r'

/**
 * Lee el registro de enlaces cortos.
 *
 * @returns {Promise<Record<string, {negocio: string, destino: string}>>} Registro de códigos con su negocio y destino.
 * @example
 * await leer()
 */
const leer = async () => JSON.parse(await readFile(REGISTRO, 'utf8'))

/**
 * Convierte un identificador de lugar de Google o una URL completa en la URL de destino.
 *
 * @param {string} valor Place ID (empieza por ChIJ) o URL que empieza por http.
 * @returns {string} URL final de destino.
 * @example
 * destinoDe('ChIJ123')
 */
const destinoDe = (valor) =>
  valor.startsWith('http')
    ? valor
    : `https://search.google.com/local/writereview?placeid=${encodeURIComponent(valor)}`

/**
 * Escribe la página de redirección de un código.
 *
 * @param {string} codigo Código corto del enlace.
 * @param {string} destino URL a la que redirige.
 * @returns {Promise<void>} Se resuelve al escribir la página.
 * @example
 * await escribirPagina('k7', 'https://example.com')
 */
const escribirPagina = async (codigo, destino) => {
  const dir = `${CARPETA}/${codigo}`
  await mkdir(dir, { recursive: true })
  const url = destino.replace(/"/g, '&quot;')
  await writeFile(
    `${dir}/index.html`,
    `<!doctype html><html lang="es"><head><meta charSet="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=${url}"><title>Abriendo…</title></head><body style="font-family:system-ui;display:grid;place-items:center;min-height:100vh;margin:0"><a href="${url}">Continuar</a></body></html>\n`,
  )
}

/**
 * Regenera todas las páginas desde el registro y borra las de códigos eliminados.
 *
 * @returns {Promise<void>} Se resuelve al terminar de generar.
 * @example
 * await generar()
 */
const generar = async () => {
  const datos = await leer()
  if (existsSync(CARPETA)) await rm(CARPETA, { recursive: true })
  for (const [codigo, d] of Object.entries(datos)) await escribirPagina(codigo, d.destino)
  console.log(`Enlaces generados: ${Object.keys(datos).length}`)
}

const [orden, codigo, valor, ...nombre] = process.argv.slice(2)
const datos = await leer()

if (orden === 'listar') {
  for (const [c, d] of Object.entries(datos))
    console.log(`${c}\t${d.negocio}\thttps://jjbeta-dev.github.io/r/${c}`)
} else if (orden === 'nuevo' || orden === 'cambiar') {
  if (!codigo || !valor)
    throw new Error('Uso: npm run enlaces -- nuevo <codigo> <PlaceID o URL> "Nombre del negocio"')
  const previo = datos[codigo]
  if (orden === 'nuevo' && previo)
    throw new Error(`El código ${codigo} ya existe (${previo.negocio}). Usa "cambiar".`)
  datos[codigo] = { negocio: nombre.join(' ') || previo?.negocio || '', destino: destinoDe(valor) }
  await writeFile(REGISTRO, JSON.stringify(datos, null, 2) + '\n')
  await generar()
  console.log(`https://jjbeta-dev.github.io/r/${codigo}`)
} else if (orden === 'borrar') {
  const restantes = Object.fromEntries(Object.entries(datos).filter(([c]) => c !== codigo))
  await writeFile(REGISTRO, JSON.stringify(restantes, null, 2) + '\n')
  await generar()
} else if (orden === 'generar') {
  await generar()
} else {
  console.log(
    'Órdenes: listar | nuevo <codigo> <PlaceID o URL> "Nombre" | cambiar <codigo> <PlaceID o URL> | borrar <codigo> | generar',
  )
}
