<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

// Endpoint público (POST /api/leads y POST /api/diagnostics) — cualquier
// visitante puede enviarlo, por eso authorize() es true.
class StoreLeadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['nullable', 'string', 'max:255'],
            'company' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'required_without:phone', 'email', 'max:255'],
            'phone' => ['nullable', 'required_without:email', 'string', 'max:50'],
            'region' => ['nullable', 'string', 'max:255'],
            'commune' => ['nullable', 'string', 'max:255'],
            'business_type' => ['nullable', 'string', 'max:255'],
            'fund_id' => ['nullable', 'integer', 'exists:funds,id'],
            'fund_slug' => ['nullable', 'string', 'max:255'],
            'fund_status' => ['nullable', 'string', 'max:255'],
            'needs' => ['nullable', 'string', 'max:2000'],
            'budget' => ['nullable', 'string', 'max:255'],
            'problem' => ['nullable', 'string', 'max:2000'],
            // Fase 1, punto 15: nunca se infiere. Si no viene en el
            // request, queda null — nunca se asume false ni true.
            'business_formalized' => ['nullable', 'boolean'],
            // Fase 1, sección 11. Se ajusta junto con el frontend en Fase D.
            'source' => ['nullable', 'string', 'in:home,fund,diagnostic,solution,blog,checklist,organic,direct'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.required_without' => 'Necesitamos al menos un email o un teléfono para contactarte.',
            'phone.required_without' => 'Necesitamos al menos un email o un teléfono para contactarte.',
        ];
    }
}
