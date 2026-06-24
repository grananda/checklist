import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import type { Tarea } from '@checklist/shared';
import { ItemTarea } from '../src/components/ItemTarea';

const tarea: Tarea = {
  id: '1',
  titulo: 'Comprar leche',
  descripcion: 'desnatada',
  hecha: false,
  posicion: 0,
  createdAt: '2026-06-24T00:00:00Z',
  updatedAt: '2026-06-24T00:00:00Z',
};

function renderItem(over: Partial<Tarea> = {}) {
  const onToggle = vi.fn();
  const onEditar = vi.fn();
  const onBorrar = vi.fn();
  const utils = render(
    <ul>
      <ItemTarea
        tarea={{ ...tarea, ...over }}
        onToggle={onToggle}
        onEditar={onEditar}
        onBorrar={onBorrar}
      />
    </ul>,
  );
  return { onToggle, onEditar, onBorrar, ...utils };
}

describe('ItemTarea', () => {
  it('togglea, edita y borra vía callbacks', async () => {
    const user = userEvent.setup();
    const { onToggle, onEditar, onBorrar } = renderItem();
    await user.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalledWith(true);
    await user.click(screen.getByRole('button', { name: /editar/i }));
    expect(onEditar).toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: /borrar/i }));
    expect(onBorrar).toHaveBeenCalled();
  });

  it('refleja el estado hecha sin depender solo del color', () => {
    renderItem({ hecha: true });
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('sin violaciones de accesibilidad', async () => {
    const { container } = renderItem();
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
