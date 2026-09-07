<?php

namespace App\Http\Requests\Tutor;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreStudentCommentRequest extends FormRequest
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
            'student_id' => ['required', 'integer', 'exists:users,id'],
            'semester' => ['required', 'string', 'max:20'],
            'academic_year' => ['nullable', 'integer', 'min:2000', 'max:2100'],
            'tutor_comment' => ['nullable', 'string'],
            'system_comment' => ['nullable', 'string'],
        ];
    }
}
