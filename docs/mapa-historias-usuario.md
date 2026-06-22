# Mapa de historias de usuario — CheckList

> Documento de Fase 1 (AIDD · paso 1.2). Generado por `aidd user-stories`.
> Entrada: docs/requisitos.md. Salida hacia: docs/detalle-historias-usuario.md.
> Pendiente de aprobacion humana.

**Versión:** 1.0 · **Fecha:** 2026-06-17 · **Estado:** 🟢 Aprobado

---

## 1. Personas / roles de usuario

El sistema tiene un **único perfil de usuario**, anónimo y sin autenticación (ver `docs/requisitos.md` §2).

| Persona | Objetivo principal | Contexto de uso |
|---|---|---|
| **Persona del equipo** | Ejecutar un proceso repetitivo sin saltarse pasos y ver de un vistazo qué está hecho y qué falta. | Equipo pequeño (5-10), red interna. Acceso anónimo desde navegador, mayoritariamente **móvil**. Todas las personas tienen las mismas capacidades sobre la única lista compartida. |

> No hay roles diferenciados ni permisos: la lista es compartida y cualquiera puede realizar cualquier acción.

## 2. Backbone de actividades

Recorrido del usuario de izquierda a derecha sobre la única lista compartida:

| A. Consultar | B. Capturar | C. Actualizar | D. Organizar | E. Cerrar ciclo |
|---|---|---|---|---|
| Abrir la web y ver la lista y el progreso | Añadir tareas al proceso | Marcar/desmarcar, editar y borrar tareas | Reordenar las tareas según su lógica | Reiniciar la lista al completarse |

> **Actividad transversal — Colaborar en tiempo real:** cualquier cambio de una persona es visible para el resto sin recargar. Atraviesa todas las columnas del backbone (RF-09).

## 3. Historias por fase

### F0 — Foundation (base global del proyecto)

**Objetivo:** establecer la estructura base **global** sobre la que se construye todo lo demás. **No entrega funcionalidad de usuario** (alineado con la metodología: `foundation` siempre es el primer change y no implementa funcionalidad).
**Criterio de salida:** proyecto inicializado y operativo, listo para que F1 construya encima. Sin historias de usuario y sin RF cubiertos por sí mismo.

**Habilitadores técnicos (transversales, no son historias de usuario):**

- Estructura base del proyecto: árbol de carpetas, configuración y arranque.
- Backend + base de datos compartida como fuente única de verdad (RT-4).
- Persistencia del estado entre sesiones y dispositivos (NFR-09).
- Andamiaje del backend de tiempo real (la funcionalidad de cara al usuario llega en HU-09 / F2).

> F0 es **global**: sostiene todas las fases pero no cubre ningún RF. El primer RF funcional (RF-08, ver la lista) se entrega ya en **F1** con HU-01.

### F1 — Núcleo usable (MVP)

**Objetivo:** gestionar las tareas del proceso de principio a fin y ver el avance. Es el primer entregable con valor real.
**Criterio de salida:** una persona abre la web, ve la lista compartida, y puede añadir, marcar/desmarcar, editar y borrar tareas, y ver el progreso actualizado en todo momento.

| ID | Historia | RF | MoSCoW |
|---|---|---|---|
| HU-01 | Como persona del equipo, quiero abrir la web y ver la lista compartida con todas sus tareas, su descripción y su estado, para saber en qué punto está el proceso. | RF-08 | Must |
| HU-02 | Como persona del equipo, quiero añadir una tarea con título obligatorio y descripción opcional, para registrar un paso del proceso. | RF-01 | Must |
| HU-03 | Como persona del equipo, quiero marcar una tarea como hecha y poder desmarcarla, para reflejar el avance real del proceso. | RF-02 | Must |
| HU-04 | Como persona del equipo, quiero editar el título y la descripción de una tarea existente, para corregir o precisar un paso. | RF-03 | Should |
| HU-05 | Como persona del equipo, quiero borrar una tarea de forma definitiva, para eliminar pasos que sobran. | RF-04 | Must |
| HU-06 | Como persona del equipo, quiero ver el progreso de la lista de un vistazo (hechas/total y barra o porcentaje), para saber cuánto falta. | RF-05 | Must |

### F2 — Mejoras (mayor coste técnico)

**Objetivo:** completar la experiencia colaborativa y de organización con las funciones de mayor coste de implementación.
**Criterio de salida:** las tareas pueden reordenarse por arrastre, la lista puede reiniciarse al completarse, y los cambios de cualquier persona se ven en tiempo real sin recargar.

