/**
 * Store Zustand de andamiaje. En foundation solo declara el estado base (lista de tareas
 * y progreso derivado); las acciones de dominio (cargar, crear, marcar, editar, borrar)
 * llegan en la Fase 3 (UI del MVP).
 */
import { create } from 'zustand';
import { calcularProgreso, type Tarea, type Progreso } from '@checklist/shared';

export interface TareasState {
  tareas: Tarea[];
  /** Progreso derivado del estado de las tareas (no se almacena, se calcula). */
  progreso: () => Progreso;
}

export const useTareasStore = create<TareasState>((_set, get) => ({
  tareas: [],
  progreso: () => calcularProgreso(get().tareas),
}));
