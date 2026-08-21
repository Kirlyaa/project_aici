<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (! Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();
        $userRole = $user->role ?? 'user';

        if (! in_array($userRole, $roles, true)) {
            $fallback = match ($userRole) {
                'tutor' => '/tutor',
                'superadmin' => '/superadmin',
                default => '/beranda',
            };

            return redirect($fallback)->with('error', 'Anda tidak memiliki izin untuk mengakses halaman tersebut.');
        }

        return $next($request);
    }
}
