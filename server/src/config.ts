/**
 * Carga y validación de la configuración del servidor a partir de variables de entorno.
 * Falla de forma explícita ante valores inválidos (no arranca con configuración incoherente).
 */
import { LIMITES_DEFAULT } from '@checklist/shared';

export interface Config {
  port: number;
  databaseUrl: string;
  corsOrigin: string;
  nodeEnv: 'development' | 'production' | 'test';
  limites: {
    maxTareas: number;
    maxTituloLen: number;
    maxDescLen: number;
  };
}

function leerEntero(nombre: string, valor: string | undefined, porDefecto: number): number {
  if (valor === undefined || valor.trim() === '') {
    return porDefecto;
  }
  const n = Number(valor);
  if (!Number.isInteger(n) || n <= 0) {
    throw new Error(`Variable de entorno ${nombre} inválida: se esperaba un entero positivo.`);
  }
  return n;
}

export function cargarConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const nodeEnvRaw = env.NODE_ENV ?? 'development';
  if (!['development', 'production', 'test'].includes(nodeEnvRaw)) {
    throw new Error(`NODE_ENV inválido: ${nodeEnvRaw}.`);
  }

  return {
    port: leerEntero('PORT', env.PORT, 3000),
    databaseUrl: env.DATABASE_URL ?? './data/checklist.db',
    corsOrigin: env.CORS_ORIGIN ?? 'http://localhost:3000',
    nodeEnv: nodeEnvRaw as Config['nodeEnv'],
    limites: {
      maxTareas: leerEntero('MAX_TAREAS', env.MAX_TAREAS, LIMITES_DEFAULT.maxTareas),
      maxTituloLen: leerEntero('MAX_TITULO_LEN', env.MAX_TITULO_LEN, LIMITES_DEFAULT.maxTituloLen),
      maxDescLen: leerEntero('MAX_DESC_LEN', env.MAX_DESC_LEN, LIMITES_DEFAULT.maxDescLen),
    },
  };
}
