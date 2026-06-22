# Arquitectura base — CheckList

> Documento de Fase 2 (AIDD · paso 2.4). Generado por `aidd architecture`.
> Fuentes de verdad: detalle-historias-usuario.md, propuesta-arquitectura-base.md, guia-estilos.md.
> Insumo principal del roadmap. Pendiente de aprobacion humana.

**Versión:** 1.0 · **Fecha:** 2026-06-22 · **Estado:** 🟢 Aprobado

---

## 1. Objetivo y alcance

Consolidar la arquitectura **definitiva e implementable** de CheckList: una aplicación web interna, minimalista, de **una única lista compartida** de tareas, usable desde móvil, con progreso visible y sincronización en tiempo real entre el equipo (5-10 personas).

**Dentro del alcance** (las 9 historias del mapa):
- F1 (MVP): ver lista (HU-01), añadir (HU-02), marcar/desmarcar (HU-03), editar (HU-04), borrar con confirmación (HU-05), progreso (HU-06).
- F2: reordenar por arrastre (HU-07), reiniciar lista (HU-08), tiempo real (HU-09).

La arquitectura contempla F1 y F2 desde el inicio (modelo de datos y canal de tiempo real preparados), aunque la entrega sea escalonada (D-10).

**Fuera del alcance** (requisitos §6): cuentas/login, múltiples listas, papelera, historial, notificaciones, integraciones externas, app nativa.

> Cierra la Fase 2 (Diseño). Es el insumo principal para fasear el roadmap (Fase 3).

## 2. Principios y decisiones arquitectónicas

Principios rectores (derivados de NFR-08 y de los objetivos del cliente):

1. **Simplicidad sobre sofisticación** (NFR-08): la opción más simple que cumpla el requisito. Sin ORM, sin orquestadores de monorepo, una sola instancia.
2. **Servidor como fuente única de verdad** (RT-4): el estado vive en el servidor; los clientes son vistas sincronizadas.
3. **Contrato tipado de extremo a extremo**: tipos compartidos cliente↔servidor para evitar desincronización (HU-09, NFR-12).
4. **Accesibilidad como requisito, no adorno** (NFR-05): WCAG 2.1 AA incorporada en los componentes desde el código.
5. **Preparado para F2 desde F1**: el modelo incluye `posicion` y el canal de tiempo real existe desde el principio, aunque su UI llegue en F2.

**Decisiones de stack (ratificadas en la propuesta 2.3, D-26..D-32):**

| Área | Decisión |
|---|---|
| Lenguaje | TypeScript (front + back) |
| Frontend | React 18 + Vite, estado con Zustand |
| Backend | Node + Fastify |
| Tiempo real | Socket.IO |
| Persistencia | SQLite vía better-sqlite3 (sin ORM) |
| Estructura | Monorepo ligero `npm/pnpm workspaces`: `client` + `server` + `shared` |
| Despliegue | Contenedor Docker único, interno (red/VPN) |

**Conflictos entre documentos de entrada — resueltos:**
- *Prototipo (2.1) vs arquitectura final*: el prototipo usa vanilla JS + localStorage; la arquitectura real usa React + Fastify + SQLite. **No es contradicción**: el prototipo era una demo mockeada y desechable para validar requisitos (su §7 lo declara). La arquitectura definitiva no lo reutiliza como código.
- *Guía de estilos vs componentes*: la lista de componentes de la guía (§5) se mapea 1:1 a componentes React (ver §6). Sin conflicto.

## 3. Estructura de la solución (árbol de carpetas real)

Monorepo `npm/pnpm workspaces` con tres paquetes. Árbol real previsto:

