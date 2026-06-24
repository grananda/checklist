/**
 * Construcción de la app Fastify. Exportada para tests con `app.inject()`.
 * Abre la base, cablea repositorio y servicios, registra salud, las rutas /api de tareas,
 * el gateway de tiempo real (Socket.IO, inyectado en las rutas para difundir) y el servido
 * estático del client.
 */
import Fastify, { type FastifyInstance, type FastifyError } from 'fastify';
import helmet from '@fastify/helmet';
import type { Config } from './config.js';
import { abrirDB, type DB } from './db/connection.js';
import { createTareaRepository } from './repositories/tareaRepository.js';
import { createTareaService } from './services/tareaService.js';
import { DomainError } from './services/errors.js';
import { registrarHealth } from './routes/health.js';
import { registrarTareas } from './routes/tareas.js';
import { registrarGateway } from './realtime/gateway.js';
import { registrarStatic } from './static.js';

export interface BuildAppOptions {
  config: Config;
  /** Permite inyectar una base ya abierta (tests). Si no, se abre desde config.databaseUrl. */
  db?: DB;
  /** Activa el gateway de tiempo real (Socket.IO). Por defecto activo salvo en `test`. */
  realtime?: boolean;
}

export async function buildApp({
  config,
  db,
  realtime,
}: BuildAppOptions): Promise<FastifyInstance> {
  const propietariaDeDB = db === undefined;
  const database = db ?? abrirDB(config.databaseUrl);
  const conRealtime = realtime ?? config.nodeEnv !== 'test';

  const app = Fastify({
    logger: config.nodeEnv !== 'test',
    bodyLimit: 256 * 1024, // límite de payload (seguridad, §11)
  });

  // Cierra la base al cerrar la app, salvo que la conexión venga inyectada (tests).
  if (propietariaDeDB) {
    app.addHook('onClose', () => {
      database.close();
    });
  }

  app.setErrorHandler((error: FastifyError, _request, reply) => {
    if (error instanceof DomainError) {
      return reply.code(error.statusCode).send({ error: error.message });
    }
    // Validación de esquema de Fastify: respondemos en español (§ design, mensajes en español).
    if (error.validation) {
      return reply.code(400).send({ error: 'Solicitud inválida.' });
    }
    if (error.statusCode && error.statusCode < 500) {
      return reply.code(error.statusCode).send({ error: error.message });
    }
    app.log.error(error);
    return reply.code(500).send({ error: 'Error interno del servidor.' });
  });

  await app.register(helmet, {
    // CSP relajada en el andamiaje para servir la SPA sin fricción; se endurece más adelante.
    contentSecurityPolicy: false,
  });

  const repo = createTareaRepository(database);
  const tareaService = createTareaService(repo, config.limites);

  // Gateway de tiempo real (Fase 5): difunde las mutaciones. Las rutas emiten vía `io`.
  const io = conRealtime ? registrarGateway(app, config.corsOrigin) : undefined;
  if (io) {
    app.addHook('onClose', () => {
      io.close();
    });
  }

  await registrarHealth(app);
  await registrarTareas(app, tareaService, io);
  await registrarStatic(app);

  return app;
}
