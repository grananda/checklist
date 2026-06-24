## Why

Es la última historia de F2 (HU-09) y cierra el alcance del producto: que el equipo vea los cambios de los demás **en tiempo real**, sin recargar. La base está lista desde `foundation` (gateway Socket.IO de andamiaje + contratos de eventos en `shared/eventos.ts`) y todas las mutaciones a difundir ya existen (Fases 2 y 4). Aquí se conecta esa capa transversal.

## What Changes

- **Servidor (capa transversal sobre las mutaciones):**
  - El gateway Socket.IO (`realtime/gateway.ts`) deja de ser andamiaje: las rutas emiten, tras persistir, el evento correspondiente con su payload tipado (`shared/eventos.ts`):
    - `POST /api/tareas` → `tarea:creada` (Tarea)
    - `PATCH /api/tareas/:id` → `tarea:actualizada` (Tarea)
    - `DELETE /api/tareas/:id` → `tarea:borrada` ({ id })
    - `PATCH /api/tareas/orden` → `tarea:reordenada` (Tarea[])
    - `POST /api/tareas/reset` → `lista:reset` ()
  - Difusión a todos los clientes (`io.emit`); aplicar el evento es idempotente.
- **Cliente:**
  - `api/socket.ts`: conexión `socket.io-client` con reconexión automática; al (re)conectar, `GET /api/tareas` para re-sincronizar (HU-09).
  - El store se suscribe a los eventos y actualiza la lista; *last-write-wins* por sobrescritura (NFR-11). El progreso y el orden se recalculan en vivo.
- **Tests:** integración de servidor con dos `socket.io-client` (propagación de cada evento + LWW) y e2e con dos contextos de navegador (un cambio en uno aparece en el otro <1 s, NFR-06).

**Fuera de alcance:** pub/sub multi-instancia (Redis) — camino de evolución documentado, no implementado (arquitectura §12).

## Capabilities

### New Capabilities
- `tiempo-real`: difusión en tiempo real de toda mutación entre los clientes conectados (eventos Socket.IO tras cada cambio), con reconexión/re-sincronización y resolución last-write-wins.

### Modified Capabilities
<!-- Sin cambios de requisitos en specs existentes: las rutas y la UI no cambian su contrato;
     se añade la capa de difusión como capability nueva y transversal. -->

## Impact

- **Código:** `server/src/realtime/gateway.ts` (emisión real), inyección del `io` en `routes/tareas.ts` para emitir tras cada mutación; en `client`, nuevo `api/socket.ts` y suscripción del store a eventos + re-sync.
- **Dependencias:** añade `socket.io-client` (frontend); `socket.io` ya está en el servidor; contratos ya en `shared`.
- **Datos/Contrato REST:** sin cambios; es una capa aditiva.
- **Cierra F2 y el objetivo O-2** (fuente única compartida en tiempo real). Completa el alcance del producto.
