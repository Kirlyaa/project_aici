<?php

use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserSessionController;
use App\Http\Controllers\StudentGradeReportController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\Tutor\DashboardController;
use App\Http\Controllers\Tutor\CalendarController;
use App\Http\Controllers\Tutor\GradeController;
use App\Http\Controllers\Tutor\CommentController;
use App\Http\Controllers\Tutor\StudentLockController;
use App\Http\Controllers\Tutor\SessionController as TutorSessionController;
use App\Http\Controllers\Tutor\ModuleViewController;
use App\Http\Controllers\SuperAdmin\DashboardController as SuperAdminDashboardController;
use App\Http\Controllers\SuperAdmin\TutorController;
use App\Http\Controllers\SuperAdmin\StudentController;
use App\Http\Controllers\SuperAdmin\ClassroomController;
use App\Http\Controllers\SuperAdmin\CalendarController as SuperAdminCalendarController;
use App\Http\Controllers\SuperAdmin\ModuleController as SuperAdminModuleController;

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect('/landing');
});

Route::get('/landing', fn() => Inertia::render('Landing'))->name('landing');
Route::get('/faq', fn() => Inertia::render('FAQ'))->name('faq');

Route::middleware(['auth', 'active', 'throttle:15,1'])->group(function () {
    Route::post('/api/chatbot', [ChatbotController::class, 'chat'])->name('chatbot.chat');
});

require __DIR__.'/auth.php';

// Notification routes
Route::middleware(['auth', 'active'])->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::get('/api/notifications/unread-count', [NotificationController::class, 'getUnreadCount'])->name('notifications.unread-count');
    Route::get('/api/notifications/recent', [NotificationController::class, 'getRecent'])->name('notifications.recent');
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('notifications.mark-read');
    Route::patch('/notifications/mark-all/read', [NotificationController::class, 'markAllAsRead'])->name('notifications.mark-all-read');
    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy'])->name('notifications.destroy');
    Route::delete('/notifications/delete-all/read', [NotificationController::class, 'deleteAllRead'])->name('notifications.delete-all-read');
});

Route::get('/dashboard', function () {
    $user = \Illuminate\Support\Facades\Auth::user();
    return match($user?->role ?? 'user') {
        'tutor' => redirect('/tutor'),
        'superadmin' => redirect('/superadmin'),
        default => redirect('/beranda'),
    };
})->middleware(['auth', 'verified', 'active'])->name('dashboard');

