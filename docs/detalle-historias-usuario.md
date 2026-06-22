# Detalle de historias de usuario — CheckList

> Documento de Fase 1 (AIDD · paso 1.3). Generado por `aidd user-story-details`.
> Entradas: docs/requisitos.md, docs/mapa-historias-usuario.md. Cierra la Fase 1.
> Pendiente de aprobación humana.

**Versión:** 1.0 · **Fecha:** 2026-06-22 · **Estado:** 🟡 Pendiente de aprobación

---

## Convenciones

- **[BLOQUEANTE]**: criterio que condiciona el criterio de salida de Fase 1 (sin él la historia no se considera entregada).
- **Estimación**: S (≤ 2 días) · M (3-5 días) · L (1-2 semanas).
- Los límites aplicados derivan de NFR-12: máx. 100 tareas (`MAX_TAREAS`), título 120 caracteres (`MAX_TITULO_LEN`), descripción 2000 caracteres (`MAX_DESC_LEN`).
- Todas las historias operan sobre la **única lista compartida** (RT-2) y heredan los NFR transversales: usabilidad sin manual (NFR-01), responsive/móvil (NFR-02), interfaz en español (NFR-03), accesibilidad WCAG 2.1 AA (NFR-05) y persistencia compartida en servidor (NFR-09).

## Historias detalladas

### HU-01 — Ver la lista compartida al abrir la web
- **Fase**: F1   **RF cubierto(s)**: RF-08   **Prioridad**: Alta
- **Estimación**: S
- **Descripción**: Como persona del equipo, quiero abrir la web y ver la lista compartida con todas sus tareas, su descripción y su estado, para saber en qué punto está el proceso. Es la pantalla de entrada y refleja el estado compartido vigente en el servidor.
- **Criterios de aceptación**:
  - [BLOQUEANTE] Dado que existen tareas en la lista, cuando abro la web, entonces veo todas las tareas con su título, su estado (pendiente/hecha) y, si la tiene, su descripción.
  - [BLOQUEANTE] Dado el estado compartido en servidor, cuando dos personas abren la web por separado, entonces ambas ven exactamente las mismas tareas y el mismo orden (fuente única de verdad, RT-4).
  - Dado que las tareas tienen un orden definido, cuando se muestra la lista, entonces aparecen en su posición/orden persistido (no aleatorio).
  - Dado que la lista no tiene tareas, cuando abro la web, entonces veo un estado vacío explícito (mensaje en español que invita a añadir la primera tarea), no una pantalla en blanco.
  - Dado un acceso desde móvil, cuando abro la web, entonces la lista se ve y se opera correctamente sin pérdida de funcionalidad (NFR-02).
  - Dado un usuario que navega por teclado/lector de pantalla, cuando recorre la lista, entonces cada tarea y su estado son percibibles con foco visible y etiquetas adecuadas (NFR-05).
- **Notas técnicas y dependencias**: primera carga lee el estado desde el backend (RT-4, NFR-09). Base para el resto de historias (todas se renderizan sobre esta vista). No requiere tiempo real para la carga inicial; la actualización en vivo la aporta HU-09.

### HU-02 — Añadir una tarea
- **Fase**: F1   **RF cubierto(s)**: RF-01   **Prioridad**: Alta
- **Estimación**: S
- **Descripción**: Como persona del equipo, quiero añadir una tarea con título obligatorio y descripción opcional, para registrar un paso del proceso. La tarea nace en estado *pendiente*.
- **Criterios de aceptación**:
  - [BLOQUEANTE] Dado el formulario de alta con un título válido, cuando confirmo, entonces se crea la tarea en estado *pendiente* y aparece en la lista.
  - [BLOQUEANTE] Dado un título vacío o solo con espacios, cuando intento confirmar, entonces la creación se rechaza y se muestra un mensaje claro en español; no se crea ninguna tarea.
  - Dado un título con más de 120 caracteres o una descripción con más de 2000, cuando intento confirmar, entonces se impide o se avisa según el límite configurado (`MAX_TITULO_LEN`, `MAX_DESC_LEN`) sin crear una tarea inválida.
  - Dada una descripción vacía, cuando confirmo, entonces la tarea se crea igualmente (la descripción es opcional).
  - Dado que la lista ya tiene `MAX_TAREAS` tareas (por defecto 100), cuando intento añadir otra, entonces la acción se bloquea con un aviso de límite alcanzado (NFR-12).
  - Dada una tarea recién creada, cuando se añade, entonces ocupa una posición determinista en el orden (p. ej. al final de la lista) coherente con HU-07.
  - Dado un usuario de teclado, cuando uso el alta, entonces el formulario es accesible (foco, etiquetas, envío por teclado) (NFR-05).
