/**
 * Acceso a datos de las tareas (capa repositorio). SQL con sentencias preparadas;
 * el repositorio no contiene reglas de negocio (arquitectura §5).
 */
import type { Tarea } from '@checklist/shared';
import type { DB } from '../db/connection.js';

interface Row {
  id: string;
  titulo: string;
  descripcion: string | null;
  hecha: number;
  posicion: number;
  created_at: string;
  updated_at: string;
}

function rowToTarea(r: Row): Tarea {
  return {
    id: r.id,
    titulo: r.titulo,
    descripcion: r.descripcion ?? undefined,
    hecha: r.hecha === 1,
    posicion: r.posicion,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export interface TareaRepository {
  listar(): Tarea[];
  obtener(id: string): Tarea | undefined;
  insertar(tarea: Tarea): void;
  actualizar(tarea: Tarea): void;
  borrar(id: string): boolean;
  contar(): number;
  siguientePosicion(): number;
}

export function createTareaRepository(db: DB): TareaRepository {
  const stmtListar = db.prepare('SELECT * FROM tareas ORDER BY posicion ASC');
  const stmtObtener = db.prepare('SELECT * FROM tareas WHERE id = ?');
  const stmtInsertar = db.prepare(
    `INSERT INTO tareas (id, titulo, descripcion, hecha, posicion, created_at, updated_at)
     VALUES (@id, @titulo, @descripcion, @hecha, @posicion, @created_at, @updated_at)`,
  );
  const stmtActualizar = db.prepare(
    `UPDATE tareas
       SET titulo = @titulo, descripcion = @descripcion, hecha = @hecha,
           posicion = @posicion, updated_at = @updated_at
     WHERE id = @id`,
  );
  const stmtBorrar = db.prepare('DELETE FROM tareas WHERE id = ?');
  const stmtContar = db.prepare('SELECT COUNT(*) AS n FROM tareas');
  const stmtMaxPos = db.prepare('SELECT MAX(posicion) AS m FROM tareas');

  return {
    listar: () => (stmtListar.all() as Row[]).map(rowToTarea),
    obtener: (id) => {
      const r = stmtObtener.get(id) as Row | undefined;
      return r ? rowToTarea(r) : undefined;
    },
    insertar: (t) => {
      stmtInsertar.run({
        id: t.id,
        titulo: t.titulo,
        descripcion: t.descripcion ?? null,
        hecha: t.hecha ? 1 : 0,
        posicion: t.posicion,
        created_at: t.createdAt,
        updated_at: t.updatedAt,
      });
    },
    actualizar: (t) => {
      stmtActualizar.run({
        id: t.id,
        titulo: t.titulo,
        descripcion: t.descripcion ?? null,
        hecha: t.hecha ? 1 : 0,
        posicion: t.posicion,
        updated_at: t.updatedAt,
      });
    },
    borrar: (id) => stmtBorrar.run(id).changes > 0,
    contar: () => (stmtContar.get() as { n: number }).n,
    siguientePosicion: () => {
      const { m } = stmtMaxPos.get() as { m: number | null };
      return (m ?? -1) + 1;
    },
  };
}
