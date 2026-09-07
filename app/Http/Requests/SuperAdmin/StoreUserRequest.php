<?php

namespace App\Http\Requests\SuperAdmin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        $user = $this->user();
        return $user && $user->role === 'superadmin';
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $userId = $this->route('student') ?? $this->route('tutor') ?? $this->route('user');
        $isUpdate = ! empty($userId);

        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($userId)],
            'password' => [$isUpdate ? 'nullable' : 'required', 'confirmed', Password::defaults()],
            'status' => ['nullable', Rule::in(['aktif', 'nonaktif', 'pending'])],
            'tutor_id' => ['nullable', 'integer', Rule::exists('users', 'id')->where('role', 'tutor')],
        ];
    }
}
