# Decisiones del pre-flight — tiempo-real

> Pre-flight de apertura (`native-ai open change tiempo-real`). Skill `native-ai-specs` v1.4.0.
> El usuario pidió no ser interrumpido; las preferencias se resuelven con el default recomendado
> y quedan marcadas como `auto-default` para revisión posterior.

## emision-de-eventos

- **Fecha**: 2026-06-24
- **Tipo**: preferencia
- **Origen**: auto-default
- **Contexto**: arquitectura §7 (el gateway difunde tras cada mutación); el gateway hoy es andamiaje sin negocio.
- **Pregunta**: ¿Cómo emite el servidor los eventos tras una mutación?
- **Opciones evaluadas**:
  - a) Inyectar el `io` (Socket.IO) en las rutas y emitir tras persistir (en `routes/tareas.ts`, capa transporte)
  - b) Un event-emitter de dominio desacoplado que el gateway escucha
  - c) Emitir desde el servicio
- **Decision**: a) inyectar `io` en las rutas y emitir tras persistir
- **Justificación**: El transporte ya orquesta servicio→respuesta; emitir el evento de difusión es responsabilidad de transporte (no del dominio puro). Mínima indirección; el servicio sigue testeable sin sockets.

## alcance-de-difusion

- **Fecha**: 2026-06-24
- **Tipo**: confirmacion
- **Origen**: auto-default
- **Contexto**: el cliente que muta vía REST también recibirá el broadcast; los eventos llevan la `Tarea` completa.
- **Pregunta**: ¿Difundir a todos los clientes o a todos menos el emisor?
- **Opciones evaluadas**:
  - a) A todos (`io.emit`); aplicar el evento es idempotente
  - b) A todos menos el emisor (`socket.broadcast.emit`)
- **Decision**: a) a todos
- **Justificación**: La mutación llega por REST (sin socket asociado), así que no hay "emisor socket" fiable que excluir; aplicar el evento con la `Tarea` completa es idempotente y mantiene a todos coherentes (incluido el originador).

## reconexion-y-lww

- **Fecha**: 2026-06-24
- **Tipo**: confirmacion
- **Origen**: auto-default
- **Contexto**: HU-09 (reconexión re-sincroniza) y NFR-11 (last-write-wins).
- **Pregunta**: ¿Reconexión y concurrencia?
- **Opciones evaluadas**:
  - a) `socket.io-client` con reconexión automática; al (re)conectar, `GET /api/tareas` para re-sincronizar; los eventos sobrescriben el estado local (LWW natural)
  - b) Buffer/cola de eventos perdidos
- **Decision**: a) reconexión automática + re-sync por GET + LWW por sobrescritura
- **Justificación**: Simple y suficiente a esta escala (sin pub/sub multi-instancia); el estado del servidor es la fuente de verdad y el GET de re-sync cierra cualquier hueco.

## pruebas-tiempo-real

- **Fecha**: 2026-06-24
- **Tipo**: preferencia
- **Origen**: auto-default
- **Contexto**: HU-09 exige verificar propagación entre dos clientes, reconexión y LWW.
- **Pregunta**: ¿Cómo probar la propagación?
- **Opciones evaluadas**:
  - a) Test de integración de servidor con dos `socket.io-client` (propagación + LWW) + e2e con dos contextos de navegador
  - b) Solo e2e
- **Decision**: a) integración con dos clientes socket + e2e dos contextos
- **Justificación**: El test de integración es rápido y determinista para la propagación/LWW; el e2e con dos contextos valida el flujo real de extremo a extremo (<1 s, NFR-06).
