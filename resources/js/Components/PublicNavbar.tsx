import { Link } from '@inertiajs/react';

interface PublicNavbarProps {
    active: 'home' | 'program' | 'profil' | 'fasilitas' | 'galeri' | 'riset' | 'kontak';
}

export default function PublicNavbar({ active }: PublicNavbarProps) {
    const navItems = [
        { label: 'Home', href: '/landing', key: 'home' },
        { label: 'Program', href: '/program', key: 'program' },
        { label: 'Profil', href: '/profil', key: 'profil' },
        { label: 'Fasilitas', href: '/fasilitas', key: 'fasilitas' },
        { label: 'Galeri', href: '/galeri', key: 'galeri' },
        { label: 'Riset', href: '/riset', key: 'riset' },
        { label: 'Kontak', href: '/kontak', key: 'kontak' },
    ];

    return (
        <header className="sticky top-0 z-50 bg-[#0B6282]/95 backdrop-blur-md border-b border-[#08455c]/60 shadow-md transition-all">
            {/* Top Institutional Micro-Bar */}
            <div className="bg-[#08455c] border-b border-[#062d3d]/60 text-[11px] text-cyan-100/80 py-1.5 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span className="text-[11px] font-semibold tracking-wide uppercase text-cyan-200">Pusat Riset Kecerdasan Artifisial</span>
                        <span className="text-cyan-700 hidden sm:inline">•</span>
                        <span className="hidden sm:inline text-cyan-100/90">FMIPA Universitas Indonesia × UMG IdeaLab</span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px]">
                        <span className="hidden md:inline text-[11px] text-cyan-200/90">Gedung Riset Multidisiplin Pertamina Lt. 4, UI Depok</span>
                        <a href="mailto:aici@sci.ui.ac.id" className="hover:text-white transition-colors">aici@sci.ui.ac.id</a>
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Brand Identity */}
                    <Link href="/landing" className="flex items-center gap-3.5 group">
                        <div className="bg-white p-2 rounded-xl shadow-md border border-slate-100 group-hover:border-cyan-300 transition-all">
                            <img
                                src="/images/logo-aici.png"
                                alt="Logo AiCI"
                                className="h-8 w-auto object-contain"
                            />
                        </div>
                        <div className="hidden lg:block leading-tight">
                            <div className="text-white font-extrabold text-base tracking-tight group-hover:text-cyan-200 transition-colors">
                                AiCI FMIPA UI
                            </div>
                            <div className="text-[10px] tracking-wider text-cyan-100/80 uppercase font-medium">
                                Artificial Intelligence Center Indonesia
                            </div>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-1 lg:gap-2">
                        {navItems.map((item) => {
                            const isActive = active === item.key;
                            return (
                                <Link
                                    key={item.key}
                                    href={item.href}
                                    className={`relative px-3.5 py-2 text-xs lg:text-sm font-semibold transition-all rounded-lg ${
                                        isActive
                                            ? 'text-white bg-white/15 font-bold shadow-inner'
                                            : 'text-cyan-50/90 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    {item.label}
                                    {isActive && (
                                        <span className="absolute bottom-1 left-3.5 right-3.5 h-[2px] bg-[#E62C29] rounded-full shadow-[0_0_8px_rgba(230,44,41,0.8)]"></span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Public CTA & Portal Login Button */}
                    <div className="flex items-center gap-2.5 sm:gap-3">
                        <Link
                            href="/kontak"
                            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-[#E62C29] hover:bg-[#d02522] rounded-full shadow-md shadow-red-950/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            <span>Hubungi Kami</span>
                            <i className="bi bi-arrow-right-short text-base"></i>
                        </Link>
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-white/15 hover:bg-white/25 border border-white/30 hover:border-white/50 rounded-full shadow-sm backdrop-blur-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            <i className="bi bi-person-circle text-sm sm:text-base"></i>
                            <span>Portal</span>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
