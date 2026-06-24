# Plan de sprints — CheckList

> Documento de Planificación de entrega (AIDD · Fase 3.5 · paso 3.5.2). Generado por `aidd sprint-planning`.
> Fuentes: docs/roadmap.md, docs/planificacion-proyecto.md, docs/detalle-historias-usuario.md.
> Respeta el faseado por contexto del roadmap (no parte ningún change). **Pendiente de aprobación humana.**

**Versión:** 1.1 · **Fecha:** 2026-06-24 · **Estado:** 🟡 Pendiente de aprobación

> **Nota de versión (1.1):** redimensionado tras revisión. Las estimaciones S/M/L del detalle de historias son **días-persona de desarrollo humano clásico**; con la velocity **acelerada por IA** (D-S2) el esfuerzo real se comprime a **~6-8 días-persona** para todo el alcance. Se corrige de 4 sprints de 2 semanas a **2 sprints de 1 semana** (D-S6). El número de ciclos (2) lo determina el **gate de validación con el cliente**, no la carga; la duración (1 semana) sí deriva de la carga real.

---

## 1. Parámetros de planificación

| Parámetro | Valor | Origen |
|---|---|---|
| Duración de sprint | **1 semana** (5 días laborables) | Usuario (D-S6, revisa D-S1) |
| Fecha de inicio (Sprint 1) | **Lunes 2026-06-29** | Usuario (D-S4) |
| Velocity asumida | **Acelerada por IA** — la IA genera el grueso; el limitante es la **revisión/validación humana** (R-3), no el tecleo | Usuario (D-S2) |
| Carga total estimada | **~6-8 días-persona** de trabajo humano efectivo (dirigir + revisar + validar) | Revisión 1.1 |
| Capacidad por sprint | Equipo del plan de recursos (2 devs full + Arquitecto/QA parciales + IA). **Para esta carga bastan 1-2 perfiles + IA** (ver R-S6 / R-5) | planificacion-proyecto.md §2 |
| Unidad de planificación | El **change del roadmap** (no se parte entre sprints) | roadmap.md |

> Sin velocity histórica: la velocity acelerada es un **supuesto** (S-S1). El Sprint 1 sirve de calibración real.

### ¿Por qué 2 sprints de 1 semana y no otra cosa?

- **Duración = 1 semana:** la cadena de trabajo es **estrictamente secuencial** (foundation→api→ui→reordenar→tiempo-real) y cada bloque (MVP, F2) supone ~3-4 días de calendario aun con solape parcial front/back. Una semana laboral los cubre con holgura de revisión; dos semanas dejarían ~50% de capacidad ociosa.
- **Número de ciclos = 2:** lo impone el **gate de validación con el cliente** entre F1 y F2 (D-S3), que obliga a cerrar y entregar el MVP antes de abrir F2 e introduce tiempo externo. **Sin ese gate, todo el alcance sería un único sprint de ~2 semanas.**

## 2. Unidades de trabajo

Las 5 unidades provienen del roadmap (orden estricto por dependencias). Estimación real = trabajo humano efectivo con IA generando (entre paréntesis, el bruto humano clásico de referencia).

| # | Change | Fase | Cubre | Estimación real (bruto) | Perfil principal | Riesgo ctx |
|---|---|---|---|---|---|---|
| 1 | `foundation` | F0 | Monorepo, `shared`, DB, scaffolding, Docker, CI | ~0,5-1 d (3-5 d) | Back-leaning | medio |
| 2 | `tareas-api-crud` | F1 | Backend HU-01..06 (CRUD + progreso) | ~1 d (5-7 d) | Back-leaning | bajo |
| 3 | `ui-mvp-checklist` | F1 | Frontend HU-01..06 → **cierra MVP** | ~1,5-2 d (6-8 d) | Front-leaning | medio |
| 4 | `reordenar-y-reiniciar` | F2 | HU-07 (M) + HU-08 (S) | ~1 d (5-7 d) | Front + Back | medio |
| 5 | `tiempo-real` | F2 | HU-09 (L) | ~1,5-2 d (5-10 d) | Back-leaning | medio-alto |

> La estimación real comprime el bruto porque la IA ejecuta la implementación; lo no comprimible (revisión de PR, validación de criterios bloqueantes, e2e, accesibilidad) es lo que domina cada cifra.

## 3. Mapa de dependencias y prerequisitos

