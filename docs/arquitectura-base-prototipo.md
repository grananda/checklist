# Arquitectura del prototipo — CheckList

> Documento de Fase 2 (AIDD · paso 2.1). Generado por `aidd prototype-architecture`.
> Entradas: docs/mapa-historias-usuario.md, docs/detalle-historias-usuario.md.
> Demo 100% mockeada para validacion con cliente. Pendiente de aprobacion humana.

**Versión:** 1.0 · **Fecha:** 2026-06-22 · **Estado:** 🟡 Pendiente de aprobación

---

## 1. Objetivo de la demo

Validar con el cliente el **núcleo usable (F1 / MVP)** de CheckList recorriendo de punta a punta la gestión de una única lista compartida, **sin construir backend real**. Se busca confirmar:

- Que la experiencia es **autoexplicativa y minimalista** (O-1, NFR-01): cualquiera la usa sin manual.
- Que **de un vistazo se ve qué está hecho y qué falta** (O-3, HU-06).
- Que el flujo de **añadir → marcar/desmarcar → editar → borrar** se siente natural en **móvil** (O-4, NFR-02).

**Flujos cubiertos (las 6 historias de F1):**

| Historia | Flujo en la demo |
|---|---|
| HU-01 (RF-08) | Abrir la web y ver la lista compartida con título, estado y descripción; estado vacío explícito. |
| HU-02 (RF-01) | Añadir tarea con título obligatorio y descripción opcional; validaciones y límites. |
| HU-03 (RF-02) | Marcar/desmarcar una tarea (reversible) en 1 toque. |
| HU-04 (RF-03) | Editar título y descripción de una tarea existente. |
| HU-05 (RF-04) | Borrar una tarea con confirmación previa (D-14). |
| HU-06 (RF-05) | Ver el progreso (hechas/total, %, barra) actualizándose en vivo. |

**Fuera de la demo (F2):** drag & drop (HU-07), reiniciar lista (HU-08) y tiempo real entre clientes (HU-09). Ver §7.

## 2. Stack mínimo

Prioriza **velocidad de montaje y cero backend**. Toda la "lógica de servidor" se simula en el navegador.

| Capa | Elección | Justificación |
|---|---|---|
| UI | **HTML + CSS + JavaScript vanilla** (sin framework, sin build obligatorio) | Demo navegable que `booster-ux` puede generar directamente como HTML. Máxima rapidez, cero configuración. |
| Estilos | **CSS plano mobile-first** con variables CSS para colores/espaciado | Soporta NFR-02 (móvil) y prepara los tokens que formalizará la guía de estilos (paso 2.3). Estética limpia y neutra (NFR-04). |
| Estado / "datos" | **Store JS en memoria** + espejo en **localStorage** | Da sensación realista de persistencia entre recargas sin servidor (decisión de alcance confirmada). |
| Idioma | Textos íntegramente en **español** (NFR-03) | Requisito no negociable (RT-3). |

> No se usa Node/servidor, BD, websockets ni autenticación: todo se mockea (ver §5). Si más adelante se prefiere un andamiaje con build, **Vite + vanilla** es la evolución natural sin cambiar el modelo de datos.

## 3. Componentes y módulos

Organización lógica simple (un único punto de entrada navegable):

- **`AppShell`** — contenedor de la única pantalla: cabecera con título "CheckList" + indicador de progreso, cuerpo con la lista, y barra/acción de "añadir tarea".
- **`ListaTareas`** — renderiza el conjunto de tareas ordenadas; gestiona el **estado vacío** (mensaje invitando a añadir la primera tarea).
- **`ItemTarea`** — una fila: control de estado (checkbox), título, descripción opcional y acciones (editar, borrar). Refleja pendiente/hecha.
- **`FormularioTarea`** — alta y edición (reutilizado): campos título (obligatorio) y descripción (opcional), con validación de obligatoriedad y longitudes.
- **`IndicadorProgreso`** — calcula y muestra hechas/total, porcentaje y barra (HU-06). Se recalcula ante cualquier cambio.
- **`DialogoConfirmacion`** — confirmación previa de borrado (HU-05 / D-14).
- **`mockStore`** — "modelo": API en memoria (`getTareas`, `addTarea`, `toggleTarea`, `updateTarea`, `deleteTarea`) que persiste en localStorage y notifica a la UI para re-renderizar.

> El `mockStore` aísla la "fuente de verdad" simulada: cuando se construya el backend real (paso 2.4), solo se sustituye este módulo por llamadas reales, sin tocar la UI.

## 4. Pantallas o endpoints mínimos

Una **única pantalla** (SPA de una vista), coherente con "una sola lista compartida" (RT-2):

1. **Pantalla principal — Lista** (cubre HU-01, HU-03, HU-05, HU-06):
   - Cabecera: nombre de la app + `IndicadorProgreso`.
   - Cuerpo: `ListaTareas` con sus `ItemTarea` (o estado vacío).
   - Acción de añadir (botón/campo siempre accesible).
2. **Alta de tarea** (HU-02): formulario inline o modal con título + descripción.
3. **Edición de tarea** (HU-04): mismo formulario precargado con los valores de la tarea.
4. **Confirmación de borrado** (HU-05): diálogo modal con confirmar/cancelar.

No hay endpoints HTTP: las "operaciones" son funciones del `mockStore` (§5). Todas las acciones accesibles por teclado y con foco visible (NFR-05).

## 5. Estrategia de mocks

