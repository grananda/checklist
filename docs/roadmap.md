# Roadmap de desarrollo — CheckList

> Documento de Fase 3 (Native AI / AIDD-SDD · AI Lead). Generado por `native-ai roadmap`.
> Fuentes: docs/arquitectura-base.md (insumo principal), docs/detalle-historias-usuario.md, docs/mapa-historias-usuario.md, docs/requisitos.md.
> Fasea el desarrollo en changes OpenSpec acotados. Insumo de `aidd sprint-planning` y de `native-ai open change`.

**Versión:** 1.0 · **Fecha:** 2026-06-24 · **Estado:** 🟢 Aprobado (2026-06-24)

---

## Presupuesto de contexto y complejidad

- **Presupuesto de contexto asumido: `alto`** (>200k tokens útiles). Justificación: el modelo de ejecución previsto (Claude, ventana amplia/1M) admite fases más amplias. **No obstante**, el volumen documental y funcional es pequeño (una sola pantalla, 9 historias, un dominio cohesionado), por lo que **no se empaquetan objetivos no relacionados**: se priorizan límites de change limpios sobre fases máximas. Resultado: 5 fases moderadas en lugar de 3 muy amplias.
- **Complejidad estimada: `media`**. Varias capas y módulos (`shared` + backend por capas + frontend con estado) y una integración interna de tiempo real (WebSocket) con reconexión y last-write-wins. **No** hay migraciones de datos, autenticación/permisos, ni integraciones con terceros (requisitos §5-6), lo que la mantiene por debajo de `alta`.
- **Faseado base heredado del diseño:** F0 (foundation, sin historias), F1 (MVP, HU-01..HU-06, estimaciones S), F2 (mejoras, HU-07 M, HU-08 S, HU-09 L). El roadmap respeta ese faseado y lo descompone en changes abribles con contexto acotado.

## Resumen de fases

| Fase | Nombre | Historias / alcance | Riesgo de contexto |
|---|---|---|---|
| 1 | Foundation (base global) | F0: monorepo, `shared`, DB, scaffolding server/client/realtime, Docker, CI | medio |
| 2 | API REST y dominio de tareas | Backend de HU-01..HU-06 (CRUD + progreso) | bajo |
| 3 | UI del MVP (checklist) | Frontend de HU-01..HU-06 (lista, alta/edición, progreso, borrado) | medio |
| 4 | Reordenación y reinicio | HU-07 (drag&drop accesible) + HU-08 (reset) | medio |
| 5 | Tiempo real | HU-09 (Socket.IO, broadcast, reconexión, LWW) | medio-alto |

> Fases 1-3 entregan el **MVP usable** (F1). Fases 4-5 completan **F2**. El orden es incremental: cada fase deja el producto en estado ejecutable y validable.

---

## Fase 1 — Foundation (base global del proyecto)

- **Objetivo:** establecer la estructura base global ejecutable sobre la que se construye todo lo demás. No entrega funcionalidad de usuario (alineado con la metodología: `foundation` es siempre el primer change y no implementa features).
- **Alcance:**
  - Monorepo `pnpm workspaces` con `client` + `server` + `shared`; `tsconfig.base.json`, `.env.example` (arquitectura-base §3).
  - Paquete `shared`: tipos `Tarea`/`EstadoTarea`, contratos de eventos Socket.IO, constantes/validadores de límites (NFR-12) y validación de título/descripción.
  - `server`: scaffolding Fastify (`app.ts`, `config.ts`, `index.ts`), conexión y esquema SQLite (`db/connection.ts`, `db/schema.ts`), `routes/health.ts`, servir estáticos del client (`static.ts`), **andamiaje** vacío del gateway de tiempo real (`realtime/gateway.ts`, sin eventos de negocio todavía).
  - `client`: scaffolding Vite + React + Zustand, `AppShell` mínimo, `styles/tokens.css` (design tokens de la guía de estilos) y `global.css`.
  - Empaquetado: `docker/Dockerfile` multi-stage + `docker/docker-compose.yml` con volumen del `.db` (D-38); CI básica (build + test).
