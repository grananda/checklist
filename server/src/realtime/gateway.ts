/**
 * Andamiaje del gateway de tiempo real (Socket.IO) sobre el servidor Fastify.
 *
 * ANDAMIAJE (foundation): registra el servidor Socket.IO y gestiona conexión/desconexión.
 * NO emite eventos de negocio (`tarea:*`, `lista:reset`). La difusión real llega en la
 * Fase 5 (`tiempo-real`, HU-09), usando los contratos de `@checklist/shared`.
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
