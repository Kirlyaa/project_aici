<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password', 'role', 'status', 'tutor_id', 'school_id', 'avatar'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, SoftDeletes;

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function getAvatarUrlAttribute(): string
    {
        if ($this->avatar) {
            return asset('storage/' . $this->avatar);
        }
        // Fallback to avatar based on initials
        return 'https://ui-avatars.com/api/?name=' . urlencode($this->name) . '&background=14b8a6&color=fff&size=200';
    }

    public function getStatusAttribute($value): string
    {
        return $value ?? 'aktif';
    }

    public function isActive(): bool
    {
        return ($this->status ?? 'aktif') === 'aktif';
    }

    public function isPending(): bool
    {
        return ($this->status ?? 'aktif') === 'pending';
    }

    public function learningSessions()
    {
        return $this->hasMany(LearningSession::class);
    }

    public function tutor()
    {
        return $this->belongsTo(User::class, 'tutor_id');
    }

    public function students()
    {
        return $this->hasMany(User::class, 'tutor_id')->where('role', 'user');
    }

    public function gradeEntries()
    {
        return $this->hasMany(GradeEntry::class, 'student_id');
    }

    public function comments()
    {
        return $this->hasMany(StudentComment::class, 'student_id');
    }

    public function school()
    {
        return $this->belongsTo(\App\Models\School::class);
    }

    public function notifications()
    {
        return $this->hasMany(\App\Models\Notification::class);
    }

    public function unreadNotifications()
    {
        return $this->notifications()->where('is_read', false)->orderByDesc('created_at');
    }

    public function managesStudent(int|User $student): bool
    {
        if ($this->role !== 'tutor' && $this->role !== 'superadmin') {
            return false;
        }

        if ($this->role === 'superadmin') {
            return true;
        }

        $studentId = $student instanceof User ? $student->id : (int) $student;
        $studentUser = $student instanceof User ? $student : User::find($studentId);

        if (!$studentUser) {
            return false;
        }

        // Auto-assign if student has no tutor assigned yet
        if (is_null($studentUser->tutor_id)) {
            $studentUser->update(['tutor_id' => $this->id]);
            return true;
        }

        return (int) $studentUser->tutor_id === (int) $this->id;
    }
}
