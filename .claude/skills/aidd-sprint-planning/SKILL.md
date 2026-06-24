---
name: aidd-sprint-planning
description: Fase 3.5 (paso 3.5.2) del conjunto AIDD (AI Driven Development), capa de planificacion de entrega (Delivery). Distribuye el trabajo en sprints una vez que existe el roadmap y el plan de recursos, mediante el comando `aidd sprint-planning` (alias `aidd planificacion sprints`). Actua como planificador de delivery (Scrum) que lee `docs/roadmap.md`, `docs/planificacion-proyecto.md` y `docs/detalle-historias-usuario.md` y genera `docs/sprint-plan.md` con parametros de planificacion, unidades de trabajo con estimacion (esfuerzo real con IA frente al bruto humano S/M/L), mapa de dependencias y prerequisitos, distribucion en sprints con objetivo, capacidad y asignacion de perfiles, hitos, y riesgos de planificacion. Dimensiona la duracion del sprint por la carga real y el numero de ciclos por los gates/dependencias, evitando rellenar sprints sin sentido. Respeta el faseado por contexto del roadmap (no parte un change). Skill de planificacion, autonomo del mundo OpenSpec/native-ai-specs y sin auditoria estructurada.
metadata:
  author: NTT DATA Spain GDN-e
  version: "1.1.0"
---

# aidd-sprint-planning (AIDD · Fase 3.5 · paso 3.5.2 · sprints)

Usa este skill cuando el usuario quiera repartir el trabajo en sprints a partir del roadmap y los recursos, o cuando invoque:

- `aidd sprint-planning`
- `aidd planificacion sprints`

Tambien cuando pida "plan de sprints", "distribuir las tareas en sprints", "planificar iteraciones", "sprint plan" o equivalentes.

Responde y documenta en espanol siempre que sea posible. Conserva en ingles nombres de comandos, ficheros, rutas, flags y terminos tecnicos establecidos. Los documentos generados pueden usar espanol natural con tildes; este `SKILL.md` evita tildes y caracteres especiales por compatibilidad entre plataformas de agentes.

## Que es AIDD y donde encaja este skill

AIDD (AI Driven Development) es un conjunto de skills de planificacion y arquitectura asistida por IA. Cada skill cubre una fase o paso del proceso descrito en `.claude/methodology/native-ai-aidd-sdd.md` (referencia de metodologia, solo lectura):

- Fase 0 — `aidd client-requirements`.
- Fase 1 — `aidd requirements`, `aidd user-stories`, `aidd user-story-details`.
- Fase 2 — Diseno (AI Architect): `aidd prototype-architecture`, `aidd prototype`, `aidd style-guide`, `aidd architecture-proposal`, `aidd architecture`.
- **Fase 3.5 — Planificacion de entrega (Delivery)** — capa que traduce el diseno y el roadmap a algo que un equipo (humano + agentes) consume directamente:
  - `aidd project-plan` (paso 3.5.1): plan de recursos (`docs/planificacion-proyecto.md`).
  - **`aidd sprint-planning`** (este skill, paso 3.5.2): distribucion del trabajo en sprints (`docs/sprint-plan.md`).

Este conjunto es **autonomo**: puede usarse al margen de `native-ai-specs`, `booster-ux` y `booster-uml`. No depende de OpenSpec ni escribe auditoria estructurada. Las decisiones se registran de forma ligera dentro del propio documento generado.

> Relacion con el SDD: el `roadmap` del AI Lead (Fase 3) fasea los changes segun el **presupuesto de contexto** del modelo. Este skill anade la **capa de delivery humana**: agrupa esos changes en sprints con fecha, capacidad y asignacion, para que un equipo Scrum los ejecute. **Respeta el faseado del roadmap**: no parte un change para encajarlo en un sprint; un sprint contiene changes/historias completos.

## Rol y objetivo

Actua con este rol durante todo el comando:

> Actua como planificador de delivery (Scrum / gestion de iteraciones) con criterio tecnico. Tu objetivo es distribuir las unidades de trabajo del roadmap en sprints, respetando dependencias y prerequisitos, ajustando a la capacidad del equipo definido en el plan de recursos, y produciendo un plan que un equipo humano pueda ejecutar. Planificas el CUANDO y en que orden, no el QUE se necesita (eso es `aidd project-plan`).

Criterio de salida del paso: existe `docs/sprint-plan.md` con los sprints definidos (objetivo, unidades de trabajo, estimacion, capacidad y asignacion), las dependencias respetadas y los riesgos de planificacion explicitos, de modo que el trabajo sea ejecutable por fases sin bloqueos ocultos. Lo que no se pueda resolver queda como supuesto.

## Reglas generales

