## Why

CheckList es un proyecto greenfield: no existe ningún código todavía. Antes de implementar cualquier historia de usuario (HU-01..HU-09) hace falta una **base global ejecutable** sobre la que construir todo lo demás. Siguiendo la metodología (el primer change es siempre `foundation` y no implementa features), esta fase establece el monorepo, el contrato de tipos compartido, el andamiaje de servidor y cliente, y el empaquetado/CI.

El objetivo es dejar el proyecto en un estado **arrancable y verificable** —pero sin funcionalidad de usuario— que desbloquee las fases 2-5 del roadmap (`docs/roadmap.md`).

## What Changes

- **Monorepo `pnpm workspaces`** con tres paquetes: `client`, `server`, `shared`; `tsconfig.base.json`, `.env.example`, scripts raíz de build/test/lint.
- **Paquete `shared`**: tipos `Tarea`/`EstadoTarea`, contratos de eventos Socket.IO (`shared/eventos.ts`), constantes y validadores de límites (NFR-12) y validación de título/descripción. Es la única fuente de verdad de tipos y debe ser consumible por `client` y `server`.
- **`server` (Fastify)**: `app.ts` (export para tests con `inject`), `config.ts` (carga/valida env), `index.ts` (entrypoint), `routes/health.ts` (`GET /health`), `static.ts` (sirve el build del client en mismo origen), conexión y esquema SQLite (`db/connection.ts`, `db/schema.ts`) y **andamiaje vacío** del gateway de tiempo real (`realtime/gateway.ts`, sin eventos de negocio).
- **`client` (Vite + React + Zustand)**: `main.tsx`, `App.tsx`/`AppShell` mínimo, `styles/tokens.css` (design tokens de la guía de estilos) y `global.css`.
- **Empaquetado y CI**: `docker/Dockerfile` multi-stage + `docker/docker-compose.yml` con volumen para persistir el `.db` (D-38); workflow de **GitHub Actions** (build + test) y tooling **ESLint + Prettier**.
- **Tests de andamiaje** con **Vitest** (server y client) que verifican el arranque mínimo, no reglas de negocio.

**Fuera de alcance de este change**: ninguna historia de usuario; sin endpoints CRUD (`/api/tareas`), sin lógica de progreso, sin reordenación/reset, sin broadcast real de eventos por Socket.IO.

## Capabilities

### New Capabilities
- `shared-contract`: el paquete `shared` compila y expone los tipos (`Tarea`, `EstadoTarea`), los contratos de eventos de tiempo real y los validadores de límites, consumibles por `client` y `server`.
- `server-runtime`: el servidor Fastify arranca, responde `GET /health`, sirve el build del client en el mismo origen, abre la conexión SQLite y crea el esquema, y registra el andamiaje (vacío) del gateway de tiempo real.
- `web-shell`: la app cliente (Vite + React + Zustand) compila y renderiza un `AppShell` mínimo con los design tokens, sin funcionalidad de tareas.
- `build-and-ci`: la imagen Docker multi-stage se construye, `docker-compose` levanta el servicio con persistencia del `.db`, y la CI ejecuta build + test en cada push/PR.

### Modified Capabilities
<!-- Ninguna: no existen specs principales todavía; foundation es el primer change. -->

## Impact

- **Código**: crea la estructura completa del repositorio (`package.json` raíz, `pnpm-workspace.yaml`, `tsconfig.base.json`, paquetes `shared/`, `server/`, `client/`, `docker/`, `.github/workflows/`). No modifica código existente (no lo hay).
- **Dependencias**: TypeScript, Fastify (+ `@fastify/static`, `@fastify/helmet`), `better-sqlite3`, `socket.io`, React 18, Vite, Zustand, Vitest, ESLint, Prettier, pnpm como gestor de paquetes.
- **Operación**: introduce el flujo de arranque local vía `docker-compose` con volumen del `.db` y el pipeline de CI en GitHub Actions.
- **Habilita**: las fases 2-5 del roadmap (`tareas-api-crud`, `ui-mvp-checklist`, `reordenar-y-reiniciar`, `tiempo-real`).
- **Sin** migraciones de datos, autenticación ni integraciones externas (requisitos §6).
