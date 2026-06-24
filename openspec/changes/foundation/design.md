## Context

Proyecto greenfield (no hay código). El stack está cerrado en `docs/arquitectura-base.md` §2 (D-26..D-32): TypeScript en front y back, React 18 + Vite + Zustand, Node + Fastify, Socket.IO, SQLite vía `better-sqlite3` (sin ORM), monorepo `pnpm workspaces` (`client` + `server` + `shared`), despliegue en contenedor único interno. La arquitectura contempla F1 y F2 desde el inicio: el modelo `Tarea` incluye `posicion` y el canal de tiempo real existe como andamiaje desde esta fase, aunque su lógica de negocio llegue en fases posteriores.

Este change materializa el árbol de carpetas de `docs/arquitectura-base.md` §3 y las capas §4-5 (`transport → service → repository → db` en server; `components → store → api` en client), pero **solo el andamiaje**: nada de reglas de negocio.

## Goals / Non-Goals

**Goals:**
- Monorepo `pnpm workspaces` arrancable con los tres paquetes y config TS compartida.
- `shared` compila y es consumible por `client` y `server` (contrato tipado de extremo a extremo, §2 principio 3).
- El servidor arranca, `GET /health` responde y sirve el build del client en mismo origen (D-36).
- Conexión SQLite abierta y esquema `tareas` creado (modelo §8) de forma idempotente.
- Gateway Socket.IO registrado como andamiaje vacío (sin eventos de negocio).
- Cliente Vite + React + Zustand renderiza `AppShell` mínimo con `tokens.css`.
- Imagen Docker multi-stage construible; `docker-compose` levanta el servicio con volumen del `.db` (NFR-09, D-38).
- CI (GitHub Actions) ejecuta build + test; lint/format con ESLint + Prettier.
- Tests de andamiaje en verde (Vitest).

**Non-Goals:**
- Cualquier historia de usuario (HU-01..HU-09): sin endpoints CRUD, sin lógica de progreso, sin reordenar/reset.
- Broadcast real de eventos de tiempo real con payload de negocio (Fase 5).
- Optimistic updates, reconexión y last-write-wins (fases posteriores).
- pub/sub multi-instancia (camino de evolución documentado, no implementado, §12).

## Decisions

- **Gestor de paquetes: pnpm workspaces** (`pnpm-workspace.yaml`). Fijado por el roadmap; resuelve la ambigüedad "npm/pnpm" de la arquitectura a favor de pnpm. Ver `decisions.md#gestor-paquetes`.
- **Runner de tests: Vitest** para `server` y `client`; Playwright queda reservado para e2e en fases con UI. Ver `decisions.md#test-runner`.
- **CI: GitHub Actions** (`.github/workflows/ci.yml`): instala pnpm, compila los tres paquetes y corre `vitest`. Ver `decisions.md#ci-provider`.
- **Lint/format: ESLint + Prettier** con config TS mínima compartida y scripts raíz. Ver `decisions.md#lint-format`.
- **Esquema SQLite idempotente**: `db/schema.ts` ejecuta `CREATE TABLE IF NOT EXISTS tareas (...)` con las columnas del modelo §8 (`id` TEXT PK, `titulo` TEXT NOT NULL, `descripcion` TEXT, `hecha` INTEGER, `posicion` INTEGER, `created_at`, `updated_at`). En foundation se crea el esquema pero **no** se exponen operaciones de dominio.
- **Mismo origen (D-36)**: `static.ts` sirve el build del client desde el server; en desarrollo el cliente puede correr con Vite dev server, pero la verificación de cierre usa el build servido por Fastify.
- **Gateway de tiempo real como andamiaje**: `realtime/gateway.ts` registra Socket.IO sobre el servidor Fastify y la gestión de conexión, sin emitir eventos `tarea:*`/`lista:reset` (esos contratos se declaran en `shared/eventos.ts` pero no se emiten todavía).
- **Config por entorno**: `config.ts` lee y valida `PORT`, `DATABASE_URL`, `CORS_ORIGIN`, `MAX_TAREAS`, `MAX_TITULO_LEN`, `MAX_DESC_LEN`, `NODE_ENV` desde `.env` (plantilla en `.env.example`).

## Risks / Trade-offs

- **`better-sqlite3` es módulo nativo**: requiere compilarse para la plataforma; el `Dockerfile` multi-stage debe instalar toolchain de build en la etapa de compilación y copiar el binario resultante. Mitigación: fijar versión de Node en build y runtime, y validar el build de la imagen en CI o localmente.
- **Andamiaje amplio**: foundation toca muchos ficheros de forma superficial (riesgo de contexto medio, roadmap). Mitigación: mantener cada fichero mínimo y no adelantar lógica de fases posteriores.
- **Contratos de eventos sin emisor**: declarar `shared/eventos.ts` sin uso real puede divergir de la implementación de Fase 5. Mitigación: tratarlos como contrato estable y revisarlos al abrir `tiempo-real`.
- **Validación de prototipo con cliente pendiente** (arquitectura-base §13): si esa validación trae cambios funcionales, podría afectar al modelo `Tarea`; el riesgo en foundation es bajo porque solo se crea el esquema base.
