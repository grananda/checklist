/**
 * Store Zustand de andamiaje. En foundation solo declara el estado base (lista de tareas
 * y progreso derivado); las acciones de dominio (cargar, crear, marcar, editar, borrar)
 * llegan en la Fase 3 (UI del MVP).
 */
import { create } from 'zustand';
import type { Tarea } from '@checklist/shared';

export interface ProgresoDerivado {
  hechas: number;
  total: number;
  porcentaje: number;
}

export interface TareasState {
  tareas: Tarea[];
  /** Progreso derivado del estado de las tareas (no se almacena, se calcula). */
  progreso: () => ProgresoDerivado;
}

export const useTareasStore = create<TareasState>((_set, get) => ({
  tareas: [],
  progreso: () => {
    const { tareas } = get();
    const total = tareas.length;
    const hechas = tareas.filter((t) => t.hecha).length;
    const porcentaje = total === 0 ? 0 : Math.round((hechas / total) * 100);
    return { hechas, total, porcentaje };
  },
}));
