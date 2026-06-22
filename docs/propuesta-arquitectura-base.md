# Propuesta de arquitectura base — CheckList

> Documento de Fase 2 (AIDD · paso 2.3). Generado por `aidd architecture-proposal`.
> Entrada: docs/detalle-historias-usuario.md. Propuesta, no arquitectura definitiva.
> Pendiente de aprobacion humana.

**Versión:** 1.0 · **Fecha:** 2026-06-22 · **Estado:** 🟢 Aprobado

> Esta es una **propuesta** que fija las decisiones de stack que los requisitos dejaron abiertas (RT-5). Tras su aprobación, `aidd architecture` (2.4) la materializa en la arquitectura definitiva e implementable (árbol de carpetas, módulos, etc.).

---

## 1. Stack técnico recomendado

Principio rector: **simplicidad de mantenimiento** (NFR-08) y "lo simple frente a lo sofisticado", para una app interna (RT-1), de una sola lista (RT-2), equipo de 5-10 personas y carga muy baja.

| Capa | Tecnología recomendada | Justificación (ligada a historia/NFR/restricción) |
|---|---|---|
| **Lenguaje** | **TypeScript** (front y back) | Un único lenguaje en todo el proyecto reduce coste cognitivo y de mantenimiento (NFR-08); el tipado evita errores en las reglas de validación (HU-02/HU-04, NFR-12). |
| **Frontend (SPA)** | **React 18 + Vite** | Decisión del usuario (Node backend + framework SPA). React + Vite es el ecosistema más extendido → mayor base de talento y mantenibilidad (NFR-08). Vite ya está implícito en el tooling (Playwright se usó para el prototipo). *Vue 3 + Vite sería equivalente; ver D-28.* |
| **Estado en cliente** | **Zustand** (o Context + hooks) | Estado pequeño (una lista, ≤100 tareas). Un store ligero basta; evita el boilerplate de Redux. Sirve de única fuente local sincronizada por WebSocket (HU-09). |
| **Backend / API** | **Node + Fastify** | Fastify es ligero, rápido y con validación de esquemas integrada (útil para NFR-12 y reglas de HU-02/HU-04). Sirve REST + estáticos + canal de tiempo real desde un solo proceso. |
| **Tiempo real (RF-09)** | **WebSocket** vía **Socket.IO** | RF-09/NFR-06 exigen propagación casi inmediata (<1 s) sin recargar. Socket.IO simplifica reconexión y *broadcast* a todos los clientes; encaja con last-write-wins (NFR-11). *Alternativa más mínima: `ws` nativo; ver D-29.* |
| **Base de datos (RT-4, NFR-09)** | **SQLite** (acceso vía `better-sqlite3`) | Decisión del usuario. Fichero único, cero administración, persistencia entre sesiones/dispositivos (NFR-09) como fuente única de verdad (RT-4). Sobrado para 1 lista y ≤100 tareas (NFR-12). Migrable a PostgreSQL si la escala creciera. |
| **Acceso a datos** | Capa de repositorio fina sobre `better-sqlite3` (SQL directo) | Para este dominio (una tabla `tareas`) un ORM es sobreingeniería (NFR-08). Un repositorio con sentencias preparadas es suficiente y explícito. *Prisma sería válido si se quiere migraciones/typesafety; ver D-30.* |
| **Empaquetado / despliegue (RT-1)** | **Contenedor Docker único** | Decisión del usuario. Un solo artefacto que sirve API + tiempo real + estáticos del SPA, desplegado en red corporativa/VPN, no expuesto a Internet (RT-1/D-7). Reproducible entre entornos. |

> Coherencia con restricciones: ninguna decisión contradice RT-1..RT-5. **Sin login** (D-6) se respeta: no hay capa de autenticación. **Español** (RT-3) es de UI (cubierto en la guía de estilos).

## 2. Organización de módulos y capas

**Monorepo ligero** con `npm/pnpm workspaces` (sin Nx ni Turborepo — sería sobreingeniería, NFR-08): tres paquetes con dependencias y build propios, y tipos compartidos en `shared` para mantener el contrato cliente↔servidor (modelo `Tarea`, límites NFR-12, eventos WS de HU-09):

```
checklist/
  client/        # SPA React + Vite (UI de la única pantalla)
  server/        # API Fastify + Socket.IO + acceso a SQLite (better-sqlite3)
  shared/        # tipos TypeScript compartidos (Tarea, eventos WS, límites)
```

