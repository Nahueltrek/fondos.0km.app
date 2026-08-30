<?php

namespace App\Http\Requests\Admin;

use App\Enums\VerificationStatus;
use App\Models\Fund;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

// Sección 25: lo que puede tocar el curador al revisar un fondo.
class VerifyFundRequest extends FormRequest
{
    public function authorize(): bool
    {
        $fund = $this->route('fund');

        if (! $fund instanceof Fund) {
            return false;
        }

        return $this->user()?->can('verify', $fund) ?? false;
    }

    public function rules(): array
    {
        return [
            'verification_status' => ['required', Rule::enum(VerificationStatus::class)],
            'verification_notes' => ['nullable', 'string'],
            'next_review_at' => ['nullable', 'date'],
            'source_name' => ['nullable', 'string', 'max:255'],
            'source_url' => ['nullable', 'url', 'max:2048'],
            'source_reference' => ['nullable', 'string', 'max:255'],
        ];
    }
}
