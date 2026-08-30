<?php

namespace App\Http\Controllers;

use App\Models\Fund;
use Illuminate\Http\Request;

// Endpoints públicos. Regla crítica (Fase 1, sección 11 / 20): SOLO
// fondos verification_status=verified, aplicado acá en el servidor vía
// Fund::verified() — nunca se confía en que el frontend filtre.
class FundController extends Controller
{
    public function index(Request $request)
    {
        $query = Fund::verified();

        if ($request->filled('categoria')) {
            $query->whereJsonContains('categories', $request->string('categoria')->toString());
        }

        if ($request->filled('region')) {
            $query->whereJsonContains('regions', $request->string('region')->toString());
        }

        if ($request->filled('estado')) {
            $query->where('status', $request->string('estado')->toString());
        }

        if ($request->filled('q')) {
            $term = '%'.$request->string('q')->toString().'%';
            $query->where(function ($q) use ($term) {
                $q->where('name', 'like', $term)
                    ->orWhere('description', 'like', $term);
            });
        }

        return response()->json(
            $query->orderBy('name')->get()
        );
    }

    public function show(string $slug)
    {
        $fund = Fund::verified()->where('slug', $slug)->first();

        if (! $fund) {
            // Deliberado: un fondo pending/needs_review/archived responde
            // igual que uno inexistente. No filtramos el motivo.
            return response()->json(['message' => 'Fondo no encontrado.'], 404);
        }

        return response()->json($fund);
    }
}
