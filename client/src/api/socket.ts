/**
 * Cliente Socket.IO (tiempo real, HU-09). Conexión al mismo origen con reconexión
 * automática; en cada (re)conexión se dispara la re-sincronización (GET /api/tareas).
 * Los eventos del servidor se entregan a los handlers para que el store los aplique.
 */
import { io, type Socket } from 'socket.io-client';
import { EVENTOS, type EventosServidorACliente, type Tarea } from '@checklist/shared';

export interface SocketHandlers {
  /** (Re)conexión: re-sincronizar el estado completo. */
  onConectar: () => void;
  onCreada: (tarea: Tarea) => void;
  onActualizada: (tarea: Tarea) => void;
  onBorrada: (payload: { id: string }) => void;
  onReordenada: (tareas: Tarea[]) => void;
  onReset: () => void;
}

export function conectarSocket(handlers: SocketHandlers): () => void {
  const socket: Socket<EventosServidorACliente> = io({ autoConnect: true });

  socket.on('connect', handlers.onConectar);
  socket.on(EVENTOS.tareaCreada, handlers.onCreada);
  socket.on(EVENTOS.tareaActualizada, handlers.onActualizada);
  socket.on(EVENTOS.tareaBorrada, handlers.onBorrada);
  socket.on(EVENTOS.tareaReordenada, handlers.onReordenada);
  socket.on(EVENTOS.listaReset, handlers.onReset);

  return () => {
    socket.disconnect();
  };
}
