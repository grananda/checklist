# AI-Native Development — Metodología para Proyectos Full Stack
**Versión:** 2.0  
**Fecha:** 2026-05-24

---

## 1. Filosofía

AI-Native Development no es usar la IA como un asistente que escribe código más rápido. Es un modelo de trabajo donde **la IA generativa es parte estructural del proceso**, no una herramienta auxiliar, y el humano actúa como **director de orquesta**: aprueba, decide y valida en cada transición.

> **La especificación como motor del desarrollo:** transformamos los requisitos del cliente en contexto estructurado que los agentes IA pueden procesar de forma consistente. Sin especificación, no hay implementación.

El objetivo es garantizar **coherencia** entre lo que se define, lo que se diseña y lo que se implementa, evitando la deriva habitual donde el código se aleja de los requisitos con el paso de los sprints.

**Principios fundacionales:**

| Principio | Descripción |
|---|---|
| **IA como motor, no como herramienta** | La IA generativa es parte estructural del proceso de desarrollo en todos sus roles |
| **Human-in-the-loop obligatorio** | El humano supervisa, valida y aprueba en cada transición entre roles. Sin su aprobación no se avanza |
| **Documentos como fuente de verdad** | Toda decisión queda en un fichero. El código se genera a partir de los documentos, no al revés |
| **Roles separados, contextos limpios** | Cada rol de IA arranca con los documentos de su fase, sin el historial completo. Evita sesgos y deriva |
| **Handoff explícito** | El paso de un rol al siguiente se hace entregando documentos revisados y aprobados por el humano |
| **Validación antes de implementar** | Siempre se valida con cliente (prototipo) antes de construir la arquitectura real |
| **Iteración y refinamiento continuo** | Cada ciclo optimiza progresivamente especificaciones, código y arquitectura |
| **Idempotencia documental** | Cualquier IA que arranque con los mismos documentos debe llegar a conclusiones compatibles |

---

## 2. Macro-fases

El proceso se organiza en tres macro-fases que agrupan las etapas de trabajo:

```
┌─────────────────────┬──────────────────────┬──────────────────────┐
│     DEFINITION      │      EXECUTION       │     VALIDATION       │
│                     │                      │                      │
│ 1. Descubrimiento   │ 4. Generación y      │ 5. Integración y     │
│    de Agentes       │    Refinamiento      │    Validación        │
│ 2. Extracción de    │                      │                      │
│    Conocimiento     │                      │                      │
│ 3. Framework de     │                      │                      │
│    Prompting        │                      │                      │
└─────────────────────┴──────────────────────┴──────────────────────┘
```

**Entradas del cliente al inicio del proceso:**

```
Cliente
  ├── Documentación (briefings, specs, manuales)
  ├── Código existente (si aplica)
  └── Bases de datos / modelos de datos
         │
         ▼
    AI Architect
```

**Flujo general entre fases:**

```
CLIENT INPUT
(Docs, Code, DBs)
      │
      ▼
DEFINITION PHASE
  AI Architect
  → Prototype (demo para validar con cliente)
  → Documentación de definición (requisitos, historias, arquitectura)
      │
      ▼  (aprobación humana)
EXECUTION PHASE  ◄─────────────────────────────── KO ─┐
  Back AI Lead ──► Back AI Dev                         │
  Front AI Lead ──► Front AI Dev                       │
      │                                                │
      ▼  (por cada change)                             │
VALIDATION PHASE ──────────────────────────────────────┘
  Outcome Validator
  → Validación técnica + funcional
  → Aprobación de Merge Request
  → Entrega al cliente
      │
      ▼ (OK)
  Siguiente change ──► AI Developer
```

---

## 3. Roles y responsabilidades

La metodología define cuatro roles con responsabilidades diferenciadas. Cada uno opera con contexto acotado a su fase.

### AI Architect

El rol de mayor nivel conceptual. Combina Product Owner y arquitecto de producto. **No implementa código.**

| Responsabilidad | Detalle |
|---|---|
| **Extrae y documenta reglas de negocio** | Transforma el brief del cliente en requisitos formales trazables |
| **Crea agentes y mantiene el repositorio actualizado** | Define los agentes IA necesarios para el proyecto y su configuración |
| **Define proceso e integraciones** | Identifica qué sistemas externos intervienen y cómo |
| **Define el framework de prompting** | Diseña los prompts que usarán los AI Developers — esto es un entregable explícito |
| **Genera el prototipo mockeado** | Construye la demo para validación con el cliente antes de la arquitectura real |
| **Genera guía de estilos + propuesta de arquitectura** | Base visual y estructural que el AI Lead usará para producir la arquitectura técnica definitiva |

### AI Lead (Front / Back)

En proyectos full stack, el AI Lead se desdobla en **Front AI Lead** y **Back AI Lead**, cada uno responsable de su capa. **No implementa código.**

| Responsabilidad | Detalle |
|---|---|
| **Planificación y seguimiento** | Divide el trabajo en sprints/changes por funcionalidades y tecnología |
| **Genera la arquitectura técnica definitiva** | Produce `arquitectura-base.md` a partir de la propuesta de arquitectura y la guía de estilos del AI Architect — documento implementable con decisiones explícitas, árbol de carpetas real y responsabilidades por capa |
| **Refina prompts y agentes específicos** | Toma el framework de prompting del AI Architect y lo adapta a cada change en `prompts_a_ejecutar.md` |
| **Define componentes reutilizables (Tools)** | Identifica abstracciones comunes que los AI Developers pueden reutilizar |
| **Inicializa y configura OpenSpec** | Prepara el entorno de trabajo para los AI Developers |
| **Cierra foundation y libera el primer change** | Ejecuta el ciclo completo de `foundation` y propone el primer change funcional para los Developers |
| **Soporte directo al Dev Team** | Resuelve dudas técnicas y desbloqueos del equipo de desarrollo durante la implementación |

