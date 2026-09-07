import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { SessionStatus } from '@/types/session';

interface SessionItem {
    id: number;
    title: string;
    date: string | null;
    dateString: string;
    status: SessionStatus;
    description: string | null;
    tools: string[];
    studentId: number;
    studentName: string;
    modules: Array<{ id: number; name: string }>;
}

interface Paginated<T> {
    data: T[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    sessions: Paginated<SessionItem>;
    search: string;
    filterStatus: string;
    students: Array<{ id: number; name: string }>;
    modules: Array<{ id: number; name: string }>;
}

const statusBadge: Record<SessionStatus, string> = {
    hadir:         'bg-green-100 text-green-700',
    absen:         'bg-red-100 text-red-700',
    reschedule:    'bg-yellow-100 text-yellow-700',
    libur:         'bg-orange-100 text-orange-700',
    'akan-datang': 'bg-blue-100 text-blue-700',
};

const statusOptions: { value: SessionStatus; label: string }[] = [
    { value: 'hadir',         label: 'Hadir' },
    { value: 'absen',         label: 'Absen' },
    { value: 'reschedule',    label: 'Reschedule' },
    { value: 'libur',         label: 'Libur' },
    { value: 'akan-datang',   label: 'Akan Datang' },
];

const emptyForm = {
    student_id: '',
    title: '',
    date: '',
    status: 'akan-datang' as SessionStatus,
    description: '',
    module_ids: [] as number[],
    tools: [] as string[],
};

export default function TutorSessions() {
    const { sessions, search: initialSearch, filterStatus: initialFilterStatus, students, modules } =
        usePage().props as unknown as Props;

    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [filterStatus, setFilterStatus] = useState(initialFilterStatus);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [formData, setFormData] = useState(emptyForm);
    const [toolInput, setToolInput] = useState('');

    const applyFilters = (term: string, status: string) => {
        router.get('/tutor/sessions', { search: term, filter_status: status }, { preserveState: true });
    };

    const openCreate = () => {
        setEditingId(null);
        setFormData(emptyForm);
        setShowForm(true);
    };

    const openEdit = (s: SessionItem) => {
        setEditingId(s.id);
        setFormData({
            student_id: String(s.studentId),
            title: s.title,
            date: s.date ?? '',
            status: s.status,
            description: s.description ?? '',
            module_ids: s.modules.map(m => m.id),
            tools: s.tools,
        });
        setShowForm(true);
    };

    const addTool = () => {
        const t = toolInput.trim();
        if (t && !formData.tools.includes(t)) {
            setFormData(prev => ({ ...prev, tools: [...prev.tools, t] }));
            setToolInput('');
        }
    };

    const removeTool = (t: string) =>
        setFormData(prev => ({ ...prev, tools: prev.tools.filter(x => x !== t) }));

    const toggleModule = (id: number) =>
        setFormData(prev => ({
            ...prev,
            module_ids: prev.module_ids.includes(id)
                ? prev.module_ids.filter(x => x !== id)
                : [...prev.module_ids, id],
        }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            student_id: Number(formData.student_id),
            title: formData.title,
            date_string: formData.date,
            date: formData.date,
            status: formData.status,
            description: formData.description || null,
            tools: formData.tools.length > 0 ? formData.tools : null,
            module_ids: formData.module_ids,
        };

        if (editingId !== null) {
            router.put(`/tutor/sessions/${editingId}`, payload, { onSuccess: () => setShowForm(false) });
        } else {
            router.post('/tutor/sessions', payload, { onSuccess: () => setShowForm(false) });
        }
    };

    const handleDelete = (id: number) => {
        router.delete(`/tutor/sessions/${id}`, { onSuccess: () => setDeleteId(null) });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Kelola Sesi" />

            {/* Tutor Navbar */}
            <nav className="bg-teal-700 text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <i className="bi bi-cpu-fill" />
                    </div>
                    <span className="font-bold text-lg">AICI</span>
                    <span className="text-teal-200 text-sm">/ Tutor Panel</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/tutor/sessions" className="text-sm text-white font-medium border-b border-white pb-0.5">Sesi</Link>
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <i className="bi bi-person-fill" />
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Kelola Sesi</h1>
                        <p className="text-gray-500 text-sm mt-1">{sessions.data.length} sesi terdaftar</p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors"
                    >
                        <i className="bi bi-plus-lg" /> Tambah Sesi
                    </button>
                </div>

                {/* Search + Filter */}
                <div className="flex flex-col sm:flex-row gap-3 mb-6">
                    <div className="relative flex-1">
                        <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && applyFilters(searchTerm, filterStatus)}
                            placeholder="Cari judul sesi..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={e => {
                            setFilterStatus(e.target.value);
                            applyFilters(searchTerm, e.target.value);
                        }}
                        className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                        <option value="">Semua Status</option>
                        {statusOptions.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    {sessions.data.length === 0 ? (
                        <div className="text-center py-16">
                            <i className="bi bi-calendar-x text-4xl text-gray-300" />
                            <p className="text-gray-500 mt-3">Belum ada sesi</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="text-left px-5 py-3 font-semibold text-gray-600">#</th>
                                    <th className="text-left px-5 py-3 font-semibold text-gray-600">Judul Sesi</th>
                                    <th className="text-left px-5 py-3 font-semibold text-gray-600 hidden md:table-cell">Siswa</th>
                                    <th className="text-left px-5 py-3 font-semibold text-gray-600 hidden md:table-cell">Tanggal</th>
                                    <th className="text-left px-5 py-3 font-semibold text-gray-600 hidden lg:table-cell">Modul</th>
                                    <th className="text-left px-5 py-3 font-semibold text-gray-600">Status</th>
                                    <th className="text-right px-5 py-3 font-semibold text-gray-600">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sessions.data.map((session, idx) => (
                                    <tr key={session.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-3 text-gray-400">{idx + 1}</td>
                                        <td className="px-5 py-3 font-medium text-gray-900">{session.title}</td>
                                        <td className="px-5 py-3 text-gray-600 hidden md:table-cell">{session.studentName}</td>
                                        <td className="px-5 py-3 text-gray-600 hidden md:table-cell">{session.dateString}</td>
                                        <td className="px-5 py-3 text-gray-500 hidden lg:table-cell truncate max-w-xs">
                                            {session.modules.map(m => m.name).join(', ') || '-'}
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusBadge[session.status]}`}>
                                                {session.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEdit(session)}
                                                    className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <i className="bi bi-pencil-fill" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteId(session.id)}
                                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Hapus"
                                                >
                                                    <i className="bi bi-trash-fill" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Pagination */}
                {sessions.links.length > 3 && (
                    <div className="flex justify-center gap-1 mt-6">
                        {sessions.links.map((link, i) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() => link.url && router.visit(link.url)}
                                className={`px-3 py-1.5 rounded-lg text-sm ${
                                    link.active
                                        ? 'bg-teal-600 text-white'
                                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Session Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl my-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            <i className={`bi ${editingId !== null ? 'bi-pencil' : 'bi-plus-circle'} text-teal-600 mr-2`} />
                            {editingId !== null ? 'Edit Sesi' : 'Tambah Sesi Baru'}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Siswa <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.student_id}
                                    onChange={e => setFormData(prev => ({ ...prev, student_id: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    required
                                >
                                    <option value="">-- Pilih Siswa --</option>
                                    {students.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Judul Sesi <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="contoh: Perkenalan Robot & Coding Dasar"
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Tanggal <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={e => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={e => setFormData(prev => ({ ...prev, status: e.target.value as SessionStatus }))}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    >
                                        {statusOptions.map(s => (
                                            <option key={s.value} value={s.value}>{s.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Modul</label>
                                <div className="flex flex-wrap gap-2">
                                    {modules.map(m => (
                                        <button
                                            key={m.id}
                                            type="button"
                                            onClick={() => toggleModule(m.id)}
                                            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                                                formData.module_ids.includes(m.id)
                                                    ? 'bg-teal-600 text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                        >
                                            {m.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    rows={3}
                                    placeholder="Deskripsi singkat tentang materi sesi ini..."
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Alat yang Perlu Dibawa</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={toolInput}
                                        onChange={e => setToolInput(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTool())}
                                        placeholder="Tambah alat (tekan Enter)"
                                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                    <button type="button" onClick={addTool} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                                        <i className="bi bi-plus-lg" />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.tools.map(t => (
                                        <span key={t} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-700">
                                            {t}
                                            <button type="button" onClick={() => removeTool(t)} className="text-gray-400 hover:text-red-500">
                                                <i className="bi bi-x" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700"
                                >
                                    {editingId !== null ? 'Simpan Perubahan' : 'Tambah Sesi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirm Modal */}
            {deleteId !== null && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="bi bi-exclamation-triangle-fill text-red-500 text-xl" />
                        </div>
                        <h3 className="font-bold text-gray-900 text-center text-lg mb-2">Hapus Sesi?</h3>
                        <p className="text-gray-500 text-sm text-center mb-6">
                            Sesi <strong>{sessions.data.find(s => s.id === deleteId)?.title}</strong> akan dihapus permanen.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => handleDelete(deleteId)}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
