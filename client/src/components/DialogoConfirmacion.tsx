/**
 * Diálogo de confirmación de acción destructiva (HU-05). Foco inicial en el botón
 * seguro (Cancelar): es el primer enfocable del panel. Borrado solo al confirmar.
 */
import { Modal } from './Modal';

interface Props {
  titulo: string;
  mensaje: string;
  onConfirmar: () => void | Promise<void>;
  onCancelar: () => void;
}

export function DialogoConfirmacion({ titulo, mensaje, onConfirmar, onCancelar }: Props) {
  return (
    <Modal titulo={titulo} onCerrar={onCancelar}>
      <p className="dialogo__mensaje">{mensaje}</p>
      <div className="form-acciones">
        <button type="button" className="btn btn--secundario" onClick={onCancelar}>
          Cancelar
        </button>
        <button type="button" className="btn btn--peligro" onClick={() => void onConfirmar()}>
          Borrar
        </button>
      </div>
    </Modal>
  );
}
