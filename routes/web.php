<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect('/landing');
});

Route::get('/landing', fn() => Inertia::render('Landing'))->name('landing');
Route::get('/faq', fn() => Inertia::render('FAQ'))->name('faq');

Route::get('/dashboard', function () {
    $user = \Illuminate\Support\Facades\Auth::user();
    return match($user?->role ?? 'user') {
        'tutor' => redirect('/tutor'),
        'superadmin' => redirect('/superadmin'),
        default => redirect('/beranda'),
    };
})->middleware(['auth', 'verified'])->name('dashboard');

// Auth Routes
Route::get('/login', [\App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'create'])->name('login');
Route::post('/login', [\App\Http\Controllers\Auth\AuthenticatedSessionController::class, 'store']);

Route::get('/register', [\App\Http\Controllers\Auth\RegisteredUserController::class, 'create'])->name('register');
Route::post('/register', [\App\Http\Controllers\Auth\RegisteredUserController::class, 'store']);

// Protected Routes - Require Authentication
Route::middleware('auth')->group(function () {
    // Tutor Sessions
    Route::get('/tutor/sessions', fn() => Inertia::render('Tutor/Sessions/Index'))->name('tutor.sessions.index');
    Route::get('/tutor/sessions/create', fn() => Inertia::render('Tutor/Sessions/Form', ['mode' => 'create']))->name('tutor.sessions.create');
    Route::get('/tutor/sessions/{id}/edit', fn($id) => Inertia::render('Tutor/Sessions/Form', ['mode' => 'edit', 'session' => ['id' => $id]]))->name('tutor.sessions.edit');

    // User Routes
    Route::get('/beranda', fn() => Inertia::render('User/Beranda'))->name('user.beranda');
    Route::get('/tugas', fn() => Inertia::render('User/Tugas'))->name('user.tugas');
    Route::get('/tugas/{id}', fn($id) => Inertia::render('User/SessionDetail', ['id' => $id]))->name('user.session.detail');
    Route::get('/profil', fn() => Inertia::render('User/Profil'))->name('user.profil');
    Route::get('/profil/pdf', fn() => Inertia::render('User/ProfilPDF'))->name('user.profil.pdf');

    // Tutor Routes
    Route::get('/tutor', fn() => Inertia::render('Tutor/Dashboard'))->name('tutor.dashboard');
    Route::get('/tutor/modules', fn() => Inertia::render('Tutor/ModuleManagement'))->name('tutor.modules');
    Route::get('/tutor/calendar/{studentId}', fn($studentId) => Inertia::render('Tutor/CalendarManager', ['studentId' => $studentId]))->name('tutor.calendar');
    Route::get('/tutor/grades/{studentId}', fn($studentId) => Inertia::render('Tutor/GradesManager', ['studentId' => $studentId]))->name('tutor.grades');
    Route::get('/tutor/comments/{studentId}', fn($studentId) => Inertia::render('Tutor/CommentsManager', ['studentId' => $studentId]))->name('tutor.comments');

    // Super Admin Routes
    Route::get('/superadmin', fn() => Inertia::render('SuperAdmin/Dashboard'))->name('superadmin.dashboard');
    Route::get('/superadmin/tutors', fn() => Inertia::render('SuperAdmin/TutorManagement'))->name('superadmin.tutors');
    Route::get('/superadmin/students', fn() => Inertia::render('SuperAdmin/StudentManagement'))->name('superadmin.students');
    Route::get('/superadmin/modules', fn() => Inertia::render('SuperAdmin/ModuleManagement'))->name('superadmin.modules');
});

require __DIR__.'/auth.php';
