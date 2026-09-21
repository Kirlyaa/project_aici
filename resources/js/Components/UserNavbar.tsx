import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface UserNavbarProps {
    userName: string;
    userRole?: string;
}

export default function UserNavbar({ userName, userRole = 'user' }: UserNavbarProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const isSuperAdmin = userRole === 'superadmin';
    const isTutor = userRole === 'tutor';
    const homeLink = isSuperAdmin ? '/superadmin' : isTutor ? '/tutor' : '/beranda';

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
                    <Link href={homeLink} className="flex items-center gap-2">
                        <div className="bg-white px-2 py-0.5 rounded flex items-center">
                            <img
                                src="/images/logo-aici.png"
                                alt="AICI Logo"
                                className="h-6 w-auto object-contain"
                            />
                        </div>
                        {isSuperAdmin && <span className="text-[10px] bg-red-500/80 px-1.5 py-0.5 rounded font-mono uppercase">Admin</span>}
                        {isTutor && <span className="text-[10px] bg-blue-500/80 px-1.5 py-0.5 rounded font-mono uppercase">Tutor</span>}
                    </Link>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href={isSuperAdmin ? '/superadmin/students' : isTutor ? '/tutor' : '/profil'}
                        className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center overflow-hidden"
                    >
                        <i className="bi bi-person-fill text-white text-base" />
                    </Link>
                </div>
            </div>

            {/* Mobile Slide-down Drawer Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden bg-[#034d52] border-t border-teal-800/60 text-white px-4 pt-2 pb-4 space-y-2 sticky top-14 z-40 shadow-lg animate-fadeIn">
                    <div className="pb-2 border-b border-teal-800 text-xs text-teal-200">
                        Selamat datang, <span className="font-semibold text-white">{userName}</span>
                        {isSuperAdmin && <span className="ml-2 px-1.5 py-0.5 bg-red-500/30 rounded text-[10px]">Super Admin</span>}
                        {isTutor && <span className="ml-2 px-1.5 py-0.5 bg-blue-500/30 rounded text-[10px]">Tutor</span>}
                    </div>

                    {isSuperAdmin ? (
                        <>
                            <Link
                                href="/superadmin"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 text-sm font-medium"
                            >
                                <i className="bi bi-speedometer2" /> Dashboard Admin
                            </Link>
                            <Link
                                href="/superadmin/students"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 text-sm font-medium"
                            >
                                <i className="bi bi-people" /> Manajemen Siswa
                            </Link>
                            <Link
                                href="/superadmin/classes"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 text-sm font-medium"
                            >
                                <i className="bi bi-diagram-3" /> Manajemen Kelas
                            </Link>
                            <Link
                                href="/superadmin/tutors"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 text-sm font-medium"
                            >
                                <i className="bi bi-person-badge" /> Manajemen Tutor
                            </Link>
                        </>
                    ) : isTutor ? (
                        <>
                            <Link
                                href="/tutor"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 text-sm font-medium"
                            >
                                <i className="bi bi-speedometer2" /> Dashboard Tutor
                            </Link>
                            <Link
                                href="/tutor/modules"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 text-sm font-medium"
                            >
                                <i className="bi bi-journal-code" /> Modul Pembelajaran
                            </Link>
                        </>
                    ) : (
                        <>
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
                                href="/nilai"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 text-sm font-medium"
                            >
                                <i className="bi bi-bar-chart" /> Nilai
                            </Link>
                            <Link
                                href="/profil"
                                onClick={() => setMobileMenuOpen(false)}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 text-sm font-medium"
                            >
                                <i className="bi bi-person" /> Profil
                            </Link>
                        </>
                    )}

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
                        <Link href={homeLink} className="flex items-center gap-3 group hover:opacity-90 transition-opacity">
                            <img
                                src="/images/logo-aici.png"
                                alt="AICI - Artificial Intelligence Center Indonesia"
                                className="h-10 w-auto object-contain"
                            />
                            {(isSuperAdmin || isTutor) && (
                                <div className="border-l border-gray-300 pl-3">
                                    {isSuperAdmin && <span className="text-[11px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-medium">Super Admin</span>}
                                    {isTutor && <span className="text-[11px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">Tutor</span>}
                                </div>
                            )}
                        </Link>

                        <div className="flex items-center gap-8 text-sm font-semibold">
                            {isSuperAdmin ? (
                                <>
                                    <Link href="/superadmin" className="text-gray-700 hover:text-[#034d52] transition-colors">
                                        Dashboard
                                    </Link>
                                    <Link href="/superadmin/students" className="text-gray-700 hover:text-[#034d52] transition-colors">
                                        Manajemen Siswa
                                    </Link>
                                    <Link href="/superadmin/classes" className="text-gray-700 hover:text-[#034d52] transition-colors">
                                        Kelas
                                    </Link>
                                    <Link href="/superadmin/tutors" className="text-gray-700 hover:text-[#034d52] transition-colors">
                                        Tutor
                                    </Link>
                                </>
                            ) : isTutor ? (
                                <>
                                    <Link href="/tutor" className="text-gray-700 hover:text-[#034d52] transition-colors">
                                        Dashboard
                                    </Link>
                                    <Link href="/tutor/modules" className="text-gray-700 hover:text-[#034d52] transition-colors">
                                        Modul
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link href="/beranda" className="text-gray-700 hover:text-[#034d52] transition-colors">
                                        Beranda
                                    </Link>
                                    <Link href="/jadwal" className="text-gray-700 hover:text-[#034d52] transition-colors">
                                        Jadwal
                                    </Link>
                                    <Link href="/nilai" className="text-gray-700 hover:text-[#034d52] transition-colors">
                                        Nilai
                                    </Link>
                                    <Link href="/profil" className="text-gray-700 hover:text-[#034d52] transition-colors">
                                        Profil
                                    </Link>
                                </>
                            )}
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
