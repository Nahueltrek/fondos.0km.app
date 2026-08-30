<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Fase 1, punto 37/26: "No cargar datos de ejemplo en producción."
        // Guardarraíl real, no solo de convención: si alguien corre
        // `php artisan db:seed` en producción por error, esto no hace nada.
        if (! app()->environment(['local', 'testing'])) {
            $this->command?->error(
                'Seeders de desarrollo bloqueados: entorno actual ("'.app()->environment().'") '.
                'no es local/testing. No se creó ningún dato.'
            );

            return;
        }

        $this->call([
            RoleSeeder::class,
            FundDevSeeder::class,
        ]);
    }
}