- **Exclusiones:** ninguna historia de usuario; sin endpoints CRUD; sin broadcast real de eventos; sin lógica de progreso.
- **Dependencias:** ninguna (primera fase). Habilita las fases 2-5.
- **Entregables OpenSpec esperados:** 1 change `foundation` (`proposal.md`, `design.md`, `spec.md` de la capability base, `tasks.md`, `decisions.md`).
- **Criterios de cierre:** el proyecto arranca (`/health` responde), el client se sirve desde el server en mismo origen, `shared` compila y es consumible por ambos, la imagen Docker se construye y el compose levanta con persistencia. Tests de andamiaje en verde.
- **Riesgo de contexto:** medio (toca muchos ficheros, pero de forma superficial y sin reglas de negocio).

## Fase 2 — API REST y dominio de tareas (backend del MVP)

- **Objetivo:** implementar el backend completo del MVP: dominio, persistencia y API REST de las operaciones de F1.
- **Alcance:**
  - `repositories/tareaRepository.ts`: CRUD con sentencias preparadas y transacciones; orden por `posicion`.
  - `services/tareaService.ts`: reglas de HU-02/HU-04 (título obligatorio, límites NFR-12), HU-05 (borrado definitivo), creación con posición determinista al final.
  - `services/progresoService.ts`: cálculo de progreso coherente con lista vacía (HU-06).
  - `routes/tareas.ts`: `GET /api/tareas` (HU-01), `POST` (HU-02), `PATCH /:id` toggle+editar (HU-03/HU-04), `DELETE /:id` (HU-05). Validación de forma en transporte; validación semántica en servicio.
  - Tests de servicio y de rutas (Fastify `inject`).
- **Exclusiones:** nada de frontend; sin reordenación (`PATCH /orden`) ni reset; sin broadcast de eventos (solo persistir y responder).
- **Dependencias:** Fase 1 (`shared`, DB, app Fastify).
- **Entregables OpenSpec esperados:** 1 change (p. ej. `tareas-api-crud`).
- **Criterios de cierre:** los 5 endpoints del MVP responden y persisten en SQLite; validación de límites y título obligatorio probada; progreso correcto incluido el caso lista vacía. Criterios bloqueantes de HU-01/02/03/05/06 verificables vía API.
- **Riesgo de contexto:** bajo (un solo dominio, una capa, contrato ya fijado en `shared`).

## Fase 3 — UI del MVP (checklist usable)

- **Objetivo:** entregar la pantalla única usable de F1 consumiendo la API de la Fase 2; cerrar el MVP.
- **Alcance:**
  - `store/useTareasStore.ts` (Zustand): estado de tareas, progreso derivado, acciones; `api/rest.ts`.
  - Componentes: `ListaTareas`, `ItemTarea` (toggle/editar/borrar), `FormularioTarea` (alta y edición con validación), `IndicadorProgreso` (`role="progressbar"`), `DialogoConfirmacion` (borrado, foco atrapado), `EstadoVacio`.
  - Accesibilidad WCAG 2.1 AA (NFR-05): foco visible, focus-trap en modales, `aria-live`, estado no solo por color; responsive/móvil (NFR-02); textos en español (NFR-03).
  - Tests de componentes (alta/edición/borrado) y e2e Playwright del recorrido MVP.
- **Exclusiones:** drag&drop, botón reiniciar y propagación en tiempo real (fases 4 y 5).
- **Dependencias:** Fase 2 (API REST disponible).
- **Entregables OpenSpec esperados:** 1 change (p. ej. `ui-mvp-checklist`).
- **Criterios de cierre:** una persona abre la web, ve la lista compartida, añade, marca/desmarca, edita, borra (con confirmación) y ve el progreso actualizado; e2e MVP en verde; auditoría de accesibilidad (axe-core) sin violaciones AA. **Cierra F1 (MVP).**
- **Riesgo de contexto:** medio (varios componentes + requisitos de accesibilidad).

## Fase 4 — Reordenación y reinicio (F2 parcial)

- **Objetivo:** añadir la organización de la lista (reordenar) y el cierre de ciclo (reiniciar), backend y frontend.
- **Alcance:**
  - Backend: `PATCH /api/tareas/orden` con transacción de posiciones (HU-07); `POST /api/tareas/reset` con regla "≥1 tarea y todas hechas" (HU-08, D-15) en `tareaService`.
  - Frontend: drag&drop táctil **con alternativa accesible por teclado** (HU-07/NFR-05, mover arriba/abajo); botón Reiniciar habilitado solo al 100% + `DialogoConfirmacion` (HU-08).
  - Tests de reordenación, reglas de habilitación de reset y alternativa accesible.
