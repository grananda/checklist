## ADDED Requirements

### Requirement: Reordenar en la interfaz (arrastre y teclado)
La lista DEBE (MUST) permitir reordenar las tareas por arrastre con soporte táctil y, como alternativa accesible obligatoria (NFR-05), mediante controles de teclado para mover una tarea arriba/abajo; el nuevo orden se persiste vía `PATCH /api/tareas/orden` (HU-07).

#### Scenario: Reordenar por teclado
- **WHEN** una persona usa el control "mover arriba"/"mover abajo" de una tarea
- **THEN** la tarea cambia de posición, el nuevo orden se guarda y se mantiene al recargar

#### Scenario: Reordenar por arrastre táctil
- **WHEN** se arrastra una tarea a otra posición (ratón o dedo) y se suelta
- **THEN** la tarea queda en la nueva posición y el orden se persiste

### Requirement: Botón Reiniciar en la interfaz
La pantalla DEBE (MUST) ofrecer un botón "Reiniciar" habilitado solo cuando hay ≥1 tarea y todas están hechas; al activarlo DEBE (MUST) pedir confirmación previa y solo al confirmar vaciar la lista vía `POST /api/tareas/reset` (HU-08).

#### Scenario: Reiniciar al 100%
- **WHEN** todas las tareas están hechas y se confirma el reinicio
- **THEN** la lista queda vacía y el progreso refleja el estado vacío

#### Scenario: Reiniciar deshabilitado
- **WHEN** hay alguna tarea pendiente o la lista está vacía
- **THEN** el botón Reiniciar está deshabilitado (con su estado expuesto a tecnologías de asistencia)

#### Scenario: Cancelar el reinicio
- **WHEN** se abre la confirmación de reinicio y se cancela
- **THEN** no se borra ninguna tarea
