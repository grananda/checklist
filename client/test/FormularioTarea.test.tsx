import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { FormularioTarea } from '../src/components/FormularioTarea';

describe('FormularioTarea', () => {
  it('rechaza título vacío y no llama a onGuardar', async () => {
    const user = userEvent.setup();
    const onGuardar = vi.fn();
    render(<FormularioTarea onGuardar={onGuardar} onCancelar={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: 'Añadir' }));
    expect(onGuardar).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent(/obligatorio/i);
  });

  it('con título válido llama a onGuardar', async () => {
    const user = userEvent.setup();
    const onGuardar = vi.fn();
    render(<FormularioTarea onGuardar={onGuardar} onCancelar={vi.fn()} />);
    await user.type(screen.getByLabelText('Título'), 'Nueva tarea');
    await user.click(screen.getByRole('button', { name: 'Añadir' }));
    expect(onGuardar).toHaveBeenCalledWith({ titulo: 'Nueva tarea', descripcion: '' });
  });

  it('en edición precarga los valores', () => {
    render(
      <FormularioTarea
        inicial={{
          id: '1',
          titulo: 'Viejo',
          descripcion: 'algo',
          hecha: false,
          posicion: 0,
          createdAt: 'x',
          updatedAt: 'x',
        }}
        onGuardar={vi.fn()}
        onCancelar={vi.fn()}
      />,
    );
    expect(screen.getByLabelText('Título')).toHaveValue('Viejo');
  });

  it('sin violaciones de accesibilidad', async () => {
    const { container } = render(<FormularioTarea onGuardar={vi.fn()} onCancelar={vi.fn()} />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