### AI Developer (Front / Back)

Implementa el código siguiendo los prompts predefinidos por el AI Lead en `prompts_a_ejecutar.md`. **No toma decisiones de arquitectura.**

| Responsabilidad | Detalle |
|---|---|
| **Ejecuta el prompt predefinido del change** | Copia el bloque de propose de `prompts_a_ejecutar.md` para su change asignado y lo ejecuta — incluye `/opsx:propose` con todo el contexto necesario |
| **Revisa los artefactos generados** | Lee y comprende `proposal.md`, `design.md` y `tasks.md` antes de implementar |
| **Lanza la implementación** | Ejecuta `/opsx:apply [change-name]` |
| **Valida y testea el código generado** | Prueba manualmente que la aplicación funciona end-to-end |
| **Corrige los bugs de implementación** | Itera hasta que el código está limpio para entregar al Outcome Validator |
| **Prepara la feature para integración** | Verifica que el branch está actualizado, el código sin conflictos y la feature lista para abrir el Merge Request |
| **Entrega al Outcome Validator** | Entrega la feature al Validator para la validación técnica y funcional |

### Outcome Validator

QA técnico y funcional del ciclo. Su aprobación es el paso previo obligatorio antes de archivar cualquier change. **No implementa.**

| Responsabilidad | Detalle |
|---|---|
| **Revisión funcional** | Verifica que cada criterio de aceptación está cumplido |
| **Revisión técnica** | Revisa el código generado por la IA en busca de errores, deuda o malas prácticas |
| **Validación de estándares y patrones** | Comprueba que el código sigue la arquitectura y guía de estilos definidas |
| **Devuelve al AI Developer** | Cualquier problema detectado — con descripción, criterio que falla y evidencia |
| **Aprobación de Merge Requests** | Es la firma final antes de que el change se integre en la rama principal |
| **Archiva el change validado** | Ejecuta `/opsx:archive [change-name]` y sincroniza las specs |
| **Lanza el siguiente change** | Tras archivar, habilita al Developer para que ejecute el prompt del siguiente change |

---

## 4. Documentos del proyecto

Cada fase produce documentos que son la entrada de la siguiente. El humano revisa y aprueba cada documento antes del handoff.

```
docs/
├── cliente-requisitos.md          ← Fase 0 — brief del cliente
├── requisitos.md                  ← AI Architect / Fase 1
├── mapa-historias-usuario.md      ← AI Architect / Fase 1
├── detalle-historias-usuario.md   ← AI Architect / Fase 1
├── arquitectura-base-prototipo.md ← AI Architect / Fase 2
├── guia-estilos.md                ← AI Architect / Fase 2
├── propuesta-arquitectura-base.md ← AI Architect / Fase 2
├── prompts_a_ejecutar.md          ← AI Architect / Fase 2 (borrador) · AI Lead / Fase 3 (definitivo)
├── arquitectura-base.md           ← AI Lead / Fase 3
└── sprints-desarrollo.md          ← AI Lead / Fase 3
```

---

## 5. Fases en detalle

### Fase 0 — Inicialización del proyecto

**Propósito:** Preparar el entorno antes de que ningún rol de IA produzca contenido. La ejecuta el humano de forma colaborativa con la IA.

**Tareas:**
- Recopilar toda la documentación, código y modelos de datos del cliente
- Inicializar repositorio git con estructura de carpetas base
- Crear `CLAUDE.md` con contexto, stack y convenciones del proyecto
- Definir el stack tecnológico y las restricciones no negociables
- Capturar el brief en `docs/cliente-requisitos.md`

**Criterio de salida:** Existe `cliente-requisitos.md` con suficiente contexto para que el AI Architect arranque sin preguntas.

**Prompt plantilla:**
```prompt
Actúa como consultor técnico experto. Ayúdame a estructurar la información 
de este proyecto antes de comenzar el desarrollo.

Contexto del cliente: [DESCRIPCIÓN DEL PROYECTO]
Stack tecnológico decidido: [STACK]
Restricciones conocidas: [RESTRICCIONES]
Documentación aportada: [LISTAR DOCUMENTOS/CÓDIGO/DATOS]

A partir de esta información:
1. Formula las preguntas clave que necesitamos responder antes de empezar
2. Identifica riesgos y ambigüedades a resolver
3. Propón la estructura inicial de carpetas y documentos
4. Sugiere qué información adicional necesitamos del cliente

Guarda el resultado como borrador en docs/cliente-requisitos.md
```

---

### Fase 1 — Definición (AI Architect) · DEFINITION

**Propósito:** Transformar el brief del cliente en documentos formales que sirvan de contexto estructurado para todos los agentes IA del proyecto. Sin esta fase completa y aprobada, no se puede diseñar ni implementar nada.

**Entradas:** `cliente-requisitos.md` + documentación/código/datos del cliente  
**Salidas:** `requisitos.md`, `mapa-historias-usuario.md`, `detalle-historias-usuario.md`

#### Paso 1.1 — Requisitos formales

