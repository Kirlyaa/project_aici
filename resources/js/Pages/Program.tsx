import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

type CategoryFilter = 'all' | 'school' | 'teacher' | 'campus' | 'corporate';

export default function Program() {
    const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');

    const filterButtons: { key: CategoryFilter; label: string }[] = [
        { key: 'all', label: 'SEMUA PROGRAM' },
        { key: 'school', label: 'SEKOLAH (SD/SMP/SMA)' },
        { key: 'teacher', label: 'PENDIDIK & GURU' },
        { key: 'campus', label: 'TALENTA KAMPUS' },
        { key: 'corporate', label: 'KLINIK & KORPORASI' },
    ];

    const programs = [
        // 1. Fun Learning with AI
        {
            id: 'fun-learning',
            category: 'school',
            badge: null,
            imageBadge: 'SD • SMP • SMA/SMK',
            image: '/images/landing/prog-funlearning.jpg',
            title: 'Fun Learning with AI untuk Siswa SD/MI, SMP/MTs dan SMA/MA/SMK',
            accentColor: 'border-b-2 border-teal-700 w-12 mb-4',
            paragraphs: [
                'Kegiatan belajar yang diselenggarakan oleh AiCI bertujuan untuk memperkenalkan dan meningkatkan pengetahuan serta keterampilan peserta didik dalam bidang Artificial Intelligence dengan cara yang menyenangkan sesuai dengan jenjang peserta didik. Selain itu, kegiatan ini juga bertujuan untuk mengembangkan keterampilan peserta didik dalam aplikasi-aplikasi artificial intelligence yang dapat dipergunakan dalam kehidupan sehari-hari.',
                'Pembelajaran AI akan ditemani langsung oleh Tutor dari Universitas Indonesia. Di dalam program Fun Learning with AI peserta didik akan mempelajari 4 (empat) pokok pembahasan diantaranya adalah robotik, coding, programing, dan data science. Peserta didik akan mendapatkan Modul pembelajaran, jaringan internet, dan sertifikat.'
            ],
            checklist: null,
            downloadBtn: 'UNDUH BROSUR',
            actionBtn: { text: 'DAFTAR SEKARANG →', href: '/faq', style: 'outline' },
            imageLeft: true,
        },

        // 2. AI for Education
        {
            id: 'ai-for-education',
            category: 'teacher',
            badge: { icon: 'bi-megaphone', text: 'PROGRAM PENDIDIK & INSTRUKTUR', color: 'text-amber-600' },
            imageBadge: null,
            image: '/images/landing/prog-aiforeducation.jpg',
            title: 'AI for Education',
            accentColor: null,
            paragraphs: [
                'Kegiatan pelatihan implementasi AI dalam bidang pendidikan untuk Guru dan Dosen. Bertujuan untuk meningkatkan pengetahuan, keterampilan, serta melatih kemampuan guru dan dosen dalam mengembangkan pembelajaran artificial intelligence yang bermanfaat untuk memudahkan proses kegiatan pembelajaran.'
            ],
            facilityBadge: 'Fasilitas: Sertifikat Pelatihan Resmi FMIPA UI, Toolkit AI Pembelajaran, Modul Praktikum.',
            downloadBtn: 'UNDUH BROSUR',
            actionBtn: null,
            imageLeft: false,
        },

        // 3. AI Day
        {
            id: 'ai-day',
            category: 'school',
            badge: null,
            imageBadge: 'One-Day Workshop',
            image: '/images/landing/prog-aiday.jpg',
            title: 'AI Day',
            accentColor: 'border-b-2 border-teal-700 w-12 mb-4',
            paragraphs: [
                'AI Day merupakan sebuah kegiatan yang dilaksanakan selama satu hari dengan tujuan untuk menumbuhkan minat, pengetahuan, dan keterampilan peserta didik dalam bidang artificial intelligence dengan cara yang menyenangkan (fun learning). Kegiatan ini sebagian besar merupakan pengenalan robotik dan artificial intelligence untuk siswa SD/MI, SMP/MTs, dan SMA/MA/SMK.'
            ],
            checklist: null,
            downloadBtn: 'UNDUH BROSUR',
            actionBtn: null,
            imageLeft: true,
        },

        // 4. AI Edu Fair
        {
            id: 'ai-edu-fair',
            category: 'school',
            badge: { icon: 'bi-trophy', text: 'PERAKITAN ROBOT & MINI COMPETITION', color: 'text-emerald-700' },
            imageBadge: null,
            image: '/images/landing/prog-aiedufair.jpg',
            title: 'AI Edu Fair',
            accentColor: null,
            paragraphs: [
                'Sebuah kegiatan yang dilaksanakan selama satu hari dengan tujuan untuk menumbuhkan rasa ingin tahu, pengetahuan, dan keterampilan peserta didik dalam bidang artificial intelligence. Selain itu, pada kegiatan ini dikembangkan juga beberapa soft skills seperti: berpikir logis, berpikir kritis, teamwork, dan lain-lain.',
                'Kegiatan ini ditujukan untuk siswa SD/MI dengan kegiatan utama berupa pelatihan perakitan robot, pembuatan program dan mengikuti mini competition untuk memicu ketertarikan pada pembelajaran AI.'
            ],
            checklist: null,
            downloadBtn: 'UNDUH BROSUR',
            actionBtn: null,
            imageLeft: false,
        },

        // 5. Preparing Artificial Intelligence (AI) Talents
        {
            id: 'ai-talents',
            category: 'campus',
            badge: { icon: 'bi-mortarboard-fill', text: 'STUDI INDEPENDEN BERSERTIFIKAT FMIPA UI', color: 'text-blue-600' },
            imageBadge: 'Kampus Merdeka | MSIB',
            image: '/images/landing/prog-aitalents.jpg',
            title: 'Preparing Artificial Intelligence (AI) Talents for Indonesian Future Technology',
            accentColor: 'border-b-2 border-teal-700 w-12 mb-4',
            paragraphs: [
                'Merupakan program PT Artifisial Intelegensia Indonesia (AiCI) bekerjasama dengan Departemen Fisika FMIPA UI dan beberapa praktisi dalam lingkungan kerja start-up dan industri dalam bentuk Studi Independen Bersertifikat Kampus Merdeka.',
                'Program ini bernama Indonesian Artificial Intelligence (AI) Talents. Peserta dapat mengikuti program yang dilaksanakan secara daring dalam durasi 5 bulan dengan biaya pelatihan Rp 3.750.000,-/mahasiswa/5 bulan.'
            ],
            checklist: null,
            downloadBtn: 'UNDUH BROSUR',
            actionBtn: { text: 'DETAIL KURIKULUM', href: '/faq', style: 'outline-gray' },
            imageLeft: true,
        },

        // 6. AiCI SIM KLIN
        {
            id: 'sim-klin',
            category: 'corporate',
            badge: { icon: 'bi-hospital', text: 'HEALTHCARE & REKAM MEDIS ELEKTRONIK', color: 'text-teal-700' },
            imageBadge: null,
            image: '/images/landing/prog-simklin.jpg',
            title: 'AiCI SIM KLIN',
            accentColor: null,
            paragraphs: [
                'Solusi Klinik dalam menyiapkan sistem integrasi yang aman, responsif, dan prediktif sebagai upaya penyelenggaraan rekam medis elektronik sesuai dengan arahan KEMENKES RI. Sistem dilengkapi modul automasi AI untuk rekap diagnosa, manajemen apotek, dan dashboard performa klinik.'
            ],
            checklist: null,
            downloadBtn: 'UNDUH BROSUR',
            actionBtn: { text: 'KONSULTASI SOLUSI', href: '/faq', style: 'outline-gray' },
            imageLeft: false,
        },

        // 7. Digital Marketing for Business
        {
            id: 'digital-marketing',
            category: 'corporate',
            badge: { icon: 'bi-graph-up-arrow', text: 'CORPORATE & UMKM SCALE-UP', color: 'text-indigo-600' },
            imageBadge: null,
            image: '/images/landing/prog-digitalmarketing.jpg',
            title: 'Digital Marketing for Business',
            accentColor: null,
            paragraphs: [
                'Dengan semakin berkembangnya teknologi digital, penting bagi perusahaan untuk memanfaatkan platform online seperti Google Ads, Landing Page, Website dan SEO untuk meningkatkan visibilitas dan omset. Agensi kami siap membantu perusahaan Anda dalam mencapai tujuan tersebut secara terukur dengan integrasi AI analytics.'
            ],
            checklist: null,
            downloadBtn: 'UNDUH BROSUR',
            actionBtn: null,
            imageLeft: true,
        },

        // 8. Extracurricular AI and Robotic Club
        {
            id: 'extracurricular',
            category: 'school',
            badge: { icon: 'bi-robot', text: 'EKSTRAKURIKULER MITRA SEKOLAH', color: 'text-red-600' },
            imageBadge: null,
            image: '/images/landing/prog-extracurricular.jpg',
            title: 'Extracurricular AI and Robotic Club',
            accentColor: null,
            paragraphs: [
                'AiCI terbuka untuk menjadi bagian dari Ekstrakurikuler di sekolah-sekolah yang ingin membuka Ekstrakurikuler AI dan Robotik Club. Kegiatan Ekstrakurikuler di sekolah adalah bentuk dari kerja sama AiCI dalam menyelenggarakan pendidikan yang berkualitas dengan cara mengenalkan dan membekali ilmu AI kepada siswa-siswi.',
                'Kegiatan ekstrakurikuler dapat diikuti oleh siswa SD, SMP, dan SMA dengan modul pembelajaran sesuai tingkatannya. Siswa-siswi yang mengikuti ekstrakurikuler akan dibimbing langsung oleh tutor berpengalaman dari Universitas Indonesia. Setiap siswa juga akan diberikan fasilitas media pembelajaran berupa berbagai jenis robot dan modul pembelajaran. Setiap sesi pembelajaran berlangsung 90 - 120 menit.'
            ],
            checklist: null,
            downloadBtn: 'UNDUH BROSUR',
            actionBtn: { text: 'AJUKAN KERJASAMA SEKOLAH', href: '/faq', style: 'solid-red' },
            imageLeft: false,
        },
    ];

    const filteredPrograms = selectedCategory === 'all'
        ? programs
        : programs.filter((p) => p.category === selectedCategory);

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-[#088395] selection:text-white">
            <Head title="Program Pembelajaran & Pelatihan - AiCI" />

            {/* ============================================================== */}
            {/* Top Light Navbar (Sesuai Desain Figma: Putih dengan menu aktif "Program") */}
            {/* ============================================================== */}
            <nav className="bg-white border-b border-slate-100 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo Left */}
                        <Link href="/landing" className="flex items-center gap-3">
                            <img
                                src="/images/logo-aici.png"
                                alt="AiCI Logo"
                                className="h-10 w-auto object-contain"
                            />
                        </Link>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
                            <Link href="/landing" className="hover:text-slate-900 transition-colors">
                                Home
                            </Link>
                            <Link
                                href="/program"
                                className="text-[#034d52] font-bold border-b-2 border-[#034d52] pb-1 transition-colors"
                            >
                                Program
                            </Link>
                            <Link href="/profil" className="hover:text-slate-900 transition-colors">
                                Profil
                            </Link>
                            <Link href="/fasilitas" className="hover:text-slate-900 transition-colors">
                                Fasilitas
                            </Link>
                            <Link href="/galeri" className="hover:text-slate-900 transition-colors">
                                Galeri
                            </Link>
                            <Link href="/riset" className="hover:text-slate-900 transition-colors">
                                Riset
                            </Link>
                            <Link href="/kontak" className="hover:text-slate-900 transition-colors">
                                Kontak
                            </Link>
                        </div>

                        {/* Red CTA Button */}
                        <div className="flex items-center gap-3">
                            <a
                                href="https://wa.me/6282110103938"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase bg-[#e53935] hover:bg-[#d32f2f] text-white shadow-md shadow-red-900/20 transition-all hover:scale-[1.02]"
                            >
                                KONSULTASI AI
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            {/* ============================================================== */}
            {/* Header Hero Section: Program Pembelajaran & Pelatihan AiCI */}
            {/* ============================================================== */}
            <header className="relative bg-[#034d52] text-white pt-12 pb-28 md:pb-36 overflow-hidden">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
                    {/* Badge Pill */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0a5c61] border border-teal-500/30 text-xs font-medium text-teal-100 shadow-sm">
                        <i className="bi bi-cpu text-cyan-300"></i>
                        KURIKULUM AI & ROBOTIKA TERPADU
                    </div>

                    {/* Main Title */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                        Program Pembelajaran & Pelatihan AiCI
                    </h1>

                    {/* Subtitle */}
                    <p className="text-sm sm:text-base text-teal-100/90 leading-relaxed max-w-3xl mx-auto font-normal">
                        Membangun kapabilitas generasi bangsa dan talenta profesional di bidang Artificial Intelligence (Kecerdasan Artifisial) dari usia sekolah dasar hingga tingkat korporasi dan riset terapan.
                    </p>

                    {/* Filter Category Buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-2.5 pt-4">
                        {filterButtons.map((btn) => {
                            const isActive = selectedCategory === btn.key;
                            return (
                                <button
                                    key={btn.key}
                                    type="button"
                                    onClick={() => setSelectedCategory(btn.key)}
                                    className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all shadow-sm ${
                                        isActive
                                            ? 'bg-white text-[#034d52] shadow-md scale-105'
                                            : 'bg-[#075960] hover:bg-[#09666e] text-teal-100/90 border border-teal-600/30'
                                    }`}
                                >
                                    {btn.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Curved Slanted Bottom Edge */}
                <div
                    className="absolute -bottom-1 left-0 right-0 h-16 sm:h-24 bg-[#f8fafc]"
                    style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }}
                ></div>
            </header>

            {/* ============================================================== */}
            {/* List of Program Cards (Alternating Left & Right Layout) */}
            {/* ============================================================== */}
            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10">
                {filteredPrograms.map((item) => (
                    <article
                        key={item.id}
                        className="bg-white border border-slate-200/80 rounded-[2rem] p-6 sm:p-9 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div
                            className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                                item.imageLeft ? '' : 'lg:grid-flow-dense'
                            }`}
                        >
                            {/* Image Box Container */}
                            <div
                                className={`lg:col-span-5 ${
                                    item.imageLeft ? '' : 'lg:col-start-8'
                                }`}
                            >
                                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 shadow-inner group">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />

                                    {/* Overlay Pill Badge over Image (e.g. SD • SMP • SMA/SMK) */}
                                    {item.imageBadge && (
                                        <div className="absolute top-3 left-3 bg-[#034d52]/90 backdrop-blur-sm text-cyan-200 text-[11px] font-bold px-3 py-1 rounded-lg shadow-sm">
                                            {item.imageBadge}
                                        </div>
                                    )}

                                    {/* Subdued Watermark Tag at bottom-right */}
                                    <div className="absolute bottom-2 right-3 text-[10px] text-white/60 font-semibold tracking-wider">
                                        © AiCI - 2024
                                    </div>
                                </div>
                            </div>

                            {/* Content Description */}
                            <div
                                className={`lg:col-span-7 space-y-4 ${
                                    item.imageLeft ? '' : 'lg:col-start-1'
                                }`}
                            >
                                {/* Category Badge Header */}
                                {item.badge && (
                                    <div className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${item.badge.color}`}>
                                        <i className={`bi ${item.badge.icon}`}></i>
                                        <span>{item.badge.text}</span>
                                    </div>
                                )}

                                {/* Program Title */}
                                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                                    {item.title}
                                </h2>

                                {/* Accent Bar */}
                                {item.accentColor && (
                                    <div className={item.accentColor}></div>
                                )}

                                {/* Paragraph Texts */}
                                <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                                    {item.paragraphs.map((p, pIdx) => (
                                        <p key={pIdx}>{p}</p>
                                    ))}
                                </div>

                                {/* Special Facility Badge (e.g. AI for Education) */}
                                {item.facilityBadge && (
                                    <div className="flex items-center gap-2 p-3 bg-cyan-50/70 border border-cyan-200/60 rounded-xl text-xs text-cyan-900 font-medium">
                                        <i className="bi bi-patch-check-fill text-cyan-700 text-sm"></i>
                                        <span>{item.facilityBadge}</span>
                                    </div>
                                )}

                                {/* Bottom Action Buttons */}
                                <div className="flex flex-wrap items-center gap-3 pt-3">
                                    {/* Unduh Brosur Button */}
                                    <a
                                        href="#brosur"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#034d52] hover:bg-[#05585e] text-white shadow-sm transition-colors"
                                    >
                                        <i className="bi bi-file-earmark-arrow-down-fill text-sm"></i>
                                        {item.downloadBtn}
                                    </a>

                                    {/* Optional Action Button */}
                                    {item.actionBtn && (
                                        <>
                                            {item.actionBtn.style === 'outline' && (
                                                <Link
                                                    href={item.actionBtn.href}
                                                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border border-[#034d52] text-[#034d52] hover:bg-teal-50 transition-colors"
                                                >
                                                    {item.actionBtn.text}
                                                </Link>
                                            )}
                                            {item.actionBtn.style === 'outline-gray' && (
                                                <Link
                                                    href={item.actionBtn.href}
                                                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
                                                >
                                                    {item.actionBtn.text}
                                                </Link>
                                            )}
                                            {item.actionBtn.style === 'solid-red' && (
                                                <a
                                                    href="https://wa.me/6282110103938"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#e53935] hover:bg-[#d32f2f] text-white shadow-sm transition-colors"
                                                >
                                                    {item.actionBtn.text}
                                                </a>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </main>

            {/* ============================================================== */}
            {/* Banner Kerjasama Institusi & Sekolah (Dark Blue Curved Container) */}
            {/* ============================================================== */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-[#033c44] text-white rounded-[2.5rem] p-8 sm:p-12 shadow-xl border border-teal-900/50">
                    <div className="max-w-2xl space-y-4">
                        <div className="inline-block px-3.5 py-1 rounded-full bg-[#0a525c] border border-teal-600/40 text-[11px] font-bold tracking-wider uppercase text-cyan-300">
                            KERJASAMA INSTITUSI & SEKOLAH
                        </div>

                        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                            Tertarik Menyelenggarakan Program AI di Sekolah atau Institusi Anda?
                        </h3>

                        <p className="text-xs sm:text-sm text-teal-100/80 leading-relaxed font-normal">
                            Dapatkan silabus kurikulum lengkap, proposal kemitraan sekolah, serta jadwal kunjungan workshop praktikum AI bersama tutor departemen sains FMIPA Universitas Indonesia.
                        </p>

                        <div className="flex flex-wrap items-center gap-3.5 pt-3">
                            <a
                                href="https://wa.me/6282110103938"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold tracking-wider uppercase bg-[#e53935] hover:bg-[#d32f2f] text-white shadow-md shadow-red-900/30 transition-transform hover:scale-105"
                            >
                                <i className="bi bi-whatsapp text-sm"></i>
                                HUBUNGI TIM KONSULTAN AICI
                            </a>

                            <a
                                href="#brosur"
                                className="inline-flex items-center justify-center px-6 py-3 rounded-full text-xs font-bold tracking-wider uppercase bg-[#05535c] hover:bg-[#07626d] text-teal-100 border border-teal-600/40 transition-colors"
                            >
                                DOWNLOAD KATALOG LENGKAP (PDF)
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================== */}
            {/* Lokasi Artificial Intelligence Center Indonesia (AiCI) Map Section */}
            {/* ============================================================== */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white border border-slate-200/90 rounded-[2rem] p-6 sm:p-7 shadow-sm">
                    {/* Header info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                        <div className="flex items-start gap-2.5">
                            <i className="bi bi-geo-alt-fill text-red-500 text-lg mt-0.5"></i>
                            <div>
                                <h4 className="text-sm sm:text-base font-bold text-slate-900">
                                    Lokasi Artificial Intelligence Center Indonesia (AiCI)
                                </h4>
                                <p className="text-xs text-slate-500">
                                    Gedung Lab. Riset Multidisiplin Pertamina FMIPA UI Lt. 4, Universitas Indonesia, Depok, Jawa Barat 16424
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold text-slate-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200/60 flex items-center gap-1">
                                <i className="bi bi-star-fill text-amber-500 text-xs"></i> 5.0
                            </span>
                            <a
                                href="https://maps.google.com/?q=Gedung+Lab+Riset+Multidisiplin+Pertamina+FMIPA+UI"
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-bold text-[#088395] hover:underline flex items-center gap-1"
                            >
                                <span>Buka di Google Maps</span>
                                <i className="bi bi-box-arrow-up-right text-[10px]"></i>
                            </a>
                        </div>
                    </div>

                    {/* Interactive Google Maps Embed */}
                    <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative">
                        <iframe
                            title="Peta Lokasi AiCI FMIPA UI"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.201659032607!2d106.8260655758694!3d-6.367910593622268!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ec1a4918e959%3A0xcda67515ee0495f5!2sLaboratorium%20Multidisiplin%20FMIPA%20UI!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </section>

            {/* ============================================================== */}
            {/* Footer Section Sesuai Desain Figma */}
            {/* ============================================================== */}
            <footer className="bg-[#023136] text-slate-300 pt-16 pb-10 border-t border-teal-950 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-teal-900/60">
                        {/* Col 1: Logo & Alamat */}
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

                            <div className="space-y-1 text-xs text-teal-100/70">
                                <p className="font-semibold text-white">Artificial Intelligence Center Indonesia</p>
                                <p className="leading-relaxed">
                                    Gd. Laboratorium Riset Multidisiplin Pertamina FMIPA UI Lt. 4, Universitas Indonesia
                                </p>
                                <p>Depok, Jawa Barat 16424</p>
                            </div>

                            <div className="text-xs text-teal-100/70 flex items-center gap-1.5 pt-1">
                                <i className="bi bi-telephone-fill text-cyan-300 text-xs"></i>
                                <span>Phone: </span>
                                <a
                                    href="tel:082110103938"
                                    className="text-cyan-300 font-semibold hover:underline"
                                >
                                    0821-1010-3938
                                </a>
                            </div>
                        </div>

                        {/* Col 2: PAGES */}
                        <div className="lg:col-span-2 space-y-3">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                                PAGES
                            </h4>
                            <ul className="space-y-2 text-xs text-teal-100/70">
                                <li>
                                    <Link href="/landing" className="hover:text-white transition-colors flex items-center gap-1">
                                        <i className="bi bi-chevron-right text-[10px]"></i> Profil
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/fasilitas" className="hover:text-white transition-colors flex items-center gap-1">
                                        <i className="bi bi-chevron-right text-[10px]"></i> Fasilitas
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/program" className="hover:text-white transition-colors flex items-center gap-1 font-semibold text-cyan-300">
                                        <i className="bi bi-chevron-right text-[10px]"></i> Program
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/kontak" className="hover:text-white transition-colors flex items-center gap-1">
                                        <i className="bi bi-chevron-right text-[10px]"></i> Kontak
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Col 3: DOWNLOAD */}
                        <div className="lg:col-span-3 space-y-3">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                                DOWNLOAD
                            </h4>
                            <ul className="space-y-2 text-xs text-teal-100/70">
                                <li>
                                    <a href="#fun-learning" className="hover:text-white transition-colors flex items-center gap-1">
                                        <i className="bi bi-chevron-right text-[10px]"></i> Fun Learning
                                    </a>
                                </li>
                                <li>
                                    <a href="#brosur" className="hover:text-white transition-colors flex items-center gap-1">
                                        <i className="bi bi-chevron-right text-[10px]"></i> Workshop Prompt Engineer
                                    </a>
                                </li>
                                <li>
                                    <a href="#extracurricular" className="hover:text-white transition-colors flex items-center gap-1">
                                        <i className="bi bi-chevron-right text-[10px]"></i> Extracurricular AI and Robotic
                                    </a>
                                </li>
                                <li>
                                    <a href="#ai-for-education" className="hover:text-white transition-colors flex items-center gap-1">
                                        <i className="bi bi-chevron-right text-[10px]"></i> AI for Education
                                    </a>
                                </li>
                                <li>
                                    <a href="#ai-day" className="hover:text-white transition-colors flex items-center gap-1">
                                        <i className="bi bi-chevron-right text-[10px]"></i> AI Day
                                    </a>
                                </li>
                                <li>
                                    <a href="#ai-edu-fair" className="hover:text-white transition-colors flex items-center gap-1">
                                        <i className="bi bi-chevron-right text-[10px]"></i> AI Edu Fair
                                    </a>
                                </li>
                                <li>
                                    <a href="#ai-talents" className="hover:text-white transition-colors flex items-center gap-1">
                                        <i className="bi bi-chevron-right text-[10px]"></i> AI Talents
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Col 4: SOCIAL MEDIA */}
                        <div className="lg:col-span-3 space-y-4">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                                SOCIAL MEDIA
                            </h4>
                            <p className="text-xs text-teal-100/70 leading-relaxed">
                                Ikuti perkembangan riset, modul robotika, dan kegiatan AiCI FMIPA UI.
                            </p>

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

                    {/* Bottom Copyright */}
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
