<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'student_id',
    'tutor_id',
    'semester',
    'academic_year',
    'system_comment',
    'tutor_comment',
    'average_grade',
    'module_names',
    'is_system_generated',
])]
class StudentComment extends Model
{
    use SoftDeletes;
    protected function casts(): array
    {
        return [
            'module_names' => 'array',
            'average_grade' => 'decimal:2',
            'is_system_generated' => 'boolean',
        ];
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function tutor()
    {
        return $this->belongsTo(User::class, 'tutor_id');
    }
}