- **Notas técnicas y dependencias**: las longitudes y el tope provienen de NFR-12/§7. La acción debe propagarse en tiempo real cuando esté disponible HU-09 (RF-09).

### HU-03 — Marcar y desmarcar una tarea
- **Fase**: F1   **RF cubierto(s)**: RF-02   **Prioridad**: Alta
- **Estimación**: S
- **Descripción**: Como persona del equipo, quiero marcar una tarea como hecha y poder desmarcarla, para reflejar el avance real del proceso. La acción es reversible.
- **Criterios de aceptación**:
  - [BLOQUEANTE] Dada una tarea *pendiente*, cuando la marco, entonces pasa a estado *hecha* y se refleja visualmente de inmediato.
  - [BLOQUEANTE] Dada una tarea *hecha*, cuando la desmarco, entonces vuelve a *pendiente* (acción reversible).
  - Dado el principio de usabilidad, cuando marco o desmarco, entonces la acción se realiza en 1 toque/clic sobre el control de estado (NFR-01).
  - Dado un cambio de estado, cuando ocurre, entonces el progreso de la lista (HU-06) se actualiza acorde.
  - Dado un usuario de teclado/lector de pantalla, cuando opera el control de estado, entonces el control expone su estado (marcado/no marcado) y es accionable por teclado (NFR-05).
- **Notas técnicas y dependencias**: el cambio de estado alimenta a HU-06 (progreso) y habilita la condición de HU-08 (reiniciar al 100%). Se propaga en tiempo real con HU-09 (RF-09).

### HU-04 — Editar título y descripción de una tarea
- **Fase**: F1   **RF cubierto(s)**: RF-03   **Prioridad**: Media (Should — ver D-12 / P-A)
- **Estimación**: S
- **Descripción**: Como persona del equipo, quiero editar el título y la descripción de una tarea existente, para corregir o precisar un paso, sin tener que borrarla y recrearla.
- **Criterios de aceptación**:
  - Dada una tarea existente, cuando edito su título por uno válido y confirmo, entonces se guarda el nuevo título y se refleja en la lista.
  - Dada una tarea existente, cuando edito o vacío su descripción y confirmo, entonces se guarda el nuevo valor (la descripción puede quedar vacía).
  - Dado un título vacío o solo con espacios en la edición, cuando intento confirmar, entonces se rechaza el cambio y la tarea conserva su título anterior.
  - Dada una edición que excede `MAX_TITULO_LEN` o `MAX_DESC_LEN`, cuando intento confirmar, entonces se impide o se avisa sin guardar un valor inválido.
  - Dado que edito una tarea, cuando guardo, entonces su estado (pendiente/hecha) y su posición no cambian salvo que los modifique explícitamente.
  - Dada una cancelación de la edición, cuando descarto, entonces la tarea mantiene sus valores originales.
- **Notas técnicas y dependencias**: comparte validaciones con HU-02. Bajo ediciones simultáneas aplica last-write-wins (NFR-11): la última escritura prevalece sin bloqueo. Prioridad **Should**: el MVP es usable sin esta historia (se puede borrar y recrear), pero es muy deseable.

### HU-05 — Borrar una tarea (con confirmación)
- **Fase**: F1   **RF cubierto(s)**: RF-04   **Prioridad**: Alta
- **Estimación**: S
- **Descripción**: Como persona del equipo, quiero borrar una tarea de forma definitiva, para eliminar pasos que sobran. No hay papelera: el borrado es irreversible, por lo que se pide confirmación previa (decisión D-14).
- **Criterios de aceptación**:
  - [BLOQUEANTE] Dada una tarea existente, cuando solicito borrarla y confirmo, entonces la tarea se elimina definitivamente y desaparece de la lista.
  - [BLOQUEANTE] Dada la solicitud de borrado, cuando aún no he confirmado, entonces se muestra una confirmación previa y la tarea no se borra hasta confirmar (protección ante borrado irreversible, D-14).
  - Dada la confirmación de borrado, cuando cancelo, entonces la tarea permanece intacta.
  - Dado el borrado de una tarea, cuando se completa, entonces el progreso (HU-06) y, en su caso, la habilitación de Reiniciar (HU-08) se recalculan acorde.
  - Dado un usuario de teclado/lector de pantalla, cuando borra, entonces el control y el diálogo de confirmación son accesibles y operables por teclado (NFR-05).
- **Notas técnicas y dependencias**: no existe deshacer ni papelera (fuera de alcance, §6). Se propaga en tiempo real con HU-09 (RF-09).

