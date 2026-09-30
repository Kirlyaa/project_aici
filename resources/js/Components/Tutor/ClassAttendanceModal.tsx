import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export interface ModuleItem {
    id: number;
    name: string;
    description?: string | null;
    tools?: string[] | null;
    module_type?: string;
    parent_id?: number | null;
    order_index?: number;
}

export interface StudentAttendanceItem {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    status: 'hadir' | 'absen';
    note?: string;
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    classroomId: number;
    className: string;
    students: { id: number; name: string; email: string; avatar?: string; class?: string }[];
    modules: ModuleItem[];
}

export default function ClassAttendanceModal({
    isOpen,
    onClose,
    classroomId,
    className,
    students,
    modules,
}: Props) {
    // Current date default to YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    const [date, setDate] = useState<string>(today);
    const [selectedModuleId, setSelectedModuleId] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [attendances, setAttendances] = useState<Record<number, { status: 'hadir' | 'absen'; note: string }>>({});
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Inisialisasi daftar kehadiran murid (default semua 'hadir')
    useEffect(() => {
        if (isOpen && students.length > 0) {
            const initialMap: Record<number, { status: 'hadir' | 'absen'; note: string }> = {};
            students.forEach(st => {
                initialMap[st.id] = {
                    status: 'hadir',
                    note: '',
                };
            });
            setAttendances(initialMap);
            setErrorMessage(null);
            // Default title jika belum ada
            if (!title) {
                setTitle(`Pertemuan Kelas ${className}`);
            }
        }
    }, [isOpen, students, className]);

    if (!isOpen) return null;

    // Saat modul dipilih dari dropdown
    const handleModuleChange = (modId: string) => {
        setSelectedModuleId(modId);
        if (!modId) return;

        const mod = modules.find(m => String(m.id) === String(modId));
        if (mod) {
            setTitle(mod.name);
        }
    };

    // Tandai semua murid hadir / tidak hadir sekaligus
    const setAllStatus = (newStatus: 'hadir' | 'absen') => {
        setAttendances(prev => {
            const updated = { ...prev };
            Object.keys(updated).forEach(key => {
                const id = Number(key);
                updated[id] = { ...updated[id], status: newStatus };
            });
            return updated;
        });
    };

    // Ubah status satu murid
    const updateStudentStatus = (studentId: number, status: 'hadir' | 'absen') => {
        setAttendances(prev => ({
            ...prev,
            [studentId]: {
                ...(prev[studentId] || { note: '' }),
                status,
            },
        }));
    };

    // Ubah catatan murid
    const updateStudentNote = (studentId: number, note: string) => {
        setAttendances(prev => ({
            ...prev,
            [studentId]: {
                ...(prev[studentId] || { status: 'hadir' }),
                note,
            },
        }));
    };

    // Hitung total hadir & tidak hadir
    const hadirCount = Object.values(attendances).filter(a => a.status === 'hadir').length;
    const tidakHadirCount = Object.values(attendances).filter(a => a.status === 'absen').length;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            setErrorMessage('Judul pertemuan wajib diisi');
            return;
        }
        if (!date) {
            setErrorMessage('Tanggal pertemuan wajib diisi');
            return;
        }
        if (students.length === 0) {
            setErrorMessage('Tidak ada murid dalam kelas ini');
            return;
        }

        setSubmitting(true);
        setErrorMessage(null);

        const payload = {
            date,
            module_id: selectedModuleId ? Number(selectedModuleId) : null,
            title: title.trim(),
            description: null,
            tools: null,
            attendances: students.map(st => ({
                student_id: st.id,
                status: attendances[st.id]?.status || 'hadir',
                note: attendances[st.id]?.note?.trim() || null,
            })),
        };

        router.post(`/tutor/classes/${classroomId}/attendance`, payload, {
            preserveScroll: true,
            onSuccess: () => {
                setSubmitting(false);
                onClose();
            },
            onError: (errs) => {
                setSubmitting(false);
                const firstErr = Object.values(errs)[0];
                setErrorMessage(typeof firstErr === 'string' ? firstErr : 'Gagal menyimpan presensi kelas');
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-fadeIn">
                {/* Modal Header */}
                <div className="px-6 py-4 bg-gradient-to-r from-teal-700 to-emerald-700 text-white flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                            <i className="bi bi-clipboard2-check text-xl text-teal-200" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Input Kehadiran Pertemuan Kelas</h2>
                            <p className="text-xs text-teal-100">
                                Kelas: <span className="font-semibold text-white">{className}</span> • {students.length} Murid
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={submitting}
                        className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
                    >
                        <i className="bi bi-x-lg text-sm" />
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                    {errorMessage && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                            <i className="bi bi-exclamation-triangle-fill shrink-0 text-base" />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {/* Section 1: Informasi Pertemuan & Modul */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                                <i className="bi bi-journal-bookmark text-teal-600" />
                                Informasi Pertemuan &amp; Materi
                            </h3>
                            <span className="text-[11px] text-gray-500">Pilih modul untuk mengisi otomatis</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Tarik Data dari Modul (Opsional)
                                </label>
                                <select
                                    value={selectedModuleId}
                                    onChange={(e) => handleModuleChange(e.target.value)}
                                    className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                >
                                    <option value="">-- Pilih Modul Pembelajaran --</option>
                                    {modules.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Tanggal Pertemuan <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                Judul Pertemuan / Topik <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Contoh: Modul 1: Pengenalan Robotik & Perakitan Rangka"
                                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-teal-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Section 2: Lembar Kehadiran Murid */}
                    <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-200">
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
                                    <i className="bi bi-people text-teal-600" />
                                    Lembar Kehadiran Siswa
                                </h3>
                                <p className="text-xs text-gray-500">
                                    Hadir: <span className="font-bold text-blue-600">{hadirCount}</span> • Tidak Hadir:{' '}
                                    <span className="font-bold text-amber-600">{tidakHadirCount}</span> (Total {students.length} murid)
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setAllStatus('hadir')}
                                    className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition flex items-center gap-1"
                                >
                                    <i className="bi bi-check-all" /> Tandai Semua Hadir
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setAllStatus('absen')}
                                    className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition flex items-center gap-1"
                                >
                                    <i className="bi bi-x-circle" /> Semua Tidak Hadir
                                </button>
                            </div>
                        </div>

                        {students.length === 0 ? (
                            <div className="p-8 text-center bg-gray-50 rounded-xl text-gray-500 text-sm">
                                Tidak ada murid yang terdaftar di kelas ini.
                            </div>
                        ) : (
                            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-[11px] font-bold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                                        <tr>
                                            <th className="px-4 py-3 w-12 text-center">No</th>
                                            <th className="px-4 py-3">Nama Siswa</th>
                                            <th className="px-4 py-3 w-56 text-center">Status Kehadiran</th>
                                            <th className="px-4 py-3">Catatan Khusus (Opsional)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {students.map((student, idx) => {
                                            const status = attendances[student.id]?.status || 'hadir';
                                            const note = attendances[student.id]?.note || '';
                                            return (
                                                <tr
                                                    key={student.id}
                                                    className={`hover:bg-gray-50 transition-colors ${
                                                        status === 'absen' ? 'bg-amber-50/40' : ''
                                                    }`}
                                                >
                                                    <td className="px-4 py-3 text-center text-xs text-gray-400 font-mono">
                                                        {idx + 1}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="font-semibold text-gray-900">{student.name}</div>
                                                        <div className="text-xs text-gray-500">{student.email}</div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => updateStudentStatus(student.id, 'hadir')}
                                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                                                                    status === 'hadir'
                                                                        ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-300'
                                                                        : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'
                                                                }`}
                                                            >
                                                                <i className="bi bi-check-circle-fill text-xs" />
                                                                Hadir
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => updateStudentStatus(student.id, 'absen')}
                                                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                                                                    status === 'absen'
                                                                        ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-300'
                                                                        : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50'
                                                                }`}
                                                            >
                                                                <i className="bi bi-x-circle-fill text-xs" />
                                                                Tidak Hadir
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <input
                                                            type="text"
                                                            value={note}
                                                            onChange={(e) => updateStudentNote(student.id, e.target.value)}
                                                            placeholder={
                                                                status === 'absen'
                                                                    ? 'Alasan tidak hadir (misal: Sakit, Izin)'
                                                                    : 'Catatan progres atau keaktifan (opsional)'
                                                            }
                                                            className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white focus:ring-1 focus:ring-teal-500 focus:outline-none"
                                                        />
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                            Data kehadiran akan tersimpan otomatis ke akun masing-masing murid.
                        </span>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={submitting}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={submitting || students.length === 0}
                                className="px-5 py-2 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow transition disabled:opacity-50 flex items-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <i className="bi bi-arrow-repeat animate-spin" /> Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-save" /> Simpan Kehadiran Kelas
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
