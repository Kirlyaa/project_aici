import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import PublicNavbar from '@/Components/PublicNavbar';
import PublicFooter from '@/Components/PublicFooter';

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
        <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-[#0B6282] selection:text-white">
            <Head title="Program Pelatihan & Kurikulum AI - FMIPA Universitas Indonesia" />

            {/* Standard Institutional Top Navigation */}
            <PublicNavbar active="program" />

            {/* ============================================================== */}
            {/* Header Hero Section: Academic Tone */}
            {/* ============================================================== */}
            <header className="relative bg-[#0B6282] text-white pt-12 pb-20 md:pt-16 md:pb-24 overflow-hidden border-b border-[#08455c]">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-5">
                    {/* Badge Pill */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#08455c] border border-white/20 text-xs text-cyan-200 font-semibold">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        KURIKULUM RESMI FMIPA UI & UMG IDEALAB
                    </div>

                    {/* Main Title */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
                        Program Pelatihan & Kurikulum Kecerdasan Artifisial
                    </h1>

                    {/* Subtitle */}
                    <p className="text-sm sm:text-base text-cyan-50/90 leading-relaxed max-w-2xl mx-auto">
                        Dirancang secara berjenjang mulai dari pengenalan STEAM K-12, sertifikasi guru & dosen, hingga riset terapan dan penyiapan talenta masa depan.
                    </p>

                    {/* Filter Category Buttons */}
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
                        {filterButtons.map((btn) => {
                            const isActive = selectedCategory === btn.key;
                            return (
                                <button
                                    key={btn.key}
                                    type="button"
                                    onClick={() => setSelectedCategory(btn.key)}
                                    className={`px-4 sm:px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-bold transition-all ${
                                        isActive
                                            ? 'bg-white text-[#0B6282] shadow-md scale-105'
                                            : 'bg-[#08455c]/80 hover:bg-[#08455c] text-cyan-100 border border-white/15'
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
                                        <div className="absolute top-3 left-3 bg-[#0B6282]/90 backdrop-blur-sm text-cyan-200 text-[11px] font-bold px-3 py-1 rounded-lg shadow-sm">
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
                                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0B6282] hover:bg-[#08455c] text-white shadow-sm transition-colors"
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
                                                    className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border border-[#0B6282] text-[#0B6282] hover:bg-cyan-50 transition-colors"
                                                >
                                                    {item.actionBtn.text}
                                                </Link>
                                            )}
                                            {item.actionBtn.style === 'outline-gray' && (
                                                <Link
                                                    href={item.actionBtn.href}
                                                    className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
                                                >
                                                    {item.actionBtn.text}
                                                </Link>
                                            )}
                                            {item.actionBtn.style === 'solid-red' && (
                                                <a
                                                    href="https://wa.me/6282110103938"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E62C29] hover:bg-[#d02522] text-white shadow-sm transition-colors"
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
                <div className="bg-[#0B6282] text-white rounded-[2.5rem] p-8 sm:p-12 shadow-xl border border-[#08455c]">
                    <div className="max-w-2xl space-y-4">
                        <div className="inline-block px-3.5 py-1 rounded-full bg-[#08455c] border border-white/20 text-[11px] font-bold tracking-wider uppercase text-cyan-200">
                            KERJASAMA INSTITUSI & SEKOLAH
                        </div>

                        <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
                            Tertarik Menyelenggarakan Program AI di Sekolah atau Institusi Anda?
                        </h3>

                        <p className="text-xs sm:text-sm text-cyan-50/90 leading-relaxed font-normal">
                            Dapatkan silabus kurikulum lengkap, proposal kemitraan sekolah, serta jadwal kunjungan workshop praktikum AI bersama tutor departemen sains FMIPA Universitas Indonesia.
                        </p>

                        <div className="flex flex-wrap items-center gap-3.5 pt-3">
                            <a
                                href="https://wa.me/6282110103938"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs font-bold tracking-wider uppercase bg-[#E62C29] hover:bg-[#d02522] text-white shadow-md shadow-red-950/20 transition-transform hover:scale-105"
                            >
                                <i className="bi bi-whatsapp text-sm"></i>
                                HUBUNGI TIM KONSULTAN AICI
                            </a>

                            <a
                                href="#brosur"
                                className="inline-flex items-center justify-center px-7 py-3 rounded-full text-xs font-bold tracking-wider uppercase bg-[#08455c] hover:bg-[#062d3d] text-cyan-100 border border-white/15 transition-colors"
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

            {/* Standard Institutional Public Footer */}
            <PublicFooter />
        </div>
    );
}