```
checklist/
  package.json                 # define workspaces: client, server, shared; scripts raíz
  pnpm-workspace.yaml          # (o "workspaces" en package.json si npm)
  tsconfig.base.json           # config TS compartida
  .env.example                 # PORT, DATABASE_URL, CORS_ORIGIN, MAX_TAREAS, MAX_TITULO_LEN, MAX_DESC_LEN, NODE_ENV
  docker/
    Dockerfile                 # build multi-stage: compila client + server, imagen final Node
    .dockerignore
    docker-compose.yml         # orquestación local: servicio app + volumen del .db + .env (desarrollo/operación)
  shared/
    package.json
    src/
      index.ts                 # re-exporta el API público del paquete
      tarea.ts                 # tipo Tarea, EstadoTarea
      eventos.ts               # contratos de eventos Socket.IO (cliente<->servidor)
      limites.ts               # constantes y validadores de límites (NFR-12)
      validacion.ts            # validación de título/descripción reutilizable
  server/
    package.json
    tsconfig.json
    src/
      index.ts                 # entrypoint: lee config, arranca el servidor
      config.ts                # carga y valida variables de entorno
      app.ts                   # construye la app Fastify (export para tests con inject)
      db/
        connection.ts          # abre better-sqlite3 (DATABASE_URL)
        schema.ts              # creación/migración del esquema (tabla tareas)
      repositories/
        tareaRepository.ts     # SQL: CRUD, reordenar, reiniciar (transacciones)
      services/
        tareaService.ts        # reglas de dominio (validación, reglas HU-02..HU-08)
        progresoService.ts     # cálculo de progreso (HU-06)
      routes/
        tareas.ts              # REST: GET/POST/PATCH/DELETE /api/tareas, reset
        health.ts              # GET /health
      realtime/
        gateway.ts             # Socket.IO: registro, broadcast de eventos
      static.ts                # sirve el build estático del client (mismo origen)
    test/
      tareaService.test.ts
      tareas.routes.test.ts
      realtime.test.ts
  client/
    package.json
    tsconfig.json
    vite.config.ts
    index.html
    src/
      main.tsx                 # monta React
      App.tsx                  # AppShell + composición de la única pantalla
      api/
        rest.ts                # llamadas REST
        socket.ts              # cliente Socket.IO (conexión, reconexión, eventos)
      store/
        useTareasStore.ts      # store Zustand: tareas, progreso derivado, acciones
      components/
        AppShell.tsx
        ListaTareas.tsx
        ItemTarea.tsx
        FormularioTarea.tsx    # alta y edición (modal)
        IndicadorProgreso.tsx
        DialogoConfirmacion.tsx
        EstadoVacio.tsx
      styles/
        tokens.css             # design tokens de la guía de estilos (§4 de la guía)
        global.css
    test/
      ItemTarea.test.tsx
      FormularioTarea.test.tsx
  e2e/
    checklist.spec.ts          # Playwright: recorrido MVP de extremo a extremo
```

## 4. Descomposición por módulos / dominios

El dominio es pequeño y cohesionado: **gestión de las tareas de una única lista**.

- **`shared` (contrato)**: define `Tarea`, los eventos de tiempo real y los límites/validaciones. Es la única fuente de verdad de tipos; cliente y servidor dependen de él.
- **`server/domain` (tareaService, progresoService)**: reglas de negocio puras y testeables:
  - Título obligatorio y límites (HU-02/HU-04, NFR-12).
  - Borrado definitivo (HU-05).
  - Reinicio habilitado solo si hay ≥1 tarea y todas están hechas (HU-08, D-15).
  - Cálculo de progreso, coherente con lista vacía (HU-06).
  - Reordenación con `posicion` persistente (HU-07).
- **`server/data` (tareaRepository, db)**: acceso a SQLite, sentencias preparadas, transacciones (reinicio y reordenación son atómicos).
- **`server/transport` (routes, realtime)**: REST para mutaciones/consultas + Socket.IO para difundir cambios.
- **`client/ui` (components)**: render de la única pantalla y sus modales.
- **`client/state` (store, api)**: store local sincronizado con el servidor.

## 5. Capas y responsabilidades

Flujo de dependencias en el servidor: **transport → service → repository → db**. Las capas internas no conocen a las externas.

| Capa | Responsabilidad | No hace |
|---|---|---|
| Transporte (routes + gateway) | Validar forma de la petición, invocar servicios, emitir eventos WS | Reglas de negocio, SQL |
| Servicio / dominio | Reglas de negocio, validación semántica, orquestar repositorio | Acceso HTTP/WS, SQL crudo disperso |
| Repositorio | SQL, mapeo fila↔`Tarea`, transacciones | Reglas de negocio |
| DB | Conexión y esquema SQLite | Lógica |

En el cliente: **components → store → api**. Los componentes no llaman al servidor directamente; pasan por el store, que centraliza estado y sincronización.

## 6. Componentes base y relaciones

Mapeo directo de la guía de estilos (§5) a componentes React:

| Componente | Historia(s) | Función |
|---|---|---|
| `AppShell` | HU-01 | Layout: cabecera + progreso (sticky) + lista + acción añadir |
| `IndicadorProgreso` | HU-06 | Barra `role="progressbar"` + texto "X de Y hechas" + % |
| `ListaTareas` | HU-01 | Renderiza `<ul>` de `ItemTarea`; muestra `EstadoVacio` si no hay tareas |
| `ItemTarea` | HU-03/04/05 | Checkbox de estado, título, descripción, acciones editar/borrar |
| `FormularioTarea` | HU-02/04 | Modal de alta y edición; validación de título y límites |
| `DialogoConfirmacion` | HU-05 (y HU-08) | Modal de confirmación de acción destructiva, foco atrapado |
| `EstadoVacio` | HU-01 | Mensaje que invita a añadir la primera tarea |

