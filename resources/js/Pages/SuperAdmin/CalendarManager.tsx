import { Head, Link, router, usePage } from '@inertiajs/react';
import { useRef, useMemo, useState } from 'react';
import FlashToast from '@/Components/FlashToast';
import { SessionStatus } from '@/types/session';

type DateStatus = SessionStatus | 'normal';

interface SessionData {
    id: number;
    title: string;
    date_string: string;
    date: string;
    status: SessionStatus;
    description?: string | null;
    admin_note_for_tutor?: string | null;
    tools?: string[] | null;
    module_ids: number[];
}

interface Student {
    id: number;
    name: string;
    email: string;
    class?: string | null;
}

interface Module {
    id: number;
    name: string;
    module_type?: string;
    image: string;
}

interface Props {
    studentId: number;
    student: Student;
    sessions: SessionData[];
    modules: Module[];
    students: Student[];
}

const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function toIsoDate(year: number, month: number, day: number): string {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function formatDateString(year: number, month: number, day: number): string {
    const date = new Date(year, month, day);
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return `${dayNames[date.getDay()]}, ${day} ${months[month]} ${year}`;
}

function getSessionForDate(sessions: SessionData[], year: number, month: number, day: number): SessionData | undefined {
    const iso = toIsoDate(year, month, day);
    return sessions.find(s => (s.date ?? '').startsWith(iso));
}

// R8: blok warna penuh per status, libur = BIRU
const STATUS_BG: Record<SessionStatus, string> = {
    hadir: 'bg-green-500 text-white',
    libur: 'bg-blue-500 text-white',
    absen: 'bg-red-500 text-white',
    reschedule: 'bg-yellow-400 text-gray-900',
    'akan-datang': 'bg-purple-400 text-white',
};

export default function SuperAdminCalendarManager({ studentId, student, sessions, modules, students }: Props) {
    const { props } = usePage();
    const csvErrors: string[] = (props as any).csv_errors ?? [];

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<number | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [dropdownStatus, setDropdownStatus] = useState<DateStatus>('akan-datang');
    const [dropdownModule, setDropdownModule] = useState<number | undefined>(undefined);
    const [dropdownTitle, setDropdownTitle] = useState('');
    const [dropdownAdminNote, setDropdownAdminNote] = useState('');
    const [saving, setSaving] = useState(false);
    const [showCsvPanel, setShowCsvPanel] = useState(false);
    const [showClearModal, setShowClearModal] = useState(false);
    const [clearAllStudents, setClearAllStudents] = useState(false);
    const [clearing, setClearing] = useState(false);
    const csvInputRef = useRef<HTMLInputElement>(null);

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const monthSessions = useMemo(
        () => sessions.filter(s => {
            const d = new Date(s.date);
            return d.getFullYear() === year && d.getMonth() === month;
        }),
        [sessions, year, month],
    );

    const prevMonth = () => setCurrentMonth(new Date(year, month - 1));
    const nextMonth = () => setCurrentMonth(new Date(year, month + 1));

    const openDateEditor = (date: number) => {
        const existing = getSessionForDate(sessions, year, month, date);
        setSelectedDate(date);
        setShowDropdown(true);
        if (existing) {
            setDropdownStatus(existing.status);
            setDropdownModule(existing.module_ids[0]);
            setDropdownTitle(existing.title);
            setDropdownAdminNote(existing.admin_note_for_tutor ?? '');
        } else {
            setDropdownStatus('akan-datang');
            setDropdownModule(undefined);
            setDropdownTitle('');
            setDropdownAdminNote('');
        }
    };

    const saveDateMark = () => {
        if (selectedDate === null || saving) return;

        const isoDate = toIsoDate(year, month, selectedDate);
        const existing = getSessionForDate(sessions, year, month, selectedDate);
        const selectedModule = modules.find(m => m.id === dropdownModule);

        setSaving(true);

        const onFinish = () => {
            setSaving(false);
            setShowDropdown(false);
            setSelectedDate(null);
        };

        if (dropdownStatus === 'normal') {
            if (existing) {
                router.delete(`/superadmin/calendar/${existing.id}`, {
                    preserveScroll: true,
                    onFinish,
                });
            } else {
                onFinish();
            }
            return;
        }

        const payload = {
            student_id: studentId,
            title: dropdownTitle.trim() || selectedModule?.name || `Sesi ${isoDate}`,
            date_string: formatDateString(year, month, selectedDate),
            date: isoDate,
            status: dropdownStatus,
            admin_note_for_tutor: dropdownAdminNote.trim() || null,
            module_ids: dropdownModule ? [dropdownModule] : [],
        };

        if (existing) {
            router.put(`/superadmin/calendar/${existing.id}`, payload, {
                preserveScroll: true,
                onFinish,
            });
        } else {
            router.post('/superadmin/calendar', payload, {
                preserveScroll: true,
                onFinish,
            });
        }
    };

    const handleCsvUpload = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const file = csvInputRef.current?.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('csv_file', file);
        router.post(`/superadmin/calendar/import-csv`, formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                if (csvInputRef.current) csvInputRef.current.value = '';
            },
        });
    };

    const handleClearCalendar = () => {
        setClearing(true);
        router.delete(`/superadmin/calendar/${studentId}/clear-all`, {
            data: { all_students: clearAllStudents },
            preserveScroll: true,
            onFinish: () => {
                setClearing(false);
                setShowClearModal(false);
                setClearAllStudents(false);
            },
        });
    };

    const calendarDays: (number | null)[] = [];
    for (let i = daysInPrevMonth - firstDay + 1; i <= daysInPrevMonth; i++) {
        calendarDays.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(i);
    }
    for (let i = 1; calendarDays.length < 42; i++) {
        calendarDays.push(null);
    }

    const statusCounts = {
        libur: monthSessions.filter(s => s.status === 'libur').length,
        absen: monthSessions.filter(s => s.status === 'absen').length,
        reschedule: monthSessions.filter(s => s.status === 'reschedule').length,
        'akan-datang': monthSessions.filter(s => s.status === 'akan-datang').length,
        hadir: monthSessions.filter(s => s.status === 'hadir').length,
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <FlashToast />
            <Head title="Kelola Kalender — SuperAdmin" />

            <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
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
                                <p className="text-xs font-semibold text-gray-600">Kelola Kalender</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* Pilih murid lain */}
                            <select
                                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                value={studentId}
                                onChange={e => router.get(`/superadmin/calendar/${e.target.value}`)}
                            >
                                {students.map(s => (
                                    <option key={s.id} value={s.id}>{s.name} {s.class ? `(${s.class})` : ''}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">Kelola Kalender Murid</h1>
                        <p className="text-gray-600">Tandai tanggal libur, absen, reschedule, hadir, atau akan datang</p>
                    </div>
                    {/* Aksi Bulk: Hapus Semua Jadwal & Import CSV */}
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setShowClearModal(true)}
                            disabled={sessions.length === 0}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                                sessions.length === 0
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                    : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 shadow-sm'
                            }`}
                            title={sessions.length === 0 ? 'Belum ada jadwal yang tersimpan' : 'Hapus semua jadwal kalender'}
                        >
                            <i className="bi bi-trash3" /> Hapus Semua Jadwal
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowCsvPanel(v => !v)}
                            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors text-sm shadow-sm"
                        >
                            <i className="bi bi-file-earmark-arrow-up" /> Import CSV
                        </button>
                    </div>
                </div>

                {/* R10: Panel Import CSV */}
                {showCsvPanel && (
                    <div className="bg-white rounded-xl border border-teal-100 shadow-sm p-6 mb-6">
                        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2 text-base">
                                <i className="bi bi-file-earmark-arrow-up text-teal-600 text-lg" /> Import Jadwal Kalender Secara Massal (CSV)
                            </h3>
                            <a
                                href="/superadmin/calendar/template"
                                download
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition"
                            >
                                <i className="bi bi-download" /> Download Template CSV
                            </a>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">
                            Fitur ini memungkinkan Anda memasukkan puluhan atau ratusan jadwal pertemuan murid sekaligus dalam 1 kali upload file spreadsheet / CSV.
                        </p>

                        <div className="mb-4 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 leading-relaxed overflow-x-auto">
                            <div className="font-bold text-slate-800 mb-1 font-sans">Format Kolom Header (Baris Pertama):</div>
                            <div className="text-teal-700 font-bold mb-2">tanggal,status,judul,modul,email_murid</div>
                            <div className="text-slate-600 font-sans space-y-1">
                                <div>• <strong>tanggal</strong>: Format <code className="bg-slate-200 px-1 py-0.5 rounded">YYYY-MM-DD</code> (contoh: 2026-10-05) atau <code className="bg-slate-200 px-1 py-0.5 rounded">DD/MM/YYYY</code></div>
                                <div>• <strong>status</strong>: <code className="bg-slate-200 px-1 py-0.5 rounded">hadir</code> | <code className="bg-slate-200 px-1 py-0.5 rounded">absen</code> | <code className="bg-slate-200 px-1 py-0.5 rounded">reschedule</code> | <code className="bg-slate-200 px-1 py-0.5 rounded">libur</code> | <code className="bg-slate-200 px-1 py-0.5 rounded">akan-datang</code></div>
                                <div>• <strong>judul</strong>: Nama topik/judul sesi (bebas atau boleh kosong)</div>
                                <div>• <strong>modul</strong>: Nama modul (opsional, jika cocok akan otomatis dihubungkan)</div>
                                <div>• <strong>email_murid</strong>: Alamat email murid yang terdaftar di sistem</div>
                            </div>
                        </div>

                        <form onSubmit={handleCsvUpload} className="flex flex-wrap items-center gap-3">
                            <input
                                ref={csvInputRef}
                                type="file"
                                accept=".csv,.txt"
                                className="text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-teal-50 file:text-teal-700 file:font-semibold hover:file:bg-teal-100 cursor-pointer"
                            />
                            <button
                                type="submit"
                                className="px-5 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 text-sm shadow-sm transition"
                            >
                                <i className="bi bi-cloud-arrow-up mr-1.5" /> Upload & Impor Sekarang
                            </button>
                        </form>
                        {csvErrors.length > 0 && (
                            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="font-semibold text-red-700 mb-2 flex items-center gap-1.5 text-sm">
                                    <i className="bi bi-exclamation-triangle-fill" /> Rincian Peringatan / Baris yang Dilewati:
                                </p>
                                <ul className="list-disc list-inside space-y-1 max-h-40 overflow-y-auto">
                                    {csvErrors.map((err, i) => (
                                        <li key={i} className="text-xs text-red-600">{err}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <i className="bi bi-chevron-left" />
                            </button>
                            <h2 className="text-xl font-bold text-gray-900">{months[month]} {year}</h2>
                            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <i className="bi bi-chevron-right" />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {days.map(day => (
                                <div key={day} className="text-center font-semibold text-gray-600 text-sm py-2">{day}</div>
                            ))}
                        </div>

                        {/* R8: blok warna penuh */}
                        <div className="grid grid-cols-7 gap-1">
                            {calendarDays.map((date, idx) => {
                                if (date === null) {
                                    return <div key={idx} className="aspect-square" />;
                                }
                                const session = getSessionForDate(sessions, year, month, date);
                                const colorClass = session ? STATUS_BG[session.status] : 'bg-gray-50 hover:bg-teal-50 text-gray-700';
                                return (
                                    <button
                                        key={date}
                                        onClick={() => openDateEditor(date)}
                                        className={`aspect-square rounded-lg transition-all flex items-center justify-center font-medium text-sm ${colorClass} border border-transparent hover:border-teal-400`}
                                    >
                                        {date}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Legenda */}
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-6 pt-4 border-t border-gray-200">
                            {[
                                { label: 'Hadir', cls: 'bg-green-500' },
                                { label: 'Libur', cls: 'bg-blue-500' },
                                { label: 'Absen', cls: 'bg-red-500' },
                                { label: 'Reschedule', cls: 'bg-yellow-400' },
                                { label: 'Akan Datang', cls: 'bg-purple-400' },
                                { label: 'Normal', cls: 'bg-gray-100 border border-gray-300' },
                            ].map(({ label, cls }) => (
                                <div key={label} className="flex items-center gap-1.5 text-xs">
                                    <div className={`w-4 h-4 rounded ${cls} flex-shrink-0`} />
                                    <span className="text-gray-700">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <i className="bi bi-person-circle text-teal-600 text-xl" />
                                Informasi Murid
                            </h3>
                            <div className="space-y-2 text-sm">
                                <p><span className="text-gray-600">Nama:</span> <span className="font-medium text-gray-900">{student.name}</span></p>
                                <p><span className="text-gray-600">Email:</span> <span className="font-medium text-gray-900">{student.email}</span></p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <i className="bi bi-bar-chart text-orange-600 text-xl" />
                                Ringkasan Bulan Ini
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { label: 'Total Sesi', value: monthSessions.length, color: 'text-gray-900' },
                                    { label: 'Hadir', value: statusCounts.hadir, color: 'text-green-600' },
                                    { label: 'Libur', value: statusCounts.libur, color: 'text-blue-600' },
                                    { label: 'Absen', value: statusCounts.absen, color: 'text-red-600' },
                                    { label: 'Reschedule', value: statusCounts.reschedule, color: 'text-yellow-600' },
                                    { label: 'Akan Datang', value: statusCounts['akan-datang'], color: 'text-purple-600' },
                                ].map(({ label, value, color }) => (
                                    <div key={label} className="flex justify-between items-center">
                                        <span className="text-gray-600 text-sm">{label}</span>
                                        <span className={`font-bold ${color}`}>{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Link
                            href="/superadmin"
                            className="block text-center px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                        >
                            <i className="bi bi-arrow-left mr-2" /> Kembali ke Dashboard
                        </Link>
                    </div>
                </div>
            </div>

            {/* Modal edit tanggal */}
            {showDropdown && selectedDate !== null && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            <i className="bi bi-calendar-check text-teal-600 mr-2" />
                            Atur Tanggal: {selectedDate} {months[month]} {year}
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                                <select
                                    value={dropdownStatus}
                                    onChange={e => setDropdownStatus(e.target.value as DateStatus)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                >
                                    <option value="normal">Normal (hapus tanda)</option>
                                    <option value="hadir">Hadir</option>
                                    <option value="libur">Libur</option>
                                    <option value="absen">Absen</option>
                                    <option value="reschedule">Reschedule</option>
                                    <option value="akan-datang">Akan Datang</option>
                                </select>
                            </div>

                            {dropdownStatus !== 'normal' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Judul Sesi</label>
                                        <input
                                            type="text"
                                            value={dropdownTitle}
                                            onChange={e => setDropdownTitle(e.target.value)}
                                            placeholder="Contoh: Pengenalan Robotika"
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        />
                                    </div>

                                    {dropdownStatus !== 'libur' && dropdownStatus !== 'absen' && (
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Modul</label>
                                            <select
                                                value={dropdownModule ?? ''}
                                                onChange={e => setDropdownModule(e.target.value ? parseInt(e.target.value) : undefined)}
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            >
                                                <option value="">Pilih modul (opsional)</option>
                                                {modules.map(m => (
                                                    <option key={m.id} value={m.id}>{m.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Catatan Khusus untuk Tutor (Per Pertemuan)
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={dropdownAdminNote}
                                            onChange={e => setDropdownAdminNote(e.target.value)}
                                            placeholder="Contoh: Fokuskan murid pada pemahaman sensor ultrasonik..."
                                            className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Catatan ini akan langsung terlihat oleh tutor yang mengajar sesi ini.
                                        </p>
                                    </div>
                                </>
                            )}

                            <div className="flex gap-2 pt-4">
                                <button
                                    onClick={saveDateMark}
                                    disabled={saving}
                                    className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50"
                                >
                                    {saving ? 'Menyimpan...' : 'Simpan'}
                                </button>
                                <button
                                    onClick={() => setShowDropdown(false)}
                                    disabled={saving}
                                    className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Batal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Hapus Semua Jadwal */}
            {showClearModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                <i className="bi bi-exclamation-triangle-fill text-xl" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Hapus Semua Jadwal Kalender</h3>
                                <p className="text-xs text-gray-500">Tindakan ini permanen dan tidak dapat dibatalkan</p>
                            </div>
                        </div>

                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 text-sm text-red-700 space-y-1">
                            <p className="font-semibold">Perhatian:</p>
                            <p>
                                Anda akan menghapus seluruh data jadwal sesi kalender ({sessions.length} jadwal) untuk murid{' '}
                                <strong className="font-bold">{student.name}</strong>.
                            </p>
                        </div>

                        <div className="mb-5">
                            <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={clearAllStudents}
                                    onChange={e => setClearAllStudents(e.target.checked)}
                                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                                />
                                <span>Hapus juga seluruh jadwal untuk <strong>semua murid</strong> di sistem</span>
                            </label>
                        </div>

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setShowClearModal(false)}
                                disabled={clearing}
                                className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50 text-sm"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleClearCalendar}
                                disabled={clearing}
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                            >
                                {clearing ? (
                                    <>
                                        <i className="bi bi-arrow-repeat animate-spin" /> Menghapus...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-trash3" /> Ya, Hapus Semua
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
