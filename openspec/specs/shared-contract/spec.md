# shared-contract Specification

## Purpose
TBD - created by archiving change foundation. Update Purpose after archive.
## Requirements
### Requirement: Paquete `shared` compilable y consumible
El paquete `shared` DEBE (MUST) compilar con TypeScript y exponer su API público a través de `shared/src/index.ts`, de forma que tanto `client` como `server` puedan importarlo como dependencia de workspace sin duplicar tipos.

#### Scenario: Compilación del paquete shared
- **WHEN** se ejecuta el build/typecheck de `shared`
- **THEN** compila sin errores y genera (o expone vía workspace) los símbolos re-exportados desde `index.ts`

#### Scenario: Consumo desde server y client
- **WHEN** `server` o `client` importan tipos o utilidades desde `shared`
- **THEN** la resolución de módulos funciona vía pnpm workspaces y el typecheck de cada paquete pasa

### Requirement: Contrato de tipos del dominio
`shared` DEBE (MUST) definir el tipo `Tarea` y el tipo `EstadoTarea` coherentes con el modelo de datos (`id`, `titulo`, `descripcion` opcional, `hecha`, `posicion`, `created_at`, `updated_at`).

#### Scenario: Tipo Tarea disponible
- **WHEN** un paquete importa `Tarea` desde `shared`
- **THEN** el tipo incluye los campos del modelo y es utilizable para tipar datos de tarea

### Requirement: Contratos de eventos de tiempo real
`shared/eventos.ts` DEBE (MUST) declarar los contratos de los eventos Socket.IO (`tarea:creada`, `tarea:actualizada`, `tarea:borrada`, `tarea:reordenada`, `lista:reset`) como tipos, sin que foundation los emita todavía.

#### Scenario: Contratos de eventos declarados
- **WHEN** se inspeccionan los tipos exportados por `shared`
- **THEN** existen los contratos de los eventos de tiempo real listados, disponibles para fases posteriores

### Requirement: Validadores y límites
`shared` DEBE (MUST) exponer las constantes de límites (NFR-12: máximo de tareas, longitud de título y de descripción) y los validadores reutilizables de título/descripción.

#### Scenario: Límites y validación reutilizables
- **WHEN** `server` (o cualquier consumidor) necesita validar un título o aplicar un límite
- **THEN** puede importar la constante o el validador desde `shared` sin reimplementarlo