**Prompt plantilla:**
```prompt
Actúa como Product Owner experto en [DOMINIO DEL PROYECTO].

Lee el documento [cliente-requisitos.md](docs/cliente-requisitos.md) y genera 
requisitos formales estructurados que sirvan de base para el desarrollo.

El documento debe incluir:
- Descripción del sistema y sus objetivos
- Usuarios y roles con sus permisos
- Requisitos funcionales numerados y trazables (RF-XX)
- Requisitos no funcionales: rendimiento, seguridad, RGPD, accesibilidad (NFR-XX)
- Restricciones técnicas no negociables
- Alcance explícito: qué está dentro y qué fuera de Fase 1
- Variables de entorno y configuración requerida

Usa IDs trazables en cada requisito. Guarda en docs/requisitos.md
```

#### Paso 1.2 — Mapa de historias de usuario

**Prompt plantilla:**
```prompt
Actúa como Product Owner experto en [DOMINIO DEL PROYECTO].

Lee [requisitos.md](docs/requisitos.md) y descomponlo en un mapa de historias 
de usuario organizado por actividades (backbone) y fases de desarrollo.

El mapa debe:
- Definir las personas/roles de usuario
- Organizar historias en backbone de actividades principales
- Agrupar por fases (F0: foundation, F1: [módulo], F2: [módulo]...)
- Para cada historia: ID único, "Como [rol], quiero [acción] para [objetivo]"
- Criterio de salida por fase
- Priorización MoSCoW para Fase 1
- Referencia al RF correspondiente

Guarda en docs/mapa-historias-usuario.md
```

#### Paso 1.3 — Detalle de historias de usuario

**Prompt plantilla:**
```prompt
Actúa como Product Owner experto y especialista en criterios de aceptación.

Lee:
- [requisitos.md](docs/requisitos.md)
- [mapa-historias-usuario.md](docs/mapa-historias-usuario.md)

Para cada historia genera:
- Descripción completa
- Prioridad (Alta/Media/Baja) dentro de su fase
- Estimación orientativa (S ≤ 2 días · M 3-5 días · L 1-2 semanas)
- Criterios de aceptación verificables (Dado/Cuando/Entonces o lista numerada)
- Marca con ⚠️ los criterios bloqueantes para el criterio de salida de fase
- Notas técnicas y dependencias relevantes

Guarda en docs/detalle-historias-usuario.md
```

**Criterio de salida de Fase 1:** Cada requisito tiene al menos una historia. Cada historia tiene criterios de aceptación verificables. Humano ha aprobado los tres documentos.

---

### Fase 2 — Diseño (AI Architect) · DEFINITION

**Propósito:** Traducir las historias en arquitectura visual y técnica validable. Incluye la construcción del prototipo para validación con cliente, la guía de estilos, la propuesta de arquitectura y — clave — el **framework de prompting** que usarán los AI Developers.

**Entradas:** `requisitos.md`, `mapa-historias-usuario.md`, `detalle-historias-usuario.md`  
**Salidas:** `arquitectura-base-prototipo.md`, `guia-estilos.md`, `propuesta-arquitectura-base.md`, `prompts_a_ejecutar.md` (borrador)

#### Paso 2.1 — Arquitectura del prototipo

El prototipo sirve para validar con el cliente antes de invertir en la arquitectura real. **Todo se mockea.**

**Prompt plantilla:**
```prompt
Actúa como Product Owner y arquitecto de software.

Con base en:
- [mapa-historias-usuario.md](docs/mapa-historias-usuario.md)
- [detalle-historias-usuario.md](docs/detalle-historias-usuario.md)

Genera una arquitectura base simple para una demo 100% mockeada, orientada 
a validar requisitos con el cliente.

Incluye:
- Stack mínimo (prioriza velocidad sobre corrección técnica)
- Componentes y módulos para los flujos principales
- Pantallas o endpoints mínimos para recorrer casos de uso clave
- Estrategia de mocks: qué se simula y cómo
- Datos de ejemplo coherentes con el dominio
- Supuestos tomados y exclusiones explícitas
- Pasos mínimos de implementación ordenados
- La demo no debe incluir mockeado de productos de terceros, centrandose solanmente en lo que generaran los requisitos a nivel de interfaz de usuario

La demo debe poder recorrerse de punta a punta sin bloqueos.
Guarda en docs/arquitectura-base-prototipo.md
```

#### Paso 2.2 — Implementación del prototipo

**Prompt plantilla:**
```prompt
Actúa como experto en desarrollo de software y prototipado de producto.

Implementa la demo funcional descrita en 
[arquitectura-base-prototipo.md](docs/arquitectura-base-prototipo.md).

Toma como base también:
- [mapa-historias-usuario.md](docs/mapa-historias-usuario.md)
- [detalle-historias-usuario.md](docs/detalle-historias-usuario.md)

Instrucciones:
- Implementa solo lo necesario para los flujos principales
- Mockea TODO lo externo: APIs, BD, auth, notificaciones, integraciones
- Usa datos de ejemplo coherentes con el dominio
- Si falta detalle funcional, toma la opción más simple y documéntala
- La app debe arrancar con un solo comando
- Incluye README.md mínimo con instrucciones de arranque

Entrega: código funcional + datos mock + README
```

> **Punto de validación humana:** El humano presenta el prototipo al cliente, recoge feedback y actualiza `cliente-requisitos.md` antes de continuar. **Si hay cambios significativos, se vuelve al Paso 1.1.**

#### Paso 2.3 — Guía de estilos y propuesta de arquitectura

