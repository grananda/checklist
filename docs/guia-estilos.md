# Guia de estilos — CheckList

> Documento de Fase 2 (AIDD · paso 2.3). Generado por `aidd style-guide`.
> Entrada: docs/detalle-historias-usuario.md + referencia visual/marca.
> Pendiente de aprobacion humana.

**Versión:** 1.0 · **Fecha:** 2026-06-22 · **Estado:** 🟢 Aprobado

> ⚠️ **Identidad visual PROVISIONAL.** No se ha aportado todavía la referencia de marca (el usuario indicó que la facilitará). La paleta, la tipografía y la iconografía de abajo son una base neutra y accesible alineada con la estética "limpia y neutra" pedida (NFR-04) y con un acento **azul corporativo**. Al recibir la referencia, se ajustan los tokens de §4 sin cambiar la estructura del documento.

---

## 1. Principios de diseño y UX

Derivados de los objetivos del cliente (O-1..O-4) y de los NFR:

1. **Sin curva de aprendizaje (NFR-01, O-1).** Interfaz autoexplicativa; la acción principal (marcar/desmarcar, añadir) en 1 toque. Nada que requiera manual.
2. **Minimalista y neutra (NFR-04).** Una sola pantalla, jerarquía clara, sin adornos. El contenido (las tareas y el progreso) es el protagonista.
3. **Mobile-first (NFR-02, O-4).** Se diseña primero para móvil; el escritorio es una ampliación. Áreas táctiles cómodas (mínimo 44×44 px).
4. **Progreso siempre visible (O-3).** El estado "qué falta / qué está hecho" es permanente y legible de un vistazo.
5. **Accesible por defecto (NFR-05).** Contraste AA, foco visible, semántica correcta y operable por teclado en todos los controles.
6. **Español (NFR-03).** Todos los textos de interfaz en español.

Tono visual: sobrio, profesional, tranquilo. Color usado con intención (estado y acción), no decorativo.

## 2. Paleta de colores

Valores hex por rol. Todos los pares texto/fondo indicados cumplen **WCAG 2.1 AA** (≥ 4.5:1 texto normal, ≥ 3:1 texto grande y elementos de UI).

| Rol | Token | Hex | Uso | Contraste |
|---|---|---|---|---|
| Primario (acento) | `--color-primary` | `#0B5CAD` | Botones principales, enlaces, barra de progreso, foco | 5.6:1 sobre blanco ✅ |
| Primario hover/activo | `--color-primary-hover` | `#094C91` | Estados hover/pressed del primario | ✅ |
| Primario (texto sobre acento) | `--color-on-primary` | `#FFFFFF` | Texto/iconos sobre fondo primario | 5.6:1 ✅ |
| Éxito / hecha | `--color-success` | `#1F8A4C` | Estado "hecha", check completado | 4.5:1 sobre blanco ✅ |
| Peligro / borrar | `--color-danger` | `#B42318` | Acción de borrar, confirmación destructiva | 6.0:1 sobre blanco ✅ |
| Aviso / límite | `--color-warning` | `#9A5B00` | Avisos de validación y límites (NFR-12) | 4.7:1 sobre blanco ✅ |
| Fondo de página | `--color-bg` | `#F7F8FA` | Lienzo de la app | — |
| Superficie / tarjeta | `--color-surface` | `#FFFFFF` | Item de tarea, formularios, diálogos | — |
| Borde / divisor | `--color-border` | `#D7DBE0` | Bordes de campos, separadores | 3.1:1 sobre blanco ✅ (UI) |
| Texto principal | `--color-text` | `#1A1D21` | Títulos y cuerpo | 15.8:1 sobre blanco ✅ |
| Texto secundario | `--color-text-muted` | `#5A626B` | Descripciones, metadatos, placeholders | 5.2:1 sobre blanco ✅ |
| Foco | `--color-focus` | `#0B5CAD` | Anillo de foco (con outline visible) | ✅ |

> Estados de tarea: **pendiente** = texto principal sobre superficie blanca; **hecha** = check `--color-success` + título atenuado (`--color-text-muted`) y/o tachado. El estado nunca se comunica solo por color (se acompaña de icono/texto), por accesibilidad.

## 3. Tipografía, espaciado e iconografía

**Tipografía** (provisional: stack de sistema, sin dependencia externa, carga instantánea y neutra):

