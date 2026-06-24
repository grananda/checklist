# Planificación de proyecto (recursos) — CheckList

> Documento de Planificación de entrega (AIDD · Fase 3.5 · paso 3.5.1). Generado por `aidd project-plan`.
> Fuentes: docs/arquitectura-base.md, docs/mapa-historias-usuario.md, docs/detalle-historias-usuario.md (apoyo: docs/requisitos.md, docs/cliente-requisitos.md).
> Insumo de `aidd sprint-planning`. **Pendiente de aprobación humana.**

**Versión:** 1.0 · **Fecha:** 2026-06-24 · **Estado:** 🟡 Pendiente de aprobación

---

## 1. Objetivo y resumen

**Qué se construye:** una aplicación web interna minimalista de **una única lista de tareas compartida**, usable desde móvil, con progreso visible y sincronización en tiempo real para un equipo de 5-10 personas (arquitectura-base §1). Alcance: 9 historias en F0 (foundation), F1 (MVP) y F2 (mejoras).

**Resumen de recursos:** equipo **reducido de 3-4 personas** (arquitecto/tech lead, 1-2 desarrolladores full-stack y un QA/validador, todos a dedicación parcial salvo los devs) con **la IA (Claude Code) como recurso central de ejecución**. Stack íntegramente **open source** salvo la suscripción a la herramienta de IA. Infraestructura mínima: un **contenedor Docker único** sobre host/VM interna en red corporativa/VPN, con volumen persistente para el fichero SQLite. No hay licencias de pago de runtime ni servicios cloud de terceros.

> Este documento planifica **el QUÉ se necesita** (recursos), no el **CUÁNDO** (calendario), que corresponde a `aidd sprint-planning`.

## 2. Perfiles y equipo recomendado

Modelo de roles: **tradicional con mapeo al rol SDD** (decisión D-P1). La IA es **recurso central** (D-P2); el equipo humano dirige, revisa y valida lo que la IA implementa, por lo que las dedicaciones humanas son mayoritariamente **parciales**. Tamaño objetivo: **3-4 personas** (D-P3).

| Perfil (rol SDD) | Responsabilidades | Skills concretos (ligados al stack/NFR) | Dedicación orientativa |
|---|---|---|---|
| **Arquitecto / Tech Lead** (AI Architect + AI Lead) | Custodiar la arquitectura (arquitectura-base.md), dirigir y dar contexto a la IA, fasear el trabajo, revisar decisiones técnicas y PRs. | TypeScript, monorepo `pnpm workspaces`, contrato tipado `shared`, criterio de simplicidad (NFR-08), diseño de capas transport→service→repository→db. | Parcial (~30-50%) |
| **Desarrollador full-stack (front-leaning)** (AI Lead Front / AI Developer) | Construir y revisar la UI de la única pantalla y sus modales; accesibilidad; alternativa accesible al drag&drop. | React 18 + Vite, Zustand, accesibilidad **WCAG 2.1 AA** (NFR-05), drag&drop táctil + alternativa por teclado (HU-07), tokens CSS de la guía de estilos. | Completa |
| **Desarrollador full-stack (back-leaning)** (AI Lead Back / AI Developer) | Construir y revisar API REST, dominio, persistencia y canal de tiempo real. | Node + Fastify, better-sqlite3 (sin ORM), Socket.IO (broadcast), transacciones (reset/reorden), validación servidor de límites (NFR-12), pino. | Completa |
| **QA / Validador** (Outcome Validator) | Verificar criterios de aceptación (Dado/Cuando/Entonces), e2e y accesibilidad; cuello de botella crítico al usar IA central. | Playwright (e2e), Vitest, pruebas de accesibilidad (axe-core), validación de criterios bloqueantes y last-write-wins (NFR-11). | Parcial (~30-50%) |
| **IA — Claude Code** (recurso de ejecución) | Implementación guiada del grueso del código (scaffolding, componentes, repos, servicios, tests), bajo dirección de los roles humanos. | Genera código TS sobre el contrato `shared`; acelera F0/F1/F2. **No sustituye** la revisión ni la validación humana. | Transversal |

