/**
 * Sirve el build estático del client en el mismo origen que la API (D-36).
 * En el contenedor único, el server entrega la SPA y las rutas `/api`.
 */
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import fastifyStatic from '@fastify/static';
import type { FastifyInstance } from 'fastify';

/** Resuelve la ruta del build del client (override por CLIENT_DIST). */
export function resolverClientDist(env: NodeJS.ProcessEnv = process.env): string {
  if (env.CLIENT_DIST && env.CLIENT_DIST.trim() !== '') {
    return resolve(env.CLIENT_DIST);
  }
  // server/dist/static.js -> ../../client/dist (mismo layout en monorepo y en la imagen Docker).
  return resolve(import.meta.dirname, '../../client/dist');
}

export async function registrarStatic(app: FastifyInstance): Promise<void> {
  const root = resolverClientDist();

  if (!existsSync(root)) {
    app.log.warn(
      { root },
      'build del client no encontrado; se sirve sólo la API (ejecuta el build del client)',
    );
    return;
  }

  await app.register(fastifyStatic, { root, prefix: '/' });

  // Fallback SPA: cualquier ruta no-API devuelve index.html.
  app.setNotFoundHandler((request, reply) => {
    if (request.url.startsWith('/api') || request.url.startsWith('/health')) {
      return reply.code(404).send({ error: 'No encontrado' });
    }
    return reply.sendFile('index.html');
  });
}
