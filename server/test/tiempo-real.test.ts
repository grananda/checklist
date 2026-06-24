import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { io as clienteIO, type Socket } from 'socket.io-client';
import { buildApp } from '../src/app.js';
import { cargarConfig } from '../src/config.js';
import { EVENTOS } from '@checklist/shared';

/** Espera el primer evento `nombre` en un socket, con timeout. */
function esperarEvento<T>(socket: Socket, nombre: string, ms = 2000): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`timeout esperando ${nombre}`)), ms);
    socket.once(nombre, (payload: T) => {
      clearTimeout(timer);
      resolve(payload);
    });
  });
}

function conectar(url: string): Promise<Socket> {
  const socket = clienteIO(url, { transports: ['websocket'], forceNew: true });
  return new Promise((resolve) => socket.on('connect', () => resolve(socket)));
}

describe('tiempo real (Socket.IO)', () => {
  let app: FastifyInstance;
  let url: string;
  let a: Socket;
  let b: Socket;

  beforeEach(async () => {
    const config = cargarConfig({ NODE_ENV: 'test', DATABASE_URL: ':memory:' });
    app = await buildApp({ config, realtime: true });
    await app.listen({ port: 0, host: '127.0.0.1' });
    const dir = app.server.address();
    const port = typeof dir === 'object' && dir ? dir.port : 0;
    url = `http://127.0.0.1:${port}`;
    a = await conectar(url);
    b = await conectar(url);
  });

  afterEach(async () => {
    a.disconnect();
    b.disconnect();
    await app.close();
  });

  it('propaga tarea:creada a todos los clientes', async () => {
    const recibidoB = esperarEvento(b, EVENTOS.tareaCreada);
    await app.inject({ method: 'POST', url: '/api/tareas', payload: { titulo: 'En vivo' } });
    const tarea = (await recibidoB) as { titulo: string };
    expect(tarea.titulo).toBe('En vivo');
  });

  it('propaga lista:reset', async () => {
    const post = await app.inject({ method: 'POST', url: '/api/tareas', payload: { titulo: 'X' } });
    const id = post.json().id as string;
    await app.inject({ method: 'PATCH', url: `/api/tareas/${id}`, payload: { hecha: true } });
    // `lista:reset` no lleva payload: basta con que el evento llegue (resuelve a undefined).
    const reset = esperarEvento(b, EVENTOS.listaReset);
    await app.inject({ method: 'POST', url: '/api/tareas/reset' });
    await expect(reset).resolves.toBeUndefined();
  });

  it('last-write-wins: prevalece la última actualización en todos', async () => {
    const post = await app.inject({
      method: 'POST',
      url: '/api/tareas',
      payload: { titulo: 'v0' },
    });
    const id = post.json().id as string;
    // Escucha hasta ver 'Beta' (evita carreras con el evento 'Alfa' previo).
    const vistoBeta = new Promise<void>((resolve) => {
      a.on(EVENTOS.tareaActualizada, (t: { titulo: string }) => {
        if (t.titulo === 'Beta') resolve();
      });
    });
    await app.inject({ method: 'PATCH', url: `/api/tareas/${id}`, payload: { titulo: 'Alfa' } });
    await app.inject({ method: 'PATCH', url: `/api/tareas/${id}`, payload: { titulo: 'Beta' } });
    await vistoBeta;
    const lista = (await app.inject({ method: 'GET', url: '/api/tareas' })).json();
    expect(lista[0].titulo).toBe('Beta');
  });
});
