<?php

namespace App\Models;

use App\Enums\LeadStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// Nota deliberada: 'score' y 'status' NO están en $fillable. Fase 1,
// punto 22: "Nunca confiar en valores enviados desde React para permisos
// o scoring definitivo" — el controller los calcula/asigna explícitamente
// en el servidor (LeadScoringService), nunca desde input del usuario.
#[Fillable([
    'name', 'company', 'email', 'phone', 'region', 'commune', 'business_type',
    'fund_id', 'fund_slug', 'fund_status', 'needs', 'budget', 'problem',
    'business_formalized', 'source',
])]
class Lead extends Model
{
    protected $attributes = [
        'status' => 'nuevo',
        'score' => 0,
    ];

    protected function casts(): array
    {
        return [
            'business_formalized' => 'boolean',
            'score' => 'integer',
            'status' => LeadStatus::class,
        ];
    }

    public function fund(): BelongsTo
    {
        return $this->belongsTo(Fund::class);
    }
}
