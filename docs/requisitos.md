# Requisitos — CheckList

> Documento de Fase 1 (AIDD · paso 1.1). Generado por `aidd requirements`.
> Entrada: docs/cliente-requisitos.md. Salida hacia: docs/mapa-historias-usuario.md.
> Pendiente de aprobacion humana.

**Versión:** 1.1 · **Fecha:** 2026-06-17 · **Estado:** 🟡 Pendiente de aprobación

---

## 1. Descripción del sistema y objetivos

**CheckList** es una aplicación web minimalista que reemplaza la gestión de procesos repetitivos (revisiones, altas, despliegues, onboarding, cierres) que hoy un equipo pequeño (5-10 personas) lleva con notas sueltas, hojas de cálculo y chat.

El sistema ofrece **una única checklist compartida**: no se crean ni se borran listas; siempre existe la misma lista y el trabajo consiste en gestionar sus tareas. Cualquiera que abre la web ve y opera sobre la misma lista, sin cuentas ni login.

**Objetivos medibles:**

- O-1: Cualquier persona del equipo puede empezar a usar la app **sin manual ni formación** (la simplicidad de uso es criterio de éxito explícito del cliente).
- O-2: El estado de cada proceso es una **fuente única compartida**: todos ven el mismo contenido y el mismo progreso en tiempo real.
- O-3: De un vistazo se sabe **qué está hecho y qué falta** (progreso visible: hechas/total, porcentaje o barra).
- O-4: La app es **usable desde móvil** sin pérdida de funcionalidad.

## 2. Usuarios y roles

No hay autenticación, cuentas ni roles diferenciados. Existe un único perfil:

| Rol | Permisos / responsabilidades |
|---|---|
| **Persona del equipo** | Acceso total y anónimo a la única lista compartida: añadir, editar, marcar/desmarcar, reordenar y borrar tareas, ver el progreso y reiniciar la lista. No hay permisos restringidos ni acciones reservadas. |

> La lista no pertenece a nadie: es compartida y todas las personas tienen exactamente las mismas capacidades.

## 3. Requisitos funcionales

| ID | Requisito | Actor | Prioridad | Origen |
|---|---|---|---|---|
| RF-01 | Añadir una tarea a la lista con **título obligatorio** y **descripción opcional**. La tarea nace en estado *pendiente*. | Persona del equipo | Must | Brief §5.1 |
| RF-02 | Marcar una tarea como **hecha** y desmarcarla de nuevo a **pendiente** (acción reversible). | Persona del equipo | Must | Brief §5.2 |
| RF-03 | Editar el **título** y la **descripción** de una tarea existente. | Persona del equipo | Must | Brief §5.3 |
| RF-04 | Borrar una tarea. El borrado es **definitivo** (no hay papelera). | Persona del equipo | Must | Brief §5.4 |
| RF-05 | Ver el **progreso** de la lista de un vistazo: nº de hechas sobre total y/o porcentaje y/o barra de progreso. | Persona del equipo | Must | Brief §5.5 |
| RF-06 | **Reordenar** las tareas dentro de la lista mediante **arrastrar y soltar** (drag & drop), con soporte táctil en móvil. El orden es persistente y compartido. | Persona del equipo | Must | Brief §5.6 + decisión D-3 |
| RF-07 | **Reiniciar la lista**: un botón vacía la lista borrando **todas** las tareas para empezar de cero. El borrado es definitivo. El botón se **habilita solo cuando todas las tareas están hechas** y pide **confirmación** antes de ejecutar. | Persona del equipo | Must | Brief §5.7 + decisión D-4 |
| RF-08 | Ver la lista completa de tareas con su estado actual al abrir la web, reflejando el estado compartido vigente. | Persona del equipo | Must | Brief §3, §4 |
| RF-09 | Los cambios realizados por cualquier persona (alta, edición, marcado, borrado, reordenación, reinicio) se **propagan en tiempo real** al resto de personas con la web abierta, sin necesidad de recargar. | Persona del equipo | Must | Decisión D-2 |

