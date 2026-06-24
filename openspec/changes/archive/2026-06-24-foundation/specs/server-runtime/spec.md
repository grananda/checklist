## ADDED Requirements

### Requirement: Arranque del servidor Fastify
El `server` DEBE (MUST) construir una app Fastify en `app.ts` (exportable para tests con `inject`) y arrancarla desde `index.ts` leyendo la configuración validada de `config.ts`.

#### Scenario: La app arranca
- **WHEN** se inicia el servidor con la configuración por defecto
- **THEN** Fastify levanta en el puerto configurado sin errores

#### Scenario: Configuración por entorno validada
- **WHEN** `config.ts` carga las variables de entorno (`PORT`, `DATABASE_URL`, `CORS_ORIGIN`, `MAX_TAREAS`, `MAX_TITULO_LEN`, `MAX_DESC_LEN`, `NODE_ENV`)
- **THEN** valida su presencia/formato y expone una configuración tipada; ante una variable inválida, falla de forma explícita

### Requirement: Endpoint de salud
El servidor DEBE (MUST) exponer `GET /health` que responde un estado correcto sin depender de lógica de negocio.

#### Scenario: Health responde OK
- **WHEN** se hace `GET /health`
- **THEN** responde `200` con un cuerpo que indica que el servicio está vivo

### Requirement: Servir el client en el mismo origen
El servidor DEBE (MUST) servir el build estático del `client` (`static.ts`) de modo que la SPA y la API compartan origen (D-36).

#### Scenario: Cliente servido por Fastify
- **WHEN** existe un build del client y se solicita la raíz del sitio
- **THEN** el servidor responde el `index.html` del client desde el mismo origen que la API

### Requirement: Conexión y esquema SQLite
El servidor DEBE (MUST) abrir la conexión SQLite (`db/connection.ts`, vía `better-sqlite3` con `DATABASE_URL`) y crear el esquema de la tabla `tareas` (`db/schema.ts`) de forma idempotente, sin exponer operaciones de dominio en esta fase.

#### Scenario: Esquema creado de forma idempotente
- **WHEN** el servidor arranca contra una base de datos nueva o ya existente
- **THEN** la tabla `tareas` queda creada con las columnas del modelo y arrancar de nuevo no produce error

### Requirement: Andamiaje del gateway de tiempo real
El servidor DEBE (MUST) registrar el gateway Socket.IO (`realtime/gateway.ts`) sobre el servidor HTTP gestionando conexión y desconexión, **sin** emitir eventos de negocio (`tarea:*`, `lista:reset`).

#### Scenario: Gateway registrado sin eventos de negocio
- **WHEN** un cliente Socket.IO se conecta al servidor
- **THEN** la conexión se establece y se gestiona, y no se emite ningún evento de dominio
