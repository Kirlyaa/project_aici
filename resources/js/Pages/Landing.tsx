import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Landing() {
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);

    const programs = [
        {
            title: "Fun Learning With AI Untuk Siswa SD/MI, SMP/MTs Dan SMA/MA/SMK",
            desc: "Kegiatan belajar yang diselenggarakan oleh AiCI bertujuan untuk memperkenalkan dan meningkatkan pengetahuan serta keterampilan peserta didik dalam bidang Artificial Intelligence ...",
            linkText: "Lihat Kurikulum",
            linkHref: "#",
            accentColor: "bg-amber-500",
        },
        {
            title: "AI For Education",
            desc: "Kegiatan pelatihan implementasi AI dalam bidang pendidikan untuk Guru dan Dosen. Bertujuan untuk meningkatkan pengetahuan, keterampilan, serta melatih kemampuan guru dan dosen dalam mengembangkan pembelajaran artificial intelligence ...",
            linkText: "Lihat Kurikulum",
            linkHref: "#",
            accentColor: "bg-amber-500",
        },
        {
            title: "AI Day",
            desc: "AI Day merupakan sebuah kegiatan yang dilaksanakan selama satu hari dengan tujuan untuk menumbuhkan minat, pengetahuan, dan keterampilan peserta didik dalam bidang artificial intelligence dengan cara yang menyenangkan (fun learning) ...",
            linkText: "Lihat Jadwal",
            linkHref: "#",
            accentColor: "bg-amber-500",
        },
        {
            title: "AI Edu Fair",
            desc: "Sebuah kegiatan yang dilaksanakan selama satu hari dengan tujuan untuk menumbuhkan rasa ingin tahu, pengetahuan, dan keterampilan peserta didik dalam bidang artificial intelligence. Selain itu, pada kegiatan ini dikembangkan juga beberapa soft skills ...",
            linkText: "Pelajari Pameran",
            linkHref: "#",
            accentColor: "bg-amber-500",
        },
        {
            title: "Preparing Artificial Intelligence (AI) Talents",
            desc: "Merupakan program PT Artifisial Intelegensia Indonesia (AiCI) bekerjasama dengan Departemen Fisika FMIPA UI dan beberapa praktisi dalam lingkungan kerja start-up dan industri dalam bentuk Studi Independen Bersertifikat Kampus Merdeka ...",
            linkText: "Mitra Kampus Merdeka",
            linkHref: "#",
            accentColor: "bg-amber-500",
        },
    ];

    const testimonials = [
        {
            name: "Kahfi",
            role: "SISWA SD",
            quote: "“Cool!”",
            image: "/images/landing/avatar-kahfi.jpg",
        },
        {
            name: "Sachio",
            role: "SISWA SMP",
            quote: "“Hi Tech, robots and AI are our future, because now technology is increasingly being used”",
            image: "/images/landing/avatar-sachio.jpg",
        },
        {
            name: "Aulia",
            role: "SISWA SMA",
            quote: "“The problem is that the world in the future will also be more sophisticated than now, there will definitely be many more”",
            image: "/images/landing/avatar-aulia.jpg",
        },
        {
            name: "Sandhya",
            role: "SISWA SD",
            quote: "“Cool, That's Clever!”",
            image: "/images/landing/avatar-sandhya.jpg",
        },
    ];

    const partners = [
        {
            name: "bahasakita",
            logo: (
                <span className="text-xl md:text-2xl font-bold tracking-tight text-[#088395] font-sans">
                    bahasakita
                </span>
            ),
        },
        {
            name: "Helbér",
            logo: (
                <span className="text-xl md:text-2xl font-bold tracking-tight text-[#0284c7] font-sans">
                    Helbér
                </span>
            ),
        },
        {
            name: "IMAJIN",
            logo: (
                <span className="text-xl md:text-2xl font-extrabold tracking-widest text-[#1e293b] font-sans">
                    IMAJIN
                </span>
            ),
        },
        {
            name: "KOMINFO",
            logo: (
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#0284c7] flex items-center justify-center text-white text-xs font-bold">
                        <i className="bi bi-broadcast" />
                    </div>
                    <span className="text-base md:text-lg font-bold tracking-wider text-[#0f172a]">
                        KOMINFO
                    </span>
                </div>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-[#088395] selection:text-white">
            <Head title="Artificial Intelligence Center Indonesia (AiCI)" />

            {/* ============================================================== */}
            {/* Top Minimal Navigation Bar */}
            {/* ============================================================== */}
            <nav className="bg-[#034d52] border-b border-teal-800/60 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="bg-white/95 backdrop-blur-sm p-1.5 px-3 rounded-xl shadow-sm">
                                <img
                                    src="/images/logo-aici.png"
                                    alt="AiCI Logo"
                                    className="h-9 w-auto object-contain"
                                />
                            </div>
                        </Link>

                        <div className="hidden md:flex items-center gap-7 text-sm font-semibold text-teal-100/90">
                            <Link href="/program" className="hover:text-white transition-colors">Program</Link>
                            <Link href="/profil" className="hover:text-white transition-colors">Profil</Link>
                            <Link href="/fasilitas" className="hover:text-white transition-colors">Fasilitas</Link>
                            <Link href="/galeri" className="hover:text-white transition-colors">Galeri</Link>
                            <Link href="/riset" className="hover:text-white transition-colors">Riset</Link>
                            <Link href="/kontak" className="hover:text-white transition-colors">Kontak</Link>
                            <a href="#testimoni" className="hover:text-white transition-colors">Testimoni</a>
                            <a href="#mitra" className="hover:text-white transition-colors">Mitra</a>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link
                                href="/login"
                                className="px-5 py-2 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all shadow-sm"
                            >
                                Masuk Portal
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* ============================================================== */}
            {/* 1. HERO SECTION (Teal Deep Teal Background with Angle Curve) */}
            {/* ============================================================== */}
            <section className="relative bg-[#034d52] text-white pt-8 pb-32 md:pb-40 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
                        {/* Left Column: Heading & Description */}
                        <div className="lg:col-span-6 space-y-6">
                            {/* Pill Badge */}
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0a5c61] border border-teal-500/30 text-xs font-medium text-teal-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                Kolaborasi FMIPA UI & UMG IdeaLab
                            </div>

                            {/* Main Title */}
                            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight leading-[1.15] text-white">
                                Artificial <br />
                                Intelligence <br />
                                Center Indonesia
                            </h1>

                            {/* Paragraph */}
                            <p className="text-sm sm:text-base text-teal-100/90 leading-relaxed max-w-xl font-normal">
                                Lembaga Yang Didirikan Atas Kerjasama FMIPA Universitas Indonesia Dengan UMG IdeaLab Indonesia Yang Berfokus Pada Pengembangan Sumber Daya Manusia Dalam Bidang Artificial Intelligence (Kecerdasan Artifisial).
                            </p>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-3.5 pt-2">
                                <a
                                    href="#program"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold bg-[#e53935] hover:bg-[#d32f2f] text-white shadow-lg shadow-red-900/30 transition-all hover:scale-[1.02]"
                                >
                                    JELAJAHI PROGRAM
                                    <i className="bi bi-arrow-right text-base"></i>
                                </a>
                                <a
                                    href="#fasilitas"
                                    className="inline-flex items-center justify-center px-6 py-3 rounded-full text-sm font-medium bg-[#05585e] hover:bg-[#07666e] text-teal-100 border border-teal-600/40 transition-all"
                                >
                                    Lihat Fasilitas Lab
                                </a>
                            </div>
                        </div>

                        {/* Right Column: Hero Card with Curved Outer Frame */}
                        <div className="lg:col-span-6 flex justify-center lg:justify-end">
                            <div className="relative p-2.5 sm:p-3 bg-white/20 backdrop-blur-md rounded-[2.2rem] shadow-2xl max-w-md lg:max-w-none w-full">
                                <div className="relative rounded-[1.8rem] overflow-hidden bg-slate-900 aspect-[4/3] sm:aspect-[16/11]">
                                    <img
                                        src="/images/landing/kids-coding.jpg"
                                        alt="Pembelajaran Robotika Anak"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                                    {/* Bottom Floating Card Inside Frame */}
                                    <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3.5 sm:p-4 rounded-xl bg-slate-900/85 backdrop-blur-md border border-white/10 text-white">
                                        <div className="text-[11px] sm:text-xs font-bold tracking-wider text-cyan-300 uppercase mb-1">
                                            HANDS-ON ROBOTIC & AI
                                        </div>
                                        <div className="text-xs sm:text-xs text-slate-300 leading-snug">
                                            Pembelajaran interaktif robot cerdas untuk generasi muda Indonesia
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Angular Diagonal Divider */}
                <div
                    className="absolute -bottom-1 left-0 right-0 h-16 sm:h-24 bg-white"
                    style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}
                ></div>
            </section>

            {/* ============================================================== */}
            {/* 2. PROGRAM UNGGULAN AICI SECTION */}
            {/* ============================================================== */}
            <section id="program" className="relative pt-6 pb-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <div className="inline-block px-4 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-[11px] font-bold tracking-wider text-cyan-700 uppercase mb-3">
                            KURIKULUM & AKTIVITAS
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0f172a] tracking-tight mb-3">
                            Program Unggulan AiCI
                        </h2>
                        <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                            Solusi komprehensif pembelajaran kecerdasan buatan dari usia sekolah hingga profesional di era transformasi teknologi.
                        </p>
                    </div>

                    {/* Cards Grid: 3 columns, 2 rows (5 program cards + 1 CTA card) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
                        {programs.map((item, idx) => (
                            <div
                                key={idx}
                                className="bg-[#034d52] text-white rounded-2xl p-7 flex flex-col justify-between shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-teal-800"
                            >
                                <div>
                                    {/* Orange Bar Accent */}
                                    <div className="w-8 h-1 rounded-full bg-amber-400 mb-6"></div>

                                    {/* Title */}
                                    <h3 className="text-lg sm:text-xl font-bold tracking-tight leading-snug mb-4 text-white">
                                        {item.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-xs sm:text-sm text-teal-100/80 leading-relaxed font-normal mb-6">
                                        {item.desc}
                                    </p>
                                </div>

                                {/* Link Footer */}
                                <div>
                                    <a
                                        href={item.linkHref}
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 hover:text-white transition-colors"
                                    >
                                        <span>{item.linkText}</span>
                                        <i className="bi bi-chevron-right text-[11px]"></i>
                                    </a>
                                </div>
                            </div>
                        ))}

                        {/* 6th Card: "Ingin Tahu Lebih Lanjut?" (Light Blue / Dashed border style) */}
                        <div className="bg-[#f0f9ff]/70 border-2 border-dashed border-[#b9e6fe] rounded-2xl p-7 flex flex-col justify-center items-center text-center shadow-sm">
                            {/* Lightning Icon Circle */}
                            <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4 text-xl">
                                <i className="bi bi-lightning-charge-fill"></i>
                            </div>

                            <h3 className="text-lg font-bold text-slate-800 mb-2">
                                Ingin Tahu Lebih Lanjut?
                            </h3>
                            <p className="text-xs text-slate-500 leading-relaxed mb-6 max-w-xs">
                                Pelajari rincian silabus lengkap, jadwal workshop berkala, dan paket kerja sama institusi Anda bersama AiCI.
                            </p>

                            <Link
                                href="/faq"
                                className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase bg-[#e53935] hover:bg-[#d32f2f] text-white shadow-md shadow-red-600/30 transition-all hover:scale-[1.02]"
                            >
                                DETAIL PROGRAM
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================== */}
            {/* 3. VIDEO PROFILE AICI SECTION */}
            {/* ============================================================== */}
            <section className="py-8 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Big Rounded Card Frame */}
                    <div className="bg-[#f8fafc] border border-slate-200/80 rounded-[2.5rem] p-5 sm:p-7 shadow-sm">
                        {/* Video Card Header */}
                        <div className="flex items-center justify-between mb-5 px-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#034d52] text-white font-bold flex items-center justify-center text-sm shadow-sm">
                                    Ai
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800">
                                        Video Profile AiCI
                                    </h4>
                                    <p className="text-xs text-slate-400">
                                        Artificial Intelligence Center Indonesia
                                    </p>
                                </div>
                            </div>
                            <div>
                                <a
                                    href="https://www.youtube.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    Watch on YouTube
                                </a>
                            </div>
                        </div>

                        {/* Video Thumbnail with Large Red Play Button */}
                        <div className="relative rounded-[2rem] overflow-hidden aspect-[16/9] bg-slate-900 shadow-inner group">
                            {isVideoPlaying ? (
                                <iframe
                                    className="w-full h-full"
                                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                                    title="AiCI Video Showcase"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            ) : (
                                <>
                                    <img
                                        src="/images/landing/seminar-auditorium.jpg"
                                        alt="AiCI Video Showcase"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>

                                    {/* Overlay Stage Graphic Text Mock */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="text-center text-white px-4">
                                            <div className="text-xs md:text-sm tracking-[0.3em] font-semibold text-cyan-300 uppercase mb-1">
                                                AiCI VIDEO SHOWCASE
                                            </div>
                                            <div className="text-lg md:text-2xl font-black tracking-tight text-white drop-shadow">
                                                ARTIFICIAL INTELLIGENCE CREATIVE INNOVATION
                                            </div>
                                            <div className="text-[10px] md:text-xs tracking-widest text-slate-300 mt-1">
                                                GLOBAL PREMIERE 2024
                                            </div>
                                        </div>
                                    </div>

                                    {/* Red Play Button */}
                                    <button
                                        type="button"
                                        onClick={() => setIsVideoPlaying(true)}
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#e53935] hover:bg-[#d32f2f] text-white flex items-center justify-center shadow-xl shadow-red-950/50 hover:scale-110 transition-transform cursor-pointer"
                                        aria-label="Putar Video Profile"
                                    >
                                        <i className="bi bi-play-fill text-3xl sm:text-4xl translate-x-0.5"></i>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================== */}
            {/* 4. SPLIT ROW: FMIPA UI & UMG BANNER + VIRTUAL TOUR */}
            {/* ============================================================== */}
            <section className="py-6 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                        {/* Left Card: UMG IDEALAB + FAKULTAS MIPA UI PARTNERSHIP */}
                        <div className="bg-white border border-slate-200/90 rounded-[2rem] p-7 flex items-center justify-center gap-6 sm:gap-10 shadow-sm">
                            {/* UMG Idealab */}
                            <div className="flex items-center gap-2">
                                <span className="text-xl sm:text-2xl font-black text-amber-500 tracking-tight">
                                    UMG
                                </span>
                                <span className="text-xs sm:text-sm font-bold tracking-wider text-slate-600">
                                    IDEALAB
                                </span>
                            </div>

                            {/* Thin vertical line divider */}
                            <div className="w-[1px] h-10 bg-slate-200"></div>

                            {/* UI FMIPA */}
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-amber-400 text-slate-900 font-bold flex items-center justify-center text-xs shadow-sm">
                                    UI
                                </div>
                                <div className="text-[11px] sm:text-xs font-extrabold uppercase leading-tight text-slate-800 tracking-wider">
                                    Fakultas Matematika dan<br />
                                    Ilmu Pengetahuan Alam
                                </div>
                            </div>
                        </div>

                        {/* Right Card: AiCI Virtual Tour 360 */}
                        <a
                            href="https://www.google.com/maps"
                            target="_blank"
                            rel="noreferrer"
                            className="relative rounded-[2rem] overflow-hidden p-6 flex flex-col justify-end text-white shadow-sm group min-h-[140px]"
                        >
                            <img
                                src="/images/landing/virtual-tour.jpg"
                                alt="Virtual Tour AiCI"
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/40"></div>

                            <div className="relative z-10">
                                <div className="inline-block px-2.5 py-0.5 rounded bg-[#e53935] text-[10px] font-bold tracking-wider uppercase mb-1.5 shadow-sm">
                                    INTERACTIVE 360°
                                </div>
                                <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">
                                    AiCI Virtual Tour
                                </h4>
                                <p className="text-xs text-slate-300 leading-snug">
                                    Jelajahi laboratorium dan ruang riset secara virtual dari browser Anda.
                                </p>
                            </div>
                        </a>
                    </div>
                </div>
            </section>

            {/* ============================================================== */}
            {/* 5. FASILITAS YANG DISEDIAKAN SECTION */}
            {/* ============================================================== */}
            <section id="fasilitas" className="py-16 md:py-20 bg-[#034d52] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
                        {/* Left Column: Heading & Info */}
                        <div className="lg:col-span-6 space-y-6">
                            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight text-white">
                                Fasilitas yang <br />
                                disediakan
                            </h2>

                            <p className="text-sm sm:text-base text-teal-100/85 leading-relaxed max-w-xl font-normal">
                                Untuk Mendukung Kegiatan Di AiCI, Tersedia Fasilitas-Fasilitas Berupa Ruangan, Lab AI Sebanyak 6 Ruang, Media Pembelajaran/ Pelatihan Berupa Kit Dan Robot, Modul Pembelajaran Tingkat SD/MI, SMP/MTs Dan SMA/MA/SMK Serta Perguruan Tinggi.
                            </p>

                            <div className="pt-2">
                                <a
                                    href="/faq"
                                    className="inline-flex items-center justify-center px-7 py-3 rounded-full text-xs font-bold tracking-wider uppercase bg-[#e53935] hover:bg-[#d32f2f] text-white shadow-lg shadow-red-900/30 transition-all hover:scale-[1.02]"
                                >
                                    SELENGKAPNYA
                                </a>
                            </div>
                        </div>

                        {/* Right Column: Lab Facility Image with Badge Frame */}
                        <div className="lg:col-span-6 flex justify-center lg:justify-end">
                            <div className="relative p-2.5 sm:p-3 bg-white/20 backdrop-blur-md rounded-[2.2rem] shadow-2xl max-w-md lg:max-w-none w-full">
                                <div className="relative rounded-[1.8rem] overflow-hidden aspect-[4/3] bg-slate-900">
                                    <img
                                        src="/images/landing/robotics-lab.jpg"
                                        alt="Fasilitas Lab Robotika dan AI"
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Red Floating Badge at Bottom-Right */}
                                    <div className="absolute -bottom-1 -right-1 sm:bottom-0 sm:right-0 bg-[#e53935] text-white px-5 py-2.5 rounded-tl-2xl rounded-br-[1.6rem] shadow-lg text-right">
                                        <div className="text-base sm:text-lg font-black leading-none">
                                            6 Ruang
                                        </div>
                                        <div className="text-[10px] font-bold tracking-wider uppercase text-red-100">
                                            LAB AI MODERN
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================== */}
            {/* 6. TESTIMONIALS SECTION */}
            {/* ============================================================== */}
            <section id="testimoni" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center max-w-xl mx-auto mb-14">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#034d52] tracking-tight mb-2">
                            Testimonials
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">
                            What Do They Think After Studying At AiCI?
                        </p>
                    </div>

                    {/* Testimonials 4-Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {testimonials.map((item, idx) => (
                            <div
                                key={idx}
                                className="bg-[#f8fafc] border border-slate-100 rounded-3xl p-6 text-center flex flex-col items-center justify-between shadow-sm hover:shadow-md transition-all duration-300"
                            >
                                <div className="flex flex-col items-center">
                                    {/* Avatar with rounded corners */}
                                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden mb-4 shadow-sm border-2 border-white">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Badge Role */}
                                    <div className="text-[11px] font-bold text-[#088395] tracking-wider uppercase mb-1">
                                        {item.role}
                                    </div>

                                    {/* Name */}
                                    <h4 className="text-base font-bold text-slate-800 mb-3">
                                        {item.name}
                                    </h4>
                                </div>

                                {/* Quote Text */}
                                <div className="mt-2">
                                    <p className="text-xs italic text-slate-500 leading-relaxed">
                                        {item.quote}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================================== */}
            {/* 7. DIDUKUNG & BERKOLABORASI BERSAMA (PARTNERS SECTION) */}
            {/* ============================================================== */}
            <section id="mitra" className="pt-12 pb-14 bg-[#034d52] text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-cyan-300 mb-8">
                        DIDUKUNG & BERKOLABORASI BERSAMA
                    </div>

                    {/* 4 White Partner Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {partners.map((partner, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-2xl h-20 sm:h-24 flex items-center justify-center px-4 shadow-md transition-all hover:scale-[1.02]"
                            >
                                {partner.logo}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================================== */}
            {/* 8. PETA KAMPUS & LOKASI MAP (UI DEPOK) */}
            {/* ============================================================== */}
            <section className="relative w-full h-[400px] sm:h-[480px] bg-slate-800 overflow-hidden">
                <img
                    src="/images/landing/map-campus-bg.jpg"
                    alt="Peta Kampus UI Depok AiCI"
                    className="w-full h-full object-cover"
                />

                {/* Subtle map overlay banner simulating the university campus map */}
                <div className="absolute inset-0 bg-slate-900/30"></div>

                {/* Floating Location Card Overlay (Left side) */}
                <div className="absolute top-8 left-4 sm:left-12 sm:top-12 max-w-sm sm:max-w-md w-[calc(100%-2rem)] sm:w-auto bg-white rounded-2xl p-5 sm:p-6 shadow-2xl border border-slate-100 z-10">
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-1.5 leading-snug">
                        Artificial Intelligence Center Indonesia (AiCI)
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed mb-3">
                        Gedung Lab. Riset Multidisiplin Pertamina FMIPA UI Lantai 4, Pondok Cina, Beji, Depok, Jawa Barat 16424
                    </p>

                    {/* Rating Stars */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold mb-4">
                        <span className="text-amber-500 font-bold">5.0</span>
                        <div className="flex text-amber-400 text-xs">
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                            <i className="bi bi-star-fill"></i>
                        </div>
                        <span className="text-slate-400 font-normal">(18 ulasan)</span>
                    </div>

                    <a
                        href="https://maps.google.com/?q=Gedung+Lab+Riset+Multidisiplin+Pertamina+FMIPA+UI"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#088395] hover:text-[#034d52] transition-colors"
                    >
                        <span>Buka di Google Maps</span>
                        <i className="bi bi-arrow-right text-xs"></i>
                    </a>
                </div>
            </section>

            {/* ============================================================== */}
            {/* 9. FOOTER SECTION (Deep Teal Dark Background) */}
            {/* ============================================================== */}
            <footer className="bg-[#023136] text-slate-300 pt-16 pb-10 border-t border-teal-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-teal-900/60">
                        {/* Col 1: AiCI Logo & Address (Span 4) */}
                        <div className="lg:col-span-4 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#088395] text-white font-bold flex items-center justify-center text-sm shadow-md">
                                    Ai
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-white tracking-tight leading-none">
                                        AiCI
                                    </div>
                                    <div className="text-[9px] font-semibold tracking-wider text-teal-300 uppercase mt-0.5">
                                        ARTIFICIAL INTELLIGENCE CENTER INDONESIA
                                    </div>
                                </div>
                            </div>

                            <p className="text-xs text-teal-100/70 leading-relaxed pr-4">
                                Gd. Laboratorium Riset Multidisiplin Pertamina FMIPA UI Lt. 4, Universitas Indonesia Depok, Jawa Barat 16424
                            </p>

                            <div className="text-xs text-teal-100/70">
                                Phone:{" "}
                                <a
                                    href="tel:082110103938"
                                    className="text-cyan-300 font-semibold hover:underline"
                                >
                                    0821-1010-3938
                                </a>
                            </div>
                        </div>

                        {/* Col 2: PAGES (Span 2) */}
                        <div className="lg:col-span-2 space-y-3">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                                PAGES
                            </h4>
                            <ul className="space-y-2 text-xs text-teal-100/70">
                                <li>
                                    <a href="#" className="hover:text-white transition-colors">
                                        Profil
                                    </a>
                                </li>
                                <li>
                                    <a href="#fasilitas" className="hover:text-white transition-colors">
                                        Fasilitas
                                    </a>
                                </li>
                                <li>
                                    <a href="#program" className="hover:text-white transition-colors">
                                        Program
                                    </a>
                                </li>
                                <li>
                                    <a href="/faq" className="hover:text-white transition-colors">
                                        Kontak
                                    </a>
                                </li>

                            </ul>
                        </div>

                        {/* Col 3: DOWNLOAD & PROGRAM (Span 3) */}
                        <div className="lg:col-span-3 space-y-3">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                                DOWNLOAD & PROGRAM
                            </h4>
                            <ul className="space-y-2 text-xs text-teal-100/70">
                                <li>
                                    <a href="#program" className="hover:text-white transition-colors">
                                        Fun Learning
                                    </a>
                                </li>
                                <li>
                                    <a href="#program" className="hover:text-white transition-colors">
                                        Workshop Prompt Engineer
                                    </a>
                                </li>
                                <li>
                                    <a href="#program" className="hover:text-white transition-colors">
                                        Extracurricular AI and Robotic
                                    </a>
                                </li>
                                <li>
                                    <a href="#program" className="hover:text-white transition-colors">
                                        AI for Education
                                    </a>
                                </li>
                                <li>
                                    <a href="#program" className="hover:text-white transition-colors">
                                        AI Day
                                    </a>
                                </li>
                                <li>
                                    <a href="#program" className="hover:text-white transition-colors">
                                        AI Edu Fair
                                    </a>
                                </li>
                                <li>
                                    <a href="#program" className="hover:text-white transition-colors">
                                        AI Talents
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Col 4: SOCIAL MEDIA (Span 3) */}
                        <div className="lg:col-span-3 space-y-4">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                                SOCIAL MEDIA
                            </h4>
                            <p className="text-xs text-teal-100/70 leading-relaxed">
                                Ikuti kami untuk update kurikulum, agenda webinar, dan inovasi edukasi kecerdasan buatan.
                            </p>

                            {/* Circular Icon Buttons */}
                            <div className="flex items-center gap-3 pt-1">
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-8 h-8 rounded-full bg-teal-900/80 border border-teal-700/60 flex items-center justify-center text-teal-100 hover:text-white hover:bg-teal-800 transition-colors text-sm"
                                    aria-label="Instagram"
                                >
                                    <i className="bi bi-instagram"></i>
                                </a>
                                <a
                                    href="https://linkedin.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-8 h-8 rounded-full bg-teal-900/80 border border-teal-700/60 flex items-center justify-center text-teal-100 hover:text-white hover:bg-teal-800 transition-colors text-sm"
                                    aria-label="LinkedIn"
                                >
                                    <i className="bi bi-linkedin"></i>
                                </a>
                                <a
                                    href="mailto:info@aici.id"
                                    className="w-8 h-8 rounded-full bg-teal-900/80 border border-teal-700/60 flex items-center justify-center text-teal-100 hover:text-white hover:bg-teal-800 transition-colors text-sm"
                                    aria-label="Email"
                                >
                                    <i className="bi bi-envelope"></i>
                                </a>
                                <a
                                    href="https://wa.me/6282110103938"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="w-8 h-8 rounded-full bg-teal-900/80 border border-teal-700/60 flex items-center justify-center text-teal-100 hover:text-white hover:bg-teal-800 transition-colors text-sm"
                                    aria-label="WhatsApp"
                                >
                                    <i className="bi bi-whatsapp"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Copyright & Legal Links */}
                    <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-teal-100/60">
                        <div>
                            &copy; 2026 Artificial Intelligence Center Indonesia (AiCI). All rights reserved.
                        </div>
                        <div className="flex items-center gap-6">
                            <a href="#" className="hover:text-teal-200 transition-colors">
                                Privacy Policy
                            </a>
                            <a href="#" className="hover:text-teal-200 transition-colors">
                                Terms of Service
                            </a>
                            <a href="https://sci.ui.ac.id" target="_blank" rel="noreferrer" className="hover:text-teal-200 transition-colors">
                                FMIPA UI Hub
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
