import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/confirm-password');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
            <Head title="Konfirmasi Password - AICI" />

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
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Konfirmasi Keamanan</h1>
                    <p className="text-gray-500 text-xs mt-1">Area aman. Konfirmasi password Anda untuk melanjutkan.</p>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                Password Saat Ini
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

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3.5 px-4 bg-[#034d52] hover:bg-[#023b3f] text-white font-semibold rounded-xl transition duration-150 shadow-md hover:shadow-lg disabled:opacity-60"
                        >
                            {processing ? 'Memproses...' : 'Konfirmasi Password'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
