<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Historial de verificación (sección 58) — de solo inserción a
        // nivel de aplicación (ver FundVerificationPolicy): nadie debe
        // poder editar o borrar un registro pasado, solo agregar uno nuevo.
        Schema::create('fund_verifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fund_id')->constrained('funds')->cascadeOnDelete();
            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('verified_at')->useCurrent();
            $table->json('changes')->nullable();
            $table->string('source')->nullable();
            $table->text('notes')->nullable();
            $table->string('status')->nullable();
            // Sin updated_at: este registro nunca se modifica una vez creado.
            $table->timestamp('created_at')->useCurrent();

            $table->index('fund_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fund_verifications');
    }
};
