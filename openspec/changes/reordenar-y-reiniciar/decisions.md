# Decisiones del pre-flight — reordenar-y-reiniciar

> Pre-flight de apertura (`native-ai open change reordenar-y-reiniciar`). Skill `native-ai-specs` v1.4.0.
> El usuario pidió no ser interrumpido; las preferencias se resuelven con el default recomendado
> y quedan marcadas como `auto-default` para revisión posterior.

## division-del-change

- **Fecha**: 2026-06-24
- **Tipo**: preferencia
- **Origen**: auto-default
- **Contexto**: roadmap Fase 4 permite dividir en `reordenar` y `reiniciar` si el drag&drop resulta voluminoso.
- **Pregunta**: ¿Un único change o dos?
- **Opciones evaluadas**:
  - a) Un change `reordenar-y-reiniciar`
  - b) Dos changes (`reordenar`, `reiniciar`)
- **Decision**: a) un único change
- **Justificación**: HU-08 es pequeña (S) y HU-07 (M) es abarcable; ambas comparten el dominio de orden/estado. Se mantiene cohesionado salvo que la implementación del drag&drop crezca demasiado.

## libreria-drag-and-drop

- **Fecha**: 2026-06-24
- **Tipo**: preferencia
- **Origen**: auto-default
- **Contexto**: HU-07 exige arrastre con **soporte táctil** y **alternativa accesible por teclado** (NFR-05).
- **Pregunta**: ¿Cómo implementar el drag&drop accesible?
- **Opciones evaluadas**:
  - a) `@dnd-kit/core` + `@dnd-kit/sortable` (teclado y táctil nativos, accesible)
  - b) HTML5 Drag and Drop nativo
  - c) Pointer events a mano
- **Decision**: a) @dnd-kit
- **Justificación**: Soporte de teclado y táctil integrado y accesible; evita reimplementar interacción delicada. **Además**, controles explícitos "mover arriba/abajo" como alternativa por teclado garantizada (no solo el sensor de teclado de la librería).

## contrato-reordenar

- **Fecha**: 2026-06-24
- **Tipo**: preferencia
- **Origen**: auto-default
- **Contexto**: arquitectura §8 (`posicion` entera); §9 (`PATCH /api/tareas/orden`).
- **Pregunta**: ¿Payload del reordenado?
- **Opciones evaluadas**:
  - a) `{ orden: string[] }` (ids en el nuevo orden); el servidor reasigna `posicion` 0..n-1 en transacción
  - b) Lista de `{ id, posicion }`
- **Decision**: a) array de ids ordenado
- **Justificación**: Más simple y robusto; el servidor es la autoridad del valor de `posicion` y evita inconsistencias enviadas por el cliente.

## contrato-reset

- **Fecha**: 2026-06-24
- **Tipo**: confirmacion
- **Origen**: auto-default
- **Contexto**: HU-08 / D-15 (reinicio solo si ≥1 tarea y todas hechas).
- **Pregunta**: ¿Comportamiento de `POST /api/tareas/reset`?
- **Opciones evaluadas**:
  - a) Validar en servicio (≥1 y todas hechas) → transacción que vacía la tabla → `204`; si no se cumple, `409`
  - b) Borrado sin validación
- **Decision**: a) validación en servicio + `204`; `409` si no procede
- **Justificación**: La regla de habilitación es de dominio; el cliente deshabilita el botón, pero el servidor también la hace cumplir (defensa en profundidad).
