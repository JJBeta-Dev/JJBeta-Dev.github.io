import axios from 'axios'

/**
 * Cliente HTTP para la API REST pública de GitHub. Solo hace peticiones GET sin autenticar,
 * así que ningún token ni secreto llega nunca al navegador.
 */
export const githubClient = axios.create({
  baseURL: 'https://api.github.com',
  timeout: 8000,
  headers: { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' },
})
