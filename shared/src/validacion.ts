/**
 * Validación reutilizable de título y descripción de una tarea (NFR-12).
 * Usada por el servidor (validación semántica) y reutilizable en el cliente.
 */
import { LIMITES_DEFAULT, type Limites } from './limites.js';

export interface ResultadoValidacion {
  ok: boolean;
  /** Mensaje en español cuando `ok` es false. */
  error?: string;
}

/** Valida un título: obligatorio (no vacío tras recortar) y dentro del límite. */
export function validarTitulo(
  titulo: string,
  limites: Limites = LIMITES_DEFAULT,
): ResultadoValidacion {
  const valor = titulo.trim();
  if (valor.length === 0) {
    return { ok: false, error: 'El título es obligatorio.' };
  }
  if (valor.length > limites.maxTituloLen) {
    return { ok: false, error: `El título no puede superar ${limites.maxTituloLen} caracteres.` };
  }
  return { ok: true };
}

/** Valida una descripción opcional: si existe, debe estar dentro del límite. */
export function validarDescripcion(
  descripcion: string | undefined,
  limites: Limites = LIMITES_DEFAULT,
): ResultadoValidacion {
  if (descripcion === undefined) {
    return { ok: true };
  }
  if (descripcion.length > limites.maxDescLen) {
    return {
      ok: false,
      error: `La descripción no puede superar ${limites.maxDescLen} caracteres.`,
    };
  }
  return { ok: true };
}