**Prompt plantilla:**
```prompt
Actúa como experto en diseño de producto, sistemas de diseño y arquitectura frontend.

A partir de [detalle-historias-usuario.md](docs/detalle-historias-usuario.md) 
y teniendo en cuenta que la identidad visual es [REFERENCIA VISUAL/MARCA]:

**docs/guia-estilos.md** — incluye:
- Principios de diseño y UX
- Paleta de colores con valores hex, tipografía, espaciado, iconografía
- Design tokens CSS (custom properties concretas)
- Componentes base y pautas de uso
- Reglas de responsive y accesibilidad (WCAG 2.1 AA)
- Estructura de pantallas y criterios de navegación

**docs/propuesta-arquitectura-base.md** — incluye:
- Stack técnico recomendado con justificación
- Organización de módulos y capas
- Gestión de estado y flujo de datos
- Estrategia de testing
- Consideraciones de seguridad y escalabilidad
- Recomendaciones técnicas alineadas con las historias
```

#### Paso 2.4 — Framework de prompting (borrador)

El AI Architect define el esqueleto de prompts que los AI Developers ejecutarán. El AI Lead los refinará en Fase 3.

**Prompt plantilla:**
```prompt
Actúa como AI Architect experto en prompting para desarrollo de software.

Con base en:
- [detalle-historias-usuario.md](docs/detalle-historias-usuario.md)
- [propuesta-arquitectura-base.md](docs/propuesta-arquitectura-base.md)
- [guia-estilos.md](docs/guia-estilos.md) (si el proyecto tiene capa de UI)

Genera el borrador del framework de prompting para los AI Developers:
- Agrupa las historias de usuario en bloques lógicos de desarrollo (futuros sprints/changes)
- Un prompt por bloque, referenciando los documentos de contexto necesarios
- Cada prompt incluye las historias asignadas, criterios a cumplir e instrucciones
- Incluye los comandos OpenSpec correspondientes

Guarda en docs/prompts_a_ejecutar.md
IMPORTANTE: Este es un borrador sin planificación de sprints definitiva — el AI Lead lo refinará en Fase 3 una vez generados arquitectura-base.md y sprints-desarrollo.md.
```

**Criterio de salida de Fase 2:** Prototipo validado por el cliente. Guía de estilos y propuesta de arquitectura aprobadas. Borrador de prompts listo para el AI Lead.

---

### Fase 3 — Planificación (AI Lead) · DEFINITION → EXECUTION

**Propósito:** El AI Lead toma los documentos del AI Architect y planifica la ejecución: consolida la arquitectura técnica definitiva, descompone en sprints, refina el framework de prompting e inicializa OpenSpec. Esta fase cierra DEFINITION y abre EXECUTION.

**Entradas:** `mapa-historias-usuario.md`, `detalle-historias-usuario.md`, `propuesta-arquitectura-base.md`, `guia-estilos.md`, `prompts_a_ejecutar.md` (borrador)  
**Salidas:** `arquitectura-base.md`, `sprints-desarrollo.md`, `prompts_a_ejecutar.md` (definitivo), OpenSpec inicializado

#### Paso 3.1 — Arquitectura técnica definitiva

El AI Lead consolida la arquitectura real del producto, partiendo de la propuesta de arquitectura y la guía de estilos del AI Architect, una vez validado el prototipo y cerrado el feedback del cliente.

**Prompt plantilla:**
```prompt
Actúa como arquitecto de software senior con enfoque práctico de implementación.

Analiza como fuentes de verdad:
- [detalle-historias-usuario.md](docs/detalle-historias-usuario.md)
- [propuesta-arquitectura-base.md](docs/propuesta-arquitectura-base.md)
- [guia-estilos.md](docs/guia-estilos.md)

Genera el documento técnico definitivo de arquitectura. Debe:
- Estar alineado con historias, propuesta funcional y guía de estilos
- Ser implementable, consistente y escalable
- Evitar contenido genérico — cada decisión debe ser explícita
- Documentar supuestos cuando falte detalle
- No contradecir ningún documento de entrada

Incluye obligatoriamente:
- Objetivo y alcance
- Principios y decisiones arquitectónicas
- Estructura de la solución (árbol de carpetas real)
- Descomposición por módulos/dominios
- Capas y responsabilidades
- Componentes base y relaciones
- Flujos principales de información
- Estrategia de gestión de estado
- Navegación y organización de pantallas/endpoints
- Integración con APIs y servicios externos
- Seguridad, accesibilidad, observabilidad y rendimiento
- Escalabilidad, mantenibilidad y extensibilidad
- Riesgos técnicos, supuestos y decisiones pendientes

Guarda en docs/arquitectura-base.md
```

#### Paso 3.2 — Planificación de sprints

**Prompt plantilla:**
```prompt
Actúa como Product Owner experto en planificación de desarrollo con IA.

Analiza:
- [mapa-historias-usuario.md](docs/mapa-historias-usuario.md)
- [detalle-historias-usuario.md](docs/detalle-historias-usuario.md)
- [arquitectura-base.md](docs/arquitectura-base.md)

Planifica el desarrollo en sprints de [DURACIÓN] semanas (un change OpenSpec por sprint).

El documento debe incluir:
- Resumen ejecutivo (total historias, sprints, duración estimada, stack)
- Decisiones previas al Sprint 0 que deben resolverse antes de empezar
- Vista global de todos los sprints
- Por cada sprint:
  - Change name (para OpenSpec)
  - Objetivo
  - Historias incluidas con estimación
  - Entregables técnicos concretos
  - Criterio de salida verificable
  - Dependencias con sprints anteriores

Guarda en docs/sprints-desarrollo.md
```

