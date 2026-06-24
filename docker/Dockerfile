# Imagen única multi-stage de CheckList (contenedor único, arquitectura-base §12, D-31/D-38).
# Compila shared + server + client y produce una imagen Node de runtime.

# ---------- Stage 1: build ----------
FROM node:22-bookworm-slim AS build
WORKDIR /app

# Toolchain para compilar el módulo nativo better-sqlite3.
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable

# Manifiestos primero (cache de dependencias).
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY shared/package.json ./shared/
COPY server/package.json ./server/
COPY client/package.json ./client/

RUN pnpm install --frozen-lockfile

# Código fuente y build.
COPY . .
RUN pnpm run build

# Elimina devDependencies para el runtime, conservando las de producción del server.
RUN pnpm --filter @checklist/server --prod deploy /app/deploy

# ---------- Stage 2: runtime ----------
FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Dependencias de producción del server (incluye el binario nativo de better-sqlite3).
COPY --from=build /app/deploy/node_modules ./node_modules
COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/shared/dist ./shared/dist
# El server sirve el build del client desde ../../client/dist (mismo origen, D-36).
COPY --from=build /app/client/dist ./client/dist

EXPOSE 3000
CMD ["node", "server/dist/index.js"]