```
foundation (1)
  └─> tareas-api-crud (2)
        └─> ui-mvp-checklist (3) ──[GATE: validación MVP con cliente]──┐
              └─> reordenar-y-reiniciar (4)
                    └─> tiempo-real (5)
```

- **Dependencias entre changes (estrictas):** 1 → 2 → 3 → 4 → 5. Ninguna unidad se programa antes que su prerequisito.
- **Prerequisitos de recursos** (planificacion-proyecto.md §6, **[BLOQUEANTE]** antes del Sprint 1): repositorio Git + runner CI; host/VM interno con Docker; **acceso/licencia a Claude Code** (recurso central); al menos un perfil back y uno front disponibles (el arquitecto/QA pueden ser parciales o la misma persona dada la carga).
- **[BLOQUEANTE de negocio] S-1:** la validación del prototipo con el cliente está pendiente (arquitectura-base §13). Se canaliza en el **gate de validación del MVP** entre Sprint 1 y Sprint 2: F2 **no arranca** si la validación cambia el alcance.
- Dependencia técnica interna: HU-09 (`tiempo-real`) difunde las mutaciones de los changes 2 y 4, que deben existir y estar probadas antes (por eso es la última fase).

## 4. Distribución en sprints

### Sprint 1 — MVP completo (F0 + F1) · 2026-06-29 → 2026-07-03
- **Objetivo:** entregar el MVP usable de extremo a extremo: una persona abre la web, gestiona la lista y ve el progreso.
- **Unidades:** `foundation` (1) + `tareas-api-crud` (2) + `ui-mvp-checklist` (3).
- **Carga vs capacidad:** ~3-4 días-persona reales contra una semana de trabajo de 1-2 perfiles + IA → **dentro de capacidad con holgura** para accesibilidad y e2e.
- **Asignación:** Back-leaning encadena `foundation` → `tareas-api-crud`; Front-leaning solapa el scaffolding de UI durante `foundation` y lidera `ui-mvp-checklist` en cuanto la API responde; QA prepara y ejecuta e2e + axe-core al cierre; Arquitecto revisa capas y contrato `shared`.
- **DoD:** `/health` responde; los 5 endpoints del MVP persisten en SQLite con límites (NFR-12) y progreso correcto (incl. lista vacía); UI permite añadir, marcar/desmarcar, editar y borrar (con confirmación) y ver progreso; e2e MVP en verde; axe-core sin violaciones AA; Docker/compose levanta con persistencia. **🏁 Hito: MVP (F1) listo.**

### 🏁 GATE — Validación del MVP con el cliente · semana del 2026-07-06
- Entre Sprint 1 y Sprint 2. Resuelve el supuesto bloqueante **S-1**. Tiempo **externo** (depende del cliente). Si introduce cambios funcionales, **volver a `aidd requirements`/`native-ai roadmap`** antes de abrir F2; el Sprint 2 queda condicionado a este resultado y su fecha de arranque depende del gate.

### Sprint 2 — F2 completo (reordenar/reiniciar + tiempo real) · nominal 2026-07-13 → 2026-07-17
- **Objetivo:** completar la organización de la lista y la colaboración en tiempo real; cerrar el alcance.
- **Unidades:** `reordenar-y-reiniciar` (4) + `tiempo-real` (5).
- **Carga vs capacidad:** ~2,5-3 días-persona reales → **dentro de capacidad**, con margen para la parte delicada (alternativa accesible al drag&drop R-1; reconexión/LWW de tiempo real).
- **Asignación:** Front-leaning lidera drag&drop táctil + alternativa por teclado (HU-07) y el cliente socket; Back-leaning implementa `PATCH /orden`, `POST /reset` y el gateway Socket.IO (HU-08, HU-09); QA valida reordenación, reglas de reset, alternativa accesible, propagación entre dos clientes, reconexión y LWW.
- **DoD:** reordenar por arrastre y teclado con orden persistente y compartido; Reiniciar solo al 100% con confirmación; dos personas ven los cambios del otro sin recargar (<1 s, NFR-06); reconexión re-sincroniza; ediciones simultáneas por LWW sin bloqueo (NFR-11); criterios bloqueantes de HU-07/08/09 verificados. **🏁 Hito: alcance completo (F2).**
- **Nota:** si el drag&drop accesible (HU-07) o el tiempo real (HU-09) se complican más de lo previsto, dividir el sprint moviendo `tiempo-real` a un Sprint 3 de 1 semana (ver R-S4/R-S5).

## 5. Hitos y entregables

