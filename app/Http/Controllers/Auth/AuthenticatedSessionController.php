<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        /** @var \App\Models\User|null $user */
        $user = Auth::user();

        if ($user && ! $user->isActive()) {
            $status = $user->status ?? 'pending';
            $message = $status === 'pending'
                ? __('Akun Anda masih menunggu persetujuan admin. Silakan hubungi Super Admin AICI.')
                : __('Akun Anda telah dinonaktifkan. Silakan hubungi admin untuk informasi lebih lanjut.');

            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return redirect()->route('login')->withErrors([
                'email' => $message,
            ]);
        }

        $request->session()->regenerate();

        $dashboard = match($user?->role ?? 'user') {
            'tutor' => '/tutor',
            'superadmin' => '/superadmin',
            default => '/beranda',
        };

        return redirect()->intended($dashboard);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
