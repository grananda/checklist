/**
 * Modelo de dominio de una tarea de la lista compartida.
 * Fuente de verdad de tipos (arquitectura-base §8). Consumido por client y server.
 */

/** Estado de una tarea: pendiente o hecha. */
export type EstadoTarea = 'pendiente' | 'hecha';

/** Una tarea de la única lista compartida. */
export interface Tarea {
  /** Identificador único (UUID generado en servidor, D-35). */
  id: string;
  /** Título obligatorio (≤ MAX_TITULO_LEN). */
  titulo: string;
  /** Descripción opcional (≤ MAX_DESC_LEN). */
  descripcion?: string;
  /** Si la tarea está marcada como hecha. */
  hecha: boolean;
  /** Posición para el orden de la lista (HU-07). Entero ascendente. */
  posicion: number;
  /** Marca de creación (ISO 8601). */
  createdAt: string;
  /** Marca de última actualización (ISO 8601). */
  updatedAt: string;
}

/** Deriva el estado legible a partir del flag `hecha`. */
export function estadoDeTarea(tarea: Pick<Tarea, 'hecha'>): EstadoTarea {
  return tarea.hecha ? 'hecha' : 'pendiente';
}
