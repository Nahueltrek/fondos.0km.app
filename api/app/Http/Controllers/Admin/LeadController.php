<?php

namespace App\Http\Controllers\Admin;

use App\Enums\LeadStatus;
use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class LeadController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Lead::class);

        $query = Lead::query();

        if ($request->filled('status')) {
            $query->where('status', $request->string('status')->toString());
        }

        $sort = $request->string('sort', 'created_at')->toString();
        $direction = $request->string('direction', 'desc')->toString();
        if (in_array($sort, ['score', 'created_at', 'status'], true)) {
            $query->orderBy($sort, $direction === 'asc' ? 'asc' : 'desc');
        }

        return response()->json($query->paginate(20));
    }

    public function show(Lead $lead)
    {
        $this->authorize('view', $lead);

        return response()->json($lead->load('fund'));
    }

    public function update(Request $request, Lead $lead)
    {
        $this->authorize('update', $lead);

        $data = $request->validate([
            'status' => ['required', Rule::enum(LeadStatus::class)],
        ]);

        // Asignación directa, no $lead->update(): 'status' está fuera de
        // $fillable a propósito (no debe poder mass-asignarse desde el
        // endpoint público de creación). Acá sí corresponde, porque ya
        // pasó por la Policy y es un admin autenticado quien lo pide.
        $lead->status = $data['status'];
        $lead->save();

        return response()->json($lead->fresh());
    }
}