Notas:
- Todos los RF operan sobre la **única lista compartida**; no existe gestión de múltiples listas (ver §6, fuera de alcance).
- Cada tarea se compone de: identificador interno, título (obligatorio), descripción (opcional), estado (pendiente/hecha) y posición/orden.

## 4. Requisitos no funcionales

| ID | Requisito |
|---|---|
| NFR-01 | **Usabilidad sin curva de aprendizaje**: la interfaz debe ser autoexplicativa, sin necesidad de manual ni formación. Acciones principales accesibles en 1 toque/clic. |
| NFR-02 | **Responsive / mobile-first**: la app debe verse y funcionar correctamente en móvil (uso mayoritario previsto desde el teléfono), además de en escritorio. |
| NFR-03 | **Idioma**: interfaz íntegramente en **español**. |
| NFR-04 | **Estética limpia y neutra**, sin recargar. El diseño visual concreto se definirá en Fase 2 (guía de estilos). |
| NFR-05 | **Accesibilidad WCAG 2.1 nivel AA**: contraste suficiente, navegación por teclado, foco visible, etiquetas y roles ARIA en controles, alternativas accesibles para el drag & drop. |
| NFR-06 | **Tiempo real / latencia percibida baja**: la propagación de cambios entre clientes conectados debe ser prácticamente inmediata (objetivo orientativo < 1 s en red normal). |
| NFR-07 | **Sin instalación**: aplicación web accesible desde navegador moderno, sin instalar nada en el dispositivo. |
| NFR-08 | **Mantenibilidad / simplicidad**: stack y arquitectura sencillos de mantener (criterio explícito del cliente); preferir lo simple frente a lo sofisticado. |
| NFR-09 | **Persistencia compartida**: el estado de la lista se conserva en servidor entre sesiones y dispositivos; no se pierde al cerrar el navegador. |
| NFR-10 | **Disponibilidad básica**: el servicio debe estar accesible en horario de trabajo del equipo; no se exigen SLA formales dada la criticidad baja. |
| NFR-11 | **Política de concurrencia**: ante ediciones simultáneas de una misma tarea se aplica **last-write-wins** (la última escritura prevalece, sin bloqueo ni resolución de conflictos). El cambio resultante se propaga en tiempo real (RF-09). |
| NFR-12 | **Límites por defecto**: el nº de tareas por lista es conceptualmente ilimitado, pero se aplica un **límite de salvaguarda configurable** (por defecto 100 tareas) y longitudes máximas por campo (título 120 caracteres, descripción 2000 caracteres). No son reglas de negocio, sino protección frente a abuso/errores. |

## 5. Restricciones técnicas no negociables

- RT-1: Aplicación **web** accesible desde navegador, **sin instalaciones** y **sin login/autenticación**. Despliegue como **sistema interno** (red corporativa/VPN), no expuesto públicamente en Internet (decisión D-7).
- RT-2: **Una sola lista compartida**; la app no contempla múltiples listas ni espacios separados.
- RT-3: Interfaz en **español**.
- RT-4: Arquitectura con **backend y base de datos compartida** como fuente única de verdad (decisión D-1), con canal de **tiempo real** hacia los clientes (decisión D-2).
- RT-5: Sin preferencia de stack por parte del cliente: se delega la recomendación al equipo, condicionada a **simplicidad de mantenimiento** (NFR-08). A concretar en Fase 2 (propuesta de arquitectura).

## 6. Alcance

**Dentro de esta fase:**

- Única checklist compartida con tareas (título, descripción, estado, orden).
- Alta, edición, marcado/desmarcado, borrado y reordenación (drag & drop) de tareas (RF-01..RF-06).
- Visualización de progreso (RF-05) y de la lista (RF-08).
- Reinicio de la lista con confirmación (RF-07).
- Sincronización en tiempo real entre usuarios (RF-09, NFR-06).
- Responsive/móvil, español y accesibilidad AA.

**Fuera de esta fase (aplazado o descartado):**

- Cuentas de usuario, login, roles o permisos diferenciados (descartado por el cliente).
- Múltiples listas, plantillas de checklist o duplicado de listas.
- Papelera / deshacer borrado (el borrado es definitivo por diseño).
- Historial, auditoría, comentarios, adjuntos, fechas de vencimiento, asignación de tareas a personas.
- Notificaciones (email/push), exportación/importación, integraciones externas.
- App nativa móvil (solo web responsive).

