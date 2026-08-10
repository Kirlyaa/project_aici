import { Link } from '@inertiajs/react';

interface MobileNavbarProps {
    currentPage: 'home' | 'tugas' | 'profil';
}

export default function MobileNavbar({ currentPage }: MobileNavbarProps) {
    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-teal-700 md:hidden z-50">
            <div className="flex justify-around items-center h-16">
                <Link 
                    href="/beranda" 
                    className={`flex flex-col items-center gap-1 ${currentPage === 'home' ? 'text-white' : 'text-teal-200'}`}
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                    </svg>
                    <span className="text-xs">Home</span>
                </Link>

                <Link 
                    href="/tugas" 
                    className={`flex flex-col items-center gap-1 ${currentPage === 'tugas' ? 'text-white' : 'text-teal-200'}`}
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h6a1 1 0 100-2H7zm0 4a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-xs">Tugas</span>
                </Link>

                <Link 
                    href="/profil" 
                    className={`flex flex-col items-center gap-1 ${currentPage === 'profil' ? 'text-white' : 'text-teal-200'}`}
                >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                    </svg>
                    <span className="text-xs">Profil</span>
                </Link>
            </div>
        </nav>
    );
}