#### Paso 3.3 — Refinamiento del framework de prompting

**Prompt plantilla:**
```prompt
Actúa como AI Lead responsable de los AI Developers.

Toma el borrador de [prompts_a_ejecutar.md](docs/prompts_a_ejecutar.md) y 
refínalo con base en [sprints-desarrollo.md](docs/sprints-desarrollo.md) y 
[arquitectura-base.md](docs/arquitectura-base.md).

Para cada sprint/change, el prompt debe incluir:
- Comando OpenSpec exacto a ejecutar
- Historias asignadas con referencia al detalle
- Contexto técnico específico del change
- Instrucciones de implementación concretas
- Criterios de verificación post-implementación
- Posibles problemas y cómo resolverlos

Sobreescribe docs/prompts_a_ejecutar.md con la versión definitiva.
IMPORTANTE: No modifiques ningún fichero de OpenSpec todavía.
```

#### Paso 3.4 — Inicialización de OpenSpec

```bash
# 1. Instalar OpenSpec
npm install -g @fission-ai/openspec@latest

# 2. Inicializar el proyecto
openspec init
```

Tras `openspec init`, el AI Lead configura `openspec/config.yaml`:

**Prompt plantilla:**
```prompt
Actúa como AI Lead experto en OpenSpec.

Configura el fichero openspec/config.yaml del proyecto con base en:
- [arquitectura-base.md](docs/arquitectura-base.md)
- [sprints-desarrollo.md](docs/sprints-desarrollo.md)

El config.yaml debe reflejar:
- Nombre y descripción del proyecto
- Stack tecnológico
- Rutas de frontend y backend
- Módulos y dominios definidos en la arquitectura
- Convenciones de nomenclatura

Actualiza openspec/config.yaml con esta información.
```

#### Paso 3.5 — Apertura del primer change

**Conceptos clave de OpenSpec:**

Un **change** es la unidad de trabajo de OpenSpec: equivale a un sprint o feature acotada. Cada change tiene su propia documentación (historias asignadas, archivos que va a tocar, criterios de salida) y pasa por un ciclo de vida cerrado. Los cuatro comandos del ciclo son:

| Comando | Quién lo ejecuta | Qué hace |
|---|---|---|
| `/opsx:propose [nombre]` | AI Lead (foundation + primer change) / AI Developer (resto) | Recibe el prompt del change desde `prompts_a_ejecutar.md` y genera los artefactos de documentación: `proposal.md`, `design.md`, `tasks.md`. |
| `/opsx:apply [nombre]` | AI Developer | Lee la documentación generada por el propose y produce el código. |
| `/opsx:archive [nombre]` | Outcome Validator | Cierra el change validado, archiva sus specs y las sincroniza al estado general. |
| `/opsx:explore [nombre]` | Outcome Validator / AI Lead | Inspecciona el estado del proyecto frente a los criterios definidos. Usado principalmente para el checklist de go-live al final del proyecto. |

El documento `prompts_a_ejecutar.md` estructura cada change en tres bloques: el **prompt de propose** (rico en contexto: objetivos, entregables, criterios de aceptación) y los comandos de **apply** y **archive** (una línea cada uno). El AI Lead ejecuta el propose solo para `foundation` y el primer change funcional. Para el resto, son los AI Developers quienes copian y ejecutan el bloque de propose de su change asignado. El comando `/opsx:explore` es de uso puntual a nivel de proyecto — no forma parte del ciclo por change — y se usa típicamente para el checklist de go-live al final del desarrollo.

---

**Change `foundation`** — siempre el primero, siempre especial. No implementa funcionalidad: establece la estructura base del proyecto (árbol de carpetas, configuración, archivos iniciales). Es el equivalente al commit inicial pero gestionado por OpenSpec. Sin él, los changes funcionales no tienen base sobre la que operar.

`foundation` tiene su propio prompt en `prompts_a_ejecutar.md`. El AI Lead lo usa al proponer el change.

1. Copiar el prompt de propose de `foundation` desde `prompts_a_ejecutar.md` y ejecutar `/opsx:propose foundation`
2. Revisar y ajustar los artefactos generados — verificar que la estructura coincide con `arquitectura-base.md`
3. Ejecutar `/opsx:apply foundation`
4. Verificar el resultado: árbol de carpetas, archivos de configuración y estructura base correctos
5. Ejecutar `/opsx:archive foundation`
6. Sincronizar las specs al estado general: *"Sincroniza las delta specs archivadas a openspec/specs"*

**Primer change funcional** — el AI Lead propone el primer change real (según `sprints-desarrollo.md`) usando su prompt de `prompts_a_ejecutar.md` y entrega los artefactos al equipo de desarrollo:

1. Copiar el prompt de propose del primer change desde `prompts_a_ejecutar.md` y ejecutar `/opsx:propose [nombre]`
2. Revisar y pulir los artefactos generados — son el material que recibirán los AI Developers
3. Handoff a AI Developers: el desarrollo puede comenzar

**Criterio de salida de Fase 3:** Sprints planificados y aprobados por el equipo técnico. Decisiones pendientes resueltas. OpenSpec inicializado y configurado. Primer change listo para los AI Developers.

---

### Fase 4 — Implementación (AI Developer) · EXECUTION

**Propósito:** Implementar el código de cada change de forma controlada y trazable. Los AI Developers siguen los prompts predefinidos — no improvisan decisiones de arquitectura.

