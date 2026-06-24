## 1. Servidor — emisión de eventos

- [x] 1.1 `realtime/gateway.ts`: exponer el `io` tipado (`EventosServidorACliente`) para emitir; conservar el registro de conexión/desconexión
- [x] 1.2 Inyectar el `io` en `routes/tareas.ts` (desde `buildApp`/`index.ts`) y emitir tras persistir cada mutación con los nombres/payloads de `shared/eventos.ts`
- [x] 1.3 Mapear: POST→`tarea:creada`, PATCH/:id→`tarea:actualizada`, DELETE→`tarea:borrada`, PATCH/orden→`tarea:reordenada`, POST/reset→`lista:reset`

## 2. Cliente — socket y suscripción

- [x] 2.1 `client/src/api/socket.ts`: `socket.io-client` con reconexión automática; en `connect` (inicial y reconexión) disparar re-sync (`GET /api/tareas`)
- [x] 2.2 Store: aplicar eventos (`tarea:creada/actualizada`→upsert por id; `borrada`→quitar; `reordenada`→reemplazar lista; `lista:reset`→vaciar); progreso derivado; LWW por sobrescritura
- [x] 2.3 Conectar el socket al iniciar la app (efecto en `App`); degradación elegante si no conecta

## 3. Tests

- [x] 3.1 Integración de servidor: dos `socket.io-client`; verificar propagación de cada evento tras la mutación REST
- [x] 3.2 Integración: last-write-wins en ediciones simultáneas sobre la misma tarea
- [x] 3.3 e2e Playwright con dos contextos: un cambio en un contexto aparece en el otro (<1 s, NFR-06)

## 4. Verificación de cierre (cierra F2)

- [x] 4.1 Dos personas ven los cambios del otro sin recargar
- [x] 4.2 La reconexión re-sincroniza el estado (GET)
- [x] 4.3 Ediciones simultáneas resuelven por LWW sin bloqueo; criterios bloqueantes de HU-09 verificados
