import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface UserNavbarProps {
    userName: string;
}

export default function UserNavbar({ userName }: UserNavbarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            {/* Mobile Header Bar - Matching Mobile Mockup */}
            <div className="md:hidden bg-[#034d52] text-white px-4 h-14 sticky top-0 z-50 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="text-white hover:text-teal-200 focus:outline-none p-1"
                        aria-label="Toggle menu"
                    >
                        <i className={`bi ${mobileMenuOpen ? 'bi-x-lg' : 'bi-list'} text-2xl`} />
                    </button>
                    <Link href="/beranda" className="flex items-center gap-2 font-bold text-lg text-white">
                        <span>AICI</span>
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <Link href="/profil" className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center overflow-hidden">
                        <i className="bi bi-person-fill text-white text-base" />
                    </Link>
                </div>
            </div>

            {/* Mobile Slide-down Drawer Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-[#034d52] border-t border-teal-800/60 text-white px-4 pt-2 pb-4 space-y-2 sticky top-14 z-40 shadow-lg animate-fadeIn">
                    <div className="pb-2 border-b border-teal-800 text-xs text-teal-200">
                        Selamat datang, <span className="font-semibold text-white">{userName}</span>
                    </div>
                    <Link
                        href="/beranda"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 text-sm font-medium"
                    >
                        <i className="bi bi-house-door" /> Beranda
                    </Link>
                    <Link
                        href="/jadwal"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 text-sm font-medium"
                    >
                        <i className="bi bi-mortarboard" /> Tugas / Jadwal
                    </Link>
                    <Link
                        href="/profil"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 text-sm font-medium"
                    >
                        <i className="bi bi-person" /> Profil
                    </Link>
                    <button
                        type="button"
                        onClick={() => router.post('/logout', {}, { onSuccess: () => window.location.reload() })}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-600/30 text-red-200 text-sm font-medium text-left"
                    >
                        <i className="bi bi-box-arrow-right" /> Logout
                    </button>
                </div>
            )}

            {/* Desktop Navbar */}
            <nav className="hidden md:block bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#034d52] rounded-lg flex items-center justify-center text-white">
                                <i className="bi bi-robot text-xl" />
                            </div>
                            <div>
                                <h1 className="font-bold text-lg text-[#034d52]">AICI</h1>
                                <p className="text-xs text-gray-500">Artificial Intelligence Center Indonesia</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-8 text-sm font-semibold">
                            <Link href="/beranda" className="text-gray-700 hover:text-[#034d52] transition-colors">
                                Beranda
                            </Link>
                            <Link href="/jadwal" className="text-gray-700 hover:text-[#034d52] transition-colors">
                                Jadwal
                            </Link>
                            <Link href="/profil" className="text-gray-700 hover:text-[#034d52] transition-colors">
                                Profil
                            </Link>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 hidden sm:block">Selamat datang</span>
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{userName}</span>
                                <div className="w-10 h-10 bg-[#034d52] rounded-full flex items-center justify-center">
                                    <i className="bi bi-person-fill text-white text-lg" />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => router.post('/logout', {}, { onSuccess: () => window.location.reload() })}
                                    className="w-10 h-10 rounded-full bg-gray-50 text-gray-500 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors"
                                    title="Logout"
                                >
                                    <i className="bi bi-box-arrow-right text-lg" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}
