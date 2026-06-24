import { test, expect } from '@playwright/test';

// Recorrido MVP de extremo a extremo (HU-01..HU-06) contra el server real.
test('recorrido MVP: añadir, marcar, editar y borrar', async ({ page }) => {
  await page.goto('/');

  // HU-01: estado vacío al inicio (BD en memoria por test run).
  await expect(page.getByText(/no hay tareas/i)).toBeVisible();

  // HU-02: añadir una tarea.
  await page.getByRole('button', { name: /añadir tarea/i }).click();
  await page.getByLabel('Título').fill('Preparar release');
  await page.getByRole('button', { name: 'Añadir', exact: true }).click();
  await expect(page.getByText('Preparar release')).toBeVisible();

  // HU-03 + HU-06: marcar y ver progreso al 100%.
  await page.getByRole('checkbox').click();
  await expect(page.getByText('1 de 1 hechas')).toBeVisible();
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  await expect(page.getByRole('checkbox')).toBeChecked();

  // HU-04: editar el título.
  await page.getByRole('button', { name: /editar preparar release/i }).click();
  await page.getByLabel('Título').fill('Release v1');
  await page.getByRole('button', { name: 'Guardar' }).click();
  await expect(page.getByText('Release v1')).toBeVisible();

  // HU-05: borrar con confirmación.
  await page.getByRole('button', { name: /borrar release v1/i }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Borrar' }).click();
  await expect(page.getByText(/no hay tareas/i)).toBeVisible();
});
