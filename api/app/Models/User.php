<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Enums\UserRoleType;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

#[Fillable(['name', 'email', 'password'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function userRole(): HasOne
    {
        return $this->hasOne(UserRole::class);
    }

    public function verifiedFunds(): HasMany
    {
        return $this->hasMany(Fund::class, 'verified_by');
    }

    public function fundVerifications(): HasMany
    {
        return $this->hasMany(FundVerification::class, 'verified_by');
    }

    public function role(): ?UserRoleType
    {
        return $this->userRole?->role;
    }

    public function hasRole(UserRoleType ...$roles): bool
    {
        $current = $this->role();

        return $current !== null && in_array($current, $roles, strict: true);
    }

    /** Punto 60 / Fase 1 punto 13: gestiona/verifica fondos. */
    public function isFundManager(): bool
    {
        return $this->hasRole(...UserRoleType::fundManagers());
    }

    /** Punto 60 / Fase 1 punto 13: gestiona leads. */
    public function isLeadManager(): bool
    {
        return $this->hasRole(...UserRoleType::leadManagers());
    }
}
