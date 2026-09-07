import React, { useState } from 'react';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

interface School {
    id: number;
    name: string;
    email: string;
    phone: string;
    city: string;
    province: string;
    status: string;
    studentCount: number;
    tutorCount: number;
    contactPerson: string;
    contactPhone: string;
    createdAt: string;
}

interface Props {
    schools?: {
        data: School[];
        links: any[];
        total: number;
    };
    search?: string;
    filterStatus?: string;
    filterCity?: string;
    cities?: string[];
}

export default function SchoolManagement() {
    const props = usePage().props as unknown as Props;
    const schools = props.schools;
    const initialSearch = props.search || '';
    const initialStatus = props.filterStatus || 'all';
    const initialCity = props.filterCity || 'all';
    const cities = props.cities || [];
    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [search, setSearch] = useState(initialSearch);
    const [filterStatus, setFilterStatus] = useState(initialStatus);
    const [filterCity, setFilterCity] = useState(initialCity);

    const { data, setData, post, put, delete: destroy, processing, reset } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        province: '',
        postal_code: '',
        contact_person: '',
        contact_phone: '',
        status: 'pending',
        notes: '',
    });

    const handleSearch = () => {
        router.get('/superadmin/schools', {
            search,
            filter_status: filterStatus,
            filter_city: filterCity,
        });
    };

    const handleCreate = () => {
        setEditingId(null);
        reset();
        setIsOpen(true);
    };

    const handleEdit = (school: School) => {
        setEditingId(school.id);
        setData({
            name: school.name,
            email: school.email || '',
            phone: school.phone || '',
            address: '',
            city: school.city || '',
            province: school.province || '',
            postal_code: '',
            contact_person: school.contactPerson || '',
            contact_phone: school.contactPhone || '',
            status: school.status,
            notes: '',
        });
        setIsOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            put(`/superadmin/schools/${editingId}`, {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        } else {
            post('/superadmin/schools', {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus sekolah ini?')) {
            destroy(`/superadmin/schools/${id}`);
        }
    };

    const handleToggleStatus = (id: number) => {
        router.patch(`/superadmin/schools/${id}/toggle-status`);
    };

    return (
        <AdminLayout>
            <Head title="Manajemen Sekolah" />

            <div className="min-h-screen bg-gray-100 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-4xl font-bold text-gray-900">Manajemen Sekolah</h1>
                        <button
                            onClick={handleCreate}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            + Tambah Sekolah
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <input
                                type="text"
                                placeholder="Cari nama/email/kota..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Semua">Semua Status</option>
                                <option value="aktif">Aktif</option>
                                <option value="nonaktif">Nonaktif</option>
                                <option value="pending">Pending</option>
                            </select>
                            <select
                                value={filterCity}
                                onChange={(e) => setFilterCity(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Semua Kota</option>
                                {cities.map((city) => (
                                    <option key={city} value={city}>
                                        {city}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={handleSearch}
                                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Filter
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 border-b-2 border-gray-200">
                                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Nama Sekolah</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Kota</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Email</th>
                                    <th className="px-6 py-3 text-center font-semibold text-gray-900">Siswa</th>
                                    <th className="px-6 py-3 text-center font-semibold text-gray-900">Tutor</th>
                                    <th className="px-6 py-3 text-left font-semibold text-gray-900">Status</th>
                                    <th className="px-6 py-3 text-center font-semibold text-gray-900">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(schools?.data || []).map((school, idx) => (
                                    <tr
                                        key={school.id}
                                        className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition`}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-gray-900">{school.name}</div>
                                            <div className="text-xs text-gray-600">{school.contactPerson}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">{school.city || '-'}</td>
                                        <td className="px-6 py-4 text-gray-700">{school.email || '-'}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                                                {school.studentCount}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                                                {school.tutorCount}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleToggleStatus(school.id)}
                                                className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition ${
                                                    school.status === 'aktif'
                                                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                        : school.status === 'pending'
                                                          ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                }`}
                                            >
                                                {school.status}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-center space-x-2">
                                            <button
                                                onClick={() => handleEdit(school)}
                                                className="text-blue-600 hover:text-blue-800 font-semibold transition"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(school.id)}
                                                className="text-red-600 hover:text-red-800 font-semibold transition"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-6 flex justify-center gap-2">
                        {schools?.links?.map((link: any, idx: number) => (
                            <a
                                key={idx}
                                href={link.url || '#'}
                                className={`px-3 py-2 rounded ${
                                    link.active
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>

                {/* Modal */}
                {isOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 max-h-96 overflow-y-auto">
                            <div className="sticky top-0 bg-gray-50 border-b px-6 py-4 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {editingId ? 'Edit Sekolah' : 'Tambah Sekolah'}
                                </h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-600 hover:text-gray-900 text-2xl"
                                >
                                    ×
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                                        Nama Sekolah *
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-1">
                                            Telepon
                                        </label>
                                        <input
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-1">
                                            Kota
                                        </label>
                                        <input
                                            type="text"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-1">
                                            Provinsi
                                        </label>
                                        <input
                                            type="text"
                                            value={data.province}
                                            onChange={(e) => setData('province', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-1">
                                            PIC (Nama)
                                        </label>
                                        <input
                                            type="text"
                                            value={data.contact_person}
                                            onChange={(e) => setData('contact_person', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-1">
                                            PIC (Telepon)
                                        </label>
                                        <input
                                            type="tel"
                                            value={data.contact_phone}
                                            onChange={(e) => setData('contact_phone', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-1">
                                        Status *
                                    </label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="aktif">Aktif</option>
                                        <option value="nonaktif">Nonaktif</option>
                                    </select>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-900 hover:bg-gray-50 transition"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
