## 1. Monorepo y configuración base

- [x] 1.1 Crear `package.json` raíz (scripts build/test/lint/format) y `pnpm-workspace.yaml` con `client`, `server`, `shared`
- [x] 1.2 Crear `tsconfig.base.json` compartido y `.env.example` (`PORT`, `DATABASE_URL`, `CORS_ORIGIN`, `MAX_TAREAS`, `MAX_TITULO_LEN`, `MAX_DESC_LEN`, `NODE_ENV`)
- [x] 1.3 Configurar ESLint + Prettier (config TS compartida) y scripts de lint/format
- [x] 1.4 Añadir `.gitignore` (node_modules, dist, `.db`, `.env`)

## 2. Paquete `shared` (contrato)

- [x] 2.1 `shared/package.json` + `tsconfig.json` y `src/index.ts` (re-exporta API público)
- [x] 2.2 `src/tarea.ts`: tipos `Tarea` y `EstadoTarea` (modelo §8)
- [x] 2.3 `src/eventos.ts`: contratos de eventos Socket.IO (`tarea:creada|actualizada|borrada|reordenada`, `lista:reset`), sin emisor
- [x] 2.4 `src/limites.ts` (constantes NFR-12) y `src/validacion.ts` (validadores de título/descripción)
- [x] 2.5 Verificar que `client` y `server` resuelven e importan `shared` vía workspace

## 3. Servidor Fastify (andamiaje)

- [x] 3.1 `server/package.json` + `tsconfig.json`
- [x] 3.2 `src/config.ts`: carga y validación de variables de entorno
- [x] 3.3 `src/app.ts`: app Fastify (helmet, límite de payload, CORS) exportable para `inject`; `src/index.ts` entrypoint
- [x] 3.4 `src/routes/health.ts`: `GET /health`
- [x] 3.5 `src/db/connection.ts` (better-sqlite3) y `src/db/schema.ts` (tabla `tareas` idempotente)
- [x] 3.6 `src/realtime/gateway.ts`: registro de Socket.IO (conexión/desconexión) sin eventos de negocio
- [x] 3.7 `src/static.ts`: servir el build del client en mismo origen (D-36)

## 4. Cliente Vite + React + Zustand (andamiaje)

- [x] 4.1 `client/package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`
- [x] 4.2 `src/main.tsx` (monta React) y `src/App.tsx`/`AppShell` mínimo
- [x] 4.3 `src/store/useTareasStore.ts`: store Zustand de andamiaje (sin acciones de dominio)
- [x] 4.4 `src/styles/tokens.css` (design tokens de la guía) y `src/styles/global.css`

## 5. Empaquetado y CI

- [x] 5.1 `docker/Dockerfile` multi-stage (build de client + server, compilación de `better-sqlite3`, imagen final Node) y `docker/.dockerignore`
- [x] 5.2 `docker/docker-compose.yml`: servicio `app`, variables `.env`, volumen del `.db` (NFR-09, D-38)
- [x] 5.3 `.github/workflows/ci.yml`: setup pnpm, build de los 3 paquetes, `vitest`, lint

## 6. Tests de andamiaje y verificación de cierre

- [x] 6.1 Test de server (Vitest + Fastify `inject`): `GET /health` responde OK
- [x] 6.2 Test de client (Vitest): render del `AppShell` mínimo
- [x] 6.3 Verificar criterios de cierre: el proyecto arranca, `/health` responde, el client se sirve en mismo origen, `shared` compila y lo consumen ambos, la imagen Docker se construye y el compose levanta con persistencia
