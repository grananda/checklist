import { describe, it, expect, afterEach } from 'vitest';
import { rmSync } from 'node:fs';
import { LIMITES_DEFAULT } from '@checklist/shared';
import { abrirDB } from '../src/db/connection.js';
import { createTareaRepository } from '../src/repositories/tareaRepository.js';
import { createTareaService } from '../src/services/tareaService.js';

const DB_PATH = './data/test-persistencia.db';

afterEach(() => {
  rmSync('./data', { recursive: true, force: true });
});

describe('persistencia en SQLite', () => {
  it('las tareas sobreviven a reabrir la base', () => {
    // Primera conexión: crear dos tareas.
    const db1 = abrirDB(DB_PATH);
    const svc1 = createTareaService(createTareaRepository(db1), LIMITES_DEFAULT);
    svc1.crear({ titulo: 'Persistente A' });
    svc1.crear({ titulo: 'Persistente B' });
    db1.close();

    // Segunda conexión al mismo fichero: deben seguir ahí, ordenadas por posición.
    const db2 = abrirDB(DB_PATH);
    const svc2 = createTareaService(createTareaRepository(db2), LIMITES_DEFAULT);
    const tareas = svc2.listar();
    db2.close();

    expect(tareas).toHaveLength(2);
    expect(tareas.map((t) => t.titulo)).toEqual(['Persistente A', 'Persistente B']);
  });
});
