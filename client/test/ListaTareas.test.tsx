import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { Tarea } from '@checklist/shared';
import { ListaTareas } from '../src/components/ListaTareas';

const cbs = { onToggle: vi.fn(), onEditar: vi.fn(), onBorrar: vi.fn() };

const tarea: Tarea = {
  id: '1',
  titulo: 'Tarea 1',
  hecha: false,
  posicion: 0,
  createdAt: 'x',
  updatedAt: 'x',
};

describe('ListaTareas', () => {
  it('muestra estado vacío sin tareas', () => {
    render(<ListaTareas tareas={[]} {...cbs} />);
    expect(screen.getByText(/no hay tareas/i)).toBeInTheDocument();
  });

  it('renderiza las tareas como lista', () => {
    render(<ListaTareas tareas={[tarea]} {...cbs} />);
    expect(screen.getByText('Tarea 1')).toBeInTheDocument();
    expect(screen.getByRole('list')).toBeInTheDocument();
  });
});
