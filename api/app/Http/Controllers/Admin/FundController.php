<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreFundRequest;
use App\Http\Requests\Admin\UpdateFundRequest;
use App\Http\Requests\Admin\VerifyFundRequest;
use App\Models\Fund;
use App\Models\FundVerification;
use Illuminate\Http\Request;

// Panel /admin (sección 23). A diferencia del FundController público, acá
// se ven TODOS los fondos, sin importar verification_status.
class FundController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Fund::class);

        $query = Fund::query();

        if ($request->filled('verification_status')) {
            $query->where('verification_status', $request->string('verification_status')->toString());
        }

        return response()->json(
            $query->orderByDesc('created_at')->paginate(20)
        );
    }

    /** Panel /admin: ficha de un fondo puntual, con su historial de verificación. */
    public function show(Fund $fund)
    {
        $this->authorize('view', $fund);

        return response()->json($fund->load('verifications'));
    }

    public function store(StoreFundRequest $request)
    {
        $fund = Fund::create($request->validated());

        return response()->json($fund, 201);
    }

    public function update(UpdateFundRequest $request, Fund $fund)
    {
        $fund->update($request->validated());

        return response()->json($fund->fresh());
    }

    /**
     * Sección 25: el curador revisa/verifica un fondo. Cada llamada
     * INSERTA un nuevo registro en fund_verifications — nunca se edita
     * uno anterior (sección 12, hallazgo 5).
     */
    public function verify(VerifyFundRequest $request, Fund $fund)
    {
        $data = $request->validated();
        $user = $request->user();

        $fund->fill([
            'verification_status' => $data['verification_status'],
            'verification_notes' => $data['verification_notes'] ?? $fund->verification_notes,
            'next_review_at' => $data['next_review_at'] ?? $fund->next_review_at,
            'source_name' => $data['source_name'] ?? $fund->source_name,
            'source_url' => $data['source_url'] ?? $fund->source_url,
            'source_reference' => $data['source_reference'] ?? $fund->source_reference,
            'last_verified_at' => now(),
            'verified_by' => $user->id,
        ])->save();

        FundVerification::create([
            'fund_id' => $fund->id,
            'verified_by' => $user->id,
            'verified_at' => now(),
            'changes' => $data,
            'source' => $data['source_name'] ?? $fund->source_name,
            'notes' => $data['verification_notes'] ?? null,
            'status' => $data['verification_status'],
        ]);

        return response()->json($fund->fresh());
    }
}
