import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import PublicNavbar from '@/Components/PublicNavbar';
import PublicFooter from '@/Components/PublicFooter';

export default function Landing() {
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    const metrics = [
        { value: '06', label: 'Ruang Lab Riset & AI', desc: 'Fasilitas komputasi & robotika modern di FMIPA UI' },
        { value: '1.200+', label: 'Peserta & Pendidik Terlatih', desc: 'Mencakup siswa SD-SMA hingga dosen perguruan tinggi' },
        { value: '04', label: 'Jenjang Edukasi Terstruktur', desc: 'Kurikulum bertingkat dari literasi dasar hingga deep tech' },
        { value: '100%', label: 'Hands-on Learning', desc: 'Praktik langsung kit robotik, sensor, & model cerdas' },
    ];

    const programs = [
        {
            code: 'PROG-01',
            category: 'K-12 Education',
            title: 'Fun Learning With AI (SD, SMP, & SMA)',
            desc: 'Kurikulum pengenalan konsep kecerdasan artifisial, logika komputasi, dan robotika interaktif yang disesuaikan dengan usia tumbuh kembang peserta didik.',
            badge: 'Usia 7 - 18 Tahun',
            link: '/program',
        },
        {
            code: 'PROG-02',
            category: 'Teacher Training',
            title: 'AI For Education (Guru & Dosen)',
            desc: 'Pelatihan intensif integrasi AI generatif, otomasi asesmen, dan media pedagogi berbasis teknologi untuk memperkuat kapasitas tenaga pendidik di era digital.',
            badge: 'Sertifikasi Pendidik',
            link: '/program',
        },
        {
            code: 'PROG-03',
            category: 'One-Day Workshop',
            title: 'AI Day & Edu Fair',
            desc: 'Eksplorasi satu hari penuh perakitan robotik, live-demo computer vision, dan pengenalan inovasi teknologi mutakhir untuk menumbuhkan minat riset generasi muda.',
            badge: 'Workshop Terbuka',
            link: '/program',
        },
        {
            code: 'PROG-04',
            category: 'Kampus Merdeka',
            title: 'Preparing AI Talents (Studi Independen)',
            desc: 'Program kemitraan MSIB bersama Departemen Fisika FMIPA UI dan praktisi industri untuk membina talenta masa depan machine learning dan implementasi robotika terapan.',
            badge: 'Mahasiswa / MSIB',
            link: '/program',
        },
        {
            code: 'PROG-05',
            category: 'Institutional',
            title: 'AI for Healthcare & Digital Innovation',
            desc: 'Pelatihan dan riset kolaboratif pemanfaatan AI dalam simulasi klinik medis, otomasi data analitik, serta transformasi digital bagi organisasi dan industri.',
            badge: 'Kemitraan Industri',
            link: '/program',
        },
    ];

    const testimonials = [
        {
            name: 'Kahfi',
            role: 'Siswa Sekolah Dasar',
            school: 'Peserta Fun Learning AI',
            quote: 'Belajar merakit robot dan melatih komputer ternyata seru sekali! Tidak membosankan karena kita langsung praktik di lab bersama kakak tutor.',
            image: '/images/landing/avatar-kahfi.jpg',
        },
        {
            name: 'Sachio',
            role: 'Siswa Sekolah Menengah Pertama',
            school: 'Peserta AI Robotics Camp',
            quote: 'Teknologi AI dan robotika adalah masa depan kita. Di AiCI kami diajarkan bukan cuma pakai aplikasi, tapi mengerti bagaimana cara sistem berpikir.',
            image: '/images/landing/avatar-sachio.jpg',
        },
        {
            name: 'Aulia',
            role: 'Siswi Sekolah Menengah Atas',
            school: 'Peserta Program AI Talent',
            quote: 'Program di FMIPA UI ini membuka wawasan saya tentang riset computer vision dan machine learning sebelum saya memutuskan jurusan kuliah nanti.',
            image: '/images/landing/avatar-aulia.jpg',
        },
        {
            name: 'Sandhya',
            role: 'Siswa Sekolah Dasar',
            school: 'Peserta Coding & Robotics',
            quote: 'Keren banget, robotnya bisa bergerak mengikuti perintah kode yang saya buat sendiri! Fasilitas labnya sangat lengkap.',
            image: '/images/landing/avatar-sandhya.jpg',
        },
    ];

    const labFacilities = [
        { title: 'Laboratorium Robotika & Humanoid', desc: 'Pusat pengujian robot humanoid otonom, kendali servomotor presisi, dan antarmuka sensorik.' },
        { title: 'Laboratorium Computer Vision', desc: 'Workstation komputasi grafis tinggi untuk pelatihan deteksi objek, gesture recognition, dan citra medis.' },
        { title: 'Laboratorium AI Literacy (K-12)', desc: 'Ruang kelas interaktif dilengkapi modul kit STEAM modular untuk eksplorasi pemula hingga mahir.' },
        { title: 'Studio Deep Learning & Komputasi', desc: 'Infrastruktur pemodelan machine learning, natural language processing, dan eksperimen big data.' },
        { title: 'IoT & Microcontroller Station', desc: 'Area fabrikasi sensor pintar, perakitan mikrokontroler ESP32/Raspberry Pi, dan otomasi embedded.' },
        { title: 'Smart Seminar & Demonstration Hall', desc: 'Auditorium presentasi hasil riset, pameran inovasi proyek, dan simposium edukasi AI.' },
    ];

    return (
        <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-[#0B6282] selection:text-white">
            <Head title="Artificial Intelligence Center Indonesia - FMIPA Universitas Indonesia" />

            {/* Persistent Standard Institutional Navbar */}
            <PublicNavbar active="home" />

            {/* ============================================================== */}
            {/* HERO SECTION: Prestige Academic Editorial */}
            {/* ============================================================== */}
            <section className="relative bg-[#0B6282] text-white pt-12 pb-24 md:pt-16 md:pb-28 overflow-hidden border-b border-[#08455c]">
                {/* Subtle Technical Grid Lines */}
                <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                    }}
                ></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                        {/* Left Column: Academic Title & Credibility */}
                        <div className="lg:col-span-7 space-y-6">
                            {/* Academic Hierarchy Badge */}
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#08455c]/90 border border-white/20 text-xs text-cyan-100">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                <span className="text-[11px] uppercase tracking-wider text-cyan-200 font-semibold">
                                    FMIPA Universitas Indonesia × UMG IdeaLab
                                </span>
                            </div>

                            {/* Main Title */}
                            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold tracking-tight text-white leading-[1.15]">
                                Pusat Unggulan <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-white to-cyan-100">
                                    Kecerdasan Artifisial
                                </span> <br />
                                & Robotika Indonesia.
                            </h1>

                            {/* Subtitle / Paragraph */}
                            <p className="text-base sm:text-lg text-cyan-50/90 leading-relaxed max-w-2xl font-normal">
                                Lembaga riset terapan dan pengembangan sumber daya manusia berbasis sains teknologi. Membina generasi Indonesia dari literasi K-12 hingga kompetensi rekayasa AI tingkat lanjut.
                            </p>

                            {/* CTA Action Matrix */}
                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                <Link
                                    href="/program"
                                    className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-bold bg-[#E62C29] hover:bg-[#d02522] text-white shadow-lg shadow-red-950/20 border border-transparent transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <span>Jelajahi Program & Pelatihan</span>
                                    <i className="bi bi-arrow-right text-base"></i>
                                </Link>

                                <Link
                                    href="/fasilitas"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-sm font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/25 transition-all backdrop-blur-sm"
                                >
                                    <i className="bi bi-building text-cyan-200"></i>
                                    <span>Lihat 6 Lab Riset</span>
                                </Link>
                            </div>

                            {/* Institutional Trust Footprint */}
                            <div className="pt-4 flex items-center gap-6 text-xs text-cyan-100/90">
                                <div className="flex items-center gap-2">
                                    <i className="bi bi-geo-alt-fill text-[#E62C29]"></i>
                                    <span>Depok Campus, Jawa Barat</span>
                                </div>
                                <span className="text-cyan-300/40">•</span>
                                <div className="flex items-center gap-2">
                                    <i className="bi bi-shield-check text-emerald-400"></i>
                                    <span>Kurikulum Standar FMIPA UI</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Lab Photograph with Technical Metadata Overlay */}
                        <div className="lg:col-span-5">
                            <div className="relative mx-auto max-w-md lg:max-w-none">
                                {/* Ambient Backdrop Glow */}
                                <div className="absolute -inset-1.5 bg-gradient-to-tr from-cyan-400/20 to-red-500/20 rounded-[2rem] blur-xl opacity-75"></div>

                                <div className="relative rounded-[1.8rem] overflow-hidden bg-[#08455c] border border-white/20 shadow-2xl">
                                    <div className="aspect-[4/3] sm:aspect-[16/12] relative">
                                        <img
                                            src="/images/landing/kids-coding.jpg"
                                            alt="Pembelajaran Robotika & AI di Laboratorium AiCI"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#08455c] via-black/20 to-transparent"></div>

                                        {/* Top Badge: Status */}
                                        <div className="absolute top-4 left-4 bg-[#08455c]/90 backdrop-blur-md border border-white/20 rounded-lg px-3 py-1.5 flex items-center gap-2 text-[11px] font-semibold text-cyan-100">
                                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                            <span>ACTIVE SESSION</span>
                                        </div>
                                    </div>

                                    {/* Bottom Information Card */}
                                    <div className="p-5 bg-[#08455c] border-t border-white/10 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs uppercase tracking-wider text-cyan-200 font-bold">
                                                Fasilitas Multidisiplin
                                            </span>
                                            <span className="text-[10px] text-cyan-200/80 font-medium">
                                                Gedung Lab. Lt. 4
                                            </span>
                                        </div>
                                        <div className="text-sm font-bold text-white leading-snug">
                                            Laboratorium Hands-on AI & Robotika Cerdas
                                        </div>
                                        <p className="text-xs text-cyan-100/80 leading-relaxed font-normal">
                                            Dilengkapi 6 ruang laboratorium riset terintegrasi, unit robot humanoid, serta komputer komputasi tinggi.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================== */}
            {/* STATS & METRICS BAR */}
            {/* ============================================================== */}
            <section className="bg-[#08455c] border-b border-[#062d3d]/50 py-8 text-white relative z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {metrics.map((item, idx) => (
                            <div key={idx} className="border-l-2 border-cyan-400/40 pl-4 py-1">
                                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                                    {item.value}
                                </div>
                                <div className="text-xs sm:text-sm font-bold text-cyan-200 mt-1">
                                    {item.label}
                                </div>
                                <div className="text-[11px] text-cyan-100/70 mt-0.5 leading-snug">
                                    {item.desc}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================================== */}
            {/* 2. PROGRAM UNGGULAN AICI (Academic Modular Grid) */}
            {/* ============================================================== */}
            <section id="program" className="py-20 bg-slate-50 border-b border-slate-200/80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#0B6282] font-bold mb-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#0B6282]"></span>
                                KURIKULUM & PENGEMBANGAN SDM
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                                Program Pelatihan & Riset Terapan
                            </h2>
                        </div>
                        <p className="text-sm text-slate-600 max-w-md leading-relaxed">
                            Jalur pembelajaran komprehensif mulai dari pengenalan awal hingga penerapan rekayasa kecerdasan artifisial profesional.
                        </p>
                    </div>

                    {/* Program Cards Matrix */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {programs.map((prog, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-[#0B6282]/50 transition-all flex flex-col justify-between group"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs font-bold text-[#0B6282] bg-cyan-50 px-2.5 py-1 rounded-md border border-cyan-200/70">
                                            {prog.code}
                                        </span>
                                        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                                            {prog.badge}
                                        </span>
                                    </div>
                                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                        {prog.category}
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-3 group-hover:text-[#0B6282] transition-colors">
                                        {prog.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                        {prog.desc}
                                    </p>
                                </div>

                                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                                    <Link
                                        href={prog.link}
                                        className="text-xs font-bold text-[#0B6282] hover:text-[#08455c] inline-flex items-center gap-1.5 transition-colors"
                                    >
                                        <span>Rincian Kurikulum & Jadwal</span>
                                        <i className="bi bi-arrow-right text-[11px]"></i>
                                    </Link>
                                    <span className="text-slate-300 group-hover:translate-x-1 transition-transform">
                                        <i className="bi bi-chevron-right text-xs"></i>
                                    </span>
                                </div>
                            </div>
                        ))}

                        {/* Action Card: Custom Consultation & Partnership */}
                        <div className="bg-[#0B6282] text-white rounded-2xl p-6 border border-[#08455c] shadow-sm flex flex-col justify-between">
                            <div>
                                <div className="w-10 h-10 rounded-full bg-[#E62C29] text-white flex items-center justify-center text-lg mb-4 shadow-sm">
                                    <i className="bi bi-briefcase-fill"></i>
                                </div>
                                <span className="text-[11px] font-semibold text-cyan-200 uppercase tracking-wider">
                                    Kolaborasi Institusi
                                </span>
                                <h3 className="text-lg font-bold text-white mt-1 mb-3">
                                    Kemitraan Sekolah & Korporasi
                                </h3>
                                <p className="text-xs text-cyan-50/90 leading-relaxed">
                                    Kami melayani perancangan kurikulum robotika sekolah, pelatihan in-house perusahaan, serta riset bersama berbasis kebutuhan nyata.
                                </p>
                            </div>

                            <div className="pt-6 mt-6 border-t border-white/15">
                                <Link
                                    href="/kontak"
                                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold bg-[#E62C29] text-white hover:bg-[#d02522] transition-colors shadow-sm"
                                >
                                    <span>Konsultasi Kerja Sama</span>
                                    <i className="bi bi-arrow-right"></i>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================== */}
            {/* 3. VIDEO SHOWCASE & VIRTUAL TOUR */}
            {/* ============================================================== */}
            <section className="py-20 bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                        {/* Video Player Box (7 cols) */}
                        <div className="lg:col-span-7">
                            <div className="bg-slate-950 rounded-2xl overflow-hidden shadow-xl border border-slate-800 relative">
                                <div className="aspect-[16/9] relative">
                                    {isVideoPlaying ? (
                                        <iframe
                                            className="w-full h-full"
                                            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                                            title="Profil AiCI FMIPA UI"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    ) : (
                                        <>
                                            <img
                                                src="/images/landing/seminar-auditorium.jpg"
                                                alt="AiCI Auditorium & Lab Preview"
                                                className="w-full h-full object-cover opacity-80"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

                                            {/* Play Button */}
                                            <button
                                                type="button"
                                                onClick={() => setIsVideoPlaying(true)}
                                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-2xl hover:scale-105 transition-all cursor-pointer group"
                                                aria-label="Putar Video Profil"
                                            >
                                                <i className="bi bi-play-fill text-3xl sm:text-4xl translate-x-0.5"></i>
                                            </button>

                                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                                <div className="text-[11px] font-semibold text-cyan-300 uppercase tracking-wider">
                                                    VIDEO PROFIL RESMI
                                                </div>
                                                <div className="text-sm sm:text-base font-bold">
                                                    Pengenalan Laboratorium & Ekosistem Riset AiCI FMIPA UI
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Interactive Tour & Institutional Credentials (5 cols) */}
                        <div className="lg:col-span-5 space-y-6">
                            <div>
                                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#0B6282] font-bold mb-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#0B6282]"></span>
                                    FASILITAS KAMPUS DEPOK
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                                    Eksplorasi Lingkungan Riset & Pembelajaran Langsung
                                </h2>
                            </div>

                            <p className="text-sm text-slate-600 leading-relaxed">
                                Bertempat di Gedung Laboratorium Riset Multidisiplin Pertamina FMIPA UI Lantai 4, seluruh aktivitas riset dan pelatihan didukung infrastruktur komputasi mutakhir, kit modul bersertifikasi, serta tutor berpengalaman.
                            </p>

                            {/* Virtual Tour Card */}
                            <a
                                href="https://maps.google.com"
                                target="_blank"
                                rel="noreferrer"
                                className="block p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#0B6282]/60 hover:bg-cyan-50/30 transition-all group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-[#0B6282] text-white flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                                        <i className="bi bi-compass-fill"></i>
                                    </div>
                                    <div>
                                        <div className="text-xs text-[#0B6282] uppercase font-bold">
                                            Virtual Tour 360°
                                        </div>
                                        <div className="text-sm font-bold text-slate-900">
                                            Jelajahi Lab & Ruang Kelas Secara Virtual
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            Tinjau denah lab dan ruang robotika dari browser Anda
                                        </div>
                                    </div>
                                </div>
                            </a>

                            {/* Partnership Endorsement */}
                            <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs text-slate-600">
                                <div className="flex items-center gap-3">
                                    <span className="font-extrabold text-amber-500 tracking-tight text-sm">UMG IDEALAB</span>
                                    <span className="text-slate-300">|</span>
                                    <span className="font-bold text-slate-800">FMIPA UI</span>
                                </div>
                                <span className="text-[11px] text-[#0B6282] font-semibold">Kemitraan Strategis</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================== */}
            {/* 4. FASILITAS LABORATORIUM (6 Ruang Riset & Pendidikan) */}
            {/* ============================================================== */}
            <section id="fasilitas" className="py-20 bg-[#0B6282] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
                        <div className="lg:col-span-7 space-y-4">
                            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-cyan-200 font-bold">
                                <span className="w-2 h-2 rounded-full bg-cyan-300"></span>
                                INFRASTRUKTUR SAINS & TEKNOLOGI
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                                6 Ruang Laboratorium Terpadu <br />
                                Berstandar Universitas Indonesia
                            </h2>
                            <p className="text-sm sm:text-base text-cyan-50/90 max-w-2xl leading-relaxed">
                                Untuk mendukung seluruh siklus riset dan pelatihan, AiCI menyediakan 6 ruang lab tematik lengkap dengan kit robotika, workstation komputasi GPU, dan ruang kolaborasi terbuka.
                            </p>
                        </div>
                        <div className="lg:col-span-5 flex lg:justify-end">
                            <Link
                                href="/fasilitas"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#E62C29] hover:bg-[#d02522] border border-transparent text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-red-950/20"
                            >
                                <span>Lihat Rincian Spesifikasi Fasilitas</span>
                                <i className="bi bi-arrow-right"></i>
                            </Link>
                        </div>
                    </div>

                    {/* 6 Lab Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {labFacilities.map((lab, idx) => (
                            <div
                                key={idx}
                                className="bg-[#08455c] border border-white/10 rounded-2xl p-6 hover:border-cyan-400/40 transition-all flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs text-cyan-200 font-bold">LAB-0{idx + 1}</span>
                                        <i className="bi bi-cpu text-cyan-300"></i>
                                    </div>
                                    <h3 className="text-base font-bold text-white mb-2 leading-snug">
                                        {lab.title}
                                    </h3>
                                    <p className="text-xs text-cyan-100/80 leading-relaxed">
                                        {lab.desc}
                                    </p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-cyan-200">
                                    <span>Gedung Riset Lt. 4</span>
                                    <span className="text-emerald-400 font-medium">Siap Operasional</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================================== */}
            {/* 5. TESTIMONIALS (Peserta Pelatihan & Orang Tua) */}
            {/* ============================================================== */}
            <section id="testimoni" className="py-20 bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#0B6282] font-bold mb-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0B6282]"></span>
                            PENGALAMAN & ULASAN PESERTA
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B6282] tracking-tight">
                            Apa Kata Peserta Didik Kami?
                        </h2>
                        <p className="text-sm text-slate-500 mt-2">
                            Kesan nyata dari generasi muda setelah mengikuti sesi pembelajaran interaktif di AiCI FMIPA UI.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {testimonials.map((item, idx) => (
                            <div
                                key={idx}
                                className="bg-[#EDF2F7] rounded-2xl p-6 border border-slate-200 flex flex-col justify-between hover:shadow-md transition-all"
                            >
                                <div>
                                    <div className="flex items-center gap-3.5 mb-4">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                                        />
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                                            <div className="text-[11px] font-semibold text-[#0B6282]">{item.role}</div>
                                            <div className="text-[10px] text-slate-500">{item.school}</div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-600 italic leading-relaxed">
                                        {item.quote}
                                    </p>
                                </div>

                                <div className="mt-6 pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-400">
                                    <div className="flex text-amber-400 gap-0.5">
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star-fill"></i>
                                        <i className="bi bi-star-fill"></i>
                                    </div>
                                    <span>Verified Student</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================================== */}
            {/* 6. MITRA & JARINGAN KOLABORASI */}
            {/* ============================================================== */}
            <section id="mitra" className="py-14 bg-[#08455c] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="text-xs font-bold tracking-[0.2em] uppercase text-cyan-200 mb-8">
                        Didukung & Berkolaborasi Bersama Institusi Terkemuka
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6 items-center">
                        <div className="bg-[#062d3d]/60 border border-white/10 rounded-xl py-4 px-3 text-center">
                            <span className="font-extrabold text-sm text-slate-200 tracking-wider">FMIPA UI</span>
                        </div>
                        <div className="bg-[#062d3d]/60 border border-white/10 rounded-xl py-4 px-3 text-center">
                            <span className="font-bold text-sm text-amber-400 tracking-wider">UMG IDEALAB</span>
                        </div>
                        <div className="bg-[#062d3d]/60 border border-white/10 rounded-xl py-4 px-3 text-center">
                            <span className="font-bold text-sm text-cyan-300 tracking-tight">bahasakita</span>
                        </div>
                        <div className="bg-[#062d3d]/60 border border-white/10 rounded-xl py-4 px-3 text-center">
                            <span className="font-bold text-sm text-sky-400 tracking-tight">Helbér</span>
                        </div>
                        <div className="bg-[#062d3d]/60 border border-white/10 rounded-xl py-4 px-3 text-center">
                            <span className="font-extrabold text-sm text-red-400 tracking-wider">IMAJIN</span>
                        </div>
                        <div className="bg-[#062d3d]/60 border border-white/10 rounded-xl py-4 px-3 text-center">
                            <span className="font-bold text-xs text-sky-300 uppercase tracking-wider">KOMINFO</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================== */}
            {/* 7. LOKASI MAPS & KUNJUNGAN KAMPUS */}
            {/* ============================================================== */}
            <section className="py-20 bg-[#EDF2F7]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-12">
                            {/* Left Info (5 cols) */}
                            <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between">
                                <div>
                                    <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#0B6282] font-bold mb-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[#0B6282]"></span>
                                        LOKASI PUSAT RISET
                                    </div>
                                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
                                        Kunjungi Laboratorium Kami di Kampus UI Depok
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                                        Gedung Lab. Riset Multidisiplin Pertamina FMIPA Universitas Indonesia Lantai 4, Pondok Cina, Beji, Kota Depok, Jawa Barat 16424.
                                    </p>

                                    <div className="space-y-3 text-xs text-slate-600 pb-6 border-b border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <i className="bi bi-clock text-[#0B6282]"></i>
                                            <span>Operasional: Senin - Jumat (08:00 - 17:00 WIB)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <i className="bi bi-star-fill text-amber-500"></i>
                                            <span className="font-bold text-slate-800">5.0 / 5.0</span>
                                            <span className="text-slate-400 font-sans">(18 ulasan Google Maps)</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 flex flex-wrap items-center gap-3">
                                    <a
                                        href="https://maps.google.com/?q=Gedung+Lab+Riset+Multidisiplin+Pertamina+FMIPA+UI"
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#E62C29] hover:bg-[#d02522] text-white text-xs font-bold transition-all shadow-md shadow-red-950/20"
                                    >
                                        <i className="bi bi-geo-alt-fill text-white"></i>
                                        <span>Buka di Google Maps</span>
                                    </a>
                                    <Link
                                        href="/kontak"
                                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all"
                                    >
                                        <span>Petunjuk Arah & Kontak</span>
                                    </Link>
                                </div>
                            </div>

                            {/* Right Map Embed (7 cols) */}
                            <div className="lg:col-span-7 min-h-[360px] bg-slate-200 relative">
                                <iframe
                                    title="Peta Lokasi AiCI FMIPA UI"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.2155797664426!2d106.82522737503889!3d-6.366162993623999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ec100aa7ec6d%3A0x6b4fb6c956dc8155!2sGedung%20Lab%20Riset%20Multidisiplin%20FMIPA%20UI!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen={false}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    className="w-full h-full min-h-[360px]"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Persistent Standard Institutional Footer */}
            <PublicFooter />
        </div>
    );
}


