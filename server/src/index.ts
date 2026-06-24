/**
 * Entrypoint del servidor: carga config, abre la base, construye la app,
 * registra el gateway de tiempo real (andamiaje) y se pone a escuchar.
 */
import { cargarConfig } from './config.js';
import { abrirDB } from './db/connection.js';
import { buildApp } from './app.js';
import { registrarGateway } from './realtime/gateway.js';

async function main(): Promise<void> {
  const config = cargarConfig();

  // Abre SQLite y crea el esquema (idempotente). En foundation no se usa aún para CRUD.
  abrirDB(config.databaseUrl);

  const app = await buildApp({ config });

  // Andamiaje del gateway de tiempo real (sin eventos de negocio todavía).
  registrarGateway(app, config.corsOrigin);

  try {
    await app.listen({ port: config.port, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

void main();
