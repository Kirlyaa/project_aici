<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'student_id',
    'tutor_id',
    'module_id',
    'learning_session_id',
    'meeting_number',
    'module_type',
    'meeting_date',
    'fokus',
    'robot_building',
    'tools_management',
    'interaksi',
    'coding',
    'average',
    'notes',
])]
class GradeEntry extends Model
{
    /**
     * B10: Skala nilai maksimum (0–5). Satu sumber kebenaran untuk
     * konversi persentase di PHP dan frontend.
     */
    public const MAX_SCORE = 5.0;

    use SoftDeletes;
    protected function casts(): array
    {
        return [
            'fokus' => 'decimal:2',
            'robot_building' => 'decimal:2',
            'tools_management' => 'decimal:2',
            'interaksi' => 'decimal:2',
            'coding' => 'decimal:2',
            'average' => 'decimal:2',
            'meeting_date' => 'date',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (self $entry) {
            $entry->recalculateAverage();
        });
    }

    /**
     * Hitung rata-rata nilai sesi.
     *
     * - Default (coding/general): 4 kategori (fokus, tools, interaksi, coding)
     * - Robot: 5 kategori jika robot_building !== null
     * Skala nilai adalah 0.00 - 5.00
     */
    public function recalculateAverage(): void
    {
        $values = [
            (float) ($this->fokus ?? 0),
            (float) ($this->tools_management ?? 0),
            (float) ($this->interaksi ?? 0),
            (float) ($this->coding ?? 0),
        ];

        if ($this->module_type === 'robot' && $this->robot_building !== null) {
            $values[] = (float) $this->robot_building;
        }

        $count = count($values);
        $this->average = $count > 0 ? round(array_sum($values) / $count, 2) : 0;
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function tutor()
    {
        return $this->belongsTo(User::class, 'tutor_id');
    }

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function learningSession()
    {
        return $this->belongsTo(LearningSession::class);
    }
}
