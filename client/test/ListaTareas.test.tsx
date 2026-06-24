import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Tarea } from '@checklist/shared';
import { ListaTareas } from '../src/components/ListaTareas';

function tarea(id: string, titulo: string, posicion: number): Tarea {
  return { id, titulo, hecha: false, posicion, createdAt: 'x', updatedAt: 'x' };
}

const cbs = {
  onToggle: vi.fn(),
  onEditar: vi.fn(),
  onBorrar: vi.fn(),
  onReordenar: vi.fn(),
};

describe('ListaTareas', () => {
  it('muestra estado vacío sin tareas', () => {
    render(<ListaTareas tareas={[]} {...cbs} />);
    expect(screen.getByText(/no hay tareas/i)).toBeInTheDocument();
  });

  it('renderiza las tareas como lista', () => {
    render(<ListaTareas tareas={[tarea('1', 'Tarea 1', 0)]} {...cbs} />);
    expect(screen.getByText('Tarea 1')).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('reordena por teclado (mover abajo) — alternativa accesible', async () => {
    const user = userEvent.setup();
    const onReordenar = vi.fn();
    render(
      <ListaTareas
        tareas={[tarea('a', 'A', 0), tarea('b', 'B', 1)]}
        onToggle={vi.fn()}
        onEditar={vi.fn()}
        onBorrar={vi.fn()}
        onReordenar={onReordenar}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Mover A abajo' }));
    expect(onReordenar).toHaveBeenCalledWith(['b', 'a']);
  });

  it('el primer item no puede subir y el último no puede bajar', () => {
    render(
      <ListaTareas
        tareas={[tarea('a', 'A', 0), tarea('b', 'B', 1)]}
        onToggle={vi.fn()}
        onEditar={vi.fn()}
        onBorrar={vi.fn()}
        onReordenar={vi.fn()}
      />,
    );
    expect(screen.getByRole('button', { name: 'Mover A arriba' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Mover B abajo' })).toBeDisabled();
  });
});
