// Disclaimer general obligatorio — Master Plan sección 66.
// Texto literal, no parafrasear.
export default function DisclaimerBanner({ compact = false }) {
  return (
    <div
      className={`bg-brand-light border border-brand/20 rounded-lg text-brand-dark ${
        compact ? "p-3 text-xs" : "p-4 text-sm"
      }`}
    >
      <p>
        <strong>Importante:</strong> fondos.0km.app es una plataforma
        informativa y de orientación sobre oportunidades de financiamiento.
        0km no administra, adjudica ni representa a las instituciones
        responsables de los fondos publicados y no garantiza la
        adjudicación de una convocatoria.
      </p>
      {!compact && (
        <p className="mt-2">
          La información presentada tiene carácter referencial y debe ser
          contrastada con las bases, requisitos y condiciones publicados
          por la institución correspondiente. 0km puede ayudarte a
          identificar oportunidades y desarrollar soluciones o proyectos
          digitales relacionados con tus necesidades, pero la decisión de
          postulación, cumplimiento de requisitos y presentación de
          antecedentes corresponde al postulante.
        </p>
      )}
    </div>
  );
}
