<?php

namespace App\Policies;

use App\Models\Fund;
use App\Models\User;

// El acceso público a fondos verificados NO pasa por esta Policy — se
// resuelve con Fund::verified() directamente en el controller público
// (Fase 1, sección 11). Esta Policy solo gobierna el panel /admin, donde
// hace falta ver/gestionar TODOS los fondos, incluidos los no verificados.
class FundPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isFundManager();
    }

    public function view(User $user, Fund $fund): bool
    {
        return $user->isFundManager();
    }

    public function create(User $user): bool
    {
        return $user->isFundManager();
    }

    public function update(User $user, Fund $fund): bool
    {
        return $user->isFundManager();
    }

    /** Habilita POST /api/admin/funds/{id}/verify (sección 25). */
    public function verify(User $user, Fund $fund): bool
    {
        return $user->isFundManager();
    }

    public function delete(User $user, Fund $fund): bool
    {
        // Fuera de alcance de esta fase (Fase 1, punto 24: no CRM avanzado).
        return false;
    }
}
