<?php

namespace App\Http\Requests\Tutor;

use App\Models\LearningSession;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLearningSessionRequest extends FormRequest
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
            'title' => ['required', 'string', 'max:255'],
            'date_string' => ['required', 'string', 'max:255'],
            'date' => ['required', 'date'],
            'status' => ['required', Rule::in(['hadir', 'absen', 'reschedule', 'libur', 'akan-datang'])],
            'description' => ['nullable', 'string'],
            'tools' => ['nullable', 'array'],
            'tools.*' => ['string', 'max:255'],
            'module_ids' => ['nullable', 'array'],
            'module_ids.*' => ['integer', 'exists:modules,id'],
        ];
    }
}
