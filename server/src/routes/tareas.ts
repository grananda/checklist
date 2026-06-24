/**
 * Rutas REST de tareas (capa transporte). Valida la FORMA con JSON Schema de Fastify;
 * la semántica (título, límites) vive en el servicio. No contiene SQL ni reglas de negocio.
 */
import type { FastifyInstance } from 'fastify';
import type { TareaService } from '../services/tareaService.js';

// El JSON Schema valida solo la FORMA (tipos, campos requeridos). Las longitudes (NFR-12,
// configurables por entorno) son validación semántica y viven en el servicio.
const bodyCrear = {
  type: 'object',
  required: ['titulo'],
  additionalProperties: false,
  properties: {
    titulo: { type: 'string' },
    descripcion: { type: 'string' },
  },
} as const;

const bodyActualizar = {
  type: 'object',
  minProperties: 1,
  additionalProperties: false,
  properties: {
    hecha: { type: 'boolean' },
    titulo: { type: 'string' },
    descripcion: { type: 'string' },
  },
} as const;

const paramsId = {
  type: 'object',
  required: ['id'],
  properties: { id: { type: 'string', minLength: 1 } },
} as const;

const bodyOrden = {
  type: 'object',
  required: ['orden'],
  additionalProperties: false,
  properties: {
    orden: { type: 'array', items: { type: 'string', minLength: 1 } },
  },
} as const;

export async function registrarTareas(app: FastifyInstance, service: TareaService): Promise<void> {
  app.get('/api/tareas', async () => service.listar());

  app.post<{ Body: { titulo: string; descripcion?: string } }>(
    '/api/tareas',
    { schema: { body: bodyCrear } },
    async (request, reply) => {
      const tarea = service.crear(request.body);
      return reply.code(201).send(tarea);
    },
  );

  // Rutas estáticas antes que la paramétrica /:id (Fastify ya las prioriza, explícito por claridad).
  app.patch<{ Body: { orden: string[] } }>(
    '/api/tareas/orden',
    { schema: { body: bodyOrden } },
    async (request) => {
      return service.reordenar(request.body.orden);
    },
  );

  app.post('/api/tareas/reset', async (_request, reply) => {
    service.reiniciar();
    return reply.code(204).send();
  });

  app.patch<{
    Params: { id: string };
    Body: { hecha?: boolean; titulo?: string; descripcion?: string };
  }>('/api/tareas/:id', { schema: { params: paramsId, body: bodyActualizar } }, async (request) => {
    return service.actualizar(request.params.id, request.body);
  });

  app.delete<{ Params: { id: string } }>(
    '/api/tareas/:id',
    { schema: { params: paramsId } },
    async (request, reply) => {
      service.borrar(request.params.id);
      return reply.code(204).send();
    },
  );
}
