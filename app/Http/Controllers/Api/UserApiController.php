<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserApiController extends Controller
{
    /**
     * Get list of tutors for a tutor user (their students)
     */
    public function getMyStudents(Request $request): JsonResponse
    {
        $user = Auth::user();
        abort_if($user->role !== 'tutor' && $user->role !== 'superadmin', 403);

        $query = $user->role === 'superadmin'
            ? User::where('role', 'user')
            : $user->students();

        $students = $query->when($request->input('search'), function ($q, $search) {
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%");
        })
            ->when($request->input('status'), function ($q, $status) {
                $q->where('status', $status);
            })
            ->with(['school', 'tutor'])
            ->withCount('gradeEntries')
            ->orderBy('name')
            ->get()
            ->map(function (User $s) {
                $avgGrade = $s->gradeEntries()->avg('average') ?? 0;
                return [
                    'id' => $s->id,
                    'name' => $s->name,
                    'email' => $s->email,
                    'school' => $s->school?->name ?? null,
                    'tutor' => $s->tutor?->name ?? null,
                    'status' => $s->status,
                    'avg_grade' => round($avgGrade, 2),
                    'grade_entries_count' => $s->grade_entries_count,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $students,
            'total' => $students->count(),
        ]);
    }

    /**
     * Get list of available tutors (for SuperAdmin)
     */
    public function getTutors(Request $request): JsonResponse
    {
        abort_if(Auth::user()->role !== 'superadmin', 403);

        $tutors = User::where('role', 'tutor')
            ->when($request->input('search'), function ($q, $search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            })
            ->when($request->input('status'), function ($q, $status) {
                $q->where('status', $status);
            })
            ->withCount('students')
            ->orderBy('name')
            ->get()
            ->map(function (User $t) {
                return [
                    'id' => $t->id,
                    'name' => $t->name,
                    'email' => $t->email,
                    'status' => $t->status,
                    'students_count' => $t->students_count,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $tutors,
            'total' => $tutors->count(),
        ]);
    }

    /**
     * Get current authenticated user info
     */
    public function getCurrentUser(): JsonResponse
    {
        $user = Auth::user();

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'status' => $user->status,
                'avatar_url' => $user->avatar_url,
                'school' => $user->school?->name ?? null,
            ],
        ]);
    }
}
