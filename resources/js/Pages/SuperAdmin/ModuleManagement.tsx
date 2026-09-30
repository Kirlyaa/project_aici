import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useMemo, useRef } from 'react';
import FlashToast from '@/Components/FlashToast';

interface SubModuleItem {
    id: number;
    parentId?: number | null;
    name: string;
    bookTitle?: string | null;
    orderIndex?: number;
    description: string | null;
    image: string | null;
    type: string;
    typeLabel: string;
    tools: string[];
    createdBy?: string;
    createdAt?: string;
    sessionsCount?: number;
}

interface BookItem {
    id: number;
    name: string;
    bookTitle: string;
    description: string | null;
    image: string | null;
    type: string;
    typeLabel: string;
    tools: string[];
    format?: string;
    subModulesCount: number;
    subModules: SubModuleItem[];
}

interface Module {
    id: number;
    parentId?: number | null;
    name: string;
    bookTitle?: string | null;
    orderIndex?: number;
    image: string | null;
    description: string | null;
    type: string;
    typeLabel: string;
    tools: string[];
    subModulesCount?: number;
    subModules?: Array<{ id: number; name: string; orderIndex: number; type: string }>;
    createdBy: string;
    createdAt: string;
    sessionsCount: number;
}

interface ParentOption {
    id: number;
    name: string;
    book_title?: string | null;
}