### HU-06 — Ver el progreso de la lista
- **Fase**: F1   **RF cubierto(s)**: RF-05   **Prioridad**: Alta
- **Estimación**: S
- **Descripción**: Como persona del equipo, quiero ver el progreso de la lista de un vistazo (hechas/total y barra o porcentaje), para saber cuánto falta. Es el objetivo O-3 del cliente.
- **Criterios de aceptación**:
  - [BLOQUEANTE] Dada una lista con tareas, cuando la veo, entonces se muestra el progreso como nº de hechas sobre total y/o porcentaje y/o barra de progreso.
  - [BLOQUEANTE] Dado un cambio de estado, alta o borrado de una tarea, cuando ocurre, entonces el progreso se actualiza de inmediato y de forma coherente con el contenido real de la lista.
  - Dado que todas las tareas están hechas, cuando lo veo, entonces el progreso indica el 100% (condición que habilita HU-08).
  - Dada una lista vacía (0 tareas), cuando la veo, entonces el progreso muestra un valor coherente y no erróneo (p. ej. "0 de 0" o equivalente, sin división por cero ni 100% engañoso).
  - Dado un usuario de lector de pantalla, cuando consulta el progreso, entonces el valor es percibible textualmente, no solo por color/forma (NFR-05).
- **Notas técnicas y dependencias**: deriva de los estados gestionados en HU-03/HU-02/HU-05. El indicador refleja siempre el estado compartido (con HU-09, en tiempo real).

### HU-07 — Reordenar tareas por arrastre (drag & drop)
- **Fase**: F2   **RF cubierto(s)**: RF-06   **Prioridad**: Alta (dentro de F2)
- **Estimación**: M
- **Descripción**: Como persona del equipo, quiero reordenar las tareas arrastrándolas (con soporte táctil en móvil), para colocarlas en su orden lógico. El orden es persistente y compartido.
- **Criterios de aceptación**:
  - [BLOQUEANTE] Dada la lista, cuando arrastro una tarea a otra posición y la suelto, entonces la tarea queda en la nueva posición y el resto se recoloca de forma coherente.
  - [BLOQUEANTE] Dado un nuevo orden, cuando lo establezco, entonces se persiste en servidor y se mantiene al recargar y para el resto de personas (orden compartido).
  - [BLOQUEANTE] Dado un dispositivo táctil (móvil), cuando arrastro con el dedo, entonces el reordenado funciona igual que con ratón (soporte táctil, RF-06/D-3).
  - Dado un usuario que no puede usar arrastre (teclado/lector de pantalla), cuando quiere reordenar, entonces dispone de una alternativa accesible equivalente para mover una tarea arriba/abajo (NFR-05).
  - Dada una reordenación, cuando se confirma, entonces se propaga en tiempo real al resto de personas conectadas (RF-09).
- **Notas técnicas y dependencias**: mayor coste técnico (F2). Requiere modelo de posición/orden persistente por tarea. Bajo movimientos simultáneos aplica last-write-wins (NFR-11). La alternativa accesible al drag & drop es obligatoria por NFR-05; su forma concreta se define en diseño (Fase 2).

### HU-08 — Reiniciar la lista
- **Fase**: F2   **RF cubierto(s)**: RF-07   **Prioridad**: Alta (dentro de F2)
- **Estimación**: S
- **Descripción**: Como persona del equipo, quiero reiniciar la lista —disponible solo cuando todas las tareas están hechas y con confirmación previa—, para empezar el proceso de cero. Vacía la lista borrando todas las tareas; el borrado es definitivo.
- **Criterios de aceptación**:
  - [BLOQUEANTE] Dadas todas las tareas en estado *hecha* y al menos una tarea en la lista, cuando uso Reiniciar y confirmo, entonces se borran todas las tareas y la lista queda vacía.
  - [BLOQUEANTE] Dada una lista con al menos una tarea *pendiente*, cuando miro el botón Reiniciar, entonces está deshabilitado (no se puede reiniciar hasta el 100% hecho, D-4).
  - [BLOQUEANTE] Dada una lista vacía (0 tareas), cuando miro el botón Reiniciar, entonces está deshabilitado (no tiene sentido reiniciar una lista vacía, decisión D-15).
  - Dada la acción Reiniciar habilitada, cuando la activo, entonces se pide confirmación previa y la lista no se vacía hasta confirmar; si cancelo, no se borra nada (D-4).
  - Dado un reinicio confirmado, cuando se completa, entonces el progreso (HU-06) refleja la lista vacía y el cambio se propaga en tiempo real (RF-09).
  - Dado un usuario de teclado/lector de pantalla, cuando opera Reiniciar, entonces el estado habilitado/deshabilitado del botón y el diálogo de confirmación son accesibles (NFR-05).
- **Notas técnicas y dependencias**: borrado definitivo y masivo, sin papelera (§6). La condición de habilitación depende de los estados gestionados en HU-03 y del recuento de HU-06.

