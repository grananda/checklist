/**
 * Cliente REST tipado de la API de tareas (mismo origen, D-36).
 * Reutiliza los tipos de `@checklist/shared`. Los errores de dominio (400/404)
 * llegan como `{ error }` en español y se propagan como Error con ese mensaje.
 */
import type { Tarea } from '@checklist/shared';

const BASE = '/api/tareas';

export interface CrearTareaInput {
  titulo: string;
  descripcion?: string;
}

export interface ActualizarTareaInput {
  hecha?: boolean;
  titulo?: string;
  descripcion?: string;
}

async function parseError(res: Response): Promise<never> {
  let mensaje = `Error ${res.status}`;
  try {
    const body = (await res.json()) as { error?: string };
    if (body.error) mensaje = body.error;
  } catch {
    // respuesta sin cuerpo JSON
  }
  throw new Error(mensaje);
}

export const api = {
  async listar(): Promise<Tarea[]> {
    const res = await fetch(BASE);
    if (!res.ok) return parseError(res);
    return (await res.json()) as Tarea[];
  },

  async crear(input: CrearTareaInput): Promise<Tarea> {
    const res = await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!res.ok) return parseError(res);
    return (await res.json()) as Tarea;
  },

  async actualizar(id: string, patch: ActualizarTareaInput): Promise<Tarea> {
    const res = await fetch(`${BASE}/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    if (!res.ok) return parseError(res);
    return (await res.json()) as Tarea;
  },

  async borrar(id: string): Promise<void> {
    const res = await fetch(`${BASE}/${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (!res.ok && res.status !== 204) return parseError(res);
  },

  async reordenar(orden: string[]): Promise<Tarea[]> {
    const res = await fetch(`${BASE}/orden`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orden }),
    });
    if (!res.ok) return parseError(res);
    return (await res.json()) as Tarea[];
  },

  async reiniciar(): Promise<void> {
    const res = await fetch(`${BASE}/reset`, { method: 'POST' });
    if (!res.ok && res.status !== 204) return parseError(res);
  },
};
