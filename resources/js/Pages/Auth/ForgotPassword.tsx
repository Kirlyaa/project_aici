import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Props {
    status?: string;
}

export default function ForgotPassword({ status }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/forgot-password');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#EDF2F7] to-blue-50 flex items-center justify-center p-4">
            <Head title="Lupa Password - AICI" />

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
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Atur Ulang Password</h1>
                    <p className="text-gray-500 text-xs mt-1">Masukkan email Anda untuk menerima link reset password</p>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                    {status && (
                        <div className="mb-4 text-sm font-medium text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Terdaftar
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl border-2 transition-all focus:outline-none ${
                                    errors.email
                                        ? 'border-red-300 bg-red-50 focus:border-red-500'
                                        : 'border-gray-200 focus:border-[#0B6282]'
                                }`}
                                placeholder="nama@email.com"
                                required
                            />
                            {errors.email && (
                                <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3.5 px-4 bg-[#0B6282] hover:bg-[#08455c] text-white font-semibold rounded-xl transition duration-150 shadow-md hover:shadow-lg disabled:opacity-60"
                        >
                            {processing ? 'Mengirim...' : 'Kirim Link Reset Password'}
                        </button>

                        <div className="text-center pt-2">
                            <a href="/login" className="text-xs text-[#0B6282] hover:underline font-medium">
                                ← Kembali ke halaman masuk
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
