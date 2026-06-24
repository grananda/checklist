/**
 * AppShell mínimo: armazón de la única pantalla (cabecera + main + footer).
 * En foundation no renderiza tareas ni acciones; sólo establece la estructura semántica
 * accesible (guia-estilos.md §6-§7) sobre la que la Fase 3 montará la UI del MVP.
 */
import type { ReactNode } from 'react';

interface AppShellProps {
  children?: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div
      style={{
        maxWidth: 'var(--container-max)',
        margin: '0 auto',
        padding: 'var(--space-4)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <header>
        <h1 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'var(--font-weight-medium)' }}>
          CheckList
        </h1>
      </header>

      <main style={{ flex: 1 }}>
        {children ?? (
          <p style={{ color: 'var(--color-text-muted)' }}>
            Base del proyecto lista. La lista de tareas se añadirá en próximas fases.
          </p>
        )}
      </main>

      <footer style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
        CheckList · piloto AIDD
      </footer>
    </div>
  );
}