Relación: `App` compone `AppShell` → `IndicadorProgreso` + `ListaTareas`(→ `ItemTarea`*) + botón añadir; `FormularioTarea` y `DialogoConfirmacion` se montan como modales sobre la pantalla. Todos leen/escriben vía `useTareasStore`.

## 7. Flujos principales de información

**Carga inicial (HU-01):** cliente → `GET /api/tareas` → render; en paralelo abre el socket y se une al canal de difusión.

**Mutación (añadir/marcar/editar/borrar — HU-02..HU-05):**
1. Componente invoca acción del store.
2. Store llama a REST (`POST/PATCH/DELETE`); opcionalmente aplica *optimistic update*.
3. Servidor: ruta → `tareaService` (valida) → `tareaRepository` (persiste en SQLite, NFR-09) → aplica **last-write-wins** (NFR-11).
4. `gateway` Socket.IO **difunde el evento** (`tarea:creada|actualizada|borrada|reordenada|reset`) a todos los clientes (RF-09).
5. Cada cliente actualiza su store; `IndicadorProgreso` se recalcula (HU-06).

**Reinicio (HU-08):** validación de "todas hechas y ≥1 tarea" en `tareaService` → transacción que vacía la tabla → evento `reset` difundido.

**Reordenar (HU-07):** drag&drop (o alternativa por teclado, NFR-05) → `PATCH` de posiciones → transacción → evento `reordenada`.

**Reconexión (HU-09):** al reconectar, el cliente vuelve a pedir el estado completo y re-sincroniza.

## 8. Gestión de estado

- **Servidor: fuente única de verdad** en SQLite. Modelo `Tarea`:
  - `id` (texto, p. ej. UUID), `titulo` (NOT NULL, ≤120), `descripcion` (≤2000, opcional), `hecha` (booleano), `posicion` (entero), `created_at`, `updated_at`.
- **Cliente: store Zustand** con la lista de tareas; el **progreso es estado derivado** (no se almacena, se calcula de `tareas`).
- **Sincronización**: los eventos Socket.IO son la vía de actualización entre clientes; REST es la vía de mutación. El store reconcilia *optimistic updates* con el evento confirmado del servidor.
- **Concurrencia**: last-write-wins (NFR-11); sin bloqueos ni resolución de conflictos.

## 9. Navegación y organización de pantallas / endpoints

**Pantallas:** una sola vista (RT-2), sin enrutado entre páginas. Alta/edición y confirmación son modales sobre esa vista (coherente con guía de estilos §7).

**Endpoints REST (`/api`):**

| Método | Ruta | Historia |
|---|---|---|
| GET | `/api/tareas` | HU-01 |
| POST | `/api/tareas` | HU-02 |
| PATCH | `/api/tareas/:id` | HU-03 (toggle), HU-04 (editar) |
| DELETE | `/api/tareas/:id` | HU-05 |
| PATCH | `/api/tareas/orden` | HU-07 |
| POST | `/api/tareas/reset` | HU-08 |
| GET | `/health` | operación |

**Eventos Socket.IO (servidor → clientes):** `tarea:creada`, `tarea:actualizada`, `tarea:borrada`, `tarea:reordenada`, `lista:reset`. Definidos en `shared/eventos.ts`.

## 10. Integración con APIs y servicios externos

**No hay integraciones externas** (requisitos §6: sin notificaciones, exportación ni terceros). Las únicas "integraciones" son internas: cliente↔servidor (REST + WebSocket) y servidor↔SQLite. No hay autenticación con proveedores ni APIs de terceros.

## 11. Seguridad, accesibilidad, observabilidad y rendimiento

**Seguridad** (interno, sin login — RT-1, D-6):
- Control de acceso **por red** (corporativa/VPN); sin capa de auth por diseño.
- **Validación en servidor** de límites y título obligatorio (NFR-12), no solo en cliente.
- `@fastify/helmet` (cabeceras), límite de tamaño de payload, `CORS_ORIGIN` restringido (mínimo con contenedor único de mismo origen).
- Sin secretos de terceros; configuración por variables de entorno.

**Accesibilidad** (NFR-05, WCAG 2.1 AA): se adopta la base de la variante v2 del prototipo — semántica nativa (`<header>/<main>/<footer>`, `<ul>/<li>`), foco visible, focus-trap y restauración en modales, `aria-live` para cambios, `role="progressbar"` con `aria-valuetext`, estado "hecha" no solo por color, y **alternativa por teclado al drag&drop** (HU-07).

