import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AppShell } from '../src/components/AppShell';

describe('AppShell', () => {
  it('renderiza el armazón mínimo con la cabecera', () => {
    render(<AppShell />);
    expect(screen.getByRole('heading', { name: 'CheckList' })).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
