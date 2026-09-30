import { Head, Link, router, usePage } from '@inertiajs/react';
import { useMemo, useRef, useState } from 'react';
import FlashToast from '@/Components/FlashToast';
import { SessionStatus } from '@/types/session';

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
    classroom_id?: number | null;
    classroom_name?: string | null;
    tutor_id?: number | null;
    student_id: number;
    student_name: string;
    student_email?: string;
}

interface TutorOption {
    id: number;
    name: string;
    email: string;
}

interface StudentOption {
    id: number;
    name: string;
    email: string;
    class?: string | null;
    classroom_id?: number | null;
}

interface ModuleOption {
    id: number;
    name: string;
    module_type?: string;
    image?: string;
}

interface Props {
    tutorId: number;
    tutor: TutorOption | null;
    sessions: SessionData[];
    modules: ModuleOption[];
    tutors: TutorOption[];
    students: StudentOption[];
}

const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];
const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

function toIsoDate(year: number, month: number, day: number): string {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function formatDateString(year: number, month: number, day: number): string {
    const date = new Date(year, month, day);
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return `${dayNames[date.getDay()]}, ${day} ${months[month]} ${year}`;
}

const STATUS_COLOR: Record<SessionStatus, { badge: string; label: string }> = {
    hadir: { badge: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Hadir' },
    absen: { badge: 'bg-amber-100 text-amber-800 border-amber-200', label: 'Tidak Hadir' },
    libur: { badge: 'bg-red-100 text-red-800 border-red-200', label: 'Libur' },
    'akan-datang': { badge: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Akan Datang' },
};

export default function SuperAdminTutorCalendarManager({
    tutorId,
    tutor,
    sessions,
    modules,
    tutors,
    students,
}: Props) {
    const { props } = usePage();
    const csvErrors: string[] = (props as any)?.flash?.csv_errors ?? (props as any)?.csv_errors ?? [];
    const csvWarnings: string[] = (props as any)?.flash?.csv_warnings ?? (props as any)?.csv_warnings ?? [];

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<number | null>(null);
    const [selectedStudentFilter, setSelectedStudentFilter] = useState<string>('all');
    const [editingSession, setEditingSession] = useState<SessionData | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showCsvPanel, setShowCsvPanel] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploadingCsv, setUploadingCsv] = useState(false);
    const csvInputRef = useRef<HTMLInputElement>(null);

    // Form inputs
    const [formStudentId, setFormStudentId] = useState<number>(students[0]?.id || 0);
    const [formTitle, setFormTitle] = useState('');
    const [formStatus, setFormStatus] = useState<SessionStatus>('akan-datang');
    const [formModuleId, setFormModuleId] = useState<number | undefined>(undefined);
    const [formAdminNote, setFormAdminNote] = useState('');
    const [formDesc, setFormDesc] = useState('');

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const filteredSessions = useMemo(() => {
        if (selectedStudentFilter === 'all') return sessions;
        const sId = parseInt(selectedStudentFilter, 10);
        return sessions.filter(s => s.student_id === sId);
    }, [sessions, selectedStudentFilter]);

    const monthSessions = useMemo(
        () => filteredSessions.filter(s => {
            const d = new Date(s.date);
            return d.getFullYear() === year && d.getMonth() === month;
        }),
        [filteredSessions, year, month],
    );

    const sessionsByDate = useMemo(() => {
        const map = new Map<string, SessionData[]>();
        filteredSessions.forEach(s => {
            const key = (s.date ?? '').slice(0, 10);
            if (!key) return;
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(s);
        });
        return map;
    }, [filteredSessions]);

    const prevMonth = () => setCurrentMonth(new Date(year, month - 1));
    const nextMonth = () => setCurrentMonth(new Date(year, month + 1));

    const selectedIsoDate = selectedDate !== null ? toIsoDate(year, month, selectedDate) : null;
    const selectedDateSessions = selectedIsoDate ? (sessionsByDate.get(selectedIsoDate) || []) : [];

    const openCreateModal = (date?: number) => {
        const targetDate = date !== null && date !== undefined ? date : (selectedDate || 1);
        setSelectedDate(targetDate);
        setEditingSession(null);
        setFormStudentId(students[0]?.id || 0);
        setFormTitle('');
        setFormStatus('akan-datang');
        setFormModuleId(undefined);
        setFormAdminNote('');
        setFormDesc('');
        setShowModal(true);
    };

    const openEditModal = (session: SessionData) => {
        setEditingSession(session);
        setFormStudentId(session.student_id);
        setFormTitle(session.title);
        setFormStatus(session.status);
        setFormModuleId(session.module_ids[0]);
        setFormAdminNote(session.admin_note_for_tutor || '');
        setFormDesc(session.description || '');
        setShowModal(true);
    };

    const handleSaveSession = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formStudentId || saving) return;

        const targetDate = selectedDate || 1;
        const iso = toIsoDate(year, month, targetDate);

        setSaving(true);
        const onFinish = () => {
            setSaving(false);
            setShowModal(false);
            setEditingSession(null);
        };

        const chosenModule = modules.find(m => m.id === formModuleId);
        const payload = {
            student_id: formStudentId,
            tutor_id: tutorId,
            title: formTitle.trim() || chosenModule?.name || `Sesi Mengajar ${iso}`,
            date_string: formatDateString(year, month, targetDate),
            date: iso,
            status: formStatus,
            description: formDesc.trim() || null,
            admin_note_for_tutor: formAdminNote.trim() || null,
            module_ids: formModuleId ? [formModuleId] : [],
        };

        if (editingSession) {
            router.put(`/superadmin/calendar/${editingSession.id}`, payload, {
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

    const handleDeleteSession = (sessionId: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus sesi pembelajaran ini?')) return;
        router.delete(`/superadmin/calendar/${sessionId}`, {
            preserveScroll: true,
        });
    };

    const handleCsvUpload = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const file = csvInputRef.current?.files?.[0];
        if (!file) {
            alert('Silakan pilih file CSV terlebih dahulu.');
            return;
        }

        const formData = new FormData();
        formData.append('csv_file', file);
        if (tutorId) {
            formData.append('tutor_id', String(tutorId));
        }

        setUploadingCsv(true);
        router.post('/superadmin/calendar/import-csv', formData, {
            forceFormData: true,
            preserveScroll: true,
            onFinish: () => setUploadingCsv(false),
            onSuccess: () => {
                if (csvInputRef.current) csvInputRef.current.value = '';
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
        hadir: monthSessions.filter(s => s.status === 'hadir').length,
        absen: monthSessions.filter(s => s.status === 'absen').length,
        libur: monthSessions.filter(s => s.status === 'libur').length,
        'akan-datang': monthSessions.filter(s => s.status === 'akan-datang').length,
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            <FlashToast />
            <Head title={`Kelola Kalender Tutor — ${tutor?.name ?? 'SuperAdmin'}`} />

            {/* Top Navigation */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <Link href="/superadmin/tutors" className="text-gray-600 hover:text-gray-900 mr-1" title="Kembali ke Manajemen Tutor">
                                <i className="bi bi-arrow-left text-xl" />
                            </Link>
                            <img
                                src="/images/logo-aici.png"
                                alt="AICI Logo"
                                className="h-8 w-auto object-contain"
                            />
                            <div className="border-l border-gray-300 pl-3">
                                <span className="text-xs font-semibold text-gray-700">
                                    Manajemen Kalender
                                </span>
                            </div>
                        </div>

                        {/* Dropdown Pemilihan Tutor */}
                        <div className="flex items-center gap-2">
                            <label className="text-xs font-semibold text-gray-500 hidden sm:inline">Pilih Tutor:</label>
                            <select
                                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white font-medium"
                                value={tutorId || ''}
                                onChange={e => {
                                    if (e.target.value) {
                                        router.get(`/superadmin/calendar/tutors/${e.target.value}`);
                                    }
                                }}
                            >
                                <option value="" disabled>-- Pilih Tutor --</option>
                                {tutors.map(t => (
                                    <option key={t.id} value={t.id}>
                                        {t.name} ({t.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                {/* Dual Mode Switcher Tabs */}
                <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                    <div className="inline-flex p-1 bg-gray-200/80 rounded-xl shadow-inner">
                        <Link
                            href="/superadmin/calendar"
                            className="px-5 py-2 rounded-lg text-sm font-semibold transition-all text-gray-600 hover:text-gray-900"
                        >
                            <i className="bi bi-person mr-2" />
                            Kalender Siswa
                        </Link>
                        <Link
                            href="/superadmin/calendar/tutors"
                            className="px-5 py-2 rounded-lg text-sm font-semibold transition-all bg-white text-teal-800 shadow-sm"
                        >
                            <i className="bi bi-person-badge mr-2" />
                            Kalender Tutor
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <button
                            type="button"
                            onClick={() => setShowCsvPanel(v => !v)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-semibold transition"
                        >
                            <i className="bi bi-file-earmark-spreadsheet text-teal-600" />
                            {showCsvPanel ? 'Tutup Panel Import' : 'Import CSV'}
                        </button>
                        <Link
                            href="/superadmin/calendar/template"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-semibold transition"
                        >
                            <i className="bi bi-file-earmark-arrow-down text-emerald-600" />
                            Download Template CSV (.csv)
                        </Link>
                        <button
                            type="button"
                            onClick={() => openCreateModal(new Date().getDate())}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
                        >
                            <i className="bi bi-plus-circle" />
                            Tambah Jadwal Mengajar
                        </button>
                    </div>
                </div>

                {/* Panel Import CSV */}
                {showCsvPanel && (
                    <div className="bg-white rounded-xl border border-teal-100 shadow-sm p-6 mb-6">
                        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2 text-base">
                                <i className="bi bi-file-earmark-spreadsheet text-teal-600 text-lg" />
                                Import Jadwal Mengajar Tutor Secara Massal (CSV)
                            </h3>
                            <a
                                href="/superadmin/calendar/template"
                                download="template_bulk_jadwal_kalender.csv"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold transition"
                            >
                                <i className="bi bi-file-earmark-arrow-down text-emerald-600" /> Download Template CSV (.csv)
                            </a>
                        </div>

                        <p className="text-sm text-gray-600 mb-3">
                            Fitur ini memungkinkan Anda memasukkan jadwal pembelajaran tutor{' '}
                            {tutor ? <strong className="text-teal-700">{tutor.name}</strong> : ''} secara massal sekaligus menggunakan file <code className="text-emerald-700 font-semibold">.csv</code>. Jika kolom Tutor di CSV dikosongkan, jadwal akan otomatis diasosiasikan ke tutor yang sedang dipilih saat ini.
                        </p>

                        <div className="mb-4 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 leading-relaxed overflow-x-auto">
                            <div className="font-bold text-slate-800 mb-1 font-sans">Format Kolom Header Template CSV:</div>
                            <div className="text-teal-700 font-bold mb-2">Tanggal | Status | Judul Pertemuan | Modul | Email Murid | Tutor | Catatan</div>
                            <div className="text-slate-600 font-sans space-y-1">
                                <div>• <strong>Tanggal</strong>: Format tanggal teks <code className="bg-slate-200 px-1 py-0.5 rounded">YYYY-MM-DD</code> (contoh: 2026-10-15) atau <code className="bg-slate-200 px-1 py-0.5 rounded">DD/MM/YYYY</code></div>
                                <div>• <strong>Status</strong>: <code className="bg-slate-200 px-1 py-0.5 rounded">hadir</code> | <code className="bg-slate-200 px-1 py-0.5 rounded">absen</code> | <code className="bg-slate-200 px-1 py-0.5 rounded">libur</code> | <code className="bg-slate-200 px-1 py-0.5 rounded">akan-datang</code></div>
                                <div>• <strong>Judul Pertemuan</strong>: Nama judul atau topik pertemuan sesi</div>
                                <div>• <strong>Modul</strong>: Nama modul pembelajaran (akan otomatis dikaitkan atau dibuat jika belum ada)</div>
                                <div>• <strong>Email Murid</strong>: Email murid terdaftar di sistem</div>
                                <div>• <strong>Tutor</strong>: Email atau nama tutor pengajar (opsional, otomatis default ke tutor ini jika dikosongkan)</div>
                                <div>• <strong>Catatan</strong>: Catatan pengingat sesi dari admin untuk tutor (opsional)</div>
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
                                disabled={uploadingCsv}
                                className="px-5 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 text-sm shadow-sm transition disabled:opacity-50 flex items-center gap-1.5"
                            >
                                <i className="bi bi-cloud-arrow-up" /> {uploadingCsv ? 'Mengimpor...' : 'Upload & Impor Sekarang'}
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

                        {csvWarnings.length > 0 && (
                            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                <p className="font-semibold text-amber-800 mb-2 flex items-center gap-1.5 text-sm">
                                    <i className="bi bi-info-circle-fill" /> Catatan Saat Impor:
                                </p>
                                <ul className="list-disc list-inside space-y-1 max-h-40 overflow-y-auto">
                                    {csvWarnings.map((warn, i) => (
                                        <li key={i} className="text-xs text-amber-700">{warn}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* Banner Info Tutor */}
                {tutor ? (
                    <div className="bg-gradient-to-r from-teal-800 to-teal-900 text-white rounded-2xl p-6 sm:p-7 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-600 text-teal-100 border border-teal-500">
                                    Kalender Mengajar Tutor
                                </span>
                                <span className="text-teal-200 text-xs">• SuperAdmin Access</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                {tutor.name}
                            </h1>
                            <p className="text-teal-100 text-sm mt-1">
                                {tutor.email} — Mengelola seluruh jadwal sesi pembelajaran dan agenda pengajaran tutor ini.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Link
                                href={`/superadmin/tutors/${tutor.id}`}
                                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/20 transition"
                            >
                                <i className="bi bi-person-lines-fill mr-1.5" />
                                Profil & Murid Binaan
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl mb-6">
                        Silakan pilih tutor terlebih dahulu untuk melihat dan mengelola kalender mengajar.
                    </div>
                )}

                {/* Filter Murid & Status Counts */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <label className="text-xs font-semibold text-gray-500 whitespace-nowrap">Filter Murid:</label>
                        <select
                            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white w-full md:w-64"
                            value={selectedStudentFilter}
                            onChange={e => setSelectedStudentFilter(e.target.value)}
                        >
                            <option value="all">Semua Murid ({sessions.length} sesi)</option>
                            {students.map(s => (
                                <option key={s.id} value={s.id}>
                                    {s.name} ({s.class || 'Tanpa Kelas'})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs w-full md:w-auto justify-start md:justify-end">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-medium">
                            <span className="w-2 h-2 rounded-full bg-blue-500" /> Hadir: {statusCounts.hadir}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-medium">
                            <span className="w-2 h-2 rounded-full bg-purple-500" /> Akan Datang: {statusCounts['akan-datang']}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 font-medium">
                            <span className="w-2 h-2 rounded-full bg-red-500" /> Libur: {statusCounts.libur}
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                            <span className="w-2 h-2 rounded-full bg-amber-400" /> Tidak Hadir: {statusCounts.absen}
                        </span>
                    </div>
                </div>

                {/* Grid Kalender & Detail Sesi */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        {/* Month Navigation */}
                        <div className="flex items-center justify-between mb-6">
                            <button
                                onClick={prevMonth}
                                className="p-2 hover:bg-gray-100 rounded-xl transition text-gray-600"
                                title="Bulan Sebelumnya"
                            >
                                <i className="bi bi-chevron-left text-lg" />
                            </button>
                            <div className="text-center">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {months[month]} {year}
                                </h2>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {monthSessions.length} sesi di bulan ini
                                </p>
                            </div>
                            <button
                                onClick={nextMonth}
                                className="p-2 hover:bg-gray-100 rounded-xl transition text-gray-600"
                                title="Bulan Berikutnya"
                            >
                                <i className="bi bi-chevron-right text-lg" />
                            </button>
                        </div>

                        {/* Days of week */}
                        <div className="grid grid-cols-7 gap-2 mb-2">
                            {days.map(d => (
                                <div key={d} className="text-center font-bold text-xs uppercase tracking-wider text-gray-500 py-1">
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Calendar cells */}
                        <div className="grid grid-cols-7 gap-2">
                            {calendarDays.map((date, idx) => {
                                if (date === null) {
                                    return <div key={`empty-${idx}`} className="min-h-[82px] rounded-xl bg-gray-50/50" />;
                                }

                                const iso = toIsoDate(year, month, date);
                                const daySessions = sessionsByDate.get(iso) || [];
                                const isSelected = selectedDate === date;
                                const isToday = (() => {
                                    const now = new Date();
                                    return now.getFullYear() === year && now.getMonth() === month && now.getDate() === date;
                                })();

                                return (
                                    <div
                                        key={`date-${date}`}
                                        onClick={() => setSelectedDate(date)}
                                        className={`min-h-[82px] p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                                            isSelected
                                                ? 'border-teal-500 ring-2 ring-teal-400/40 bg-teal-50/40 shadow-sm'
                                                : isToday
                                                ? 'border-teal-400 bg-teal-50/20'
                                                : daySessions.length > 0
                                                ? 'border-gray-200 bg-white hover:border-teal-300 hover:shadow-sm'
                                                : 'border-gray-100 bg-white hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span
                                                className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                                                    isToday
                                                        ? 'bg-teal-600 text-white'
                                                        : isSelected
                                                        ? 'bg-teal-100 text-teal-800'
                                                        : 'text-gray-700'
                                                }`}
                                            >
                                                {date}
                                            </span>

                                            {daySessions.length > 0 && (
                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                                                    {daySessions.length}
                                                </span>
                                            )}
                                        </div>

                                        <div className="mt-1 space-y-1">
                                            {daySessions.slice(0, 2).map(s => {
                                                const color = STATUS_COLOR[s.status];
                                                return (
                                                    <div
                                                        key={s.id}
                                                        className={`text-[10px] truncate px-1.5 py-0.5 rounded border font-medium ${color.badge}`}
                                                        title={`${s.student_name}: ${s.title}`}
                                                    >
                                                        {s.student_name.split(' ')[0]}: {s.title}
                                                    </div>
                                                );
                                            })}
                                            {daySessions.length > 2 && (
                                                <div className="text-[9px] text-gray-500 font-semibold pl-1">
                                                    +{daySessions.length - 2} sesi lainnya
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sisi Kanan: Detail Sesi Tanggal Terpilih */}
                    <div className="lg:col-span-4 space-y-4">
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-base">
                                        {selectedDate !== null
                                            ? formatDateString(year, month, selectedDate)
                                            : 'Pilih Tanggal'}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {selectedDateSessions.length} sesi belajar terjadwal
                                    </p>
                                </div>

                                {selectedDate !== null && (
                                    <button
                                        type="button"
                                        onClick={() => openCreateModal(selectedDate)}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-teal-50 text-teal-700 hover:bg-teal-100 border border-teal-200 rounded-lg text-xs font-semibold transition"
                                    >
                                        <i className="bi bi-plus-lg" /> Tambah Sesi
                                    </button>
                                )}
                            </div>

                            {selectedDate === null ? (
                                <div className="text-center py-10 text-gray-400">
                                    <i className="bi bi-calendar-event text-4xl block mb-2" />
                                    <p className="text-sm">Klik salah satu tanggal pada kalender untuk melihat daftar sesi mengajar tutor.</p>
                                </div>
                            ) : selectedDateSessions.length === 0 ? (
                                <div className="text-center py-8 text-gray-400">
                                    <i className="bi bi-calendar-x text-3xl block mb-2" />
                                    <p className="text-sm">Tidak ada jadwal sesi mengajar untuk tutor ini pada tanggal terpilih.</p>
                                    <button
                                        type="button"
                                        onClick={() => openCreateModal(selectedDate)}
                                        className="mt-3 text-xs text-teal-600 font-semibold hover:underline"
                                    >
                                        + Buat jadwal sekarang
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                                    {selectedDateSessions.map(session => {
                                        const color = STATUS_COLOR[session.status];
                                        return (
                                            <div
                                                key={session.id}
                                                className="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-300 transition-all shadow-sm space-y-2.5"
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <span className="text-xs font-semibold text-teal-700 block">
                                                            {session.student_name}
                                                        </span>
                                                        <h4 className="font-bold text-gray-900 text-sm leading-snug">
                                                            {session.title}
                                                        </h4>
                                                        {session.classroom_name && (
                                                            <span className="text-[11px] text-gray-500">
                                                                Kelas: {session.classroom_name}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${color.badge}`}>
                                                        {color.label}
                                                    </span>
                                                </div>

                                                {session.description && (
                                                    <p className="text-xs text-gray-600 bg-white p-2 rounded-lg border border-gray-100">
                                                        {session.description}
                                                    </p>
                                                )}

                                                {session.admin_note_for_tutor && (
                                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-xs text-amber-900">
                                                        <span className="font-semibold block text-[10px] text-amber-700 uppercase">Catatan Admin:</span>
                                                        {session.admin_note_for_tutor}
                                                    </div>
                                                )}

                                                {/* Action Bar */}
                                                <div className="pt-2 border-t border-gray-200/80 flex items-center justify-between">
                                                    <Link
                                                        href={`/superadmin/calendar/${session.student_id}`}
                                                        className="text-xs text-teal-700 hover:text-teal-900 font-semibold"
                                                        title="Buka Kalender Siswa Ini"
                                                    >
                                                        <i className="bi bi-box-arrow-up-right mr-1" />
                                                        Kalender Siswa
                                                    </Link>

                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => openEditModal(session)}
                                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                                                            title="Edit Sesi"
                                                        >
                                                            <i className="bi bi-pencil" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteSession(session.id)}
                                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                                                            title="Hapus Sesi"
                                                        >
                                                            <i className="bi bi-trash" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Tambah / Edit Sesi */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                            <h3 className="font-bold text-gray-900 text-lg">
                                {editingSession ? 'Edit Sesi Mengajar' : 'Tambah Sesi Mengajar Tutor'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <i className="bi bi-x-lg text-lg" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveSession} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Tutor Pengampu
                                </label>
                                <div className="text-sm font-semibold text-teal-800 bg-teal-50 px-3 py-2 rounded-lg border border-teal-200">
                                    {tutor?.name} ({tutor?.email})
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Tanggal Sesi
                                </label>
                                <div className="text-sm font-medium text-gray-800 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                                    {selectedDate !== null ? formatDateString(year, month, selectedDate) : '-'}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Murid <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formStudentId}
                                    onChange={e => setFormStudentId(Number(e.target.value))}
                                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
                                >
                                    {students.map(s => (
                                        <option key={s.id} value={s.id}>
                                            {s.name} ({s.class || 'Tanpa Kelas'})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Judul Pertemuan / Sesi
                                </label>
                                <input
                                    type="text"
                                    value={formTitle}
                                    onChange={e => setFormTitle(e.target.value)}
                                    placeholder="Contoh: Pertemuan 2: Sensor & Logika"
                                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Modul Terkait (Opsional)
                                </label>
                                <select
                                    value={formModuleId ?? ''}
                                    onChange={e => setFormModuleId(e.target.value ? Number(e.target.value) : undefined)}
                                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
                                >
                                    <option value="">-- Tanpa Modul --</option>
                                    {modules.map(m => (
                                        <option key={m.id} value={m.id}>
                                            {m.name} {m.module_type ? `(${m.module_type})` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Status Kehadiran <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formStatus}
                                    onChange={e => setFormStatus(e.target.value as SessionStatus)}
                                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
                                >
                                    <option value="akan-datang">Akan Datang</option>
                                    <option value="hadir">Hadir</option>
                                    <option value="absen">Tidak Hadir</option>
                                    <option value="libur">Libur</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Catatan Admin untuk Tutor (Opsional)
                                </label>
                                <textarea
                                    rows={2}
                                    value={formAdminNote}
                                    onChange={e => setFormAdminNote(e.target.value)}
                                    placeholder="Catatan khusus dari SuperAdmin untuk tutor yang mengampu sesi ini..."
                                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Deskripsi Sesi
                                </label>
                                <textarea
                                    rows={2}
                                    value={formDesc}
                                    onChange={e => setFormDesc(e.target.value)}
                                    placeholder="Deskripsi kegiatan atau materi..."
                                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500"
                                />
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-5 py-2 text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-sm transition disabled:opacity-50"
                                >
                                    {saving ? 'Menyimpan...' : 'Simpan Sesi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
