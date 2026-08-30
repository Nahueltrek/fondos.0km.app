// Espejo de los enums PHP (api/app/Enums/) — solo para labels de UI, la
// validación real siempre vive en el backend.
export const VERIFICATION_LABELS = {
  pending: "Pendiente",
  verified: "Verificado",
  needs_review: "Por revisar",
  expired: "Vencido",
  archived: "Archivado",
};

export const SOURCE_TYPE_LABELS = {
  official_web: "Sitio oficial",
  official_document: "Documento oficial",
  official_api: "API oficial",
  official_platform: "Plataforma oficial",
  other: "Otra",
};

export const LEAD_STATUS_LABELS = {
  nuevo: "Nuevo",
  contactar: "Contactar",
  calificado: "Calificado",
  diagnostico: "Diagnóstico",
  propuesta: "Propuesta",
  negociacion: "Negociación",
  ganado: "Ganado",
  perdido: "Perdido",
  seguimiento: "Seguimiento",
};
