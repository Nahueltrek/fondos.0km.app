<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

// SCHEMA_REVIEW_FONDOS_0KM.md, hallazgo 6: bootstrap del primer super_admin.
class MakeSuperAdminTest extends TestCase
{
    use RefreshDatabase;

    public function test_creates_new_user_as_super_admin(): void
    {
        $this->artisan('app:make-super-admin')
            ->expectsQuestion('Nombre', 'Nahuel')
            ->expectsQuestion('Email', 'nahuel@0km.app')
            ->expectsQuestion('Contraseña (no se muestra en pantalla)', 'contrasena-segura')
            ->assertSuccessful();

        $user = User::where('email', 'nahuel@0km.app')->first();
        $this->assertNotNull($user);
        $this->assertSame('super_admin', $user->role()->value);
    }

    public function test_promotes_existing_user_when_confirmed(): void
    {
        $existing = User::factory()->create(['email' => 'ya-existe@0km.app']);

        $this->artisan('app:make-super-admin')
            ->expectsQuestion('Nombre', 'Nombre no usado')
            ->expectsQuestion('Email', 'ya-existe@0km.app')
            ->expectsQuestion('Contraseña (no se muestra en pantalla)', 'contrasena-segura')
            ->expectsConfirmation('Ya existe un usuario con ese email ('.$existing->name.'). ¿Promoverlo a super_admin?', 'yes')
            ->assertSuccessful();

        $this->assertSame('super_admin', $existing->fresh()->role()->value);
    }
}
