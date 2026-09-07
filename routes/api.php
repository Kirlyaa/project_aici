<?php

use App\Http\Controllers\Api\ModuleApiController;
use App\Http\Controllers\Api\StudentApiController;
use App\Http\Controllers\Api\UserApiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    // Current User
    Route::get('/me', [UserApiController::class, 'getCurrentUser']);

    // Student Data (for Tutor/SuperAdmin)
    Route::get('/students', [UserApiController::class, 'getMyStudents']);
    Route::get('/students/{studentId}/summary', [StudentApiController::class, 'getSummary']);
    Route::get('/students/{studentId}/grades', [StudentApiController::class, 'getGrades']);
    Route::get('/students/{studentId}/sessions', [StudentApiController::class, 'getSessions']);

    // Tutors (for SuperAdmin)
    Route::get('/tutors', [UserApiController::class, 'getTutors']);

    // Modules
    Route::get('/modules', [ModuleApiController::class, 'index']);
    Route::get('/modules/{moduleId}', [ModuleApiController::class, 'show']);

    // Module CRUD (SuperAdmin/Tutor)
    Route::middleware('role:superadmin,tutor')->group(function () {
        Route::post('/modules', [ModuleApiController::class, 'store']);
        Route::put('/modules/{moduleId}', [ModuleApiController::class, 'update']);
        Route::delete('/modules/{moduleId}', [ModuleApiController::class, 'destroy']);
    });
});
