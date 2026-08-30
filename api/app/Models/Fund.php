<?php

namespace App\Models;

use App\Enums\FundStatus;
use App\Enums\SourceType;
use App\Enums\VerificationStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'name', 'slug', 'institution', 'description', 'objective', 'beneficiaries',
    'regions', 'communes', 'amount', 'cofinancing',
    'application_start', 'application_end', 'status', 'categories',
    'eligible_expenses', 'official_url',
    'source_name', 'source_url', 'source_type', 'source_reference',
    'last_verified_at', 'next_review_at', 'verified_by',
    'verification_status', 'verification_notes',
])]
class Fund extends Model
{
    // Coinciden con los defaults de la migración — Eloquent no refleja el
    // default de la columna en el objeto recién creado en memoria hasta
    // refrescarlo desde la base, así que se declaran también acá.
    protected $attributes = [
        'status' => 'por_confirmar',
        'verification_status' => 'pending',
    ];

    protected function casts(): array
    {
        return [
            'regions' => 'array',
            'communes' => 'array',
            'categories' => 'array',
            'application_start' => 'date',
            'application_end' => 'date',
            'status' => FundStatus::class,
            'source_type' => SourceType::class,
            'last_verified_at' => 'datetime',
            'next_review_at' => 'datetime',
            'verification_status' => VerificationStatus::class,
        ];
    }

    public function verifications(): HasMany
    {
        return $this->hasMany(FundVerification::class);
    }

    public function leads(): HasMany
    {
        return $this->hasMany(Lead::class);
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    /**
     * Fase 1, sección 11: la API pública SOLO debe devolver fondos
     * verificados, aunque su `status` indique que está abierto. Este
     * scope es la aplicación concreta de esa regla — se usa en el
     * controller público, nunca se confía solo en el frontend.
     */
    public function scopeVerified(Builder $query): Builder
    {
        return $query->where('verification_status', VerificationStatus::Verified);
    }
}
