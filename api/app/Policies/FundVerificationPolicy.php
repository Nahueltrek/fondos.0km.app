<?php

namespace App\Policies;

use App\Models\FundVerification;
use App\Models\User;

// Historial APPEND-ONLY (sección 58, SCHEMA_REVIEW hallazgo 5): viewAny/
// view/create están permitidos para quien gestiona fondos; update/delete
// quedan negados para TODOS los roles, sin excepción, en esta fase. Si
// algún día hace falta corregir un registro histórico, se resuelve con
// una nueva verificación, no editando la anterior.
class FundVerificationPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isFundManager();
    }

    public function view(User $user, FundVerification $fundVerification): bool
    {
        return $user->isFundManager();
    }

    public function create(User $user): bool
    {
        return $user->isFundManager();
    }

    public function update(User $user, FundVerification $fundVerification): bool
    {
        return false;
    }

    public function delete(User $user, FundVerification $fundVerification): bool
    {
        return false;
    }
}
