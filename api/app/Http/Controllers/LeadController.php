<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreLeadRequest;
use App\Models\Fund;
use App\Models\Lead;
use App\Services\LeadScoringService;

// Flujo (Fase 1, punto 18): React -> POST /api/leads|diagnostics ->
// validación -> scoring -> MySQL -> respuesta de confirmación.
class LeadController extends Controller
{
    public function __construct(private readonly LeadScoringService $scoring) {}

    /** POST /api/leads — captura genérica (ej: checklist). */
    public function store(StoreLeadRequest $request)
    {
        return $this->createLead($request, null);
    }

    /** POST /api/diagnostics — resultado del flujo de /diagnostico. */
    public function storeDiagnostic(StoreLeadRequest $request)
    {
        return $this->createLead($request, 'diagnostic');
    }

    private function createLead(StoreLeadRequest $request, ?string $defaultSource)
    {
        $data = $request->validated();

        // Si vino un fund_slug, intentamos resolver el fund_id real
        // contra un fondo público (verificado). Si no existe o no está
        // verificado, seguimos igual: fund_slug queda como referencia
        // liviana, no bloqueamos la captura del lead por esto.
        if (! empty($data['fund_slug'])) {
            $fund = Fund::verified()->where('slug', $data['fund_slug'])->first();
            $data['fund_id'] = $fund?->id;
        }

        $data['source'] = $data['source'] ?? $defaultSource;

        $score = $this->scoring->score($data);

        $lead = Lead::create($data);
        $lead->score = $score;
        $lead->save();

        return response()->json([
            'message' => 'Hemos recibido tu información. Revisaremos tu proyecto y te contactaremos para ayudarte a identificar el mejor camino.',
            'lead' => ['id' => $lead->id],
        ], 201);
    }
}
