## Context

F1 está cerrado: existe la API CRUD (`tareas-api`) y la UI (`ui-checklist`). El modelo `Tarea` tiene `posicion` (entera) desde `foundation` y el repositorio ya ordena por `posicion`. Esta fase añade editar ese orden (HU-07) y reiniciar la lista (HU-08), backend y frontend, sin tiempo real.

Referencias: `detalle-historias-usuario.md` HU-07/HU-08; `arquitectura-base.md` §7 (flujos reordenar/reinicio), §8 (`posicion`, concurrencia LWW), §9 (endpoints).

## Goals / Non-Goals

**Goals:**
- Reordenar persistente y compartido vía `PATCH /api/tareas/orden` (transacción de posiciones).
- Reinicio que vacía la lista solo si hay ≥1 tarea y todas están hechas (`POST /api/tareas/reset`, D-15), validado en servidor.
- UI de arrastre con soporte táctil **y** alternativa accesible por teclado (mover arriba/abajo).
- Botón Reiniciar habilitado solo al 100% + confirmación previa.
- Tests de servicio, rutas, componentes (incl. teclado) y e2e.

**Non-Goals:**
- Difusión en tiempo real de `reordenada`/`reset` (Fase 5).
- Cambios de modelo de datos (la `posicion` ya existe).
- Reordenado multi-criterio o agrupaciones (fuera de alcance).

## Decisions

- **Contrato de reordenado**: `PATCH /api/tareas/orden` con `{ orden: string[] }` (ids en el nuevo orden). El servidor valida que el conjunto coincide con las tareas existentes y reasigna `posicion = índice` en una transacción. El cliente no envía valores de `posicion`. Ver `decisions.md#contrato-reordenar`.
- **Contrato de reset**: `POST /api/tareas/reset`. `tareaService` comprueba "≥1 tarea y todas hechas"; si se cumple, transacción que borra todas y responde `204`; si no, `DomainError 409`. El cliente deshabilita el botón, pero el servidor también lo hace cumplir. Ver `decisions.md#contrato-reset`.
- **Drag&drop accesible**: `@dnd-kit/core` + `@dnd-kit/sortable` (sensores de puntero/táctil y teclado). **Además**, controles explícitos "▲/▼ mover" en cada item como alternativa por teclado garantizada y descubrible (NFR-05), no dependiente solo del sensor de teclado. Ver `decisions.md#libreria-drag-and-drop`.
- **Sincronización**: tras reordenar o reiniciar, el store aplica el nuevo estado devuelto/recargado (coherente con la decisión de F1). Reordenado: aplicar el nuevo orden local y persistir; ante error, recargar (`GET`).
- **Habilitación del botón Reiniciar**: derivada del progreso (`total >= 1 && hechas === total`). Reutiliza el progreso ya derivado en el store.
- **Un único change** (reordenar + reiniciar), con opción de dividir si el drag&drop crece. Ver `decisions.md#division-del-change`.

## Risks / Trade-offs

- **Drag&drop accesible es la parte delicada** (riesgo de la fase, roadmap): la accesibilidad por teclado no debe ser un parche. Mitigación: controles ▲/▼ de primera clase + tests específicos de teclado, además del sensor de @dnd-kit.
- **Concurrencia (LWW, NFR-11)**: dos reordenados simultáneos → última escritura gana; sin bloqueo. Aceptado a esta escala; en tiempo real (Fase 5) se reconciliará por evento.
- **Reset es destructivo y masivo**: doble protección (regla de dominio en servidor + confirmación en UI) y `409` si no procede.
- **Coste de @dnd-kit**: nueva dependencia de frontend; se acota a la lista. Alternativa nativa descartada por peor accesibilidad/táctil.
