import { describe, it, expect, afterAll, beforeAll } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { buildApp } from '../src/app.js';
import { cargarConfig } from '../src/config.js';

describe('GET /health', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    const config = cargarConfig({ NODE_ENV: 'test', DATABASE_URL: ':memory:' });
    app = await buildApp({ config });
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('responde 200 con estado ok', async () => {
    const res = await app.inject({ method: 'GET', url: '/health' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({ status: 'ok' });
  });
});
