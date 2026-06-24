## 1. Repositorio (acceso a datos)

- [ ] 1.1 `server/src/repositories/tareaRepository.ts`: sentencias preparadas para listar (orden por `posicion`), obtener por id, insertar, actualizar (estado/título/descripción/updatedAt) y borrar
- [ ] 1.2 Mapeo fila↔`Tarea` (`hecha` INTEGER 0/1 ↔ boolean); cálculo de `posicion` al final (`MAX(posicion)+1`)
- [ ] 1.3 Transacciones donde aplique; el repositorio no contiene reglas de negocio

## 2. Servicios (dominio)

- [ ] 2.1 `server/src/services/tareaService.ts`: crear (UUID, validar título/límites con `shared`, `MAX_TAREAS`, posición al final), toggle estado, editar parcial (sin tocar estado/posición), borrar
- [ ] 2.2 Validación semántica reutilizando `validarTitulo`/`validarDescripcion` de `@checklist/shared`; errores con mensaje en español
- [ ] 2.3 `server/src/services/progresoService.ts`: `{ hechas, total, porcentaje }` coherente con lista vacía (sin división por cero)

## 3. Rutas REST (transporte)

- [ ] 3.1 `server/src/routes/tareas.ts`: `GET /api/tareas`, `POST /api/tareas`, `PATCH /api/tareas/:id`, `DELETE /api/tareas/:id`
- [ ] 3.2 JSON Schema de Fastify por ruta (forma de `body`/`params`); mapear errores de dominio a `400`/`404`; códigos `200/201/204`
- [ ] 3.3 Registrar las rutas `/api` en `app.ts` (junto a `/health`), inyectando repositorio/servicios y `config.limites`

## 4. Tests

- [ ] 4.1 Tests de `tareaService` y `progresoService`: título obligatorio, límites NFR-12, `MAX_TAREAS`, posición al final, progreso con lista vacía
- [ ] 4.2 Tests de rutas con `app.inject()`: GET/POST/PATCH(toggle+editar)/DELETE, casos `400`/`404`
- [ ] 4.3 Test de persistencia: las tareas sobreviven a reabrir la base

## 5. Verificación de cierre

- [ ] 5.1 Los 5 endpoints del MVP responden y persisten en SQLite
- [ ] 5.2 Validación de límites y título obligatorio cubierta por tests
- [ ] 5.3 Progreso correcto incluido el caso de lista vacía; criterios bloqueantes de HU-01/02/03/05/06 verificables vía API
