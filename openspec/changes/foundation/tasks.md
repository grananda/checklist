## 1. Monorepo y configuración base

- [ ] 1.1 Crear `package.json` raíz (scripts build/test/lint/format) y `pnpm-workspace.yaml` con `client`, `server`, `shared`
- [ ] 1.2 Crear `tsconfig.base.json` compartido y `.env.example` (`PORT`, `DATABASE_URL`, `CORS_ORIGIN`, `MAX_TAREAS`, `MAX_TITULO_LEN`, `MAX_DESC_LEN`, `NODE_ENV`)
- [ ] 1.3 Configurar ESLint + Prettier (config TS compartida) y scripts de lint/format
- [ ] 1.4 Añadir `.gitignore` (node_modules, dist, `.db`, `.env`)

## 2. Paquete `shared` (contrato)

- [ ] 2.1 `shared/package.json` + `tsconfig.json` y `src/index.ts` (re-exporta API público)
- [ ] 2.2 `src/tarea.ts`: tipos `Tarea` y `EstadoTarea` (modelo §8)
- [ ] 2.3 `src/eventos.ts`: contratos de eventos Socket.IO (`tarea:creada|actualizada|borrada|reordenada`, `lista:reset`), sin emisor
- [ ] 2.4 `src/limites.ts` (constantes NFR-12) y `src/validacion.ts` (validadores de título/descripción)
- [ ] 2.5 Verificar que `client` y `server` resuelven e importan `shared` vía workspace

## 3. Servidor Fastify (andamiaje)

- [ ] 3.1 `server/package.json` + `tsconfig.json`
- [ ] 3.2 `src/config.ts`: carga y validación de variables de entorno
- [ ] 3.3 `src/app.ts`: app Fastify (helmet, límite de payload, CORS) exportable para `inject`; `src/index.ts` entrypoint
- [ ] 3.4 `src/routes/health.ts`: `GET /health`
- [ ] 3.5 `src/db/connection.ts` (better-sqlite3) y `src/db/schema.ts` (tabla `tareas` idempotente)
- [ ] 3.6 `src/realtime/gateway.ts`: registro de Socket.IO (conexión/desconexión) sin eventos de negocio
- [ ] 3.7 `src/static.ts`: servir el build del client en mismo origen (D-36)

## 4. Cliente Vite + React + Zustand (andamiaje)

- [ ] 4.1 `client/package.json`, `tsconfig.json`, `vite.config.ts`, `index.html`
- [ ] 4.2 `src/main.tsx` (monta React) y `src/App.tsx`/`AppShell` mínimo
- [ ] 4.3 `src/store/useTareasStore.ts`: store Zustand de andamiaje (sin acciones de dominio)
- [ ] 4.4 `src/styles/tokens.css` (design tokens de la guía) y `src/styles/global.css`

## 5. Empaquetado y CI

- [ ] 5.1 `docker/Dockerfile` multi-stage (build de client + server, compilación de `better-sqlite3`, imagen final Node) y `docker/.dockerignore`
- [ ] 5.2 `docker/docker-compose.yml`: servicio `app`, variables `.env`, volumen del `.db` (NFR-09, D-38)
- [ ] 5.3 `.github/workflows/ci.yml`: setup pnpm, build de los 3 paquetes, `vitest`, lint

## 6. Tests de andamiaje y verificación de cierre

- [ ] 6.1 Test de server (Vitest + Fastify `inject`): `GET /health` responde OK
- [ ] 6.2 Test de client (Vitest): render del `AppShell` mínimo
- [ ] 6.3 Verificar criterios de cierre: el proyecto arranca, `/health` responde, el client se sirve en mismo origen, `shared` compila y lo consumen ambos, la imagen Docker se construye y el compose levanta con persistencia
