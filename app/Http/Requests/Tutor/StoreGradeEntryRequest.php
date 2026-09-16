<?php

namespace App\Http\Requests\Tutor;

use App\Models\GradeEntry;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreGradeEntryRequest extends FormRequest
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
            'module_id' => ['nullable', 'integer', 'exists:modules,id'],
            'learning_session_id' => ['nullable', 'integer', 'exists:learning_sessions,id'],
            'meeting_number' => ['required', 'integer', 'min:1', 'max:50'],
            'module_type' => ['required', Rule::in(['robot', 'coding', 'general'])],
            'meeting_date' => ['nullable', 'date'],
            'fokus' => ['required', 'numeric', 'min:0', 'max:' . GradeEntry::MAX_SCORE],
            'robot_building' => ['nullable', 'numeric', 'min:0', 'max:' . GradeEntry::MAX_SCORE],
            'tools_management' => ['required', 'numeric', 'min:0', 'max:' . GradeEntry::MAX_SCORE],
            'interaksi' => ['required', 'numeric', 'min:0', 'max:' . GradeEntry::MAX_SCORE],
            'coding' => ['required', 'numeric', 'min:0', 'max:' . GradeEntry::MAX_SCORE],
            'notes' => ['nullable', 'string'],
        ];
    }
}
