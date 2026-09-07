import { Link } from '@inertiajs/react';

interface MobileNavbarProps {
    currentPage?: 'home' | 'tugas' | 'profil' | 'jadwal' | 'notifications';
}

export default function MobileNavbar({ currentPage }: MobileNavbarProps) {
    const isHome = currentPage === 'home';
    const isTugas = currentPage === 'jadwal' || currentPage === 'tugas';
    const isProfil = currentPage === 'profil';

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
