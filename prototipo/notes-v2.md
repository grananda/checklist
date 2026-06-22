# CheckList — Notas v2 (Web Interface Guidelines)

**Top-5 reglas aplicadas**
1. Semántica nativa antes que ARIA: `<header>/<main>/<footer>`, `<ul>/<li>`, `<button>`, `<label>` reales; ARIA solo donde aporta.
2. Foco completo: skip-link, `:focus-visible` global (halo 3px, offset 2px, ≥3:1), trap en modales y restauración del foco al cerrar.
3. Hit targets ≥44×44 en checkbox (label envolvente), inputs y botones icon-only; `touch-action: manipulation`.
4. `prefers-reduced-motion` respetado; solo se animan `opacity`/`transform`/`width`, nunca `transition: all`.
5. Estado "hecha" no solo por color: checkmark + tachado + texto sr-only "Hecha:/Pendiente:".

**Decisiones semánticas**
- Progreso con `role="progressbar"` + `aria-valuemin/max/now` y `aria-valuetext` legible (valor también como texto, no solo color/barra).
- Modales: `role="dialog"`, `aria-modal`, `aria-labelledby`/`aria-describedby`; confirmación de borrado con foco inicial en "Cancelar" (acción segura).
- `aria-live="polite"` anuncia marcado, alta, edición y borrado con el progreso recalculado.
- Botones icon-only con `aria-label` contextual ("Editar tarea: X"); iconos decorativos `aria-hidden`.

**Qué es interactivo (vanilla JS)**
- Marcar/desmarcar actualiza estado y progreso en vivo; alta/edición vía modal con validación (título obligatorio, trim, límites 120/2000); borrado con confirmación; estado vacío y progreso "0 de 0" sin división por cero.

**Contraste verificado (sobre #FFFFFF/#F7F8FA, AA)**
- Texto #1A1D21 ~15:1; secundario #5A626B ~5.0:1; primario #0B5CAD ~5.3:1; éxito #1F8A4C ~3.9:1 (UI/icono, ≥3:1); peligro #B42318 ~6.5:1; borde #D7DBE0 como UI no informativo. Foco #0B5CAD ≥3:1.
