import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface RegisterPageProps {
    allowPublicRegistration: boolean;
    requireRegistrationCode: boolean;
}

export default function Register() {
    const pageProps = usePage().props as any;
    const allowPublicRegistration = pageProps.allowPublicRegistration ?? false;
    const requireRegistrationCode = pageProps.requireRegistrationCode ?? false;

    const initialData: Record<string, string> = {
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    };
    if (requireRegistrationCode) {
        initialData.registration_code = '';
    }

    const { data, setData, post, processing, errors } = useForm(initialData);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (!allowPublicRegistration) return;
        post('/register');
    };

    const disabled = processing || !allowPublicRegistration;

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
            <Head title="Daftar - AICI" />

            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform">
                            <i className="bi bi-mortarboard-fill text-white text-4xl" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">AICI</h1>
                    <p className="text-gray-600 text-sm mt-2 font-medium">Akademi Inovasi Coding Indonesia</p>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 backdrop-blur-xl">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Buat Akun Baru</h2>
                        <p className="text-gray-500 text-sm mt-2">
                            {allowPublicRegistration
                                ? 'Daftar untuk memulai perjalanan coding Anda'
                                : 'Registrasi publik saat ini dinonaktifkan'}
                        </p>
                    </div>

                    {!allowPublicRegistration && (
                        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                            <div className="flex items-start gap-3">
                                <i className="bi bi-exclamation-triangle-fill text-amber-600 text-xl mt-0.5" />
                                <div>
                                    <p className="font-semibold text-amber-900 text-sm">Pendaftaran Ditutup</p>
                                    <p className="text-amber-800 text-xs mt-1 leading-relaxed">
                                        Platform AICI hanya untuk siswa sekolah yang terdaftar. Silakan hubungi
                                        sekolah Anda atau Super Admin AICI di <span className="font-mono">admin@aici.id</span> untuk
                                        pembuatan akun.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                                <i className="bi bi-person-fill mr-2 text-teal-600" />
                                Nama Lengkap
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all focus:outline-none ${
                                    errors.name
                                        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                        : 'border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
                                } ${disabled ? 'opacity-60 cursor-not-allowed bg-gray-50' : ''}`}
                                placeholder="John Doe"
                                disabled={disabled}
                            />
                            {errors.name && (
                                <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                                    <i className="bi bi-exclamation-circle-fill" /> {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                                <i className="bi bi-envelope-fill mr-2 text-teal-600" />
                                Email
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all focus:outline-none ${
                                    errors.email
                                        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                        : 'border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
                                } ${disabled ? 'opacity-60 cursor-not-allowed bg-gray-50' : ''}`}
                                placeholder="you@email.com"
                                disabled={disabled}
                            />
                            {errors.email && (
                                <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                                    <i className="bi bi-exclamation-circle-fill" /> {errors.email}
                                </p>
                            )}
                        </div>

                        {requireRegistrationCode && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                                    <i className="bi bi-key-fill mr-2 text-purple-600" />
                                    Kode Registrasi
                                </label>
                                <input
                                    type="text"
                                    value={data.registration_code ?? ''}
                                    onChange={(e) => setData('registration_code', e.target.value)}
                                    className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all focus:outline-none ${
                                        errors.registration_code
                                            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                            : 'border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100'
                                    } ${disabled ? 'opacity-60 cursor-not-allowed bg-gray-50' : ''}`}
                                    placeholder="Masukkan kode dari sekolah"
                                    disabled={disabled}
                                />
                                {errors.registration_code && (
                                    <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                                        <i className="bi bi-exclamation-circle-fill" /> {errors.registration_code}
                                    </p>
                                )}
                                {!errors.registration_code && (
                                    <p className="text-gray-500 text-xs mt-2 flex items-center gap-1">
                                        <i className="bi bi-info-circle-fill" /> Dapatkan kode dari admin sekolah Anda
                                    </p>
                                )}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                                <i className="bi bi-lock-fill mr-2 text-teal-600" />
                                Password
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all focus:outline-none ${
                                    errors.password
                                        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                        : 'border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
                                } ${disabled ? 'opacity-60 cursor-not-allowed bg-gray-50' : ''}`}
                                placeholder="Minimal 8 karakter"
                                disabled={disabled}
                            />
                            {errors.password && (
                                <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                                    <i className="bi bi-exclamation-circle-fill" /> {errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2.5">
                                <i className="bi bi-check-circle-fill mr-2 text-teal-600" />
                                Konfirmasi Password
                            </label>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className={`w-full px-4 py-3.5 rounded-xl border-2 transition-all focus:outline-none ${
                                    errors.password_confirmation
                                        ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                        : 'border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
                                } ${disabled ? 'opacity-60 cursor-not-allowed bg-gray-50' : ''}`}
                                placeholder="Ulangi password Anda"
                                disabled={disabled}
                            />
                            {errors.password_confirmation && (
                                <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                                    <i className="bi bi-exclamation-circle-fill" /> {errors.password_confirmation}
                                </p>
                            )}
                        </div>

                        {allowPublicRegistration && (
                            <div className="flex items-start gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    className="w-5 h-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer mt-0.5"
                                    disabled={disabled}
                                />
                                <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                                    Saya setuju dengan{' '}
                                    <a href="#" className="text-teal-600 font-bold hover:text-teal-700 transition-colors">
                                        Syarat & Ketentuan
                                    </a>
                                </label>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={disabled}
                            className={`w-full mt-8 px-4 py-3.5 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2.5 active:scale-95 ${
                                disabled
                                    ? 'bg-gray-300 cursor-not-allowed opacity-70'
                                    : 'bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 disabled:opacity-60'
                            }`}
                        >
                            <i className="bi bi-person-plus-fill text-lg" />
                            {!allowPublicRegistration ? 'Pendaftaran Ditutup' : processing ? 'Sedang Mendaftar...' : 'Daftar'}
                        </button>
                    </form>

                    <div className="flex items-center gap-3 my-8">
                        <div className="h-px bg-gray-200 flex-1" />
                        <span className="text-gray-400 text-xs font-medium">SUDAH PUNYA AKUN?</span>
                        <div className="h-px bg-gray-200 flex-1" />
                    </div>

                    <div className="text-center">
                        <p className="text-gray-600 text-sm">
                            Sudah memiliki akun?{' '}
                            <Link
                                href="/login"
                                className="text-teal-600 font-bold hover:text-teal-700 transition-colors inline-flex items-center gap-1"
                            >
                                Masuk di sini
                                <i className="bi bi-arrow-right text-xs" />
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center space-y-2">
                    <p className="text-gray-500 text-xs">
                        © {new Date().getFullYear()} AICI. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