**Observabilidad**: logging estructurado de Fastify (pino); log de errores y de eventos clave. Dado el contexto (NFR-10, sin SLA), no se exige métricas/tracing avanzados; se deja como extensión.

**Rendimiento** (NFR-06): propagación tiempo real objetivo <1 s (Socket.IO en una sola instancia, latencia despreciable en red interna). SQLite con sentencias preparadas; carga trivial (≤100 tareas, NFR-12).

## 12. Escalabilidad, mantenibilidad y extensibilidad

- **Empaquetado y despliegue**: imagen única construida con `docker/Dockerfile` (multi-stage). Se acompaña de `docker/docker-compose.yml` que define el servicio `app`, monta un **volumen** para persistir el fichero SQLite (NFR-09) e inyecta las variables de `.env`. El compose es para **desarrollo y operación local** (levantar con un comando, persistencia y configuración reproducibles); el despliegue interno sigue siendo de **contenedor único** (D-31), no introduce servicios adicionales.
- **Escala actual**: 5-10 usuarios, 1 lista, ≤100 tareas → **una sola instancia** del contenedor sobra; broadcast WebSocket en memoria suficiente.
- **Camino de evolución** (documentado, NO implementado ahora): si se necesitara multi-instancia o más carga → PostgreSQL + pub/sub (Redis) para sincronizar Socket.IO entre instancias. El repositorio aísla el acceso a datos para facilitar el cambio de SQLite a Postgres.
- **Mantenibilidad**: un solo lenguaje (TS), tipos compartidos, dominio aislado y testeable, sin ORM ni tooling de monorepo pesado.
- **Extensibilidad**: añadir un campo a `Tarea` toca `shared` + esquema + repositorio + UI, de forma localizada. Las funciones F2 ya tienen su sitio (posición, eventos).

## 13. Riesgos técnicos, supuestos y decisiones pendientes

**Riesgos:**
- **Persistencia en fichero único** (SQLite): un fallo de disco sin backup pierde datos → mitigar con backups periódicos del fichero (NFR-09).
- **Broadcast en memoria**: atado a una sola instancia; escalar a varias exige pub/sub (ver §12). Aceptado para la escala actual.
- **Drag&drop accesible** (HU-07/NFR-05): la alternativa por teclado debe diseñarse con el componente, no como parche.

**Supuestos:**
- **El prototipo aún no consta como validado por el cliente**: esta arquitectura asume que los requisitos de Fase 1 se mantienen. Si la validación trae cambios significativos, revisar desde el paso 1.1.
- Despliegue en una máquina/contenedor en red interna disponible en horario laboral (NFR-10).

**Decisiones pendientes:** ninguna bloqueante. El stack está cerrado (D-26..D-32).

## 14. Decisiones tomadas en el paso 2.4

| ID | Pregunta | Opciones | Decisión | Origen | Justificación |
|---|---|---|---|---|---|
| D-33 | ¿Cubrir F2 (HU-07/08/09) en la arquitectura o solo F1? | Solo F1 / F1+F2 | **F1 + F2** | Default | Todos los RF están en alcance; preparar modelo (`posicion`) y tiempo real desde el inicio evita migraciones (alineado con propuesta). |
| D-34 | Comunicación de mutaciones | Solo WebSocket / REST + WebSocket | **REST (mutación/consulta) + WebSocket (difusión)** | Default | REST simple y testeable para CRUD; WS solo para propagar (RF-09). Menos lógica de protocolo propia. |
| D-35 | Identificador de tarea | Autoincremental / UUID | **UUID generado en servidor** | Default | Evita colisiones y facilita optimistic updates; sin coste relevante a esta escala. |
| D-36 | Mismo origen cliente/servidor | Sí (Fastify sirve estáticos) / separado | **Mismo origen (Fastify sirve el build del client)** | Default (deriva de D-31) | Contenedor único: el servidor sirve el SPA y la API → CORS mínimo, un solo artefacto (RT-1). |
| D-37 | Conflicto prototipo (vanilla/localStorage) vs stack final | Reutilizar prototipo / desechar | **Desechar el prototipo como código** | Default | El prototipo era mock de validación (su §7 lo declara); la base real es React+Fastify+SQLite. No hay contradicción. |
| D-38 | ¿Incluir `docker-compose` además del `Dockerfile`? | Solo Dockerfile / Dockerfile + compose | **Dockerfile + docker-compose.yml** | Usuario | El compose facilita desarrollo/operación local (volumen del `.db`, variables `.env`, arranque con un comando) sin cambiar el modelo de despliegue de contenedor único (D-31); no añade servicios. |
