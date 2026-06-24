# tiempo-real Specification

## Purpose
TBD - created by archiving change tiempo-real. Update Purpose after archive.
## Requirements
### Requirement: Difusión de mutaciones a los clientes
El servidor DEBE (MUST) emitir, tras persistir cada mutación, el evento Socket.IO correspondiente (`tarea:creada`, `tarea:actualizada`, `tarea:borrada`, `tarea:reordenada`, `lista:reset`) con el payload definido en `shared/eventos.ts`, a todos los clientes conectados (HU-09, RF-09).

#### Scenario: Alta propagada
- **WHEN** un cliente crea una tarea vía `POST /api/tareas`
- **THEN** todos los clientes conectados reciben `tarea:creada` con la `Tarea` creada

#### Scenario: Borrado y reset propagados
- **WHEN** se borra una tarea o se reinicia la lista
- **THEN** los clientes reciben `tarea:borrada` con `{ id }` o `lista:reset` respectivamente

#### Scenario: Reordenado propagado
- **WHEN** se reordena la lista vía `PATCH /api/tareas/orden`
- **THEN** los clientes reciben `tarea:reordenada` con la lista ordenada

### Requirement: Actualización en vivo del cliente
El cliente DEBE (MUST) suscribirse a los eventos y reflejar el cambio sin recargar, recalculando el progreso y el orden (HU-09); la latencia percibida DEBE (MUST) ser prácticamente inmediata (objetivo <1 s en red normal, NFR-06).

#### Scenario: Dos clientes ven el cambio
- **WHEN** dos personas tienen la web abierta y una añade, marca, edita, borra, reordena o reinicia
- **THEN** la otra ve el cambio sin recargar la página

### Requirement: Reconexión y re-sincronización
Al (re)conectar el socket, el cliente DEBE (MUST) re-sincronizar el estado completo mediante `GET /api/tareas`, de modo que tras una pérdida temporal de conexión vuelva a reflejar el estado compartido vigente (HU-09).

#### Scenario: Re-sync tras reconexión
- **WHEN** un cliente pierde la conexión y se restablece
- **THEN** el cliente vuelve a reflejar el estado compartido actual (re-sincronización por GET)

### Requirement: Resolución last-write-wins
Ante ediciones simultáneas sobre la misma tarea, DEBE (MUST) prevalecer la última escritura, sin bloqueo ni resolución manual de conflictos, y ese resultado DEBE (MUST) ser el que vean todos los clientes (NFR-11).

#### Scenario: Ediciones simultáneas
- **WHEN** dos clientes editan la misma tarea casi a la vez
- **THEN** prevalece la última escritura aplicada y todos los clientes convergen a ese estado

