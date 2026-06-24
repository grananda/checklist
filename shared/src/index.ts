/** API público del paquete `@checklist/shared`. */
export type { Tarea, EstadoTarea } from './tarea.js';
export { estadoDeTarea } from './tarea.js';

export {
  EVENTOS,
  type NombreEvento,
  type EventosServidorACliente,
  type EventosClienteAServidor,
} from './eventos.js';

export { LIMITES_DEFAULT, type Limites, superaMaxTareas } from './limites.js';

export { calcularProgreso, type Progreso } from './progreso.js';

export { validarTitulo, validarDescripcion, type ResultadoValidacion } from './validacion.js';