interface Paginated<T> {
    data: T[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    modules: Paginated<Module>;
    books?: BookItem[];
    parentModules?: ParentOption[];
    search: string;
    selectedType: string;
    sortBy: string;
    stats: { total: number; robot: number; coding: number; general: number };
}

export default function ModuleManagement() {
    const { modules, books = [], parentModules = [], search, selectedType, sortBy, stats } = usePage().props as unknown as Props;
    const pageProps = usePage().props as any;
    const csvErrors = (pageProps.flash?.csv_errors || []) as string[];

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
    const [subSearch, setSubSearch] = useState('');

    // State untuk Modal Import CSV
    const [showImportModal, setShowImportModal] = useState(false);
    const [importFile, setImportFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [newModule, setNewModule] = useState({
        name: '',
        book_title: '',
        parent_id: '' as string | number,
        order_index: 0,
        image: '',
        description: '',
        tools: [] as string[],
        newTool: '',
        type: 'robot',
    });

    const [searchTerm, setSearchTerm] = useState(search);
    const [selectedTypeFilter, setSelectedTypeFilter] = useState(selectedType);

    // Active selected book for drill-down
    const activeBook = useMemo(() => {
        if (!selectedBookId) return null;
        return books.find(b => b.id === selectedBookId) || null;
    }, [books, selectedBookId]);

    // Submodules in active book filtered by local search
    const filteredActiveSubModules = useMemo(() => {
        if (!activeBook) return [];
        if (!subSearch.trim()) return activeBook.subModules;
        const q = subSearch.toLowerCase();
        return activeBook.subModules.filter(sm =>
            sm.name.toLowerCase().includes(q) ||
            (sm.description ?? '').toLowerCase().includes(q)
        );
    }, [activeBook, subSearch]);

    const applyFilters = (term: string, type: string) => {
        router.get('/superadmin/modules', { search: term, type }, { preserveState: true });
    };

    const handleSubmit = () => {
        if (!newModule.name.trim()) return;

        const payload = {
            name: newModule.name,
            book_title: newModule.book_title || null,
            parent_id: newModule.parent_id ? Number(newModule.parent_id) : null,
            order_index: Number(newModule.order_index) || 0,
            description: newModule.description || null,
            image: newModule.image || null,
            type: newModule.type,
            tools: newModule.tools.length > 0 ? newModule.tools : null,
        };

        if (editingId) {
            router.put(`/superadmin/modules/${editingId}`, payload, {
                onSuccess: () => resetForm(),
            });
        } else {
            router.post('/superadmin/modules', payload, {
                onSuccess: () => resetForm(),
            });
        }
    };

    const editBook = (book: BookItem) => {
        setNewModule({
            name: book.name,
            book_title: book.bookTitle ?? book.name,
            parent_id: '',
            order_index: 0,
            image: book.image ?? '',
            description: book.description ?? '',
            tools: book.tools ?? [],
            newTool: '',
            type: book.type,
        });
        setEditingId(book.id);
        setShowForm(true);
    };

    const editModule = (m: Module | SubModuleItem) => {
        setNewModule({
            name: m.name,
            book_title: m.bookTitle ?? '',
            parent_id: m.parentId ?? (selectedBookId || ''),
            order_index: m.orderIndex ?? 0,
            image: m.image ?? '',
            description: m.description ?? '',
            tools: m.tools ?? [],
            newTool: '',
            type: m.type,
        });
        setEditingId(m.id);
        setShowForm(true);
    };

    const deleteBook = (book: BookItem) => {
        const count = book.subModulesCount || book.subModules.length;
        const msg = count > 0
            ? `Buku "${book.name}" memiliki ${count} sub modul di dalamnya. Jika Anda menghapus buku ini, seluruh sub modul di dalamnya juga akan terhapus. Lanjutkan?`
            : `Yakin ingin menghapus buku kurikulum "${book.name}"?`;

        if (window.confirm(msg)) {
            router.delete(`/superadmin/modules/${book.id}`, {
                onSuccess: () => {
                    if (selectedBookId === book.id) {
                        setSelectedBookId(null);
                    }
                }
            });
        }
    };

    const deleteModule = (id: number) => {
        if (window.confirm('Yakin ingin menghapus modul ini?')) {
            router.delete(`/superadmin/modules/${id}`);
        }
    };

    const resetForm = () => {
        setNewModule({
            name: '',
            book_title: '',
            parent_id: '',
            order_index: 0,
            image: '',
            description: '',
            tools: [],
            newTool: '',
            type: 'robot',
        });
        setShowForm(false);
        setEditingId(null);
    };

    const openAddBook = () => {
        setNewModule({
            name: '',
            book_title: '',
            parent_id: '',
            order_index: 0,
            image: '',
            description: '',
            tools: [],
            newTool: '',
            type: 'robot',
        });
        setEditingId(null);
        setShowForm(true);
    };

    const openAddSubModule = (book: BookItem) => {
        setNewModule({
            name: '',
            book_title: book.name,
            parent_id: book.id,
            order_index: (book.subModulesCount || 0) + 1,
            image: '',
            description: '',
            tools: [],
            newTool: '',
            type: book.type || 'robot',
        });
        setEditingId(null);
        setShowForm(true);
    };

    const addTool = () => {
        if (!newModule.newTool.trim()) return;
        setNewModule({
            ...newModule,
            tools: [...newModule.tools, newModule.newTool],
            newTool: ''
        });
    };

    const removeTool = (index: number) => {
        setNewModule({
            ...newModule,
            tools: newModule.tools.filter((_, i) => i !== index)
        });
    };

    const handleImportSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!importFile) return;

        const formData = new FormData();
        formData.append('file', importFile);

        setIsUploading(true);
        router.post('/superadmin/modules/import-csv', formData, {
            forceFormData: true,
            onSuccess: () => {
                setShowImportModal(false);
                setImportFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
            onFinish: () => {
                setIsUploading(false);
            },
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Kelola Modul Master" />

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <Link href="/superadmin" className="text-gray-600 hover:text-gray-900 mr-1" title="Kembali ke Dashboard">
                                <i className="bi bi-arrow-left text-xl" />
                            </Link>
                            <img
                                src="/images/logo-aici.png"
                                alt="AICI Logo"
                                className="h-8 w-auto object-contain"
                            />
                            <div className="border-l border-gray-300 pl-3">
                                <p className="text-xs font-semibold text-gray-600">Kelola Modul Master</p>
                            </div>
                        </div>

                        {/* Top info badge */}
                        <div className="flex items-center gap-2">
                            <div className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200 flex items-center gap-1.5">
                                <i className="bi bi-book-half text-orange-600" />
                                <span>{books.length} Buku Kurikulum</span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        {activeBook ? (
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedBookId(null);
                                    setSubSearch('');
                                }}
                                className="inline-flex items-center gap-2 text-orange-600 font-semibold text-sm hover:underline mb-2 transition-all group"
                            >
                                <i className="bi bi-arrow-left text-base group-hover:-translate-x-1 transition-transform" />
                                <span>Kembali ke Pilihan Buku</span>
                            </button>
                        ) : null}
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2.5">
                            <i className="bi bi-book-half text-orange-600" />
                            {activeBook
                                ? activeBook.name
                                : 'Katalog Buku Modul Pembelajaran'}
                        </h1>
                        <p className="text-gray-600 text-sm mt-1">
                            {activeBook
                                ? `Menampilkan sub modul yang terdaftar di dalam buku ini. Anda dapat menambah, mengedit, atau menghapus sub modul.`
                                : 'Pilih cover buku modul di bawah untuk mengelola sub modul per pertemuan, atau gunakan tombol edit/hapus pada tiap buku.'}
                        </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Tombol Impor CSV */}
                        <button
                            type="button"
                            onClick={() => setShowImportModal(true)}
                            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium flex items-center gap-2 shadow-sm text-sm transition-colors"
                        >
                            <i className="bi bi-file-earmark-spreadsheet" />
                            <span>Impor CSV Modul</span>
                        </button>

                        {activeBook ? (
                            <>
                                <button
                                    onClick={() => editBook(activeBook)}
                                    className="px-4 py-2.5 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-medium flex items-center gap-2 text-sm transition-colors"
                                >
                                    <i className="bi bi-pencil-fill text-blue-600" /> Edit Buku Ini
                                </button>
                                <button
                                    onClick={() => deleteBook(activeBook)}
                                    className="px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-medium flex items-center gap-2 text-sm transition-colors"
                                >
                                    <i className="bi bi-trash-fill" /> Hapus Buku Ini
                                </button>
                                <button
                                    onClick={() => openAddSubModule(activeBook)}
                                    className="px-5 py-2.5 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 flex items-center gap-2 shadow-sm text-sm"
                                >
                                    <i className="bi bi-plus-lg" /> Tambah Sub Modul
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={openAddBook}
                                className="px-5 py-2.5 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 flex items-center gap-2 shadow-sm text-sm"
                            >
                                <i className="bi bi-plus-lg" /> Tambah Buku Kurikulum Baru
                            </button>
                        )}
                    </div>
                </div>

                <FlashToast />

                {/* Import CSV Errors Alert if any */}
                {csvErrors.length > 0 && (
                    <div className="mb-6 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700">
                        <div className="flex items-center gap-2 font-semibold mb-2">
                            <i className="bi bi-exclamation-triangle-fill text-lg text-red-600" />
                            <span>Terdapat kendala saat impor CSV Modul:</span>
                        </div>
                        <ul className="list-disc list-inside text-xs sm:text-sm space-y-1">
                            {csvErrors.map((err, idx) => (
                                <li key={idx}>{err}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* VIEW MODE: BUKU COVER */}
                {!activeBook && (
                    <div className="space-y-8 pt-2">
                        <div className="text-center max-w-2xl mx-auto">
                            <p className="text-xs uppercase tracking-widest font-bold text-orange-600 mb-1">
                                PANDUAN BUKU KURIKULUM AICI
                            </p>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Klik Cover Buku Untuk Membuka Sub Modul
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">
                                Tersedia {books.length} buku modul kurikulum. Klik cover buku di bawah untuk masuk ke halaman rincian sub modul materi.
                            </p>
                        </div>

                        {/* Dynamic Book Covers Grid - Supports 1, 2, 3, or more books dynamically */}
                        <div className={`grid grid-cols-1 ${books.length === 1 ? 'max-w-md mx-auto' : books.length === 2 ? 'md:grid-cols-2 max-w-4xl mx-auto' : 'md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto'} gap-8 lg:gap-10`}>
                            {books.map((book, idx) => {
                                const isRobot = book.type === 'robot';
                                const isCoding = book.type === 'coding';
                                
                                // Dynamic book theme styling based on type and index
                                const theme = isRobot
                                    ? {
                                          badgeGradient: 'bg-gradient-to-r from-purple-700 to-indigo-600',
                                          coverGradient: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-950',
                                          iconBox: 'bg-white/15 text-purple-200 border-white/25 shadow-purple-950/40',
                                          icon: 'bi-robot',
                                          subtitle: 'Mekatronika & Robotika',
                                          btnBg: 'bg-purple-600 group-hover:bg-purple-700 text-white',
                                      }
                                    : isCoding && idx === 1
                                    ? {
                                          badgeGradient: 'bg-gradient-to-r from-amber-600 to-orange-600',
                                          coverGradient: 'bg-gradient-to-br from-amber-700 via-orange-800 to-slate-950',
                                          iconBox: 'bg-white/15 text-orange-200 border-white/25 shadow-orange-950/40',
                                          icon: 'bi-code-slash',
                                          subtitle: 'Logika Pemrograman & AI',
                                          btnBg: 'bg-orange-600 group-hover:bg-orange-700 text-white',
                                      }
                                    : idx % 3 === 0
                                    ? {
                                          badgeGradient: 'bg-gradient-to-r from-teal-700 to-emerald-600',
                                          coverGradient: 'bg-gradient-to-br from-teal-900 via-emerald-950 to-slate-950',
                                          iconBox: 'bg-white/15 text-teal-200 border-white/25 shadow-teal-950/40',
                                          icon: 'bi-lightbulb-fill',
                                          subtitle: 'Sains & Teknologi Terapan',
                                          btnBg: 'bg-teal-600 group-hover:bg-teal-700 text-white',
                                      }
                                    : idx % 3 === 1
                                    ? {
                                          badgeGradient: 'bg-gradient-to-r from-blue-700 to-cyan-600',
                                          coverGradient: 'bg-gradient-to-br from-blue-900 via-cyan-950 to-slate-950',
                                          iconBox: 'bg-white/15 text-blue-200 border-white/25 shadow-blue-950/40',
                                          icon: 'bi-cpu-fill',
                                          subtitle: 'Informatika & Komputasi',
                                          btnBg: 'bg-blue-600 group-hover:bg-blue-700 text-white',
                                      }
                                    : {
                                          badgeGradient: 'bg-gradient-to-r from-rose-700 to-pink-600',
                                          coverGradient: 'bg-gradient-to-br from-rose-900 via-pink-950 to-slate-950',
                                          iconBox: 'bg-white/15 text-rose-200 border-white/25 shadow-rose-950/40',
                                          icon: 'bi-mortarboard-fill',
                                          subtitle: 'Eksplorasi Kurikulum',
                                          btnBg: 'bg-rose-600 group-hover:bg-rose-700 text-white',
                                      };

                                return (
                                    <div
                                        key={book.id}
                                        onClick={() => {
                                            setSelectedBookId(book.id);
                                            setSubSearch('');
                                        }}
                                        className="group cursor-pointer select-none"
                                    >
                                        {/* Book Card */}
                                        <div className="relative bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/90 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center">
                                            {/* Book Header Label */}
                                            <div
                                                className={`absolute -top-3.5 left-8 px-4 py-1 rounded-full text-xs font-bold text-white shadow-md flex items-center gap-1.5 ${theme.badgeGradient}`}
                                            >
                                                <i className={`bi ${theme.icon}`} />
                                                <span>BUKU {idx + 1} &bull; {book.typeLabel.toUpperCase()}</span>
                                            </div>

                                            {/* Digital Textbook Cover Box (Vertical 3:4 aspect ratio matching Image 2 reference) */}
                                            <div className="w-full max-w-[270px] aspect-[3/4] relative my-3 rounded-2xl overflow-hidden shadow-2xl transition-transform duration-300 group-hover:scale-105 border-4 border-white">
                                                {/* Left Spine Shadow */}
                                                <div className="absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-black/50 via-black/20 to-transparent z-20 pointer-events-none" />
                                                <div className="absolute inset-y-0 left-6 w-1 bg-white/20 z-20 pointer-events-none shadow-sm" />

                                                {/* Cover Background */}
                                                <div
                                                    className={`w-full h-full flex flex-col justify-between p-5 text-white relative ${theme.coverGradient}`}
                                                >
                                                    {/* Background decorative circles */}
                                                    <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-xl pointer-events-none" />
                                                    <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-black/40 blur-xl pointer-events-none" />

                                                    {/* Top Bar: Official "MODUL" Badge (TOP-LEFT AS IN IMAGE 2) */}
                                                    <div className="relative z-10 flex items-center justify-between">
                                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/95 text-gray-900 shadow-md backdrop-blur-md">
                                                            <i className="bi bi-journal-bookmark-fill text-orange-600 text-xs" />
                                                            <span className="text-[11px] font-extrabold uppercase tracking-wider">
                                                                MODUL
                                                            </span>
                                                        </div>
                                                        <span className="text-[9px] font-mono uppercase text-white/80 bg-black/30 px-2 py-0.5 rounded">
                                                            AICI RESMI
                                                        </span>
                                                    </div>

                                                    {/* Center Graphic & Title */}
                                                    <div className="relative z-10 my-auto text-center py-2">
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

                                                    {/* Bottom Bar: Bottom overlay bar as in Image 2 */}
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

                                            {/* Book Title & Actions */}
                                            <div className="w-full text-center mt-3 space-y-2">
                                                <h4 className="font-bold text-gray-900 text-lg group-hover:text-orange-600 transition-colors">
                                                    {book.name}
                                                </h4>
                                                <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 px-1">
                                                    {book.description || 'Kumpulan modul dan silabus materi pembelajaran.'}
                                                </p>

                                                {/* Tools */}
                                                <div className="flex flex-wrap justify-center gap-1 pt-1">
                                                    {(book.tools || []).slice(0, 4).map((tool, tIdx) => (
                                                        <span
                                                            key={tIdx}
                                                            className="text-[11px] px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 font-medium border border-gray-200"
                                                        >
                                                            {tool}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Button to click book */}
                                                <div className="pt-3 flex items-center gap-2">
                                                    <div
                                                        className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all duration-200 ${theme.btnBg}`}
                                                    >
                                                        <span>Buka Sub Modul</span>
                                                        <i className="bi bi-arrow-right font-bold group-hover:translate-x-1 transition-transform" />
                                                    </div>
                                                </div>

                                                {/* Action buttons on book cover */}
                                                <div className="pt-2 flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                                    <button
                                                        type="button"
                                                        onClick={() => editBook(book)}
                                                        className="flex-1 py-2 px-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-blue-200"
                                                    >
                                                        <i className="bi bi-pencil-fill" /> Edit Buku
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteBook(book)}
                                                        className="flex-1 py-2 px-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-red-200"
                                                    >
                                                        <i className="bi bi-trash-fill" /> Hapus Buku
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* VIEW MODE 2: SUB MODUL DARI BUKU YANG DIKLIK (DRILL-DOWN) */}
                {activeBook && (
                    <div className="space-y-6">
                        {/* Book Banner */}
                        <div
                            className={`rounded-2xl p-6 text-white relative overflow-hidden shadow-lg ${
                                activeBook.type === 'robot'
                                    ? 'bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900'
                                    : 'bg-gradient-to-r from-amber-700 via-orange-800 to-slate-900'
                            }`}
                        >
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="space-y-1.5 max-w-2xl">
                                    <div className="flex items-center gap-2">
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white text-gray-900 text-xs font-extrabold shadow">
                                            <i className="bi bi-journal-bookmark-fill text-orange-600" />
                                            MODUL
                                        </div>
                                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20">
                                            {activeBook.typeLabel}
                                        </span>
                                        <span className="text-white/80 text-xs font-mono">&bull; {activeBook.subModules.length} Sub Modul Terdaftar</span>
                                    </div>
                                    <h2 className="text-2xl font-bold">{activeBook.name}</h2>
                                    <p className="text-white/80 text-xs sm:text-sm line-clamp-2">
                                        {activeBook.description}
                                    </p>
                                </div>
                                                <div className="flex items-center gap-1.5 self-start md:self-auto">
                                                    <button
                                                        type="button"
                                                        onClick={() => editBook(activeBook)}
                                                        className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
                                                    >
                                                        <i className="bi bi-pencil-fill" /> Edit Buku
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => deleteBook(activeBook)}
                                                        className="px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
                                                    >
                                                        <i className="bi bi-trash-fill" /> Hapus Buku
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => openAddSubModule(activeBook)}
                                                        className="px-4 py-2 bg-white text-gray-900 rounded-xl font-semibold text-xs sm:text-sm shadow hover:bg-gray-100 flex items-center gap-1.5 transition-colors"
                                                    >
                                                        <i className="bi bi-plus-lg text-orange-600" /> Tambah Sub Modul
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                        {/* Search in Submodules */}
                        <div className="flex gap-4">
                            <div className="flex-1 relative">
                                <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={`Cari sub modul dalam ${activeBook.name}...`}
                                    value={subSearch}
                                    onChange={e => setSubSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm shadow-sm"
                                />
                            </div>
                            <button
                                onClick={() => {
                                    setSelectedBookId(null);
                                    setSubSearch('');
                                }}
                                className="px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 flex items-center gap-2 text-sm shadow-sm"
                            >
                                <i className="bi bi-grid-fill text-orange-600" /> Pilih Buku Lain
                            </button>
                        </div>

                        {/* Submodules Grid */}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {filteredActiveSubModules.length === 0 ? (
                                <div className="col-span-full bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
                                    <i className="bi bi-inbox text-4xl text-gray-300 block mb-3" />
                                    <p className="text-gray-600 font-medium">Tidak ada sub modul ditemukan</p>
                                    <button
                                        onClick={() => openAddSubModule(activeBook)}
                                        className="mt-3 px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-semibold hover:bg-orange-700 inline-flex items-center gap-1.5"
                                    >
                                        <i className="bi bi-plus-lg" /> Tambah Sub Modul Pertama
                                    </button>
                                </div>
                            ) : (
                                filteredActiveSubModules.map((sm, smIdx) => (
                                    <div
                                        key={sm.id}
                                        className="bg-white rounded-2xl border border-gray-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                                    >
                                        {/* Card Header with Top Badge */}
                                        <div className="p-5 pb-3">
                                            <div className="flex items-center justify-between gap-2 mb-2.5">
                                                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-orange-100 text-orange-700 flex items-center gap-1">
                                                    <i className="bi bi-journal-bookmark-fill text-orange-600" />
                                                    Pertemuan {sm.orderIndex || smIdx + 1}
                                                </span>
                                                <span className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                                                    sm.type === 'robot'
                                                        ? 'bg-purple-100 text-purple-700'
                                                        : sm.type === 'coding'
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {sm.typeLabel}
                                                </span>
                                            </div>

                                            <h3 className="font-bold text-gray-900 text-base leading-snug mb-1">
                                                {sm.name}
                                            </h3>
                                            <p className="text-xs text-gray-500 line-clamp-2">
                                                {sm.description || 'Materi pembelajaran untuk sesi pertemuan ini.'}
                                            </p>

                                            {sm.tools && sm.tools.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-3">
                                                    {sm.tools.slice(0, 3).map((tool, tIdx) => (
                                                        <span key={tIdx} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-md font-medium">
                                                            {tool}
                                                        </span>
                                                    ))}
                                                    {sm.tools.length > 3 && (
                                                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded-md">
                                                            +{sm.tools.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Action buttons */}
                                        <div className="p-4 pt-3 bg-gray-50 border-t border-gray-100 flex gap-2">
                                            <button
                                                onClick={() => editModule(sm)}
                                                className="flex-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-1 text-xs"
                                            >
                                                <i className="bi bi-pencil-fill" /> Edit
                                            </button>
                                            <button
                                                onClick={() => deleteModule(sm.id)}
                                                className="flex-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-1 text-xs"
                                            >
                                                <i className="bi bi-trash-fill" /> Hapus
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Back Button */}
                <div className="mt-12">
                    <Link
                        href="/superadmin"
                        className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                    >
                        <i className="bi bi-arrow-left" /> Kembali ke Dashboard
                    </Link>
                </div>
            </div>

            {/* Add/Edit Module Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl my-8">
                        <div className="flex items-center justify-between mb-6 pb-3 border-b">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    {editingId
                                        ? !newModule.parent_id
                                            ? 'Edit Buku Kurikulum'
                                            : 'Edit Sub Modul'
                                        : !newModule.parent_id
                                        ? 'Tambah Buku Kurikulum Baru'
                                        : 'Tambah Sub Modul Baru'}
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {!newModule.parent_id
                                        ? 'Buku kurikulum akan menjadi wadah induk dari sub modul pertemuan.'
                                        : 'Sub modul materi pembelajaran yang terhubung ke buku kurikulum.'}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
                            >
                                <i className="bi bi-x-lg text-lg" />
                            </button>
                        </div>

                        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                            {/* Nama Modul / Buku */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    {!newModule.parent_id ? 'Nama Buku Kurikulum' : 'Nama Sub Modul'}
                                </label>
                                <input
                                    type="text"
                                    value={newModule.name}
                                    onChange={e => setNewModule({ ...newModule, name: e.target.value })}
                                    placeholder={!newModule.parent_id ? 'Contoh: Buku Robotika Level 1' : 'Contoh: Modul 1 – Pengenalan Robotika'}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            {/* Judul Buku / Seri Buku */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Judul Buku / Seri Katalog <span className="text-gray-400 font-normal">(opsional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={newModule.book_title}
                                    onChange={e => setNewModule({ ...newModule, book_title: e.target.value })}
                                    placeholder="Contoh: Buku Panduan Robotika Seri A"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                                />
                            </div>

                            {/* Modul Induk (Parent) */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Kategori Modul Induk (Buku) <span className="text-gray-400 font-normal">(Kosongkan jika ini adalah Buku Kurikulum)</span>
                                </label>
                                <select
                                    value={newModule.parent_id}
                                    onChange={e => setNewModule({ ...newModule, parent_id: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                                >
                                    <option value="">-- Tanpa Induk (Ini adalah Buku Kurikulum) --</option>
                                    {parentModules.filter(p => !editingId || p.id !== editingId).map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.name} {p.book_title ? `[${p.book_title}]` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Urutan Pertemuan (Hanya jika memiliki modul induk) */}
                            {newModule.parent_id ? (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Urutan Pertemuan
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={newModule.order_index}
                                        onChange={e => setNewModule({ ...newModule, order_index: Number(e.target.value) })}
                                        placeholder="Contoh: 1, 2, 3..."
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                                    />
                                </div>
                            ) : null}

                            {/* Image/Icon */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">URL Gambar Cover Buku / Modul <span className="text-gray-400 font-normal">(opsional)</span></label>
                                <input
                                    type="text"
                                    value={newModule.image}
                                    onChange={e => setNewModule({ ...newModule, image: e.target.value })}
                                    placeholder="https://contoh.com/cover-buku.png"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                                />
                            </div>

                            {/* Deskripsi */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi</label>
                                <textarea
                                    value={newModule.description}
                                    onChange={e => setNewModule({ ...newModule, description: e.target.value })}
                                    placeholder="Jelaskan modul ini..."
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none h-20"
                                />
                            </div>

                            {/* Tipe Modul */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Tipe Modul</label>
                                <select
                                    value={newModule.type}
                                    onChange={e => setNewModule({ ...newModule, type: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="robot">Robot Building</option>
                                    <option value="coding">Coding</option>
                                    <option value="general">General</option>
                                </select>
                            </div>

                            {/* Tools */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Alat yang Diperlukan</label>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={newModule.newTool}
                                        onChange={e => setNewModule({ ...newModule, newTool: e.target.value })}
                                        placeholder="Nama alat..."
                                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                    <button
                                        onClick={addTool}
                                        className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
                                    >
                                        <i className="bi bi-plus-lg" />
                                    </button>
                                </div>
                                {newModule.tools.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {newModule.tools.map((tool, idx) => (
                                            <div key={idx} className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm flex items-center gap-2">
                                                {tool}
                                                <button
                                                    onClick={() => removeTool(idx)}
                                                    className="text-orange-600 hover:text-orange-900"
                                                >
                                                    <i className="bi bi-x-lg text-xs" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-6 border-t">
                                <button
                                    onClick={resetForm}
                                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
                                >
                                    {editingId ? 'Simpan Perubahan' : !newModule.parent_id ? 'Simpan Buku Baru' : 'Simpan Sub Modul'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Bulk Insert CSV Modul */}
            {showImportModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <i className="bi bi-file-earmark-spreadsheet text-emerald-600 text-xl" />
                                Bulk Insert Modul Kurikulum (.csv)
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowImportModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <i className="bi bi-x-lg text-lg" />
                            </button>
                        </div>

                        <p className="text-sm text-gray-600 mb-4">
                            Unggah berkas CSV untuk mendaftarkan <strong>Buku Kurikulum Induk</strong> maupun <strong>Sub Modul Pertemuan</strong> secara massal lengkap dengan seluruh data atributnya.
                        </p>

                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 mb-4 space-y-1.5">
                            <p className="font-semibold flex items-center gap-1.5">
                                <i className="bi bi-info-circle-fill" /> Panduan Kolom Template CSV:
                            </p>
                            <p className="text-[11px] leading-relaxed text-amber-900">
                                <strong>1. Nama Modul:</strong> Judul modul / bab pertemuan <em>(wajib)</em><br />
                                <strong>2. Buku Induk:</strong> Nama buku kurikulum. Kosongkan jika baris ini merupakan Buku Induk Utama.<br />
                                <strong>3. Tipe:</strong> <code className="bg-amber-100 px-1 rounded">robot</code>, <code className="bg-amber-100 px-1 rounded">coding</code>, atau <code className="bg-amber-100 px-1 rounded">general</code><br />
                                <strong>4. Urutan:</strong> Urutan bab / pertemuan (angka)<br />
                                <strong>5. Deskripsi:</strong> Ringkasan materi pertemuan / silabus<br />
                                <strong>6. URL Gambar:</strong> Path / URL gambar cover modul<br />
                                <strong>7. Alat dan Bahan:</strong> Pisahkan alat dengan tanda koma (misal: <em>Arduino Uno, Motor Driver</em>)
                            </p>
                        </div>

                        <form onSubmit={handleImportSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Pilih File CSV</label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".csv"
                                    onChange={e => setImportFile(e.target.files?.[0] || null)}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 border border-gray-200 rounded-lg cursor-pointer p-1"
                                />
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <a
                                    href="/superadmin/modules/template"
                                    className="text-xs text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1"
                                >
                                    <i className="bi bi-download" /> Download Template CSV
                                </a>

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowImportModal(false)}
                                        className="px-4 py-2 text-sm border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!importFile || isUploading}
                                        className="px-5 py-2 text-sm bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-1.5"
                                    >
                                        {isUploading ? (
                                            <>
                                                <i className="bi bi-arrow-repeat animate-spin" />
                                                <span>Mengimpor...</span>
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-upload" />
                                                <span>Unggah & Impor</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