**Capas del servidor (responsabilidades):**

- **API / transporte**: rutas REST (CRUD de tareas, progreso) + gateway WebSocket (emite eventos a todos los clientes).
- **Servicio / dominio**: reglas de negocio — validación de título obligatorio y límites (HU-02/HU-04, NFR-12), confirmación lógica de borrado (HU-05), condición de reinicio "todas hechas y ≥1 tarea" (HU-08/D-15), recálculo de progreso (HU-06).
- **Repositorio / datos**: acceso a SQLite (tabla `tareas`: id, titulo, descripcion, hecha, posicion), sentencias preparadas, transacciones para reinicio y reordenación.

**Capas del cliente:**

- **UI/componentes**: `AppShell`, `ListaTareas`, `ItemTarea`, `FormularioTarea`, `IndicadorProgreso`, `DialogoConfirmacion`, `EstadoVacio` (alineado con la guía de estilos §5).
- **Estado/datos**: store (Zustand) + cliente WebSocket + cliente REST. La UI reacciona a los eventos del servidor.

> Esta descomposición a alto nivel se concreta como **árbol de carpetas real** en `aidd architecture` (2.4).

## 3. Gestión de estado y flujo de datos

Modelo: **el servidor es la única fuente de verdad** (RT-4); el cliente mantiene una copia local que se sincroniza por WebSocket.

Flujo de una acción (p. ej. marcar una tarea, HU-03):

1. El cliente envía la mutación al servidor (REST o evento WS).
2. El servidor valida (dominio), persiste en SQLite (NFR-09) y aplica **last-write-wins** ante simultaneidad (NFR-11).
3. El servidor **emite el cambio a todos los clientes conectados** por WebSocket (RF-09).
4. Cada cliente actualiza su store y re-renderiza; el progreso (HU-06) se recalcula en vivo.

- **Optimistic UI opcional**: el cliente puede reflejar el cambio antes de la confirmación y reconciliar al recibir el evento del servidor (mejora la latencia percibida, NFR-06).
- **Reconexión**: al reconectar, el cliente pide el estado completo y re-sincroniza (criterio de HU-09).
- **Orden** (HU-07, F2): la `posicion` se persiste; reordenar emite el nuevo orden a todos.

## 4. Estrategia de testing

Alineada con las historias y manteniéndola ligera (NFR-08):

| Nivel | Herramienta | Qué cubre |
|---|---|---|
| **Unitario (dominio)** | **Vitest** | Reglas de validación (título obligatorio, límites NFR-12), recálculo de progreso (HU-06), condición de reinicio (HU-08). |
| **API / integración** | Vitest + inyección de Fastify (`app.inject`) | Endpoints CRUD (HU-02..HU-05), persistencia en SQLite (NFR-09), propagación de errores. |
| **Componentes UI** | Vitest + React Testing Library | Item de tarea, formulario con validación, diálogo de confirmación de borrado (HU-05), estado vacío. |
| **End-to-end** | **Playwright** | Recorrido completo del MVP en navegador; ya está en el toolchain (se usó para el prototipo). Permite además verificar accesibilidad básica (NFR-05). |
| **Tiempo real** | Test de integración con dos clientes WS | Verifica que un cambio se propaga a otro cliente <1 s (RF-09/NFR-06) y last-write-wins (NFR-11). |

Criterio de cobertura orientativo: foco en la **capa de dominio** (donde están las reglas) y en los **criterios [BLOQUEANTE]** del detalle de historias; no perseguir un % alto en UI trivial.

## 5. Seguridad y escalabilidad

**Seguridad** (contexto: interno, sin login, datos no sensibles — RT-1, D-6, brief §6):

- **Sin autenticación** por diseño (D-6); el control de acceso es **de red** (corporativa/VPN, RT-1/D-7).
- **Validación de entrada en servidor**: longitudes y límites (NFR-12) y título obligatorio se validan también en backend, no solo en cliente (defensa ante peticiones directas).
- **CORS restringido** al origen del cliente (`CORS_ORIGIN`) si front y back se sirvieran separados; con contenedor único y mismo origen, mínimo.
- **Cabeceras básicas** (p. ej. `@fastify/helmet`) y **límite de tamaño de payload**; *rate limiting* opcional dado el bajo riesgo.
- Sin gestión de secretos sensibles (no hay credenciales de terceros); variables de entorno para configuración (ver §7 de requisitos).

