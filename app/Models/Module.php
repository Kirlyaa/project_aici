<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'name',
    'format',
    'size',
    'description',
    'image',
    'tools',
    'module_type',
    'created_by',
])]
class Module extends Model
{
    use SoftDeletes;

    protected function casts(): array
    {
        return [
            'tools' => 'array',
        ];
    }

    public function learningSessions()
    {
        return $this->belongsToMany(LearningSession::class, 'learning_session_module');
    }

    public function gradeEntries()
    {
        return $this->hasMany(GradeEntry::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function isRobot(): bool
    {
        return $this->module_type === 'robot';
    }

    public function isCoding(): bool
    {
        return $this->module_type === 'coding';
    }

    /**
     * Get module type label for display
     */
    public function getTypeLabel(): string
    {
        return match ($this->module_type) {
            'robot' => 'Robot Building',
            'coding' => 'Coding',
            default => 'General',
        };
    }
}
