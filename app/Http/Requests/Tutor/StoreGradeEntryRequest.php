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
        // Nilai diperbolehkan: 0 (anak tidak hadir), 3, 3.5, 4, 4.5, 5
        $allowedGrades = [0, 3, 3.0, 3.5, 4, 4.0, 4.5, 5, 5.0];
        $ruleGrade = ['required', 'numeric', Rule::in($allowedGrades)];
        $ruleRobotGrade = ['nullable', 'numeric', Rule::in($allowedGrades)];

        return [
            'student_id' => ['required', 'integer', 'exists:users,id'],
            'module_id' => ['nullable', 'integer', 'exists:modules,id'],
            'learning_session_id' => ['nullable', 'integer', 'exists:learning_sessions,id'],
            'meeting_number' => ['required', 'integer', 'min:1', 'max:50'],
            'module_type' => ['required', Rule::in(['robot', 'coding', 'general'])],
            'meeting_date' => ['nullable', 'date'],
            'fokus' => $ruleGrade,
            'robot_building' => $ruleRobotGrade,
            'tools_management' => $ruleGrade,
            'interaksi' => $ruleGrade,
            'coding' => $ruleGrade,
            'notes' => ['nullable', 'string'],
        ];
    }
}
