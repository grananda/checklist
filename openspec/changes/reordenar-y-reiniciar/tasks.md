## 1. Backend — reordenar

- [x] 1.1 `tareaRepository`: reasignar `posicion` 0..n-1 a partir de un array de ids, en transacción; validar que el conjunto coincide
- [x] 1.2 `tareaService.reordenar(orden: string[])`: valida ids y delega; devuelve la lista ordenada
- [x] 1.3 `routes/tareas.ts`: `PATCH /api/tareas/orden` con JSON Schema `{ orden: string[] }`; 200 / 400

## 2. Backend — reiniciar

- [x] 2.1 `tareaRepository`: borrar todas las tareas en transacción
- [x] 2.2 `tareaService.reiniciar()`: regla "≥1 y todas hechas" (D-15); si no procede, DomainError 409
- [x] 2.3 `routes/tareas.ts`: `POST /api/tareas/reset`; 204 / 409

## 3. Frontend — reordenar

- [x] 3.1 Integrar `@dnd-kit/core` + `@dnd-kit/sortable` en `ListaTareas` (sensores puntero/táctil/teclado)
- [x] 3.2 Controles accesibles "mover arriba/abajo" en `ItemTarea` (alternativa por teclado garantizada, NFR-05)
- [x] 3.3 Acción `reordenar` en el store (`PATCH /orden`, aplicar nuevo orden; recargar ante error)

## 4. Frontend — reiniciar

- [x] 4.1 Botón "Reiniciar" en `App`, habilitado solo si `total>=1 && hechas===total` (derivado del progreso)
- [x] 4.2 `DialogoConfirmacion` de reinicio; acción `reiniciar` en el store (`POST /reset`)

## 5. Tests y verificación de cierre

- [x] 5.1 Servicio: reasignación de posiciones; regla de reset (procede / 409)
- [x] 5.2 Rutas (`inject`): `PATCH /orden` 200/400; `POST /reset` 204/409
- [x] 5.3 Componentes: reordenado por teclado (▲/▼) y habilitación del botón Reiniciar; axe sin violaciones AA
- [x] 5.4 e2e: reordenar por teclado (orden persiste) y reiniciar al 100% con confirmación
- [x] 5.5 Criterios bloqueantes de HU-07 y HU-08 verificados
