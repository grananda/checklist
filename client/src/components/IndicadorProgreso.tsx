/** Indicador de progreso accesible (HU-06): "X de Y hechas" + % + barra. */
import type { Progreso } from '@checklist/shared';

interface Props {
  progreso: Progreso;
}

export function IndicadorProgreso({ progreso }: Props) {
  const { hechas, total, porcentaje } = progreso;
  const texto = `${hechas} de ${total} hechas`;

  return (
    <div className="progreso">
      <div className="progreso__cab">
        <p className="progreso__texto tnum">{texto}</p>
        <p className="progreso__pct tnum">{porcentaje}%</p>
      </div>
      <div
        className="progreso__barra"
        role="progressbar"
        aria-label="Progreso de la lista"
        aria-valuenow={porcentaje}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={`${texto} (${porcentaje}%)`}
      >
        <div className="progreso__relleno" style={{ width: `${porcentaje}%` }} />
      </div>
    </div>
  );
}