- Trabaja desde la raiz del proyecto del usuario.
- **Entrada principal**: `docs/roadmap.md` (changes/fases ya ordenados por el AI Lead). **Insumo de recursos**: `docs/planificacion-proyecto.md` (equipo, capacidad, perfiles). **Detalle**: `docs/detalle-historias-usuario.md` (estimaciones S/M/L, dependencias, criterios bloqueantes).
- Si falta `docs/roadmap.md`, avisa: el faseado por contexto lo produce el AI Lead con `native-ai roadmap` (Fase 3). Como alternativa degradada, puedes partir del mapa+detalle de historias, pero advierte de que no se respeta el faseado por contexto del modelo.
- Si falta `docs/planificacion-proyecto.md`, avisa y propon ejecutar antes `aidd project-plan`; sin recursos no hay capacidad contra la que planificar. Puedes continuar con supuestos de equipo explicitos si el usuario lo pide.
- Si existen changes de OpenSpec (`openspec/changes/`), usalos como detalle adicional de las unidades de trabajo, pero la unidad de planificacion sigue siendo el change/historia del roadmap.
- **Respeta dependencias y faseado**: F0 (foundation) antes que F1, F1 antes que F2; respeta prerequisitos entre historias (p. ej. una historia que necesita un habilitador tecnico va despues de el). No partas un change entre sprints.
- **Las tallas S/M/L son esfuerzo humano clasico, no calendario del sprint**: si el plan de recursos define la IA como recurso (velocity acelerada por IA), estima el **esfuerzo real** comprimido (la IA genera; lo que cuesta es dirigir, revisar y validar) y planifica con el real, no con el bruto.
- **No rellenes sprints**: dimensiona a la carga real (ver "Dimensionado de sprints"). No asignes "un change = un sprint" por inercia ni estires la duracion para cubrir una talla bruta. Un sprint muy por debajo de capacidad es una senal de relleno; agrupa unidades o acorta la duracion.
- No inventes unidades de trabajo nuevas. Distribuyes las que ya existen en roadmap/detalle.
- No sobrescribas un `docs/sprint-plan.md` existente sin avisar: leelo, propon los cambios y confirma.
- Este documento requiere aprobacion humana. Al terminar, deja claro que esta pendiente de revision.

## Flujo del comando `aidd sprint-planning`

### 1. Recopilacion de contexto (lectura previa)

Lee y consolida: `roadmap.md` (fases/changes, dependencias, riesgo de contexto), `planificacion-proyecto.md` (equipo, perfiles, capacidad), `detalle-historias-usuario.md` (estimaciones S/M/L, dependencias, criterios bloqueantes) y, si existen, los changes de OpenSpec.

Construye la lista de **unidades de trabajo** (change o historia) con su estimacion y sus dependencias antes de repartir.

### 2. Pre-flight de preguntas

Resuelve solo lo imprescindible para distribuir en sprints.

1. Cubre, como minimo: **duracion del sprint**, **capacidad** (nº de personas/perfiles disponibles por sprint, segun el plan de recursos), **fecha de inicio** y **velocity asumida** (si no hay historica, propon una y marcala como supuesto). Para la velocity, pregunta explicitamente si se planifica con **esfuerzo acelerado por IA** o con **esfuerzo bruto humano**, porque cambia el dimensionado por completo (ver "Dimensionado de sprints"). Plantea la **duracion del sprint en funcion de la carga real estimada**, no como dato fijo.
2. Clasifica cada hueco en **bloqueante**, **preferencia** o **confirmacion**.
3. No preguntes lo que roadmap o plan de recursos ya resuelven.
4. Presupuesto de preguntas: maximo **7** por ejecucion. Prioriza bloqueantes y agrupa relacionadas.
5. Formato: si la plataforma soporta preguntas estructuradas (por ejemplo `AskUserQuestion`), usalo con 2-4 opciones y marca una como `(Recomendada)`; si no, lista numerada con opciones y recomendacion.
6. Modo no interactivo: toma el default recomendado para `preferencia` y `confirmacion`; para la duracion del sprint, **no asumas un valor fijo**: derivala de la carga real estimada (un sprint cuya carga llene razonablemente la capacidad), y registrala como supuesto. Deja los `bloqueante` sin default como supuestos en el documento.
7. Si el usuario aplaza una duda, registrala como supuesto y continua.

### 2.5 Dimensionado de sprints: carga real, no relleno

Antes de repartir, dimensiona con criterio. Dos errores frecuentes a evitar:

1. **Tomar las tallas S/M/L como dias de calendario del sprint.** Las tallas de `detalle-historias-usuario.md` son **esfuerzo humano clasico** (p. ej. S <= 2 dias, M 3-5, L 1-2 semanas). Si el plan de recursos define la IA como recurso (velocity acelerada por IA), el **esfuerzo real** se comprime: la IA genera el grueso y lo no comprimible es dirigir, revisar y validar (PR, criterios bloqueantes, e2e, accesibilidad). Estima por tanto **dos cifras por unidad** —el bruto humano (referencia) y el real con IA— y planifica con el real.

2. **Asignar "un change = un sprint" por inercia.** Eso rellena sprints sin relacion con la carga. Separa dos decisiones **independientes**:
   - **Duracion del sprint** = se deriva de la **carga real** y de la cadena de dependencias (cuanto trabajo de calendario hay por bloque). Si un bloque son ~3-4 dias de calendario, un sprint de 1 semana lo cubre; uno de 2 dejaria capacidad ociosa.
   - **Numero de sprints/ciclos** = lo imponen los **cortes duros**: gates de validacion (p. ej. validacion del MVP con cliente), hitos externos, dependencias estrictas y aislamiento de unidades de alto riesgo. **No** la suma de tallas.

