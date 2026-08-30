<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// Historial de verificación (Master Plan sección 58). APPEND-ONLY: no hay
// método update/destroy expuesto por el controller, y FundVerificationPolicy
// niega explícitamente update/delete para todos los roles (SCHEMA_REVIEW,
// hallazgo 5). Si un dato pasado estuvo mal, se corrige con una nueva
// verificación, nunca editando la anterior.
#[Fillable(['fund_id', 'verified_by', 'verified_at', 'changes', 'source', 'notes', 'status'])]
class FundVerification extends Model
{
    const UPDATED_AT = null;

    protected function casts(): array
    {
        return [
            'verified_at' => 'datetime',
            'changes' => 'array',
        ];
    }

    public function fund(): BelongsTo
    {
        return $this->belongsTo(Fund::class);
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }
}
