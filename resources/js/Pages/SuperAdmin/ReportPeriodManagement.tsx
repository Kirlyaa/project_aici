import { Head, Link, router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import FlashToast from '@/Components/FlashToast';

interface ReportPeriodItem {
    id: number;
    name: string | null;
    start_meeting: number;
    end_meeting: number;
    order_index: number;
    is_active: boolean;
    display_name?: string;
    key_range?: string;
}

interface Props {
    auth?: {
        user?: {
            id: number;
            name: string;
            role: string;
        };
    };
    periods: ReportPeriodItem[];
}

export default function ReportPeriodManagement() {
    const { periods = [] } = usePage().props as unknown as Props;

    const [showModal, setShowModal] = useState(false);
    const [editingPeriod, setEditingPeriod] = useState<ReportPeriodItem | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        start_meeting: 1,
        end_meeting: 4,
        order_index: 1,
        is_active: true,
    });
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    const openCreateModal = () => {
        setEditingPeriod(null);
        const nextStart = periods.length > 0
            ? Math.max(...periods.map(p => p.end_meeting)) + 1
            : 1;
        setFormData({
            name: `Periode ${periods.length + 1}`,
            start_meeting: nextStart,
            end_meeting: nextStart + 3,
            order_index: periods.length + 1,
            is_active: true,
        });
        setFormErrors({});
        setShowModal(true);
    };

    const openEditModal = (period: ReportPeriodItem) => {
        setEditingPeriod(period);
        setFormData({
            name: period.name || '',
            start_meeting: period.start_meeting,
            end_meeting: period.end_meeting,
            order_index: period.order_index,
            is_active: period.is_active,
        });
        setFormErrors({});
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormErrors({});

        if (formData.end_meeting < formData.start_meeting) {
            setFormErrors({ end_meeting: 'Pertemuan akhir harus lebih besar atau sama dengan pertemuan awal.' });
            return;
        }

        if (editingPeriod) {
            router.put(`/superadmin/report-periods/${editingPeriod.id}`, formData, {
                onSuccess: () => setShowModal(false),
                onError: (errors: any) => setFormErrors(errors),
            });
        } else {
            router.post('/superadmin/report-periods', formData, {
                onSuccess: () => setShowModal(false),
                onError: (errors: any) => setFormErrors(errors),
            });
        }
    };

    const handleDelete = (id: number, name: string | null, start: number, end: number) => {
        const periodTitle = name || `Pertemuan ${start} - ${end}`;
        if (confirm(`Apakah Anda yakin ingin menghapus "${periodTitle}"?`)) {
            router.delete(`/superadmin/report-periods/${id}`);
        }
    };

    const handleToggleStatus = (id: number) => {
        router.patch(`/superadmin/report-periods/${id}/toggle-status`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <FlashToast />
            <Head title="Kelola Periode Rapor PDF" />

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <img
                                src="/images/logo-aici.png"
                                alt="AICI Logo"
                                className="h-10 w-auto object-contain"
                            />
                            <div className="border-l border-gray-300 pl-3">
                                <span className="text-[11px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-medium">Super Admin</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href="/superadmin"
                                className="text-xs font-semibold px-3 py-1.5 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                            >
                                <i className="bi bi-speedometer2 mr-1" /> Dashboard
                            </Link>
                            <Link
                                href="/superadmin/students"
                                className="text-xs font-semibold px-3 py-1.5 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                            >
                                <i className="bi bi-people-fill mr-1" /> Kelola Murid
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                                <i className="bi bi-file-earmark-pdf-fill text-2xl" />
                            </span>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Kelola Periode Rapor PDF</h1>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Atur pembagian pertemuan untuk cetak rapor PDF & siklus komentar tutor (misal per 2 pertemuan, per 3 pertemuan, atau rentang khusus).
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
                    >
                        <i className="bi bi-plus-lg" /> Tambah Periode
                    </button>
                </div>

                {/* Info Card */}
                <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
                    <i className="bi bi-info-circle-fill text-amber-600 text-xl flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-900 space-y-1">
                        <p className="font-bold">Panduan Pengaturan Periode:</p>
                        <p className="leading-relaxed">
                            Periode yang aktif di bawah ini akan otomatis muncul sebagai opsi pilihan tombol unduh/tampil rapor PDF di profil murid serta form evaluasi komentar tutor.
                            Super Admin bebas membuat rentang apapun, seperti: <strong>Pertemuan 1 - 3</strong>, <strong>Pertemuan 4 - 5</strong>, atau <strong>Pertemuan 6 - 7</strong>.
                        </p>
                    </div>
                </div>

                {/* Table of Periods */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center justify-between">
                        <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                            <i className="bi bi-list-check text-rose-600" />
                            Daftar Periode Rapor Aktif ({periods.length})
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider">
                                <tr>
                                    <th className="px-5 py-3.5 w-16">Urutan</th>
                                    <th className="px-5 py-3.5">Nama Periode / Label</th>
                                    <th className="px-5 py-3.5">Rentang Pertemuan</th>
                                    <th className="px-5 py-3.5">Jumlah Sesi</th>
                                    <th className="px-5 py-3.5 text-center">Status</th>
                                    <th className="px-5 py-3.5 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {periods.length > 0 ? (
                                    periods.map((p) => {
                                        const count = p.end_meeting - p.start_meeting + 1;
                                        return (
                                            <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                                                <td className="px-5 py-4 font-bold text-gray-500">
                                                    #{p.order_index}
                                                </td>
                                                <td className="px-5 py-4 font-bold text-gray-900">
                                                    {p.name || <span className="text-gray-400 font-normal italic">Tanpa Nama</span>}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 text-rose-700 font-semibold rounded-lg border border-rose-200">
                                                        <i className="bi bi-calendar-range" /> Pertemuan {p.start_meeting} - {p.end_meeting}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-gray-600 font-medium">
                                                    {count} Pertemuan
                                                </td>
                                                <td className="px-5 py-4 text-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleToggleStatus(p.id)}
                                                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition ${
                                                            p.is_active
                                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                                                : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                                                        }`}
                                                    >
                                                        {p.is_active ? 'Aktif' : 'Nonaktif'}
                                                    </button>
                                                </td>
                                                <td className="px-5 py-4 text-right space-x-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(p)}
                                                        className="px-2.5 py-1.5 text-blue-600 hover:bg-blue-50 border border-blue-200 rounded-lg font-semibold transition"
                                                        title="Edit Periode"
                                                    >
                                                        <i className="bi bi-pencil-square" /> Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(p.id, p.name, p.start_meeting, p.end_meeting)}
                                                        className="px-2.5 py-1.5 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg font-semibold transition"
                                                        title="Hapus Periode"
                                                    >
                                                        <i className="bi bi-trash" /> Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-12 text-center text-gray-400">
                                            <i className="bi bi-calendar-x text-3xl mb-2 block" />
                                            Belum ada periode kustom yang dibuat. Sistem saat ini menggunakan default siklus per 4 pertemuan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Modal Tambah / Edit Periode */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
                        <div className="flex items-center justify-between border-b pb-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
                                    <i className="bi bi-sliders text-lg" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base text-gray-900">
                                        {editingPeriod ? 'Edit Periode Rapor' : 'Tambah Periode Rapor Baru'}
                                    </h3>
                                    <p className="text-xs text-gray-500">Tentukan rentang pertemuan dan label periode</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 p-1"
                            >
                                <i className="bi bi-x-lg" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">
                                    Nama / Judul Periode (Opsional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Periode 1, Ujian Tengah, Final Proyek"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                                />
                                <span className="text-[11px] text-gray-400">
                                    Jika dikosongkan, label otomatis: "Pertemuan X - Y"
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">
                                        Mulai Pertemuan <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={200}
                                        required
                                        value={formData.start_meeting}
                                        onChange={(e) => setFormData({ ...formData, start_meeting: parseInt(e.target.value) || 1 })}
                                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 font-semibold"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">
                                        Sampai Pertemuan <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min={formData.start_meeting}
                                        max={200}
                                        required
                                        value={formData.end_meeting}
                                        onChange={(e) => setFormData({ ...formData, end_meeting: parseInt(e.target.value) || 1 })}
                                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 font-semibold"
                                    />
                                    {formErrors.end_meeting && (
                                        <p className="text-[11px] text-red-500 mt-1">{formErrors.end_meeting}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">
                                        Urutan Tampilan
                                    </label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={formData.order_index}
                                        onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                                        className="w-full text-xs px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">
                                        Status
                                    </label>
                                    <label className="flex items-center gap-2 mt-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                            className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
                                        />
                                        <span className="text-xs font-semibold text-gray-700">Aktifkan Periode</span>
                                    </label>
                                </div>
                            </div>

                            {/* Preview Badge */}
                            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Preview Tampilan Opsi:</p>
                                <p className="text-xs font-bold text-gray-800">
                                    {formData.name ? `${formData.name} (Pertemuan ${formData.start_meeting} - ${formData.end_meeting})` : `Pertemuan ${formData.start_meeting} - ${formData.end_meeting}`}
                                </p>
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
                                >
                                    {editingPeriod ? 'Simpan Perubahan' : 'Tambah Periode'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