| Elemento real | Cómo se simula en la demo |
|---|---|
| Backend + BD compartida (RT-4) | `mockStore` en memoria, espejado a **localStorage** (clave única, p. ej. `checklist:tareas`). Sobrevive a recargas del mismo navegador. |
| API REST/persistencia (NFR-09) | Funciones JS síncronas del store. Opcional: `setTimeout` corto para simular latencia y dar realismo. |
| Identidad interna de tarea | ID generado en cliente (contador o `crypto.randomUUID()`). |
| Tiempo real / multi-usuario (RF-09) | **No se simula** en esta demo. La "lista compartida" se representa como un estado único local; el carácter colaborativo se valida conceptualmente, no técnicamente. |
| Autenticación | No aplica: acceso anónimo directo (RT-1), nada que mockear. |
| Límites (NFR-12) | El store aplica los topes: máx. 100 tareas, título ≤ 120, descripción ≤ 2000, con avisos en español. |

**Reglas de negocio aplicadas en el mock (de los criterios de aceptación):**
- Título obligatorio: se rechaza vacío o solo espacios (HU-02, HU-04).
- Borrado con confirmación previa (HU-05 / D-14); sin papelera.
- Progreso coherente con lista vacía: "0 de 0" sin error (HU-06).

## 6. Datos de ejemplo

Seed inicial coherente con un proceso real del dominio del cliente (p. ej. **checklist de despliegue**), para que la demo arranque con contenido:

```
1. [hecha]      Crear rama de release            — Desde main, nombrar release/x.y.z
2. [hecha]      Pasar test suite completa        — Unit + integración en verde
3. [pendiente]  Actualizar changelog             — Resumen de cambios de la versión
4. [pendiente]  Desplegar en preproducción       — (sin descripción)
5. [pendiente]  Validación funcional con QA       — Smoke test de los flujos críticos
6. [pendiente]  Desplegar en producción           — Ventana acordada con el equipo
```

Estado inicial: 2/6 hechas → progreso ~33%. Permite mostrar de inmediato el indicador, marcar/desmarcar y llegar a un estado realista. Si se vacía la lista, la demo muestra el **estado vacío** de HU-01.

## 7. Supuestos y exclusiones

**Supuestos:**
- La demo se ejecuta en un navegador moderno (NFR-07); no requiere instalación.
- La "lista compartida" se valida con un único navegador: el cliente confía en que el backend real (paso 2.4) la hará realmente compartida.
- La persistencia es local al navegador (localStorage), no entre dispositivos.

**Exclusiones explícitas (se validan en fases/demos posteriores, no aquí):**
- **HU-07** drag & drop / reordenación (F2).
- **HU-08** reiniciar la lista (F2).
- **HU-09** tiempo real entre varias personas (F2).
- Backend, base de datos, websockets y despliegue real (paso 2.4 / implementación).
- Guía de estilos definitiva (paso 2.3): la demo usa un estilo neutro provisional.

## 8. Pasos mínimos de implementación

Secuencia para construir la demo recorrible de punta a punta:

1. **Esqueleto** `AppShell` con cabecera (título + hueco de progreso) y contenedor de lista. Estilo base mobile-first.
2. **`mockStore`** con estado en memoria + carga/guardado en localStorage y datos seed (§6).
3. **Render de `ListaTareas` / `ItemTarea`** leyendo del store, incluido el estado vacío (HU-01).
4. **`IndicadorProgreso`** calculado desde el store; se actualiza en cada cambio (HU-06).
5. **Marcar/desmarcar** (HU-03): toggle en 1 toque que actualiza store + progreso.
6. **Alta** (HU-02): `FormularioTarea` con validación de título obligatorio y longitudes.
7. **Edición** (HU-04): reutilizar el formulario precargado.
8. **Borrado** (HU-05): acción → `DialogoConfirmacion` → eliminar del store.
9. **Pase de accesibilidad** (NFR-05): roles/labels ARIA, foco visible, navegación por teclado en todos los controles y diálogos.
10. **Repaso móvil** (NFR-02) y de textos en español (NFR-03); verificar el recorrido completo del flujo F1.

> Comprobación de "punta a punta": con estos pasos se puede abrir la demo, ver el seed, añadir/editar/marcar/borrar tareas y ver el progreso cambiar, sin bloqueos.

## 9. Decisiones tomadas en el paso 2.1

| ID | Pregunta | Opciones | Decisión | Origen | Justificación |
|---|---|---|---|---|---|
| D-16 | Alcance de la demo | MVP F1 / F1+F2 / solo flujo crítico | **MVP completo F1 (HU-01..HU-06)** | Usuario | Valida el núcleo usable sin el coste de drag&drop, reinicio y tiempo real (F2). |
| D-17 | Persistencia del estado mock | Memoria+localStorage / solo memoria / seed read-only | **Memoria + localStorage** | Usuario | Sensación realista de persistencia entre recargas sin backend. |
| D-18 | Stack del prototipo | Vanilla sin build / framework+build | **HTML+CSS+JS vanilla** | Default | Máxima velocidad y compatible con la salida HTML de `booster-ux`; el modelo de datos no cambia si luego se añade build. |
| D-19 | Dominio de los datos seed | Genérico / proceso real | **Checklist de despliegue** | Default | Ejemplo reconocible del dominio del cliente (procesos repetitivos, brief §1). |
| D-20 | Simulación de tiempo real en la demo | Simular / excluir | **Excluir (HU-09 es F2)** | Default | El carácter colaborativo se valida conceptualmente; simularlo no aporta a la validación del MVP. |
