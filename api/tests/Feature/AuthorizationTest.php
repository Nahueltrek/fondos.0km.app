<?php

namespace Tests\Feature;

use App\Models\Fund;
use App\Models\Lead;
use App\Models\User;
use App\Models\UserRole;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

// Master Plan sección 38, grupo "Authorization": público sin acceso a
// Admin; curador puede gestionar fondos; comercial puede consultar leads
// según permiso; usuario sin rol no puede administrar.
class AuthorizationTest extends TestCase
{
    use RefreshDatabase;

    private function userWithRole(string $role): User
    {
        $user = User::factory()->create();
        UserRole::create(['user_id' => $user->id, 'role' => $role]);

        return $user;
    }

    public function test_guest_cannot_access_admin_dashboard(): void
    {
        $this->getJson('/api/admin/dashboard')->assertUnauthorized();
    }

    public function test_guest_cannot_access_admin_funds(): void
    {
        $this->getJson('/api/admin/funds')->assertUnauthorized();
    }

    public function test_guest_cannot_access_admin_leads(): void
    {
        $this->getJson('/api/admin/leads')->assertUnauthorized();
    }

    public function test_curador_can_list_and_create_funds(): void
    {
        Sanctum::actingAs($this->userWithRole('curador'));

        $this->getJson('/api/admin/funds')->assertOk();

        $this->postJson('/api/admin/funds', [
            'name' => 'Nuevo Fondo',
            'slug' => 'nuevo-fondo',
            'status' => 'abierto',
        ])->assertCreated();
    }

    public function test_curador_can_view_a_single_fund_but_comercial_cannot(): void
    {
        $fund = Fund::factory()->create();

        Sanctum::actingAs($this->userWithRole('curador'));
        $this->getJson("/api/admin/funds/{$fund->id}")->assertOk()->assertJsonFragment(['id' => $fund->id]);

        Sanctum::actingAs($this->userWithRole('comercial'));
        $this->getJson("/api/admin/funds/{$fund->id}")->assertForbidden();
    }

    public function test_curador_can_verify_a_fund(): void
    {
        Sanctum::actingAs($this->userWithRole('curador'));
        $fund = Fund::factory()->create(['verification_status' => 'pending']);

        $this->postJson("/api/admin/funds/{$fund->id}/verify", [
            'verification_status' => 'verified',
        ])->assertOk()->assertJsonFragment(['verification_status' => 'verified']);
    }

    public function test_comercial_cannot_manage_funds(): void
    {
        Sanctum::actingAs($this->userWithRole('comercial'));

        $this->getJson('/api/admin/funds')->assertForbidden();
        $this->postJson('/api/admin/funds', ['name' => 'x', 'slug' => 'x', 'status' => 'abierto'])->assertForbidden();
    }

    public function test_comercial_can_view_and_update_leads(): void
    {
        Sanctum::actingAs($this->userWithRole('comercial'));
        $lead = Lead::factory()->create();

        $this->getJson('/api/admin/leads')->assertOk();
        $this->patchJson("/api/admin/leads/{$lead->id}", ['status' => 'contactar'])
            ->assertOk()
            ->assertJsonFragment(['status' => 'contactar']);
    }

    public function test_curador_cannot_manage_leads(): void
    {
        Sanctum::actingAs($this->userWithRole('curador'));

        $this->getJson('/api/admin/leads')->assertForbidden();
    }

    public function test_user_without_role_cannot_administer_anything(): void
    {
        Sanctum::actingAs(User::factory()->create());

        $this->getJson('/api/admin/dashboard')->assertForbidden();
        $this->getJson('/api/admin/funds')->assertForbidden();
        $this->getJson('/api/admin/leads')->assertForbidden();
    }

    public function test_editor_role_cannot_administer_funds_or_leads(): void
    {
        // Sección 60: 'editor' gestiona blog/contenidos, no fondos ni leads.
        Sanctum::actingAs($this->userWithRole('editor'));

        $this->getJson('/api/admin/funds')->assertForbidden();
        $this->getJson('/api/admin/leads')->assertForbidden();
    }

    public function test_super_admin_can_manage_both_funds_and_leads(): void
    {
        Sanctum::actingAs($this->userWithRole('super_admin'));

        $this->getJson('/api/admin/funds')->assertOk();
        $this->getJson('/api/admin/leads')->assertOk();
        $this->getJson('/api/admin/dashboard')->assertOk();
    }
}
