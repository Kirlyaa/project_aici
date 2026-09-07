<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable([
    'name',
    'email',
    'phone',
    'address',
    'city',
    'province',
    'postal_code',
    'contact_person',
    'contact_phone',
    'status',
    'total_students',
    'total_tutors',
    'notes',
])]
class School extends Model
{
    use SoftDeletes;

    public function students()
    {
        return $this->hasMany(User::class)->where('role', 'user');
    }

    public function tutors()
    {
        return $this->hasMany(User::class)->where('role', 'tutor');
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function getStudentCountAttribute()
    {
        return $this->students()->count();
    }

    public function getTutorCountAttribute()
    {
        return $this->tutors()->count();
    }

    public function isActive(): bool
    {
        return $this->status === 'aktif';
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }
}
