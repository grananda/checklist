## Why

Existe el backend del MVP (`tareas-api-crud`) pero no hay interfaz: el `client` solo tiene el `AppShell` mínimo de `foundation`. La Fase 3 entrega la **pantalla única usable** del MVP (HU-01..HU-06) consumiendo la API REST, y **cierra F1** (producto entregable y validable con cliente).

## What Changes

- **`store/useTareasStore.ts`** (Zustand): estado de `tareas`, progreso derivado (`calcularProgreso` de `@checklist/shared`) y acciones (`cargar`, `crear`, `cambiarEstado`, `editar`, `borrar`) que sincronizan con el servidor aplicando la respuesta al store.
- **`api/rest.ts`**: cliente REST tipado (`GET/POST/PATCH/DELETE /api/tareas`) usando los tipos de `shared`.
- **Componentes** (guía de estilos §5, arquitectura §6):
  - `ListaTareas` — `<ul>` de `ItemTarea`; muestra `EstadoVacio` si no hay tareas.
  - `ItemTarea` — checkbox de estado (1 toque, HU-03), título, descripción, acciones editar/borrar.
  - `FormularioTarea` — modal de alta y edición con validación (reutiliza `validarTitulo`/`validarDescripcion` de `shared`); foco atrapado.
  - `IndicadorProgreso` — `role="progressbar"` + "X de Y hechas" + %.
  - `DialogoConfirmacion` — modal de confirmación de borrado (foco atrapado, Escape).
  - `EstadoVacio` — invita a crear la primera tarea.
- **Accesibilidad WCAG 2.1 AA** (NFR-05): foco visible, focus-trap y restauración en modales, `aria-live` para cambios, estado "hecha" no solo por color; responsive/móvil (NFR-02); textos en español (NFR-03).
- **Tests**: de componentes (Vitest + Testing Library + axe-core para a11y) y **e2e Playwright** del recorrido MVP (alta → marcar → editar → borrar con confirmación → progreso).

**Fuera de alcance**: drag&drop / reordenar (HU-07) y botón Reiniciar (HU-08) → Fase 4; suscripción a eventos de tiempo real (HU-09) → Fase 5.

## Capabilities

### New Capabilities
- `ui-checklist`: la pantalla única del MVP (lista, alta/edición en modal, marcar/desmarcar, borrado con confirmación, progreso y estado vacío) accesible (WCAG 2.1 AA), responsive y en español, sincronizada con la API REST.

### Modified Capabilities
<!-- Ninguna modificación de requisitos de specs existentes. Se apoya en web-shell (foundation) y consume tareas-api, sin alterar sus requisitos. -->

## Impact

- **Código**: nuevos ficheros en `client/src/components/`, `client/src/api/rest.ts`, y se completa `client/src/store/useTareasStore.ts` (foundation lo dejó como andamiaje). `App.tsx` compone la pantalla real.
- **Dependencias**: añade `@playwright/test` (e2e) y axe (`@axe-core/playwright` y/o `vitest-axe`) como devDependencies del `client`/raíz; reutiliza React, Zustand y `@checklist/shared` ya presentes.
- **Contrato**: consume la API de `tareas-api` sin cambios de servidor.
- **Cierra F1 (MVP)**. Habilita la validación con cliente y las fases 4-5.
