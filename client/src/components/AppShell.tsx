/**
 * AppShell: chrome de la pantalla única. Cabecera sticky (título + slot derecho +
 * slot bajo el título para el progreso) y main centrado (guia-estilos §7).
 */
import type { ReactNode } from 'react';

interface AppShellProps {
  children?: ReactNode;
  /** Contenido a la derecha del título (p. ej. contador X/Y). */
  derecha?: ReactNode;
  /** Contenido bajo el título dentro de la cabecera (p. ej. el progreso). */
  bajoTitulo?: ReactNode;
}

export function AppShell({ children, derecha, bajoTitulo }: AppShellProps) {
  return (
    <>
      <header className="app-header">
        <div className="contenedor">
          <div className="app-header__fila">
            <h1 className="app-title">CheckList</h1>
            {derecha}
          </div>
          {bajoTitulo}
        </div>
      </header>
      <main className="app-main">
        <div className="contenedor">{children}</div>
      </main>
    </>
  );
}