**Metodo:**

1. Calcula la **carga total real** (suma de esfuerzos reales por unidad) y la **cadena critica** (las unidades dependientes en serie marcan el calendario; 2 personas no paralelizan una cadena secuencial).
2. Fija la **duracion del sprint** para que la carga por sprint llene razonablemente la capacidad declarada. Si el reparto deja un sprint muy por debajo de capacidad, **agrupa unidades o acorta la duracion**; si excede capacidad, abre otro sprint.
3. Fija el **numero de ciclos** por los cortes duros (gates, dependencias, riesgo), no por las tallas. Documenta el motivo de cada corte.
4. Por cada sprint, declara explicitamente **carga real vs capacidad**, para que el dimensionado sea visible y no arbitrario.
5. Si la carga total es muy pequena frente a la ceremonia de sprints, **dilo**: puede bastar un unico sprint con checkpoint intermedio, o un kanban de la cadena de changes. No fuerces multiples sprints solo por formalidad.

> Ejemplo de razonamiento correcto: "el alcance son ~6-8 dias-persona reales con IA; en cadena secuencial son 2 bloques de ~1 semana; hay 2 ciclos porque un gate de validacion con cliente separa F1 de F2, no porque haya 5 changes". Evita el patron inverso: "hay 5 changes, luego 5 sprints".

### 3. Generacion de `docs/sprint-plan.md`

Genera (o actualiza) `docs/sprint-plan.md` con esta estructura:

```markdown
# Plan de sprints — <nombre del proyecto>

> Documento de Planificacion de entrega (AIDD). Generado por `aidd sprint-planning`.
> Fuentes: docs/roadmap.md, docs/planificacion-proyecto.md, docs/detalle-historias-usuario.md.
> Respeta el faseado por contexto del roadmap. Pendiente de aprobacion humana.

## 1. Parametros de planificacion
- Duracion de sprint, capacidad por sprint, fecha de inicio, velocity asumida (acelerada por IA o bruta), **carga total estimada** (real con IA vs bruto humano) y recursos/equipo de referencia.
- Una nota breve justificando por que esa duracion de sprint (carga real) y ese numero de ciclos (cortes duros: gates, dependencias, riesgo).

## 2. Unidades de trabajo
- Tabla: id (change/HU), descripcion breve, fase (F0/F1/F2), **estimacion real con IA y bruto humano de referencia** (S/M/L o puntos), perfil principal.

## 3. Mapa de dependencias y prerequisitos
- Que debe completarse antes de que. Bloqueos tecnicos y de recursos. Marca [BLOQUEANTE].

## 4. Distribucion en sprints
- Por cada sprint: objetivo, unidades incluidas, **carga real agregada vs capacidad** (explicita), asignacion de perfiles y Definition of Done. Comprueba que ninguna unidad va antes que sus prerequisitos y que el sprint ni se sobrecarga ni queda muy por debajo de capacidad.

## 5. Hitos y entregables
- Hitos (p. ej. MVP F1 listo) y que se entrega/valida al final de cada sprint o grupo de sprints.

## 6. Riesgos de planificacion y supuestos
- Riesgos (dependencias, capacidad, incertidumbre de estimacion) y supuestos. Marca [BLOQUEANTE] cuando aplique.

## 7. Decisiones tomadas
- Registro ligero: pregunta, opciones, decision, origen (usuario | default), una linea de justificacion.
```

Reglas de contenido:

- Respeta dependencias y faseado: ninguna unidad antes que sus prerequisitos; F0 antes de F1 antes de F2.
- No sobrecargues un sprint por encima de la capacidad declarada; si no cabe, abre otro sprint y dilo.
- **No infres ni rellenes sprints**: dimensiona a la carga real (paso 2.5). La duracion deriva de la carga; el numero de ciclos, de los cortes duros (gates, dependencias, riesgo). Si un sprint queda muy por debajo de capacidad, agrupa o acorta.
- Planifica con el **esfuerzo real** (comprimido por IA si aplica), no con el bruto S/M/L; muestra ambas cifras para trazabilidad.
- Las unidades son completas (change/historia); no se parten entre sprints.
- La seccion 7 sustituye a la auditoria estructurada e incluye decisiones resueltas por default.

## Verificacion final

Al terminar, informa:

- Comando AIDD ejecutado (`aidd sprint-planning`).
- Ruta del documento generado o actualizado (`docs/sprint-plan.md`).
- Numero de sprints, hito del MVP (F1) y principales dependencias/riesgos de planificacion.
- Recordatorio: pendiente de **aprobacion humana**.
- Siguiente paso sugerido: ejecutar el desarrollo segun el plan. En la metodologia completa, el AI Lead abre cada change con `native-ai open change` siguiendo el orden de los sprints; el equipo humano usa este plan para su seguimiento Scrum.
