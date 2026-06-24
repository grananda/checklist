/**
 * Cálculo de progreso de la lista (HU-06), fuente única consumida por client y server.
 * Coherente con lista vacía (sin división por cero).
 */
import type { Tarea } from './tarea.js';

export interface Progreso {
  hechas: number;
  total: number;
  porcentaje: number;
}

export function calcularProgreso(tareas: Pick<Tarea, 'hecha'>[]): Progreso {
  const total = tareas.length;
  const hechas = tareas.filter((t) => t.hecha).length;
  const porcentaje = total === 0 ? 0 : Math.round((hechas / total) * 100);
  return { hechas, total, porcentaje };
}