Notas:
- Con equipo de 3-4, los dos perfiles full-stack pueden **colapsarse en uno solo** si la IA absorbe suficiente implementación; se mantienen separados aquí por las dos capacidades técnicas distintas (UI accesible vs. tiempo real/persistencia). Ver riesgo R-3.
- El **Outcome Validator** gana peso relativo precisamente porque la IA produce mucho código rápido: la capacidad de revisión/validación humana es el limitante real (R-3).

### 2.1 Mapeo perfil → historias

Puente hacia `aidd sprint-planning`: qué perfil lidera cada unidad de trabajo (la IA implementa bajo dirección del perfil indicado; el QA valida todas). Trazable al detalle de historias y a la descomposición por módulos (arquitectura-base §4-6).

| Perfil | Historias / trabajo que lidera | Justificación (capacidad) |
|---|---|---|
| **Back-leaning** | F0 (monorepo, `shared`, DB, gateway), HU-02, HU-03, HU-05, HU-08, HU-09 | Andamiaje, dominio/persistencia, API REST y tiempo real (Fastify, SQLite, Socket.IO). |
| **Front-leaning** | HU-01, HU-04, HU-06, HU-07 | UI de la única pantalla, modales, progreso y drag&drop accesible (React, Zustand, WCAG AA). |
| **Arquitecto / Tech Lead** | Transversal: `shared` (contrato tipado), revisión de capas y PRs, faseado | Custodia de la arquitectura y dirección de la IA. |
| **QA / Validador** | Transversal: criterios bloqueantes de las 9 historias, e2e, accesibilidad, last-write-wins | Verifica el output (humano + IA) contra los criterios Dado/Cuando/Entonces. |

> HU-09 (tiempo real) atraviesa a todas: el back lidera el canal, pero front y QA participan en la propagación y la re-sincronización. La asignación a sprints concreta es de `aidd sprint-planning`.

### 2.2 Gobierno de la IA como recurso central

Como Claude Code es el **motor de implementación** (D-P2) y el limitante deja de ser escribir código para pasar a **revisarlo y validarlo** (R-3), el plan fija unas reglas mínimas de gobierno del recurso IA:

- **Toda salida de IA pasa por PR revisado por un humano** antes de integrarse; ningún código llega a `main` sin revisión del perfil que lidera esa historia (§2.1) o del Tech Lead.
- **Los criterios de aceptación bloqueantes los valida siempre el Outcome Validator**, nunca la propia IA que generó el código; la validación es independiente de la generación.
- **Red de seguridad automatizada en CI:** axe-core (accesibilidad WCAG AA, NFR-05), Vitest (dominio) y Playwright (e2e) corren en cada PR, de modo que la calidad no depende solo de la revisión manual.
- **La arquitectura manda sobre la IA:** las decisiones de stack y capas (arquitectura-base §2, §5) son contexto de entrada no negociable para la IA; el Tech Lead vela por que el código generado respete `transport → service → repository → db` y el contrato `shared`.
- **Trazabilidad ligera:** las decisiones tomadas durante la construcción se registran de forma ligera (como en §8), no en auditoría estructurada (este conjunto AIDD es autónomo de OpenSpec).

## 3. Software, herramientas y licencias

Restricción aplicada: **solo open source / coste mínimo** (D-P4). Único elemento con coste: la herramienta de IA.

| Categoría | Herramienta | Coste | Ligado a |
|---|---|---|---|
| Lenguaje / runtime | Node.js LTS, TypeScript | OSS (gratis) | Stack arquitectura-base §2 |
| Gestor monorepo | pnpm (`pnpm workspaces`) | OSS | Estructura `client`+`server`+`shared` (§3) |
| Frontend | React 18, Vite, Zustand | OSS | Decisión de stack D-26..D-32 |
| Backend | Fastify, `@fastify/helmet` | OSS | API REST + seguridad (§11) |
| Tiempo real | Socket.IO | OSS | RF-09 / HU-09 |
| Persistencia | better-sqlite3 (SQLite) | OSS | NFR-09, sin ORM (NFR-08) |
| Logging | pino | OSS | Observabilidad (§11) |
| Testing | Vitest, Playwright, axe-core | OSS | Criterios de aceptación + accesibilidad (NFR-05) |
| **IA de desarrollo** | **Claude Code (Anthropic)** | **Coste — suscripción/API (€-€€/mes por usuario)** | Recurso central (D-P2) |
| Editor | VS Code (u OSS equivalente) | OSS / gratis | — |
| Repo + CI | Git + GitHub/GitLab (tier gratuito), GitHub Actions / GitLab CI | Gratis en tier (minutos incluidos) | Build/test del monorepo |
| Empaquetado | Docker Engine + Docker Compose | OSS en Linux (gratis) · *Docker Desktop tiene coste en empresas grandes — preferir Docker Engine en Linux* | Contenedor único (D-31, D-38) |

