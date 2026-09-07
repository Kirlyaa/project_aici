<?php

namespace App\Http\Controllers\Tutor;

use App\Http\Controllers\Controller;
use App\Models\GradeEntry;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        /** @var User $tutor */
        $tutor = Auth::user();

        if ($tutor->role === 'superadmin') {
            $students = User::where('role', 'user')
                ->whereIn('status', ['aktif', 'pending'])
                ->withCount(['learningSessions', 'gradeEntries'])
                ->orderBy('name')
                ->paginate(20);
        } else {
            $students = User::where('role', 'user')
                ->where(function ($q) use ($tutor) {
                    $q->where('tutor_id', $tutor->id)->orWhereNull('tutor_id');
                })
                ->whereIn('status', ['aktif', 'pending'])
                ->withCount(['learningSessions', 'gradeEntries'])
                ->orderBy('name')
                ->paginate(20);
        }

        $stats = [
            'total_students' => $students->total(),
            'total_sessions' => GradeEntry::query()
                ->when($tutor->role !== 'superadmin', fn($q) => $q->where('tutor_id', $tutor->id))
                ->count(),
            'average_grade' => round((float) GradeEntry::query()
                ->when($tutor->role !== 'superadmin', fn($q) => $q->where('tutor_id', $tutor->id))
                ->avg('average') ?? 0, 2),
            'pending_count' => $students->where('status', 'pending')->count(),
        ];

        $studentData = $students->through(function (User $s) {
            $avg = round((float) $s->gradeEntries()->avg('average') ?? 0, 1);
            return [
                'id' => $s->id,
                'name' => $s->name,
                'email' => $s->email,
                'level' => $s->tutor?->name ?? 'Belum ada tutor',
                'progress' => $avg,
                'status' => $s->status ?? 'aktif',
            ];
        })->withQueryString();

        return Inertia::render('Tutor/Dashboard', [
            'students' => $studentData,
            'stats' => $stats,
            'isSuperAdmin' => $tutor->role === 'superadmin',
            'currentTutor' => [
                'id' => $tutor->id,
                'name' => $tutor->name,
                'email' => $tutor->email,
            ],
        ]);
    }
}
