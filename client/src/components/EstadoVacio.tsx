/** Estado vacío: invita a crear la primera tarea (HU-01). */
import { IconoCheck } from './iconos';

export function EstadoVacio() {
  return (
    <div className="vacio">
      <div className="vacio__icono">
        <IconoCheck />
      </div>
      <p className="vacio__titulo">Aún no hay tareas</p>
      <p className="vacio__texto">Empieza tu checklist añadiendo la primera tarea.</p>
    </div>
  );
}
