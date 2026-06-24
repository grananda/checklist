import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { DialogoConfirmacion } from '../src/components/DialogoConfirmacion';

function renderDialogo() {
  const onConfirmar = vi.fn();
  const onCancelar = vi.fn();
  const utils = render(
    <DialogoConfirmacion
      titulo="Borrar tarea"
      mensaje="¿Seguro?"
      onConfirmar={onConfirmar}
      onCancelar={onCancelar}
    />,
  );
  return { onConfirmar, onCancelar, ...utils };
}

describe('DialogoConfirmacion', () => {
  it('confirma y cancela vía callbacks', async () => {
    const user = userEvent.setup();
    const { onConfirmar } = renderDialogo();
    await user.click(screen.getByRole('button', { name: 'Borrar' }));
    expect(onConfirmar).toHaveBeenCalled();
  });

  it('cancela con Escape', async () => {
    const user = userEvent.setup();
    const { onCancelar } = renderDialogo();
    await user.keyboard('{Escape}');
    expect(onCancelar).toHaveBeenCalled();
  });

  it('es un dialog accesible sin violaciones', async () => {
    const { container } = renderDialogo();
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
