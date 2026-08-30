<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('funds', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('institution')->nullable();
            $table->text('description')->nullable();
            $table->text('objective')->nullable();
            $table->text('beneficiaries')->nullable();
            // text[] de Postgres -> json en MySQL (Master Plan / Fase 1, punto 9).
            $table->json('regions')->nullable();
            $table->json('communes')->nullable();
            $table->string('amount')->nullable();
            $table->string('cofinancing')->nullable();
            $table->date('application_start')->nullable();
            $table->date('application_end')->nullable();
            $table->string('status')->default('por_confirmar');
            $table->json('categories')->nullable();
            $table->text('eligible_expenses')->nullable();
            $table->string('official_url')->nullable();

            // Gobernanza (sección 57).
            $table->string('source_name')->nullable();
            $table->string('source_url')->nullable();
            $table->string('source_type')->nullable();
            $table->string('source_reference')->nullable();
            $table->timestamp('last_verified_at')->nullable();
            $table->timestamp('next_review_at')->nullable();
            $table->foreignId('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('verification_status')->default('pending');
            $table->text('verification_notes')->nullable();

            $table->timestamps();

            // Índices para las consultas del admin y del explorador público
            // (SCHEMA_REVIEW_FONDOS_0KM.md, hallazgo 2).
            $table->index('status');
            $table->index('verification_status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('funds');
    }
};
