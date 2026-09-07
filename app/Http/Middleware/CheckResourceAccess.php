<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckResourceAccess
{
    /**
     * Middleware untuk check akses resource
     * Usage: Route::middleware('check.resource:student')->group(...)
     *
     * Ini middleware memastikan user hanya bisa akses data mereka sendiri
     */
    public function handle(Request $request, Closure $next, string $resource = 'student'): Response
    {
        $user = Auth::user();

        if (!$user) {
            abort(401, 'Unauthorized');
        }

        // Get the resource ID from route parameter
        $resourceId = $this->getResourceId($request, $resource);

        if (!$resourceId) {
            return $next($request); // No ID to check, let the controller handle it
        }

        // Check authorization
        if (!$this->isAuthorized($user, $resource, $resourceId)) {
            abort(403, 'Anda tidak memiliki izin untuk mengakses resource ini.');
        }

        return $next($request);
    }

    /**
     * Get resource ID from request
     */
    private function getResourceId(Request $request, string $resource): ?int
    {
        $paramNames = [
            'student' => 'studentId',
            'user' => 'userId',
            'module' => 'moduleId',
            'session' => 'sessionId',
        ];

        $paramName = $paramNames[$resource] ?? $resource . 'Id';

        return $request->route($paramName);
    }

    /**
     * Check if user is authorized to access resource
     */
    private function isAuthorized($user, string $resource, int $resourceId): bool
    {
        // SuperAdmin can access everything
        if ($user->role === 'superadmin') {
            return true;
        }

        // User can access their own data
        if ($resource === 'student' && $user->id === $resourceId && $user->role === 'user') {
            return true;
        }

        // Tutor can access students they manage
        if ($resource === 'student' && $user->role === 'tutor') {
            return $user->students()->where('id', $resourceId)->exists();
        }

        return false;
    }
}
