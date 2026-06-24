/**
 * Reglas de dominio de las tareas (capa servicio). Valida semánticamente reutilizando
 * los validadores de `@checklist/shared` y orquesta el repositorio (arquitectura §5).
 */
import { randomUUID } from 'node:crypto';
import {
  validarTitulo,
  validarDescripcion,
  superaMaxTareas,
  type Tarea,
  type Limites,
} from '@checklist/shared';
import type { TareaRepository } from '../repositories/tareaRepository.js';
import { DomainError } from './errors.js';

export interface CrearTareaInput {
  titulo: string;
  descripcion?: string;
}

/** Campos parciales para PATCH: ausente = no cambia; `descripcion: ''` = vaciar. */
export interface ActualizarTareaInput {
  hecha?: boolean;
  titulo?: string;
  descripcion?: string;
}

export interface TareaService {
  listar(): Tarea[];
  crear(input: CrearTareaInput): Tarea;
  actualizar(id: string, patch: ActualizarTareaInput): Tarea;
  borrar(id: string): void;
  /** Reordena la lista según los ids dados (HU-07). Devuelve la lista ordenada. */
  reordenar(orden: string[]): Tarea[];
  /** Reinicia la lista si hay ≥1 tarea y todas hechas (HU-08, D-15). */
  reiniciar(): void;
}

export function createTareaService(repo: TareaRepository, limites: Limites): TareaService {
  function ahora(): string {
    return new Date().toISOString();
  }

  return {
    listar: () => repo.listar(),

    crear(input) {
      const vt = validarTitulo(input.titulo, limites);
      if (!vt.ok) throw new DomainError(vt.error ?? 'Título inválido.');
      const vd = validarDescripcion(input.descripcion, limites);
      if (!vd.ok) throw new DomainError(vd.error ?? 'Descripción inválida.');
      if (superaMaxTareas(repo.contar(), limites)) {
        throw new DomainError(`Se alcanzó el máximo de ${limites.maxTareas} tareas.`);
      }
      const ts = ahora();
      const tarea: Tarea = {
        id: randomUUID(),
        titulo: input.titulo.trim(),
        descripcion:
          input.descripcion && input.descripcion.length > 0 ? input.descripcion : undefined,
        hecha: false,
        posicion: repo.siguientePosicion(),
        createdAt: ts,
        updatedAt: ts,
      };
      repo.insertar(tarea);
      return tarea;
    },

    actualizar(id, patch) {
      const actual = repo.obtener(id);
      if (!actual) throw new DomainError('Tarea no encontrada.', 404);

      let { titulo, descripcion, hecha } = actual;

      if (patch.titulo !== undefined) {
        const v = validarTitulo(patch.titulo, limites);
        if (!v.ok) throw new DomainError(v.error ?? 'Título inválido.');
        titulo = patch.titulo.trim();
      }
      if (patch.descripcion !== undefined) {
        const v = validarDescripcion(patch.descripcion, limites);
        if (!v.ok) throw new DomainError(v.error ?? 'Descripción inválida.');
        descripcion = patch.descripcion === '' ? undefined : patch.descripcion;
      }
      if (patch.hecha !== undefined) {
        hecha = patch.hecha;
      }

      const actualizada: Tarea = { ...actual, titulo, descripcion, hecha, updatedAt: ahora() };
      repo.actualizar(actualizada);
      return actualizada;
    },

    borrar(id) {
      if (!repo.borrar(id)) throw new DomainError('Tarea no encontrada.', 404);
    },

    reordenar(orden) {
      const existentes = repo.listar();
      const idsExistentes = new Set(existentes.map((t) => t.id));
      const idsOrden = new Set(orden);
      const coincide =
        orden.length === existentes.length &&
        idsOrden.size === orden.length &&
        orden.every((id) => idsExistentes.has(id));
      if (!coincide) {
        throw new DomainError('El orden no coincide con las tareas existentes.');
      }
      repo.reasignarPosiciones(orden);
      return repo.listar();
    },

    reiniciar() {
      const tareas = repo.listar();
      if (tareas.length === 0) {
        throw new DomainError('No hay tareas que reiniciar.', 409);
      }
      if (!tareas.every((t) => t.hecha)) {
        throw new DomainError('Solo se puede reiniciar cuando todas las tareas están hechas.', 409);
      }
      repo.borrarTodas();
    },
  };
}
