import { describe, it, expect, beforeEach } from 'vitest';
import { LIMITES_DEFAULT, type Limites } from '@checklist/shared';
import { abrirDB } from '../src/db/connection.js';
import { createTareaRepository } from '../src/repositories/tareaRepository.js';
import { createTareaService } from '../src/services/tareaService.js';

function nuevoService(limites: Limites = LIMITES_DEFAULT) {
  const db = abrirDB(':memory:');
  const repo = createTareaRepository(db);
  return { service: createTareaService(repo, limites), repo };
}

describe('tareaService', () => {
  let ctx: ReturnType<typeof nuevoService>;
  beforeEach(() => {
    ctx = nuevoService();
  });

  it('crea una tarea pendiente con posición al final', () => {
    const a = ctx.service.crear({ titulo: 'Primera' });
    const b = ctx.service.crear({ titulo: 'Segunda' });
    expect(a.hecha).toBe(false);
    expect(a.id).toBeTruthy();
    expect(b.posicion).toBeGreaterThan(a.posicion);
  });

  it('rechaza título vacío', () => {
    expect(() => ctx.service.crear({ titulo: '   ' })).toThrowError();
  });

  it('rechaza título que supera el límite', () => {
    const largo = 'a'.repeat(LIMITES_DEFAULT.maxTituloLen + 1);
    expect(() => ctx.service.crear({ titulo: largo })).toThrowError();
  });

  it('aplica el límite MAX_TAREAS', () => {
    const c = nuevoService({ ...LIMITES_DEFAULT, maxTareas: 2 });
    c.service.crear({ titulo: 'a' });
    c.service.crear({ titulo: 'b' });
    expect(() => c.service.crear({ titulo: 'c' })).toThrowError();
  });

  it('toggle de estado conserva posición', () => {
    const t = ctx.service.crear({ titulo: 'X' });
    const hecha = ctx.service.actualizar(t.id, { hecha: true });
    expect(hecha.hecha).toBe(true);
    expect(hecha.posicion).toBe(t.posicion);
    const pend = ctx.service.actualizar(t.id, { hecha: false });
    expect(pend.hecha).toBe(false);
  });

  it('edita título sin tocar estado ni posición', () => {
    const t = ctx.service.crear({ titulo: 'Viejo' });
    ctx.service.actualizar(t.id, { hecha: true });
    const ed = ctx.service.actualizar(t.id, { titulo: 'Nuevo' });
    expect(ed.titulo).toBe('Nuevo');
    expect(ed.hecha).toBe(true);
    expect(ed.posicion).toBe(t.posicion);
  });

  it('vacía la descripción con ""', () => {
    const t = ctx.service.crear({ titulo: 'X', descripcion: 'algo' });
    const ed = ctx.service.actualizar(t.id, { descripcion: '' });
    expect(ed.descripcion).toBeUndefined();
  });

  it('borra y devuelve 404 si no existe', () => {
    const t = ctx.service.crear({ titulo: 'X' });
    ctx.service.borrar(t.id);
    expect(ctx.service.listar()).toHaveLength(0);
    expect(() => ctx.service.borrar('inexistente')).toThrowError();
  });
});
