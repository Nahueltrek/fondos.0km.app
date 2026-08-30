<?php

namespace App\Services;

// Lead scoring — Master Plan sección 25 + Fase 1 punto 17.
// Misma lógica que tenía el frontend (src/lib/scoring.js), ahora
// centralizada acá: el backend es la fuente oficial del score, nunca
// se confía en un valor enviado desde React (Fase 1, punto 22).
class LeadScoringService
{
    // Umbrales de la sección 25 — reutilizados por el dashboard del admin
    // (Admin\DashboardController) para no duplicar los números.
    public const CALIFICADO_THRESHOLD = 25;

    public const PRIORITARIO_THRESHOLD = 40;

    private const KEYWORD_POINTS = [
        'ecommerce' => 10,
        'tienda' => 10,
        'sistema' => 10,
        'automatiza' => 10,
        'whatsapp' => 5,
    ];

    /**
     * @param  array{fund_status?: ?string, budget?: ?string, needs?: ?string, problem?: ?string, business_formalized?: ?bool}  $data
     */
    public function score(array $data): int
    {
        $score = 0;

        $fundStatus = $data['fund_status'] ?? null;
        if ($fundStatus === 'Fondo adjudicado') {
            $score += 20;
        } elseif ($fundStatus === 'Postulación') {
            $score += 15;
        }

        if (! empty($data['budget'])) {
            $score += 10;
        }

        $needs = $data['needs'] ?? '';
        $problem = $data['problem'] ?? '';
        $text = mb_strtolower($needs.' '.$problem);

        foreach (self::KEYWORD_POINTS as $keyword => $points) {
            if (str_contains($text, $keyword)) {
                $score += $points;
            }
        }

        // Fase 1, punto 15: solo suma si el usuario lo declaró
        // explícitamente como true. null o false no suman nada.
        if (($data['business_formalized'] ?? null) === true) {
            $score += 15;
        }

        if (mb_strlen(trim($needs)) > 20 && mb_strlen(trim($problem)) > 20) {
            $score += 5;
        }

        return $score;
    }

    /** Master Plan sección 25. */
    public function label(int $score): string
    {
        return match (true) {
            $score >= self::PRIORITARIO_THRESHOLD => 'Prioritario',
            $score >= self::CALIFICADO_THRESHOLD => 'Calificado',
            $score >= 10 => 'Potencial',
            default => 'Frío',
        };
    }
}
