import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicNavbar from '@/Components/PublicNavbar';
import PublicFooter from '@/Components/PublicFooter';

interface GalleryItem {
    id: number;
    category: 'pelatihan' | 'mou' | 'msib' | 'workshop';
    categoryLabel: string;
    categoryBadgeColor: string;
    metaBadge: string;
    metaBadgeIcon?: string;
    dateOrBadge: string;
    title: string;
    description: string;
    locationOrTopic: string;
    locationIcon: string;
    image: string;
    fallbackImage: string;
}

export default function Galeri() {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);

    const galleryData: GalleryItem[] = [
        {
            id: 1,
            category: 'mou',
            categoryLabel: 'Seremonial & MoU',
            categoryBadgeColor: 'bg-sky-600 text-white',
            metaBadge: '23 Sept 2021',
            metaBadgeIcon: 'bi-calendar3',
            dateOrBadge: '23 Sept 2021',
            title: 'Grand launching AiCI',
            description: 'Grand launching AiCI dilakukan oleh dekan Fakultas MIPA Universitas Indonesia pada hari Kamis, 23 September 2021',
            locationOrTopic: 'Gd. Lab Multidisiplin FMIPA UI',
            locationIcon: 'bi-geo-alt',
            image: '/images/landing/galeri-launching.jpg',
            fallbackImage: '/images/landing/seminar-auditorium.jpg',
        },
        {
            id: 2,
            category: 'pelatihan',
            categoryLabel: 'Pembelajaran Siswa',
            categoryBadgeColor: 'bg-emerald-600 text-white',
            metaBadge: 'Kelas Reguler',
            metaBadgeIcon: 'bi-person-video3',
            dateOrBadge: 'Batch Reguler',
            title: 'AI Class',
            description: 'Pelatihan yang diselenggarakan secara regular untuk siswa-siswi SD / MI, SMP / MTs, SMA / MA / SMK',
            locationOrTopic: 'Hands-on Robotics & Code',
            locationIcon: 'bi-laptop',
            image: '/images/landing/galeri-workshop.jpg',
            fallbackImage: '/images/landing/kids-coding.jpg',
        },
        {
            id: 3,
            category: 'mou',
            categoryLabel: 'Kemitraan Sekolah',
            categoryBadgeColor: 'bg-blue-600 text-white',
            metaBadge: '29 Nov 2021',
            metaBadgeIcon: 'bi-calendar3',
            dateOrBadge: '29 Nov 2021',
            title: 'Kerjasama dengan SIT Nurul Fikri',
            description: 'Penandatanganan naskah Kerjasama pengembangan pembelajaran AI dengan Yayasan SIT Nurul Fikri pada Senin, 29 November 2021',
            locationOrTopic: 'MoU Kurikulum AI Sekolah',
            locationIcon: 'bi-file-earmark-text',
            image: '/images/landing/galeri-mou.jpg',
            fallbackImage: '/images/landing/robotics-lab.jpg',
        },
        {
            id: 4,
            category: 'workshop',
            categoryLabel: 'Pemerintah & Industri',
            categoryBadgeColor: 'bg-purple-600 text-white',
            metaBadge: 'Dit. Mitras DUDI',
            metaBadgeIcon: 'bi-bank2',
            dateOrBadge: 'Mitra Industri',
            title: 'Workshop Kemendikbud',
            description: 'Workshop yang diselenggarakan atas kerjasama AiCI dengan Direktorat Kemitraan dan Penyelarasan Dunia Usaha dan Dunia Industri',
            locationOrTopic: 'Vokasi & Link and Match',
            locationIcon: 'bi-mortarboard',
            image: '/images/landing/seminar-auditorium.jpg',
            fallbackImage: '/images/landing/galeri-hero.jpg',
        },
        {
            id: 5,
            category: 'workshop',
            categoryLabel: 'Kolaborasi Industri',
            categoryBadgeColor: 'bg-amber-600 text-white',
            metaBadge: 'Corporate Training',
            metaBadgeIcon: 'bi-briefcase',
            dateOrBadge: 'Epson Partnership',
            title: 'Workshop Epson',
            description: 'Workshop yang diselenggarakan atas Kerjasama AiCI dengan PT Epson Indonesia yang bertujuan untuk memperkenalkan pembelajaran AI',
            locationOrTopic: 'Teknologi Aplikasi Epson & AI',
            locationIcon: 'bi-printer',
            image: '/images/landing/galeri-epson.jpg',
            fallbackImage: '/images/landing/fasilitas-kit.jpg',
        },
        {
            id: 6,
            category: 'msib',
            categoryLabel: 'Kampus Merdeka / MSIB',
            categoryBadgeColor: 'bg-indigo-600 text-white',
            metaBadge: 'Magang & Studi Independen',
            metaBadgeIcon: 'bi-award',
            dateOrBadge: 'MSIB Batch 6',
            title: 'Kegiatan Pembukaan MBKM',
            description: "Pembukaan Program Studi Independen Bersertifikat 'Internship Program For Indonesian Artificial Intellegence (AI) Talents'",
            locationOrTopic: 'Indonesian AI Talents Cohort',
            locationIcon: 'bi-people',
            image: '/images/landing/galeri-mbkm.jpg',
            fallbackImage: '/images/landing/prog-aitalents.jpg',
        },
    ];

    const filteredItems = galleryData.filter((item) => {
        if (selectedCategory === 'all') return true;
        if (selectedCategory === 'pelatihan') return item.category === 'pelatihan' || item.category === 'workshop';
        if (selectedCategory === 'mou') return item.category === 'mou';
        if (selectedCategory === 'msib') return item.category === 'msib';
        return true;
    });

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans flex flex-col selection:bg-[#0B6282] selection:text-white">
            <Head title="Galeri & Dokumentasi Kegiatan - Artificial Intelligence Center Indonesia (AiCI) FMIPA UI" />

            {/* Persistent Standard Institutional Navbar */}
            <PublicNavbar active="galeri" />

            {/* ==================== 2. HERO SECTION ==================== */}
            <section className="relative bg-[#0B6282] text-white pt-14 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
                    {/* Left: Featured Image Card with Glow & Badges */}
                    <div className="lg:col-span-6">
                        <div className="relative rounded-3xl p-2 bg-gradient-to-tr from-cyan-400/40 via-sky-300/20 to-transparent shadow-2xl">
                            <div className="relative rounded-2xl overflow-hidden shadow-inner h-80 sm:h-96 group bg-slate-900">
                                <img
                                    src="/images/landing/galeri-hero.jpg"
                                    alt="Laboratorium Robotika & AI AiCI FMIPA UI"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.92]"
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src = '/images/landing/robotics-lab.jpg';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                                {/* Floating badges inside image */}
                                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
                                    <div className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-medium text-cyan-200 border border-white/10">
                                        <i className="bi bi-robot text-cyan-300"></i>
                                        <span>Laboratorium Praktik Multidisiplin FMIPA UI</span>
                                    </div>
                                    <div className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-semibold text-amber-300 border border-white/10">
                                        <span>Tahun Aktif 2021 - 2026</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Title, Subtitle, and 2 Stat Cards */}
                    <div className="lg:col-span-6 space-y-6">
                        {/* Pill badge with yellow dot */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-semibold tracking-wide text-cyan-100 uppercase shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                            <span>DOKUMENTASI RESMI AiCI UI</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                            Galeri
                        </h1>

                        <p className="text-cyan-50/90 text-sm sm:text-base leading-relaxed max-w-xl">
                            Dokumentasi Beberapa Kegiatan Yang Pernah Dilakukan Di Artificial Intelligence Center Indonesia (AiCI).
                        </p>

                        {/* 2 Stat Cards matching Figma */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                            <div className="bg-[#08455c]/85 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex items-center gap-3.5 shadow-sm">
                                <div className="w-11 h-11 rounded-xl bg-white/10 text-cyan-300 flex items-center justify-center shrink-0 text-xl border border-white/10">
                                    <i className="bi bi-people-fill"></i>
                                </div>
                                <div>
                                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-200 block">
                                        TOTAL PESERTA
                                    </span>
                                    <span className="text-base sm:text-lg font-black text-white">
                                        5,000+ Siswa & Mahasiswa
                                    </span>
                                </div>
                            </div>

                            <div className="bg-[#08455c]/85 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex items-center gap-3.5 shadow-sm">
                                <div className="w-11 h-11 rounded-xl bg-white/10 text-cyan-300 flex items-center justify-center shrink-0 text-xl border border-white/10">
                                    <i className="bi bi-building-check"></i>
                                </div>
                                <div>
                                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-200 block">
                                        MITRA INDUSTRI & SEKOLAH
                                    </span>
                                    <span className="text-base sm:text-lg font-black text-white">
                                        40+ Institusi Kemitraan
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom organic curve wave divider */}
                <div
                    className="absolute -bottom-1 left-0 right-0 h-14 bg-slate-50"
                    style={{
                        clipPath: 'ellipse(70% 100% at 50% 100%)',
                    }}
                ></div>
            </section>

            {/* ==================== 3. FILTER TABS & SECTION HEADER ==================== */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            Koleksi Dokumentasi Terpilih
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">
                            Eksplorasi jejak rekam program pelatihan, riset, dan kerjasama edukasi AI.
                        </p>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap items-center gap-2">
                        {[
                            { id: 'all', label: 'Semua Kegiatan' },
                            { id: 'pelatihan', label: 'Pelatihan & Workshop' },
                            { id: 'mou', label: 'Kunjungan & MoU' },
                            { id: 'msib', label: 'Studi Independen (MSIB)' },
                        ].map((tab) => {
                            const isActive = selectedCategory === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setSelectedCategory(tab.id);
                                        setCurrentPage(1);
                                    }}
                                    className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                                        isActive
                                            ? 'bg-[#eab308] text-white shadow-md shadow-amber-500/20 scale-105'
                                            : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-sm'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ==================== 4. GALLERY CARDS (GRID 2 COLUMNS) ==================== */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredItems.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group"
                        >
                            {/* Card Image with badges */}
                            <div className="relative h-64 sm:h-72 overflow-hidden bg-slate-900">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src = item.fallbackImage;
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>

                                {/* Top Badge Left: Category */}
                                <div className="absolute top-4 left-4">
                                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase shadow-sm ${item.categoryBadgeColor}`}>
                                        {item.categoryLabel}
                                    </span>
                                </div>

                                {/* Top Badge Right: Date/Meta */}
                                <div className="absolute top-4 right-4">
                                    <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-slate-700 shadow-sm border border-slate-100">
                                        {item.metaBadgeIcon && <i className={`bi ${item.metaBadgeIcon} text-teal-800`}></i>}
                                        <span>{item.metaBadge}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between space-y-4">
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight group-hover:text-teal-800 transition-colors">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mt-2.5">
                                        {item.description}
                                    </p>
                                </div>

                                {/* Card Footer */}
                                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                                        <i className={`bi ${item.locationIcon} text-teal-700 text-sm`}></i>
                                        <span className="truncate max-w-[200px] sm:max-w-[240px]">{item.locationOrTopic}</span>
                                    </div>
                                    <button
                                        onClick={() => setPreviewItem(item)}
                                        className="text-teal-800 hover:text-teal-950 font-bold flex items-center gap-1 group/btn transition-colors shrink-0"
                                    >
                                        <span>Detail Foto</span>
                                        <i className="bi bi-arrow-right text-xs group-hover/btn:translate-x-1 transition-transform"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-center gap-2 mt-12">
                    <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center text-sm font-bold disabled:opacity-40 transition-colors shadow-sm"
                    >
                        <i className="bi bi-chevron-left"></i>
                    </button>
                    {[1, 2, 3].map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-xl text-sm font-extrabold transition-all shadow-sm ${
                                currentPage === page
                                    ? 'bg-[#0B6282] text-white shadow-[#0B6282]/20'
                                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage(Math.min(3, currentPage + 1))}
                        disabled={currentPage === 3}
                        className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 flex items-center justify-center text-sm font-bold disabled:opacity-40 transition-colors shadow-sm"
                    >
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </div>
            </section>

            {/* ==================== 5. CTA BANNER: KUNJUNGAN STUDI & PELATIHAN ==================== */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-[#0B6282] text-white shadow-xl">
                    {/* Camera Watermark Vector */}
                    <div className="absolute right-6 -bottom-6 opacity-10 pointer-events-none text-[160px] text-white leading-none">
                        <i className="bi bi-camera"></i>
                    </div>

                    <div className="relative z-10 max-w-3xl space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-cyan-200 text-xs font-bold tracking-wider uppercase border border-white/15">
                            <i className="bi bi-tag-fill text-[11px]"></i>
                            <span>KEMITRAAN & KUNJUNGAN EDUKASI</span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                            Tertarik Mengadakan Kunjungan Studi atau Pelatihan AI Bersama Kami?
                        </h2>

                        <p className="text-cyan-50/90 text-sm sm:text-base leading-relaxed">
                            AiCI membuka peluang kolaborasi seluas-luasnya untuk sekolah, universitas, dinas pemerintahan, serta korporasi industri di seluruh Indonesia.
                        </p>

                        <div className="flex flex-wrap items-center gap-4 pt-2">
                            <a
                                href="https://wa.me/6282110103938?text=Halo%20AiCI%20FMIPA%20UI,%20kami%20ingin%20berkolaborasi%20untuk%20pelatihan%20atau%20kunjungan%20studi"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2.5 bg-[#E62C29] hover:bg-[#d02522] text-white text-xs font-bold px-7 py-3.5 rounded-full shadow-md shadow-red-950/20 hover:shadow-lg transition-all uppercase tracking-wide"
                            >
                                <i className="bi bi-whatsapp text-sm"></i>
                                <span>Hubungi Tim AiCI</span>
                            </a>
                            <a
                                href="#unduh-portofolio"
                                onClick={(e) => {
                                    e.preventDefault();
                                    alert('Portofolio kegiatan dan panduan kemitraan lengkap dapat diminta langsung via WhatsApp tim humas AiCI FMIPA UI.');
                                }}
                                className="inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-6 py-3.5 rounded-full border border-white/25 transition-all uppercase tracking-wide"
                            >
                                <i className="bi bi-file-earmark-arrow-down text-sm"></i>
                                <span>Unduh Portofolio Kegiatan</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== 6. CAMPUS MAP LOCATION CARD ==================== */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center shrink-0 border border-teal-100">
                                <i className="bi bi-map-fill text-lg"></i>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-base">Lokasi Laboratorium & Pusat Riset AiCI</h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Universitas Indonesia, Kampus Depok, Jawa Barat
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-200">
                                <i className="bi bi-star-fill text-amber-500"></i>
                                <span>5.0 (18 ulasan)</span>
                            </div>
                            <a
                                href="https://maps.google.com/?q=Artificial+Intelligence+Center+Indonesia+FMIPA+UI"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1 border border-teal-800/20 px-3 py-1.5 rounded-full hover:bg-teal-50 transition-colors"
                            >
                                <span>Buka Peta Besar</span>
                                <i className="bi bi-box-arrow-up-right text-[10px]"></i>
                            </a>
                        </div>
                    </div>

                    {/* Google Maps Embed iframe */}
                    <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden shadow-inner border border-slate-200">
                        <iframe
                            title="Peta Lokasi AiCI FMIPA UI"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.2155797664426!2d106.82522737503889!3d-6.366162993623999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ec100aa7ec6d%3A0x6b4fb6c956dc8155!2sGedung%20Lab%20Riset%20Multidisiplin%20FMIPA%20UI!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={false}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="w-full h-full grayscale-[0.15] contrast-[1.05]"
                        ></iframe>
                    </div>
                </div>
            </section>

            {/* Persistent Standard Institutional Public Footer */}
            <PublicFooter />

            {/* ==================== 8. PHOTO DETAIL LIGHTBOX MODAL ==================== */}
            {previewItem && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn"
                    onClick={() => setPreviewItem(null)}
                >
                    <div
                        className="bg-white rounded-3xl overflow-hidden max-w-3xl w-full shadow-2xl relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="relative h-80 sm:h-96 bg-black">
                            <img
                                src={previewItem.image}
                                alt={previewItem.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src = previewItem.fallbackImage;
                                }}
                            />
                            <button
                                onClick={() => setPreviewItem(null)}
                                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black/90 flex items-center justify-center transition-colors"
                            >
                                <i className="bi bi-x-lg text-sm"></i>
                            </button>
                        </div>
                        <div className="p-6 sm:p-8 space-y-3">
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${previewItem.categoryBadgeColor}`}>
                                    {previewItem.categoryLabel}
                                </span>
                                <span className="text-xs text-slate-500 font-medium">
                                    {previewItem.dateOrBadge}
                                </span>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900">{previewItem.title}</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">{previewItem.description}</p>
                            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                                <span className="flex items-center gap-1.5 font-medium">
                                    <i className={`bi ${previewItem.locationIcon} text-teal-800`}></i>
                                    {previewItem.locationOrTopic}
                                </span>
                                <a
                                    href="https://wa.me/6282110103938"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-teal-800 hover:bg-teal-900 text-white font-bold px-4 py-2 rounded-full transition-colors"
                                >
                                    Tanya Info Kegiatan
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