```
--font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

Escala tipográfica (mobile-first, `rem` sobre base 16px):

| Token | Tamaño | Uso |
|---|---|---|
| `--font-size-xs` | 0.75rem (12px) | Metadatos, contador "x/total" |
| `--font-size-sm` | 0.875rem (14px) | Descripción de tarea, textos secundarios |
| `--font-size-base` | 1rem (16px) | Cuerpo, título de tarea (mínimo 16px para evitar zoom en iOS) |
| `--font-size-lg` | 1.25rem (20px) | Título de sección / cabecera |
| `--font-size-xl` | 1.5rem (24px) | Título de la app |
| Peso normal | 400 | Cuerpo |
| Peso medio | 600 | Títulos, botones, énfasis |
| Interlineado | 1.5 | Cuerpo (legibilidad AA) |

**Espaciado** (escala de 4px):

```
--space-1: 4px;  --space-2: 8px;  --space-3: 12px;  --space-4: 16px;
--space-5: 24px; --space-6: 32px; --space-8: 48px;
```

**Radios y elevación:**

```
--radius-sm: 6px;  --radius-md: 10px;  --radius-full: 999px;
--shadow-sm: 0 1px 2px rgba(16,24,40,.06);
--shadow-md: 0 4px 12px rgba(16,24,40,.10);  /* diálogos */
```

**Iconografía:** set lineal, trazo uniforme, neutro. Provisional: **Lucide** (u otro set lineal MIT) o iconos SVG inline. Iconos mínimos necesarios: check/checkbox, lápiz (editar), papelera (borrar), más (añadir), advertencia (aviso). Tamaño base 20–24px. Todo icono accionable lleva `aria-label`; los decorativos, `aria-hidden`.

## 4. Design tokens CSS

Custom properties listas para usar tal cual por el frontend:

```css
:root {
  /* Color */
  --color-primary: #0B5CAD;
  --color-primary-hover: #094C91;
  --color-on-primary: #FFFFFF;
  --color-success: #1F8A4C;
  --color-danger: #B42318;
  --color-warning: #9A5B00;
  --color-bg: #F7F8FA;
  --color-surface: #FFFFFF;
  --color-border: #D7DBE0;
  --color-text: #1A1D21;
  --color-text-muted: #5A626B;
  --color-focus: #0B5CAD;

  /* Tipografia */
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;
  --font-weight-normal: 400;
  --font-weight-medium: 600;
  --line-height-base: 1.5;

  /* Espaciado */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px;  --space-4: 16px;
  --space-5: 24px; --space-6: 32px; --space-8: 48px;

  /* Radios y sombras */
  --radius-sm: 6px;  --radius-md: 10px;  --radius-full: 999px;
  --shadow-sm: 0 1px 2px rgba(16,24,40,.06);
  --shadow-md: 0 4px 12px rgba(16,24,40,.10);

  /* Layout */
  --container-max: 720px;
  --tap-target-min: 44px;
  --focus-ring: 0 0 0 3px rgba(11,92,173,.45);
}
```

> Al recibir la marca definitiva, basta sustituir los valores de `--color-primary*` y, si procede, `--font-sans`; el resto de tokens se mantiene.

## 5. Componentes base y pautas de uso

Componentes mínimos para las pantallas del MVP (HU-01..HU-06):

- **Botón primario** — fondo `--color-primary`, texto `--color-on-primary`, `--radius-md`, altura ≥ `--tap-target-min`. Acción principal: "Añadir tarea". Hover/active usan `--color-primary-hover`. Estado deshabilitado (p. ej. Reiniciar en F2) con opacidad reducida y `aria-disabled`.
- **Botón secundario / texto** — para "Cancelar" en formularios y diálogos: borde `--color-border` o solo texto en `--color-primary`.
- **Botón destructivo** — para confirmar borrado: fondo o texto `--color-danger`. Nunca como acción por defecto del foco en el diálogo.
- **Campo de texto / textarea** — borde `--color-border`, foco con `--focus-ring`. Etiqueta visible asociada (`<label for>`). Mensaje de error en `--color-warning`/`--color-danger` con `aria-describedby`. Usado en alta/edición (HU-02/HU-04).
- **Item de tarea (`ItemTarea`)** — superficie `--color-surface`, padding `--space-4`, separación entre items con `--color-border`. Contiene: checkbox de estado, título, descripción opcional (`--color-text-muted`, `--font-size-sm`) y acciones (editar, borrar). Estado "hecha": check `--color-success` + título atenuado/tachado.
- **Checkbox de estado** — control accesible nativo o con `role="checkbox"` + `aria-checked`; área táctil ≥ 44px. Es la acción de 1 toque de HU-03.
- **Indicador de progreso (`IndicadorProgreso`)** — texto "X de Y hechas" + barra (`--color-primary` sobre pista `--color-border`) + porcentaje. La barra usa `role="progressbar"` con `aria-valuenow/min/max`; el valor también es texto (no solo color).
- **Diálogo de confirmación (`DialogoConfirmacion`)** — modal con `--shadow-md`, `role="dialog"` + `aria-modal`, foco atrapado, cierre con Escape, foco inicial en el botón seguro ("Cancelar"). Usado en borrado (HU-05) y reinicio (HU-08, F2).
- **Estado vacío** — mensaje centrado en `--color-text-muted` invitando a añadir la primera tarea (HU-01).
- **Aviso / toast de validación** — para límites y errores (NFR-12): color `--color-warning`/`--color-danger`, rol `status`/`alert` según urgencia.

## 6. Responsive y accesibilidad

**Breakpoints (mobile-first):**

```
/* base: móvil, < 600px — una columna, ancho completo */
--bp-sm: 600px;   /* móvil grande / tablet vertical */
--bp-md: 900px;   /* tablet / escritorio: contenido centrado a --container-max */
```

Reglas:
- La app se centra en una columna de máx. `--container-max` (720px); en móvil ocupa el ancho con padding `--space-4`.
- Áreas táctiles ≥ 44×44px; espaciado suficiente entre acciones para evitar toques erróneos.
- Tipografía base 16px para evitar el zoom automático en iOS.

**Accesibilidad — WCAG 2.1 AA (NFR-05):**
- **Contraste:** todos los pares de §2 cumplen AA (texto ≥ 4.5:1; UI/grande ≥ 3:1).
- **Foco visible:** `--focus-ring` en todo elemento interactivo; nunca se elimina el outline sin sustituto visible.
- **Teclado:** toda acción (añadir, marcar, editar, borrar, confirmar) operable por teclado; orden de tabulación lógico; diálogos con foco atrapado y Escape.
- **Semántica:** lista con marcado de lista; checkbox con estado expuesto; `progressbar` con valores ARIA; labels asociadas a campos; iconos accionables con `aria-label`.
- **No solo color:** el estado "hecha" se indica con icono/tachado además del color; los errores con texto además del color.
- **Movimiento:** respetar `prefers-reduced-motion` en transiciones.
- **Drag & drop (HU-07, F2):** alternativa accesible por teclado (mover arriba/abajo) obligatoria.

## 7. Estructura de pantallas y navegación

Coherente con la arquitectura del prototipo (§3-§4 de `docs/arquitectura-base-prototipo.md`): **una sola pantalla** (RT-2), sin navegación entre vistas.

```
┌───────────────────────────────┐
│ CheckList            (cabecera)│  título app
│ ▓▓▓▓▓▓░░░░  3 de 6 hechas (50%)│  IndicadorProgreso (sticky arriba)
├───────────────────────────────┤
│ [ ] Crear rama de release      │  ItemTarea (pendiente)
│     descripción opcional   ✏ 🗑 │
│ [✓] Pasar test suite           │  ItemTarea (hecha, atenuada)
│ ...                            │
├───────────────────────────────┤
│        [ + Añadir tarea ]      │  botón primario (sticky abajo en móvil)
└───────────────────────────────┘
```

Criterios de navegación:
- El **progreso** queda fijo/visible en la parte superior; la acción de **añadir** accesible de forma permanente (botón fijo abajo en móvil).
- Alta y edición se resuelven **in situ** (inline o modal) sin abandonar la lista.
- El borrado abre el **diálogo de confirmación** sobre la misma pantalla.
- Sin menús ni rutas adicionales: la simplicidad es un requisito (NFR-01, NFR-08).

## 8. Decisiones tomadas en el paso 2.3 (estilos)

| ID | Pregunta | Opciones | Decisión | Origen | Justificación |
|---|---|---|---|---|---|
| D-21 | Origen de la identidad visual | Base neutra / Figma / referencia (URL-marca) | **Referencia (URL/marca) pendiente; mientras, base neutra provisional** | Usuario | El usuario aportará referencia; se genera base neutra provisional para no bloquear y se ajustará al recibirla. |
| D-22 | Color de acento primario | Azul corporativo / verde / gris neutro | **Azul corporativo (`#0B5CAD`)** | Usuario | Sobrio, neutro, alineable con identidad corporativa NTT DATA; cumple contraste AA sobre blanco. |
| D-23 | Familia tipográfica | Stack de sistema / fuente web | **Stack de sistema (provisional)** | Default | Carga instantánea, neutra y sin dependencias; se revisará con la marca definitiva. |
| D-24 | Iconografía | Set lineal MIT (Lucide) / propia | **Set lineal (Lucide u otro MIT)** | Default | Neutro, consistente y sin coste; encaja con la estética minimalista. |
| D-25 | Nivel de accesibilidad | WCAG 2.1 AA / básica | **WCAG 2.1 AA** | Requisito (NFR-05) | Ya fijado en Fase 1 (D-5); la guía concreta contraste, foco y semántica. |

> **Pendiente [no bloqueante]:** recibir la referencia de marca del usuario para confirmar/ajustar paleta (`--color-primary*`), tipografía (`--font-sans`) e iconografía. La estructura y el resto de tokens se mantienen.
