/**
 * Constantes de límites de dominio (NFR-12) y utilidades asociadas.
 * Los valores efectivos en el servidor pueden sobreescribirse por variables de entorno;
 * estos son los valores por defecto del contrato compartido.
 */

export const LIMITES_DEFAULT = {
  /** Máximo de tareas en la lista. */
  maxTareas: 100,
  /** Longitud máxima del título. */
  maxTituloLen: 120,
  /** Longitud máxima de la descripción. */
  maxDescLen: 2000,
} as const;

export type Limites = {
  maxTareas: number;
  maxTituloLen: number;
  maxDescLen: number;
};

/** Indica si se alcanzó el máximo de tareas permitido. */
export function superaMaxTareas(numTareas: number, limites: Limites = LIMITES_DEFAULT): boolean {
  return numTareas >= limites.maxTareas;
}
