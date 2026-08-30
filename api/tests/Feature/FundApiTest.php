<?php

namespace Tests\Feature;

use App\Models\Fund;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

// Master Plan sección 38, grupo "Funds": solo verified público; pending
// y expired no públicos. Fase 1, sección 11/20.
class FundApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_index_only_returns_verified_funds(): void
    {
        Fund::factory()->create(['name' => 'Verificado', 'slug' => 'verificado', 'verification_status' => 'verified']);
        Fund::factory()->create(['name' => 'Pendiente', 'slug' => 'pendiente', 'verification_status' => 'pending']);
        Fund::factory()->create(['name' => 'Vencido', 'slug' => 'vencido', 'verification_status' => 'expired']);
        Fund::factory()->create(['name' => 'Archivado', 'slug' => 'archivado', 'verification_status' => 'archived']);
        Fund::factory()->create(['name' => 'Por revisar', 'slug' => 'por-revisar', 'verification_status' => 'needs_review']);

        $response = $this->getJson('/api/funds');

        $response->assertOk();
        $response->assertJsonCount(1);
        $response->assertJsonFragment(['slug' => 'verificado']);
        $response->assertJsonMissing(['slug' => 'pendiente']);
    }

    public function test_public_show_returns_verified_fund(): void
    {
        Fund::factory()->create(['slug' => 'verificado', 'verification_status' => 'verified']);

        $this->getJson('/api/funds/verificado')->assertOk();
    }

    public function test_public_show_hides_pending_fund_as_404(): void
    {
        Fund::factory()->create(['slug' => 'pendiente', 'verification_status' => 'pending']);

        $this->getJson('/api/funds/pendiente')->assertNotFound();
    }

    public function test_public_show_hides_expired_fund_as_404(): void
    {
        Fund::factory()->create(['slug' => 'vencido', 'verification_status' => 'expired']);

        $this->getJson('/api/funds/vencido')->assertNotFound();
    }

    public function test_public_show_returns_404_for_nonexistent_slug(): void
    {
        $this->getJson('/api/funds/no-existe')->assertNotFound();
    }

    public function test_public_index_filters_by_categoria(): void
    {
        Fund::factory()->create(['slug' => 'turismo-a', 'verification_status' => 'verified', 'categories' => ['Turismo']]);
        Fund::factory()->create(['slug' => 'tecnologia-a', 'verification_status' => 'verified', 'categories' => ['Tecnología']]);

        $response = $this->getJson('/api/funds?categoria=Turismo');

        $response->assertOk();
        $response->assertJsonCount(1);
        $response->assertJsonFragment(['slug' => 'turismo-a']);
    }

    // Fase D: sin config/cors.php publicado, HandleCors no agrega headers
    // y el navegador bloquea el fetch desde fondos.0km.app aunque la API
    // responda 200 — este test existe para que ese regreso se note en CI,
    // no solo en la consola del navegador de un usuario real.
    public function test_public_endpoint_sends_cors_header_for_frontend_origin(): void
    {
        $response = $this->getJson('/api/funds', ['Origin' => 'https://fondos.0km.app']);

        $response->assertOk();
        $response->assertHeader('Access-Control-Allow-Origin', 'https://fondos.0km.app');
    }
}
