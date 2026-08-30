<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\UserRole;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

// SCHEMA_REVIEW_FONDOS_0KM.md, hallazgo 6: la app nunca puede crearse su
// propio primer super_admin sola (toda escritura en user_roles ya
// requiere ser super_admin — es el comportamiento correcto). Este comando
// es el reemplazo seguro de "pegar un INSERT a mano en el SQL Editor":
// se corre una sola vez, en el servidor, después de migrar.
//
//   php artisan app:make-super-admin
//
#[Signature('app:make-super-admin')]
#[Description('Crea (o promueve) al primer super_admin. Pensado para correrse una sola vez tras el deploy inicial.')]
class MakeSuperAdmin extends Command
{
    public function handle(): int
    {
        $name = $this->ask('Nombre');
        $email = $this->ask('Email');
        $password = $this->secret('Contraseña (no se muestra en pantalla)');

        $validator = Validator::make(
            compact('name', 'email', 'password'),
            [
                'name' => ['required', 'string', 'max:255'],
                'email' => ['required', 'email', 'max:255'],
                'password' => ['required', 'string', 'min:8'],
            ]
        );

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }

            return self::FAILURE;
        }

        $user = User::where('email', $email)->first();

        if ($user) {
            if (! $this->confirm("Ya existe un usuario con ese email ({$user->name}). ¿Promoverlo a super_admin?")) {
                return self::SUCCESS;
            }
        } else {
            $user = User::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make($password),
            ]);
        }

        UserRole::updateOrCreate(['user_id' => $user->id], ['role' => 'super_admin']);

        $this->info("Listo: {$user->email} es super_admin.");

        return self::SUCCESS;
    }
}
