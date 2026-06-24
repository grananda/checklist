/**
 * Endpoint de salud `GET /health`. No depende de lógica de negocio.
 */
import type { FastifyInstance } from 'fastify';

export async function registrarHealth(app: FastifyInstance): Promise<void> {
  app.get('/health', async () => {
    return { status: 'ok', uptime: process.uptime() };
  });
}
