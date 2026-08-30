<?php

namespace App\Console\Commands;

use App\Models\Fund;
use App\Models\FundVerification;
use App\Models\User;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

// Fase "Carga y curaduría de 15 oportunidades 2026" — ver CURADURIA_FONDOS_2026.md.
// Carga los registros investigados y curados manualmente en
// database/data/curaduria_fondos_2026.json. Es idempotente: correrlo de
// nuevo actualiza (updateOrCreate por slug) en vez de duplicar, así que
// sirve tanto para la carga inicial como para futuras actualizaciones de
// la misma curaduría. Cada carga deja además un registro en
// fund_verifications (historial append-only, igual que el flujo normal
// del panel /admin), para que quede trazado cuándo y con qué estado
// entró cada fondo.
#[Signature('app:import-fondos-2026 {--dry-run : Solo mostrar qué haría, sin escribir en la base}')]
#[Description('Carga los 15 fondos investigados y curados manualmente en database/data/curaduria_fondos_2026.json')]
class ImportFondos2026 extends Command
{
    public function handle(): int
    {
        $path = database_path('data/curaduria_fondos_2026.json');

        if (! File::exists($path)) {
            $this->error("No se encontró {$path}");

            return self::FAILURE;
        }

        $records = json_decode(File::get($path), true, flags: JSON_THROW_ON_ERROR);
        $dryRun = (bool) $this->option('dry-run');

        // Autor del historial: el primer super_admin encontrado, si existe.
        // No es obligatorio (verified_by es nullable) — si no hay ninguno
        // todavía, el registro de verificación queda sin autor asignado.
        $curator = User::whereHas('userRole', fn ($q) => $q->where('role', 'super_admin'))->first();

        $created = 0;
        $updated = 0;

        foreach ($records as $r) {
            $exists = Fund::where('slug', $r['slug'])->exists();

            if ($dryRun) {
                $this->line(($exists ? '[update] ' : '[create] ').$r['slug'].' — '.$r['verification_status']);

                continue;
            }

            $fund = Fund::updateOrCreate(
                ['slug' => $r['slug']],
                [
                    'name' => $r['name'],
                    'institution' => $r['institution'],
                    'description' => $r['description'],
                    'objective' => $r['objective'],
                    'beneficiaries' => $r['beneficiaries'],
                    'regions' => $r['regions'],
                    'communes' => $r['communes'],
                    'amount' => $r['amount'],
                    'cofinancing' => $r['cofinancing'],
                    'application_start' => $r['application_start'],
                    'application_end' => $r['application_end'],
                    'status' => $r['status'],
                    'categories' => $r['categories'],
                    'eligible_expenses' => $r['eligible_expenses'],
                    'official_url' => $r['official_url'],
                    'source_name' => $r['source_name'],
                    'source_url' => $r['source_url'],
                    'source_type' => $r['source_type'],
                    'source_reference' => $r['source_reference'],
                    'verification_status' => $r['verification_status'],
                    'verification_notes' => $r['verification_notes'],
                    'last_verified_at' => $r['verification_status'] === 'verified' ? now() : null,
                    'verified_by' => $r['verification_status'] === 'verified' ? $curator?->id : null,
                ]
            );

            FundVerification::create([
                'fund_id' => $fund->id,
                'verified_by' => $curator?->id,
                'verified_at' => now(),
                'changes' => $r,
                'source' => $r['source_name'],
                'notes' => 'Carga inicial — CURADURIA_FONDOS_2026.md. '.$r['verification_notes'],
                'status' => $r['verification_status'],
            ]);

            $exists ? $updated++ : $created++;
        }

        if ($dryRun) {
            $this->info('Dry run — no se escribió nada.');

            return self::SUCCESS;
        }

        $this->info("Listo: {$created} fondos creados, {$updated} actualizados.");

        return self::SUCCESS;
    }
}
