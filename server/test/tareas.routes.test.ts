import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { buildApp } from '../src/app.js';
import { cargarConfig } from '../src/config.js';

async function appDePrueba(): Promise<FastifyInstance> {
  const config = cargarConfig({ NODE_ENV: 'test', DATABASE_URL: ':memory:' });
  const app = await buildApp({ config });
  await app.ready();
  return app;
}

describe('rutas /api/tareas', () => {
  let app: FastifyInstance;
  beforeEach(async () => {
    app = await appDePrueba();
  });
  afterEach(async () => {
    await app.close();
  });

  it('GET devuelve lista vacía al inicio', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/tareas' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual([]);
  });

  it('POST crea (201) y GET la devuelve', async () => {
    const post = await app.inject({
      method: 'POST',
      url: '/api/tareas',
      payload: { titulo: 'Comprar leche' },
    });
    expect(post.statusCode).toBe(201);
    expect(post.json()).toMatchObject({ titulo: 'Comprar leche', hecha: false });

    const get = await app.inject({ method: 'GET', url: '/api/tareas' });
    expect(get.json()).toHaveLength(1);
  });

  it('POST con título vacío -> 400', async () => {
    const res = await app.inject({ method: 'POST', url: '/api/tareas', payload: { titulo: '  ' } });
    expect(res.statusCode).toBe(400);
  });

  it('POST sin título -> 400 (forma)', async () => {
    const res = await app.inject({ method: 'POST', url: '/api/tareas', payload: {} });
    expect(res.statusCode).toBe(400);
  });

  it('PATCH togglea estado', async () => {
    const { json } = await app.inject({
      method: 'POST',
      url: '/api/tareas',
      payload: { titulo: 'X' },
    });
    const id = json().id as string;
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/tareas/${id}`,
      payload: { hecha: true },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({ hecha: true });
  });

  it('PATCH edita título', async () => {
    const post = await app.inject({
      method: 'POST',
      url: '/api/tareas',
      payload: { titulo: 'Viejo' },
    });
    const id = post.json().id as string;
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/tareas/${id}`,
      payload: { titulo: 'Nuevo' },
    });
    expect(res.json()).toMatchObject({ titulo: 'Nuevo' });
  });

  it('PATCH con cuerpo vacío -> 400 (minProperties)', async () => {
    const post = await app.inject({ method: 'POST', url: '/api/tareas', payload: { titulo: 'X' } });
    const id = post.json().id as string;
    const res = await app.inject({ method: 'PATCH', url: `/api/tareas/${id}`, payload: {} });
    expect(res.statusCode).toBe(400);
  });

  it('DELETE existente -> 204; inexistente -> 404', async () => {
    const post = await app.inject({ method: 'POST', url: '/api/tareas', payload: { titulo: 'X' } });
    const id = post.json().id as string;
    const del = await app.inject({ method: 'DELETE', url: `/api/tareas/${id}` });
    expect(del.statusCode).toBe(204);
    const del2 = await app.inject({ method: 'DELETE', url: `/api/tareas/${id}` });
    expect(del2.statusCode).toBe(404);
  });

  async function crear(titulo: string): Promise<string> {
    const res = await app.inject({ method: 'POST', url: '/api/tareas', payload: { titulo } });
    return res.json().id as string;
  }

  it('PATCH /orden reordena (200) y rechaza ids incoherentes (400)', async () => {
    const a = await crear('A');
    const b = await crear('B');
    const ok = await app.inject({
      method: 'PATCH',
      url: '/api/tareas/orden',
      payload: { orden: [b, a] },
    });
    expect(ok.statusCode).toBe(200);
    expect(ok.json().map((t: { titulo: string }) => t.titulo)).toEqual(['B', 'A']);

    const bad = await app.inject({
      method: 'PATCH',
      url: '/api/tareas/orden',
      payload: { orden: [a] },
    });
    expect(bad.statusCode).toBe(400);
  });

  it('POST /reset -> 409 con pendientes, 204 cuando todas hechas', async () => {
    const a = await crear('A');
    expect((await app.inject({ method: 'POST', url: '/api/tareas/reset' })).statusCode).toBe(409);
    await app.inject({ method: 'PATCH', url: `/api/tareas/${a}`, payload: { hecha: true } });
    expect((await app.inject({ method: 'POST', url: '/api/tareas/reset' })).statusCode).toBe(204);
    expect((await app.inject({ method: 'GET', url: '/api/tareas' })).json()).toEqual([]);
  });

  it('POST /reset -> 409 con lista vacía', async () => {
    expect((await app.inject({ method: 'POST', url: '/api/tareas/reset' })).statusCode).toBe(409);
  });
});
