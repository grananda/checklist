/**
 * Conexión a SQLite vía better-sqlite3 (sin ORM, arquitectura-base §2).
 * Crea el directorio del fichero si no existe y aplica el esquema.
 */
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import Database from 'better-sqlite3';
import { crearEsquema } from './schema.js';

export type DB = Database.Database;

export function abrirDB(databaseUrl: string): DB {
  // Garantiza que el directorio destino exista (p. ej. ./data en el volumen Docker).
  const dir = dirname(databaseUrl);
  if (dir && dir !== '.') {
    mkdirSync(dir, { recursive: true });
  }

  const db = new Database(databaseUrl);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  crearEsquema(db);
  return db;
}
