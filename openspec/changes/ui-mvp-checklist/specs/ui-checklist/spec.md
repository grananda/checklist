## ADDED Requirements

### Requirement: Ver la lista y el estado vacío
La pantalla DEBE (MUST) cargar las tareas desde `GET /api/tareas` al iniciarse y mostrarlas en orden de `posicion`; si no hay tareas, DEBE (MUST) mostrar un estado vacío en español que invite a crear la primera (HU-01).

#### Scenario: Lista con tareas
- **WHEN** se abre la web y existen tareas
- **THEN** se ven todas con su título, estado (pendiente/hecha) y descripción si la tienen, en su orden persistido

#### Scenario: Estado vacío
- **WHEN** se abre la web y no hay tareas
- **THEN** se muestra un mensaje en español que invita a añadir la primera tarea (no una pantalla en blanco)

### Requirement: Añadir una tarea
La pantalla DEBE (MUST) ofrecer un formulario (modal) de alta con título obligatorio y descripción opcional; al confirmar con datos válidos crea la tarea vía API y la refleja en la lista (HU-02).

#### Scenario: Alta válida
- **WHEN** se envía el formulario con un título válido
- **THEN** la tarea aparece en la lista en estado pendiente y el formulario se cierra

#### Scenario: Título inválido
- **WHEN** se intenta confirmar con título vacío o solo espacios
- **THEN** se muestra un mensaje de validación en español y no se crea la tarea

### Requirement: Marcar y desmarcar
Cada tarea DEBE (MUST) permitir marcar/desmarcar su estado en un solo toque mediante un control accesible, reflejando el cambio de inmediato (HU-03).

#### Scenario: Alternar estado
- **WHEN** se activa el control de estado de una tarea
- **THEN** la tarea cambia entre pendiente y hecha y el indicador de progreso se actualiza

### Requirement: Editar título y descripción
La pantalla DEBE (MUST) permitir editar una tarea en el modal, validando el título; al confirmar persiste vía API sin alterar estado ni posición (HU-04).

#### Scenario: Edición válida
- **WHEN** se edita el título o la descripción y se confirma
- **THEN** se guarda el nuevo valor y se refleja en la lista; el estado y la posición no cambian

#### Scenario: Cancelar edición
- **WHEN** se descarta la edición
- **THEN** la tarea conserva sus valores originales

### Requirement: Borrar con confirmación
El borrado DEBE (MUST) pedir confirmación previa en un diálogo; solo al confirmar se elimina la tarea vía API (HU-05).

#### Scenario: Borrado confirmado
- **WHEN** se solicita borrar y se confirma en el diálogo
- **THEN** la tarea desaparece de la lista

#### Scenario: Borrado cancelado
- **WHEN** se solicita borrar y se cancela
- **THEN** la tarea permanece intacta

### Requirement: Indicador de progreso
La pantalla DEBE (MUST) mostrar el progreso (hechas/total y porcentaje) derivado del estado de la lista, coherente con lista vacía, y actualizado ante cualquier alta, cambio de estado o borrado (HU-06).

#### Scenario: Progreso actualizado
- **WHEN** cambia el estado, se añade o se borra una tarea
- **THEN** el indicador refleja el nuevo "X de Y hechas" y porcentaje de inmediato

#### Scenario: Progreso con lista vacía
- **WHEN** no hay tareas
- **THEN** el indicador muestra un valor coherente (p. ej. "0 de 0") sin 100% engañoso

### Requirement: Accesibilidad WCAG 2.1 AA
La interfaz DEBE (MUST) cumplir WCAG 2.1 AA (NFR-05): foco visible, focus-trap y restauración en modales, cierre con Escape, `aria-live` para cambios, `role="progressbar"` con valores ARIA, estado no comunicado solo por color, y operable por teclado; los textos DEBEN (MUST) estar en español (NFR-03) y la pantalla ser responsive/móvil (NFR-02).

#### Scenario: Auditoría axe sin violaciones
- **WHEN** se audita la pantalla con axe-core en estado con y sin tareas y con un modal abierto
- **THEN** no se reportan violaciones de nivel AA

#### Scenario: Operación por teclado
- **WHEN** se opera añadir, marcar, editar y borrar solo con teclado
- **THEN** todas las acciones son alcanzables y ejecutables, con foco atrapado en los modales y restaurado al cerrar

### Requirement: Recorrido MVP de extremo a extremo
DEBE (MUST) existir un test e2e (Playwright) que cubra el recorrido completo del MVP sobre la API real (HU-01..HU-06).

#### Scenario: e2e del MVP en verde
- **WHEN** se ejecuta el e2e: abrir, añadir, marcar, editar, borrar con confirmación y comprobar el progreso
- **THEN** el recorrido pasa de principio a fin
