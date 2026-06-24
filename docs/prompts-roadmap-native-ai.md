# Prompts de ejecución del roadmap — CheckList

> Documento de Fase 3 (Native AI / AIDD-SDD · AI Lead). Generado por `native-ai roadmap`.
> Acompaña a `docs/roadmap.md`. Contiene los prompts a ejecutar, fase a fase, hasta finalizar el desarrollo, **usando exclusivamente** los comandos del skill `native-ai-specs`.

## Cómo usar este documento

- Ejecuta las fases **en orden** (1 → 5). No abras una fase hasta cerrar la anterior.
- Por cada fase: primero `native-ai open change`, luego `native-ai implement change`, luego `native-ai close change`.
- Cada prompt indica **qué contexto pasar** y **qué NO incluir todavía**, para no contaminar la ventana con información de fases futuras.
- Tras cada `open change`, el skill ejecuta un **pre-flight de dudas** (máx. 7 preguntas) y guarda las decisiones en `openspec/changes/<change>/decisions.md`.
- Reglas comunes a todas las fases (no repetir en cada prompt): stack y capas según `docs/arquitectura-base.md` (§2 decisiones, §5 capas `transport → service → repository → db`); contrato de tipos en `shared`; español (NFR-03); accesibilidad WCAG 2.1 AA (NFR-05); validación en servidor de límites NFR-12.

---

## Fase 1 — Foundation

**Documentos a pasar al modelo:** `docs/arquitectura-base.md` §3 (árbol de carpetas), §4-5 (módulos y capas), §8 (modelo `Tarea`), §11-12 (despliegue, Docker); `docs/mapa-historias-usuario.md` §F0 (habilitadores técnicos).
**Código relevante:** ninguno todavía (proyecto greenfield).
**No incluir aún:** criterios de aceptación de HU-01..HU-09, lógica de progreso, eventos de tiempo real con payload de negocio, drag&drop. Solo andamiaje.
**División:** un único change `foundation`.

- **Abrir:**
  ```
  native-ai open change foundation
  ```
  > Crea el change `foundation`: estructura base global del monorepo CheckList (`pnpm workspaces` con `client`, `server`, `shared`), paquete `shared` con tipos `Tarea`/`EstadoTarea`, contratos de eventos y validadores de límites (NFR-12); scaffolding de Fastify (app, config, `/health`, servir estáticos), conexión y esquema SQLite, y andamiaje vacío del gateway de tiempo real; scaffolding de Vite + React + Zustand con `AppShell` mínimo y `tokens.css`; `Dockerfile` multi-stage + `docker-compose.yml` con volumen del `.db`; CI de build y test. Sin funcionalidad de usuario ni endpoints CRUD. Basado en `docs/arquitectura-base.md` §3-5, §8, §11-12.

- **Implementar:**
  ```
  native-ai implement change foundation
  ```
  > Aplica las instrucciones del change `foundation`. El proyecto debe arrancar (`/health` responde), `shared` compila y lo consumen client y server, el server sirve el build del client en mismo origen, la imagen Docker se construye y el compose levanta con persistencia del `.db`.

- **Cerrar:**
  ```
  native-ai close change foundation
  ```

---

## Fase 2 — API REST y dominio de tareas

**Documentos a pasar al modelo:** `docs/detalle-historias-usuario.md` HU-01, HU-02, HU-03, HU-04, HU-05, HU-06; `docs/arquitectura-base.md` §4-5 (servicio/repositorio), §7 (flujo de mutación), §9 (endpoints REST); `docs/requisitos.md` §7 (variables y límites).
**Código relevante:** `shared/` (tipos y validadores ya creados en Fase 1), `server/app.ts`, `server/db/*`.
**No incluir aún:** `client/` y componentes UI; `PATCH /orden` y `POST /reset` (Fase 4); broadcast de eventos por Socket.IO (Fase 5).
**División:** un único change `tareas-api-crud`.

