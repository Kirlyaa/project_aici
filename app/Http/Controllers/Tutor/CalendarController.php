<?php

namespace App\Http\Controllers\Tutor;

use App\Http\Controllers\Controller;
use App\Models\LearningSession;
use App\Models\Module;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

/**
 * R5: Tutor hanya bisa melihat jadwal miliknya sendiri (read-only).
 * CRUD kalender dipindah ke SuperAdmin\CalendarController.
 */
class CalendarController extends Controller
{
    public function index(int $studentId): Response
    {
        $tutor = Auth::user();
        $student = User::findOrFail($studentId);

        // Tutor melihat sesi binaannya (atau sesi tanpa tutor spesifik), SuperAdmin melihat semua sesi murid
        $sessions = LearningSession::where('user_id', $studentId)
            ->when($tutor->role !== 'superadmin', function ($q) use ($tutor) {
                $q->where(function ($sub) use ($tutor) {
                    $sub->where('tutor_id', $tutor->id)
                        ->orWhereNull('tutor_id');
                });
            })
            ->with('modules')
            ->orderBy('date')
            ->get()
            ->map(function (LearningSession $s) {
                return [
                    'id' => $s->id,
                    'title' => $s->title,
                    'date_string' => $s->date_string,
                    'date' => $s->date?->toDateString(),
                    'status' => $s->status,
                    'description' => $s->description,
                    'tools' => $s->tools,
                    'module_ids' => $s->modules->pluck('id'),
                ];
            });

        $modules = Module::orderBy('name')->get(['id', 'name', 'module_type', 'image']);

        return Inertia::render('Tutor/CalendarManager', [
            'studentId' => (int) $studentId,
            'student' => [
                'id' => $student->id,
                'name' => $student->name,
                'email' => $student->email,
                'class' => $student->class ?? 'Tanpa Kelas',
                'tutor' => $student->tutor?->name ?? 'Belum ada tutor',
            ],
            'sessions' => $sessions,
            'modules' => $modules,
            'readOnly' => true,
        ]);
    }
}

