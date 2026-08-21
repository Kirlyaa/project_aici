<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\LearningSession;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserSessionController extends Controller
{
    public function beranda()
    {
        $sessions = Auth::user()->learningSessions()->with('modules')->get();
        return Inertia::render('User/Beranda', [
            'sessions' => $sessions
        ]);
    }

    public function tugas()
    {
        $sessions = Auth::user()->learningSessions()->with('modules')->get();
        return Inertia::render('User/Tugas', [
            'sessions' => $sessions
        ]);
    }

    public function show($id)
    {
        $session = Auth::user()->learningSessions()->with('modules')->findOrFail($id);
        return Inertia::render('User/SessionDetail', [
            'session' => $session
        ]);
    }
}