**Entradas:** `prompts_a_ejecutar.md`, `arquitectura-base.md`, `detalle-historias-usuario.md`, change activo en OpenSpec

#### Ciclo de implementación por change

```
AI Developer: copia el bloque de propose de prompts_a_ejecutar.md
        │
        ▼
/opsx:propose [change-name]  (con todo el contexto del prompt)
AI Developer revisa los artefactos generados
(proposal.md, design.md, tasks.md)
        │
        ▼
/opsx:apply [change-name]
        │
        ▼
AI Developer prueba manualmente (levanta la aplicación)
Corrige los bugs de implementación
        │
        ▼  ── Handoff al Outcome Validator ──
        │
Outcome Validator valida (técnico + funcional)
        │
   ┌────┴────────────┐
   │                 │
 OK ✓             KO ✗
   │                 │
   │   → Devuelve al AI Developer
   │     (Dev corrige, itera hasta OK)
   ▼
Outcome Validator aprueba el Merge Request
        │
        ▼
/opsx:archive [change-name]
"Sincroniza las delta specs archivadas a openspec/specs"
        │
        ▼
Outcome Validator lanza el siguiente change
        │
        ▼
AI Developer ejecuta el prompt del siguiente change
```

**Prompt del AI Developer** (extraído de `prompts_a_ejecutar.md` para cada change):

El bloque de cada change en `prompts_a_ejecutar.md` tiene esta estructura:

```prompt
/opsx:propose [change-name]

CONTEXTO
[Estado del proyecto en este punto del desarrollo]

OBJETIVO
[Qué debe quedar operativo al finalizar este change]

ENTREGABLES
[Lista detallada de endpoints, pantallas, modelos y servicios a implementar]

CRITERIOS DE ACEPTACIÓN BLOQUEANTES
[Criterios mínimos verificables para cerrar el change]
```

El Developer copia este bloque completo, lo ejecuta (lo que genera los artefactos del change), revisa la documentación generada y a continuación ejecuta `/opsx:apply [change-name]`.

**Prompt de validación (Outcome Validator):**
```prompt
Actúa como QA técnico y funcional senior.

Valida completamente el change '[CHANGE-NAME]'.

Documentos de referencia:
- Criterios de aceptación: [detalle-historias-usuario.md](docs/detalle-historias-usuario.md)
  historias: [IDs]
- Arquitectura esperada: [arquitectura-base.md](docs/arquitectura-base.md)
- Guía de estilos: [guia-estilos.md](docs/guia-estilos.md)

Para cada criterio de aceptación:
1. Verifica que está implementado correctamente
2. Prueba el caso positivo y el negativo
3. Verifica que no hay regresiones en funcionalidad anterior

Revisión técnica:
- El código sigue los patrones de arquitectura-base.md
- Los estilos siguen guia-estilos.md
- No hay deuda técnica evidente ni malas prácticas

Si encuentras algún problema:
- Devuélvelo al AI Developer con descripción, criterio que falla y evidencia
- El Developer corrige e itera hasta que el change pase la validación

Si todo está correcto:
- Aprueba el Merge Request
- Ejecuta: /opsx:archive [change-name]
- Lanza el siguiente change — habilita al AI Developer para el siguiente bloque
```

---

### Fase 5 — Onboarding de proyectos existentes

**Propósito:** Incorporar la metodología AI-Native en un proyecto que ya está en marcha. El reto es generar los documentos de contexto a partir del código existente sin interrumpir el desarrollo.

#### Estrategia

```
Proyecto existente (código + docs parciales)
        │
        ▼
Paso 1: Documentación inversa (AI Architect)
  Analiza el código y genera los documentos que faltan
        │
        ▼
Paso 2: Reconciliación (humano)
  Revisa discrepancias entre lo documentado y lo implementado
        │
        ▼
Paso 3: Normalización OpenSpec (AI Lead)
  openspec init
  Change 'legacy-sync' para registrar el estado actual
        │
        ▼
Paso 4: Incorporación al flujo normal
  Toda nueva funcionalidad sigue el ciclo AI-Native
```

**Prompt de documentación inversa (AI Architect):**
```prompt
Actúa como arquitecto de software senior y Product Owner.

Analiza el código y la estructura del proyecto existente en este repositorio.
Genera los documentos que faltan para incorporar este proyecto al flujo AI-Native:

1. docs/requisitos.md — infiere los requisitos de las funcionalidades existentes
2. docs/mapa-historias-usuario.md — construye el mapa de lo ya implementado
3. docs/arquitectura-base.md — documenta la arquitectura real actual (no la ideal)

Para cada documento:
- Basa el contenido en lo que realmente existe en el código
- Marca con ⚠️ LEGACY las partes que no siguen buenas prácticas
- Marca con ❓ UNKNOWN lo que no puedes inferir con certeza
- Añade sección "Deuda técnica identificada"

Objetivo: fotografía fiel del estado actual, no del estado ideal.
```

---

## 6. Configuración del entorno de trabajo

### CLAUDE.md

Ancla de contexto permanente para todas las sesiones de IA en el proyecto:

