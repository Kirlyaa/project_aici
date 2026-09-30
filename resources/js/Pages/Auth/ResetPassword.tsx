import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Props {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        token: token,
        email: email || '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/reset-password');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
            <Head title="Reset Password - AICI" />

            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-3">
                        <div className="p-3 bg-white rounded-2xl shadow-md border border-gray-100 inline-block">
                            <img
                                src="/images/logo-aici.png"
                                alt="AICI Logo"
                                className="h-14 w-auto object-contain"
                            />
                        </div>
                    </div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Password Baru</h1>
                    <p className="text-gray-500 text-xs mt-1">Buat password baru yang aman untuk akun Anda</p>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Email
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none ${
                                    errors.email
                                        ? 'border-red-300 bg-red-50 focus:border-red-500'
                                        : 'border-gray-200 focus:border-teal-500'
                                }`}
                                required
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Password Baru
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none ${
                                    errors.password
                                        ? 'border-red-300 bg-red-50 focus:border-red-500'
                                        : 'border-gray-200 focus:border-teal-500'
                                }`}
                                required
                            />
                            {errors.password && (
                                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Konfirmasi Password Baru
                            </label>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none ${
                                    errors.password_confirmation
                                        ? 'border-red-300 bg-red-50 focus:border-red-500'
                                        : 'border-gray-200 focus:border-teal-500'
                                }`}
                                required
                            />
                            {errors.password_confirmation && (
                                <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3.5 px-4 bg-[#034d52] hover:bg-[#023b3f] text-white font-semibold rounded-xl transition duration-150 shadow-md hover:shadow-lg disabled:opacity-60 mt-2"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Password Baru'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
