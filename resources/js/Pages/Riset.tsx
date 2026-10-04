import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';

interface Publication {
    id: number;
    category: 'jurnal' | 'prosiding' | 'prototipe' | 'kebijakan';
    categoryLabel: string;
    categoryBadgeColor: string;
    title: string;
    authors: string;
    year: string;
    venue: string;
    doiOrLink?: string;
    abstract: string;
    tags: string[];
}

export default function Riset() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Sample official research publications & research focus of AiCI FMIPA UI
    const publications: Publication[] = [
        {
            id: 1,
            category: 'jurnal',
            categoryLabel: 'Jurnal Internasional',
            categoryBadgeColor: 'bg-emerald-600 text-white',
            title: 'Vision-Based Autonomous Navigation for Humanoid Robots in Educational Settings',
            authors: 'Tim Peneliti AiCI FMIPA UI, Lab Riset Multidisiplin Pertamina',
            year: '2024',
            venue: 'IEEE Access / Journal of Artificial Intelligence & Robotics',
            abstract: 'Penelitian perancangan sistem persepsi visual berbasis deep convolutional neural network pada robot humanoid kecil untuk navigasi otonom di lingkungan ruang kelas interaktif STEAM.',
            tags: ['Computer Vision', 'Humanoid Robotics', 'Deep Learning'],
        },
        {
            id: 2,
            category: 'prototipe',
            categoryLabel: 'Prototipe & Inovasi',
            categoryBadgeColor: 'bg-indigo-600 text-white',
            title: 'Desain dan Integrasi Modul Robot Edukasi Humanoid Berbasis AI untuk Pembelajaran K-12',
            authors: 'AiCI UI & UMG IdeaLab Research Group',
            year: '2023',
            venue: 'Paten Sederhana & Prototipe Terdaftar Ditjen KI RI',
            abstract: 'Pengembangan kit robot cerdas dengan 17 derajat kebebasan (17-DoF) yang terintegrasi pengenalan suara dan computer vision untuk memperkenalkan konsep machine learning pada siswa usia sekolah.',
            tags: ['EdTech', 'Humanoid Kit', 'STEAM Curriculum'],
        },
        {
            id: 3,
            category: 'prosiding',
            categoryLabel: 'Prosiding Konferensi',
            categoryBadgeColor: 'bg-sky-600 text-white',
            title: 'Efektivitas Penerapan Kurikulum Artificial Intelligence Berbasis Hands-On Praktikum Robotik di Jenjang SMA/SMK',
            authors: 'Divisi Kurikulum AiCI FMIPA UI',
            year: '2023',
            venue: 'Prosiding Konferensi Nasional Pembelajaran Sains & Teknologi Terapan',
            abstract: 'Studi empiris pengukuran peningkatan computational thinking dan literasi kecerdasan buatan pada 1,200+ siswa SMA/SMK mitra dengan modul robotika AiCI.',
            tags: ['AI Literacy', 'Computational Thinking', 'K-12 Education'],
        },
        {
            id: 4,
            category: 'kebijakan',
            categoryLabel: 'Whitepaper & Policy Brief',
            categoryBadgeColor: 'bg-amber-600 text-white',
            title: 'Roadmap Peningkatan Kompetensi Guru Indonesia Menyongsong Generative AI & Otomasi Masa Depan',
            authors: 'Gugus Riset Kebijakan Pendidikan AiCI FMIPA UI',
            year: '2024',
            venue: 'AiCI Research Monograph & Policy Whitepaper Series',
            abstract: 'Rekomendasi strategis pedagogis bagi pemangku kebijakan sekolah dan kementerian dalam mengintegrasikan AI generatif secara etis ke dalam kurikulum merdeka.',
            tags: ['Generative AI', 'Teacher Training', 'Policy Framework'],
        },
        {
            id: 5,
            category: 'prototipe',
            categoryLabel: 'Prototipe & Inovasi',
            categoryBadgeColor: 'bg-indigo-600 text-white',
            title: 'AI Smart Sorting & Robotic Arm System Menggunakan TinyML pada Mikrokontroler Edge',
            authors: 'Lab Robotika AiCI & Mahasiswa MBKM FMIPA UI',
            year: '2024',
            venue: 'Pameran Riset Inovasi UI Tech Expo',
            abstract: 'Implementasi model machine learning ringan (TinyML) pada lengan robot pemilah barang otomatis berkecepatan tinggi dengan efisiensi konsumsi daya maksimal.',
            tags: ['TinyML', 'Edge Computing', 'Robotic Arm'],
        },
        {
            id: 6,
            category: 'jurnal',
            categoryLabel: 'Jurnal Nasional Terakreditasi',
            categoryBadgeColor: 'bg-emerald-600 text-white',
            title: 'Analisis Pengenalan Suara Berbahasa Indonesia Menggunakan Model Transformer untuk Interaksi Siswa-Robot',
            authors: 'Laboratorium Sains Komputasi & AiCI UI',
            year: '2023',
            venue: 'Jurnal Ilmu Komputer dan Informasi (JIKI)',
            abstract: 'Eksperimen fine-tuning acoustic model dan language model berbasis Whisper / Wav2Vec2 untuk menangani variasi intonasi dan pengucapan anak-anak sekolah Indonesia saat berinteraksi dengan robot.',
            tags: ['Speech Recognition', 'NLP', 'Indonesian Accent'],
        },
    ];

    const researchFocus = [
        {
            icon: 'bi-robot',
            title: 'Humanoid & Service Robotics',
            desc: 'Pengembangan algoritma gerak, kestabilan postur bipedal, serta interaksi sosial cerdas (Human-Robot Interaction) berbasis robot humanoid edukasi.',
            color: 'teal',
        },
        {
            icon: 'bi-eye-fill',
            title: 'Computer Vision & Real-time AI',
            desc: 'Penerapan pendeteksian objek, pengenalan pose manusia, gesture, dan segmentasi citra secara real-time pada embedded processor.',
            color: 'sky',
        },
        {
            icon: 'bi-chat-dots-fill',
            title: 'NLP & Voice Interaction',
            desc: 'Riset pemrosesan bahasa alami (NLP) dan pengenalan wicara (ASR) berbahasa Indonesia untuk modul komunikasi edukatif interaktif.',
            color: 'indigo',
        },
        {
            icon: 'bi-mortarboard-fill',
            title: 'Pedagogi & AI Literacy (STEAM)',
            desc: 'Pengukuran dampak kognitif, metodologi pengajaran AI berjenjang, dan pengembangan standar kompetensi pendidik kecerdasan buatan.',
            color: 'amber',
        },
    ];

    const filteredPublications = publications.filter((p) => {
        const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
        const matchesQuery =
            searchQuery.trim() === '' ||
            p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesQuery;
    });

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans flex flex-col selection:bg-teal-500 selection:text-white">
            <Head title="Pusat Riset & Publikasi Ilmiah - Artificial Intelligence Center Indonesia (AiCI) FMIPA UI" />

            {/* ==================== 1. TOP NAVBAR ==================== */}
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    {/* Brand matching Figma */}
                    <div className="flex items-center gap-3.5">
                        <Link href="/landing" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-xl bg-[#034d52] text-white flex items-center justify-center font-extrabold text-lg shadow-md group-hover:scale-105 transition-transform">
                                <span>Ai</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-extrabold text-sm tracking-wider text-slate-900 leading-none">AiCI</span>
                                <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest mt-1">
                                    ARTIFICIAL INTELLIGENCE CENTER
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Nav Links */}
                    <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600">
                        <Link href="/landing" className="hover:text-teal-800 transition-colors">Home</Link>
                        <Link href="/program" className="hover:text-teal-800 transition-colors">Program</Link>
                        <Link href="/profil" className="hover:text-teal-800 transition-colors">Profil</Link>
                        <Link href="/fasilitas" className="hover:text-teal-800 transition-colors">Fasilitas</Link>
                        <Link href="/galeri" className="hover:text-teal-800 transition-colors">Galeri</Link>
                        {/* Active Item with Red Underline */}
                        <div className="relative py-2 text-teal-950 font-bold">
                            <span>Riset</span>
                            <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-red-600 rounded-full"></span>
                        </div>
                        <Link href="/kontak" className="hover:text-teal-800 transition-colors">Kontak</Link>
                    </nav>

                    {/* CTA Actions */}
                    <div className="flex items-center gap-3">
                        <a
                            href="https://wa.me/6282110103938?text=Halo%20AiCI%20FMIPA%20UI,%20kami%20ingin%20berkolaborasi%20riset%20AI"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-[#d32f2f] hover:bg-[#b71c1c] text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-sm hover:shadow transition-all uppercase tracking-wide"
                        >
                            <span>KONSULTASI AI</span>
                        </a>
                        <Link
                            href="/login"
                            className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-teal-900 transition-colors shadow-sm"
                            title="Login"
                        >
                            <i className="bi bi-person-fill text-base"></i>
                        </Link>
                    </div>
                </div>
            </header>

            {/* ==================== 2. HERO SECTION DENGAN FOTO ROBOT & SEMINAR ==================== */}
            <section className="bg-slate-100/60 pt-6 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Hero Big Image Card - Matching screenshot riset-desktop: Robots on table with speakers */}
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 bg-slate-900">
                        <div className="relative h-72 sm:h-96 md:h-[420px] lg:h-[460px] w-full overflow-hidden">
                            <img
                                src="/images/landing/galeri-launching.jpg"
                                alt="Riset dan Peluncuran Robotika AiCI FMIPA UI"
                                className="w-full h-full object-cover object-center brightness-[0.98] contrast-[1.02]"
                                onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src = '/images/landing/robotics-lab.jpg';
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                            {/* Floating Overlay Badge on Hero */}
                            <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                                <span className="bg-white/90 backdrop-blur-md text-teal-900 text-xs font-extrabold px-3.5 py-1.5 rounded-full shadow-sm border border-white/40 flex items-center gap-1.5 uppercase">
                                    <i className="bi bi-cpu-fill text-teal-700"></i>
                                    Laboratorium Riset Terapan AI
                                </span>
                                <span className="bg-black/60 backdrop-blur-md text-teal-200 text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
                                    FMIPA UI & UMG IdeaLab
                                </span>
                            </div>

                            {/* Bottom Title Overlay */}
                            <div className="absolute bottom-6 left-6 right-6 text-white space-y-2 max-w-3xl">
                                <span className="text-[11px] font-extrabold uppercase tracking-widest text-cyan-300 block">
                                    PUSAT PENELITIAN & INOVASI TEKNOLOGI
                                </span>
                                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                                    Riset Kecerdasan Artifisial & Robotika Humanoid
                                </h1>
                                <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 max-w-2xl leading-relaxed">
                                    Menghubungkan riset akademik mutakhir Fakultas MIPA Universitas Indonesia dengan kebutuhan terapan industri modern dan edukasi teknologi masa depan bangsa.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 4 Research Pillars / Focus Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                        {researchFocus.map((focus, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3"
                            >
                                <div className="space-y-3">
                                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center text-lg border border-teal-100">
                                        <i className={`bi ${focus.icon}`}></i>
                                    </div>
                                    <h3 className="font-extrabold text-sm text-slate-900">
                                        {focus.title}
                                    </h3>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        {focus.desc}
                                    </p>
                                </div>
                                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-teal-700 font-bold">
                                    <span>Lab Terpadu UI</span>
                                    <i className="bi bi-arrow-right"></i>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ==================== 3. DIREKTORI PUBLIKASI & RISET TERAPAN ==================== */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-200">
                    <div className="space-y-2 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider border border-sky-100">
                            <i className="bi bi-journal-text text-sky-600"></i>
                            <span>PUBLIKASI ILMIAH & DOKUMEN RISET</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            Karya Ilmiah & Inovasi Rekayasa Terapan
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                            Dokumentasi paper, prosiding konferensi internasional, paten teknologi robotik, dan kajian kebijakan kecerdasan buatan dari sivitas peneliti AiCI FMIPA UI.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="w-full md:w-80">
                        <div className="relative">
                            <i className="bi bi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari judul paper, topik, atau kata kunci..."
                                className="w-full pl-9 pr-4 py-2.5 rounded-full border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all shadow-sm"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <i className="bi bi-x-circle-fill text-xs"></i>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Filter Categories Pill */}
                <div className="flex flex-wrap items-center gap-2">
                    {[
                        { key: 'all', label: 'Semua Publikasi' },
                        { key: 'jurnal', label: 'Jurnal Ilmiah' },
                        { key: 'prototipe', label: 'Prototipe & Paten' },
                        { key: 'prosiding', label: 'Prosiding Konferensi' },
                        { key: 'kebijakan', label: 'Whitepaper & Kebijakan' },
                    ].map((tab) => {
                        const isActive = selectedCategory === tab.key;
                        return (
                            <button
                                key={tab.key}
                                onClick={() => setSelectedCategory(tab.key)}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                                    isActive
                                        ? 'bg-[#034d52] text-white shadow-sm'
                                        : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                                }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Publications Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPublications.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 group"
                        >
                            <div className="space-y-3">
                                <div className="flex items-center justify-between gap-2">
                                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${item.categoryBadgeColor}`}>
                                        {item.categoryLabel}
                                    </span>
                                    <span className="text-xs font-bold text-slate-400">
                                        {item.year}
                                    </span>
                                </div>

                                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-teal-900 transition-colors leading-snug">
                                    {item.title}
                                </h3>

                                <p className="text-[11px] font-semibold text-teal-800 flex items-center gap-1.5">
                                    <i className="bi bi-people"></i>
                                    <span>{item.authors}</span>
                                </p>

                                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                                    {item.abstract}
                                </p>

                                <div className="pt-1 flex flex-wrap gap-1.5">
                                    {item.tags.map((tag, tIdx) => (
                                        <span
                                            key={tIdx}
                                            className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded-md"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                                <span className="text-[11px] text-slate-400 font-medium truncate max-w-[170px]" title={item.venue}>
                                    {item.venue}
                                </span>
                                <a
                                    href="https://wa.me/6282110103938?text=Halo%20AiCI%20FMIPA%20UI,%20kami%20ingin%20meminta%20salinan%20dokumen%20riset%20berjudul:%20"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-bold text-teal-800 hover:text-teal-950 inline-flex items-center gap-1 shrink-0 transition-colors"
                                >
                                    <span>Minta Full Paper</span>
                                    <i className="bi bi-arrow-up-right text-[10px]"></i>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredPublications.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 space-y-3">
                        <i className="bi bi-search text-3xl text-slate-300"></i>
                        <h4 className="text-sm font-bold text-slate-700">Tidak ada dokumen riset yang cocok</h4>
                        <p className="text-xs text-slate-400">Coba gunakan kata kunci lain atau pilih kategori "Semua Publikasi".</p>
                        <button
                            onClick={() => {
                                setSelectedCategory('all');
                                setSearchQuery('');
                            }}
                            className="text-xs font-bold text-teal-800 hover:underline pt-2 block mx-auto"
                        >
                            Reset Filter Pencarian
                        </button>
                    </div>
                )}
            </section>

            {/* ==================== 4. LOKASI PUSAT RISET & PETA (SESUAI ATTACHMENT RISET-DESKTOP) ==================== */}
            <section className="bg-slate-100/70 border-t border-b border-slate-200 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    {/* 2-Column Location Box Matching Attachment Exactly */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                        {/* Left Card: Information Box with Pin */}
                        <div className="lg:col-span-5 bg-white rounded-3xl p-8 border border-slate-200/90 shadow-md flex flex-col justify-between space-y-6">
                            <div className="space-y-4">
                                <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-rose-600 uppercase tracking-wider">
                                    <i className="bi bi-geo-alt-fill text-rose-600"></i>
                                    <span>PUSAT RISET & LABORATORIUM</span>
                                </div>

                                <h3 className="text-2xl font-black text-slate-900 leading-tight">
                                    Artificial Intelligence Center Indonesia (AiCI)
                                </h3>

                                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                                    Gedung Lab. Riset Multidisiplin Pertamina FMIPA Universitas Indonesia Lantai 4, Pondok Cina, Kecamatan Beji, Kota Depok, Jawa Barat 16424.
                                </p>

                                <div className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                                    <p className="flex items-center gap-2.5">
                                        <i className="bi bi-clock-history text-slate-400"></i>
                                        <span>Jam Operasional: Senin - Jumat (08.30 - 17.00 WIB)</span>
                                    </p>
                                    <p className="flex items-center gap-2.5">
                                        <i className="bi bi-telephone text-slate-400"></i>
                                        <span>Telepon: +62 21 7888-2424 / 0821-1010-3938</span>
                                    </p>
                                    <p className="flex items-center gap-2 text-amber-500 font-bold">
                                        <i className="bi bi-star-fill text-amber-400"></i>
                                        <span>5.0 (18 Ulasan Laboratorium & Riset)</span>
                                    </p>
                                </div>
                            </div>

                            <div className="pt-4">
                                <a
                                    href="https://maps.google.com/?q=Artificial+Intelligence+Center+Indonesia+FMIPA+UI"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold px-5 py-3 rounded-xl border border-slate-300 shadow-sm transition-all hover:border-slate-400"
                                >
                                    <span>Buka Petunjuk Arah di Google Maps</span>
                                    <i className="bi bi-box-arrow-up-right text-[11px] text-teal-800"></i>
                                </a>
                            </div>
                        </div>

                        {/* Right Card: Google Map Embed with Pin Badge UI */}
                        <div className="lg:col-span-7 bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-md relative min-h-[340px] sm:min-h-[400px]">
                            <iframe
                                title="Peta Lokasi Riset AiCI FMIPA UI"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.2155797664426!2d106.82522737503889!3d-6.366162993623999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ec100aa7ec6d%3A0x6b4fb6c956dc8155!2sGedung%20Lab%20Riset%20Multidisiplin%20FMIPA%20UI!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={false}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="w-full h-full grayscale-[0.05] contrast-[1.03]"
                            ></iframe>

                            {/* Floating Map Pin Badge matching Screenshot riset-desktop */}
                            <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-lg border border-slate-200 flex items-center gap-3 pointer-events-auto">
                                <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center text-lg shrink-0 shadow-sm">
                                    <i className="bi bi-geo-alt-fill"></i>
                                </div>
                                <div>
                                    <h4 className="font-extrabold text-xs text-slate-900">
                                        AiCI FMIPA UI Depok
                                    </h4>
                                    <p className="text-[11px] text-slate-500">
                                        Kawasan Pusat Riset Sains & Teknologi UI
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== 5. FOOTER (IDENTIK DENGAN FIGMA SCREENSHOT RISET-DESKTOP) ==================== */}
            <footer className="bg-[#034d52] text-white pt-16 pb-8 border-t border-teal-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-teal-800/80">
                        {/* Col 1 & 2: Brand Logo & Information */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white text-[#034d52] flex items-center justify-center font-extrabold text-xl shadow-md">
                                    <span>Ai</span>
                                </div>
                                <div>
                                    <span className="font-extrabold text-lg tracking-wider block leading-none">AiCI</span>
                                </div>
                            </div>

                            <p className="text-xs text-teal-100/90 leading-relaxed max-w-sm">
                                Gedung Lab. Riset Multidisiplin Pertamina FMIPA UI Lt. 4, Kampus UI Depok, Jawa Barat 16424
                            </p>

                            <div className="space-y-1 text-xs text-teal-100/80 pt-1">
                                <p>Email: info@aici.id</p>
                                <p>Tel: +62 21 7888-2424</p>
                            </div>
                        </div>

                        {/* Col 3: Halaman (Matches Attachment) */}
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-200 mb-4">HALAMAN</h4>
                            <ul className="space-y-2.5 text-xs text-teal-100/90">
                                <li>
                                    <Link href="/landing" className="hover:text-white transition-colors">Home</Link>
                                </li>
                                <li>
                                    <Link href="/program" className="hover:text-white transition-colors">Program Pelatihan</Link>
                                </li>
                                <li>
                                    <Link href="/profil" className="hover:text-white transition-colors">Profil Lembaga</Link>
                                </li>
                                <li>
                                    <Link href="/fasilitas" className="hover:text-white transition-colors">Laboratorium & Fasilitas</Link>
                                </li>
                                <li>
                                    <Link href="/galeri" className="hover:text-white transition-colors">Publikasi Riset</Link>
                                </li>
                            </ul>
                        </div>

                        {/* Col 4: Download (Matches Attachment) */}
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-200 mb-4">DOWNLOAD</h4>
                            <ul className="space-y-2.5 text-xs text-teal-100/90">
                                <li><a href="#brosur" className="hover:text-white transition-colors">Brosur Program 2025</a></li>
                                <li><a href="#kurikulum" className="hover:text-white transition-colors">Kurikulum AI K-12</a></li>
                                <li><a href="#silabus" className="hover:text-white transition-colors">Silabus Profesional & Industri</a></li>
                                <li><a href="#laporan" className="hover:text-white transition-colors">Laporan Riset Tahunan</a></li>
                                <li><a href="#panduan" className="hover:text-white transition-colors">Panduan Kerjasama Institusi</a></li>
                            </ul>
                        </div>

                        {/* Col 5: Media Sosial (Matches Attachment) */}
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-200 mb-4">MEDIA SOSIAL</h4>
                            <p className="text-xs text-teal-100/80 mb-4 leading-relaxed">
                                Ikuti pembaruan terkini riset, workshop kecerdasan artifisial, dan agenda edukasi AiCI.
                            </p>
                            <div className="flex items-center gap-2.5">
                                <a href="https://aici.id" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-teal-800/80 hover:bg-teal-700 flex items-center justify-center text-teal-100 hover:text-white transition-colors">
                                    <i className="bi bi-globe"></i>
                                </a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-teal-800/80 hover:bg-teal-700 flex items-center justify-center text-teal-100 hover:text-white transition-colors">
                                    <i className="bi bi-share"></i>
                                </a>
                                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-teal-800/80 hover:bg-teal-700 flex items-center justify-center text-teal-100 hover:text-white transition-colors">
                                    <i className="bi bi-youtube"></i>
                                </a>
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-teal-800/80 hover:bg-teal-700 flex items-center justify-center text-teal-100 hover:text-white transition-colors">
                                    <i className="bi bi-newspaper"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Bottom copyright (Matches Attachment exactly) */}
                    <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-teal-200/60 gap-4">
                        <p>© 2025 Artificial Intelligence Center Indonesia (AiCI). Hak Cipta Dilindungi.</p>
                        <div className="flex items-center gap-6">
                            <a href="#kebijakan" className="hover:text-teal-200 transition-colors">Kebijakan Privasi</a>
                            <a href="#syarat" className="hover:text-teal-200 transition-colors">Syarat & Ketentuan</a>
                            <a href="#peta" className="hover:text-teal-200 transition-colors">Peta Situs</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
