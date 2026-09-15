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

    /**
     * Semua tutor aktif (dan superadmin) boleh mengakses semua murid.
     *
     * Catatan penting: method ini TIDAK boleh mengubah data apa pun.
     * Sebelumnya ada auto-assign tutor_id yang membuat siapa pun yang
     * pertama kali membuka murid otomatis menjadi tutor pemilik murid
     * tersebut, sehingga tutor lain terkunci (403). Sekarang kepemilikan
     * murid diatur eksplisit oleh superadmin lewat halaman Students,
     * dan proteksi antar-tutor ditangani StudentLock (bukan hak akses).
     */
    public function managesStudent(int|User $student): bool
    {
        if ($this->role === 'superadmin') {
            return true;
        }

        if ($this->role !== 'tutor' || !$this->isActive()) {
            return false;
        }

        $studentId = $student instanceof User ? $student->id : (int) $student;
        $studentUser = $student instanceof User ? $student : User::find($studentId);

        return (bool) $studentUser && $studentUser->role === 'user';
    }
}
