<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserSessionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect('/landing');
});

Route::get('/landing', fn() => Inertia::render('Landing'))->name('landing');
Route::get('/faq', fn() => Inertia::render('FAQ'))->name('faq');

require __DIR__.'/auth.php';

Route::get('/dashboard', function () {
    $user = \Illuminate\Support\Facades\Auth::user();
    return match($user?->role ?? 'user') {
        'tutor' => redirect('/tutor'),
        'superadmin' => redirect('/superadmin'),
        default => redirect('/beranda'),
    };
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {

    // ============ ROUTE UNTUK SEMUA ROLE (User / Tutor / SuperAdmin) ============
    Route::get('/profil', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profil', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profil', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Tutor Sessions - bisa diakses tutor (dan superadmin sebagai bypass)
    Route::middleware('role:tutor,superadmin')->group(function () {
        Route::get('/tutor/sessions', fn() => Inertia::render('Tutor/Sessions/Index'))->name('tutor.sessions.index');
        Route::get('/tutor/sessions/create', fn() => Inertia::render('Tutor/Sessions/Form', ['mode' => 'create']))->name('tutor.sessions.create');
        Route::get('/tutor/sessions/{id}/edit', fn($id) => Inertia::render('Tutor/Sessions/Form', ['mode' => 'edit', 'session' => ['id' => $id]]))->name('tutor.sessions.edit');
    });

    // ============ ROUTE HANYA UNTUK SISWA (role: user) ============
    Route::middleware('role:user')->name('user.')->group(function () {
        Route::get('/beranda', [UserSessionController::class, 'beranda'])->name('beranda');
        Route::get('/tugas', [UserSessionController::class, 'tugas'])->name('tugas');
        Route::get('/tugas/{id}', [UserSessionController::class, 'show'])->name('session.detail');
        Route::get('/profil/pdf', fn() => Inertia::render('User/ProfilPDF'))->name('profil.pdf');
    });

    // ============ ROUTE HANYA UNTUK TUTOR (role: tutor) ============
    Route::middleware('role:tutor')->name('tutor.')->prefix('tutor')->group(function () {
        Route::get('/', fn() => Inertia::render('Tutor/Dashboard'))->name('dashboard');
        Route::get('/modules', fn() => Inertia::render('Tutor/ModuleManagement'))->name('modules');
        Route::get('/calendar/{studentId}', fn($studentId) => Inertia::render('Tutor/CalendarManager', ['studentId' => $studentId]))->name('calendar');
        Route::get('/grades/{studentId}', fn($studentId) => Inertia::render('Tutor/GradesManager', ['studentId' => $studentId]))->name('grades');
        Route::get('/comments/{studentId}', fn($studentId) => Inertia::render('Tutor/CommentsManager', ['studentId' => $studentId]))->name('comments');
    });

    // ============ ROUTE HANYA UNTUK SUPER ADMIN (role: superadmin) ============
    Route::middleware('role:superadmin')->name('superadmin.')->prefix('superadmin')->group(function () {
        Route::get('/', fn() => Inertia::render('SuperAdmin/Dashboard'))->name('dashboard');
        Route::get('/tutors', fn() => Inertia::render('SuperAdmin/TutorManagement'))->name('tutors');
        Route::get('/students', fn() => Inertia::render('SuperAdmin/StudentManagement'))->name('students');
        Route::get('/modules', fn() => Inertia::render('SuperAdmin/ModuleManagement'))->name('modules');
    });
});
