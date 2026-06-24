## Why

Con el MVP (F1) cerrado, faltan dos historias de F2 que organizan y cierran el ciclo de la lista: **reordenar** (HU-07) y **reiniciar** (HU-08). El modelo ya tiene `posicion` desde `foundation`, así que es el momento de exponer el orden editable y el reinicio, sin entrar todavía en tiempo real (Fase 5).

## What Changes

- **Backend (extiende `tareas-api`):**
  - `PATCH /api/tareas/orden` — recibe `{ orden: string[] }` (ids en el nuevo orden) y reasigna `posicion` 0..n-1 en una **transacción** (HU-07).
  - `POST /api/tareas/reset` — si hay ≥1 tarea y **todas** están hechas, vacía la lista en una transacción y responde `204`; si no procede, `409` (HU-08, D-15).
- **Frontend (extiende `ui-checklist`):**
  - Reordenación por **arrastre** con soporte táctil (`@dnd-kit`) **y alternativa accesible por teclado** (botones mover arriba/abajo en cada `ItemTarea`), persistiendo vía `PATCH /orden` (HU-07, NFR-05).
  - Botón **Reiniciar** habilitado solo al 100% (todas hechas, ≥1) que abre `DialogoConfirmacion`; al confirmar llama a `POST /reset` (HU-08).
- **Tests:** servicio (reasignación de posiciones, regla de reset), rutas (`inject`: 200/204/409), componentes (alternativa por teclado, habilitación del botón) y e2e del reordenado por teclado + reinicio.

**Fuera de alcance:** difusión en tiempo real de estos cambios (Fase 5; aquí solo se persiste y responde).

## Capabilities

### New Capabilities
<!-- Ninguna capability nueva: se extienden las existentes. -->

### Modified Capabilities
- `tareas-api`: añade los endpoints de reordenación (`PATCH /api/tareas/orden`) y reinicio (`POST /api/tareas/reset`) con sus reglas de dominio.
- `ui-checklist`: añade la reordenación accesible (arrastre + teclado) y el botón Reiniciar con confirmación en la pantalla única.

## Impact

- **Código:** nuevos métodos en `tareaRepository` (reasignar posiciones en transacción, borrar todas) y `tareaService` (reglas de orden y de reset); nuevas rutas en `routes/tareas.ts`; en `client`, controles de reordenado en `ItemTarea`/`ListaTareas`, acción de reset en el store y un botón en `App`.
- **Dependencias:** añade `@dnd-kit/core` y `@dnd-kit/sortable` (frontend). Sin cambios en `shared` salvo, si acaso, un validador de orden.
- **Datos:** usa la columna `posicion` existente; sin migraciones.
- **Habilita:** la Fase 5 (`tiempo-real`), que difundirá también `reordenada` y `reset`.
