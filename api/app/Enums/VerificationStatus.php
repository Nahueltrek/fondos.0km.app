<?php

namespace App\Enums;

// Estado de curación/gobernanza del dato (Master Plan sección 57).
// Regla crítica: la API pública solo devuelve fondos Verified.
enum VerificationStatus: string
{
    case Pending = 'pending';
    case Verified = 'verified';
    case NeedsReview = 'needs_review';
    case Expired = 'expired';
    case Archived = 'archived';
}
