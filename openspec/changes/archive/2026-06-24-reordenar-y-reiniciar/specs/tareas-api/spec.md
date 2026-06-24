## ADDED Requirements

### Requirement: Reordenar las tareas
`PATCH /api/tareas/orden` DEBE (MUST) aceptar `{ orden: string[] }` con los ids en el nuevo orden y reasignar `posicion = índice` para todas las tareas en una transacción, devolviendo la lista ordenada (HU-07).

#### Scenario: Reordenado válido
- **WHEN** se envía `{ "orden": [idC, idA, idB] }` con exactamente los ids existentes
- **THEN** responde `200` con las tareas en ese orden y la `posicion` reasignada 0..n-1, persistida

#### Scenario: Conjunto de ids incoherente
- **WHEN** el array `orden` no coincide con el conjunto de tareas existentes (falta o sobra algún id)
- **THEN** responde `400` y no se altera ningún orden

### Requirement: Reiniciar la lista
`POST /api/tareas/reset` DEBE (MUST) vaciar la lista (borrado definitivo, en transacción) solo si hay al menos una tarea y todas están hechas; en caso contrario no DEBE (MUST) borrar nada (HU-08, D-15).

#### Scenario: Reinicio procedente
- **WHEN** hay ≥1 tarea y todas están hechas y se hace `POST /api/tareas/reset`
- **THEN** responde `204` y `GET /api/tareas` devuelve una lista vacía

#### Scenario: Reinicio no procedente
- **WHEN** hay alguna tarea pendiente, o la lista está vacía, y se hace `POST /api/tareas/reset`
- **THEN** responde `409` y no se borra ninguna tarea
