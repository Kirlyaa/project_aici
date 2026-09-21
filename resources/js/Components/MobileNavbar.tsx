import { Link } from '@inertiajs/react';

interface MobileNavbarProps {
    currentPage?: 'home' | 'tugas' | 'profil' | 'jadwal' | 'notifications' | 'nilai';
    userRole?: string;
}

export default function MobileNavbar({ currentPage, userRole = 'user' }: MobileNavbarProps) {
    const isSuperAdmin = userRole === 'superadmin';
    const isTutor = userRole === 'tutor';

    const isHome = currentPage === 'home';
    const isTugas = currentPage === 'jadwal' || currentPage === 'tugas';
    const isProfil = currentPage === 'profil';
    const isNilai = currentPage === 'nilai';

    if (isSuperAdmin) {
        return (
            <nav className="fixed bottom-0 left-0 right-0 bg-[#034d52] border-t border-teal-800/80 md:hidden z-50 shadow-lg">
                <div className="flex justify-around items-center h-16 px-2">
                    <Link
                        href="/superadmin"
                        className="flex flex-col items-center gap-1 text-teal-200/80 hover:text-white transition-all"
                    >
                        <i className="bi bi-speedometer2 text-xl" />
                        <span className="text-[11px] tracking-wide">Dashboard</span>
                    </Link>
                    <Link
                        href="/superadmin/students"
                        className="flex flex-col items-center gap-1 text-teal-200/80 hover:text-white transition-all"
                    >
                        <i className="bi bi-people-fill text-xl" />
                        <span className="text-[11px] tracking-wide">Siswa</span>
                    </Link>
                    <Link
                        href="/superadmin/classes"
                        className="flex flex-col items-center gap-1 text-teal-200/80 hover:text-white transition-all"
                    >
                        <i className="bi bi-diagram-3-fill text-xl" />
                        <span className="text-[11px] tracking-wide">Kelas</span>
                    </Link>
                    <Link
                        href="/superadmin/tutors"
                        className="flex flex-col items-center gap-1 text-teal-200/80 hover:text-white transition-all"
                    >
                        <i className="bi bi-person-badge-fill text-xl" />
                        <span className="text-[11px] tracking-wide">Tutor</span>
                    </Link>
                </div>
            </nav>
        );
    }

    if (isTutor) {
        return (
            <nav className="fixed bottom-0 left-0 right-0 bg-[#034d52] border-t border-teal-800/80 md:hidden z-50 shadow-lg">
                <div className="flex justify-around items-center h-16 px-2">
                    <Link
                        href="/tutor"
                        className="flex flex-col items-center gap-1 text-teal-200/80 hover:text-white transition-all"
                    >
                        <i className="bi bi-speedometer2 text-xl" />
                        <span className="text-[11px] tracking-wide">Dashboard</span>
                    </Link>
                    <Link
                        href="/tutor/modules"
                        className="flex flex-col items-center gap-1 text-teal-200/80 hover:text-white transition-all"
                    >
                        <i className="bi bi-journal-code text-xl" />
                        <span className="text-[11px] tracking-wide">Modul</span>
                    </Link>
                </div>
            </nav>
        );
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-[#034d52] border-t border-teal-800/80 md:hidden z-50 shadow-lg">
            <div className="flex justify-around items-center h-16 px-2">
                {/* Beranda */}
                <Link
                    href="/beranda"
                    className={`flex flex-col items-center gap-1 transition-all ${
                        isHome ? 'text-white font-bold scale-105' : 'text-teal-200/80 hover:text-white'
                    }`}
                >
                    <i className="bi bi-house-door-fill text-xl" />
                    <span className="text-[11px] tracking-wide">Beranda</span>
                </Link>

                {/* Tugas */}
                <Link
                    href="/jadwal"
                    className={`flex flex-col items-center gap-1 transition-all ${
                        isTugas ? 'text-white font-bold scale-105' : 'text-teal-200/80 hover:text-white'
                    }`}
                >
                    <i className="bi bi-mortarboard-fill text-xl" />
                    <span className="text-[11px] tracking-wide">Tugas</span>
                </Link>

                {/* Nilai */}
                <Link
                    href="/nilai"
                    className={`flex flex-col items-center gap-1 transition-all ${
                        isNilai ? 'text-white font-bold scale-105' : 'text-teal-200/80 hover:text-white'
                    }`}
                >
                    <i className="bi bi-bar-chart-fill text-xl" />
                    <span className="text-[11px] tracking-wide">Nilai</span>
                </Link>

                {/* Profil */}
                <Link
                    href="/profil"
                    className={`flex flex-col items-center gap-1 transition-all ${
                        isProfil ? 'text-white font-bold scale-105' : 'text-teal-200/80 hover:text-white'
                    }`}
                >
                    <i className="bi bi-person-fill text-xl" />
                    <span className="text-[11px] tracking-wide">Profil</span>
                </Link>
            </div>
        </nav>
    );
}
