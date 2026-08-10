import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

interface Student {
    id: number;
    name: string;
    email: string;
    role: string;
    status: 'Aktif' | 'Nonaktif';
    createdAt: string;
}

export default function StudentManagement() {
    const [students, setStudents] = useState<Student[]>([
        {
            id: 1,
            name: 'Adi Wijaya',
            email: 'adi@school.id',
            role: 'Murid',
            status: 'Aktif',
            createdAt: '2025-01-02'
        },
        {
            id: 2,
            name: 'Binti Rahmah',
            email: 'binti@school.id',
            role: 'Murid',
            status: 'Aktif',
            createdAt: '2025-01-05'
        },
        {
            id: 3,
            name: 'Citra Dewi',
            email: 'citra@school.id',
            role: 'Murid',
            status: 'Nonaktif',
            createdAt: '2025-01-10'
        }
    ]);

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'Semua' | 'Aktif' | 'Nonaktif'>('Semua');

    const filteredStudents = students.filter(student => {
        const matchSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchStatus = filterStatus === 'Semua' || student.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const openModal = (student?: Student) => {
        if (student) {
            setEditingId(student.id);
            setFormData({ name: student.name, email: student.email, password: '' });
        } else {
            setEditingId(null);
            setFormData({ name: '', email: '', password: '' });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setFormData({ name: '', email: '', password: '' });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email || (!editingId && !formData.password)) {
            alert('Semua field harus diisi');
            return;
        }

        if (editingId) {
            // Update student
            setStudents(students.map(s => 
                s.id === editingId 
                    ? { ...s, name: formData.name, email: formData.email }
                    : s
            ));
        } else {
            // Add new student
            const newStudent: Student = {
                id: Math.max(...students.map(s => s.id), 0) + 1,
                name: formData.name,
                email: formData.email,
                role: 'Murid',
                status: 'Aktif',
                createdAt: new Date().toISOString().split('T')[0],
            };
            setStudents([...students, newStudent]);
        }
        closeModal();
    };

    const deleteStudent = (id: number) => {
        if (window.confirm('Yakin ingin menghapus murid ini?')) {
            setStudents(students.filter(s => s.id !== id));
        }
    };

    const toggleStatus = (id: number) => {
        setStudents(students.map(s => 
            s.id === id 
                ? { ...s, status: s.status === 'Aktif' ? 'Nonaktif' : 'Aktif' }
                : s
        ));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Kelola Murid" />

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
                                <p className="text-xs text-gray-500">Kelola Murid</p>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Kelola Akun Murid</h1>
                    <p className="text-gray-600">Tambah, edit, atau hapus akun murid AICI</p>
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
                    <div className="grid md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Cari Murid</label>
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
                        </div>

                        {/* Filter Status */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                            <select
                                value={filterStatus}
                                onChange={e => setFilterStatus(e.target.value as any)}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                            >
                                <option>Semua</option>
                                <option>Aktif</option>
                                <option>Nonaktif</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Add New Student Button */}
                <div className="mb-6">
                    <button
                        onClick={() => openModal()}
                        className="px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 flex items-center gap-2"
                    >
                        <i className="bi bi-plus-lg" /> Tambah Murid Baru
                    </button>
                </div>

                {/* Students Table */}
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
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center">
                                            <i className="bi bi-inbox text-4xl text-gray-300 block mb-3" />
                                            <p className="text-gray-600">Tidak ada murid yang ditemukan</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map(student => (
                                        <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-gray-900">{student.name}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-gray-600">{student.email}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                                                    {student.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleStatus(student.id)}
                                                    className={`px-3 py-1 text-xs font-semibold rounded-full cursor-pointer transition-colors ${
                                                        student.status === 'Aktif'
                                                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                    }`}
                                                >
                                                    {student.status}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-gray-600 text-sm">{student.createdAt}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => openModal(student)}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <i className="bi bi-pencil-fill" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteStudent(student.id)}
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
                            {editingId ? 'Edit Murid' : 'Tambah Murid Baru'}
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Lengkap</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Contoh: Adi Wijaya"
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
                                    placeholder="Contoh: adi@school.id"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>

                            {/* Password (only for new student) */}
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
                                    {editingId ? 'Update' : 'Tambah'} Murid
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
