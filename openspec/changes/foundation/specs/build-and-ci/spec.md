## ADDED Requirements

### Requirement: Imagen Docker multi-stage
El proyecto DEBE (MUST) proveer `docker/Dockerfile` multi-stage que compile `client` y `server` (incluida la compilación del módulo nativo `better-sqlite3`) y produzca una imagen final Node ejecutable de contenedor único.

#### Scenario: Build de la imagen
- **WHEN** se construye la imagen con el `Dockerfile`
- **THEN** la imagen se construye sin errores y contiene el server capaz de servir la API y el build del client

### Requirement: Orquestación local con persistencia
El proyecto DEBE (MUST) proveer `docker/docker-compose.yml` que levante el servicio `app`, inyecte las variables de `.env` y monte un volumen para persistir el fichero SQLite (NFR-09, D-38), manteniendo el modelo de contenedor único (sin servicios adicionales).

#### Scenario: Levantar el compose
- **WHEN** se ejecuta `docker compose up`
- **THEN** el servicio `app` arranca, `GET /health` responde y el fichero `.db` persiste en el volumen entre reinicios

### Requirement: Pipeline de CI
El proyecto DEBE (MUST) proveer un workflow de GitHub Actions (`.github/workflows/`) que, en push y pull request, instale pnpm, compile los tres paquetes y ejecute los tests (Vitest).

#### Scenario: CI en verde
- **WHEN** se dispara el workflow sobre un commit con el andamiaje íntegro
- **THEN** las etapas de build y test terminan correctamente

### Requirement: Lint y formato
El proyecto DEBE (MUST) configurar ESLint + Prettier con reglas TypeScript compartidas y scripts raíz de lint/format, integrados en la CI.

#### Scenario: Lint disponible y en verde
- **WHEN** se ejecuta el script de lint sobre el andamiaje
- **THEN** ESLint corre con la configuración compartida y no reporta errores en el código de andamiaje

### Requirement: Tests de andamiaje
El proyecto DEBE (MUST) incluir tests de andamiaje (Vitest) que verifiquen el arranque mínimo —al menos `GET /health` y el render del `AppShell`— sin probar reglas de negocio.

#### Scenario: Tests de andamiaje pasan
- **WHEN** se ejecuta la suite de tests
- **THEN** los tests de andamiaje de server (health) y client (render del shell) pasan en verde