## 7. Variables de entorno y configuración requerida

> Provisional; se concretará con el stack elegido en Fase 2. No se incluyen valores reales de secretos.

| Variable | Propósito |
|---|---|
| `PORT` | Puerto de escucha del servidor backend. |
| `DATABASE_URL` | Cadena de conexión a la base de datos compartida. |
| `NODE_ENV` / entorno | Entorno de ejecución (desarrollo/producción). |
| `CORS_ORIGIN` | Origen(es) permitido(s) para el cliente web (si front y back se sirven por separado). |
| `MAX_TAREAS` | Límite de salvaguarda de tareas por lista (default: 100). |
| `MAX_TITULO_LEN` | Longitud máxima del título de tarea (default: 120). |
| `MAX_DESC_LEN` | Longitud máxima de la descripción de tarea (default: 2000). |

## 8. Preguntas abiertas y pendientes

- ✅ P-1 **(Resuelto)** **Acceso/despliegue** — Es un **sistema interno** (red corporativa/VPN), no expuesto públicamente. Se mantiene sin autenticación (RT-1) y datos no sensibles (brief §6). Ver decisión D-7.
- ✅ P-2 **(Resuelto)** **Concurrencia conflictiva** — Política **last-write-wins** ante ediciones simultáneas (NFR-11). Ver decisión D-8.
- ✅ P-3 **(Resuelto)** **Límites** — Nº de tareas conceptualmente ilimitado con **límite de salvaguarda por defecto** (100) y longitudes máximas por campo, todo configurable (NFR-12, §7). Ver decisión D-9.

> No quedan pendientes abiertos ni **[BLOQUEANTES]**: el catálogo es suficiente para arrancar el paso 1.2.

## 9. Decisiones tomadas en el paso 1.1

| ID | Pregunta | Opciones | Decisión | Origen | Justificación |
|---|---|---|---|---|---|
| D-1 | ¿Cómo se almacena la lista compartida? | Backend+BD / solo navegador / backend+fichero | **Backend + BD compartida** | Usuario | Única opción que cumple "lista compartida" real entre personas y dispositivos. |
| D-2 | ¿Cómo ven los usuarios los cambios de los demás? | Refresco periódico / tiempo real | **Tiempo real (websockets)** | Usuario | Mejor experiencia colaborativa para edición concurrente de un equipo. |
| D-3 | Mecánica de reordenación | Drag & drop / botones subir-bajar | **Arrastrar y soltar** | Usuario | Más intuitivo y alineado con "minimalista, sin manual"; requiere cuidar el soporte táctil (recogido en RF-06/NFR-05). |
| D-4 | Comportamiento del botón Reiniciar | — | **Habilitado solo al 100% hecho + confirmación previa** | Default | El brief sitúa el reinicio "cuando todas las tareas están hechas"; la confirmación protege ante un borrado definitivo accidental. Confirmar en validación. |
| D-5 | Nivel de accesibilidad | WCAG 2.1 AA / básica | **WCAG 2.1 AA** | Usuario | Base sólida (teclado, contraste, foco) sin sobrecoste grande para una app simple. |
| D-6 | Acceso sin autenticación | — | **Sin login** | Cliente (brief §4) | Requisito explícito del cliente; datos no sensibles. Despliegue interno (D-7). |
| D-7 | ¿Despliegue interno o público? | Interno / público | **Sistema interno** (red/VPN) | Usuario | El acceso queda restringido a la red del equipo; valida mantener la ausencia de login sin exponer la app en Internet. |
| D-8 | Política ante edición simultánea | — | **Last-write-wins** | Usuario | La última escritura prevalece, sin bloqueos ni merge; simple y suficiente para un equipo pequeño (NFR-11). |
| D-9 | Límite de tareas y longitudes | Ilimitado / con límite | **Límite de salvaguarda por defecto, configurable** | Usuario | Sin tope de negocio, pero con valores por defecto (100 tareas; título 120; desc. 2000) configurables como protección (NFR-12, §7). |