### HU-09 — Ver los cambios en tiempo real
- **Fase**: F2   **RF cubierto(s)**: RF-09   **Prioridad**: Alta (dentro de F2)
- **Estimación**: L
- **Descripción**: Como persona del equipo, quiero ver en tiempo real los cambios que hacen otras personas sin recargar, para trabajar sobre un estado siempre actualizado. Es el objetivo O-2 (fuente única compartida en tiempo real).
- **Criterios de aceptación**:
  - [BLOQUEANTE] Dadas dos personas con la web abierta, cuando una añade, marca/desmarca, edita, borra, reordena o reinicia, entonces la otra ve el cambio sin recargar la página.
  - [BLOQUEANTE] Dado un cambio propagado, cuando llega al resto de clientes, entonces la latencia percibida es prácticamente inmediata (objetivo orientativo < 1 s en red normal, NFR-06).
  - [BLOQUEANTE] Dadas ediciones simultáneas sobre la misma tarea, cuando ambas se aplican, entonces prevalece la última escritura (last-write-wins) y ese resultado es el que ven todas las personas, sin bloqueo ni resolución manual de conflictos (NFR-11).
  - Dada una pérdida temporal de conexión, cuando se restablece, entonces el cliente vuelve a reflejar el estado compartido vigente (reconexión / re-sincronización).
  - Dado el progreso (HU-06) y el orden (HU-07), cuando cambian por acción de otra persona, entonces también se actualizan en vivo en el resto de clientes.
- **Notas técnicas y dependencias**: función de mayor coste técnico (F2, estimación L). Requiere el canal de tiempo real (websockets, D-2) sobre el backend/BD compartido (RT-4); el andamiaje técnico se prepara en F0. Atraviesa transversalmente al resto de historias (toda acción de HU-02..HU-08 debe propagarse).

## Cobertura

| Historia | Fase | RF | Detallada | Criterios bloqueantes |
|---|---|---|---|---|
| HU-01 Ver la lista | F1 | RF-08 | ✅ | 2 |
| HU-02 Añadir tarea | F1 | RF-01 | ✅ | 2 |
| HU-03 Marcar/desmarcar | F1 | RF-02 | ✅ | 2 |
| HU-04 Editar tarea | F1 | RF-03 | ✅ | 0 (Should) |
| HU-05 Borrar tarea | F1 | RF-04 | ✅ | 2 |
| HU-06 Ver progreso | F1 | RF-05 | ✅ | 2 |
| HU-07 Reordenar | F2 | RF-06 | ✅ | 3 |
| HU-08 Reiniciar lista | F2 | RF-07 | ✅ | 3 |
| HU-09 Tiempo real | F2 | RF-09 | ✅ | 3 |

**Cobertura: 9/9 historias del mapa detalladas. 0 pendientes.** Todos los RF (RF-01..RF-09) quedan cubiertos con criterios verificables. F0 no aporta historias de usuario (solo base global, D-13).

## Preguntas abiertas y pendientes

- No quedan pendientes **[BLOQUEANTES]**. Los tres huecos abiertos del paso 1.2 (P-A) y los detectados en 1.3 (confirmación de borrado, reinicio con lista vacía) se han resuelto (ver decisiones D-14 y D-15).
- P-C (no bloqueante, diseño): la forma concreta de la **alternativa accesible al drag & drop** (HU-07/NFR-05) se concreta en Fase 2 (guía de estilos / arquitectura), no afecta al criterio de aceptación funcional.
- P-D (no bloqueante, diseño): formato exacto del indicador de progreso (texto, barra, porcentaje o combinación) se decide en la guía de estilos; el criterio solo exige que sea comprensible de un vistazo y accesible.

## Decisiones tomadas en el paso 1.3

| ID | Pregunta | Opciones | Decisión | Origen | Justificación |
|---|---|---|---|---|---|
| D-14 | ¿Confirmación al borrar una tarea individual (HU-05)? | Confirmación previa / inmediato / inmediato con deshacer | **Confirmación previa** | Usuario | El borrado es definitivo y no hay papelera; la confirmación protege ante errores, coherente con D-4 (reinicio). |
| D-15 | ¿Reiniciar (HU-08) con lista vacía (0 tareas)? | Deshabilitado si 0 tareas / habilitado igualmente | **Deshabilitado si 0 tareas** | Usuario | Reiniciar una lista vacía no tiene efecto; el botón exige ≥1 tarea y todas hechas. |
| P-A | Prioridad de HU-04 (editar) en F1 | Must / Should | **Should (confirmado)** | Usuario | Se confirma el default D-12: el MVP es usable sin edición in situ (borrar y recrear); deseable pero no bloqueante. |
