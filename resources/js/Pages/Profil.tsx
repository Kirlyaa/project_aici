import React from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicNavbar from '@/Components/PublicNavbar';
import PublicFooter from '@/Components/PublicFooter';

export default function Profil() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans flex flex-col selection:bg-[#0B6282] selection:text-white">
            <Head title="Profil Lembaga - Artificial Intelligence Center Indonesia (AiCI) FMIPA UI" />

            {/* Persistent Standard Institutional Navbar */}
            <PublicNavbar active="profil" />

            {/* ==================== 2. HERO SECTION ==================== */}
            <section className="bg-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    {/* Left: Text & Badges */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-100 font-bold">
                                <i className="bi bi-shield-check text-xs"></i>
                                PROFIL RESMI AiCI
                            </span>
                            <span>/</span>
                            <span>TENTANG LEMBAGA KAMI</span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                            Artificial Intelligence Center Indonesia
                        </h1>

                        <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
                            Lembaga Yang Didirikan Atas Kerjasama FMIPA Universitas Indonesia Dengan UMG IdeaLab Indonesia Yang Berfokus Pada Pengembangan Sumber Daya Manusia Dalam Bidang Artificial Intelligence (Kecerdasan Artifisial).
                        </p>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-2.5 pt-1">
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                                <i className="bi bi-calendar-check text-[#0B6282]"></i>
                                Berdiri Sejak 2021
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                                <i className="bi bi-bank text-[#0B6282]"></i>
                                FMIPA Universitas Indonesia
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
                                <i className="bi bi-mortarboard text-[#E62C29]"></i>
                                Pionir Edukasi AI K-12 & Kampus
                            </span>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-wrap items-center gap-3.5 pt-3">
                            <a
                                href="#visi-misi"
                                className="inline-flex items-center gap-2 bg-[#E62C29] hover:bg-[#d02522] text-white text-xs font-bold px-7 py-3 rounded-full shadow-md shadow-red-950/20 hover:shadow-lg transition-all uppercase tracking-wide"
                            >
                                <span>Eksplorasi Visi & Misi</span>
                                <i className="bi bi-arrow-down-short text-base"></i>
                            </a>
                            <a
                                href="https://wa.me/6282110103938"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold px-6 py-3 rounded-full shadow-sm border border-slate-200 transition-all uppercase tracking-wide"
                            >
                                <i className="bi bi-handshake text-[#0B6282]"></i>
                                <span>Kemitraan</span>
                            </a>
                        </div>
                    </div>

                    {/* Right: Featured Photo with Badges */}
                    <div className="lg:col-span-5">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900 group h-80 sm:h-96">
                            <img
                                src="/images/landing/profil-hero.jpg"
                                alt="Kegiatan Pembelajaran AiCI FMIPA UI"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src = '/images/landing/kids-coding.jpg';
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20"></div>

                            {/* Floating bottom badges inside picture */}
                            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-2">
                                <div className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium text-white border border-white/10">
                                    <i className="bi bi-geo-alt-fill text-cyan-300"></i>
                                    <span>Lab Riset FMIPA UI Lt. 4</span>
                                </div>
                                <div className="inline-flex items-center gap-1.5 bg-red-600/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-sm">
                                    <i className="bi bi-people-fill"></i>
                                    <span>5,000+ Peserta</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== 3. DEEP TEAL BACKGROUND WRAPPER (KOLABORASI, METRIKS, VISI, MISI) ==================== */}
            <section className="bg-[#0B6282] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>

                <div className="max-w-7xl mx-auto space-y-12 relative z-10">

                    {/* CARD KOLABORASI STRATEGIS (LIGHT CARD INSIDE TEAL BG) */}
                    <div className="bg-white text-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-100">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            {/* Left: AiCI Logo Badge Box */}
                            <div className="lg:col-span-4 bg-gradient-to-br from-slate-100 to-sky-50 rounded-2xl p-8 border border-sky-100 flex flex-col items-center justify-center text-center space-y-3">
                                <div className="w-16 h-16 rounded-2xl bg-[#0B6282] text-white flex items-center justify-center text-3xl shadow-md">
                                    <i className="bi bi-lightbulb-fill text-cyan-300"></i>
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-xl text-slate-900 tracking-wider">AiCI</h4>
                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                                        CENTER INDONESIA
                                    </span>
                                </div>
                                <span className="inline-block bg-amber-100 text-amber-900 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                                    SINERGI AKADEMI & INDUSTRI
                                </span>
                            </div>

                            {/* Right: Collaborative Statement */}
                            <div className="lg:col-span-8 space-y-3">
                                <div className="flex items-center gap-2 text-[#E62C29] text-xs font-bold uppercase tracking-wider">
                                    <i className="bi bi-stars"></i>
                                    <span>Kolaborasi Strategis Masa Depan</span>
                                </div>
                                <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                                    Sebuah Lembaga Yang Didirikan Atas Kerjasama FMIPA Universitas Indonesia Dengan UMG IdeaLab Indonesia Yang Bertujuan Untuk Mengembangkan Sumber Daya Manusia Dalam Bidang Artificial Intelligence Untuk Membangun Kapabilitas Bangsa Menyambut Revolusi Industri 4.0.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 4 METRICS CARDS IN ROW */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-[#08455c]/85 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-1 shadow-sm">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-200 block">
                                TINGKAT PENDIDIKAN
                            </span>
                            <div className="text-xl sm:text-2xl font-black text-white">SD — Kampus</div>
                            <p className="text-[11px] text-cyan-100/80">Kurikulum berjenjang terpadu</p>
                        </div>

                        <div className="bg-[#08455c]/85 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-1 shadow-sm">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-200 block">
                                MITRA RISET
                            </span>
                            <div className="text-xl sm:text-2xl font-black text-white">UMG IdeaLab</div>
                            <p className="text-[11px] text-cyan-100/80">Inkubasi teknologi terapan</p>
                        </div>

                        <div className="bg-[#08455c]/85 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-1 shadow-sm">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-200 block">
                                TENAGA PENDIDIK
                            </span>
                            <div className="text-xl sm:text-2xl font-black text-white">1,200+ Guru</div>
                            <p className="text-[11px] text-cyan-100/80">Telah tersertifikasi AI</p>
                        </div>

                        <div className="bg-[#08455c]/85 backdrop-blur-md rounded-2xl p-5 border border-white/15 space-y-1 shadow-sm">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-200 block">
                                KEPUASAN PELATIHAN
                            </span>
                            <div className="text-xl sm:text-2xl font-black text-white">4.9 / 5.0</div>
                            <p className="text-[11px] text-cyan-100/80">Berdasarkan ulasan peserta</p>
                        </div>
                    </div>

                    {/* CARD VISI */}
                    <div id="visi-misi" className="bg-white text-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-100 text-center space-y-4">
                        <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider">
                            <i className="bi bi-eye-fill"></i>
                            <span>VISI</span>
                        </div>
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 max-w-3xl mx-auto leading-relaxed">
                            Menjadi Pusat Pembelajaran, Penelitian, Dan Konsultansi Bidang Artificial Intelligence Pertama Dan Terkemuka Di Indonesia Untuk Membangun Sumber Daya Manusia Yang Berkualitas Dan Unggul Dalam Bidang Artificial Intelligence.
                        </h3>
                    </div>

                    {/* CARD MISI (5 PILAR) */}
                    <div className="bg-white text-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-100 space-y-6">
                        <div className="text-center space-y-2">
                            <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider">
                                <i className="bi bi-flag-fill"></i>
                                <span>MISI</span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto">
                                Lima pilar dedikasi operasional AiCI untuk mengakselerasi literasi dan kemandirian kecerdasan artifisial bangsa.
                            </p>
                        </div>

                        {/* 4 Pilar Grid (2x2) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#0B6282] text-white flex items-center justify-center shrink-0 text-base shadow-sm">
                                    <i className="bi bi-mortarboard-fill"></i>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0B6282] block">
                                        PILAR 01 • PEMBELAJARAN
                                    </span>
                                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                        Melaksanakan pembelajaran bidang artificial intelligence untuk siswa tingkat SD/MI sampai tingkat Perguruan Tinggi.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#0B6282] text-white flex items-center justify-center shrink-0 text-base shadow-sm">
                                    <i className="bi bi-person-video3"></i>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0B6282] block">
                                        PILAR 02 • PELATIHAN PENDIDIK
                                    </span>
                                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                        Melaksanakan pelatihan bidang artificial intelligence untuk guru dari tingkat SD/MI sampai tingkat SMA/MA.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#0B6282] text-white flex items-center justify-center shrink-0 text-base shadow-sm">
                                    <i className="bi bi-briefcase-fill"></i>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0B6282] block">
                                        PILAR 03 • KONSULTANSI INDUSTRI
                                    </span>
                                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                        Melaksanakan konsultansi untuk pengembangan bidang artificial intelligence di Indonesia.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#0B6282] text-white flex items-center justify-center shrink-0 text-base shadow-sm">
                                    <i className="bi bi-cpu-fill"></i>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0B6282] block">
                                        PILAR 04 • RISET TERAPAN
                                    </span>
                                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                        Melaksanakan penelitian bidang artificial intelligence untuk menghasilkan produk yang berguna untuk kemajuan bangsa Indonesia.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Pilar 5: Full Width Card */}
                        <div className="bg-rose-50/70 rounded-2xl p-5 border border-rose-200/80 flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#E62C29] text-white flex items-center justify-center shrink-0 text-base shadow-sm">
                                <i className="bi bi-trophy-fill"></i>
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-700 block">
                                    PILAR 05 • HASIL SUMBER DAYA
                                </span>
                                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                    Menghasilkan Sumber Daya Manusia yang unggul dan kompetitif dalam bidang artificial intelligence di kancah nasional maupun global.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== 4. STRUKTUR ORGANISASI: TIM OPERASIONAL DAN TUTOR ==================== */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
                <div className="text-center space-y-3 max-w-2xl mx-auto">
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider border border-sky-100">
                        STRUKTUR ORGANISASI
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
                        Tim Operasional dan Tutor
                    </h2>
                    <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                        Mendedikasikan keahlian sains, pedagogi, dan teknologi untuk mencetak talenta masa depan Indonesia yang berintegritas dan siap kerja.
                    </p>
                </div>

                {/* 3 Team Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Card 1: Citra Chairunnisa */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md hover:shadow-xl transition-all text-center flex flex-col items-center space-y-4 group">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-slate-100 shadow-md group-hover:scale-105 transition-transform duration-300">
                            <img
                                src="/images/landing/team-citra.jpg"
                                alt="Citra Chairunnisa, S.Pd"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src = '/images/landing/avatar-aulia.jpg';
                                }}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <span className="inline-block bg-sky-50 text-sky-700 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                                KEUANGAN & OPERASIONAL
                            </span>
                            <h3 className="text-base sm:text-lg font-black text-slate-900">
                                Citra Chairunnisa, S.Pd
                            </h3>
                            <p className="text-xs text-slate-500">
                                Staff Administrasi Keuangan
                            </p>
                        </div>
                        <div className="pt-2">
                            <a
                                href="https://wa.me/6282110103938"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0B6282] border border-slate-200 px-4 py-1.5 rounded-full hover:bg-slate-50 transition-colors"
                            >
                                <i className="bi bi-envelope"></i>
                                <span>Hubungi</span>
                            </a>
                        </div>
                    </div>

                    {/* Card 2: Ahmad Nurfatah J. */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md hover:shadow-xl transition-all text-center flex flex-col items-center space-y-4 group">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-slate-100 shadow-md group-hover:scale-105 transition-transform duration-300">
                            <img
                                src="/images/landing/team-ahmad.jpg"
                                alt="Ahmad Nurfatah J., S.Pd"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src = '/images/landing/avatar-kahfi.jpg';
                                }}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <span className="inline-block bg-sky-50 text-sky-700 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                                ADMINISTRASI SISTEM
                            </span>
                            <h3 className="text-base sm:text-lg font-black text-slate-900">
                                Ahmad Nurfatah J., S.Pd
                            </h3>
                            <p className="text-xs text-slate-500">
                                Staff Administrasi Keuangan
                            </p>
                        </div>
                        <div className="pt-2">
                            <a
                                href="https://wa.me/6282110103938"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0B6282] border border-slate-200 px-4 py-1.5 rounded-full hover:bg-slate-50 transition-colors"
                            >
                                <i className="bi bi-envelope"></i>
                                <span>Hubungi</span>
                            </a>
                        </div>
                    </div>

                    {/* Card 3: Salma Nurul Ajmal */}
                    <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md hover:shadow-xl transition-all text-center flex flex-col items-center space-y-4 group">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-slate-100 shadow-md group-hover:scale-105 transition-transform duration-300">
                            <img
                                src="/images/landing/team-salma.jpg"
                                alt="Salma Nurul Ajmal, S.Pd"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src = '/images/landing/avatar-sandhya.jpg';
                                }}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <span className="inline-block bg-rose-50 text-rose-700 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                                HUMAS & KEMITRAAN
                            </span>
                            <h3 className="text-base sm:text-lg font-black text-slate-900">
                                Salma Nurul Ajmal, S.Pd
                            </h3>
                            <p className="text-xs text-slate-500">
                                Staff Marketing dan Public Relation
                            </p>
                        </div>
                        <div className="pt-2">
                            <a
                                href="https://wa.me/6282110103938"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#0B6282] border border-slate-200 px-4 py-1.5 rounded-full hover:bg-slate-50 transition-colors"
                            >
                                <i className="bi bi-share"></i>
                                <span>Koneksi</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== 5. PUSAT LABORATORIUM & MAP EMBED ==================== */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        {/* Left Details */}
                        <div className="lg:col-span-5 space-y-4">
                            <div className="flex items-center gap-2">
                                <span className="bg-sky-50 text-sky-700 font-extrabold text-[10px] px-3 py-1 rounded-full uppercase">
                                    PUSAT LABORATORIUM
                                </span>
                                <span className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                                    <i className="bi bi-star-fill text-amber-400"></i>
                                    <span>5.0 (18 ulasan)</span>
                                </span>
                            </div>

                            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                                Artificial Intelligence Center Indonesia (AiCI)
                            </h3>

                            <p className="text-xs text-slate-500 leading-relaxed">
                                Gedung Lab. Riset Multidisiplin Pertamina FMIPA UI Lt. 4, Pondok Cina, Kecamatan Beji, Kota Depok, Jawa Barat 16424, Indonesia.
                            </p>

                            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs text-slate-600">
                                <p className="flex items-center gap-2">
                                    <i className="bi bi-clock-history text-[#0B6282]"></i>
                                    <span>Senin - Jumat: 08.00 - 17.00 WIB</span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <i className="bi bi-telephone text-[#0B6282]"></i>
                                    <span>0821-1010-3938 / (021) 786-3401</span>
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <a
                                    href="https://maps.google.com/?q=Artificial+Intelligence+Center+Indonesia+FMIPA+UI"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 bg-[#0B6282] hover:bg-[#08455c] text-white text-xs font-bold px-5 py-2.5 rounded-full transition-colors"
                                >
                                    <i className="bi bi-signpost-2"></i>
                                    <span>Petunjuk Arah</span>
                                </a>
                                <a
                                    href="https://wa.me/6282110103938?text=Halo%20AiCI%20FMIPA%20UI,%20kami%20ingin%20jadwalkan%20kunjungan"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold px-5 py-2.5 rounded-full border border-slate-200 transition-colors"
                                >
                                    <i className="bi bi-calendar-event"></i>
                                    <span>Jadwalkan Kunjungan</span>
                                </a>
                            </div>
                        </div>

                        {/* Right: Map view */}
                        <div className="lg:col-span-7 h-72 sm:h-80 rounded-2xl overflow-hidden shadow-inner border border-slate-200 relative">
                            <iframe
                                title="Peta Lokasi AiCI FMIPA UI"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.2155797664426!2d106.82522737503889!3d-6.366162993623999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ec100aa7ec6d%3A0x6b4fb6c956dc8155!2sGedung%20Lab%20Riset%20Multidisiplin%20FMIPA%20UI!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={false}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="w-full h-full grayscale-[0.1]"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== 6. CTA BANNER KOLABORASI ==================== */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <div className="bg-[#0B6282] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                        <div className="space-y-4 max-w-2xl">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-200 block">
                                PELUANG KOLABORASI
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                                Ingin Bekerja Sama atau Mengembangkan Program AI Bersama AiCI?
                            </h2>
                            <p className="text-cyan-50/90 text-xs sm:text-sm leading-relaxed">
                                Kami membuka kemitraan kurikulum sekolah, pelatihan guru daerah, riset algoritma AI bersama institusi, serta implementasi kecerdasan buatan untuk korporasi dan industri.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 shrink-0">
                            <a
                                href="https://wa.me/6282110103938"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-[#E62C29] hover:bg-[#d02522] text-white text-xs font-bold px-7 py-3 rounded-full shadow-md shadow-red-950/20 hover:shadow-lg transition-all"
                            >
                                <i className="bi bi-chat-fill"></i>
                                <span>Hubungi Kami</span>
                            </a>
                            <a
                                href="#unduh-profil"
                                onClick={(e) => {
                                    e.preventDefault();
                                    alert('Company profile AiCI FMIPA UI dapat diminta via WhatsApp tim humas.');
                                }}
                                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-6 py-3 rounded-full border border-white/25 transition-all"
                            >
                                <i className="bi bi-download"></i>
                                <span>Unduh Company Profile</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Standard Institutional Public Footer */}
            <PublicFooter />
        </div>
    );
}