- **Abrir:**
  ```
  native-ai open change tareas-api-crud
  ```
  > Crea el change `tareas-api-crud`: backend del MVP. `tareaRepository` (CRUD con sentencias preparadas y transacciones), `tareaService` (título obligatorio y límites NFR-12, borrado definitivo, posición determinista al final), `progresoService` (progreso coherente con lista vacía, HU-06) y `routes/tareas.ts` con `GET /api/tareas`, `POST /api/tareas`, `PATCH /api/tareas/:id` (toggle HU-03 y editar HU-04), `DELETE /api/tareas/:id`. Validación de forma en transporte, semántica en servicio. Tests de servicio y de rutas con `inject`. Solo backend; sin reordenar, reset ni tiempo real. Basado en `docs/detalle-historias-usuario.md` (HU-01..HU-06) y `docs/arquitectura-base.md` §5, §7, §9.

- **Implementar:**
  ```
  native-ai implement change tareas-api-crud
  ```
  > Aplica las instrucciones del change `tareas-api-crud`. Los 5 endpoints del MVP deben responder y persistir en SQLite; validación de límites y título obligatorio cubierta por tests; progreso correcto incluido el caso de lista vacía.

- **Cerrar:**
  ```
  native-ai close change tareas-api-crud
  ```

---

## Fase 3 — UI del MVP (checklist usable)

**Documentos a pasar al modelo:** `docs/detalle-historias-usuario.md` HU-01..HU-06 (criterios de aceptación); `docs/guia-estilos.md` (componentes, tokens, accesibilidad); `docs/arquitectura-base.md` §6 (componentes React) y §6/§9 (modales, pantalla única).
**Código relevante:** `client/` scaffolding (Fase 1), `api/rest.ts`, contrato `shared`, endpoints REST de la Fase 2.
**No incluir aún:** drag&drop y botón Reiniciar (Fase 4); suscripción a eventos de tiempo real (Fase 5).
**División:** un único change `ui-mvp-checklist`.

- **Abrir:**
  ```
  native-ai open change ui-mvp-checklist
  ```
  > Crea el change `ui-mvp-checklist`: pantalla única del MVP. Store Zustand (`useTareasStore`) con tareas y progreso derivado; `api/rest.ts`; componentes `ListaTareas`, `ItemTarea` (marcar/desmarcar, editar, borrar), `FormularioTarea` (alta y edición con validación), `IndicadorProgreso` (`role="progressbar"`), `DialogoConfirmacion` (borrado con foco atrapado) y `EstadoVacio`. Accesibilidad WCAG 2.1 AA (foco visible, focus-trap, `aria-live`, estado no solo por color), responsive/móvil y textos en español. Tests de componentes y e2e Playwright del recorrido MVP. Consume la API de `tareas-api-crud`. Sin reordenar, reiniciar ni tiempo real. Basado en `docs/detalle-historias-usuario.md` (HU-01..HU-06), `docs/guia-estilos.md` y `docs/arquitectura-base.md` §6.

- **Implementar:**
  ```
  native-ai implement change ui-mvp-checklist
  ```
  > Aplica las instrucciones del change `ui-mvp-checklist`. Una persona debe poder abrir la web, ver la lista, añadir, marcar/desmarcar, editar, borrar con confirmación y ver el progreso; e2e MVP en verde; axe-core sin violaciones AA. Cierra el MVP (F1).

- **Cerrar:**
  ```
  native-ai close change ui-mvp-checklist
  ```

---

## Fase 4 — Reordenación y reinicio

**Documentos a pasar al modelo:** `docs/detalle-historias-usuario.md` HU-07 y HU-08; `docs/arquitectura-base.md` §7 (flujos reordenar/reinicio), §8 (`posicion`); `docs/requisitos.md` D-3/D-4.
**Código relevante:** `tareaRepository`/`tareaService` (Fase 2), store y componentes UI (Fase 3).
**No incluir aún:** propagación en tiempo real de estos cambios (Fase 5).
**División:** un change `reordenar-y-reiniciar`. **Divide en dos** (`reordenar` y `reiniciar`) si el drag&drop accesible de HU-07 resulta voluminoso o si quieres validar la alternativa por teclado por separado.

