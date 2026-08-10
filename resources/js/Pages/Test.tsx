import { Head } from '@inertiajs/react';

export default function Test() {
    return (
        <>
            <Head title="Test" />
            <div className="min-h-screen bg-blue-500 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold text-blue-600">Test Page Works! ✅</h1>
                    <p className="mt-4">React + Inertia berjalan dengan baik.</p>
                    <a href="/beranda" className="mt-4 inline-block bg-teal-600 text-white px-4 py-2 rounded">
                        Ke Beranda
                    </a>
                </div>
            </div>
        </>
    );
}
