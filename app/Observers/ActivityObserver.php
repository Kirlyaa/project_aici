<?php

namespace App\Observers;

use App\Models\ActivityLog;
use App\Models\GradeEntry;
use App\Models\LearningSession;
use App\Models\Module;
use App\Models\StudentComment;
use App\Models\User;

class ActivityObserver
{
    /**
     * Handle model created event
     */
    public function created($model): void
    {
        ActivityLog::log(
            action: 'created',
            modelType: class_basename($model),
            modelId: $model->id,
            description: $this->getDescription('created', $model),
        );
    }

    /**
     * Handle model updated event
     */
    public function updated($model): void
    {
        // Skip if no actual changes
        if ($model->getChanges() === []) {
            return;
        }

        ActivityLog::log(
            action: 'updated',
            modelType: class_basename($model),
            modelId: $model->id,
            description: $this->getDescription('updated', $model),
            changes: [
                'before' => $model->getOriginal(),
                'after' => $model->getAttributes(),
            ],
        );
    }

    /**
     * Handle model deleted event
     */
    public function deleted($model): void
    {
        ActivityLog::log(
            action: 'deleted',
            modelType: class_basename($model),
            modelId: $model->id,
            description: $this->getDescription('deleted', $model),
        );
    }

    /**
     * Handle model restored event
     */
    public function restored($model): void
    {
        ActivityLog::log(
            action: 'restored',
            modelType: class_basename($model),
            modelId: $model->id,
            description: $this->getDescription('restored', $model),
        );
    }

    /**
     * Handle model force deleted event
     */
    public function forceDeleted($model): void
    {
        ActivityLog::log(
            action: 'force_deleted',
            modelType: class_basename($model),
            modelId: $model->id,
            description: $this->getDescription('force_deleted', $model),
        );
    }

    /**
     * Generate description based on model type and action
     */
    private function getDescription(string $action, $model): string
    {
        $modelClass = class_basename($model);

        return match ($modelClass) {
            'User' => $action === 'created' ? "User '{$model->name}' dibuat"
                : ($action === 'updated' ? "User '{$model->name}' diperbarui"
                    : ($action === 'deleted' ? "User '{$model->name}' dihapus" : "User '{$model->name}' {$action}")),

            'Module' => $action === 'created' ? "Modul '{$model->name}' dibuat"
                : ($action === 'updated' ? "Modul '{$model->name}' diperbarui"
                    : ($action === 'deleted' ? "Modul '{$model->name}' dihapus" : "Modul '{$model->name}' {$action}")),

            'GradeEntry' => $action === 'created' ? "Nilai pertemuan {$model->meeting_number} dibuat"
                : ($action === 'updated' ? "Nilai pertemuan {$model->meeting_number} diperbarui"
                    : ($action === 'deleted' ? "Nilai pertemuan {$model->meeting_number} dihapus" : "Nilai pertemuan {$action}")),

            'LearningSession' => $action === 'created' ? "Sesi '{$model->title}' dibuat"
                : ($action === 'updated' ? "Sesi '{$model->title}' diperbarui"
                    : ($action === 'deleted' ? "Sesi '{$model->title}' dihapus" : "Sesi {$action}")),

            'StudentComment' => $action === 'created' ? "Komentar semester {$model->semester} dibuat"
                : ($action === 'updated' ? "Komentar semester {$model->semester} diperbarui"
                    : ($action === 'deleted' ? "Komentar semester {$model->semester} dihapus" : "Komentar {$action}")),

            default => "$modelClass $action",
        };
    }
}
