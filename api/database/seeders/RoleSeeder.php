<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserRole;
use Illuminate\Database\Seeder;

// Fase 1, punto 37: seeders separados para roles y datos de desarrollo.
// SOLO crea un usuario de prueba por rol — nunca correr en producción
// (DatabaseSeeder ya bloquea esto por entorno, ver ese archivo).
class RoleSeeder extends Seeder
{
    private const ROLES = ['super_admin', 'administrador', 'curador', 'comercial', 'editor'];

    public function run(): void
    {
        $password = env('DEV_ADMIN_PASSWORD', 'password');

        foreach (self::ROLES as $role) {
            $user = User::firstOrCreate(
                ['email' => "dev-{$role}@fondos.0km.app"],
                ['name' => "Dev {$role}", 'password' => $password]
            );

            UserRole::updateOrCreate(['user_id' => $user->id], ['role' => $role]);
        }

        $this->command?->warn(
            'RoleSeeder: usuarios de DESARROLLO creados (dev-<rol>@fondos.0km.app). '.
            'Nunca correr este seeder en producción.'
        );
    }
}
