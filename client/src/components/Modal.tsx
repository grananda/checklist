/**
 * Modal accesible reutilizable (base de FormularioTarea y DialogoConfirmacion).
 * role="dialog" + aria-modal, focus-trap, cierre con Escape y restauración de foco
 * al elemento previo (WCAG 2.1 AA, NFR-05).
 */
import { useEffect, useId, useRef, type ReactNode } from 'react';

interface Props {
  titulo: string;
  onCerrar: () => void;
  children: ReactNode;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({ titulo, onCerrar, children }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);
  const tituloId = useId();

  useEffect(() => {
    const previo = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    // Foco inicial: primer elemento enfocable del panel.
    const focusables = panel?.querySelectorAll<HTMLElement>(FOCUSABLE);
    focusables?.[0]?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCerrar();
        return;
      }
      if (e.key !== 'Tab' || !panel) return;
      const items = panel.querySelectorAll<HTMLElement>(FOCUSABLE);
      const primero = items[0];
      const ultimo = items[items.length - 1];
      if (!primero || !ultimo) return;
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      previo?.focus();
    };
  }, [onCerrar]);

  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCerrar();
      }}
    >
      <div
        ref={panelRef}
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
      >
        <h2 id={tituloId} className="modal-titulo">
          {titulo}
        </h2>
        {children}
      </div>
    </div>
  );
}
