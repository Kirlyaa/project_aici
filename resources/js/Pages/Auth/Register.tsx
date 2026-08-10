import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
            <Head title="Daftar - AICI" />

            {/* Main Card Container */}
            <div className="w-full max-w-md">
                {/* Top Section - Logo & Branding */}
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-4">
                        <div className="w-20 h-20 bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform">
                            <i className="bi bi-mortarboard-fill text-white text-4xl" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">AICI</h1>
                    <p className="text-gray-600 text-sm mt-2 font-medium">Akademi Inovasi Coding Indonesia</p>
                </div>

                {/* Register Card */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 backdrop-blur-xl">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Buat Akun Baru</h2>
                        <p className="text-gray-500 text-sm mt-2">Daftar untuk memulai perjalanan coding Anda</p>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        {/* Name Input */}
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
                                }`}
                                placeholder="John Doe"
                                disabled={processing}
                            />
                            {errors.name && (
                                <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                                    <i className="bi bi-exclamation-circle-fill" /> {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Email Input */}
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
                                }`}
                                placeholder="you@email.com"
                                disabled={processing}
                            />
                            {errors.email && (
                                <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                                    <i className="bi bi-exclamation-circle-fill" /> {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Input */}
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
                                }`}
                                placeholder="Minimal 8 karakter"
                                disabled={processing}
                            />
                            {errors.password && (
                                <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                                    <i className="bi bi-exclamation-circle-fill" /> {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password Input */}
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
                                }`}
                                placeholder="Ulangi password Anda"
                                disabled={processing}
                            />
                            {errors.password_confirmation && (
                                <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                                    <i className="bi bi-exclamation-circle-fill" /> {errors.password_confirmation}
                                </p>
                            )}
                        </div>

                        {/* Terms & Conditions */}
                        <div className="flex items-start gap-3 pt-2">
                            <input
                                type="checkbox"
                                id="terms"
                                className="w-5 h-5 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer mt-0.5"
                                disabled={processing}
                            />
                            <label htmlFor="terms" className="text-sm text-gray-700 cursor-pointer">
                                Saya setuju dengan{' '}
                                <a href="#" className="text-teal-600 font-bold hover:text-teal-700 transition-colors">
                                    Syarat & Ketentuan
                                </a>
                            </label>
                        </div>

                        {/* Register Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full mt-8 px-4 py-3.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl font-bold hover:from-teal-700 hover:to-teal-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2.5 active:scale-95"
                        >
                            <i className="bi bi-person-plus-fill text-lg" />
                            {processing ? 'Sedang Mendaftar...' : 'Daftar'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-8">
                        <div className="h-px bg-gray-200 flex-1" />
                        <span className="text-gray-400 text-xs font-medium">SUDAH PUNYA AKUN?</span>
                        <div className="h-px bg-gray-200 flex-1" />
                    </div>

                    {/* Login Link */}
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

                {/* Footer Info */}
                <div className="mt-8 text-center space-y-2">
                    <p className="text-gray-500 text-xs">
                        © 2025 AICI. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
