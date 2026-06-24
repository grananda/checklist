/** Pantalla única: progreso + lista (reordenable) + alta/edición, borrado y reinicio. */
import { useEffect, useState } from 'react';
import type { Tarea } from '@checklist/shared';
import { AppShell } from './components/AppShell';
import { IndicadorProgreso } from './components/IndicadorProgreso';
import { ListaTareas } from './components/ListaTareas';
import { FormularioTarea } from './components/FormularioTarea';
import { DialogoConfirmacion } from './components/DialogoConfirmacion';
import { IconoMas } from './components/iconos';
import { useTareasStore } from './store/useTareasStore';

type ModalState =
  | { tipo: 'cerrado' }
  | { tipo: 'alta' }
  | { tipo: 'edicion'; tarea: Tarea }
  | { tipo: 'borrado'; tarea: Tarea }
  | { tipo: 'reiniciar' };

export function App() {
  const tareas = useTareasStore((s) => s.tareas);
  const error = useTareasStore((s) => s.error);
  const progreso = useTareasStore((s) => s.progreso);
  const cargar = useTareasStore((s) => s.cargar);
  const crear = useTareasStore((s) => s.crear);
  const editar = useTareasStore((s) => s.editar);
  const cambiarEstado = useTareasStore((s) => s.cambiarEstado);
  const borrar = useTareasStore((s) => s.borrar);
  const reordenar = useTareasStore((s) => s.reordenar);
  const reiniciar = useTareasStore((s) => s.reiniciar);

  const [modal, setModal] = useState<ModalState>({ tipo: 'cerrado' });

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const p = progreso();
  const puedeReiniciar = p.total >= 1 && p.hechas === p.total;
  const cerrar = () => setModal({ tipo: 'cerrado' });

  return (
    <>
      <AppShell
        derecha={
          <span className="app-contador tnum" aria-hidden="true">
            {p.hechas}/{p.total}
          </span>
        }
        bajoTitulo={<IndicadorProgreso progreso={p} />}
      >
        {error ? (
          <p role="alert" className="error-banner">
            {error}
          </p>
        ) : null}

        <ListaTareas
          tareas={tareas}
          onToggle={(id, hecha) => void cambiarEstado(id, hecha)}
          onEditar={(tarea) => setModal({ tipo: 'edicion', tarea })}
          onBorrar={(tarea) => setModal({ tipo: 'borrado', tarea })}
          onReordenar={(orden) => void reordenar(orden)}
        />

        <div className="acciones-lista">
          <button
            type="button"
            className="btn btn--primario"
            onClick={() => setModal({ tipo: 'alta' })}
          >
            <IconoMas />
            Añadir tarea
          </button>
          <button
            type="button"
            className="btn btn--secundario"
            onClick={() => setModal({ tipo: 'reiniciar' })}
            disabled={!puedeReiniciar}
            aria-disabled={!puedeReiniciar}
          >
            Reiniciar
          </button>
        </div>
      </AppShell>

      {modal.tipo === 'alta' ? (
        <FormularioTarea
          onGuardar={async (datos) => {
            await crear(datos);
            cerrar();
          }}
          onCancelar={cerrar}
        />
      ) : null}

      {modal.tipo === 'edicion' ? (
        <FormularioTarea
          inicial={modal.tarea}
          onGuardar={async (datos) => {
            await editar(modal.tarea.id, datos);
            cerrar();
          }}
          onCancelar={cerrar}
        />
      ) : null}

      {modal.tipo === 'borrado' ? (
        <DialogoConfirmacion
          titulo="Borrar tarea"
          mensaje={`¿Seguro que quieres borrar "${modal.tarea.titulo}"? Esta acción no se puede deshacer.`}
          onConfirmar={async () => {
            await borrar(modal.tarea.id);
            cerrar();
          }}
          onCancelar={cerrar}
        />
      ) : null}

      {modal.tipo === 'reiniciar' ? (
        <DialogoConfirmacion
          titulo="Reiniciar la lista"
          mensaje="Se borrarán todas las tareas para empezar de cero. Esta acción no se puede deshacer."
          onConfirmar={async () => {
            await reiniciar();
            cerrar();
          }}
          onCancelar={cerrar}
        />
      ) : null}
    </>
  );
}
