import { Head, Link, router, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';

interface Tutor {
    id: number;
    name: string;
    email: string;
    peran: string;
    status: string;
    terdaftar: string;
    students_count: number;
    sessions_count: number;
}

interface Paginated<T> {
    data: T[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    users: Paginated<Tutor>;
    search: string;
    filterStatus: string;
    import_errors?: string[];
}

export default function TutorManagement() {
    const { users, search, filterStatus: initialFilterStatus } = usePage().props as unknown as Props;
    const pageProps = usePage().props as unknown as Props;
    const importErrors = pageProps.import_errors || [];

    const [showModal, setShowModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [importFile, setImportFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        status: 'aktif',
    });
    const [searchTerm, setSearchTerm] = useState(search);
    const [filterStatus, setFilterStatus] = useState(initialFilterStatus);

    const applyFilters = (term: string, status: string) => {
        router.get('/superadmin/tutors', { search: term, filter_status: status }, { preserveState: true });
    };

    const openModal = (tutor?: Tutor) => {
        if (tutor) {
            setEditingId(tutor.id);
            setFormData({ name: tutor.name, email: tutor.email, password: '', status: tutor.status });
        } else {
            setEditingId(null);
            setFormData({ name: '', email: '', password: '', status: 'aktif' });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setFormData({ name: '', email: '', password: '', status: 'aktif' });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            name: formData.name,
            email: formData.email,
            password: formData.password || undefined,
            password_confirmation: formData.password || undefined,
            status: formData.status,
        };

        if (editingId) {
            router.put(`/superadmin/tutors/${editingId}`, payload, {
                onSuccess: () => closeModal(),
            });
        } else {
            router.post('/superadmin/tutors', payload, {
                onSuccess: () => closeModal(),
            });
        }
    };

    const deleteTutor = (id: number) => {
        if (window.confirm('Yakin ingin menghapus tutor ini?')) {
            router.delete(`/superadmin/tutors/${id}`);
        }
    };

    const toggleStatus = (id: number) => {
        router.patch(`/superadmin/tutors/${id}/toggle-status`);
    };

    const handleImportSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!importFile) return;

        const uploadData = new FormData();
        uploadData.append('file', importFile);

        setIsUploading(true);
        router.post('/superadmin/tutors/import-excel', uploadData, {
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
            <Head title="Kelola Tutor" />

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
                                <p className="text-xs font-semibold text-gray-600">Kelola Tutor</p>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Kelola Akun Tutor</h1>
                    <p className="text-gray-600">Tambah, edit, atau hapus akun tutor AICI</p>
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
                    <div className="grid md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Cari Tutor</label>
                            <form onSubmit={e => { e.preventDefault(); applyFilters(searchTerm, filterStatus); }}>
                                <div className="relative">
                                    <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Cari nama atau email..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Filter Status */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                            <select
                                value={filterStatus}
                                onChange={e => { setFilterStatus(e.target.value); applyFilters(searchTerm, e.target.value); }}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                            >
                                <option>Semua</option>
                                <option>aktif</option>
                                <option>nonaktif</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Import Error Banner */}
                {importErrors.length > 0 && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <div className="flex items-center gap-2 mb-2 text-red-800 font-semibold">
                            <i className="bi bi-exclamation-triangle-fill" />
                            <span>Terdapat {importErrors.length} kesalahan saat impor:</span>
                        </div>
                        <ul className="list-disc list-inside text-sm text-red-700 space-y-1 max-h-40 overflow-y-auto">
                            {importErrors.map((err, idx) => (
                                <li key={idx}>{err}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Add New Tutor & Bulk Import Buttons */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => openModal()}
                            className="px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 flex items-center gap-2 transition"
                        >
                            <i className="bi bi-plus-lg" /> Tambah Tutor Baru
                        </button>
                        <button
                            onClick={() => setShowImportModal(true)}
                            className="px-5 py-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg font-medium hover:bg-emerald-100 flex items-center gap-2 transition"
                        >
                            <i className="bi bi-file-earmark-spreadsheet-fill text-lg" /> Import Tutor (Excel)
                        </button>
                    </div>

                    <a
                        href="/superadmin/tutors/template"
                        className="text-xs text-teal-700 hover:text-teal-900 font-medium inline-flex items-center gap-1.5 underline"
                    >
                        <i className="bi bi-download" /> Unduh Template Import Tutor (.xlsx)
                    </a>
                </div>

                {/* Tutors Table */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">Tutor</th>
                                    <th className="px-4 py-4 text-center text-sm font-semibold text-gray-700">Murid</th>
                                    <th className="px-4 py-4 text-center text-sm font-semibold text-gray-700">Sesi</th>
                                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">Terdaftar</th>
                                    <th className="px-4 py-4 text-center text-sm font-semibold text-gray-700">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center">
                                            <i className="bi bi-inbox text-4xl text-gray-300 block mb-3" />
                                            <p className="text-gray-600">Tidak ada tutor yang ditemukan</p>
                                        </td>
                                    </tr>
                                ) : (
                                    users.data.map(tutor => (
                                        <tr key={tutor.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-4">
                                                <p className="font-semibold text-gray-900">{tutor.name}</p>
                                                <p className="text-xs text-gray-500">{tutor.email}</p>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className="text-sm font-semibold text-teal-700">{tutor.students_count}</span>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className="text-sm font-semibold text-blue-700">{tutor.sessions_count}</span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <button
                                                    onClick={() => toggleStatus(tutor.id)}
                                                    className={`px-3 py-1 text-xs font-semibold rounded-full cursor-pointer transition-colors ${
                                                        tutor.status === 'aktif'
                                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                            : tutor.status === 'pending'
                                                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                    }`}
                                                >
                                                    {tutor.status === 'aktif' ? 'Aktif' : tutor.status === 'pending' ? 'Pending' : 'Nonaktif'}
                                                </button>
                                            </td>
                                            <td className="px-4 py-4">
                                                <p className="text-gray-600 text-sm">{tutor.terdaftar}</p>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <Link
                                                        href={`/superadmin/calendar/tutors/${tutor.id}`}
                                                        className="p-2 text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                                                        title="Buka Kalender Mengajar Tutor"
                                                    >
                                                        <i className="bi bi-calendar3" />
                                                    </Link>
                                                    <Link
                                                        href={`/superadmin/tutors/${tutor.id}`}
                                                        className="p-2 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                                                        title="Detail Profil & Murid Binaan"
                                                    >
                                                        <i className="bi bi-person-lines-fill" />
                                                    </Link>
                                                    <button
                                                        onClick={() => openModal(tutor)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit Akun"
                                                    >
                                                        <i className="bi bi-pencil-fill" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteTutor(tutor.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Hapus Akun"
                                                    >
                                                        <i className="bi bi-trash-fill" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {users.links.length > 3 && (
                        <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap gap-2">
                            {users.links.map((link, i) => (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.visit(link.url)}
                                    className={`px-3 py-1.5 text-sm rounded-lg ${link.active ? 'bg-teal-600 text-white' : link.url ? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Back Button */}
                <div className="mt-8">
                    <Link
                        href="/superadmin"
                        className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                    >
                        <i className="bi bi-arrow-left" /> Kembali ke Dashboard
                    </Link>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">
                            {editingId ? 'Edit Tutor' : 'Tambah Tutor Baru'}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Contoh: Aiya Putri"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="Contoh: aiya@aici.id"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                >
                                    <option value="aktif">Aktif</option>
                                    <option value="nonaktif">Nonaktif</option>
                                    <option value="pending">Pending</option>
                                </select>
                            </div>

                            {/* Password (only for new tutor) */}
                            {!editingId && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="Masukkan password"
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                    <p className="text-xs text-gray-600 mt-1">
                                        <i className="bi bi-info-circle mr-1" />
                                        Password minimal 8 karakter
                                    </p>
                                </div>
                            )}

                            {/* Buttons */}
                            <div className="flex gap-3 pt-6">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
                                >
                                    {editingId ? 'Update' : 'Tambah'} Tutor
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Bulk Import Modal */}
            {showImportModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg">
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                            <div className="flex items-center gap-2 text-teal-700">
                                <i className="bi bi-file-earmark-spreadsheet-fill text-2xl" />
                                <h3 className="text-lg font-bold text-gray-900">Import Tutor Massal (Excel)</h3>
                            </div>
                            <button
                                onClick={() => setShowImportModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition"
                            >
                                <i className="bi bi-x-lg text-lg" />
                            </button>
                        </div>

                        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                            Unggah berkas spreadsheet <strong>.xlsx</strong>, <strong>.xls</strong>, atau <strong>.csv</strong> untuk mendaftarkan akun tutor AICI sekaligus secara otomatis.
                        </p>

                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 mb-5 flex items-start gap-3">
                            <i className="bi bi-lightbulb-fill text-amber-600 text-lg mt-0.5 shrink-0" />
                            <div className="text-xs text-amber-900 leading-relaxed">
                                <span className="font-semibold block mb-0.5">Petunjuk Format Berkas:</span>
                                Gunakan template resmi AICI agar kolom data (Nama Tutor, Email, Password, Status) terbaca sempurna. Password default adalah <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-amber-950 font-semibold">aici1234</code> jika dikosongkan.
                            </div>
                        </div>

                        <div className="mb-4">
                            <a
                                href="/superadmin/tutors/template"
                                className="inline-flex items-center gap-2 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 px-3.5 py-2 rounded-lg transition"
                            >
                                <i className="bi bi-file-earmark-arrow-down-fill text-sm" />
                                Unduh Template Spreadsheet Tutor (.xlsx)
                            </a>
                        </div>

                        <form onSubmit={handleImportSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Pilih File Spreadsheet</label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".xlsx, .xls, .csv"
                                    onChange={e => setImportFile(e.target.files?.[0] || null)}
                                    className="w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 border border-gray-200 rounded-lg cursor-pointer p-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    required
                                />
                                {importFile && (
                                    <p className="text-xs text-emerald-600 font-medium mt-1.5 flex items-center gap-1">
                                        <i className="bi bi-check-circle-fill" /> File terpilih: {importFile.name} ({(importFile.size / 1024).toFixed(1)} KB)
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setShowImportModal(false)}
                                    disabled={isUploading}
                                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={!importFile || isUploading}
                                    className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isUploading ? (
                                        <>
                                            <i className="bi bi-arrow-repeat animate-spin" /> Mengimpor...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-upload" /> Mulai Impor
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
