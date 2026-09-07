<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    public function create(): Response
    {
        $allowPublic = (bool) env('AICI_ALLOW_PUBLIC_REGISTRATION', false);
        $requireCode = !empty(env('AICI_REGISTRATION_CODE'));

        return Inertia::render('Auth/Register', [
            'allowPublicRegistration' => $allowPublic,
            'requireRegistrationCode' => $requireCode,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $allowPublic = (bool) env('AICI_ALLOW_PUBLIC_REGISTRATION', false);
        $registrationCode = env('AICI_REGISTRATION_CODE');
        $defaultStatus = env('AICI_NEW_USER_DEFAULT_STATUS', 'pending');

        if (! $allowPublic) {
            throw ValidationException::withMessages([
                'email' => __('Registrasi publik dinonaktifkan. Silakan hubungi admin sekolah atau Super Admin AICI untuk membuat akun.'),
            ]);
        }

        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ];

        if (! empty($registrationCode)) {
            $rules['registration_code'] = ['required', 'string', function ($attribute, $value, $fail) use ($registrationCode) {
                if (! hash_equals((string) $registrationCode, (string) $value)) {
                    $fail(__('Kode registrasi yang Anda masukkan salah.'));
                }
            }];
        }

        $validated = $request->validate($rules);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'user',
            'status' => in_array($defaultStatus, ['aktif', 'pending'], true) ? $defaultStatus : 'pending',
        ]);

        event(new Registered($user));

        if ($user->isActive()) {
            Auth::login($user);
            return redirect()->route('user.beranda');
        }

        return redirect()->route('login')->with('status', __('Registrasi berhasil. Akun Anda sedang menunggu persetujuan admin. Silakan coba login kembali setelah diaktifkan.'));
    }
}
