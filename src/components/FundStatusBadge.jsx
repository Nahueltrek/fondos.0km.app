import { ESTADO_LABELS, ESTADO_COLORS } from "../data/categorias";

export default function FundStatusBadge({ status }) {
  const label = ESTADO_LABELS[status] ?? "Por confirmar";
  const color = ESTADO_COLORS[status] ?? ESTADO_COLORS.por_confirmar;
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {label}
    </span>
  );
}
