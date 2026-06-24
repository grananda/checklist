/** Pantalla única del MVP: progreso + lista + alta/edición y confirmación de borrado. */
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
  | { tipo: 'borrado'; tarea: Tarea };

export function App() {
  const tareas = useTareasStore((s) => s.tareas);
  const error = useTareasStore((s) => s.error);
  const progreso = useTareasStore((s) => s.progreso);
  const cargar = useTareasStore((s) => s.cargar);
  const crear = useTareasStore((s) => s.crear);
  const editar = useTareasStore((s) => s.editar);
  const cambiarEstado = useTareasStore((s) => s.cambiarEstado);
  const borrar = useTareasStore((s) => s.borrar);

  const [modal, setModal] = useState<ModalState>({ tipo: 'cerrado' });

  useEffect(() => {
    void cargar();
  }, [cargar]);

  const p = progreso();
  const abrirAlta = () => setModal({ tipo: 'alta' });

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
        />

        <div className="add-escritorio">
          <button type="button" className="btn btn--primario" onClick={abrirAlta}>
            <IconoMas />
            Añadir tarea
          </button>
        </div>
      </AppShell>

      <div className="add-movil">
        <div className="contenedor">
          <button type="button" className="btn btn--primario btn--bloque" onClick={abrirAlta}>
            <IconoMas />
            Añadir tarea
          </button>
        </div>
      </div>

      {modal.tipo === 'alta' ? (
        <FormularioTarea
          onGuardar={async (datos) => {
            await crear(datos);
            setModal({ tipo: 'cerrado' });
          }}
          onCancelar={() => setModal({ tipo: 'cerrado' })}
        />
      ) : null}

      {modal.tipo === 'edicion' ? (
        <FormularioTarea
          inicial={modal.tarea}
          onGuardar={async (datos) => {
            await editar(modal.tarea.id, datos);
            setModal({ tipo: 'cerrado' });
          }}
          onCancelar={() => setModal({ tipo: 'cerrado' })}
        />
      ) : null}

      {modal.tipo === 'borrado' ? (
        <DialogoConfirmacion
          titulo="Borrar tarea"
          mensaje={`¿Seguro que quieres borrar "${modal.tarea.titulo}"? Esta acción no se puede deshacer.`}
          onConfirmar={async () => {
            await borrar(modal.tarea.id);
            setModal({ tipo: 'cerrado' });
          }}
          onCancelar={() => setModal({ tipo: 'cerrado' })}
        />
      ) : null}
    </>
  );
}