**Coste agregado:** prácticamente nulo en herramientas; el único gasto recurrente relevante es la **suscripción/uso de Claude Code** por desarrollador (orden de magnitud: decenas de € al mes por persona; cifra exacta a confirmar con tarifas si el usuario las aporta).

## 4. Infraestructura y entornos

Despliegue **interno** (RT-1, D-7): no expuesto a Internet. Modelo de **contenedor único** (D-31), sin servicios adicionales.

| Entorno | Propósito | Hosting | Notas |
|---|---|---|---|
| **dev** (local) | Desarrollo y pruebas | `docker-compose` en la máquina del dev | Volumen para el `.db`, variables desde `.env` (arquitectura-base §12, D-38) |
| **pre** (opcional) | Validación previa / aceptación | Misma imagen en host/VM interna | Recomendado para validar criterios antes de pro; opcional dado NFR-10 (sin SLA) |
| **pro** | Producción interna | Contenedor único en host/VM interna en red corporativa/VPN | Acceso por red, sin login (RT-1) |

- **Almacenamiento:** fichero SQLite en **volumen persistente** del contenedor (NFR-09). **Backups periódicos del fichero** son obligatorios como mitigación (arquitectura-base §13, riesgo R-4).
- **Red / acceso:** red corporativa/VPN; `CORS_ORIGIN` restringido; mismo origen cliente/servidor (D-36). Sin secretos de terceros; configuración por variables de entorno (`PORT`, `DATABASE_URL`, `CORS_ORIGIN`, `MAX_TAREAS`, `MAX_TITULO_LEN`, `MAX_DESC_LEN`, `NODE_ENV`). **No se almacenan valores de secretos en este documento.**
- **Recomendación (no derivada):** reutilizar un host/VM interno ya existente en lugar de provisionar cloud nuevo, coherente con coste mínimo. Marcado como supuesto S-2 al no estar confirmado.

## 5. Estimación de esfuerzo (agregada)

Agregación de las estimaciones **S/M/L** del detalle de historias (S ≤ 2 días · M 3-5 días · L 1-2 semanas). Es **volumen de trabajo en bruto** (días-persona), **no calendario**. F0 no tiene historias de usuario pero requiere andamiaje técnico (monorepo, `shared`, DB, gateway de tiempo real, Docker), estimado aquí.

| Fase | Unidades | Estimaciones | Rango agregado (días-persona, bruto) |
|---|---|---|---|
| **F0 — Foundation** | Andamiaje: monorepo, `shared`, DB/esquema, scaffolding tiempo real, Docker/compose, CI | ~S-M (habilitador) | **3-5 d** |
| **F1 — MVP** | HU-01, HU-02, HU-03, HU-04, HU-05, HU-06 | 6 × S | **9-12 d** |
| **F2 — Mejoras** | HU-07 (M), HU-08 (S), HU-09 (L) | M + S + L | **10-17 d** |
| **Total** | 9 historias + foundation | — | **≈ 22-34 días-persona (bruto)** |

> **Efecto de la IA como recurso central:** estos rangos son el volumen de trabajo "clásico". Con Claude Code ejecutando el grueso de la implementación, el **esfuerzo humano efectivo** (dirección + revisión + validación) es sensiblemente menor, pero **se traslada hacia revisión y validación** (Outcome Validator). El esfuerzo bruto se mantiene como referencia para `aidd sprint-planning`; la aceleración real se calibra en la planificación de sprints, no aquí.
> **HU-09 (tiempo real, L)** concentra el mayor esfuerzo individual y depende del andamiaje de F0.

## 6. Dependencias y prerequisitos de recursos

**Prerequisitos antes de empezar a construir:**
- Acceso al **repositorio Git** y a un **runner de CI** (GitHub Actions / GitLab CI en tier gratuito).
- **Host/VM interno con Docker** disponible en red corporativa/VPN (para pre/pro).
- **Acceso/licencia a Claude Code** para los desarrolladores (recurso central — sin él, el plan de esfuerzo cambia).
- Perfiles cubiertos: al menos **1 full-stack** y un **arquitecto/lead** disponibles; QA/validador puede incorporarse parcial desde F1.