```markdown
# [NOMBRE DEL PROYECTO] — CLAUDE.md

## Contexto del proyecto
[Descripción breve del proyecto y su propósito de negocio]

## Stack tecnológico
[Listado del stack decidido con versiones]

## Restricciones no negociables
[Decisiones técnicas que no se cuestionan]

## Convenciones de código
- Idioma de comentarios: [idioma]
- Nomenclatura de variables: [convención]
- Nomenclatura de ficheros: [convención]

## Roles activos en este proyecto
- AI Architect: [modelo/instancia]
- AI Lead Front: [modelo/instancia]
- AI Lead Back: [modelo/instancia]
- AI Developer: [modelo/instancia]
- Outcome Validator: [modelo/instancia]

## Documentos clave
- Requisitos: docs/requisitos.md
- Historias: docs/mapa-historias-usuario.md
- Criterios: docs/detalle-historias-usuario.md
- Arquitectura: docs/arquitectura-base.md
- Prompts: docs/prompts_a_ejecutar.md

## Lo que NO se hace en este proyecto
[Lista explícita de exclusiones técnicas y funcionales]
```

### Gestión de contexto entre sesiones

La IA no tiene memoria entre sesiones. Para garantizar coherencia:

1. **Iniciar cada sesión** referenciando los documentos del rol activo
2. **Nunca asumir** que la IA recuerda decisiones anteriores — incluirlas en el prompt
3. **Los documentos son la memoria** — si algo no está documentado, no existe
4. **El CLAUDE.md** es el ancla de contexto persistente en cada sesión
5. **Ante cualquier duda**, el AI Developer toma la opción más conservadora y la documenta en el change; si necesita ayuda, cuenta con el soporte directo del AI Lead

---

## 7. Estructura de carpetas recomendada

```
proyecto/
├── CLAUDE.md                          # contexto permanente para la IA
├── docs/
│   ├── cliente-requisitos.md          # brief del cliente (Fase 0)
│   ├── requisitos.md                  # requisitos formales (Fase 1)
│   ├── mapa-historias-usuario.md      # mapa de historias (Fase 1)
│   ├── detalle-historias-usuario.md   # criterios de aceptación (Fase 1)
│   ├── arquitectura-base-prototipo.md # arquitectura demo (Fase 2)
│   ├── guia-estilos.md                # design system (Fase 2)
│   ├── propuesta-arquitectura-base.md # propuesta técnica (Fase 2)
│   ├── prompts_a_ejecutar.md          # framework de prompting (Fase 2/3)
│   ├── arquitectura-base.md           # arquitectura definitiva (Fase 3)
│   └── sprints-desarrollo.md          # planificación (Fase 3)
├── frontend/
├── backend/
└── openspec/                          # generado por OpenSpec
    ├── config.yaml
    ├── specs/
    └── changes/
```

---

## 8. Checklist de calidad por fase

### Fase 1 — Definición
- [ ] Todos los requisitos tienen ID trazable (RF-XX, NFR-XX)
- [ ] Cada RF tiene al menos una historia de usuario
- [ ] Cada historia tiene criterios de aceptación verificables
- [ ] El alcance (dentro/fuera) está explícitamente definido
- [ ] Humano ha aprobado los tres documentos

### Fase 2 — Diseño
- [ ] El prototipo ha sido presentado y validado por el cliente
- [ ] El feedback del cliente está incorporado en `cliente-requisitos.md`
- [ ] La guía de estilos define design tokens CSS concretos
- [ ] La propuesta de arquitectura justifica cada decisión de stack
- [ ] El borrador de `prompts_a_ejecutar.md` agrupa las historias en bloques lógicos de desarrollo
- [ ] Humano ha aprobado todos los documentos

### Fase 3 — Planificación
- [ ] Decisiones pendientes críticas resueltas antes del Sprint 0
- [ ] Cada sprint tiene criterio de salida verificable
- [ ] `prompts_a_ejecutar.md` definitivo: prompts ejecutables sin ambigüedad
- [ ] `arquitectura-base.md` generada por el AI Lead (Paso 3.1) y revisada por el equipo técnico
- [ ] OpenSpec inicializado: `openspec init`
- [ ] `openspec/config.yaml` configurado correctamente
- [ ] Change `foundation` propuesto, aplicado y archivado
- [ ] Primer change funcional propuesto y listo para AI Developers

### Por cada change (Fase 4)
- [ ] **[AI Developer]** Copia el bloque de propose de `prompts_a_ejecutar.md` y ejecuta `/opsx:propose [name]`
- [ ] **[AI Developer]** Revisa los artefactos generados (`proposal.md`, `design.md`, `tasks.md`)
- [ ] **[AI Developer]** Ejecuta `/opsx:apply [name]` sin errores
- [ ] **[AI Developer]** Prueba manualmente end-to-end y corrige bugs de implementación
- [ ] **[AI Developer]** Prepara la feature para integración — branch actualizado, sin conflictos, MR listo
- [ ] **[Outcome Validator]** Verifica todos los criterios de aceptación (funcional + técnico)
- [ ] **[Outcome Validator]** Devuelve al AI Developer cualquier problema detectado (con descripción, criterio que falla y evidencia)
- [ ] **[Outcome Validator]** Aprueba el Merge Request
- [ ] **[Outcome Validator]** Ejecuta `/opsx:archive [name]` y sincroniza specs
- [ ] **[Outcome Validator]** Lanza el siguiente change — habilita al Developer para el próximo bloque

---

## 9. Señales de alerta

