<?php

namespace App\Policies;

use App\Models\Lead;
use App\Models\User;

// La creación pública de leads (POST /api/leads, POST /api/diagnostics)
// es una ruta sin autenticación — no pasa por esta Policy, cualquier
// visitante puede crear un lead. Esta Policy gobierna únicamente el
// panel /admin: leer y gestionar leads ya existentes.
class LeadPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->isLeadManager();
    }

    public function view(User $user, Lead $lead): bool
    {
        return $user->isLeadManager();
    }

    public function update(User $user, Lead $lead): bool
    {
        return $user->isLeadManager();
    }

    public function delete(User $user, Lead $lead): bool
    {
        // Fuera de alcance de esta fase.
        return false;
    }
}
