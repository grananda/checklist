## 1. Capa de datos del cliente

- [ ] 1.1 `client/src/api/rest.ts`: cliente REST tipado (`listar`, `crear`, `actualizar`, `borrar`) con los tipos de `@checklist/shared`; manejo de errores (400/404) con mensaje en español
- [ ] 1.2 `client/src/store/useTareasStore.ts`: completar acciones (`cargar`, `crear`, `cambiarEstado`, `editar`, `borrar`) que aplican la respuesta del servidor al store; progreso derivado con `calcularProgreso`

## 2. Componentes de UI

- [ ] 2.1 `IndicadorProgreso` — `role="progressbar"` + "X de Y hechas" + % (HU-06)
- [ ] 2.2 `ListaTareas` + `EstadoVacio` — render de la lista u onboarding vacío (HU-01)
- [ ] 2.3 `ItemTarea` — checkbox de estado (1 toque), título, descripción, acciones editar/borrar (HU-03)
- [ ] 2.4 `FormularioTarea` — modal de alta y edición con validación (`shared`), focus-trap (HU-02/HU-04)
- [ ] 2.5 `DialogoConfirmacion` — modal de confirmación de borrado, foco atrapado, Escape, foco inicial en Cancelar (HU-05)
- [ ] 2.6 `App.tsx` compone la pantalla (AppShell + IndicadorProgreso + ListaTareas + acción añadir); estilos con `tokens.css`

## 3. Accesibilidad y responsive

- [ ] 3.1 Foco visible, focus-trap y restauración en modales, cierre con Escape, `aria-live` para cambios, estado no solo por color
- [ ] 3.2 Responsive/móvil (una columna, áreas táctiles ≥44px) y textos en español

## 4. Tests

- [ ] 4.1 Tests de componentes (Vitest + Testing Library): alta, edición, borrado con confirmación, toggle, progreso, estado vacío
- [ ] 4.2 Auditoría axe-core (sin violaciones AA) en estados con/sin tareas y con modal abierto
- [ ] 4.3 e2e Playwright del recorrido MVP (abrir → añadir → marcar → editar → borrar → progreso) contra el server real

## 5. Verificación de cierre (cierra F1)

- [ ] 5.1 Una persona abre la web, ve la lista, añade, marca/desmarca, edita, borra con confirmación y ve el progreso
- [ ] 5.2 e2e MVP en verde; axe-core sin violaciones AA
- [ ] 5.3 Operable por teclado; responsive en móvil; textos en español
