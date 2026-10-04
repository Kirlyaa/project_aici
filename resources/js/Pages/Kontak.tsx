import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Kontak() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const [selectedTopic, setSelectedTopic] = useState<string>('Kemitraan Sekolah');

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const faqList = [
        {
            q: 'Berapa lama proses konfirmasi kerjasama?',
            a: 'Tim kemitraan kami akan merespons dalam 1x24 jam kerja dengan mengirimkan ringkasan modul serta opsi jadwal pertemuan konsultasi daring/luring.',
        },
        {
            q: 'Apakah menerima kunjungan studi sekolah luar Jabodetabek?',
            a: 'Ya, AiCI secara rutin menyambut kunjungan praktikum dari berbagai provinsi dengan slot pemesanan minimal 2 pekan sebelum tanggal pelaksanaan.',
        },
        {
            q: 'Apakah tersedia program pelatihan online untuk guru?',
            a: 'Tersedia rangkaian AI Masterclass & Prompt Engineering bersertifikasi resmi UI yang diadakan secara hybrid maupun asynchronous.',
        },
    ];

    const getWhatsAppUrl = (topic: string) => {
        const text = encodeURIComponent(
            `Halo Admin AiCI FMIPA UI, saya ingin berkonsultasi mengenai: ${topic}. Mohon informasi dan prosedur tindak lanjutnya.`
        );
        return `https://wa.me/6282110103938?text=${text}`;
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans flex flex-col selection:bg-teal-500 selection:text-white">
            <Head title="Kontak & Layanan Konsultasi - Artificial Intelligence Center Indonesia (AiCI) FMIPA UI" />

            {/* ==================== 1. TOP NAVBAR ==================== */}
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    {/* Brand */}
                    <div className="flex items-center gap-3.5">
                        <Link href="/landing" className="flex items-center gap-3 group">
                            <div className="w-11 h-11 rounded-xl bg-teal-800 text-white flex items-center justify-center font-black text-xl shadow-md shadow-teal-900/20 group-hover:scale-105 transition-transform">
                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2a4 4 0 0 0-4 4v1a4 4 0 0 0-4 4 4 4 0 0 0 4 4" />
                                    <path d="M12 2a4 4 0 0 1 4 4v1a4 4 0 0 1 4 4 4 4 0 0 1-4 4" />
                                    <path d="M12 6v12" />
                                </svg>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-extrabold text-base tracking-wider text-teal-950 uppercase leading-none">AiCI</span>
                                <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest mt-1">
                                    Artificial Intelligence Center Indonesia
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
                        <Link href="/riset" className="hover:text-teal-800 transition-colors">Riset</Link>
                        {/* Active Item with Red Underline */}
                        <div className="relative py-2 text-teal-950 font-bold">
                            <span>Kontak</span>
                            <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-red-600 rounded-full"></span>
                        </div>
                    </nav>

                    {/* CTA Actions */}
                    <div className="flex items-center gap-3">
                        <a
                            href={getWhatsAppUrl('Konsultasi Umum AiCI')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-[#d32f2f] hover:bg-[#b71c1c] text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-sm hover:shadow transition-all uppercase tracking-wide"
                        >
                            <i className="bi bi-headset text-sm"></i>
                            <span>KONSULTASI AI</span>
                        </a>
                        <Link
                            href="/login"
                            className="w-9 h-9 rounded-full border border-teal-800/30 flex items-center justify-center text-teal-900 hover:bg-teal-50 transition-colors"
                            title="Login"
                        >
                            <i className="bi bi-person-circle text-lg"></i>
                        </Link>
                    </div>
                </div>
            </header>

            {/* ==================== 2. HERO SECTION ==================== */}
            <section className="relative bg-[#034d52] text-white pt-14 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]"></div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
                    {/* Left: Photo Card with badges */}
                    <div className="lg:col-span-6">
                        <div className="relative rounded-3xl p-2 bg-gradient-to-tr from-cyan-400/40 via-teal-300/20 to-transparent shadow-2xl">
                            <div className="relative rounded-2xl overflow-hidden shadow-inner h-80 sm:h-96 group bg-teal-950">
                                <img
                                    src="/images/landing/kontak-hero.jpg"
                                    alt="Laboratorium Pembelajaran AiCI FMIPA UI"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.93]"
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src = '/images/landing/robotics-lab.jpg';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                                {/* Floating badges inside image */}
                                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
                                    <div className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-medium text-teal-200 border border-white/10">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                        <span>Lab Terbuka & Aktif</span>
                                    </div>
                                    <div className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[11px] font-semibold text-teal-300 border border-white/10">
                                        <span>FMIPA UI LT. 4</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Contact Information */}
                    <div className="lg:col-span-6 space-y-6">
                        {/* Pill badge with location pin */}
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-semibold tracking-wide text-teal-100 uppercase shadow-sm">
                            <i className="bi bi-geo-alt-fill text-cyan-300"></i>
                            <span>PUSAT KECERDASAN ARTIFISIAL INDONESIA</span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                            Kontak Kami
                        </h1>

                        <div className="space-y-3 text-teal-100/90 text-sm sm:text-base leading-relaxed">
                            <p className="font-extrabold text-white text-lg">
                                Artificial Intelligence Center Indonesia
                            </p>
                            <p className="text-teal-100/80 max-w-lg">
                                Gd. Laboratorium Riset Multidisiplin Pertamina FMIPA UI Lt. 4, Universitas Indonesia, Depok, Jawa Barat 16424
                            </p>
                            <p className="flex items-center gap-2.5 text-amber-300 font-bold text-base pt-2">
                                <i className="bi bi-telephone-fill text-amber-400"></i>
                                <span>Telephone 0821-1010-3938</span>
                            </p>
                        </div>

                        {/* Social Media Circular Buttons */}
                        <div className="flex items-center gap-3 pt-2">
                            {[
                                { icon: 'bi-instagram', href: 'https://instagram.com' },
                                { icon: 'bi-linkedin', href: 'https://linkedin.com' },
                                { icon: 'bi-envelope', href: 'mailto:info@aici.id' },
                                { icon: 'bi-whatsapp', href: 'https://wa.me/6282110103938' },
                                { icon: 'bi-telephone', href: 'tel:082110103938' },
                            ].map((item, idx) => (
                                <a
                                    key={idx}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-teal-100 hover:text-white flex items-center justify-center text-base transition-all duration-200 hover:scale-105 shadow-sm"
                                >
                                    <i className={`bi ${item.icon}`}></i>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom organic curve divider */}
                <div
                    className="absolute -bottom-1 left-0 right-0 h-14 bg-slate-50"
                    style={{
                        clipPath: 'ellipse(70% 100% at 50% 100%)',
                    }}
                ></div>
            </section>

            {/* ==================== 3. 3 CARDS LAYANAN (OVERLAPPING HERO) ==================== */}
            <section className="relative -mt-14 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1: Layanan Kemitraan Sekolah */}
                    <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200/80 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                            <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center text-xl border border-sky-100">
                                <i className="bi bi-mortarboard-fill"></i>
                            </div>
                            <div>
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-600 block">
                                    EDUKASI & K-12
                                </span>
                                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                                    Layanan Kemitraan Sekolah
                                </h3>
                            </div>
                            <p className="text-slate-600 text-xs leading-relaxed">
                                Konsultasi integrasi kurikulum Coding & AI, sertifikasi pengajar, serta program ekstrakurikuler sekolah.
                            </p>
                        </div>
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                            <a
                                href="mailto:kemitraan@aici.id"
                                className="font-bold text-teal-800 hover:text-teal-950 flex items-center gap-1.5 transition-colors"
                            >
                                <span>kemitraan@aici.id</span>
                                <i className="bi bi-arrow-right text-[11px]"></i>
                            </a>
                            <span className="text-[11px] text-slate-400 font-medium">Respon &lt; 24 Jam</span>
                        </div>
                    </div>

                    {/* Card 2: Kunjungan & Praktikum Lab */}
                    <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200/80 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                            <div className="w-11 h-11 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center text-xl border border-cyan-100">
                                <i className="bi bi-moisture"></i>
                            </div>
                            <div>
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-700 block">
                                    AKADEMIK & KUNJUNGAN
                                </span>
                                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                                    Kunjungan & Praktikum Lab
                                </h3>
                            </div>
                            <p className="text-slate-600 text-xs leading-relaxed">
                                Jadwal kunjungan studi rombongan sekolah, universitas, dan sesi hands-on praktikum robotika AI terjadwal.
                            </p>
                        </div>
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="text-slate-600 font-medium">Senin - Jumat (08.00 - 17.00)</span>
                            <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 font-bold text-[10px] border border-teal-200">
                                LT. 4 FMIPA UI
                            </span>
                        </div>
                    </div>

                    {/* Card 3: Hotline & Konsultasi Langsung */}
                    <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200/80 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between space-y-4">
                        <div className="space-y-3">
                            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl border border-rose-100">
                                <i className="bi bi-chat-quote-fill"></i>
                            </div>
                            <div>
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-600 block">
                                    LAYANAN CEPAT
                                </span>
                                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                                    Hotline & Konsultasi Langsung
                                </h3>
                            </div>
                            <p className="text-slate-600 text-xs leading-relaxed">
                                Pusat bantuan langsung via WhatsApp Messenger untuk registrasi program, penawaran workshop, atau pertanyaan umum.
                            </p>
                        </div>
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                            <a
                                href="https://wa.me/6282110103938"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold text-red-600 hover:text-red-700 flex items-center gap-1.5 transition-colors"
                            >
                                <span>0821-1010-3938</span>
                                <i className="bi bi-chat-dots"></i>
                            </a>
                            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span>WhatsApp Aktif</span>
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== 4. KONSULTASI CEPAT & INTERACTIVE WHATSAPP SECTION ==================== */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left Column: FAQ & Heading */}
                    <div className="lg:col-span-5 space-y-6">
                        {/* Red Dot Tag */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                            <span>Respon Cepat Tim Ahli</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                            Konsultasi Cepat via WhatsApp Resmi
                        </h2>

                        <p className="text-slate-600 text-sm leading-relaxed">
                            Hubungi representatif AiCI untuk kebutuhan implementasi kecerdasan artifisial, pelatihan tenaga pendidik, kurikulum terstruktur, maupun riset kolaboratif.
                        </p>

                        {/* Accordion FAQ Items */}
                        <div className="space-y-3 pt-2">
                            {faqList.map((faq, idx) => {
                                const isOpen = openFaq === idx;
                                return (
                                    <div
                                        key={idx}
                                        className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm transition-all"
                                    >
                                        <button
                                            onClick={() => toggleFaq(idx)}
                                            className="w-full px-5 py-4 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800 hover:text-teal-900 transition-colors"
                                        >
                                            <span>{faq.q}</span>
                                            <i
                                                className={`bi bi-chevron-down text-slate-400 text-xs transition-transform duration-200 ${
                                                    isOpen ? 'rotate-180 text-teal-800' : ''
                                                }`}
                                            ></i>
                                        </button>
                                        {isOpen && (
                                            <div className="px-5 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                                                {faq.a}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Emergency Help Banner */}
                        <div className="bg-sky-50/80 rounded-2xl p-4 border border-sky-100 flex items-center justify-between gap-4 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-lg shrink-0">
                                    <i className="bi bi-chat-text-fill"></i>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-900">Butuh Solusi Mendesak?</h4>
                                    <p className="text-[11px] text-slate-500">Hubungi customer success melalui WhatsApp</p>
                                </div>
                            </div>
                            <a
                                href="https://wa.me/6282110103938"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shrink-0 shadow-sm"
                            >
                                Chat WA
                            </a>
                        </div>
                    </div>

                    {/* Right Column: Interactive WhatsApp Widget Box */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-6">
                            {/* WhatsApp Header bar */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center text-2xl shadow-md shadow-emerald-500/20">
                                        <i className="bi bi-whatsapp"></i>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                                                WhatsApp Center Resmi AiCI
                                            </h3>
                                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                ONLINE
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-0.5">
                                            Layanan terpusat kemitraan, konsultasi kurikulum & praktikum
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-sm font-extrabold text-slate-900 block">
                                        0821-1010-3938
                                    </span>
                                </div>
                            </div>

                            {/* Subtitle & Guide */}
                            <div>
                                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    Pilih Topik Konsultasi Cepat
                                </h4>
                                <p className="text-xs text-slate-500 mt-1">
                                    Klik topik di bawah untuk langsung membuka chat WhatsApp dengan pesan pembuka otomatis:
                                </p>
                            </div>

                            {/* 4 Topic Buttons in 2x2 Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                {[
                                    {
                                        title: 'Kemitraan Sekolah',
                                        subtitle: 'Kurikulum K-12 & ekstrakurikuler',
                                        icon: 'bi-mortarboard',
                                    },
                                    {
                                        title: 'Pelatihan Guru / Dosen',
                                        subtitle: 'Sertifikasi AI & Masterclass UI',
                                        icon: 'bi-person-video3',
                                    },
                                    {
                                        title: 'Studi Kunjungan Lab',
                                        subtitle: 'Praktikum Robotika FMIPA UI',
                                        icon: 'bi-buildings',
                                    },
                                    {
                                        title: 'Konsultasi AI Korporasi',
                                        subtitle: 'Implementasi & riset industri',
                                        icon: 'bi-briefcase',
                                    },
                                ].map((btn, idx) => {
                                    const isSelected = selectedTopic === btn.title;
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedTopic(btn.title)}
                                            className={`p-4 rounded-2xl text-left border transition-all duration-200 flex items-start gap-3.5 group ${
                                                isSelected
                                                    ? 'bg-teal-50/80 border-teal-600 shadow-sm ring-2 ring-teal-500/20'
                                                    : 'bg-slate-50/70 hover:bg-slate-100/80 border-slate-200/80'
                                            }`}
                                        >
                                            <div
                                                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-base transition-colors ${
                                                    isSelected
                                                        ? 'bg-teal-800 text-white'
                                                        : 'bg-white text-teal-800 border border-slate-200'
                                                }`}
                                            >
                                                <i className={`bi ${btn.icon}`}></i>
                                            </div>
                                            <div>
                                                <h5 className="font-extrabold text-xs text-slate-900 group-hover:text-teal-900">
                                                    {btn.title}
                                                </h5>
                                                <p className="text-[11px] text-slate-500 mt-0.5">
                                                    {btn.subtitle}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Service Hours Banner */}
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-2.5">
                                    <i className="bi bi-clock-history text-rose-500 text-sm"></i>
                                    <div>
                                        <span className="font-bold text-slate-900 block text-xs">
                                            Jam Layanan WhatsApp
                                        </span>
                                        <span className="text-[11px] text-slate-500">
                                            Senin - Jumat: 08.00 - 17.00 WIB | Respon Cepat &lt; 15 Menit
                                        </span>
                                    </div>
                                </div>
                                <span className="text-[11px] font-semibold text-slate-500 bg-white px-2.5 py-1 rounded-full border border-slate-200">
                                    Bebas Pulsa
                                </span>
                            </div>

                            {/* Action Button & Verification Check */}
                            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <i className="bi bi-shield-check text-emerald-600 text-base"></i>
                                    <span>Akun Bisnis Resmi Terverifikasi</span>
                                </div>
                                <a
                                    href={getWhatsAppUrl(selectedTopic)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold px-6 py-3.5 rounded-full shadow-md hover:shadow-lg transition-all uppercase tracking-wide"
                                >
                                    <span>Chat via WhatsApp Sekarang</span>
                                    <i className="bi bi-arrow-right"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== 5. CAMPUS UI DEPOK MAP SECTION ==================== */}
            <section className="bg-slate-100/70 border-t border-b border-slate-200 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    {/* Header bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <span className="text-teal-800 text-[11px] font-extrabold uppercase tracking-widest block">
                                PETA INTERAKTIF LOKASI
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                                Kampus Universitas Indonesia, Depok
                            </h2>
                            <p className="text-slate-500 text-xs sm:text-sm mt-1">
                                Akses mudah melalui Stasiun KRL UI / Pondok Cina dan Tol Cinere - Jagorawi (Kukusan).
                            </p>
                        </div>
                        <a
                            href="https://maps.google.com/?q=Artificial+Intelligence+Center+Indonesia+FMIPA+UI"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold px-5 py-2.5 rounded-full border border-slate-200 shadow-sm transition-colors self-start sm:self-auto"
                        >
                            <i className="bi bi-map text-teal-800"></i>
                            <span>Buka di Google Maps</span>
                        </a>
                    </div>

                    {/* Interactive Map Embed with Card Overlay */}
                    <div className="relative w-full h-[380px] sm:h-[440px] rounded-3xl overflow-hidden shadow-md border border-slate-200">
                        <iframe
                            title="Lokasi Kampus UI Depok AiCI"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.2155797664426!2d106.82522737503889!3d-6.366162993623999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ec100aa7ec6d%3A0x6b4fb6c956dc8155!2sGedung%20Lab%20Riset%20Multidisiplin%20FMIPA%20UI!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={false}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="w-full h-full grayscale-[0.1] contrast-[1.05]"
                        ></iframe>

                        {/* Top-left Card Info Overlay */}
                        <div className="absolute top-4 left-4 max-w-xs bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-slate-200/80 space-y-2 pointer-events-auto">
                            <div className="flex items-center justify-between">
                                <h4 className="font-extrabold text-xs text-slate-900">
                                    Artificial Intelligence Center Indonesia (AiCI)
                                </h4>
                                <a
                                    href="https://maps.google.com/?q=Artificial+Intelligence+Center+Indonesia+FMIPA+UI"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-slate-400 hover:text-slate-700"
                                >
                                    <i className="bi bi-box-arrow-up-right text-xs"></i>
                                </a>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-tight">
                                Gedung Lab. Riset Multidisiplin Pertamina FMIPA UI Lantai 4, Pondok Cina, Beji, Kota Depok, Jawa Barat 16424
                            </p>
                            <div className="flex items-center gap-1.5 text-[11px] text-amber-500 font-bold">
                                <span>5.0</span>
                                <div className="flex items-center text-amber-400">
                                    <i className="bi bi-star-fill"></i>
                                    <i className="bi bi-star-fill"></i>
                                    <i className="bi bi-star-fill"></i>
                                    <i className="bi bi-star-fill"></i>
                                    <i className="bi bi-star-fill"></i>
                                </div>
                                <span className="text-slate-400 font-normal">(18 ulasan)</span>
                            </div>
                            <div className="pt-2 flex items-center gap-2">
                                <a
                                    href="https://maps.google.com/?q=Artificial+Intelligence+Center+Indonesia+FMIPA+UI"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-teal-800 hover:bg-teal-900 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg text-center transition-colors flex items-center justify-center gap-1"
                                >
                                    <i className="bi bi-signpost-2"></i>
                                    <span>Petunjuk Arah</span>
                                </a>
                                <a
                                    href="tel:082110103938"
                                    className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                                >
                                    <i className="bi bi-telephone"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* 4 Directions / Accessibility Info Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center shrink-0 text-base">
                                <i className="bi bi-train-front"></i>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-900">KRL Commuter Line</h4>
                                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                                    Turun di Stasiun UI atau Stasiun Pondok Cina, lanjut Bikun (Bis Kuning UI).
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center shrink-0 text-base">
                                <i className="bi bi-p-square"></i>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-900">Parkir Kendaraan</h4>
                                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                                    Tersedia area parkir roda dua & empat di pelataran Gedung Riset Multidisiplin.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center shrink-0 text-base">
                                <i className="bi bi-person-badge"></i>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-900">Registrasi Tamu</h4>
                                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                                    Tukarkan kartu identitas di lobi resepsionis Lantai 1 sebelum naik ke Lt. 4.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm flex items-start gap-3">
                            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center shrink-0 text-base">
                                <i className="bi bi-clock"></i>
                            </div>
                            <div>
                                <h4 className="text-xs font-bold text-slate-900">Jam Operasional</h4>
                                <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                                    Senin - Jumat 08.00 s.d 17.00 WIB. Sabtu terjadwal khusus workshop.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== 6. FOOTER ==================== */}
            <footer className="bg-[#023136] text-white pt-16 pb-8 border-t border-teal-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-teal-900/60">
                        {/* Col 1 & 2: Brand & Address */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-teal-800 text-white flex items-center justify-center font-black text-xl">
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 2a4 4 0 0 0-4 4v1a4 4 0 0 0-4 4 4 4 0 0 0 4 4" />
                                        <path d="M12 2a4 4 0 0 1 4 4v1a4 4 0 0 1 4 4 4 4 0 0 1-4 4" />
                                        <path d="M12 6v12" />
                                    </svg>
                                </div>
                                <div>
                                    <span className="font-extrabold text-lg tracking-wider uppercase block leading-none">AiCI</span>
                                    <span className="text-[9px] font-semibold text-teal-300 uppercase tracking-widest">
                                        Artificial Intelligence Center Indonesia
                                    </span>
                                </div>
                            </div>

                            <p className="text-xs text-teal-200/80 leading-relaxed max-w-sm">
                                Gedung Lab. Riset Multidisiplin Pertamina FMIPA UI Lt. 4, Kampus UI Depok, Jawa Barat 16424
                            </p>

                            <div className="space-y-1 text-xs text-teal-200/70 pt-1">
                                <p>Email: info@aici.id</p>
                                <p>Tel: +62 21 7888-2424 / 0821-1010-3938</p>
                            </div>
                        </div>

                        {/* Col 3: Halaman */}
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300 mb-4">HALAMAN</h4>
                            <ul className="space-y-2.5 text-xs text-teal-100/80">
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
                                    <Link href="/galeri" className="hover:text-white transition-colors">Publikasi Riset & Galeri</Link>
                                </li>
                            </ul>
                        </div>

                        {/* Col 4: Download */}
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300 mb-4">DOWNLOAD</h4>
                            <ul className="space-y-2.5 text-xs text-teal-100/80">
                                <li><a href="#brosur" className="hover:text-white transition-colors">Brosur Program 2026</a></li>
                                <li><a href="#kurikulum" className="hover:text-white transition-colors">Kurikulum AI K-12</a></li>
                                <li><a href="#silabus" className="hover:text-white transition-colors">Silabus Profesional & Industri</a></li>
                                <li><a href="#laporan" className="hover:text-white transition-colors">Laporan Riset Tahunan</a></li>
                                <li><a href="#panduan" className="hover:text-white transition-colors">Panduan Kerjasama Institusi</a></li>
                            </ul>
                        </div>

                        {/* Col 5: Media Sosial */}
                        <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300 mb-4">MEDIA SOSIAL</h4>
                            <p className="text-xs text-teal-200/80 mb-4 leading-relaxed">
                                Ikuti pembaruan terkini riset, workshop kecerdasan artifisial, dan agenda edukasi AiCI.
                            </p>
                            <div className="flex items-center gap-2">
                                <a href="https://aici.id" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-teal-900/80 hover:bg-teal-700 flex items-center justify-center text-teal-200 hover:text-white transition-colors">
                                    <i className="bi bi-globe"></i>
                                </a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-teal-900/80 hover:bg-teal-700 flex items-center justify-center text-teal-200 hover:text-white transition-colors">
                                    <i className="bi bi-share"></i>
                                </a>
                                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-teal-900/80 hover:bg-teal-700 flex items-center justify-center text-teal-200 hover:text-white transition-colors">
                                    <i className="bi bi-youtube"></i>
                                </a>
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-teal-900/80 hover:bg-teal-700 flex items-center justify-center text-teal-200 hover:text-white transition-colors">
                                    <i className="bi bi-newspaper"></i>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Bottom copyright */}
                    <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-teal-300/60 gap-4">
                        <p>© 2026 Artificial Intelligence Center Indonesia (AiCI). Hak Cipta Dilindungi.</p>
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
