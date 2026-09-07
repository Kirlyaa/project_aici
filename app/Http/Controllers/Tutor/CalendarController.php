<?php

namespace App\Http\Controllers\Tutor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tutor\StoreLearningSessionRequest;
use App\Models\LearningSession;
use App\Models\Module;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CalendarController extends Controller
{
    public function index(int $studentId): Response
    {
        $tutor = Auth::user();
        abort_if(!$tutor->managesStudent($studentId), 403, 'Anda tidak memiliki izin mengakses data murid ini.');

        $student = User::findOrFail($studentId);
        $sessions = LearningSession::where('user_id', $studentId)
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
            'student' => ['id' => $student->id, 'name' => $student->name, 'email' => $student->email],
            'sessions' => $sessions,
            'modules' => $modules,
        ]);
    }

    public function store(StoreLearningSessionRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        abort_if(!$request->user()->managesStudent($validated['student_id']), 403);

        DB::transaction(function () use ($validated, $request) {
            /** @var LearningSession $session */
            $session = LearningSession::create([
                'user_id' => $validated['student_id'],
                'tutor_id' => $request->user()->role === 'tutor' ? $request->user()->id : null,
                'title' => $validated['title'],
                'date_string' => $validated['date_string'],
                'date' => $validated['date'],
                'status' => $validated['status'],
                'description' => $validated['description'] ?? null,
                'tools' => $validated['tools'] ?? null,
            ]);

            if (! empty($validated['module_ids'])) {
                $session->modules()->sync($validated['module_ids']);
            }
        });

        return back()->with('success', 'Sesi pembelajaran berhasil ditambahkan.');
    }

    public function update(StoreLearningSessionRequest $request, LearningSession $session): RedirectResponse
    {
        abort_if(!$request->user()->managesStudent($session->user_id), 403);

        $validated = $request->validated();

        DB::transaction(function () use ($session, $validated) {
            $session->update([
                'user_id' => $validated['student_id'],
                'title' => $validated['title'],
                'date_string' => $validated['date_string'],
                'date' => $validated['date'],
                'status' => $validated['status'],
                'description' => $validated['description'] ?? null,
                'tools' => $validated['tools'] ?? null,
            ]);

            $modules = $validated['module_ids'] ?? [];
            $session->modules()->sync($modules);
        });

        return back()->with('success', 'Sesi pembelajaran berhasil diperbarui.');
    }

    public function destroy(LearningSession $session): RedirectResponse
    {
        abort_if(!request()->user()->managesStudent($session->user_id), 403);
        $session->modules()->detach();
        $session->delete();

        return back()->with('success', 'Sesi pembelajaran berhasil dihapus.');
    }
}
