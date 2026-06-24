/**
 * Store Zustand de la lista de tareas. El servidor es la fuente de verdad:
 * cada acción llama a la API y aplica la respuesta al estado (sin optimistic ni
 * tiempo real en esta fase). El progreso es estado derivado (`calcularProgreso`).
 */
import { create } from 'zustand';
import { calcularProgreso, type Tarea, type Progreso } from '@checklist/shared';
import { api, type CrearTareaInput, type ActualizarTareaInput } from '../api/rest';

export interface TareasState {
  tareas: Tarea[];
  cargando: boolean;
  error?: string;
  progreso: () => Progreso;
  cargar: () => Promise<void>;
  crear: (input: CrearTareaInput) => Promise<void>;
  cambiarEstado: (id: string, hecha: boolean) => Promise<void>;
  editar: (id: string, patch: ActualizarTareaInput) => Promise<void>;
  borrar: (id: string) => Promise<void>;
}

export const useTareasStore = create<TareasState>((set, get) => ({
  tareas: [],
  cargando: false,
  error: undefined,

  progreso: () => calcularProgreso(get().tareas),

  cargar: async () => {
    set({ cargando: true, error: undefined });
    try {
      const tareas = await api.listar();
      set({ tareas, cargando: false });
    } catch (e) {
      set({ cargando: false, error: (e as Error).message });
    }
  },

  crear: async (input) => {
    const tarea = await api.crear(input);
    set((s) => ({ tareas: [...s.tareas, tarea] }));
  },

  cambiarEstado: async (id, hecha) => {
    const actualizada = await api.actualizar(id, { hecha });
    set((s) => ({ tareas: s.tareas.map((t) => (t.id === id ? actualizada : t)) }));
  },

  editar: async (id, patch) => {
    const actualizada = await api.actualizar(id, patch);
    set((s) => ({ tareas: s.tareas.map((t) => (t.id === id ? actualizada : t)) }));
  },

  borrar: async (id) => {
    await api.borrar(id);
    set((s) => ({ tareas: s.tareas.filter((t) => t.id !== id) }));
  },
}));
