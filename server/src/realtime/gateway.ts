/**
 * Gateway de tiempo real (Socket.IO) sobre el servidor Fastify. Registra el servidor
 * Socket.IO tipado y gestiona conexión/desconexión, y devuelve el `io` para que las
 * rutas difundan los eventos (`tarea:*`, `lista:reset`) tras cada mutación (HU-09).
 * Los contratos viven en `@checklist/shared`.
 */
import type { FastifyInstance } from 'fastify';
import { Server as SocketIOServer } from 'socket.io';
import type { EventosServidorACliente, EventosClienteAServidor } from '@checklist/shared';

export function registrarGateway(
  app: FastifyInstance,
  corsOrigin: string,
): SocketIOServer<EventosClienteAServidor, EventosServidorACliente> {
  const io = new SocketIOServer<EventosClienteAServidor, EventosServidorACliente>(app.server, {
    cors: { origin: corsOrigin },
  });

  io.on('connection', (socket) => {
    app.log.info({ socketId: socket.id }, 'cliente de tiempo real conectado');

    socket.on('disconnect', (reason) => {
      app.log.info({ socketId: socket.id, reason }, 'cliente de tiempo real desconectado');
    });
  });

  return io;
}
