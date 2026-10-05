import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicNavbar from '@/Components/PublicNavbar';
import PublicFooter from '@/Components/PublicFooter';

export default function Fasilitas() {
    const [activeFilter, setActiveFilter] = useState<'all' | 'ruangan' | 'modul' | 'media-kit' | 'robot'>('all');
    const [subFilter, setSubFilter] = useState<'all' | 'ruangan' | 'modul' | 'media-kit' | 'robot'>('ruangan');

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans flex flex-col selection:bg-[#0B6282] selection:text-white">
            <Head title="Fasilitas & Sarana Riset - Artificial Intelligence Center Indonesia (AiCI) FMIPA UI" />

            {/* Persistent Standard Institutional Navbar */}
            <PublicNavbar active="fasilitas" />

            {/* ==================== 2. HERO SECTION DENGAN CURVED TEAL HEADER ==================== */}
            <section className="relative bg-[#0B6282] text-white pt-16 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {/* Subtle background decoration */}
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>

                <div className="relative max-w-5xl mx-auto text-center flex flex-col items-center">
                    {/* Pill badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#08455c]/90 border border-white/20 text-xs font-semibold tracking-wide text-cyan-100 uppercase mb-4 shadow-sm">
                        <i className="bi bi-gear-wide-connected text-cyan-300"></i>
                        <span>SARANA & INFRASTRUKTUR RISET FMIPA UI</span>
                    </div>

                    {/* Main Title */}
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
                        Fasilitas yang disediakan
                    </h1>

                    {/* Subtitle */}
                    <p className="max-w-2xl text-cyan-50/90 text-sm sm:text-base leading-relaxed mb-8">
                        Fasilitas Utama Yang Mendukung Proses Pembelajaran Artificial Intelligence Berupa Ruangan, Modul, Media Kit, Serta Robot.
                    </p>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                        {[
                            { id: 'all', label: 'SEMUA FASILITAS' },
                            { id: 'ruangan', label: 'RUANGAN & LAB' },
                            { id: 'modul', label: 'MODUL STEAM' },
                            { id: 'media-kit', label: 'MEDIA KIT & SENSOR' },
                            { id: 'robot', label: 'ROBOT CERDAS' },
                        ].map((btn) => {
                            const isActive = activeFilter === btn.id;
                            return (
                                <button
                                    key={btn.id}
                                    onClick={() => setActiveFilter(btn.id as any)}
                                    className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
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

                {/* Bottom organic curve divider matching Figma */}
                <div
                    className="absolute -bottom-1 left-0 right-0 h-14 bg-slate-50"
                    style={{
                        clipPath: 'ellipse(70% 100% at 50% 100%)',
                    }}
                ></div>
            </section>

            {/* ==================== 3. FLOATING HIGHLIGHT CARD WITH 4 THUMBNAILS ==================== */}
            <section className="relative -mt-14 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <div className="bg-gradient-to-br from-[#EDF2F7] via-sky-50 to-[#e2f7ff] rounded-3xl p-6 sm:p-10 shadow-xl border border-sky-200/80">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        {/* Left column: Overview text */}
                        <div className="lg:col-span-5 space-y-5">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0B6282] text-white text-xs font-semibold tracking-wide uppercase shadow-sm">
                                <i className="bi bi-bank"></i>
                                <span>SARANA & INFRASTRUKTUR RISET FMIPA UI</span>
                            </div>

                            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                                Fasilitas & Infrastruktur Laboratorium AiCI
                            </h2>

                            <p className="text-slate-600 text-sm leading-relaxed">
                                Fasilitas Utama Yang Mendukung Proses Pembelajaran Artificial Intelligence Berupa Ruangan, Modul, Media Kit, Serta Robot cerdas modern untuk siswa jenjang SD hingga riset perguruan tinggi.
                            </p>

                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <a
                                    href="#detail-fasilitas"
                                    className="inline-flex items-center gap-2 bg-[#E62C29] hover:bg-[#d02522] text-white text-xs font-bold px-7 py-3 rounded-full shadow-md shadow-red-950/20 hover:shadow-lg transition-all uppercase tracking-wide"
                                >
                                    <span>JELAJAHI FASILITAS</span>
                                    <i className="bi bi-arrow-down-short text-base"></i>
                                </a>
                                <a
                                    href="https://wa.me/6282110103938?text=Halo%20AiCI%20FMIPA%20UI,%20kami%20ingin%20menjadwalkan%20kunjungan%20lab%20studi"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold px-6 py-3 rounded-full shadow-sm border border-slate-200 transition-all uppercase tracking-wide"
                                >
                                    <i className="bi bi-calendar-check text-[#0B6282]"></i>
                                    <span>JADWALKAN KUNJUNGAN LAB</span>
                                </a>
                            </div>
                        </div>

                        {/* Right column: 4 Grid Highlights */}
                        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Card 1: Modul STEAM */}
                            <div className="bg-white rounded-2xl p-3 shadow-md hover:shadow-lg transition-shadow border border-slate-100 flex flex-col group">
                                <div className="relative h-36 rounded-xl overflow-hidden mb-3 bg-slate-100">
                                    <img
                                        src="/images/landing/fasilitas-modul.jpg"
                                        alt="Modul STEAM AiCI"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src = '/images/landing/kids-coding.jpg';
                                        }}
                                    />
                                </div>
                                <div className="flex items-center justify-between px-1">
                                    <span className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">MODUL STEAM</span>
                                    <i className="bi bi-journal-bookmark text-[#0B6282] text-sm"></i>
                                </div>
                            </div>

                            {/* Card 2: 6 Lab Riset */}
                            <div className="bg-white rounded-2xl p-3 shadow-md hover:shadow-lg transition-shadow border border-slate-100 flex flex-col group">
                                <div className="relative h-36 rounded-xl overflow-hidden mb-3 bg-slate-100">
                                    <img
                                        src="/images/landing/fasilitas-lab.jpg"
                                        alt="6 Lab Riset Multidisiplin"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src = '/images/landing/robotics-lab.jpg';
                                        }}
                                    />
                                </div>
                                <div className="flex items-center justify-between px-1">
                                    <span className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">6 LAB RISET</span>
                                    <i className="bi bi-display text-teal-700 text-sm"></i>
                                </div>
                            </div>

                            {/* Card 3: Robot Cerdas */}
                            <div className="bg-white rounded-2xl p-3 shadow-md hover:shadow-lg transition-shadow border border-slate-100 flex flex-col group">
                                <div className="relative h-36 rounded-xl overflow-hidden mb-3 bg-slate-100">
                                    <img
                                        src="/images/landing/fasilitas-robot.jpg"
                                        alt="Robot Cerdas Humanoid"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src = '/images/landing/robotics-lab.jpg';
                                        }}
                                    />
                                </div>
                                <div className="flex items-center justify-between px-1">
                                    <span className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">ROBOT CERDAS</span>
                                    <i className="bi bi-robot text-teal-700 text-sm"></i>
                                </div>
                            </div>

                            {/* Card 4: Media Kit & Sensor */}
                            <div className="bg-white rounded-2xl p-3 shadow-md hover:shadow-lg transition-shadow border border-slate-100 flex flex-col group">
                                <div className="relative h-36 rounded-xl overflow-hidden mb-3 bg-slate-100">
                                    <img
                                        src="/images/landing/fasilitas-kit.jpg"
                                        alt="Media Kit & Sensor"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src = '/images/landing/virtual-tour.jpg';
                                        }}
                                    />
                                </div>
                                <div className="flex items-center justify-between px-1">
                                    <span className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">MEDIA KIT & SENSOR</span>
                                    <i className="bi bi-cpu text-teal-700 text-sm"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== 4. SECTION FILTER SUB-NAV (PILLS) ==================== */}
            <div id="detail-fasilitas" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
                <div className="flex flex-wrap items-center justify-center gap-3">
                    {[
                        { id: 'ruangan', label: 'RUANGAN' },
                        { id: 'modul', label: 'MODUL' },
                        { id: 'media-kit', label: 'MEDIA KIT' },
                        { id: 'robot', label: 'ROBOT' },
                    ].map((tab) => {
                        const isSubActive = subFilter === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setSubFilter(tab.id as any)}
                                className={`px-7 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-wider transition-all duration-200 border ${
                                    isSubActive
                                        ? 'bg-[#0B6282] text-white border-[#0B6282] shadow-sm'
                                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                                }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ==================== 5. DETAILED CATEGORY SECTIONS (FIGMA SCREENSHOTS) ==================== */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 mb-20">

                {/* --- ITEM 1: RUANGAN --- */}
                {(subFilter === 'all' || subFilter === 'ruangan') && (
                    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            {/* Left: Image with pagination dots */}
                            <div className="lg:col-span-6 relative">
                                <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-100 h-72 sm:h-80 relative group">
                                    <img
                                        src="/images/landing/seminar-auditorium.jpg"
                                        alt="Laboratorium Komputasi & AI FMIPA UI"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {/* Virtual tour tag */}
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-slate-700 uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                                        <span className="w-2 h-2 rounded-full bg-teal-600 animate-pulse"></span>
                                        <span>Lab Komputasi - Fasilitas Utama</span>
                                    </div>
                                    {/* Pagination dots indicator */}
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                        <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
                                        <span className="w-2 h-2 rounded-full bg-white/50"></span>
                                        <span className="w-2 h-2 rounded-full bg-white/50"></span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Detailed Ruangan Content */}
                            <div className="lg:col-span-6 space-y-4">
                                <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-slate-800">
                                    <i className="bi bi-display text-teal-800"></i>
                                    <span>RUANGAN</span>
                                </div>

                                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                                    Nyaman dalam Lingkungan Universitas Indonesia
                                </h3>

                                <p className="text-slate-600 text-sm leading-relaxed">
                                    Laboratorium AI yang tersedia sebanyak 6 lab masing-masing 2 lab untuk SD/MI, 1 lab untuk SMP/MTs, 1 lab untuk SMA/MA, 1 lab untuk SMK, serta 1 lab berupa exhibition room untuk tingkat Perguruan Tinggi. Seluruh laboratorium AI dilengkapi dengan koneksi internet berkecepatan tinggi, AC, smart projector/screen, serta fasilitas penunjang pembelajaran mutakhir lainnya.
                                </p>

                                {/* 4 Feature Pills in 2x2 Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center shrink-0 text-sm">
                                            <i className="bi bi-sliders"></i>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-900">6 Lab AI Terpisah Sesuai Jenjang</h4>
                                            <p className="text-[11px] text-slate-500">SD, SMP, SMA, SMK & Mahasiswa</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center shrink-0 text-sm">
                                            <i className="bi bi-people"></i>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-900">Kapasitas 30+ Peserta / Lab</h4>
                                            <p className="text-[11px] text-slate-500">Ergonomis untuk fokus belajar</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center shrink-0 text-sm">
                                            <i className="bi bi-wifi"></i>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-900">Gigabit Fiber & Smart Screen</h4>
                                            <p className="text-[11px] text-slate-500">Koneksi stabil tanpa latency</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center shrink-0 text-sm">
                                            <i className="bi bi-geo-alt"></i>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-900">Lt. 4 Riset Multidisiplin UI</h4>
                                            <p className="text-[11px] text-slate-500">Gedung Pertamina FMIPA UI</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- ITEM 2: MODUL (STEAM) --- */}
                {(subFilter === 'all' || subFilter === 'modul') && (
                    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            {/* Left: Detailed Modul Content */}
                            <div className="lg:col-span-6 space-y-4 order-2 lg:order-1">
                                <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-slate-800">
                                    <i className="bi bi-journal-bookmark text-teal-800"></i>
                                    <span>MODUL</span>
                                </div>

                                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                                    Berlandaskan STEAM
                                </h3>

                                <p className="text-slate-600 text-sm leading-relaxed">
                                    <em>Science, Technology, Engineering, Art, and Math</em> (STEAM) menjadi komponen penting untuk dikembangkan pada peserta didik dan menjadi landasan untuk modul pembelajaran. Modul yang disediakan lengkap dan berjenjang tersedia untuk berbagai tingkatan sekolah formal dari SD/MI, SMP/MTs, SMA/MA/SMK hingga kurikulum riset terapan Kampus Merdeka.
                                </p>

                                <div className="space-y-3 pt-2">
                                    <div className="flex items-start gap-3">
                                        <i className="bi bi-check-circle-fill text-teal-700 text-base mt-0.5"></i>
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-900">Kurikulum Terstruktur & Terakreditasi</h4>
                                            <p className="text-xs text-slate-500">Disusun oleh dosen, peneliti sains komputer, dan pakar pedagogi FMIPA Universitas Indonesia.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <i className="bi bi-file-earmark-text-fill text-teal-700 text-base mt-0.5"></i>
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-900">Worksheet Praktikum Mandiri & Kolaboratif</h4>
                                            <p className="text-xs text-slate-500">Lengkap dengan tantangan studi kasus AI harian, lembar eksperimen, dan panduan kode visual.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Modul Books Mockup */}
                            <div className="lg:col-span-6 order-1 lg:order-2">
                                <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-100 h-72 sm:h-80 relative group bg-teal-900/5">
                                    <img
                                        src="/images/landing/fasilitas-modul.jpg"
                                        alt="Modul STEAM Kurikulum AiCI FMIPA UI"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src = '/images/landing/kids-coding.jpg';
                                        }}
                                    />
                                    {/* Pagination dots indicator */}
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                        <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
                                        <span className="w-2 h-2 rounded-full bg-white/50"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- ITEM 3: MEDIA KIT --- */}
                {(subFilter === 'all' || subFilter === 'media-kit') && (
                    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            {/* Left: Media Kit Photo with uKit Box */}
                            <div className="lg:col-span-6 relative">
                                <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-100 h-72 sm:h-80 relative group">
                                    <img
                                        src="/images/landing/fasilitas-kit.jpg"
                                        alt="uKit & Explorer Kit AiCI"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src = '/images/landing/robotics-lab.jpg';
                                        }}
                                    />
                                    {/* Pagination dots indicator */}
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                        <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
                                        <span className="w-2 h-2 rounded-full bg-white/50"></span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Media Kit Content */}
                            <div className="lg:col-span-6 space-y-4">
                                <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-slate-800">
                                    <i className="bi bi-cpu text-teal-800"></i>
                                    <span>MEDIA KIT</span>
                                </div>

                                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                                    Tersedia Lengkap & Interaktif
                                </h3>

                                <p className="text-slate-600 text-sm leading-relaxed">
                                    Media pembelajaran berupa kit disesuaikan dengan modul masing-masing tingkatan sekolah. Membantu menumbuhkan Kreatifitas dan Design Thinking serta mampu melatih saraf motorik peserta didik melalui eksperimen langsung (hands-on experiment) perangkat elektronika & mikrokontroler ramah anak.
                                </p>

                                {/* 2 Feature Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center shrink-0 text-sm">
                                            <i className="bi bi-box-seam"></i>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-900">uKit & Explorer Box</h4>
                                            <p className="text-[11px] text-slate-500">Modul motor servo, LED matriks, buzzer, dan sensor jarak terintegrasi.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center shrink-0 text-sm">
                                            <i className="bi bi-code-square"></i>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-slate-900">Visual Block & Python</h4>
                                            <p className="text-[11px] text-slate-500">Transisi mulus dari pemrograman visual blok (Scratch-like) ke sintaks Python.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- ITEM 4: ROBOT (HUMANOID & CERDAS) --- */}
                {(subFilter === 'all' || subFilter === 'robot') && (
                    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                            {/* Left: Detailed Robot Content */}
                            <div className="lg:col-span-6 space-y-4 order-2 lg:order-1">
                                <div className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-slate-800">
                                    <i className="bi bi-robot text-teal-800"></i>
                                    <span>ROBOT</span>
                                </div>

                                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                                    Pengalaman Belajar dengan Robot yang Dilengkapi AI
                                </h3>

                                <p className="text-slate-600 text-sm leading-relaxed">
                                    Selain kit, AiCI juga melengkapi media pembelajaran dengan beberapa jenis humanoid robot yang memungkinkan peserta berinteraksi secara langsung, memprogram suara, pengenalan wajah (facial recognition), sensor visi komputer, hingga koreografi gerak motorik multi-axis.
                                </p>

                                {/* 4 Feature Pills in 2x2 Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                                    <div className="flex items-center gap-2.5">
                                        <i className="bi bi-eye text-teal-700 text-sm"></i>
                                        <span className="text-xs font-semibold text-slate-800">Humanoid Vision Tracking</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <i className="bi bi-mic text-teal-700 text-sm"></i>
                                        <span className="text-xs font-semibold text-slate-800">Voice & NLP Processor</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <i className="bi bi-arrow-left-right text-teal-700 text-sm"></i>
                                        <span className="text-xs font-semibold text-slate-800">UBTECH Sensor Package</span>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <i className="bi bi-compass text-teal-700 text-sm"></i>
                                        <span className="text-xs font-semibold text-slate-800">Autonomous Motion Planning</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Display Robot Showcase */}
                            <div className="lg:col-span-6 order-1 lg:order-2">
                                <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-100 h-72 sm:h-80 relative group bg-teal-900/5">
                                    <img
                                        src="/images/landing/fasilitas-display.jpg"
                                        alt="Showcase Robot Humanoid & Sensor AiCI FMIPA UI"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src = '/images/landing/robotics-lab.jpg';
                                        }}
                                    />
                                    {/* Pagination dots indicator */}
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                        <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
                                        <span className="w-2 h-2 rounded-full bg-white/50"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* ==================== 6. LAB VISIT & DEMO ON-SITE BANNER (LIGHT CARD) ==================== */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-gradient-to-r from-sky-50 via-teal-50/60 to-cyan-50 border border-cyan-100 shadow-sm">
                    {/* Background glow circle */}
                    <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-teal-200/30 blur-3xl pointer-events-none"></div>

                    <div className="relative z-10 max-w-3xl space-y-4">
                        <div className="inline-flex items-center gap-2 text-teal-800 text-xs font-bold tracking-widest uppercase">
                            <i className="bi bi-eye"></i>
                            <span>LAB VISIT & DEMO ON-SITE</span>
                        </div>

                        <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                            Ingin Mengunjungi Laboratorium Riset AiCI FMIPA UI?
                        </h3>

                        <p className="text-slate-600 text-sm leading-relaxed">
                            Kami membuka kesempatan kunjungan studi (lab visit), hands-on demo alat interaktif, serta sesi workshop on-site bagi institusi sekolah formal, dinas pendidikan, serta korporasi.
                        </p>

                        <div className="flex flex-wrap items-center gap-4 pt-2">
                            <a
                                href="https://wa.me/6282110103938?text=Halo%20AiCI%20FMIPA%20UI,%20kami%20ingin%20reservasi%20kunjungan%20lab%20studi"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold px-6 py-3 rounded-full shadow-sm border border-slate-200 uppercase tracking-wide transition-all"
                            >
                                <i className="bi bi-calendar-check text-teal-700"></i>
                                <span>RESERVASI KUNJUNGAN LAB</span>
                            </a>
                            <Link
                                href="/landing#tour"
                                className="inline-flex items-center gap-2 text-teal-900 hover:text-teal-700 text-xs font-bold uppercase tracking-wider transition-colors py-3"
                            >
                                <i className="bi bi-compass"></i>
                                <span>MULAI VIRTUAL TOUR 360°</span>
                                <i className="bi bi-arrow-right"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== 7. INSTITUTIONAL COOPERATION CTA BANNER ==================== */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <div className="bg-[#0B6282] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
                    <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

                    <div className="relative z-10 max-w-3xl space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-cyan-200 text-xs font-bold tracking-wider uppercase">
                            <span>KERJASAMA INSTITUSI & SEKOLAH</span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                            Tertarik Menyelenggarakan Program AI di Sekolah atau Institusi Anda?
                        </h2>

                        <p className="text-cyan-50/90 text-sm leading-relaxed">
                            Dapatkan silabus kurikulum lengkap, proposal kemitraan sekolah, serta jadwal kunjungan workshop praktikum AI bersama tutor departemen sains FMIPA Universitas Indonesia.
                        </p>

                        <div className="flex flex-wrap items-center gap-4 pt-2">
                            <a
                                href="https://wa.me/6282110103938?text=Halo%20AiCI%20FMIPA%20UI,%20kami%20tertarik%20bekerjasama%20untuk%20program%20sekolah%20kami"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-[#E62C29] hover:bg-[#d02522] text-white text-xs font-bold px-7 py-3 rounded-full shadow-md shadow-red-950/20 hover:shadow-lg transition-all uppercase tracking-wide"
                            >
                                <i className="bi bi-whatsapp"></i>
                                <span>HUBUNGI TIM KONSULTAN AICI</span>
                            </a>
                            <a
                                href="#katalog"
                                onClick={(e) => {
                                    e.preventDefault();
                                    alert('Katalog kurikulum lengkap dapat diunduh melalui kontak resmi AiCI FMIPA UI.');
                                }}
                                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-6 py-3 rounded-full border border-white/20 transition-all uppercase tracking-wide"
                            >
                                <i className="bi bi-file-earmark-pdf"></i>
                                <span>DOWNLOAD KATALOG LENGKAP (PDF)</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== 8. CAMPUS MAP LOCATION CARD ==================== */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                                <i className="bi bi-geo-alt-fill text-xl"></i>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-base">Lokasi Artificial Intelligence Center Indonesia (AiCI)</h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Gedung Lab. Riset Multidisiplin Pertamina FMIPA UI Lt. 4, Universitas Indonesia, Depok, Jawa Barat 16424
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-200">
                                <i className="bi bi-star-fill text-amber-500"></i>
                                <span>5.0</span>
                            </div>
                            <a
                                href="https://maps.google.com/?q=Artificial+Intelligence+Center+Indonesia+FMIPA+UI"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1 border border-teal-800/20 px-3 py-1.5 rounded-full hover:bg-teal-50 transition-colors"
                            >
                                <span>Buka di Google Maps</span>
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
        </div>
    );
}
