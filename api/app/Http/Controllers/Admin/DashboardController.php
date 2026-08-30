<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Fund;
use App\Models\Lead;
use App\Services\LeadScoringService;
use Illuminate\Http\Request;

// Sección 23 — dashboard mínimo. No se agregan métricas sin datos reales
// detrás (Fase 1, punto 22 de la instrucción original de dashboard
// comercial: "No implementar métricas que no tengan datos reales").
class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        abort_unless($user->isFundManager() || $user->isLeadManager(), 403);

        return response()->json([
            'funds' => [
                'activos' => Fund::where('status', 'abierto')->count(),
                'pendientes' => Fund::where('verification_status', 'pending')->count(),
                'por_revisar' => Fund::where('verification_status', 'needs_review')->count(),
            ],
            'leads' => [
                'nuevos' => Lead::where('status', 'nuevo')->count(),
                'calificados' => Lead::where('score', '>=', LeadScoringService::CALIFICADO_THRESHOLD)->count(),
                'prioritarios' => Lead::where('score', '>=', LeadScoringService::PRIORITARIO_THRESHOLD)->count(),
            ],
        ]);
    }
}
