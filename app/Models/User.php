<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password', 'role', 'status', 'tutor_id', 'school_id', 'classroom_id', 'avatar', 'class'])]
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

    public function tutoredSessions()
    {
        return $this->hasMany(LearningSession::class, 'tutor_id');
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

    public function classroom()
    {
        return $this->belongsTo(Classroom::class, 'classroom_id');
    }

    public function managedClassrooms()
    {
        return $this->hasMany(Classroom::class, 'tutor_id');
    }

    public function notifications()
    {
        return $this->hasMany(\App\Models\Notification::class);
    }

    public function unreadNotifications()
    {
        return $this->notifications()->where('is_read', false)->orderByDesc('created_at');
    }

    /**
     * Scope query untuk murid yang diajar oleh tutor tertentu:
     * 1. Murid dengan tutor_id langsung sama dengan tutor, ATAU
     * 2. Murid yang berada di kelas binaan tutor (classrooms.tutor_id = tutor), ATAU
     * 3. Murid yang memiliki sesi belajar dengan tutor (learning_sessions.tutor_id = tutor).
     * Jika user adalah superadmin, semua murid disertakan.
     */
    public function scopeTaughtBy($query, User|int $tutor)
    {
        $tutorId = $tutor instanceof User ? $tutor->id : $tutor;
        $tutorRole = $tutor instanceof User ? $tutor->role : User::where('id', $tutorId)->value('role');

        if ($tutorRole === 'superadmin') {
            return $query;
        }

        return $query->where(function ($q) use ($tutorId) {
            $q->where('users.tutor_id', $tutorId)
                ->orWhereHas('classroom', fn($c) => $c->where('tutor_id', $tutorId))
                ->orWhereHas('learningSessions', fn($ls) => $ls->where('tutor_id', $tutorId));
        });
    }

    /**
     * Cek otorisasi pengelolaan murid:
     * - Superadmin mengelola semua murid.
     * - Tutor aktif dapat mengelola murid di platform AICI (kolaboratif & tutor pengganti),
     *   eksklusivitas saat pengeditan dijaga oleh StudentLock.
     */
    public function managesStudent(int|User $student): bool
    {
        if ($this->role === 'superadmin') {
            return true;
        }

        if ($this->role !== 'tutor' || !$this->isActive()) {
            return false;
        }

        $studentUser = $student instanceof User ? $student : User::find($student);

        if (!$studentUser || $studentUser->role !== 'user') {
            return false;
        }

        return true;
    }
}