Route::middleware(['auth', 'active'])->group(function () {

    // ============ ROUTE UNTUK SEMUA ROLE (User / Tutor / SuperAdmin) ============
    Route::get('/profil', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profil', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profil', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Tutor Sessions - bisa diakses tutor (dan superadmin sebagai bypass)
    Route::middleware('role:tutor,superadmin')->group(function () {
        Route::get('/tutor/sessions', [TutorSessionController::class, 'index'])->name('tutor.sessions.index');
        Route::post('/tutor/sessions', [TutorSessionController::class, 'store'])->name('tutor.sessions.store');
        Route::put('/tutor/sessions/{session}', [TutorSessionController::class, 'update'])->name('tutor.sessions.update');
        Route::delete('/tutor/sessions/{session}', [TutorSessionController::class, 'destroy'])->name('tutor.sessions.destroy');
    });

    // ============ ROUTE HANYA UNTUK SISWA (role: user) ============
    Route::middleware('role:user')->name('user.')->group(function () {
        Route::get('/beranda', [UserSessionController::class, 'beranda'])->name('beranda');
        Route::get('/jadwal', [UserSessionController::class, 'jadwal'])->name('jadwal');
        Route::get('/jadwal/{id}', [UserSessionController::class, 'show'])->name('session.detail');
        Route::get('/tugas', fn() => redirect()->route('user.jadwal'))->name('tugas');
        Route::get('/tugas/{id}', fn($id) => redirect()->route('user.session.detail', ['id' => $id]))->name('tugas.detail');
        Route::get('/nilai', [StudentGradeReportController::class, 'show'])->name('grades');
        Route::get('/profil/pdf', [ProfileController::class, 'pdf'])->name('profil.pdf');
    });

    // ============ ROUTE UNTUK TUTOR & SUPER ADMIN ============
    Route::middleware('role:tutor,superadmin')->name('tutor.')->prefix('tutor')->group(function () {
        // Dashboard & Main Pages
        Route::get('/', DashboardController::class)->name('dashboard');
        
        // Modules (read-only for tutor)
        Route::get('/modules', [ModuleViewController::class, 'index'])->name('modules');
        
        // R6: Module Management pindah ke superadmin — route tutor dihapus
        
        // R5: Calendar CRUD pindah ke superadmin — tutor hanya view jadwal miliknya sendiri
        Route::get('/calendar/{studentId}', [CalendarController::class, 'index'])->name('calendar');
        
        // Grades (Nilai)
        Route::get('/grades/{studentId}', [GradeController::class, 'index'])->name('grades');
        Route::post('/grades', [GradeController::class, 'store'])->name('grades.store');
        Route::put('/grades/{gradeEntry}', [GradeController::class, 'update'])->name('grades.update');
        Route::delete('/grades/{gradeEntry}', [GradeController::class, 'destroy'])->name('grades.destroy');
        
        // Comments (Komentar)
        Route::get('/comments/{studentId}', [CommentController::class, 'index'])->name('comments');
        Route::post('/comments', [CommentController::class, 'store'])->name('comments.store');
        Route::post('/comments/generate/{studentId}/{semester}', [CommentController::class, 'generate'])->name('comments.generate');
        Route::delete('/comments/{studentComment}', [CommentController::class, 'destroy'])->name('comments.destroy');

        // Comment Templates
        Route::post('/comment-templates', [CommentController::class, 'storeTemplate'])->name('comment-templates.store');
        Route::put('/comment-templates/{template}', [CommentController::class, 'updateTemplate'])->name('comment-templates.update');
        Route::delete('/comment-templates/{template}', [CommentController::class, 'destroyTemplate'])->name('comment-templates.destroy');

        // Export Routes
        Route::get('/export/grades/{studentId}', [ExportController::class, 'grades'])->name('export.grades');
        Route::get('/export/comments/{studentId}', [ExportController::class, 'comments'])->name('export.comments');

        // Student Lock API (anti-bentrok antar tutor)
        Route::get('/lock/{studentId}', [StudentLockController::class, 'status'])->name('lock.status');
        Route::post('/lock/{studentId}/heartbeat', [StudentLockController::class, 'heartbeat'])->name('lock.heartbeat');
        Route::post('/lock/{studentId}/release', [StudentLockController::class, 'release'])->name('lock.release');
    });

    // ============ ROUTE HANYA UNTUK SUPER ADMIN (role: superadmin) ============
    Route::middleware('role:superadmin')->name('superadmin.')->prefix('superadmin')->group(function () {
        Route::get('/', SuperAdminDashboardController::class)->name('dashboard');
        
        // Tutor Management
        Route::get('/tutors', [TutorController::class, 'index'])->name('tutors');
        Route::post('/tutors', [TutorController::class, 'store'])->name('tutors.store');
        Route::put('/tutors/{tutor}', [TutorController::class, 'update'])->name('tutors.update');
        Route::delete('/tutors/{tutor}', [TutorController::class, 'destroy'])->name('tutors.destroy');
        Route::patch('/tutors/{tutor}/toggle-status', [TutorController::class, 'toggleStatus'])->name('tutors.toggle-status');
        
        // Student Management
        Route::get('/students', [StudentController::class, 'index'])->name('students');
        Route::post('/students', [StudentController::class, 'store'])->name('students.store');
        Route::get('/students/{student}', [StudentController::class, 'show'])->name('students.show');
        Route::put('/students/{student}', [StudentController::class, 'update'])->name('students.update');
        Route::delete('/students/{student}', [StudentController::class, 'destroy'])->name('students.destroy');
        Route::patch('/students/{student}/toggle-status', [StudentController::class, 'toggleStatus'])->name('students.toggle-status');
        Route::get('/students/{student}/report', [StudentGradeReportController::class, 'show'])->name('students.report');
        Route::get('/students/{student}/pdf', [ProfileController::class, 'pdf'])->name('students.pdf');

        // Classroom Management
        Route::get('/classes', [ClassroomController::class, 'index'])->name('classes');
        Route::post('/classes', [ClassroomController::class, 'store'])->name('classes.store');
        Route::put('/classes/{classroom}', [ClassroomController::class, 'update'])->name('classes.update');
        Route::delete('/classes/{classroom}', [ClassroomController::class, 'destroy'])->name('classes.destroy');
        Route::post('/classes/{classroom}/assign', [ClassroomController::class, 'assignStudent'])->name('classes.assign');
        Route::post('/classes/transfer', [ClassroomController::class, 'transferStudent'])->name('classes.transfer');
        Route::delete('/classes/students/{student}/remove', [ClassroomController::class, 'removeStudent'])->name('classes.remove-student');

        // R5 & R10: Calendar Management (SuperAdmin)
        Route::get('/calendar/template', [SuperAdminCalendarController::class, 'downloadTemplate'])->name('calendar.template');
        Route::get('/calendar/{studentId}', [SuperAdminCalendarController::class, 'index'])->name('calendar');
        Route::post('/calendar', [SuperAdminCalendarController::class, 'store'])->name('calendar.store');
        Route::put('/calendar/{session}', [SuperAdminCalendarController::class, 'update'])->name('calendar.update');
        Route::delete('/calendar/{session}', [SuperAdminCalendarController::class, 'destroy'])->name('calendar.destroy');
        Route::delete('/calendar/{studentId}/clear-all', [SuperAdminCalendarController::class, 'clearAll'])->name('calendar.clear-all');
        Route::post('/calendar/import-csv', [SuperAdminCalendarController::class, 'importCsv'])->name('calendar.import-csv');
        
        // Module Management
        Route::get('/modules', [SuperAdminModuleController::class, 'index'])->name('modules');
        Route::post('/modules', [SuperAdminModuleController::class, 'store'])->name('modules.store');
        Route::put('/modules/{module}', [SuperAdminModuleController::class, 'update'])->name('modules.update');
        Route::delete('/modules/{module}', [SuperAdminModuleController::class, 'destroy'])->name('modules.destroy');
        Route::patch('/modules/{moduleId}/restore', [SuperAdminModuleController::class, 'restore'])->name('modules.restore');
        Route::delete('/modules/{moduleId}/force-delete', [SuperAdminModuleController::class, 'forceDelete'])->name('modules.force-delete');

        // Export Routes
        Route::get('/export/students', [ExportController::class, 'students'])->name('export.students');
        Route::get('/export/tutors', [ExportController::class, 'tutors'])->name('export.tutors');
    });
});
