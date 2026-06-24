/**
 * Item de tarea (HU-03/04/05). Presentacional: el estado "hecha" se indica con tachado
 * además del color. Acepta un slot opcional de controles de reorden (HU-07) y ref/estilo
 * para integrarse con el sortable de @dnd-kit, sin acoplarse a la librería.
 */
import type { CSSProperties, ReactNode, Ref } from 'react';
import type { Tarea } from '@checklist/shared';
import { IconoEditar, IconoBorrar } from './iconos';

interface Props {
  tarea: Tarea;
  onToggle: (hecha: boolean) => void;
  onEditar: () => void;
  onBorrar: () => void;
  /** Controles de reorden (arrastre + mover arriba/abajo); opcional. */
  controles?: ReactNode;
  innerRef?: Ref<HTMLLIElement>;
  style?: CSSProperties;
}

export function ItemTarea({
  tarea,
  onToggle,
  onEditar,
  onBorrar,
  controles,
  innerRef,
  style,
}: Props) {
  const checkboxId = `tarea-${tarea.id}`;
  return (
    <li ref={innerRef} style={style} className={`item${tarea.hecha ? ' item--hecha' : ''}`}>
      {controles}
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
