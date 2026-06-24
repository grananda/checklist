/**
 * Store Zustand de la lista de tareas. El servidor es la fuente de verdad: las acciones
 * llaman a la API y aplican la respuesta. El reordenado es optimista y los aplicadores
 * `*Local` reflejan los eventos de tiempo real (last-write-wins). El progreso es estado
 * derivado (`calcularProgreso`).
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
  reordenar: (orden: string[]) => Promise<void>;
  reiniciar: () => Promise<void>;
  // Aplicadores de eventos de tiempo real (sin llamada a API). Last-write-wins.
  upsertLocal: (tarea: Tarea) => void;
  quitarLocal: (id: string) => void;
  reemplazarLocal: (tareas: Tarea[]) => void;
  vaciarLocal: () => void;
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
    // upsert (no append ciego): el broadcast `tarea:creada` puede llegar antes de
    // que resuelva el POST; deduplicar por id evita una tarea duplicada.
    get().upsertLocal(tarea);
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

  reordenar: async (orden) => {
    // Optimista local para respuesta inmediata del teclado/arrastre; recarga ante error.
    const previas = get().tareas;
    const porId = new Map(previas.map((t) => [t.id, t]));
    set({ tareas: orden.map((id) => porId.get(id)).filter((t): t is Tarea => t !== undefined) });
    try {
      const tareas = await api.reordenar(orden);
      set({ tareas });
    } catch (e) {
      set({ tareas: previas, error: (e as Error).message });
    }
  },

  reiniciar: async () => {
    await api.reiniciar();
    set({ tareas: [] });
  },

  upsertLocal: (tarea) =>
    set((s) => {
      const existe = s.tareas.some((t) => t.id === tarea.id);
      return {
        tareas: existe
          ? s.tareas.map((t) => (t.id === tarea.id ? tarea : t))
          : [...s.tareas, tarea],
      };
    }),
  quitarLocal: (id) => set((s) => ({ tareas: s.tareas.filter((t) => t.id !== id) })),
  reemplazarLocal: (tareas) => set({ tareas }),
  vaciarLocal: () => set({ tareas: [] }),
}));
