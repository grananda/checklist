# Decisiones del pre-flight — tareas-api-crud

> Pre-flight de apertura (`native-ai open change tareas-api-crud`). Skill `native-ai-specs` v1.4.0.
> El usuario pidió no ser interrumpido; las preferencias se resuelven con el default recomendado
> y quedan marcadas como `auto-default` para revisión posterior.

## validacion-transporte

- **Fecha**: 2026-06-24
- **Tipo**: preferencia
- **Origen**: auto-default
- **Contexto**: docs/arquitectura-base.md §5 ("Validar forma de la petición" en transporte; reglas en servicio).
- **Pregunta**: ¿Cómo se valida la forma (tipos/campos requeridos) en las rutas?
- **Opciones evaluadas**:
  - a) JSON Schema nativo de Fastify por ruta (400 automático); semántica en `tareaService` con validadores de `shared`
  - b) Todo en el servicio
  - c) Zod en transporte
- **Decision**: a) JSON Schema de Fastify
- **Justificación**: Nativo (sin dependencia extra), separa forma (transporte) de semántica (servicio) según §5, y reutiliza `validarTitulo`/`validarDescripcion` de `shared` para la parte semántica.

## patch-parcial-descripcion

- **Fecha**: 2026-06-24
- **Tipo**: preferencia
- **Origen**: auto-default
- **Contexto**: docs/arquitectura-base.md §9 (PATCH /api/tareas/:id cubre HU-03 toggle y HU-04 editar); HU-04 permite descripción vacía.
- **Pregunta**: ¿Cómo se distingue "no cambiar un campo" de "vaciar la descripción"?
- **Opciones evaluadas**:
  - a) Campo ausente = no cambia; `descripcion: ""` = vaciar; `descripcion: "texto"` = actualizar
  - b) Usar `null` para vaciar
- **Decision**: a) ausente=no cambia, ""=vaciar
- **Justificación**: Semántica PATCH limpia y suficiente para HU-03/HU-04; evita distinguir `null` vs `""` en cliente y BD.

## contrato-patch-unificado

- **Fecha**: 2026-06-24
- **Tipo**: confirmacion
- **Origen**: auto-default
- **Contexto**: docs/arquitectura-base.md §9 fija un único `PATCH /api/tareas/:id` para HU-03 (toggle) y HU-04 (editar).
- **Pregunta**: ¿Endpoint PATCH unificado con cuerpo parcial `{ hecha?, titulo?, descripcion? }`?
- **Opciones evaluadas**:
  - a) PATCH unificado parcial
  - b) Endpoints separados (toggle / editar)
- **Decision**: a) PATCH unificado parcial
- **Justificación**: Decisión ya cerrada en la arquitectura (§9); no se reabre.

## identificador-y-timestamps

- **Fecha**: 2026-06-24
- **Tipo**: confirmacion
- **Origen**: auto-default
- **Contexto**: D-35 (UUID generado en servidor); modelo §8 (`createdAt`/`updatedAt`).
- **Pregunta**: ¿Generación de `id` y marcas de tiempo?
- **Opciones evaluadas**:
  - a) `crypto.randomUUID()` en servidor + timestamps ISO 8601 en servidor
  - b) Otro esquema
- **Decision**: a) `crypto.randomUUID()` + ISO 8601 en servidor
- **Justificación**: Coherente con D-35; sin dependencias y suficiente a esta escala.
