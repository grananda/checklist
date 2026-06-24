## ADDED Requirements

### Requirement: App cliente compilable
El `client` (Vite + React 18 + TypeScript) DEBE (MUST) compilar y producir un build estático servible por el servidor.

#### Scenario: Build del client
- **WHEN** se ejecuta el build de Vite del `client`
- **THEN** genera el bundle estático sin errores de compilación

### Requirement: AppShell mínimo
El `client` DEBE (MUST) montar React (`main.tsx`) y renderizar un `AppShell` mínimo (`App.tsx`) que sirva de armazón de la única pantalla, sin funcionalidad de tareas.

#### Scenario: Render del armazón
- **WHEN** se carga la aplicación en el navegador
- **THEN** se renderiza el `AppShell` mínimo sin errores y sin requerir datos de tareas

### Requirement: Store y design tokens del andamiaje
El `client` DEBE (MUST) incluir el andamiaje del store Zustand (`store/useTareasStore.ts`) y las hojas `styles/tokens.css` (design tokens de la guía de estilos) y `styles/global.css`, sin implementar acciones de dominio.

#### Scenario: Tokens aplicados
- **WHEN** se renderiza el `AppShell`
- **THEN** los design tokens de `tokens.css` están disponibles como variables CSS y aplicados al armazón

#### Scenario: Store de andamiaje presente
- **WHEN** la app inicializa el store
- **THEN** el store Zustand existe y se inicializa sin acciones de negocio (sin CRUD ni progreso)
