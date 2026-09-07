<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsActive
{
    public function handle(Request $request, Closure $next): Response
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();

        if ($user && ! $user->isActive()) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            $status = $user->status ?? 'pending';
            $message = $status === 'pending'
                ? 'Akun Anda masih menunggu persetujuan admin.'
                : 'Akun Anda telah dinonaktifkan.';

            return redirect()->route('login')->withErrors([
                'email' => $message . ' Silakan hubungi Super Admin AICI.',
            ]);
        }

        return $next($request);
    }
}
