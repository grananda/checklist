/**
 * Entrypoint del servidor: carga config, construye la app (que abre la base, cablea
 * dominio/rutas y el gateway de tiempo real) y se pone a escuchar.
 */
import { cargarConfig } from './config.js';
import { buildApp } from './app.js';

async function main(): Promise<void> {
  const config = cargarConfig();
  const app = await buildApp({ config });

  try {
    await app.listen({ port: config.port, host: '0.0.0.0' });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

void main();
