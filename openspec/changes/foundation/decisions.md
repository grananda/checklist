# Decisiones del pre-flight — foundation

> Pre-flight de apertura (`native-ai open change foundation`). Skill `native-ai-specs` v1.4.0.

## test-runner

- **Fecha**: 2026-06-24
- **Tipo**: preferencia
- **Origen**: usuario
- **Contexto**: docs/arquitectura-base.md §3 (árbol con `*.test.ts`/`*.test.tsx`) pide tests pero no fija runner; el roadmap Fase 1 incluye "CI básica (build + test)".
- **Pregunta**: ¿Qué runner de tests uso para el scaffolding de pruebas de server y client?
- **Opciones evaluadas**:
  - a) Vitest
  - b) Jest + ts-jest
  - c) node:test (built-in)
- **Decision**: a) Vitest
- **Justificación**: Encaja nativamente con Vite + TS, mismo runner para client y server; Playwright se mantiene aparte para e2e.

## ci-provider

- **Fecha**: 2026-06-24
- **Tipo**: preferencia
- **Origen**: usuario
- **Contexto**: roadmap Fase 1 incluye "CI básica (build + test)"; el remoto del repo es github.com/grananda/checklist.
- **Pregunta**: ¿Qué CI configuro en la Fase 1 (build + test)?
- **Opciones evaluadas**:
  - a) GitHub Actions
  - b) Sin CI por ahora
  - c) GitLab CI
- **Decision**: a) GitHub Actions
- **Justificación**: Nativo del remoto actual; workflow que instala pnpm, compila los 3 paquetes y corre tests.

## lint-format

- **Fecha**: 2026-06-24
- **Tipo**: preferencia
- **Origen**: usuario
- **Contexto**: la arquitectura no menciona tooling de lint/format; foundation asienta convenciones del proyecto.
- **Pregunta**: ¿Incluyo tooling de lint/format en foundation o lo dejo fuera del andamiaje base?
- **Opciones evaluadas**:
  - a) ESLint + Prettier
  - b) Sin lint/format
- **Decision**: a) ESLint + Prettier
- **Justificación**: Config TS mínima compartida + scripts lint/format integrados en CI; asienta convenciones desde el primer change.

## gestor-paquetes

- **Fecha**: 2026-06-24
- **Tipo**: confirmacion
- **Origen**: auto-default
- **Contexto**: docs/arquitectura-base.md §2-3 ("npm/pnpm workspaces") y roadmap Fase 1 ("Monorepo pnpm workspaces").
- **Pregunta**: ¿npm o pnpm workspaces?
- **Opciones evaluadas**:
  - a) pnpm workspaces
  - b) npm workspaces
- **Decision**: a) pnpm workspaces
- **Justificación**: El roadmap ya lo fija explícitamente; no se reabre una decisión ya cerrada en el diseño.

## version-node

- **Fecha**: 2026-06-24
- **Tipo**: preferencia
- **Origen**: usuario
- **Contexto**: pre-flight de `implement change`; afecta a `docker/Dockerfile`, `.github/workflows/ci.yml` y `engines` de los `package.json`.
- **Pregunta**: ¿Qué versión de Node fijo en el andamiaje?
- **Opciones evaluadas**:
  - a) Node 22 LTS
  - b) Node 20 LTS
  - c) Node 24
- **Decision**: a) Node 22 LTS
- **Justificación**: LTS activa y estable; imagen reproducible compatible con Fastify 5, better-sqlite3, Vite y React 18.

## sistema-modulos-server

- **Fecha**: 2026-06-24
- **Tipo**: preferencia
- **Origen**: usuario
- **Contexto**: pre-flight de `implement change`; afecta a `server/package.json` (`type`), `tsconfig.json` y el estilo de imports de todo el código del server.
- **Pregunta**: ¿ESM o CommonJS para el código del server?
- **Opciones evaluadas**:
  - a) ESM
  - b) CommonJS
- **Decision**: a) ESM
- **Justificación**: Moderno y alineado con Vite/React y Fastify 5; compila con tsc a ESM y se ejecuta con node.

## build-server

- **Fecha**: 2026-06-24
- **Tipo**: confirmacion
- **Origen**: auto-default
- **Contexto**: pre-flight de `implement change`; cómo compilar y ejecutar el server en Docker/CI.
- **Pregunta**: ¿Cómo se compila el server?
- **Opciones evaluadas**:
  - a) tsc → dist + `node dist/index.js` (client con Vite)
  - b) bundler (tsup/esbuild) o ejecución con tsx
- **Decision**: a) tsc → dist (Vite para el client)
- **Justificación**: Opción más simple y reproducible (NFR-08), sin bundler extra para el backend; coherente con el contenedor único.
