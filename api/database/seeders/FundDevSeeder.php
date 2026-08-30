<?php

namespace Database\Seeders;

use App\Models\Fund;
use Illuminate\Database\Seeder;

// Fase 1, punto 37/26: fondos ficticios claramente marcados como datos de
// desarrollo (prefijo "[DEV]"), nunca como si fueran reales — mismo
// criterio que el frontend usa con "[EJEMPLO]". Nunca correr en
// producción (DatabaseSeeder lo bloquea por entorno).
class FundDevSeeder extends Seeder
{
    public function run(): void
    {
        $funds = [
            [
                'name' => '[DEV] Fondo Digitaliza tu Negocio',
                'slug' => 'dev-fondo-digitaliza-tu-negocio',
                'institution' => 'Institución de desarrollo (dato ficticio)',
                'description' => 'Fondo de desarrollo para probar el explorador. No es un fondo real.',
                'status' => 'abierto',
                'categories' => ['Digitalización', 'Tecnología'],
                'regions' => ['Región Metropolitana'],
                'verification_status' => 'verified',
            ],
            [
                'name' => '[DEV] Fondo Turismo y Territorio',
                'slug' => 'dev-fondo-turismo-y-territorio',
                'institution' => 'Institución de desarrollo (dato ficticio)',
                'description' => 'Fondo de desarrollo orientado a turismo, para probar filtros.',
                'status' => 'abierto',
                'categories' => ['Turismo', 'Sostenibilidad'],
                'regions' => ['La Araucanía', 'Los Lagos'],
                'verification_status' => 'verified',
            ],
            [
                'name' => '[DEV] Fondo Pendiente de Revisión',
                'slug' => 'dev-fondo-pendiente',
                'institution' => 'Institución de desarrollo (dato ficticio)',
                'description' => 'Fondo de desarrollo para probar que lo NO verificado no aparece en público.',
                'status' => 'abierto',
                'categories' => ['Emprendimiento'],
                'regions' => ['Valparaíso'],
                'verification_status' => 'pending',
            ],
        ];

        foreach ($funds as $fund) {
            Fund::updateOrCreate(['slug' => $fund['slug']], $fund);
        }

        $this->command?->warn(
            'FundDevSeeder: fondos [DEV] creados. Son datos ficticios, '.
            'no corresponden a convocatorias reales — nunca correr en producción.'
        );
    }
}
