# foundation

Estructura base global del monorepo CheckList (pnpm workspaces client+server+shared): paquete shared (tipos Tarea/EstadoTarea, contratos de eventos Socket.IO, validadores de limites NFR-12), scaffolding Fastify (app/config/health, servir estaticos, andamiaje vacio del gateway de tiempo real), conexion y esquema SQLite, scaffolding Vite+React+Zustand (AppShell minimo, tokens.css), Dockerfile multi-stage + docker-compose con volumen del .db, y CI build+test. Sin funcionalidad de usuario ni endpoints CRUD. Basado en docs/arquitectura-base.md 3-5,8,11-12.
