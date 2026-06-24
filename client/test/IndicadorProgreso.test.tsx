import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { IndicadorProgreso } from '../src/components/IndicadorProgreso';

describe('IndicadorProgreso', () => {
  it('muestra X de Y hechas y el progressbar con valores ARIA', () => {
    render(<IndicadorProgreso progreso={{ hechas: 3, total: 6, porcentaje: 50 }} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '50');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(screen.getAllByText(/3 de 6 hechas/).length).toBeGreaterThan(0);
  });

  it('sin violaciones de accesibilidad', async () => {
    const { container } = render(
      <IndicadorProgreso progreso={{ hechas: 0, total: 0, porcentaje: 0 }} />,
    );
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
