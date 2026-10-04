import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import FlashToast from '@/Components/FlashToast';
import { HolidayAnnouncement } from '@/Components/HolidayAnnouncementModal';

interface Props {
    announcement: HolidayAnnouncement | null;
}

export default function HolidayAnnouncementManagement({ announcement }: Props) {
    const [filePreview, setFilePreview] = useState<string | null>(announcement?.file_url || null);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: announcement?.title || 'Pemberitahuan Hari Libur Kegiatan Belajar Mengajar',
        letter_number: announcement?.letter_number || '',
        holiday_date: announcement?.holiday_date || '',
        content: announcement?.content || 'Sehubungan dengan hari libur nasional / kegiatan khusus, diberitahukan bahwa seluruh kegiatan pembelajaran di Artificial Intelligence Center Indonesia (AICI) diliburkan pada tanggal tersebut.',
        target_role: announcement?.target_role || 'all',
        is_active: announcement?.is_active ?? true,
        file: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('superadmin.holiday-announcement.update'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const handleToggle = () => {
        router.patch(route('superadmin.holiday-announcement.toggle'), {}, {
            preserveScroll: true,
        });
    };

    const handleDelete = () => {
        if (confirm('Yakin ingin menghapus surat pengumuman libur ini? Tindakan ini akan mengosongkan pengumuman libur aktif.')) {
            router.delete(route('superadmin.holiday-announcement.destroy'), {
                preserveScroll: true,
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <FlashToast />
            <Head title="Kelola Surat Pengumuman Libur - Super Admin" />

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <Link href="/superadmin" className="flex items-center gap-2">
                                <img
                                    src="/images/logo-aici.png"
                                    alt="AICI Logo"
                                    className="h-10 w-auto object-contain"
                                />
                                <span className="text-[11px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-medium">Super Admin</span>
                            </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link
                                href="/superadmin"
                                className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-1.5"
                            >
                                <i className="bi bi-arrow-left" /> Kembali ke Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
                            <i className="bi bi-envelope-paper-heart-fill text-amber-500" />
                            Kelola Surat Pemberitahuan Libur
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Surat libur ini akan tampil sebagai <b>Pop-up Amplop 3D (ala Mobile Legends)</b> saat Siswa dan/atau Tutor login.
                        </p>
                    </div>

                    {announcement && (
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleToggle}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
                                    announcement.is_active
                                        ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300'
                                        : 'bg-green-100 text-green-800 hover:bg-green-200 border border-green-300'
                                }`}
                            >
                                <i className={`bi ${announcement.is_active ? 'bi-pause-circle-fill' : 'bi-play-circle-fill'}`} />
                                {announcement.is_active ? 'Nonaktifkan Pop-up' : 'Aktifkan Pop-up'}
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                className="px-3 py-2 rounded-xl text-xs font-bold bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors"
                                title="Hapus Pengumuman"
                            >
                                <i className="bi bi-trash-fill" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-6 md:p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Status switch banner */}
                            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                                <div>
                                    <span className="text-sm font-bold text-slate-800 block">Status Pop-up Libur</span>
                                    <span className="text-xs text-gray-500">
                                        Jika diaktifkan, user yang ditargetkan akan melihat pop-up amplop saat login.
                                    </span>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600" />
                                </label>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Judul Pengumuman */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Judul Surat / Maklumat <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Contoh: Pemberitahuan Libur Bersama Idul Fitri"
                                        className="w-full rounded-xl border-gray-300 focus:border-teal-500 focus:ring-teal-500 text-sm shadow-sm"
                                        required
                                    />
                                    {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                                </div>

                                {/* Nomor Surat Resmi */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Nomor Surat Resmi (Opsional)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.letter_number}
                                        onChange={(e) => setData('letter_number', e.target.value)}
                                        placeholder="Contoh: 012/AICI-NOTIF/X/2026"
                                        className="w-full rounded-xl border-gray-300 focus:border-teal-500 focus:ring-teal-500 text-sm shadow-sm"
                                    />
                                    {errors.letter_number && <p className="text-xs text-red-500 mt-1">{errors.letter_number}</p>}
                                </div>

                                {/* Tanggal Pelaksanaan Libur */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Tanggal Pelaksanaan Libur <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.holiday_date}
                                        onChange={(e) => setData('holiday_date', e.target.value)}
                                        placeholder="Contoh: 7 Oktober 2026 atau 7 - 10 Oktober 2026"
                                        className="w-full rounded-xl border-gray-300 focus:border-teal-500 focus:ring-teal-500 text-sm shadow-sm"
                                        required
                                    />
                                    {errors.holiday_date && <p className="text-xs text-red-500 mt-1">{errors.holiday_date}</p>}
                                </div>

                                {/* Target Penerima */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Target Penerima Pengumuman <span className="text-red-500">*</span>
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { id: 'all', label: 'Semua (Murid & Tutor)', icon: 'bi-people' },
                                            { id: 'user', label: 'Hanya Murid', icon: 'bi-mortarboard' },
                                            { id: 'tutor', label: 'Hanya Tutor', icon: 'bi-person-workspace' },
                                        ].map((t) => (
                                            <button
                                                key={t.id}
                                                type="button"
                                                onClick={() => setData('target_role', t.id as any)}
                                                className={`p-3 rounded-xl border text-sm font-medium flex flex-col items-center gap-1.5 transition-all ${
                                                    data.target_role === t.id
                                                        ? 'border-teal-600 bg-teal-50 text-teal-900 shadow-sm'
                                                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                                                }`}
                                            >
                                                <i className={`bi ${t.icon} text-lg`} />
                                                <span className="text-xs text-center">{t.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                    {errors.target_role && <p className="text-xs text-red-500 mt-1">{errors.target_role}</p>}
                                </div>

                                {/* Isi Maklumat Surat */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Isi Surat / Pesan Maklumat <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        placeholder="Tuliskan isi keterangan libur untuk murid/tutor..."
                                        className="w-full rounded-xl border-gray-300 focus:border-teal-500 focus:ring-teal-500 text-sm shadow-sm"
                                        required
                                    />
                                    {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content}</p>}
                                </div>

                                {/* Upload File Surat PDF / Image */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        Upload Surat Resmi PDF / Gambar (Bisa Di-download Siswa)
                                    </label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-teal-500 transition-colors bg-gray-50/50">
                                        <input
                                            type="file"
                                            id="fileUpload"
                                            accept=".pdf,.png,.jpg,.jpeg"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] || null;
                                                setData('file', file);
                                                if (file) {
                                                    setFilePreview(file.name);
                                                }
                                            }}
                                            className="hidden"
                                        />
                                        <label htmlFor="fileUpload" className="cursor-pointer block">
                                            <div className="w-12 h-12 mx-auto rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mb-2">
                                                <i className="bi bi-cloud-arrow-up-fill text-2xl" />
                                            </div>
                                            <p className="text-sm font-semibold text-slate-800">
                                                Klik untuk memilih berkas PDF atau gambar surat
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Format didukung: PDF, PNG, JPG (Maks. 10MB)
                                            </p>
                                        </label>

                                        {filePreview && (
                                            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-teal-200 rounded-lg text-xs font-semibold text-teal-800 shadow-sm">
                                                <i className="bi bi-file-earmark-check-fill text-teal-600" />
                                                <span>File dipilih: {filePreview}</span>
                                            </div>
                                        )}
                                    </div>
                                    {errors.file && <p className="text-xs text-red-500 mt-1">{errors.file}</p>}
                                </div>
                            </div>

                            {/* Tombol Simpan */}
                            <div className="border-t border-gray-100 pt-6 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
                                >
                                    <i className="bi bi-check2-circle text-lg" />
                                    {processing ? 'Menyimpan...' : 'Simpan & Publikasikan Surat Libur'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