**Escalabilidad** (carga real: 5-10 usuarios, 1 lista, ≤100 tareas):

- **Una sola instancia** del contenedor cubre la carga con holgura; el *broadcast* WebSocket en memoria es suficiente.
- SQLite soporta sin problema esta concurrencia; si en el futuro se necesitara multi-instancia, el salto sería: **PostgreSQL** + un *pub/sub* (p. ej. Redis) para sincronizar WebSocket entre instancias. Se documenta como evolución, **no** como necesidad actual (evita sobreingeniería, NFR-08).
- **Disponibilidad** (NFR-10): básica, horario laboral, sin SLA formal; un reinicio del contenedor y backup del fichero SQLite bastan.

## 6. Recomendaciones técnicas

- **Validación compartida**: define el esquema de `Tarea` y sus límites una sola vez en `shared/` y reúsalo en cliente y servidor (coherencia HU-02/HU-04, NFR-12).
- **Accesibilidad desde el código** (NFR-05): adopta la base de la variante v2 del prototipo (semántica nativa, focus-trap en modales, `aria-live`, `role="progressbar"`). Es requisito AA, no opcional.
- **Alternativa accesible al drag & drop** (HU-07/NFR-05): planifícala desde el diseño del componente de lista (mover arriba/abajo por teclado), no como parche posterior.
- **Configuración por entorno**: respeta las variables ya previstas (`PORT`, `DATABASE_URL`, `NODE_ENV`, `CORS_ORIGIN`, `MAX_TAREAS`, `MAX_TITULO_LEN`, `MAX_DESC_LEN`).
- **F2 desde el inicio del modelo de datos**: aunque drag&drop (HU-07) y reinicio (HU-08) sean F2, incluye `posicion` en el modelo desde el principio para no migrar después.
- **Backups simples**: copia periódica del fichero SQLite (la persistencia, NFR-09, depende de un único archivo).

## 7. Decisiones tomadas en el paso 2.3 (arquitectura)

| ID | Pregunta | Opciones | Decisión | Origen | Justificación |
|---|---|---|---|---|---|
| D-26 | Familia tecnológica base | Node full-stack ligero / Node + SPA / Python (FastAPI) | **Node + framework SPA** | Usuario | Estructura de UI clara con un solo lenguaje (TS) front/back; mantenible (NFR-08). |
| D-27 | Base de datos compartida | SQLite / PostgreSQL / fichero JSON | **SQLite** | Usuario | Fichero único, cero administración, fuente única de verdad (RT-4, NFR-09); sobrado para la carga (NFR-12). |
| D-28 | Framework SPA concreto | React + Vite / Vue 3 + Vite | **React 18 + Vite** | Usuario | Confirmado por el usuario. Ecosistema más extendido → más talento y mantenibilidad. |
| D-29 | Mecanismo de tiempo real | Socket.IO / ws nativo | **Socket.IO** | Usuario (delega) | Los criterios de HU-09 exigen reconexión, re-sincronización y broadcast (RF-09/NFR-06): Socket.IO los resuelve de fábrica → menos código propio en la parte más delicada (NFR-08). |
| D-30 | Acceso a datos | better-sqlite3 directo / Prisma ORM | **better-sqlite3 directo** | Usuario | Confirmado por el usuario: Prisma es overhead para una sola tabla (NFR-08). |
| D-31 | Despliegue | Contenedor único / front+back separados / proceso directo | **Contenedor Docker único interno** | Usuario | Un solo artefacto reproducible en red corporativa/VPN (RT-1/D-7). |
| D-32 | Estructura del repositorio | Paquete único / workspaces ligeros / dos repos | **Monorepo ligero (npm/pnpm workspaces): client + server + shared** | Usuario | Dependencias/builds de front y back separados y limpios; `shared` protege el contrato de tipos cliente↔servidor (HU-09, NFR-12). Sin Nx/Turborepo (NFR-08). |

> **Gate resuelto (2026-06-22):** D-28, D-29 y D-30 quedan ratificadas (React + Vite, Socket.IO, better-sqlite3). No quedan decisiones de stack pendientes; la propuesta está lista para materializarse en `aidd architecture` (2.4).
