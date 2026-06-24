/**
 * Item de tarea (HU-03/04/05): checkbox de estado, título, descripción y acciones
 * editar/borrar. Estado "hecha" con tachado además del color (no solo color).
 */
import type { Tarea } from '@checklist/shared';
import { IconoEditar, IconoBorrar } from './iconos';

interface Props {
  tarea: Tarea;
  onToggle: (hecha: boolean) => void;
  onEditar: () => void;
  onBorrar: () => void;
}

export function ItemTarea({ tarea, onToggle, onEditar, onBorrar }: Props) {
  const checkboxId = `tarea-${tarea.id}`;
  return (
    <li className={`item${tarea.hecha ? ' item--hecha' : ''}`}>
      <input
        id={checkboxId}
        className="item__check"
        type="checkbox"
        checked={tarea.hecha}
        onChange={(e) => onToggle(e.target.checked)}
      />
      <div className="item__cuerpo">
        <label htmlFor={checkboxId} className="item__titulo">
          {tarea.titulo}
        </label>
        {tarea.descripcion ? <p className="item__desc">{tarea.descripcion}</p> : null}
      </div>
      <div className="item__acciones">
        <button
          type="button"
          className="icon-btn"
          onClick={onEditar}
          aria-label={`Editar ${tarea.titulo}`}
        >
          <IconoEditar />
        </button>
        <button
          type="button"
          className="icon-btn icon-btn--peligro"
          onClick={onBorrar}
          aria-label={`Borrar ${tarea.titulo}`}
        >
          <IconoBorrar />
        </button>
      </div>
    </li>
  );
}
