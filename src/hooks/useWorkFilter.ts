import { useState } from 'react'
import { PROJECTS, type Discipline, type Project } from '@/data/projects'

/**
 * Filtro activo de la sección de proyectos: todos, solo desarrollo o solo diseño.
 */
export type WorkFilter = 'all' | Discipline

/**
 * Opciones del filtro en el orden en que se muestran.
 */
export const WORK_FILTERS: readonly WorkFilter[] = ['all', 'dev', 'design']

/**
 * Devuelve los proyectos que corresponden a un filtro. Un proyecto con varias disciplinas aparece
 * en cada una de ellas.
 *
 * @param {WorkFilter} filter - Filtro activo.
 * @returns {readonly Project[]} Proyectos visibles.
 * @example
 * projectsFor('design')
 */
export const projectsFor = (filter: WorkFilter): readonly Project[] =>
  filter === 'all' ? PROJECTS : PROJECTS.filter((project) => project.disciplines.includes(filter))

/**
 * Estado del filtro de proyectos y la lista ya filtrada.
 *
 * @returns {{ filter: WorkFilter, setFilter: (filter: WorkFilter) => void, projects: readonly Project[] }}
 * El filtro activo, cómo cambiarlo y los proyectos visibles.
 * @example
 * const { filter, setFilter, projects } = useWorkFilter()
 */
export const useWorkFilter = () => {
  const [filter, setFilter] = useState<WorkFilter>('all')
  return { filter, setFilter, projects: projectsFor(filter) }
}
