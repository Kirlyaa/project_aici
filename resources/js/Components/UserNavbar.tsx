import { Link, router } from '@inertiajs/react';

interface UserNavbarProps {
    userName: string;
}

export default function UserNavbar({ userName }: UserNavbarProps) {
    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 10a1 1 0 112 0v3a1 1 0 11-2 0v-3zm1-5a1 1 0 100 2 1 1 0 000-2z"/>
                            </svg>
                        </div>
                        <div>
                            <h1 className="font-bold text-lg">AICI</h1>
                            <p className="text-xs text-gray-500">Artificial Intelligence Center Indonesia</p>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/beranda" className="text-gray-700 hover:text-teal-600 font-medium">
                            Beranda
                        </Link>
                        <Link href="/tugas" className="text-gray-700 hover:text-teal-600 font-medium">
                            Tugas
                        </Link>
                        <Link href="/profil" className="text-gray-700 hover:text-teal-600 font-medium">
                            Profil
                        </Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600 hidden sm:block">Selamat datang</span>
                        <div className="flex items-center gap-2">
                            <span className="font-medium">{userName}</span>
                            <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                                </svg>
                            </div>
                            <button
                                type="button"
                                onClick={() => router.post('/logout', {}, { onSuccess: () => window.location.reload() })}
                                className="w-10 h-10 rounded-full bg-gray-50 text-gray-500 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors"
                                title="Logout"
                            >
                                <i className="bi bi-box-arrow-right" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
