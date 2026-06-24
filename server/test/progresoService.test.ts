import { describe, it, expect } from 'vitest';
import type { Tarea } from '@checklist/shared';
import { calcularProgreso } from '../src/services/progresoService.js';

function tarea(hecha: boolean, i: number): Tarea {
  return {
    id: String(i),
    titulo: `t${i}`,
    hecha,
    posicion: i,
    createdAt: '2026-06-24T00:00:00Z',
    updatedAt: '2026-06-24T00:00:00Z',
  };
}

describe('calcularProgreso', () => {
  it('calcula hechas/total/porcentaje', () => {
    const tareas = [
      tarea(true, 0),
      tarea(true, 1),
      tarea(true, 2),
      tarea(false, 3),
      tarea(false, 4),
      tarea(false, 5),
    ];
    expect(calcularProgreso(tareas)).toEqual({ hechas: 3, total: 6, porcentaje: 50 });
  });

  it('lista vacía sin división por cero', () => {
    expect(calcularProgreso([])).toEqual({ hechas: 0, total: 0, porcentaje: 0 });
  });

  it('todas hechas = 100%', () => {
    expect(calcularProgreso([tarea(true, 0), tarea(true, 1)])).toEqual({
      hechas: 2,
      total: 2,
      porcentaje: 100,
    });
  });
});
