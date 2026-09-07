<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'user_id',
    'tutor_id',
    'title',
    'date_string',
    'date',
    'status',
    'description',
    'tools',
])]
class LearningSession extends Model
{
    use SoftDeletes;
    protected function casts(): array
    {
        return [
            'tools' => 'array',
            'date' => 'date',
        ];
    }

    public function modules()
    {
        return $this->belongsToMany(Module::class, 'learning_session_module');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function tutor()
    {
        return $this->belongsTo(User::class, 'tutor_id');
    }

    public function gradeEntries()
    {
        return $this->hasMany(GradeEntry::class);
    }

    public function isUpcoming(): bool
    {
        return $this->status === 'akan-datang';
    }

    public function isHoliday(): bool
    {
        return $this->status === 'libur';
    }

    public function getStatusColor(): string
    {
        return match ($this->status) {
            'hadir' => 'bg-green-100 text-green-700',
            'absen' => 'bg-red-100 text-red-700',
            'reschedule' => 'bg-yellow-100 text-yellow-700',
            'libur' => 'bg-orange-100 text-orange-700',
            'akan-datang' => 'bg-blue-100 text-blue-700',
            default => 'bg-gray-100 text-gray-700',
        };
    }
}