- **Exclusiones:** propagación en tiempo real de estos cambios (se aborda transversalmente en Fase 5); el orden/persistencia ya existe en el modelo desde F0.
- **Dependencias:** Fase 3 (UI base y store) y Fase 2 (API).
- **Entregables OpenSpec esperados:** 1 change (p. ej. `reordenar-y-reiniciar`). Puede partirse en dos (`reordenar`, `reiniciar`) si el contexto lo aconseja; ver prompts.
- **Criterios de cierre:** se reordena por arrastre y por teclado, el orden persiste y es compartido; Reiniciar solo disponible al 100% y con confirmación; criterios bloqueantes de HU-07/HU-08 verificados.
- **Riesgo de contexto:** medio (drag&drop accesible es la parte delicada).

## Fase 5 — Tiempo real (HU-09)

- **Objetivo:** propagar en tiempo real toda mutación entre clientes conectados, cerrando F2 y el objetivo O-2.
- **Alcance:**
  - Server: `realtime/gateway.ts` emite `tarea:creada|actualizada|borrada|reordenada` y `lista:reset` tras cada mutación (HU-02..HU-08); contratos en `shared/eventos.ts`.
  - Client: `api/socket.ts` (conexión, reconexión), suscripción del store a eventos, re-sincronización al reconectar (`GET /api/tareas`), last-write-wins (NFR-11).
  - Tests de propagación entre dos clientes, reconexión y LWW; verificación de latencia objetivo <1 s (NFR-06).
- **Exclusiones:** ninguna funcional nueva; es la capa transversal que conecta las mutaciones ya existentes. Sin pub/sub multi-instancia (camino de evolución documentado, no implementado, arquitectura-base §12).
- **Dependencias:** todas las anteriores (las mutaciones de fases 2 y 4 deben existir para difundirlas).
- **Entregables OpenSpec esperados:** 1 change (p. ej. `tiempo-real`).
- **Criterios de cierre:** dos personas ven los cambios del otro sin recargar (<1 s); reconexión re-sincroniza el estado; ediciones simultáneas resuelven por LWW sin bloqueo; criterios bloqueantes de HU-09 verificados. **Cierra F2 y el alcance completo.**
- **Riesgo de contexto:** medio-alto (atraviesa todas las acciones; reconexión y concurrencia exigen cuidado).

---

## Mapa de dependencias

```
Fase 1 (Foundation)
  └─> Fase 2 (API REST)
        └─> Fase 3 (UI MVP) ── cierra F1 ──┐
              └─> Fase 4 (Reordenar/Reiniciar)
                    └─> Fase 5 (Tiempo real) ── cierra F2
```

Orden de ejecución recomendado: **1 → 2 → 3 → 4 → 5**, estrictamente secuencial por dependencias. El MVP (valor entregable) está disponible al cerrar la Fase 3.

## Riesgos de contexto y notas para la ejecución

- **Fase 1** abre muchos ficheros: mantener cada uno mínimo (scaffolding), sin adelantar lógica de negocio de fases posteriores.
- **Fase 5** es la de mayor riesgo: no mezclar su contexto con el de fases previas; abrirla solo cuando las mutaciones a difundir ya existan y estén probadas.
- **Fase 4** puede dividirse en dos changes si el drag&drop accesible (HU-07) resulta voluminoso; ver `docs/prompts-roadmap-native-ai.md`.
- Prototipo validado por el cliente el 2026-06-24 (arquitectura-base §13): alcance de F1/F2 confirmado, sin gate de validación pendiente.

## Siguientes pasos

1. Aprobar este roadmap (equipo técnico).
2. `aidd sprint-planning` puede ya consumir `docs/roadmap.md` + `docs/planificacion-proyecto.md` para producir `docs/sprint-plan.md`.
3. Iniciar ejecución con `native-ai open change foundation` siguiendo `docs/prompts-roadmap-native-ai.md`.
