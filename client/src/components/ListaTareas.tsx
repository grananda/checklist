/** Lista de tareas (HU-01 + HU-07): reordenable por arrastre y teclado, o EstadoVacio. */
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import type { Tarea } from '@checklist/shared';
import { SortableItem } from './SortableItem';
import { EstadoVacio } from './EstadoVacio';

interface Props {
  tareas: Tarea[];
  onToggle: (id: string, hecha: boolean) => void;
  onEditar: (tarea: Tarea) => void;
  onBorrar: (tarea: Tarea) => void;
  onReordenar: (orden: string[]) => void;
}

export function ListaTareas({ tareas, onToggle, onEditar, onBorrar, onReordenar }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  if (tareas.length === 0) {
    return <EstadoVacio />;
  }

  const ids = tareas.map((t) => t.id);

  function moverIndice(index: number, delta: -1 | 1) {
    const destino = index + delta;
    if (destino < 0 || destino >= ids.length) return;
    onReordenar(arrayMove(ids, index, destino));
  }

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const desde = ids.indexOf(String(active.id));
    const hasta = ids.indexOf(String(over.id));
    if (desde === -1 || hasta === -1) return;
    onReordenar(arrayMove(ids, desde, hasta));
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <ul className="lista" aria-label="Tareas del checklist">
          {tareas.map((tarea, i) => (
            <SortableItem
              key={tarea.id}
              tarea={tarea}
              puedeSubir={i > 0}
              puedeBajar={i < tareas.length - 1}
              onToggle={(hecha) => onToggle(tarea.id, hecha)}
              onEditar={() => onEditar(tarea)}
              onBorrar={() => onBorrar(tarea)}
              onMover={(delta) => moverIndice(i, delta)}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
