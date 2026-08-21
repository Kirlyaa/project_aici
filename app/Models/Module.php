<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    protected $fillable = ['name', 'format', 'size'];

    public function learningSessions()
    {
        return $this->belongsToMany(LearningSession::class, 'learning_session_module');
    }
}
