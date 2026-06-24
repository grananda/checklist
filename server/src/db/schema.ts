/**
 * Esquema SQLite de la tabla `tareas` (modelo arquitectura-base §8).
 * Idempotente: `CREATE TABLE IF NOT EXISTS`. En foundation solo se crea el esquema;
 * las operaciones de dominio (CRUD) llegan en la Fase 2.
 */
import type { DB } from './connection.js';

export function crearEsquema(db: DB): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS tareas (
      id          TEXT PRIMARY KEY,
      titulo      TEXT NOT NULL,
      descripcion TEXT,
      hecha       INTEGER NOT NULL DEFAULT 0 CHECK (hecha IN (0, 1)),
      posicion    INTEGER NOT NULL DEFAULT 0,
      created_at  TEXT NOT NULL,
      updated_at  TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_tareas_posicion ON tareas (posicion);
  `);
}
