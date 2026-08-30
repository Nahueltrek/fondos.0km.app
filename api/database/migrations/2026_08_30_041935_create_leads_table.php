<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('company')->nullable();
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('region')->nullable();
            $table->string('commune')->nullable();
            $table->string('business_type')->nullable();
            $table->foreignId('fund_id')->nullable()->constrained('funds')->nullOnDelete();
            // Referencia liviana al fondo de origen cuando el formulario
            // público solo conoce el slug (no el id numérico interno).
            $table->string('fund_slug')->nullable();
            $table->string('fund_status')->nullable();
            $table->text('needs')->nullable();
            $table->string('budget')->nullable();
            $table->text('problem')->nullable();
            // Fase 1, punto 15: nunca se infiere, solo se declara explícitamente.
            $table->boolean('business_formalized')->nullable();
            $table->unsignedInteger('score')->default(0);
            $table->string('status')->default('nuevo');
            $table->string('source')->nullable();
            $table->timestamps();

            // Índices para el admin (SCHEMA_REVIEW_FONDOS_0KM.md, hallazgo 2).
            $table->index('status');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
