/**
 * Contratos de los eventos de tiempo real (Socket.IO) entre servidor y clientes.
 *
 * ANDAMIAJE: en el change `foundation` estos contratos se DECLARAN pero NO se emiten.
 * La emisión y suscripción reales llegan en la Fase 5 (`tiempo-real`, HU-09).
 */
import type { Tarea } from './tarea.js';

/** Nombres de los eventos servidor → clientes. */
export const EVENTOS = {
  tareaCreada: 'tarea:creada',
  tareaActualizada: 'tarea:actualizada',
  tareaBorrada: 'tarea:borrada',
  tareaReordenada: 'tarea:reordenada',
  listaReset: 'lista:reset',
} as const;

export type NombreEvento = (typeof EVENTOS)[keyof typeof EVENTOS];

/** Mapa de eventos que el servidor emite hacia los clientes (contrato tipado). */
export interface EventosServidorACliente {
  [EVENTOS.tareaCreada]: (tarea: Tarea) => void;
  [EVENTOS.tareaActualizada]: (tarea: Tarea) => void;
  [EVENTOS.tareaBorrada]: (payload: { id: string }) => void;
  [EVENTOS.tareaReordenada]: (tareas: Tarea[]) => void;
  [EVENTOS.listaReset]: () => void;
}

/** Mapa de eventos cliente → servidor. Sin eventos de negocio en foundation. */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface EventosClienteAServidor {}
