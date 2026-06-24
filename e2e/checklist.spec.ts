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

test('reordenar por teclado y reiniciar (HU-07, HU-08)', async ({ page }) => {
  await page.goto('/');

  for (const t of ['Tarea A', 'Tarea B']) {
    await page.getByRole('button', { name: /añadir tarea/i }).click();
    await page.getByLabel('Título').fill(t);
    await page.getByRole('button', { name: 'Añadir', exact: true }).click();
    await expect(page.getByText(t)).toBeVisible();
  }

  // HU-07: mover "Tarea A" abajo → el primer item pasa a ser "Tarea B".
  await page.getByRole('button', { name: 'Mover Tarea A abajo' }).click();
  await expect(page.locator('.item').first()).toContainText('Tarea B');

  // Completar todo → habilita Reiniciar.
  const checks = page.getByRole('checkbox');
  await checks.nth(0).click();
  await checks.nth(1).click();
  await expect(checks.nth(0)).toBeChecked();
  await expect(checks.nth(1)).toBeChecked();

  // HU-08: reiniciar con confirmación → lista vacía.
  await page.getByRole('button', { name: 'Reiniciar' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Borrar' }).click();
  await expect(page.getByText(/no hay tareas/i)).toBeVisible();
});

test('tiempo real entre dos clientes (HU-09)', async ({ browser }) => {
  const ctxA = await browser.newContext();
  const ctxB = await browser.newContext();
  const a = await ctxA.newPage();
  const b = await ctxB.newPage();
  await a.goto('/');
  await b.goto('/');

  // A añade una tarea → B la ve sin recargar.
  await a.getByRole('button', { name: /añadir tarea/i }).click();
  await a.getByLabel('Título').fill('Tarea compartida');
  await a.getByRole('button', { name: 'Añadir', exact: true }).click();
  await expect(b.getByText('Tarea compartida')).toBeVisible();

  // A la borra (con confirmación) → desaparece también en B.
  await a.getByRole('button', { name: /borrar tarea compartida/i }).click();
  await a.getByRole('dialog').getByRole('button', { name: 'Borrar' }).click();
  await expect(b.getByText(/no hay tareas/i)).toBeVisible();

  await ctxA.close();
  await ctxB.close();
});
