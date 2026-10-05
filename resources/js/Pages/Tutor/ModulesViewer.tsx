import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';

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

interface FilterContext {
    studentId?: number | null;
    studentName?: string | null;
    className?: string | null;
    classroomId?: number | null;
}

interface Props {
    books?: Book[];
    modules?: any[]; // legacy fallback
    stats: {
        totalBooks?: number;
        totalSubModules?: number;
        robot?: number;
        coding?: number;
        total?: number;
    };
    filterContext?: FilterContext | null;
}

export default function ModulesViewer() {
    const props = usePage().props as unknown as Props;
    const stats = props.stats || {};
    const filterContext = props.filterContext || null;

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
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <Head title="Daftar Modul & Buku Kurikulum" />

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <Link href="/tutor" className="text-gray-600 hover:text-gray-900 mr-1" title="Kembali ke Dashboard">
                                <i className="bi bi-arrow-left text-xl" />
                            </Link>
                            <img
                                src="/images/logo-aici.png"
                                alt="AICI Logo"
                                className="h-8 w-auto object-contain"
                            />
                            <div className="border-l border-gray-300 pl-3">
                                <p className="text-xs font-semibold text-gray-600">Buku & Sub Modul Pembelajaran</p>
                            </div>
                        </div>

                        {activeBook && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedBookId(null);
                                    setSubSearch('');
                                    setSelectedSubModule(null);
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                            >
                                <i className="bi bi-arrow-left" /> Ganti Buku
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
                {/* Context Filter Banner (When filtered by student or class) */}
                {filterContext && filterContext.className && (
                    <div className="bg-gradient-to-r from-blue-50 via-slate-50 to-blue-50 border border-blue-200/90 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#0B6282] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                                <i className="bi bi-funnel-fill text-lg" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs font-bold text-[#0B6282] uppercase tracking-wide">
                                        Modul Khusus Kelas:
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0B6282] text-white shadow-sm">
                                        {filterContext.className}
                                    </span>
                                    {filterContext.studentName && (
                                        <span className="text-xs text-gray-600 font-medium">
                                            (Murid: <strong className="text-gray-900">{filterContext.studentName}</strong>)
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-600 mt-0.5">
                                    Menampilkan buku modul yang disesuaikan dengan kurikulum kelas anak.
                                </p>
                            </div>
                        </div>

                        <Link
                            href="/tutor/modules"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-gray-700 hover:text-[#0B6282] hover:bg-blue-50 border border-blue-200 shadow-sm transition-all flex-shrink-0"
                        >
                            <i className="bi bi-grid text-[#0B6282]" />
                            <span>Tampilkan Semua Modul</span>
                        </Link>
                    </div>
                )}

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                            <i className="bi bi-book text-[#0B6282]" />
                            {activeBook ? activeBook.name : 'Daftar Buku Modul Pembelajaran'}
                        </h1>
                        <p className="text-gray-600 text-xs sm:text-sm mt-1">
                            {activeBook
                                ? `Daftar seluruh sub modul dan silabus materi untuk ${activeBook.name}.`
                                : 'Pilih buku kurikulum di bawah untuk melihat rincian sub modul materi ajar.'}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-gray-200 text-gray-700 shadow-sm flex items-center gap-1.5">
                            <i className="bi bi-layers text-[#0B6282]" />
                            {rawBooks.length} Buku Panduan
                        </span>
                        <span className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 border border-blue-200 text-[#0B6282] shadow-sm flex items-center gap-1.5">
                            <i className="bi bi-file-earmark-code text-[#0B6282]" />
                            {stats?.totalSubModules ?? (rawBooks.reduce((acc, b) => acc + (b.subModulesCount || 0), 0))} Sub Modul
                        </span>
                    </div>
                </div>

                {/* VIEW 1: PILIHAN BUKU COVER */}
                {!activeBook ? (
                    <div className="space-y-6">
                        <div className="text-center max-w-xl mx-auto py-2">
                            <p className="text-xs uppercase tracking-wider font-bold text-teal-700 mb-1">
                                SISTEM KURIKULUM AICI
                            </p>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                                Klik Cover Buku Modul
                            </h2>
                            <p className="text-gray-500 text-xs sm:text-sm mt-1">
                                Klik cover buku untuk mengakses dan mempelajari materi per pertemuan/sub modul.
                            </p>
                        </div>

                        <div className={`grid grid-cols-1 ${rawBooks.length === 1 ? 'max-w-md mx-auto' : rawBooks.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : 'md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto'} gap-8`}>
                            {rawBooks.map((book, idx) => {
                                const isRobot = book.type === 'robot';
                                const isCoding = book.type === 'coding';

                                const theme = isRobot
                                    ? {
                                          badgeGradient: 'bg-gradient-to-r from-purple-600 to-indigo-600',
                                          coverGradient: 'bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-950',
                                          iconBox: 'bg-white/15 text-purple-200 border-white/25 shadow-purple-950/40',
                                          icon: 'bi-robot',
                                          subtitle: 'MODUL TUTOR ROBOTIKA',
                                          btnBg: 'bg-purple-600 group-hover:bg-purple-700 text-white',
                                      }
                                    : isCoding && idx === 1
                                    ? {
                                          badgeGradient: 'bg-gradient-to-r from-orange-500 to-amber-500',
                                          coverGradient: 'bg-gradient-to-br from-amber-700 via-orange-800 to-slate-950',
                                          iconBox: 'bg-white/15 text-orange-200 border-white/25 shadow-orange-950/40',
                                          icon: 'bi-code-slash',
                                          subtitle: 'MODUL TUTOR AI & CODING',
                                          btnBg: 'bg-orange-600 group-hover:bg-orange-700 text-white',
                                      }
                                    : idx % 3 === 0
                                    ? {
                                          badgeGradient: 'bg-gradient-to-r from-teal-600 to-emerald-600',
                                          coverGradient: 'bg-gradient-to-br from-teal-950 via-emerald-900 to-slate-950',
                                          iconBox: 'bg-white/15 text-teal-200 border-white/25 shadow-teal-950/40',
                                          icon: 'bi-lightbulb-fill',
                                          subtitle: 'MODUL SAINS TERAPAN',
                                          btnBg: 'bg-teal-600 group-hover:bg-teal-700 text-white',
                                      }
                                    : idx % 3 === 1
                                    ? {
                                          badgeGradient: 'bg-gradient-to-r from-blue-600 to-cyan-600',
                                          coverGradient: 'bg-gradient-to-br from-blue-950 via-cyan-900 to-slate-950',
                                          iconBox: 'bg-white/15 text-blue-200 border-white/25 shadow-blue-950/40',
                                          icon: 'bi-cpu-fill',
                                          subtitle: 'MODUL INFORMATIKA',
                                          btnBg: 'bg-blue-600 group-hover:bg-blue-700 text-white',
                                      }
                                    : {
                                          badgeGradient: 'bg-gradient-to-r from-rose-600 to-pink-600',
                                          coverGradient: 'bg-gradient-to-br from-rose-950 via-pink-900 to-slate-950',
                                          iconBox: 'bg-white/15 text-rose-200 border-white/25 shadow-rose-950/40',
                                          icon: 'bi-mortarboard-fill',
                                          subtitle: 'MODUL EKSPLORASI',
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
                                        <div className="relative bg-white rounded-3xl p-6 sm:p-7 border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col items-center">
                                            {/* Badge */}
                                            <div
                                                className={`absolute -top-3 left-6 px-3.5 py-1 rounded-full text-[11px] font-bold text-white shadow-sm flex items-center gap-1.5 ${theme.badgeGradient}`}
                                            >
                                                <i className={`bi ${theme.icon}`} />
                                                <span>BUKU {idx + 1} &bull; {book.typeLabel.toUpperCase()}</span>
                                            </div>

                                            {/* Digital Textbook Cover Box (Matching Kemendikbud Digital Book Reference) */}
                                            <div className="w-full max-w-[275px] aspect-[3/4] relative my-3 rounded-2xl overflow-hidden shadow-2xl transition-transform duration-300 group-hover:scale-105 border-4 border-white">
                                                <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/50 via-black/20 to-transparent z-20 pointer-events-none" />
                                                <div className="absolute inset-y-0 left-6 w-1 bg-white/20 z-20 pointer-events-none shadow-sm" />
                                                <div
                                                    className={`w-full h-full flex flex-col justify-between p-5 text-white relative ${theme.coverGradient}`}
                                                >
                                                    {/* Geometric patterns */}
                                                    <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-xl pointer-events-none" />
                                                    <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-black/40 blur-xl pointer-events-none" />

                                                    {/* Top Cover Header with Official "MODUL" Badge (Top-left) */}
                                                    <div className="relative z-10 flex items-center justify-between">
                                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/95 text-gray-900 shadow-md backdrop-blur-md">
                                                            <i className="bi bi-journal-bookmark-fill text-teal-700 text-xs" />
                                                            <span className="text-[11px] font-extrabold uppercase tracking-wider">
                                                                MODUL
                                                            </span>
                                                        </div>
                                                        <span className="text-[9px] font-mono uppercase text-white/80 bg-black/30 px-2 py-0.5 rounded">
                                                            AICI TUTOR
                                                        </span>
                                                    </div>

                                                    {/* Center Graphic */}
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

                                            {/* Details */}
                                            <div className="w-full text-center mt-2 space-y-2">
                                                <h4 className="font-bold text-gray-900 text-base group-hover:text-teal-700 transition-colors">
                                                    {book.name}
                                                </h4>
                                                <p className="text-gray-500 text-xs line-clamp-2 px-1">
                                                    {book.description}
                                                </p>

                                                <div className="pt-3">
                                                    <div
                                                        className={`w-full py-2 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all ${theme.btnBg}`}
                                                    >
                                                        <span>Buka Daftar Sub Modul</span>
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
                    /* VIEW 2: SUB MODULES GRID */
                    <div className="space-y-6">
                        {/* Book Banner Header */}
                        <div
                            className={`rounded-2xl p-6 text-white relative overflow-hidden shadow-md ${
                                activeBook.type === 'robot'
                                    ? 'bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900'
                                    : 'bg-gradient-to-r from-amber-700 via-orange-800 to-slate-900'
                            }`}
                        >
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1.5 max-w-2xl">
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-white/20">
                                            {activeBook.typeLabel || (activeBook.type === 'robot' ? 'Robot Building' : 'AI & Coding')}
                                        </span>
                                        <span className="text-white/80 text-xs">&bull; {activeBook.subModules.length} Sub Modul</span>
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                                        {activeBook.name}
                                    </h2>
                                    <p className="text-white/80 text-xs sm:text-sm">
                                        {activeBook.description}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedBookId(null);
                                        setSubSearch('');
                                        setSelectedSubModule(null);
                                    }}
                                    className="px-4 py-2 rounded-xl bg-white text-gray-900 font-bold text-xs hover:bg-gray-100 shadow-sm flex items-center gap-1.5 self-start md:self-center"
                                >
                                    <i className="bi bi-arrow-left" /> Ganti Buku
                                </button>
                            </div>
                        </div>

                        {/* Search & Counter */}
                        <div className="bg-white rounded-xl border border-gray-200 p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                            <div className="relative w-full sm:max-w-md">
                                <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                <input
                                    type="text"
                                    value={subSearch}
                                    onChange={e => setSubSearch(e.target.value)}
                                    placeholder="Cari sub modul materi..."
                                    className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                                />
                            </div>

                            <p className="text-xs text-gray-500 font-medium">
                                Menampilkan <strong className="text-gray-900">{filteredSubModules.length}</strong> dari {activeBook.subModules.length} sub modul
                            </p>
                        </div>

                        {/* Sub Modules Grid */}
                        {filteredSubModules.length === 0 ? (
                            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                                <i className="bi bi-journal-x text-4xl text-gray-300 block mb-2" />
                                <h3 className="font-bold text-gray-700 text-sm">Tidak ada sub modul ditemukan</h3>
                                <p className="text-gray-400 text-xs mt-1">Coba sesuaikan kata kunci pencarian Anda.</p>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredSubModules.map((sub, idx) => {
                                    const isRobot = activeBook.type === 'robot';
                                    const displayOrder = sub.orderIndex ?? (idx + 1);

                                    return (
                                        <div
                                            key={sub.id}
                                            onClick={() => setSelectedSubModule(sub)}
                                            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between cursor-pointer group"
                                        >
                                            <div className="space-y-3">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div
                                                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                                                            isRobot
                                                                ? 'bg-purple-50 text-purple-700 border border-purple-100'
                                                                : 'bg-orange-50 text-orange-600 border border-orange-100'
                                                        }`}
                                                    >
                                                        #{displayOrder}
                                                    </div>
                                                    <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                                                        Sub Modul
                                                    </span>
                                                </div>

                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-teal-700 transition-colors">
                                                        {sub.name}
                                                    </h3>
                                                    <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                                                        {sub.description || 'Materi panduan praktikum dan teori pembelajaran.'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                                                <span className="flex items-center gap-1 text-gray-600">
                                                    <i className="bi bi-journal-text text-teal-600" />
                                                    Materi Sesi
                                                </span>
                                                <span className="text-teal-700 font-medium group-hover:underline flex items-center gap-1">
                                                    Lihat <i className="bi bi-chevron-right text-[10px]" />
                                                </span>
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
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-2">
                                <span className="w-7 h-7 rounded bg-teal-50 text-teal-700 font-bold flex items-center justify-center text-xs">
                                    #{selectedSubModule.orderIndex ?? '1'}
                                </span>
                                <h3 className="font-bold text-gray-900 text-base line-clamp-1">
                                    {selectedSubModule.name}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedSubModule(null)}
                                className="text-gray-400 hover:text-gray-600 w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100"
                            >
                                <i className="bi bi-x-lg" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Deskripsi Sub Modul</p>
                                <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                                    {selectedSubModule.description || 'Panduan praktikum lengkap kurikulum AICI mencakup pembahasan konsep, perakitan, dan implementasi kode.'}
                                </p>
                            </div>

                            {selectedSubModule.tools && selectedSubModule.tools.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Perangkat / Alat</p>
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                        {selectedSubModule.tools.map((t, idx) => (
                                            <span key={idx} className="text-xs px-2.5 py-1 rounded bg-gray-100 text-gray-700">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="p-3 bg-gray-50 rounded-xl flex items-center justify-between text-xs text-gray-600">
                                <span>Tipe Materi: <strong>{selectedSubModule.typeLabel ? selectedSubModule.typeLabel.toUpperCase() : 'GENERAL'}</strong></span>
                                <span className="text-gray-400">Pertemuan #{selectedSubModule.orderIndex ?? '1'}</span>
                            </div>
                        </div>

                        <div className="pt-2 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setSelectedSubModule(null)}
                                className="px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
