<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'user_id',
    'action',
    'model_type',
    'model_id',
    'description',
    'changes',
    'ip_address',
    'user_agent',
])]
class ActivityLog extends Model
{
    protected function casts(): array
    {
        return [
            'changes' => 'array',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Log activity statically
     */
    public static function log(
        string $action,
        string $modelType,
        ?int $modelId = null,
        ?string $description = null,
        ?array $changes = null,
    ): void {
        $user = auth()->user();

        self::create([
            'user_id' => $user?->id,
            'action' => $action,
            'model_type' => $modelType,
            'model_id' => $modelId,
            'description' => $description,
            'changes' => $changes,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    /**
     * Get activity summary for user
     */
    public static function getUserActivity(int $userId, int $limit = 10)
    {
        return self::where('user_id', $userId)
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get()
            ->map(function (self $log) {
                return [
                    'id' => $log->id,
                    'action' => $log->action,
                    'model_type' => $log->model_type,
                    'description' => $log->description,
                    'created_at' => $log->created_at?->diffForHumans(),
                ];
            });
    }

    /**
     * Get model activity history
     */
    public static function getModelHistory(string $modelType, int $modelId)
    {
        return self::where('model_type', $modelType)
            ->where('model_id', $modelId)
            ->with('user')
            ->orderByDesc('created_at')
            ->get()
            ->map(function (self $log) {
                return [
                    'id' => $log->id,
                    'user' => $log->user?->name ?? 'System',
                    'action' => $log->action,
                    'description' => $log->description,
                    'changes' => $log->changes,
                    'created_at' => $log->created_at?->toDateTimeString(),
                ];
            });
    }
}
