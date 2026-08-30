<?php

namespace Tests\Feature;

use App\Enums\UserRoleType;
use App\Models\Fund;
use App\Models\FundVerification;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

// Master Plan sección 38, grupo "Verification": se puede crear historial;
// no se puede editar/eliminar desde API normal (sección 12, SCHEMA_REVIEW
// hallazgo 5 — append-only real, no solo de palabra).
class FundVerificationTest extends TestCase
{
    use RefreshDatabase;

    private function curador(): User
    {
        $user = User::factory()->create();
        UserRole::create(['user_id' => $user->id, 'role' => 'curador']);

        return $user;
    }

    public function test_verifying_a_fund_creates_a_history_record(): void
    {
        Sanctum::actingAs($this->curador());
        $fund = Fund::factory()->create(['verification_status' => 'pending']);

        $this->postJson("/api/admin/funds/{$fund->id}/verify", [
            'verification_status' => 'verified',
            'verification_notes' => 'Confirmado con la institución.',
        ])->assertOk();

        $this->assertDatabaseCount('fund_verifications', 1);
        $this->assertDatabaseHas('fund_verifications', [
            'fund_id' => $fund->id,
            'status' => 'verified',
        ]);
    }

    public function test_verifying_twice_appends_a_new_record_instead_of_overwriting(): void
    {
        Sanctum::actingAs($this->curador());
        $fund = Fund::factory()->create(['verification_status' => 'pending']);

        $this->postJson("/api/admin/funds/{$fund->id}/verify", ['verification_status' => 'needs_review'])->assertOk();
        $this->postJson("/api/admin/funds/{$fund->id}/verify", ['verification_status' => 'verified'])->assertOk();

        $this->assertDatabaseCount('fund_verifications', 2);
    }

    public function test_no_route_exists_to_update_or_delete_a_verification_record(): void
    {
        Sanctum::actingAs($this->curador());
        $fund = Fund::factory()->create();
        $verification = FundVerification::create([
            'fund_id' => $fund->id,
            'status' => 'verified',
        ]);

        // No hay PUT/PATCH/DELETE para fund_verifications en routes/api.php
        // en absoluto — ni siquiera existe la ruta para intentarlo.
        $this->putJson("/api/admin/fund-verifications/{$verification->id}")->assertNotFound();
        $this->deleteJson("/api/admin/fund-verifications/{$verification->id}")->assertNotFound();
    }

    public function test_policy_denies_update_and_delete_even_for_super_admin(): void
    {
        // Defensa en profundidad: aunque en el futuro alguien exponga una
        // ruta de update/delete por error, la Policy sigue negando —
        // "sin excepción" tal como lo pidió Nahuel, ni siquiera para
        // super_admin en esta fase.
        $superAdmin = User::factory()->create();
        UserRole::create(['user_id' => $superAdmin->id, 'role' => 'super_admin']);

        $verification = FundVerification::create([
            'fund_id' => Fund::factory()->create()->id,
            'status' => 'verified',
        ]);

        $this->assertFalse($superAdmin->can('update', $verification));
        $this->assertFalse($superAdmin->can('delete', $verification));
    }

    public function test_curador_can_create_verification_but_comercial_cannot(): void
    {
        $fund = Fund::factory()->create();

        $comercial = User::factory()->create();
        UserRole::create(['user_id' => $comercial->id, 'role' => 'comercial']);

        Sanctum::actingAs($comercial);
        $this->postJson("/api/admin/funds/{$fund->id}/verify", ['verification_status' => 'verified'])
            ->assertForbidden();

        $this->assertDatabaseCount('fund_verifications', 0);
    }
}
