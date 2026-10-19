import FlashToast from '@/Components/FlashToast';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';

interface ClassroomItem {
    id: number;
    name: string;
    students_count: number;
    meetings_count: number;
}

interface ClassroomOption {
    id: number;
    name: string;
    tutor_id: number | null;
    tutor_name?: string | null;
    students_count: number;
}

interface Tutor {
    id: number;
    name: string;
    email: string;
    peran: string;
    status: string;
    terdaftar: string;
    students_count: number;
    classrooms_count: number;
    classrooms: ClassroomItem[];
    sessions_count: number;
}

interface Paginated<T> {
    data: T[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    users: Paginated<Tutor>;
    classrooms?: ClassroomOption[];
    search: string;
    filterStatus: string;
    import_errors?: string[];
}

export default function TutorManagement() {
    const { users, classrooms = [], search, filterStatus: initialFilterStatus } = usePage().props as unknown as Props;
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
        classroom_ids: [] as number[],
    });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState(search);
    const [filterStatus, setFilterStatus] = useState(initialFilterStatus);

    const applyFilters = (term: string, status: string) => {
        router.get('/superadmin/tutors', { search: term, filter_status: status }, { preserveState: true });
    };

    const openModal = (tutor?: Tutor) => {
        setFormErrors({});
        if (tutor) {
            setEditingId(tutor.id);
            setFormData({
                name: tutor.name,
                email: tutor.email,
                password: '',
                status: tutor.status,
                classroom_ids: tutor.classrooms ? tutor.classrooms.map(c => c.id) : [],
            });
        } else {
            setEditingId(null);
            setFormData({
                name: '',
                email: '',
                password: '',
                status: 'aktif',
                classroom_ids: [],
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setFormErrors({});
        setFormData({
            name: '',
            email: '',
            password: '',
            status: 'aktif',
            classroom_ids: [],
        });
    };

    const toggleClassroomSelection = (classId: number) => {
        setFormData(prev => {
            const exists = prev.classroom_ids.includes(classId);
            return {
                ...prev,
                classroom_ids: exists
                    ? prev.classroom_ids.filter(id => id !== classId)
                    : [...prev.classroom_ids, classId],
            };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setFormErrors({});

        const payload: Record<string, any> = {
            name: formData.name,
            email: formData.email,
            status: formData.status,
            classroom_ids: formData.classroom_ids,
        };

        if (formData.password) {
            payload.password = formData.password;
            payload.password_confirmation = formData.password;
        }

        if (editingId) {
            router.put(`/superadmin/tutors/${editingId}`, payload, {
                onSuccess: () => closeModal(),
                onError: (errs) => setFormErrors(errs),
                onFinish: () => setIsSubmitting(false),
            });
        } else {
            router.post('/superadmin/tutors', payload, {
                onSuccess: () => closeModal(),
                onError: (errs) => setFormErrors(errs),
                onFinish: () => setIsSubmitting(false),
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
            <FlashToast />

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
                            <i className="bi bi-file-earmark-spreadsheet-fill text-lg" /> Import Tutor (CSV)
                        </button>
                    </div>

                    <a
                        href="/superadmin/tutors/template"
                        className="text-xs text-teal-700 hover:text-teal-900 font-medium inline-flex items-center gap-1.5 underline"
                    >
                        <i className="bi bi-download" /> Unduh Template Import Tutor (.csv)
                    </a>
                </div>

                {/* Tutors Table */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">Tutor</th>
                                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">Kelas Diampu</th>
                                    <th className="px-4 py-4 text-center text-sm font-semibold text-gray-700">Total Murid</th>
                                    <th className="px-4 py-4 text-center text-sm font-semibold text-gray-700">Pertemuan</th>
                                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                    <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">Terdaftar</th>
                                    <th className="px-4 py-4 text-center text-sm font-semibold text-gray-700">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center">
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
                                            <td className="px-4 py-4">
                                                {tutor.classrooms && tutor.classrooms.length > 0 ? (
                                                    <div className="flex flex-col gap-1.5 max-w-xs">
                                                        {tutor.classrooms.map((cls) => (
                                                            <div
                                                                key={cls.id}
                                                                className="inline-flex items-center justify-between gap-2 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                                                            >
                                                                <span className="font-medium text-slate-700 truncate max-w-[150px]" title={cls.name}>
                                                                    {cls.name}
                                                                </span>
                                                                <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded border border-teal-100 shrink-0">
                                                                    {cls.meetings_count} sesi &bull; {cls.students_count} murid
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">Belum ada kelas</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                                                    {tutor.students_count} murid
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <div className="inline-flex flex-col items-center">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                                        {tutor.sessions_count} pertemuan
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 mt-0.5"></span>
                                                </div>
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
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                    {editingId ? 'Edit Akun & Penugasan Tutor' : 'Tambah Tutor Baru'}
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {editingId ? 'Perbarui data akun dan penugasan kelas diampu' : 'Daftarkan akun tutor baru beserta kelas binaannya'}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 transition"
                            >
                                <i className="bi bi-x-lg text-lg" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 pt-4 overflow-y-auto pr-1 flex-1">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Nama Lengkap <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Contoh: Aiya Putri"
                                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                                        formErrors.name ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                                    }`}
                                    required
                                />
                                {formErrors.name && (
                                    <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="Contoh: aiya@aici.id"
                                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                                        formErrors.email ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                                    }`}
                                    required
                                />
                                {formErrors.email && (
                                    <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>
                                )}
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Status Akun</label>
                                <select
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                >
                                    <option value="aktif">Aktif</option>
                                    <option value="nonaktif">Nonaktif</option>
                                    <option value="pending">Pending</option>
                                </select>
                                {formErrors.status && (
                                    <p className="text-xs text-red-500 mt-1">{formErrors.status}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    {editingId ? 'Ganti Password (Opsional)' : 'Password'} {!editingId && <span className="text-red-500">*</span>}
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    placeholder={editingId ? 'Kosongkan jika tidak ingin mengubah password' : 'Masukkan password (min. 8 karakter)'}
                                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                                        formErrors.password ? 'border-red-400 bg-red-50/30' : 'border-gray-200'
                                    }`}
                                    required={!editingId}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    <i className="bi bi-info-circle mr-1" />
                                    {editingId
                                        ? 'Isi hanya jika ingin mengganti password login tutor (minimal 8 karakter).'
                                        : 'Password minimal 8 karakter untuk login ke portal Tutor.'}
                                </p>
                                {formErrors.password && (
                                    <p className="text-xs text-red-500 mt-1">{formErrors.password}</p>
                                )}
                            </div>

                            {/* Kelas Diampu (Terintegrasi Pengelola Kelas) */}
                            <div className="pt-2 border-t border-gray-100">
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-sm font-semibold text-gray-800">
                                        Kelas Diampu <span className="text-xs font-normal text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">Terintegrasi</span>
                                    </label>
                                    {classrooms.length > 0 && (
                                        <div className="flex items-center gap-2 text-xs">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, classroom_ids: classrooms.map(c => c.id) })}
                                                className="text-teal-600 hover:text-teal-800 font-medium"
                                            >
                                                Pilih Semua
                                            </button>
                                            <span className="text-gray-300">|</span>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, classroom_ids: [] })}
                                                className="text-gray-500 hover:text-gray-700 font-medium"
                                            >
                                                Kosongkan
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mb-2.5">
                                    Pilih kelas yang diajar oleh tutor ini. Data murid dan sesi di kelas akan disinkronkan secara otomatis.
                                </p>

                                {classrooms.length === 0 ? (
                                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-500 text-center">
                                        Belum ada kelas yang terdaftar di sistem. Anda dapat membuat kelas di menu Pengelola Kelas.
                                    </div>
                                ) : (
                                    <div className="border border-gray-200 rounded-lg p-2 max-h-48 overflow-y-auto space-y-1.5 bg-gray-50/50">
                                        {classrooms.map((cls) => {
                                            const isSelected = formData.classroom_ids.includes(cls.id);
                                            const isAssignedOther = cls.tutor_id && cls.tutor_id !== editingId;

                                            return (
                                                <label
                                                    key={cls.id}
                                                    className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition border text-xs ${
                                                        isSelected
                                                            ? 'bg-teal-50/60 border-teal-300 text-teal-950 font-medium'
                                                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => toggleClassroomSelection(cls.id)}
                                                        className="mt-0.5 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between gap-1">
                                                            <span className="font-semibold text-gray-900 truncate">
                                                                {cls.name}
                                                            </span>
                                                            <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded shrink-0">
                                                                {cls.students_count} murid
                                                            </span>
                                                        </div>
                                                        {isAssignedOther && (
                                                            <p className="text-[10px] text-amber-700 mt-0.5 flex items-center gap-1">
                                                                <i className="bi bi-arrow-repeat text-amber-600" />
                                                                Saat ini diampu: <strong>{cls.tutor_name || 'Tutor Lain'}</strong>
                                                            </p>
                                                        )}
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}
                                <div className="flex items-center justify-between text-xs text-gray-500 mt-1.5 px-0.5">
                                    <span>Terpilih: <strong>{formData.classroom_ids.length}</strong> kelas</span>
                                    {formErrors.classroom_ids && (
                                        <span className="text-red-500">{formErrors.classroom_ids}</span>
                                    )}
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting && <i className="bi bi-arrow-repeat animate-spin" />}
                                    {isSubmitting
                                        ? 'Menyimpan...'
                                        : editingId
                                        ? 'Simpan Perubahan'
                                        : 'Tambah Tutor'}
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
                                <h3 className="text-lg font-bold text-gray-900">Import Tutor Massal (CSV)</h3>
                            </div>
                            <button
                                onClick={() => setShowImportModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition"
                            >
                                <i className="bi bi-x-lg text-lg" />
                            </button>
                        </div>

                        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                            Unggah berkas <strong>.csv</strong> untuk mendaftarkan akun tutor AICI sekaligus secara otomatis.
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
                                Unduh Template CSV Tutor (.csv)
                            </a>
                        </div>

                        <form onSubmit={handleImportSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Pilih File CSV</label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".csv"
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
