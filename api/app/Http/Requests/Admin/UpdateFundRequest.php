<?php

namespace App\Http\Requests\Admin;

use App\Enums\FundStatus;
use App\Enums\SourceType;
use App\Models\Fund;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateFundRequest extends FormRequest
{
    public function authorize(): bool
    {
        $fund = $this->route('fund');

        if (! $fund instanceof Fund) {
            return false;
        }

        return $this->user()?->can('update', $fund) ?? false;
    }

    public function rules(): array
    {
        $fund = $this->route('fund');

        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'slug' => [
                'sometimes', 'string', 'max:255', 'alpha_dash',
                Rule::unique('funds', 'slug')->ignore($fund instanceof Fund ? $fund->id : $fund),
            ],
            'institution' => ['sometimes', 'nullable', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'objective' => ['sometimes', 'nullable', 'string'],
            'beneficiaries' => ['sometimes', 'nullable', 'string'],
            'regions' => ['sometimes', 'nullable', 'array'],
            'regions.*' => ['string', 'max:255'],
            'communes' => ['sometimes', 'nullable', 'array'],
            'communes.*' => ['string', 'max:255'],
            'amount' => ['sometimes', 'nullable', 'string', 'max:255'],
            'cofinancing' => ['sometimes', 'nullable', 'string', 'max:255'],
            'application_start' => ['sometimes', 'nullable', 'date'],
            'application_end' => ['sometimes', 'nullable', 'date', 'after_or_equal:application_start'],
            'status' => ['sometimes', Rule::enum(FundStatus::class)],
            'categories' => ['sometimes', 'nullable', 'array'],
            'categories.*' => ['string', 'max:255'],
            'eligible_expenses' => ['sometimes', 'nullable', 'string'],
            'official_url' => ['sometimes', 'nullable', 'url', 'max:2048'],
            'source_name' => ['sometimes', 'nullable', 'string', 'max:255'],
            'source_url' => ['sometimes', 'nullable', 'url', 'max:2048'],
            'source_type' => ['sometimes', 'nullable', Rule::enum(SourceType::class)],
            'source_reference' => ['sometimes', 'nullable', 'string', 'max:255'],
        ];
    }
}
