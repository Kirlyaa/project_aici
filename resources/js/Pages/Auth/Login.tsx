import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

// Demo account hanya boleh terlihat pada dev build.
const showDemoAccounts = import.meta.env.DEV;

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
            <Head title="Login - AICI" />

            {/* Main Card Container */}
            <div className="w-full max-w-md">
                {/* Top Section - Logo & Branding */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-3">
                        <div className="p-3 bg-white rounded-2xl shadow-md border border-gray-100 transform hover:scale-105 transition-transform inline-block">
                            <img
                                src="/images/logo-aici.png"
                                alt="AICI Logo"
                                className="h-16 w-auto object-contain"
                            />
                        </div>
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Portal Pembelajaran</h1>
                    <p className="text-gray-500 text-xs mt-1 font-medium">Artificial Intelligence Center Indonesia</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 backdrop-blur-xl">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Masuk Sekarang</h2>
                        <p className="text-gray-500 text-sm mt-2">Akses dashboard dan kelola pembelajaran Anda</p>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
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
                                placeholder="••••••••"
                                disabled={processing}
                            />
                            {errors.password && (
                                <p className="text-red-600 text-xs mt-2 flex items-center gap-1">
                                    <i className="bi bi-exclamation-circle-fill" /> {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full mt-8 px-4 py-3.5 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl font-bold hover:from-teal-700 hover:to-teal-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2.5 active:scale-95"
                        >
                            <i className="bi bi-box-arrow-in-right text-lg" />
                            {processing ? 'Sedang Masuk...' : 'Masuk'}
                        </button>
                    </form>
                </div>

                {/* Footer Info */}
                <div className="mt-8 text-center space-y-3">
                    {showDemoAccounts && (
                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                            <p className="text-blue-900 text-xs font-semibold mb-2">📝 Demo Accounts:</p>
                            <div className="space-y-1.5 text-left">
                                <p className="text-blue-800 text-xs">
                                    <span className="font-semibold">Super Admin:</span><br/>
                                    admin@aici.id / admin123
                                </p>
                                <p className="text-blue-800 text-xs">
                                    <span className="font-semibold">Tutor:</span><br/>
                                    aiya@aici.id / password123
                                </p>
                                <p className="text-blue-800 text-xs">
                                    <span className="font-semibold">Student:</span><br/>
                                    user@email.com / password123
                                </p>
                            </div>
                        </div>
                    )}
                    <p className="text-gray-500 text-xs">
                        © {new Date().getFullYear()} AICI. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
