<?php

namespace App\Http\Controllers\Tutor;

use App\Http\Controllers\Controller;
use App\Services\StudentLock;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StudentLockController extends Controller
{
    /**
     * Cek status lock untuk seorang murid.
     * Dipanggil saat membuka halaman Calendar / Grades / Comments.
     */
    public function status(Request $request, int $studentId): JsonResponse
    {
        $tutor = Auth::user();
        abort_if(!$tutor->managesStudent($studentId), 403);

        $page = (string) $request->query('page', 'view');

        return response()->json([
            'student_id' => $studentId,
            'lock' => StudentLock::toResponse($studentId, $tutor, $page),
        ]);
    }

    /** Perpanjang lock (heartbeat) tiap beberapa detik. */
    public function heartbeat(Request $request, int $studentId): JsonResponse
    {
        $tutor = Auth::user();
        abort_if(!$tutor->managesStudent($studentId), 403);

        $ok = StudentLock::heartbeat($studentId, $tutor);

        return response()->json(['ok' => $ok]);
    }

    /** Lepas lock saat meninggalkan halaman. */
    public function release(Request $request, int $studentId): JsonResponse
    {
        $tutor = Auth::user();
        abort_if(!$tutor->managesStudent($studentId), 403);

        StudentLock::release($studentId, $tutor);

        return response()->json(['ok' => true]);
    }
}