| Hito | Cuándo (nominal) | Entregable / validación |
|---|---|---|
| **MVP (F1) usable** | Fin Sprint 1 · 2026-07-03 | App usable de extremo a extremo; demo |
| **Validación con cliente** | semana del 2026-07-06 | Confirmación de requisitos (resuelve S-1); gate de F2 |
| **Alcance completo (F2)** | Fin Sprint 2 · ~2026-07-17 | Reordenar/reiniciar + tiempo real; producto completo |

> Ruta crítica: **~3 semanas de calendario** incluyendo el gate externo (2 semanas de trabajo + el tiempo de validación del cliente). El **valor entregable** llega ya al fin del Sprint 1 (MVP).

## 6. Riesgos de planificación y supuestos

**Riesgos:**
- **R-S1 — Velocity sin histórico:** la aceleración por IA es estimada; el Sprint 1 puede desviarse. Mitigación: usar Sprint 1 como calibración y reajustar el Sprint 2.
- **R-S2 — Cuello de botella en revisión/validación (hereda R-3):** con IA central, el límite es revisar y validar, no producir. Un Sprint 1 que concentra todo el MVP carga mucho la validación (e2e + accesibilidad) en pocos días. Mitigación: QA implicado desde el inicio del sprint, no solo al cierre.
- **R-S3 — Gate de validación (S-1):** si la validación del MVP cambia el alcance, el Sprint 2 se reprograma. Mitigación: el gate está explícito y bloquea F2.
- **R-S4 — Complejidad real de HU-07/HU-09:** drag&drop accesible y tiempo real (reconexión/LWW) son lo más delicado; si desbordan, el Sprint 2 no cierra en una semana. Mitigación: partir el Sprint 2 y llevar `tiempo-real` a un Sprint 3.
- **R-S5 — Cadena secuencial:** al ser todo dependiente en cadena, un retraso temprano (p. ej. `foundation`) se propaga; 2 devs no paralelizan una cadena. Mitigación: maximizar el solape front/back posible dentro de cada sprint.
- **R-S6 — Sobredimensionamiento de equipo (hereda R-5):** ~6-8 días-persona de carga no justifican 3-4 personas; 1-2 perfiles + IA bastan. Si se mantiene el equipo de 4, habrá capacidad ociosa. Revisar en la aprobación.

**Supuestos:**
- **S-S1:** velocity acelerada por IA sin histórico (se recalibra tras Sprint 1).
- **S-S2:** los prerequisitos de recursos (§3) están listos antes del 2026-06-29; si no, el inicio se desplaza.
- **S-S3:** la fecha del Sprint 2 (2026-07-13) asume ~1 semana de validación del cliente; si el gate se acorta/alarga, se ajusta.
- **S-S4 [BLOQUEANTE de negocio]:** se asume estabilidad de requisitos hasta la validación del MVP (S-1 del plan de recursos).
- **S-S5:** fechas nominales en días laborables, sin contemplar festivos ni vacaciones del equipo.

## 7. Decisiones tomadas

| ID | Pregunta | Opciones | Decisión | Origen | Justificación |
|---|---|---|---|---|---|
| D-S1 | Duración del sprint (inicial) | 1 semana / 2 semanas | ~~2 semanas~~ → revisada por D-S6 | Usuario | Elección previa al redimensionamiento; sustituida. |
| D-S2 | Velocity asumida | Acelerada por IA / conservadora bruta | **Acelerada por IA** | Usuario | Coherente con IA como recurso central (D-P2); el limitante es la revisión/validación (R-3). |
| D-S3 | Gate de validación del MVP antes de F2 | Sí, parar y validar / continuar directo | **Sí, parar y validar** | Usuario | Resuelve el supuesto bloqueante S-1; F2 solo arranca con requisitos confirmados. Determina el nº de ciclos (2). |
| D-S4 | Fecha de inicio | 2026-06-29 / 2026-06-24 / relativa | **Lunes 2026-06-29** | Usuario | Margen para aprobar el plan y preparar prerequisitos (repo, CI, acceso IA). |
| D-S6 | Redimensionamiento tras revisión de sizes | 2 sprints de 2 sem / **2 sprints de 1 sem** / 1 sprint con checkpoint | **2 sprints de 1 semana** | Usuario | Las estimaciones S/M/L eran de esfuerzo humano clásico; con IA la carga real es ~6-8 días-persona. 1 semana/sprint se ajusta a la carga; 2 ciclos los impone el gate de validación, no la carga. |
