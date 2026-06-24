## Why

Tras `foundation`, el proyecto arranca pero no hace nada para el usuario: no hay endpoints CRUD ni dominio de tareas. La Fase 2 del roadmap implementa el **backend completo del MVP** (HU-01..HU-06): persistencia, reglas de dominio y la API REST de las operaciones de F1. Es requisito para la Fase 3 (UI del MVP), que consumirá esta API.

## What Changes

- **`repositories/tareaRepository.ts`**: acceso a SQLite con sentencias preparadas y transacciones; listado ordenado por `posicion`; mapeo fila↔`Tarea` (incl. `hecha` INTEGER↔boolean).
- **`services/tareaService.ts`**: reglas de dominio — título obligatorio y límites NFR-12 (HU-02/HU-04), creación con `id` (UUID) y `posicion` determinista al final (HU-02), toggle de estado (HU-03), edición parcial (HU-04), borrado definitivo (HU-05). Validación semántica reutilizando `validarTitulo`/`validarDescripcion` de `@checklist/shared`.
- **`services/progresoService.ts`**: cálculo de progreso (hechas/total/porcentaje) coherente con lista vacía, sin división por cero (HU-06).
- **`routes/tareas.ts`** (`/api`): `GET /api/tareas` (HU-01), `POST /api/tareas` (HU-02), `PATCH /api/tareas/:id` (toggle HU-03 + editar HU-04, cuerpo parcial), `DELETE /api/tareas/:id` (HU-05). Validación de **forma** en transporte (JSON Schema de Fastify); validación **semántica** en servicio.
- **Registro de rutas** en la app Fastify existente (las rutas `/api` se montan junto a `/health`).
- **Tests**: de servicio (reglas, límites, progreso con lista vacía) y de rutas con `app.inject()`.

**Fuera de alcance**: nada de `client/`/UI; `PATCH /api/tareas/orden` y `POST /api/tareas/reset` (Fase 4); difusión de eventos por Socket.IO (Fase 5; el gateway sigue como andamiaje, solo se persiste y se responde).

## Capabilities

### New Capabilities
- `tareas-api`: API REST y dominio de las tareas de la lista compartida (listar, crear, cambiar estado, editar, borrar) con validación de límites y cálculo de progreso, persistido en SQLite.

### Modified Capabilities
<!-- Ninguna modificación de requisitos de specs existentes. server-runtime ya preveía el montaje de rutas /api; aquí se añaden como capability nueva, no se alteran sus requisitos. -->

## Impact

- **Código**: nuevos ficheros en `server/src/repositories`, `server/src/services`, `server/src/routes/tareas.ts`; registro de las rutas en `app.ts`. Reutiliza tipos y validadores de `@checklist/shared` (sin cambios en `shared`).
- **Datos**: usa la tabla `tareas` ya creada en `foundation`; sin migraciones nuevas.
- **Dependencias**: ninguna nueva (Fastify JSON Schema nativo, `crypto.randomUUID` nativo, `better-sqlite3` ya presente).
- **Habilita**: Fase 3 (`ui-mvp-checklist`).
- **No incluye**: reordenar/reiniciar (Fase 4) ni tiempo real (Fase 5).
