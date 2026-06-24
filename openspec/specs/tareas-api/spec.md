# tareas-api Specification

## Purpose
TBD - created by archiving change tareas-api-crud. Update Purpose after archive.
## Requirements
### Requirement: Listar las tareas
`GET /api/tareas` DEBE (MUST) devolver todas las tareas de la lista compartida ordenadas por `posicion` ascendente, como fuente única de verdad (HU-01).

#### Scenario: Lista con tareas
- **WHEN** existen tareas y se hace `GET /api/tareas`
- **THEN** responde `200` con un array de `Tarea` (id, titulo, descripcion?, hecha, posicion, createdAt, updatedAt) en orden de `posicion`

#### Scenario: Lista vacía
- **WHEN** no hay tareas y se hace `GET /api/tareas`
- **THEN** responde `200` con un array vacío (no error)

### Requirement: Crear una tarea
`POST /api/tareas` DEBE (MUST) crear una tarea en estado pendiente con título obligatorio, descripción opcional, `id` UUID generado en servidor y `posicion` determinista al final de la lista (HU-02).

#### Scenario: Alta válida
- **WHEN** se envía `POST /api/tareas` con un título válido
- **THEN** responde `201` con la `Tarea` creada, `hecha=false` y `posicion` mayor que la de cualquier tarea existente

#### Scenario: Título vacío o solo espacios
- **WHEN** se envía un título vacío o solo con espacios
- **THEN** responde `400` con un mensaje en español y no se crea ninguna tarea

#### Scenario: Límites de longitud (NFR-12)
- **WHEN** el título supera `MAX_TITULO_LEN` o la descripción supera `MAX_DESC_LEN`
- **THEN** responde `400` y no se crea una tarea inválida

#### Scenario: Límite de número de tareas (NFR-12)
- **WHEN** la lista ya tiene `MAX_TAREAS` tareas y se intenta crear otra
- **THEN** responde `400` con aviso de límite alcanzado y no se crea

#### Scenario: Descripción ausente
- **WHEN** se crea una tarea sin descripción
- **THEN** la tarea se crea igualmente (descripción opcional)

### Requirement: Cambiar el estado de una tarea
`PATCH /api/tareas/:id` con `{ hecha }` DEBE (MUST) marcar o desmarcar la tarea de forma reversible y refrescar `updatedAt` (HU-03).

#### Scenario: Marcar como hecha
- **WHEN** se hace `PATCH /api/tareas/:id` con `{ "hecha": true }` sobre una tarea pendiente
- **THEN** responde `200` con la tarea en estado hecha

#### Scenario: Desmarcar
- **WHEN** se hace `PATCH /api/tareas/:id` con `{ "hecha": false }` sobre una tarea hecha
- **THEN** responde `200` con la tarea en estado pendiente

### Requirement: Editar título y descripción
`PATCH /api/tareas/:id` con `titulo` y/o `descripcion` DEBE (MUST) actualizar solo los campos presentes, sin alterar estado ni posición, validando título y límites (HU-04).

#### Scenario: Editar título válido
- **WHEN** se hace `PATCH /api/tareas/:id` con un `titulo` válido
- **THEN** responde `200` con el nuevo título; `hecha` y `posicion` no cambian

#### Scenario: Vaciar la descripción
- **WHEN** se hace `PATCH /api/tareas/:id` con `{ "descripcion": "" }`
- **THEN** responde `200` y la descripción queda vacía

#### Scenario: Campo ausente no se modifica
- **WHEN** el cuerpo no incluye `descripcion`
- **THEN** la descripción existente se conserva

#### Scenario: Edición con título inválido
- **WHEN** se intenta editar con título vacío o que supera `MAX_TITULO_LEN`
- **THEN** responde `400` y la tarea conserva sus valores anteriores

### Requirement: Borrar una tarea
`DELETE /api/tareas/:id` DEBE (MUST) eliminar la tarea de forma definitiva (sin papelera) (HU-05).

#### Scenario: Borrado existente
- **WHEN** se hace `DELETE /api/tareas/:id` sobre una tarea existente
- **THEN** responde `204` y la tarea desaparece de `GET /api/tareas`

#### Scenario: Borrado de tarea inexistente
- **WHEN** se hace `DELETE /api/tareas/:id` sobre un id que no existe
- **THEN** responde `404`

### Requirement: Cálculo de progreso coherente
El servicio de progreso DEBE (MUST) calcular hechas/total/porcentaje de forma coherente, incluido el caso de lista vacía sin división por cero (HU-06).

#### Scenario: Progreso con tareas
- **WHEN** hay 3 de 6 tareas hechas
- **THEN** el progreso es `{ hechas: 3, total: 6, porcentaje: 50 }`

#### Scenario: Progreso con lista vacía
- **WHEN** no hay tareas
- **THEN** el progreso es `{ hechas: 0, total: 0, porcentaje: 0 }` (sin división por cero)

### Requirement: Persistencia y separación de capas
El acceso a datos DEBE (MUST) realizarse en `tareaRepository` con sentencias preparadas y transacciones, y las rutas no DEBEN (MUST) contener SQL ni reglas de negocio (arquitectura §5).

#### Scenario: Persistencia tras reinicio
- **WHEN** se crean tareas y se reinicia el servidor contra la misma base
- **THEN** `GET /api/tareas` sigue devolviendo las tareas persistidas

#### Scenario: Validación de forma en transporte
- **WHEN** se envía un cuerpo con forma inválida (p. ej. `hecha` no booleano)
- **THEN** la ruta responde `400` por validación de esquema, sin llegar a la lógica de dominio