| ID | Historia | RF |
|---|---|---|
| HU-07 | Como persona del equipo, quiero reordenar las tareas arrastrándolas (con soporte táctil en móvil), para colocarlas en su orden lógico. | RF-06 |
| HU-08 | Como persona del equipo, quiero reiniciar la lista —disponible solo cuando todas las tareas están hechas y con confirmación previa—, para empezar el proceso de cero. | RF-07 |
| HU-09 | Como persona del equipo, quiero ver en tiempo real los cambios que hacen otras personas sin recargar, para trabajar sobre un estado siempre actualizado. | RF-09 |

## 4. Priorización MoSCoW (Fase 1)

Aplica a las historias del entregable **F1 — Núcleo usable** (F0 no tiene historias de usuario):

- **Must:** HU-01 (ver lista), HU-02 (añadir), HU-03 (marcar/desmarcar), HU-05 (borrar), HU-06 (progreso). Sin ellas no hay checklist funcional.
- **Should:** HU-04 (editar). Muy deseable, pero un proceso puede usarse borrando y recreando una tarea si fuera imprescindible recortar.
- **Could:** —
- **Won't (en F1):** HU-07 (reordenar), HU-08 (reiniciar) y HU-09 (tiempo real) se entregan en **F2**, no en el MVP (decisión D-10).

> Fuera de alcance del producto (no de una fase): cuentas/login, múltiples listas, papelera, historial, notificaciones, etc. (ver `docs/requisitos.md` §6).

## 5. Trazabilidad RF → historias

| RF | Historia(s) | Fase | ¿Cubierto? |
|---|---|---|---|
| RF-01 Añadir tarea | HU-02 | F1 | ✅ |
| RF-02 Marcar/desmarcar | HU-03 | F1 | ✅ |
| RF-03 Editar tarea | HU-04 | F1 | ✅ |
| RF-04 Borrar tarea | HU-05 | F1 | ✅ |
| RF-05 Ver progreso | HU-06 | F1 | ✅ |
| RF-06 Reordenar | HU-07 | F2 | ✅ |
| RF-07 Reiniciar lista | HU-08 | F2 | ✅ |
| RF-08 Ver la lista | HU-01 | F1 | ✅ |
| RF-09 Tiempo real | HU-09 | F2 | ✅ |

**Cobertura: 9/9 RF.** No hay requisitos funcionales sin historia.

> NFR relevantes (transversales a todas las historias, se detallan en 1.3 como criterios): NFR-01 usabilidad, NFR-02 responsive/móvil, NFR-03 español, NFR-05 accesibilidad AA, NFR-06 latencia tiempo real (HU-09), NFR-09 persistencia (F0, habilitador), NFR-11 last-write-wins (HU-09), NFR-12 límites (HU-02/HU-04).

## 6. Preguntas abiertas y pendientes

- No quedan pendientes **[BLOQUEANTES]**. Los requisitos están cerrados y todos los RF tienen historia.
- P-A (preferencia, no bloqueante): confirmar en 1.3 si HU-04 (editar) debe subir a **Must** en F1 o mantenerse como Should. Default actual: Should.
- P-B (no bloqueante): el reparto F1/F2 es de planificación; si se prefiere un único release, las historias de F2 se integran en F1 sin cambiar su contenido.

## 7. Decisiones tomadas en el paso 1.2

| ID | Pregunta | Opciones | Decisión | Origen | Justificación |
|---|---|---|---|---|---|
| D-10 | Estrategia de faseo del mapa | MVP escalonado / todo en Fase 1 | **MVP escalonado (F0/F1/F2)** | Usuario | Entrega valor antes y aísla lo técnicamente costoso (drag&drop, reinicio, tiempo real) en F2. |
| D-11 | Ubicación del tiempo real (RF-09) | F1 / F2 | **F2** | Default (deriva de D-10) | Es la función de mayor coste técnico; se agrupa con las mejoras tras un MVP usable. Confirmar en validación. |
| D-12 | Prioridad de HU-04 (editar) en F1 | Must / Should | **Should** | Default | El núcleo del checklist funciona sin edición in situ (se puede borrar y recrear); deseable pero no bloqueante. Ver P-A. |
| D-13 | Naturaleza de F0 (foundation) | Con historias de usuario / solo base global | **Solo base global, sin historias de usuario** | Usuario | La metodología define `foundation` como estructura base sin funcionalidad (native-ai-specs-sdd §3.4). HU-01 (ver lista, RF-08) se reubica en F1. |
