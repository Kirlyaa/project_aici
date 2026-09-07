<?php

namespace App\Http\Requests\SuperAdmin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreModuleRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        return $user && in_array($user->role, ['tutor', 'superadmin'], true);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'image' => ['nullable', 'string', 'max:255'],
            'tools' => ['nullable', 'array'],
            'tools.*' => ['string', 'max:255'],
            'module_type' => ['required', Rule::in([4, 5])],
            'format' => ['nullable', 'string', 'max:50'],
            'size' => ['nullable', 'string', 'max:50'],
        ];
    }
}
