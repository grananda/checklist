## Context

`foundation` dejó la app Fastify, la conexión SQLite y la tabla `tareas` (modelo §8), el contrato `@checklist/shared` (tipos `Tarea`, validadores de límites) y el flujo de capas `transport → service → repository → db` (§5). Esta fase implementa el dominio y la API REST de las operaciones del MVP (HU-01..HU-06), sin tocar `client/` ni el tiempo real.

Endpoints fijados por la arquitectura §9: `GET /api/tareas`, `POST /api/tareas`, `PATCH /api/tareas/:id` (HU-03 toggle + HU-04 editar), `DELETE /api/tareas/:id`.

## Goals / Non-Goals

**Goals:**
- CRUD completo del MVP persistido en SQLite con sentencias preparadas y transacciones.
- Validación de forma en transporte y de semántica (título obligatorio, límites NFR-12) en servicio.
- `id` UUID y `posicion` determinista al final en la creación; orden estable por `posicion`.
- Toggle de estado y edición parcial sobre el mismo recurso (PATCH).
- Borrado definitivo (sin papelera).
- Progreso coherente con lista vacía (sin división por cero).
- Tests de servicio y de rutas (`inject`) que cubran los criterios bloqueantes de HU-01/02/03/05/06.

**Non-Goals:**
- UI / `client/` (Fase 3).
- `PATCH /api/tareas/orden` y `POST /api/tareas/reset` (Fase 4).
- Difusión de eventos Socket.IO (Fase 5): tras persistir solo se responde; el gateway sigue como andamiaje.
- Autenticación/permisos (fuera de alcance, requisitos §6).

## Decisions

- **Validación de forma en transporte con JSON Schema de Fastify** (sin dependencia extra): cada ruta declara el schema de `body`/`params` y Fastify responde `400` ante forma inválida. La validación **semántica** (título no vacío, límites) vive en `tareaService` reutilizando `validarTitulo`/`validarDescripcion` de `@checklist/shared`. Ver `decisions.md#validacion-transporte`.
- **PATCH parcial**: cuerpo `{ hecha?, titulo?, descripcion? }`. Campo **ausente** = no se modifica; `descripcion: ""` = se vacía; `titulo`/`descripcion` con texto = se actualiza. Un toggle es `PATCH { hecha }`. Ver `decisions.md#patch-parcial-descripcion`.
- **Identificadores y tiempos**: `id` con `crypto.randomUUID()` en servidor (D-35); `createdAt`/`updatedAt` ISO 8601 generados en servidor; `updatedAt` se refresca en cada mutación.
- **Posición determinista**: al crear, `posicion = (MAX(posicion) ?? -1) + 1` → la tarea nace al final (HU-02), coherente con la reordenación futura (HU-07).
- **Límites efectivos** desde `config` (env NFR-12), no hardcodeados: el servicio recibe los límites y rechaza creación si se alcanza `MAX_TAREAS`.
- **Mapeo de tipos en el repositorio**: `hecha` se almacena como INTEGER 0/1 y se mapea a boolean; el repositorio es el único que conoce el SQL.
- **Last-write-wins (NFR-11)**: las mutaciones sobre una fila simplemente sobrescriben; sin bloqueo optimista ni control de versión (coherente con la escala y §8).
- **Respuestas**: `POST` devuelve `201` con la `Tarea` creada; `PATCH` `200` con la `Tarea` actualizada; `DELETE` `204`; `GET` `200` con `Tarea[]` ordenado por `posicion`. Errores semánticos → `400` con `{ error }` en español; recurso inexistente → `404`.

## Risks / Trade-offs

- **Doble validación (forma + semántica)**: riesgo de divergencia entre el JSON Schema y los validadores de `shared`. Mitigación: el schema cubre **solo forma** (tipos, campos requeridos, `additionalProperties:false`, `minProperties`); las **longitudes** (NFR-12, configurables por entorno) NO se duplican en el schema y se validan únicamente en el servicio con los validadores de `shared`, que son la regla canónica. El `bodyLimit` (256 KB) acota el tamaño bruto del payload antes de llegar al servicio.
- **PATCH con `""` para vaciar**: si el cliente envía `descripcion: ""` sin querer, vacía el campo. Aceptado: es el contrato explícito; la UI (Fase 3) controla el envío.
- **`MAX_TAREAS` como salvaguarda**: rechazo en creación cuando se alcanza el tope (HU-02); no es un límite de negocio "duro" más allá de NFR-12.
- **Sin difusión todavía**: dos clientes no se ven en vivo hasta la Fase 5; en esta fase la coherencia se garantiza solo al recargar (`GET`). Esperado por el faseado.
