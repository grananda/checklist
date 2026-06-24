/**
 * Construcción de la app Fastify. Exportada para tests con `app.inject()`.
 * Registra seguridad (helmet), el endpoint de salud, y el servido estático del client.
 * NO registra endpoints CRUD ni difusión de eventos (fases posteriores).
 */
import Fastify, { type FastifyInstance } from 'fastify';
import helmet from '@fastify/helmet';
import type { Config } from './config.js';
import { registrarHealth } from './routes/health.js';
import { registrarStatic } from './static.js';

export interface BuildAppOptions {
  config: Config;
}

export async function buildApp({ config }: BuildAppOptions): Promise<FastifyInstance> {
  const app = Fastify({
    logger: config.nodeEnv !== 'test',
    bodyLimit: 256 * 1024, // límite de payload (seguridad, §11)
  });

  await app.register(helmet, {
    // CSP relajada en el andamiaje para servir la SPA sin fricción; se endurece más adelante.
    contentSecurityPolicy: false,
  });

  await registrarHealth(app);
  await registrarStatic(app);

  return app;
}
