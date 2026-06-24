/** Lista de tareas (HU-01): renderiza ItemTarea o EstadoVacio si no hay tareas. */
import type { Tarea } from '@checklist/shared';
import { ItemTarea } from './ItemTarea';
import { EstadoVacio } from './EstadoVacio';

interface Props {
  tareas: Tarea[];
  onToggle: (id: string, hecha: boolean) => void;
  onEditar: (tarea: Tarea) => void;
  onBorrar: (tarea: Tarea) => void;
}

export function ListaTareas({ tareas, onToggle, onEditar, onBorrar }: Props) {
  if (tareas.length === 0) {
    return <EstadoVacio />;
  }
  return (
    <ul className="lista" aria-label="Tareas del checklist">
      {tareas.map((tarea) => (
        <ItemTarea
          key={tarea.id}
          tarea={tarea}
          onToggle={(hecha) => onToggle(tarea.id, hecha)}
          onEditar={() => onEditar(tarea)}
          onBorrar={() => onBorrar(tarea)}
        />
      ))}
    </ul>
  );
}
