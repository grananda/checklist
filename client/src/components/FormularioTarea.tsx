/**
 * Modal de alta y edición (HU-02/HU-04). Valida el título con los validadores de
 * `@checklist/shared` para feedback inmediato; el servidor sigue siendo la autoridad.
 */
import { useId, useState, type FormEvent } from 'react';
import { validarTitulo, validarDescripcion, type Tarea } from '@checklist/shared';
import { Modal } from './Modal';

interface Props {
  /** Tarea a editar; si es undefined, es alta. */
  inicial?: Tarea;
  onGuardar: (datos: { titulo: string; descripcion?: string }) => void | Promise<void>;
  onCancelar: () => void;
}

export function FormularioTarea({ inicial, onGuardar, onCancelar }: Props) {
  const esEdicion = inicial !== undefined;
  const [titulo, setTitulo] = useState(inicial?.titulo ?? '');
  const [descripcion, setDescripcion] = useState(inicial?.descripcion ?? '');
  const [error, setError] = useState<string | undefined>();
  const tituloFieldId = useId();
  const descFieldId = useId();
  const errorId = useId();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const vt = validarTitulo(titulo);
    if (!vt.ok) {
      setError(vt.error);
      return;
    }
    const vd = validarDescripcion(descripcion === '' ? undefined : descripcion);
    if (!vd.ok) {
      setError(vd.error);
      return;
    }
    setError(undefined);
    await onGuardar({ titulo, descripcion });
  }

  return (
    <Modal titulo={esEdicion ? 'Editar tarea' : 'Añadir tarea'} onCerrar={onCancelar}>
      <form onSubmit={onSubmit} noValidate>
        <div className="campo">
          <label htmlFor={tituloFieldId} className="campo__label">
            Título
          </label>
          <input
            id={tituloFieldId}
            className="campo__control"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej.: Actualizar changelog"
            aria-invalid={error !== undefined}
            aria-describedby={error ? errorId : undefined}
          />
        </div>
        <div className="campo">
          <label htmlFor={descFieldId} className="campo__label">
            Descripción <span className="campo__opcional">(opcional)</span>
          </label>
          <textarea
            id={descFieldId}
            className="campo__control"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            rows={3}
            placeholder="Detalles o contexto"
          />
        </div>
        {error ? (
          <p id={errorId} role="alert" className="campo__error">
            {error}
          </p>
        ) : null}
        <div className="form-acciones">
          <button type="button" className="btn btn--secundario" onClick={onCancelar}>
            Cancelar
          </button>
          <button type="submit" className="btn btn--primario">
            {esEdicion ? 'Guardar' : 'Añadir'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