| Señal | Causa probable | Acción |
|---|---|---|
| El código no refleja lo definido en los documentos | El AI Developer no leyó los documentos del change | Revisar el prompt del change y re-implementar |
| Los documentos se contradicen entre sí | No se hizo handoff explícito entre fases | Reconciliar documentos antes de continuar |
| El AI Developer toma decisiones de arquitectura | `arquitectura-base.md` tiene lagunas o ambigüedades | El AI Lead completa `arquitectura-base.md` y ajusta los prompts afectados |
| El cliente rechaza algo en demo avanzada | Se saltó la validación del prototipo | Volver a Fase 2 con el feedback recibido |
| La IA "recuerda" decisiones sin documentar | Se está usando el historial como memoria | Documentar la decisión y referenciarla en el prompt |
| Los changes se acumulan sin validar | El Outcome Validator no está activo | No avanzar al siguiente change hasta cerrar el actual |
| El AI Developer improvisa componentes o patrones | Los prompts del AI Lead son ambiguos | El AI Lead refina `prompts_a_ejecutar.md` |
| El Outcome Validator aprueba sin revisar el código | El rol está siendo ejecutado superficialmente | El Outcome Validator debe hacer revisión técnica real, no solo funcional |
| El AI Lead no desdobla Front/Back | El proyecto tiene complejidad en ambas capas | Separar en Front AI Lead + Back AI Lead con changes independientes |

---

## 10. Registro de decisiones sobre el framework

Tabla de cambios propuestos sobre esta metodología. Sirve como log para el responsable del framework. Tras la última revisión, los cambios que se habían aplicado se han **revertido en el cuerpo del documento** para ceñirse al proceso original (imágenes de referencia) y quedan registrados aquí como **Pendiente** de decisión.

| # | Área | Estado | Descripción del cambio | Justificación |
|---|---|---|---|---|
| 001 | Roles / Fase 2-3 | **Pendiente** | Mover la generación de `arquitectura-base.md` de Fase 3 (AI Lead) a Fase 2 (AI Architect). | Podría argumentarse que la arquitectura es una decisión de diseño técnico (AI Architect), no de planificación. **No aplicado:** el proceso original (imagen `05`) muestra que el AI Lead "genera la arquitectura de la aplicación" en Fase 3; el cuerpo del documento mantiene esa asignación. |
| 002 | Fase 2 / Paso 2.4 | **Pendiente de decisión** | Eliminar el borrador de `prompts_a_ejecutar.md` del AI Architect (Paso 2.4) y generar el documento desde cero en Fase 3 (AI Lead, Paso 3.3) | El borrador generado en 2.4 tiene valor si el AI Lead lo toma como esqueleto estructural, ya que el Architect agrupa las historias con criterio funcional y el Lead las ajusta con criterio de planificación. Sin embargo, si en la práctica el Lead reescribe el documento ignorando el borrador, el paso es trabajo redundante. Se recomienda evaluar en proyectos reales si el borrador aporta coherencia al resultado final o genera ruido. |
| 003 | Roles / Fase 4 | **Revertido** | Se propuso que el AI Lead ejecutara todos los proposes sprint a sprint en lugar del Developer. Revertido al proceso original: el Developer ejecuta el bloque de propose de `prompts_a_ejecutar.md` para su change asignado. | El proceso original (imágenes de referencia) muestra que los Developers "ejecutan prompts predefinidos" y el Outcome Validator "lanza el siguiente change". El Lead solo interviene en foundation y primer change. |
| 004 | Roles / Outcome Validator | **Pendiente** | Convertir al Outcome Validator en capa de diagnóstico que clasifica cada problema por naturaleza: implementación (→ Dev), spec (→ Lead) o arquitectónico (→ Lead para escalar al Architect). | Daría al Validator un rol explícito de diagnóstico y escalado, ya que tiene visión completa del change. **No aplicado:** en el proceso original (imagen `09`) el Validator devuelve cualquier problema directamente al AI Developer. (Nota: "lanzar el siguiente change" sí forma parte del proceso base, no de esta propuesta, y se mantiene en el cuerpo.) |
| 005 | Cadena de comunicación | **Pendiente** | Cadena de escalado formal Dev → Outcome Validator → Lead → Architect, en la que el Dev no habla directamente con el Lead. | Acotaría la información que recibe cada rol, con el Validator como filtro entre implementación y planificación. **No aplicado:** el proceso original (imagen de roles) asigna al AI Lead "Soporte directo al Dev Team"; el cuerpo mantiene ese soporte directo. |
| 006 | Roles / Fase 4 | **Pendiente de discusión con manager** | Propuesta alternativa: el AI Lead ejecuta los proposes de todos los changes (en lugar del Developer), revisa los artefactos y los entrega ya validados. El Developer solo haría apply + verificación. | Ventaja: el Lead actúa como control de calidad de las specs antes de que el Developer las consuma, reduciendo el riesgo de implementar sobre specs incorrectas. Desventaja: alarga la fase de planificación y requiere que el Lead tenga disponibilidad continua durante el desarrollo. Pendiente de validar si aporta suficiente valor en proyectos reales. |
| 007 | Fase 3 / Planificación de sprints | **Pendiente** | Organizar los changes en bloques de dependencia explícitos para que los changes independientes de un mismo sprint puedan asignarse a distintos AI Developers y ejecutarse en paralelo (un sprint agruparía varios changes coordinados, no uno solo). | Un modelo paralelo aprovecharía mejor el equipo y acortaría el tiempo de entrega: los changes sin dependencias mutuas irían en el mismo bloque y los bloqueantes en bloques posteriores. **No aplicado:** el proceso original es serial — "un change OpenSpec por sprint" y el Outcome Validator "lanza el siguiente change" de uno en uno; el cuerpo mantiene el modelo serial. |
