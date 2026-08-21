<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LearningSession extends Model
{
    protected $fillable = ['user_id', 'title', 'date_string', 'date', 'status', 'description', 'tools'];

    protected $casts = [
        'tools' => 'array',
        'date' => 'date',
    ];

    public function modules()
    {
        return $this->belongsToMany(Module::class, 'learning_session_module');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
