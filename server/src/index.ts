/**
 * Entrypoint del servidor: carga config, construye la app (que abre la base y cablea
 * dominio y rutas), registra el gateway de tiempo real (andamiaje) y escucha.
 */
import { cargarConfig } from './config.js';
import { buildApp } from './app.js';
import { registrarGateway } from './realtime/gateway.js';

async function main(): Promise<void> {
  const config = cargarConfig();
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
