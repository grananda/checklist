/**
 * Envoltura sortable de una tarea: integra @dnd-kit (arrastre puntero/táctil/teclado)
 * y añade controles explícitos "mover arriba/abajo" como alternativa accesible (NFR-05).
 */
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Tarea } from '@checklist/shared';
import { ItemTarea } from './ItemTarea';
import { IconoArriba, IconoAbajo, IconoArrastre } from './iconos';

interface Props {
  tarea: Tarea;
  puedeSubir: boolean;
  puedeBajar: boolean;
  onToggle: (hecha: boolean) => void;
  onEditar: () => void;
  onBorrar: () => void;
  onMover: (delta: -1 | 1) => void;
}

export function SortableItem({
  tarea,
  puedeSubir,
  puedeBajar,
  onToggle,
  onEditar,
  onBorrar,
  onMover,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tarea.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  const controles = (
    <div className="item__reorden">
      <button
        type="button"
        className="icon-btn"
        aria-label={`Mover ${tarea.titulo} arriba`}
        disabled={!puedeSubir}
        onClick={() => onMover(-1)}
      >
        <IconoArriba />
      </button>
      <button
        type="button"
        className="icon-btn item__drag"
        ref={setActivatorNodeRef}
        aria-label={`Reordenar ${tarea.titulo} (arrastrar)`}
        {...attributes}
        {...listeners}
      >
        <IconoArrastre />
      </button>
      <button
        type="button"
        className="icon-btn"
        aria-label={`Mover ${tarea.titulo} abajo`}
        disabled={!puedeBajar}
        onClick={() => onMover(1)}
      >
        <IconoAbajo />
      </button>
    </div>
  );

  return (
    <ItemTarea
      tarea={tarea}
      onToggle={onToggle}
      onEditar={onEditar}
      onBorrar={onBorrar}
      innerRef={setNodeRef}
      style={style}
      controles={controles}
    />
  );
}
