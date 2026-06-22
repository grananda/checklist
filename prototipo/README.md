# Prototipo — CheckList

> Demo **100% mockeada** de la pantalla principal de CheckList, generada en la **Fase 2 / paso 2.2** del proceso AIDD (`aidd prototype` → `booster-ux`).
> Su finalidad es **validar el MVP (Fase 1) con el cliente**: aspecto, flujo y experiencia. **No es la aplicación real** (sin backend, sin base de datos, sin tiempo real).

**Fecha:** 2026-06-22 · **Estado:** 🟡 Pendiente de validación con cliente

---

## Qué es esto

Un prototipo navegable de **una sola pantalla** (la lista única compartida de CheckList), entregado en **dos variantes** con filosofías de diseño contrastadas para poder elegir o sintetizar la mejor. Ambas cubren las historias de la Fase 1:

- **HU-01** ver la lista y el progreso · **HU-02** añadir tarea · **HU-03** marcar/desmarcar · **HU-04** editar · **HU-05** borrar (con confirmación) · **HU-06** ver el progreso.

Documentos de origen: [../docs/arquitectura-base-prototipo.md](../docs/arquitectura-base-prototipo.md) (qué construir) y [../docs/guia-estilos.md](../docs/guia-estilos.md) (cómo se ve).

## Las dos variantes

| | **v1 — Editorial** | **v2 — Guidelines** |
|---|---|---|
| Ficheros | `index-v1.html` · `preview-v1.png` · `notes-v1.md` | `index-v2.html` · `preview-v2.png` · `notes-v2.md` |
| Prioridad | Estética y carácter visual | Accesibilidad y semántica estrictas |
| Color | OKLCH, neutros tintados; la barra de progreso vira a verde al 100% | Tokens de la guía literales, contraste AA verificado par por par |
| Estado "hecha" | Círculo de check verde + badge "Hecha" | Checkbox cuadrado marcado + tachado + texto para lector de pantalla |
| Accesibilidad | Buena base | Exhaustiva: skip-link, focus-trap en modales, `aria-live`, `role="progressbar"` con `aria-valuetext` |
| Sensación | "Producto diseñado" | "Estándar correcto" |

**v1** busca una pantalla con personalidad (toma alguna licencia sobre los tokens de marca).
**v2** busca pasar una auditoría de accesibilidad sin observaciones (cumple NFR-05 AA al pie de la letra).

> Recomendación: usar **v1** como dirección visual y adoptar la **base de accesibilidad de v2** (exigida por NFR-05) en la versión final. Lo natural es sintetizar ambas.

## Cómo verlo

No requiere instalación ni servidor: son archivos HTML autocontenidos (Tailwind vía CDN + JS inline).

1. **Previews rápidas:** abre `preview-v1.png` y `preview-v2.png`.
2. **Recorrer la demo:** abre `index-v1.html` o `index-v2.html` en un navegador moderno (doble clic o arrastrar al navegador).

> Necesita conexión a Internet la primera vez para cargar Tailwind desde su CDN.

## Qué se puede hacer (interactivo)

Ambas variantes son navegables de verdad:

- **Marcar / desmarcar** una tarea → el progreso se recalcula en vivo.
- **Añadir tarea** → modal con título obligatorio (rechaza vacío o solo espacios) y descripción opcional. Límites: título 120, descripción 2000 caracteres.
- **Editar** → modal precargado con los valores de la tarea.
- **Borrar** → diálogo de **confirmación previa** (el borrado es definitivo, no hay papelera).
- **Estado vacío** → si se borran todas las tareas, aparece el mensaje invitando a añadir la primera y el progreso muestra "0 de 0".

Datos de ejemplo: un *checklist de despliegue* con 6 tareas (2 hechas → 33%).

## Qué NO incluye (es un mock)

- **Sin backend, BD ni persistencia entre dispositivos.** El estado vive solo en la pestaña del navegador.
- **Sin tiempo real / multiusuario** (HU-09), **sin reordenar por arrastre** (HU-07) ni **reiniciar la lista** (HU-08): son funciones de la Fase 2 (F2), fuera del alcance de esta demo de validación.
- La "lista compartida" se simula en local; lo realmente compartido llega con el backend real (paso 2.4, arquitectura técnica definitiva).

## Siguiente paso

Presentar el prototipo al cliente y recoger feedback. Después:

- Actualizar [../docs/cliente-requisitos.md](../docs/cliente-requisitos.md) con el feedback.
- Si hay **cambios significativos** → volver al paso 1.1 (`aidd requirements`).
- Si el feedback es **menor** → continuar con `aidd architecture-proposal` (2.3) y `aidd architecture` (2.4).

---

*Generado con `booster-ux` 1.2.0 (variantes v1 editorial / v2 Web Interface Guidelines).*
