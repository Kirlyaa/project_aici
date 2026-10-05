import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import UserLayout from '@/Layouts/UserLayout';

interface SubModule {
    id: number;
    name: string;
    orderIndex?: number;
    description: string | null;
    image: string | null;
    type: string;
    typeLabel: string;
    tools: string[];
    format?: string;
    size?: string;
}

interface Book {
    id: number;
    name: string;
    bookTitle: string;
    description: string | null;
    image: string | null;
    type: string;
    typeLabel: string;
    tools: string[];
    format?: string;
    size?: string;
    subModulesCount: number;
    subModules: SubModule[];
}

interface Props {
    books?: Book[];
    modules?: any[]; // legacy fallback
    stats: {
        totalBooks?: number;
        totalSubModules?: number;
        robot?: number;
        coding?: number;
    };
}

export default function UserModulesViewer() {
    const props = usePage().props as unknown as Props;
    const stats = props.stats || {};

    // Transform legacy modules if books prop is not directly provided
    const rawBooks: Book[] = useMemo(() => {
        if (props.books && props.books.length > 0) {
            return props.books;
        }
        if (props.modules && props.modules.length > 0) {
            const robotMods = props.modules.filter(m => m.type === 'robot');
            const codingMods = props.modules.filter(m => m.type === 'coding');
            return [
                {
                    id: 1,
                    name: 'Buku Robotika: Robotic Engineering & Automation',
                    bookTitle: 'Buku Robotika: Robotic Engineering & Automation',
                    description: 'Koleksi kurikulum lengkap robotika, sensor, aktuator, kendali cerdas, dan mekatronika AICI.',
                    image: '/images/modules/book-robotics.png',
                    type: 'robot',
                    typeLabel: 'Robot Building',
                    tools: ['Arduino Kit', 'Ultrasonic Sensor', 'Servo SG90', 'Motor Driver'],
                    format: 'Buku Panduan',
                    size: `${robotMods.length} Sub Modul`,
                    subModulesCount: robotMods.length,
                    subModules: robotMods.map((m, idx) => ({ ...m, orderIndex: idx + 1 })),
                },
                {
                    id: 2,
                    name: 'Buku AI & Coding: Computational Thinking & AI',
                    bookTitle: 'Buku AI & Coding: Computational Thinking & AI',
                    description: 'Koleksi kurikulum komprehensif logika komputasi, algoritma pemrograman, Scratch, Python, dan AI.',
                    image: '/images/modules/book-coding.png',
                    type: 'coding',
                    typeLabel: 'Coding',
                    tools: ['Laptop', 'Scratch IDE', 'Python 3', 'OpenCV'],
                    format: 'Buku Panduan',
                    size: `${codingMods.length} Sub Modul`,
                    subModulesCount: codingMods.length,
                    subModules: codingMods.map((m, idx) => ({ ...m, orderIndex: idx + 1 })),
                },
            ];
        }
        return [];
    }, [props.books, props.modules]);

    const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
    const [subSearch, setSubSearch] = useState('');
    const [selectedSubModule, setSelectedSubModule] = useState<SubModule | null>(null);

    const activeBook = useMemo(() => {
        return rawBooks.find(b => b.id === selectedBookId) || null;
    }, [rawBooks, selectedBookId]);

    const filteredSubModules = useMemo(() => {
        if (!activeBook) return [];
        if (!subSearch.trim()) return activeBook.subModules;
        const q = subSearch.toLowerCase();
        return activeBook.subModules.filter(sm =>
            sm.name.toLowerCase().includes(q) ||
            (sm.description ?? '').toLowerCase().includes(q)
        );
    }, [activeBook, subSearch]);

    return (
        <UserLayout currentPage="jadwal">
            <Head title="Modul Pembelajaran - Buku Kurikulum" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        {activeBook ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedBookId(null);
                                    setSubSearch('');
                                    setSelectedSubModule(null);
                                }}
                                className="inline-flex items-center gap-2 text-[#0B6282] font-semibold text-xs sm:text-sm hover:underline mb-2 transition-all group"
                            >
                                <i className="bi bi-arrow-left text-base group-hover:-translate-x-0.5 transition-transform" />
                                <span>Kembali ke Pilihan Buku</span>
                            </button>
                        ) : (
                            <Link
                                href="/jadwal"
                                className="inline-flex items-center gap-1.5 text-[#0B6282] font-semibold text-xs sm:text-sm hover:underline mb-2"
                            >
                                <i className="bi bi-arrow-left" /> Kembali ke Jadwal
                            </Link>
                        )}
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
                            <i className="bi bi-book-half text-[#0B6282]" />
                            {activeBook ? activeBook.name : 'Katalog Buku Modul Pembelajaran'}
                        </h1>
                        <p className="text-gray-500 text-xs sm:text-sm mt-1">
                            {activeBook
                                ? `Menampilkan seluruh pilihan sub modul materi untuk ${activeBook.name}. Silakan pilih sub modul untuk dipelajari.`
                                : 'Pilih cover buku modul di bawah ini untuk melihat dan membuka daftar sub modul materinya.'}
                        </p>
                    </div>

                    {/* Quick Badge / Stats */}
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-[#0B6282] border border-blue-100 shadow-sm">
                            <i className="bi bi-collection-fill text-[#0B6282]" />
                            {rawBooks.length} Buku Kurikulum
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200 shadow-sm">
                            <i className="bi bi-file-earmark-text text-gray-500" />
                            {stats?.totalSubModules ?? (rawBooks.reduce((acc, b) => acc + (b.subModulesCount || 0), 0))} Sub Modul
                        </span>
                    </div>
                </div>

                {/* VIEW 1: PILIHAN BUKU COVER (JIKA BELUM MEMILIH BUKU) */}
                {!activeBook ? (
                    <div className="space-y-6 pt-2">
                        <div className="text-center max-w-2xl mx-auto py-2">
                            <p className="text-xs uppercase tracking-widest font-bold text-teal-700 mb-1">
                                PANDUAN KURIKULUM & MATERI PRAKTIK
                            </p>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                                Silakan Klik Cover Buku Untuk Membuka Sub Modul
                            </h2>
                            <p className="text-gray-500 text-xs sm:text-sm mt-1">
                                Tersedia {rawBooks.length} buku panduan kurikulum Artificial Intelligence Center Indonesia.
                            </p>
                        </div>

                        {/* Dynamic Book Covers Container */}
                        <div className={`grid grid-cols-1 ${rawBooks.length === 1 ? 'max-w-md mx-auto' : rawBooks.length === 2 ? 'md:grid-cols-2 max-w-5xl mx-auto' : 'md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto'} gap-8 lg:gap-10`}>
                            {rawBooks.map((book, idx) => {
                                const isRobot = book.type === 'robot';
                                const isCoding = book.type === 'coding';

                                const theme = isRobot
                                    ? {
                                          badgeGradient: 'bg-gradient-to-r from-purple-600 to-indigo-600',
                                          coverGradient: 'bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-950',
                                          iconBox: 'bg-white/15 text-purple-200 border-white/25 shadow-purple-950/40',
                                          icon: 'bi-robot',
                                          subtitle: 'PANDUAN PRAKTIK ROBOTIKA',
                                          btnBg: 'bg-purple-600 group-hover:bg-purple-700 text-white',
                                      }
                                    : isCoding && idx === 1
                                    ? {
                                          badgeGradient: 'bg-gradient-to-r from-orange-500 to-amber-500',
                                          coverGradient: 'bg-gradient-to-br from-amber-700 via-orange-800 to-slate-950',
                                          iconBox: 'bg-white/15 text-orange-200 border-white/25 shadow-orange-950/40',
                                          icon: 'bi-code-slash',
                                          subtitle: 'LOGIKA KODING & ALGORITMA',
                                          btnBg: 'bg-orange-500 group-hover:bg-orange-600 text-white',
                                      }
                                    : idx % 3 === 0
                                    ? {
                                          badgeGradient: 'bg-gradient-to-r from-teal-600 to-emerald-600',
                                          coverGradient: 'bg-gradient-to-br from-teal-950 via-emerald-900 to-slate-950',
                                          iconBox: 'bg-white/15 text-teal-200 border-white/25 shadow-teal-950/40',
                                          icon: 'bi-lightbulb-fill',
                                          subtitle: 'SAINS & TEKNOLOGI TERAPAN',
                                          btnBg: 'bg-teal-600 group-hover:bg-teal-700 text-white',
                                      }
                                    : idx % 3 === 1
                                    ? {
                                          badgeGradient: 'bg-gradient-to-r from-blue-600 to-cyan-600',
                                          coverGradient: 'bg-gradient-to-br from-blue-950 via-cyan-900 to-slate-950',
                                          iconBox: 'bg-white/15 text-blue-200 border-white/25 shadow-blue-950/40',
                                          icon: 'bi-cpu-fill',
                                          subtitle: 'INFORMATIKA & KOMPUTASI',
                                          btnBg: 'bg-blue-600 group-hover:bg-blue-700 text-white',
                                      }
                                    : {
                                          badgeGradient: 'bg-gradient-to-r from-rose-600 to-pink-600',
                                          coverGradient: 'bg-gradient-to-br from-rose-950 via-pink-900 to-slate-950',
                                          iconBox: 'bg-white/15 text-rose-200 border-white/25 shadow-rose-950/40',
                                          icon: 'bi-mortarboard-fill',
                                          subtitle: 'EKSPLORASI KURIKULUM',
                                          btnBg: 'bg-rose-600 group-hover:bg-rose-700 text-white',
                                      };

                                return (
                                    <div
                                        key={book.id}
                                        onClick={() => {
                                            setSelectedBookId(book.id);
                                            setSubSearch('');
                                            setSelectedSubModule(null);
                                        }}
                                        className="group cursor-pointer select-none"
                                    >
                                        {/* Realistic 3D Book Presentation Card */}
                                        <div className="relative bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center">
                                            {/* Spine / Ribbon Accent */}
                                            <div
                                                className={`absolute -top-3 left-8 px-4 py-1 rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-1.5 ${theme.badgeGradient}`}
                                            >
                                                <i className={`bi ${theme.icon}`} />
                                                <span>BUKU {idx + 1} &bull; {book.typeLabel.toUpperCase()}</span>
                                            </div>

                                            {/* Digital Textbook Cover Graphic (Matching Kemendikbud Digital Book Reference) */}
                                            <div className="w-full max-w-[275px] aspect-[3/4] relative my-3 rounded-2xl overflow-hidden shadow-2xl transition-transform duration-300 group-hover:scale-105 border-4 border-white">
                                                {/* Book Spine Simulation */}
                                                <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/50 via-black/20 to-transparent z-20 pointer-events-none" />
                                                <div className="absolute inset-y-0 left-6 w-1 bg-white/20 z-20 pointer-events-none shadow-sm" />

                                                {/* Book Background Gradients & Imagery */}
                                                <div
                                                    className={`w-full h-full flex flex-col justify-between p-5 text-white relative ${theme.coverGradient}`}
                                                >
                                                    {/* Geometric patterns */}
                                                    <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
                                                    <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-black/40 blur-2xl pointer-events-none" />

                                                    {/* Top Cover Header with Official "MODUL" Badge (Top-left as in Kemendikbud format) */}
                                                    <div className="relative z-10 flex items-center justify-between">
                                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/95 text-gray-900 shadow-md backdrop-blur-md">
                                                            <i className="bi bi-journal-bookmark-fill text-teal-700 text-xs" />
                                                            <span className="text-[11px] font-extrabold uppercase tracking-wider">
                                                                MODUL
                                                            </span>
                                                        </div>
                                                        <span className="text-[9px] font-mono uppercase text-white/80 bg-black/30 px-2 py-0.5 rounded">
                                                            AICI RESMI
                                                        </span>
                                                    </div>

                                                    {/* Center Graphic & Big Icon */}
                                                    <div className="relative z-10 my-auto text-center py-3">
                                                        <div
                                                            className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-4xl shadow-lg mb-3 backdrop-blur-md border ${theme.iconBox}`}
                                                        >
                                                            <i className={`bi ${theme.icon}`} />
                                                        </div>
                                                        <h3 className="font-black text-lg leading-snug drop-shadow-md text-white tracking-tight uppercase px-1 line-clamp-2">
                                                            {book.bookTitle || book.name}
                                                        </h3>
                                                        <p className="text-[11px] text-white/85 font-medium tracking-wide mt-1">
                                                            {theme.subtitle}
                                                        </p>
                                                    </div>

                                                    {/* Bottom Cover Footer Overlay Bar */}
                                                    <div className="relative z-10 bg-black/40 backdrop-blur-md -mx-5 -mb-5 p-3 px-4 border-t border-white/15 flex items-center justify-between text-xs">
                                                        <div className="flex items-center gap-1.5 text-white/95 font-semibold text-[11px]">
                                                            <i className="bi bi-collection-fill text-amber-400" />
                                                            <span>{book.subModulesCount || book.subModules.length} Sub Modul</span>
                                                        </div>
                                                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/25 font-bold uppercase tracking-wider text-white">
                                                            BUKU #{idx + 1}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Book Description & Action */}
                                            <div className="w-full text-center mt-3 space-y-2">
                                                <h4 className="font-bold text-gray-900 text-lg group-hover:text-teal-700 transition-colors">
                                                    {book.name}
                                                </h4>
                                                <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 px-2">
                                                    {book.description || 'Kumpulan modul dan materi pembelajaran komprehensif.'}
                                                </p>

                                                {/* Tools / Hardware Tags */}
                                                <div className="flex flex-wrap justify-center gap-1.5 pt-2">
                                                    {(book.tools || []).slice(0, 4).map((tool, tIdx) => (
                                                        <span
                                                            key={tIdx}
                                                            className="text-[11px] px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium border border-gray-200/60"
                                                        >
                                                            {tool}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Call To Action Button */}
                                                <div className="pt-4">
                                                    <div
                                                        className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-200 ${theme.btnBg}`}
                                                    >
                                                        <span>Buka & Pilih Sub Modul</span>
                                                        <i className="bi bi-arrow-right font-bold group-hover:translate-x-1 transition-transform" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    /* VIEW 2: TAMPILAN BANYAK PILIHAN SUB MODUL SETELAH BUKU DIKLIK */
                    <div className="space-y-6">
                        {/* Book Banner Header */}
                        <div
                            className={`rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg ${
                                activeBook.type === 'robot'
                                    ? 'bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900'
                                    : 'bg-gradient-to-r from-amber-700 via-orange-800 to-slate-900'
                            }`}
                        >
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="space-y-2 max-w-3xl">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm">
                                            {activeBook.typeLabel || (activeBook.type === 'robot' ? 'Robot Building' : 'AI & Coding')}
                                        </span>
                                        <span className="text-white/80 text-xs font-mono">&bull; {activeBook.subModules.length} Sub Modul Tersedia</span>
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                                        {activeBook.name}
                                    </h2>
                                    <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
                                        {activeBook.description}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-2 pt-2">
                                        <span className="text-xs text-white/90 font-semibold mr-1">Alat & Perangkat:</span>
                                        {(activeBook.tools || []).map((t, idx) => (
                                            <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-white/15 backdrop-blur-sm text-white">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex md:flex-col items-center sm:items-end justify-between gap-3 flex-shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedBookId(null);
                                            setSubSearch('');
                                            setSelectedSubModule(null);
                                        }}
                                        className="px-4 py-2 rounded-xl bg-white text-gray-900 font-bold text-xs sm:text-sm hover:bg-gray-100 shadow-sm transition-all flex items-center gap-2"
                                    >
                                        <i className="bi bi-grid-fill text-teal-700" />
                                        <span>Ganti Buku Modul</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Search Bar for Sub Modules */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                            <div className="relative w-full sm:max-w-md">
                                <i className="bi bi-search absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                <input
                                    type="text"
                                    value={subSearch}
                                    onChange={e => setSubSearch(e.target.value)}
                                    placeholder="Cari sub modul di buku ini..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                                />
                            </div>

                            <p className="text-xs text-gray-500 self-start sm:self-center font-medium">
                                Menampilkan <strong className="text-gray-900">{filteredSubModules.length}</strong> dari {activeBook.subModules.length} sub modul
                            </p>
                        </div>

                        {/* Sub Modules Grid */}
                        {filteredSubModules.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                                <i className="bi bi-journal-x text-5xl text-gray-300 block mb-3" />
                                <h3 className="font-bold text-gray-700">Sub modul tidak ditemukan</h3>
                                <p className="text-gray-400 text-xs sm:text-sm mt-1">Coba sesuaikan kata kunci pencarian Anda.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {filteredSubModules.map((sub, idx) => {
                                    const isRobot = activeBook.type === 'robot';
                                    const displayOrder = sub.orderIndex ?? (idx + 1);

                                    return (
                                        <div
                                            key={sub.id}
                                            onClick={() => setSelectedSubModule(sub)}
                                            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group cursor-pointer"
                                        >
                                            {/* Sub Module Top Bar */}
                                            <div
                                                className={`h-2 w-full ${
                                                    isRobot
                                                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500'
                                                        : 'bg-gradient-to-r from-orange-400 to-amber-500'
                                                }`}
                                            />

                                            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                                                <div className="space-y-3">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div
                                                            className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0 font-bold ${
                                                                isRobot
                                                                    ? 'bg-purple-50 text-purple-700 border border-purple-100'
                                                                    : 'bg-orange-50 text-orange-600 border border-orange-100'
                                                            }`}
                                                        >
                                                            <span>#{displayOrder}</span>
                                                        </div>

                                                        <span
                                                            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase ${
                                                                isRobot
                                                                    ? 'bg-purple-100/70 text-purple-700'
                                                                    : 'bg-orange-100/70 text-orange-700'
                                                            }`}
                                                        >
                                                            Sub Modul
                                                        </span>
                                                    </div>

                                                    <div>
                                                        <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-teal-700 transition-colors">
                                                            {sub.name}
                                                        </h3>
                                                        <p className="text-gray-500 text-xs mt-1.5 line-clamp-3 leading-relaxed">
                                                            {sub.description || 'Materi pembelajaran terstruktur mencakup konsep dasar dan langkah praktikum.'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Tools / Footer */}
                                                <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
                                                    <div className="flex items-center gap-1.5 text-gray-600">
                                                        <i className="bi bi-journal-text text-teal-600 text-sm" />
                                                        <span className="font-medium">Materi Sesi</span>
                                                    </div>
                                                    <span className="text-[11px] text-teal-700 font-semibold group-hover:underline flex items-center gap-1">
                                                        Detail Materi <i className="bi bi-chevron-right text-[10px]" />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Sub Module Detail Modal */}
            {selectedSubModule && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-2">
                                <span className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 font-bold flex items-center justify-center text-xs">
                                    #{selectedSubModule.orderIndex ?? '1'}
                                </span>
                                <h3 className="font-bold text-gray-900 text-base line-clamp-1">
                                    {selectedSubModule.name}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedSubModule(null)}
                                className="text-gray-400 hover:text-gray-600 text-lg w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
                            >
                                <i className="bi bi-x-lg" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Deskripsi Pembelajaran</p>
                                <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                                    {selectedSubModule.description || 'Panduan praktikum lengkap kurikulum AICI mencakup pembahasan konsep, perakitan, dan implementasi kode.'}
                                </p>
                            </div>

                            {selectedSubModule.tools && selectedSubModule.tools.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Perangkat / Alat Terkait</p>
                                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                                        {selectedSubModule.tools.map((t, idx) => (
                                            <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-medium">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="p-3 bg-gray-50 rounded-2xl flex items-center justify-between text-xs text-gray-600">
                                <span className="flex items-center gap-1.5">
                                    <i className="bi bi-journal-text text-teal-600 text-base" />
                                    Tipe Materi: <strong>{selectedSubModule.typeLabel ? selectedSubModule.typeLabel.toUpperCase() : 'GENERAL'}</strong>
                                </span>
                                <span className="text-gray-400">Pertemuan #{selectedSubModule.orderIndex ?? '1'}</span>
                            </div>
                        </div>

                        <div className="pt-2 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setSelectedSubModule(null)}
                                className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs transition-colors shadow-sm"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </UserLayout>
    );
}
