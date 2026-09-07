import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

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
}

export default function TutorManagement() {
    const { users, search, filterStatus: initialFilterStatus } = usePage().props as unknown as Props;

    const [showModal, setShowModal] = useState(false);
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

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Kelola Tutor" />

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <Link href="/superadmin" className="text-gray-600 hover:text-gray-900">
                                <i className="bi bi-arrow-left text-xl" />
                            </Link>
                            <div>
                                <h1 className="font-bold text-lg">AICI</h1>
                                <p className="text-xs text-gray-500">Kelola Tutor</p>
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

                {/* Add New Tutor Button */}
                <div className="mb-6">
                    <button
                        onClick={() => openModal()}
                        className="px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 flex items-center gap-2"
                    >
                        <i className="bi bi-plus-lg" /> Tambah Tutor Baru
                    </button>
                </div>

                {/* Tutors Table */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nama</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Peran</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Terdaftar</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Aksi</th>
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
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-gray-900">{tutor.name}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-gray-600">{tutor.email}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                                    {tutor.peran}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleStatus(tutor.id)}
                                                    className={`px-3 py-1 text-xs font-semibold rounded-full cursor-pointer transition-colors ${
                                                        tutor.status === 'aktif'
                                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                    }`}
                                                >
                                                    {tutor.status === 'aktif' ? 'Aktif' : tutor.status === 'pending' ? 'Pending' : 'Nonaktif'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-gray-600 text-sm">{tutor.terdaftar}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => openModal(tutor)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <i className="bi bi-pencil-fill" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteTutor(tutor.id)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Hapus"
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
        </div>
    );
}
