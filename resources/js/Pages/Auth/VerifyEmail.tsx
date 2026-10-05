import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Props {
    status?: string;
}

export default function VerifyEmail({ status }: Props) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/email/verification-notification');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-[#EDF2F7] to-blue-50 flex items-center justify-center p-4">
            <Head title="Verifikasi Email - AICI" />

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
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Verifikasi Email</h1>
                    <p className="text-gray-500 text-xs mt-1">Konfirmasi alamat email Anda untuk mengakses platform</p>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                    <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        Terima kasih telah bergabung. Sebelum memulai, mohon verifikasi alamat email Anda melalui tautan yang baru saja kami kirimkan ke email Anda.
                    </p>

                    {status === 'verification-link-sent' && (
                        <div className="mb-4 text-sm font-medium text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                            Tautan verifikasi baru telah berhasil dikirim ke alamat email Anda.
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 px-4 bg-[#0B6282] hover:bg-[#08455c] text-white font-semibold rounded-xl transition duration-150 shadow-md disabled:opacity-60"
                        >
                            {processing ? 'Mengirim...' : 'Kirim Ulang Email Verifikasi'}
                        </button>

                        <div className="text-center pt-2">
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="text-xs text-gray-500 hover:text-red-600 font-medium"
                            >
                                Keluar (Logout)
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
