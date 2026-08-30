<?php

namespace Tests\Feature;

use App\Models\Fund;
use App\Models\Lead;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

// Master Plan sección 38, grupo "Leads": creación; validación; scoring;
// relación con fondo.
class LeadApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_creates_lead_with_valid_data(): void
    {
        $response = $this->postJson('/api/leads', [
            'name' => 'Ana',
            'email' => 'ana@example.com',
            'source' => 'checklist',
        ]);

        $response->assertCreated();
        $response->assertJsonStructure(['message', 'lead' => ['id']]);
        $this->assertDatabaseHas('leads', ['email' => 'ana@example.com', 'source' => 'checklist']);
    }

    public function test_requires_email_or_phone(): void
    {
        $response = $this->postJson('/api/leads', ['name' => 'Ana']);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['email']);
    }

    public function test_phone_alone_is_enough(): void
    {
        $response = $this->postJson('/api/leads', ['name' => 'Ana', 'phone' => '+56912345678']);

        $response->assertCreated();
    }

    public function test_diagnostic_endpoint_defaults_source_to_diagnostic(): void
    {
        $this->postJson('/api/diagnostics', ['email' => 'a@a.com'])->assertCreated();

        $this->assertDatabaseHas('leads', ['email' => 'a@a.com', 'source' => 'diagnostic']);
    }

    public function test_score_is_computed_server_side_and_client_value_is_ignored(): void
    {
        $response = $this->postJson('/api/diagnostics', [
            'email' => 'ana@example.com',
            'fund_status' => 'Fondo adjudicado',
            'budget' => '5000',
            'needs' => 'necesito un sistema de ecommerce con whatsapp para vender mejor',
            'problem' => 'hoy vendo todo a mano y pierdo pedidos por no responder a tiempo',
            'business_formalized' => true,
            // Estos dos NUNCA deben poder setearse desde el cliente.
            'score' => 999999,
            'status' => 'ganado',
        ]);

        $response->assertCreated();

        $lead = Lead::first();
        // 20 (adjudicado) + 10 (presupuesto) + 10 (ecommerce) + 10 (sistema)
        // + 5 (whatsapp) + 15 (formalizada) + 5 (descripción completa) = 75
        $this->assertSame(75, $lead->score);
        $this->assertSame('nuevo', $lead->status->value);
    }

    public function test_business_formalized_defaults_to_null_never_inferred(): void
    {
        $this->postJson('/api/leads', [
            'email' => 'x@x.com',
            'needs' => 'tengo una empresa formal hace años',
        ])->assertCreated();

        $lead = Lead::first();
        $this->assertNull($lead->business_formalized);
        // Mencionar "empresa formal" en texto libre NO debe sumar el
        // bono de scoring — solo el campo explícito lo hace.
        $this->assertLessThan(15, $lead->score);
    }

    public function test_resolves_fund_id_from_verified_fund_slug(): void
    {
        $fund = Fund::factory()->create(['slug' => 'mi-fondo', 'verification_status' => 'verified']);

        $this->postJson('/api/leads', ['email' => 'a@a.com', 'fund_slug' => 'mi-fondo'])->assertCreated();

        $lead = Lead::first();
        $this->assertSame($fund->id, $lead->fund_id);
    }

    public function test_does_not_resolve_fund_id_for_unverified_fund_slug(): void
    {
        Fund::factory()->create(['slug' => 'no-verificado', 'verification_status' => 'pending']);

        $this->postJson('/api/leads', ['email' => 'a@a.com', 'fund_slug' => 'no-verificado'])->assertCreated();

        $lead = Lead::first();
        $this->assertNull($lead->fund_id);
        $this->assertSame('no-verificado', $lead->fund_slug);
    }

    public function test_rejects_invalid_source(): void
    {
        $response = $this->postJson('/api/leads', ['email' => 'a@a.com', 'source' => 'algo-invalido']);

        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(['source']);
    }
}
