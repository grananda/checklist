# tiempo-real

Fase 5 (HU-09, cierra F2): propagacion en tiempo real. Server: el gateway Socket.IO emite tarea:creada|actualizada|borrada|reordenada y lista:reset tras cada mutacion (HU-02..HU-08), con contratos en shared/eventos.ts. Client: api/socket.ts (conexion, reconexion), suscripcion del store a los eventos, re-sincronizacion al reconectar (GET /api/tareas) y last-write-wins (NFR-11). Latencia objetivo <1s (NFR-06). Capa transversal sobre las mutaciones existentes. Basado en docs/detalle-historias-usuario.md HU-09 y docs/arquitectura-base.md 7-9.