- **Abrir:**
  ```
  native-ai open change reordenar-y-reiniciar
  ```
  > Crea el change `reordenar-y-reiniciar`. Backend: `PATCH /api/tareas/orden` (transacción de posiciones, HU-07) y `POST /api/tareas/reset` (regla "≥1 tarea y todas hechas", D-15, HU-08). Frontend: reordenación por arrastre con soporte táctil **y alternativa accesible por teclado** (mover arriba/abajo, NFR-05); botón Reiniciar habilitado solo al 100% con `DialogoConfirmacion`. Tests de reordenación, reglas de habilitación de reset y alternativa accesible. Basado en `docs/detalle-historias-usuario.md` HU-07/HU-08 y `docs/arquitectura-base.md` §7-8.

- **Implementar:**
  ```
  native-ai implement change reordenar-y-reiniciar
  ```
  > Aplica las instrucciones del change. Se reordena por arrastre y por teclado, el orden persiste y es compartido; Reiniciar solo disponible al 100% y con confirmación; criterios bloqueantes de HU-07 y HU-08 verificados.

- **Cerrar:**
  ```
  native-ai close change reordenar-y-reiniciar
  ```

---

## Fase 5 — Tiempo real

**Documentos a pasar al modelo:** `docs/detalle-historias-usuario.md` HU-09; `docs/arquitectura-base.md` §7 (mutación + difusión, reconexión), §8 (concurrencia LWW), §9 (eventos Socket.IO); `docs/requisitos.md` NFR-06, NFR-11.
**Código relevante:** `realtime/gateway.ts` (andamiaje de Fase 1), todas las rutas de mutación (Fases 2 y 4), store del cliente y `api/socket.ts`, contratos en `shared/eventos.ts`.
**No incluir aún:** nada nuevo funcional; no introducir pub/sub multi-instancia (camino de evolución documentado, no implementado).
**División:** un único change `tiempo-real`.

- **Abrir:**
  ```
  native-ai open change tiempo-real
  ```
  > Crea el change `tiempo-real`: HU-09. Server: el gateway Socket.IO emite `tarea:creada|actualizada|borrada|reordenada` y `lista:reset` tras cada mutación (HU-02..HU-08), con contratos en `shared/eventos.ts`. Client: `api/socket.ts` (conexión y reconexión), suscripción del store a los eventos, re-sincronización al reconectar (`GET /api/tareas`) y last-write-wins (NFR-11). Tests de propagación entre dos clientes, reconexión y LWW; objetivo de latencia <1 s (NFR-06). Capa transversal sobre mutaciones ya existentes. Basado en `docs/detalle-historias-usuario.md` HU-09 y `docs/arquitectura-base.md` §7-9.

- **Implementar:**
  ```
  native-ai implement change tiempo-real
  ```
  > Aplica las instrucciones del change `tiempo-real`. Dos personas ven los cambios del otro sin recargar (<1 s); la reconexión re-sincroniza el estado; ediciones simultáneas resuelven por LWW sin bloqueo. Cierra F2 y el alcance completo del producto.

- **Cerrar:**
  ```
  native-ai close change tiempo-real
  ```

---

## Resumen de la secuencia

```
native-ai open change foundation            → implement → close
native-ai open change tareas-api-crud        → implement → close
native-ai open change ui-mvp-checklist       → implement → close   (cierra F1 / MVP)
native-ai open change reordenar-y-reiniciar  → implement → close
native-ai open change tiempo-real            → implement → close   (cierra F2)
```

> Tras cerrar `ui-mvp-checklist` tienes un MVP entregable y validable con el cliente. Si esa validación introduce cambios, vuelve a `native-ai roadmap` antes de continuar con las fases 4-5.
