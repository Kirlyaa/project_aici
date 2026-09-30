<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReportPeriod extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'start_meeting',
        'end_meeting',
        'order_index',
        'is_active',
    ];

    protected $casts = [
        'start_meeting' => 'integer',
        'end_meeting' => 'integer',
        'order_index' => 'integer',
        'is_active' => 'boolean',
    ];

    public function getKeyRangeAttribute(): string
    {
        return "{$this->start_meeting}-{$this->end_meeting}";
    }

    public function getDisplayNameAttribute(): string
    {
        if ($this->name) {
            return "{$this->name} (Pertemuan {$this->start_meeting} - {$this->end_meeting})";
        }
        return "Pertemuan {$this->start_meeting} - {$this->end_meeting}";
    }
}
