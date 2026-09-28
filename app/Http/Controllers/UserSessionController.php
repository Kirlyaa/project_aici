<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\LearningSession;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserSessionController extends Controller
{
    private function formatSession(LearningSession $session): array
    {
        return [
            'id' => $session->id,
            'title' => $session->title,
            'date' => $session->date ? $session->date->toDateString() : $session->date_string,
            'date_string' => $session->date_string,
            'module' => $session->modules->pluck('name')->join(', '),
            'status' => $session->status,
            'description' => $session->description,
            'tools' => $session->tools,
            'modules' => $session->modules,
            'tutor' => $session->tutor ? [
                'id' => $session->tutor->id,
                'name' => $session->tutor->name,
                'email' => $session->tutor->email,
            ] : null,
            'classroom' => $session->classroom ? [
                'id' => $session->classroom->id,
                'name' => $session->classroom->name,
            ] : null,
        ];
    }

    public function beranda()
    {
        $sessions = Auth::user()->learningSessions()
            ->with(['modules', 'tutor:id,name,email', 'classroom:id,name'])
            ->orderBy('date')
            ->get()
            ->map(fn($s) => $this->formatSession($s));

        return Inertia::render('User/Beranda', [
            'sessions' => $sessions
        ]);
    }

    public function jadwal()
    {
        $sessions = Auth::user()->learningSessions()
            ->with(['modules', 'tutor:id,name,email', 'classroom:id,name'])
            ->orderBy('date')
            ->get()
            ->map(fn($s) => $this->formatSession($s));

        return Inertia::render('User/Jadwal', [
            'sessions' => $sessions
        ]);
    }

    public function show($id)
    {
        $session = Auth::user()->learningSessions()
            ->with(['modules', 'tutor:id,name,email', 'classroom:id,name'])
            ->findOrFail($id);

        return Inertia::render('User/SessionDetail', [
            'session' => $this->formatSession($session)
        ]);
    }
}
