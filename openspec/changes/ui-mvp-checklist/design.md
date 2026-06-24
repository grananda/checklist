## Context

`foundation` dejó el `client` (Vite + React 18 + Zustand) con `AppShell` mínimo, `tokens.css` y un store de andamiaje. `tareas-api-crud` expone la API REST (`GET/POST/PATCH/DELETE /api/tareas`). Esta fase construye la UI real consumiendo esa API y cierra F1. Capas del cliente (arquitectura §5): `components → store → api`.

Fuente visual: `docs/guia-estilos.md` (componentes §5, tokens §4, pantalla única §7) y criterios de aceptación de HU-01..HU-06 (`docs/detalle-historias-usuario.md`).

## Goals / Non-Goals

**Goals:**
- Pantalla única usable: ver lista, añadir, marcar/desmarcar, editar, borrar (con confirmación) y ver progreso.
- Estado en `useTareasStore`; el progreso es estado derivado con `calcularProgreso` de `shared`.
- Sincronización con el servidor como fuente de verdad; el cliente valida para UX con los validadores de `shared`.
- Accesibilidad WCAG 2.1 AA verificable (axe-core sin violaciones), responsive/móvil, textos en español.
- e2e Playwright del recorrido MVP en verde.

**Non-Goals:**
- Reordenar (HU-07) y reiniciar (HU-08) → Fase 4.
- Tiempo real / suscripción a eventos (HU-09) → Fase 5: en esta fase la coherencia entre clientes es por recarga, no en vivo.
- Cambios en el servidor o en el contrato de la API.

## Decisions

- **Sincronización del store**: las acciones llaman a `api/rest.ts` y aplican al store la `Tarea` devuelta (POST/PATCH) o la quitan (DELETE); `GET` al montar. Sin optimistic update (innecesario sin tiempo real) ni refetch completo redundante. Ver `decisions.md#sincronizacion-store`.
- **Alta y edición en modal** (`FormularioTarea`), coherente con la guía §7 y con `DialogoConfirmacion`. Ver `decisions.md#formulario-alta-edicion`.
- **Validación en cliente para UX**: `FormularioTarea` usa `validarTitulo`/`validarDescripcion` de `shared` para feedback inmediato; el servidor sigue siendo la autoridad (un 400 se muestra como error). No duplica lógica (misma fuente `shared`). Ver `decisions.md#validacion-cliente`.
- **Progreso derivado**: `IndicadorProgreso` lee `useTareasStore.progreso()` (→ `calcularProgreso`), nunca un valor almacenado; `role="progressbar"` con `aria-valuenow/min/max` y texto "X de Y hechas".
- **Accesibilidad por diseño**: modales con `role="dialog"`+`aria-modal`, focus-trap y restauración de foco al cerrar, cierre con Escape, foco inicial en el botón seguro ("Cancelar") del `DialogoConfirmacion`; `aria-live` para altas/borrados; estado "hecha" con icono/tachado además de color.
- **e2e y a11y**: Playwright para el recorrido MVP de extremo a extremo; axe-core en tests de componentes y/o en el e2e para asegurar 0 violaciones AA. Ver `decisions.md#e2e-tooling`.
- **Estructura**: `api/rest.ts`, `store/useTareasStore.ts`, `components/{ListaTareas,ItemTarea,FormularioTarea,IndicadorProgreso,DialogoConfirmacion,EstadoVacio}.tsx`, `App.tsx` compone la pantalla; estilos con los tokens de `tokens.css`.

## Risks / Trade-offs

- **Drag&drop accesible (HU-07)**: NO entra aquí; se evita introducir estructura que dificulte añadirlo en Fase 4 (el orden ya viene por `posicion` desde la API).
- **Sin tiempo real**: dos pestañas no se ven en vivo hasta la Fase 5; aceptado por el faseado. La recarga (`GET`) muestra el estado compartido.
- **Focus-trap propio vs librería**: implementar focus-trap accesible a mano es delicado; alternativa, una librería ligera. Se decide en implementación, priorizando cumplir AA (axe) sobre la forma concreta.
- **Validación duplicada cliente/servidor**: mitigada al reutilizar los validadores de `shared` (una sola regla), no reimplementarlos.
