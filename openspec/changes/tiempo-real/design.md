## Context

`foundation` dejó el gateway Socket.IO registrado como andamiaje (conexión/desconexión, sin eventos de negocio) y los contratos `EventosServidorACliente` en `shared/eventos.ts`. Las mutaciones a difundir ya existen: crear/actualizar/borrar (Fase 2) y reordenar/reset (Fase 4). Esta fase es la **capa transversal** que difunde cada mutación, más el cliente que la consume. El servidor es la fuente de verdad (RT-4); el tiempo real es la vía de actualización entre clientes, REST la de mutación (arquitectura §8).

## Goals / Non-Goals

**Goals:**
- Emitir el evento tipado tras cada mutación persistida (HU-02..HU-08 → eventos de `shared/eventos.ts`).
- Cliente con reconexión automática y re-sincronización por `GET /api/tareas` al (re)conectar (HU-09).
- Aplicar eventos en el store (lista, progreso y orden en vivo); last-write-wins por sobrescritura (NFR-11).
- Latencia objetivo <1 s en red normal (NFR-06).
- Tests de propagación entre dos clientes y de LWW; e2e con dos contextos.

**Non-Goals:**
- Pub/sub multi-instancia (Redis) — documentado como evolución, no implementado (§12).
- Cambiar el contrato REST o el modelo de datos.
- Resolución de conflictos sofisticada: LWW sin bloqueo, sin merge.

## Decisions

- **Emisión desde transporte**: las rutas reciben el `io` y emiten tras persistir (`io.emit(EVENTOS.x, payload)`), usando los nombres/payloads de `shared/eventos.ts`. El dominio (`tareaService`) permanece puro y testeable sin sockets. Ver `decisions.md#emision-de-eventos`.
- **`io.emit` a todos**: la mutación llega por REST (sin socket asociado), así que se difunde a todos los clientes; aplicar el evento con la `Tarea` completa es idempotente, también para el originador. Ver `decisions.md#alcance-de-difusion`.
- **Cliente `api/socket.ts`**: `socket.io-client` con reconexión automática (por defecto de Socket.IO); en el evento `connect` (inicial y reconexión) se dispara `cargar()` (`GET /api/tareas`) para re-sincronizar el estado completo. Ver `decisions.md#reconexion-y-lww`.
- **Suscripción del store**: el store expone una función para aplicar cada evento:
  - `tarea:creada`/`tarea:actualizada` → insertar o reemplazar por `id`.
  - `tarea:borrada` → quitar por `id`.
  - `tarea:reordenada` → reemplazar la lista por el array recibido.
  - `lista:reset` → vaciar.
  El progreso es derivado, se recalcula solo. LWW: el último evento aplicado gana.
- **Idempotencia y orden local**: como el originador ya actualizó por REST, recibir el mismo evento no cambia el resultado (mismo `id`/estado). El reordenado reemplaza la lista completa, evitando divergencias.
- **No romper F1 sin socket**: si el socket no conecta, la app sigue funcionando vía REST (degradación elegante); el tiempo real es aditivo.

## Risks / Trade-offs

- **Difusión en memoria, una sola instancia**: atada a un proceso (arquitectura §12-13). Aceptado a esta escala (5-10 usuarios); escalar exige pub/sub (no en alcance).
- **Eco al originador**: doble aplicación (REST + evento) mitigada por idempotencia; sin parpadeos porque el payload es el estado final.
- **Concurrencia (LWW, NFR-11)**: ediciones simultáneas sobre la misma tarea → la última gana; sin bloqueo ni merge, por diseño.
- **Reconexión**: durante la desconexión se pierden eventos; el `GET` de re-sync al reconectar cierra el hueco (no se reproduce el historial).
- **Tests de tiempo real**: pueden ser sensibles a timing; se usan esperas por evento (no sleeps fijos) y, en e2e, aserciones web-first.
