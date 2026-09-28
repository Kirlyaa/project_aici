<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[Fillable(['name', 'photo', 'tutor_id', 'description'])]
class Classroom extends Model
{
    use HasFactory, SoftDeletes;

    public function tutor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'tutor_id')->where('role', 'tutor');
    }

    public function students(): HasMany
    {
        return $this->hasMany(User::class, 'classroom_id')->where('role', 'user');
    }

    public function learningSessions(): HasMany
    {
        return $this->hasMany(LearningSession::class, 'classroom_id');
    }

    public function getPhotoUrlAttribute(): string
    {
        if ($this->photo) {
            if (str_starts_with($this->photo, 'http')) {
                return $this->photo;
            }
            return asset('storage/' . $this->photo);
        }

        return 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=60';
    }
}
