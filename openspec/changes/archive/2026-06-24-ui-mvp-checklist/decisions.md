# Decisiones del pre-flight — ui-mvp-checklist

> Pre-flight de apertura (`native-ai open change ui-mvp-checklist`). Skill `native-ai-specs` v1.4.0.
> El usuario pidió no ser interrumpido; las preferencias se resuelven con el default recomendado
> y quedan marcadas como `auto-default` para revisión posterior.

## sincronizacion-store

- **Fecha**: 2026-06-24
- **Tipo**: preferencia
- **Origen**: auto-default
- **Contexto**: docs/arquitectura-base.md §7-8 (el store se sincroniza con el servidor; *optimistic update* es opcional).
- **Pregunta**: ¿Cómo refleja el store las mutaciones?
- **Opciones evaluadas**:
  - a) Aplicar al store la `Tarea` devuelta por la API (POST/PATCH) y quitar en DELETE; `GET` al cargar
  - b) Optimistic update + reconciliación
  - c) Refetch completo del `GET` tras cada mutación
- **Decision**: a) aplicar la respuesta del servidor al store
- **Justificación**: Servidor como fuente de verdad (NFR/RT-4) con mínima complejidad; sin optimistic (innecesario sin tiempo real en esta fase) ni refetch redundante. El tiempo real (HU-09) llega en la Fase 5.

## formulario-alta-edicion

- **Fecha**: 2026-06-24
- **Tipo**: confirmacion
- **Origen**: auto-default
- **Contexto**: docs/guia-estilos.md §5/§7 (alta y edición como modal sobre la pantalla única).
- **Pregunta**: ¿Alta/edición en modal o inline?
- **Opciones evaluadas**:
  - a) Modal (`FormularioTarea`) con foco atrapado
  - b) Inline
- **Decision**: a) Modal
- **Justificación**: Ya fijado en la guía de estilos; coherente con `DialogoConfirmacion`.

## e2e-tooling

- **Fecha**: 2026-06-24
- **Tipo**: preferencia
- **Origen**: auto-default
- **Contexto**: roadmap Fase 3 y criterios de cierre exigen e2e del recorrido MVP y auditoría de accesibilidad.
- **Pregunta**: ¿Herramientas de e2e y de accesibilidad?
- **Opciones evaluadas**:
  - a) Playwright (e2e) + axe-core (a11y, en componentes y/o e2e)
  - b) Solo tests de componentes
- **Decision**: a) Playwright + axe-core
- **Justificación**: Cumple el criterio de cierre ("e2e MVP en verde", "axe-core sin violaciones AA"); Playwright ya estaba previsto en la arquitectura (`e2e/checklist.spec.ts`).

## validacion-cliente

- **Fecha**: 2026-06-24
- **Tipo**: confirmacion
- **Origen**: auto-default
- **Contexto**: la validación canónica es del servidor (NFR-12); el cliente reutiliza `validarTitulo`/`validarDescripcion` de `shared` para feedback inmediato.
- **Pregunta**: ¿El cliente valida o delega todo al servidor?
- **Opciones evaluadas**:
  - a) Validación de UX en cliente con los validadores de `shared` + el servidor sigue siendo la autoridad
  - b) Solo servidor (el cliente muestra el error 400)
- **Decision**: a) cliente valida para UX, servidor autoritativo
- **Justificación**: Mejor experiencia (feedback inmediato sin round-trip) reutilizando la misma regla; no duplica lógica (es el mismo `shared`).
