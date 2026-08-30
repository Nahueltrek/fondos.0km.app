<?php

namespace App\Http\Requests\Admin;

use App\Enums\FundStatus;
use App\Enums\SourceType;
use App\Models\Fund;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFundRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Fund::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'alpha_dash', 'unique:funds,slug'],
            'institution' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'objective' => ['nullable', 'string'],
            'beneficiaries' => ['nullable', 'string'],
            'regions' => ['nullable', 'array'],
            'regions.*' => ['string', 'max:255'],
            'communes' => ['nullable', 'array'],
            'communes.*' => ['string', 'max:255'],
            'amount' => ['nullable', 'string', 'max:255'],
            'cofinancing' => ['nullable', 'string', 'max:255'],
            'application_start' => ['nullable', 'date'],
            'application_end' => ['nullable', 'date', 'after_or_equal:application_start'],
            'status' => ['required', Rule::enum(FundStatus::class)],
            'categories' => ['nullable', 'array'],
            'categories.*' => ['string', 'max:255'],
            'eligible_expenses' => ['nullable', 'string'],
            'official_url' => ['nullable', 'url', 'max:2048'],
            // Gobernanza (sección 57) — quién es la fuente, no todavía si
            // está verificado (eso se hace aparte, con VerifyFundRequest).
            'source_name' => ['nullable', 'string', 'max:255'],
            'source_url' => ['nullable', 'url', 'max:2048'],
            'source_type' => ['nullable', Rule::enum(SourceType::class)],
            'source_reference' => ['nullable', 'string', 'max:255'],
        ];
    }
}
