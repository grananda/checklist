/**
 * Servicio de progreso (HU-06). La lógica vive en `@checklist/shared` (fuente única
 * compartida con el cliente); este módulo la expone como servicio de dominio del servidor.
 */
export { calcularProgreso, type Progreso } from '@checklist/shared';