**Dependencias entre recursos y trabajo:**
- **F0 (foundation) habilita F1 y F2**: el monorepo, el contrato `shared`, la DB y el scaffolding del gateway de tiempo real deben existir antes (mapa §F0).
- **HU-09 (tiempo real)** depende del andamiaje de tiempo real preparado en F0 (detalle HU-09).
- **HU-07 (drag&drop accesible)** requiere el perfil con skill de accesibilidad AA disponible (R-1).
- **Validación del prototipo con cliente**: la arquitectura asume requisitos de Fase 1 estables, pero el prototipo **aún no consta como validado** (arquitectura-base §13). Es un **prerequisito de negocio** recomendado antes de invertir el grueso del esfuerzo. Ver S-1.

## 7. Riesgos de recursos y supuestos

**Riesgos:**
- **R-1 — Skill de accesibilidad escaso:** la alternativa accesible al drag&drop (HU-07/NFR-05) y WCAG 2.1 AA exigen experiencia específica; si el equipo no la tiene, hay riesgo de retrabajo. Mitigación: asignar accesibilidad explícitamente al perfil front y reforzar con axe-core en CI.
- **R-2 — Dependencia de la herramienta de IA:** al ser Claude Code recurso central, su **coste, disponibilidad o restricciones de acceso corporativo** impactan directamente al plan. Mitigación: confirmar acceso/licencia antes de arrancar (prerequisito §6) y mantener el código revisable por humanos.
- **R-3 — Cuello de botella en revisión/validación:** con IA central y equipo reducido (3-4), el limitante deja de ser escribir código y pasa a ser **revisarlo y validarlo**. Mitigación: dar peso real al Outcome Validator y no colapsar QA en los devs.
- **R-4 — Persistencia en fichero único (operacional):** SQLite en un solo fichero sin backup pierde datos ante fallo de disco (arquitectura-base §13, NFR-09). Mitigación: backups periódicos del volumen como tarea operativa.
- **R-5 — Tensión tamaño vs. IA central:** un equipo de 3-4 puede **sobredimensionar** un proyecto pequeño donde la IA absorbe gran parte de la implementación; podría bastar con 2-3. Se respeta la decisión del usuario (D-P3) y se señala para revisar en sprint-planning.

**Supuestos:**
- **S-1 [BLOQUEANTE de negocio]:** se asume que los requisitos de Fase 1 están estables; el prototipo **no consta validado por el cliente** (arquitectura-base §13). Si la validación trae cambios, revisar alcance y recursos.
- **S-2:** se asume disponibilidad de un host/VM interno existente con Docker; no está confirmado (§4).
- **S-3:** dedicaciones parciales (arquitecto/lead, QA) asumen que la IA absorbe el grueso de la implementación; si no, deben subir a dedicación mayor.
- **S-4:** costes tratados de forma **cualitativa con rangos**; no se han aportado tarifas concretas (de Claude Code ni de personal).

## 8. Decisiones tomadas

| ID | Pregunta | Opciones | Decisión | Origen | Justificación |
|---|---|---|---|---|---|
| D-P1 | Modelo de roles para dimensionar el equipo | Roles SDD / tradicionales / ambos mapeados | **Ambos (tradicional con mapeo SDD)** | Usuario | Mantiene nomenclatura clásica legible y la traza al rol AI-Native del piloto. |
| D-P2 | ¿IA (Claude Code) como recurso de desarrollo? | Central / apoyo puntual / no | **Sí, recurso central** | Usuario | Coherente con el piloto AIDD; reduce el equipo humano y desplaza el esfuerzo a dirección/revisión/validación. |
| D-P3 | Tamaño objetivo del equipo de construcción | Mínimo (1-2) / reducido (3-4) / sin definir | **Reducido (3-4)** | Usuario | Permite reparto front/back/QA paralelizable; se señala posible sobredimensionamiento (R-5). |
| D-P4 | Restricciones de recursos | OSS/coste mínimo / infra interna / sin restricciones | **Solo open source / coste mínimo** | Usuario | Todo el stack es OSS; único coste recurrente es la suscripción a la IA. |
