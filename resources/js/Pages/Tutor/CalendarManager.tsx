import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import FlashToast from '@/Components/FlashToast';
import StudentLockBanner from '@/Components/StudentLockBanner';
import { useStudentLock } from '@/Hooks/useStudentLock';
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
}

interface Student {
    id: number;
    name: string;
    email: string;
    class?: string;
    tutor?: string;
}

interface Module {
    id: number;
    name: string;
    module_type?: string;
    image: string;
}

interface StudentOption {
    id: number;
    name: string;
    class?: string;
}

interface Props {
    studentId: number;
    student: Student;
    students?: StudentOption[];
    sessions: SessionData[];
    modules: Module[];
    readOnly?: boolean;
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

export default function CalendarManager({ studentId, student, students = [], sessions, modules, readOnly = false }: Props) {
    const { lock } = useStudentLock({ studentId, page: 'calendar' });
    const isReadOnly = readOnly || lock?.locked === true;

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<number | null>(null);
    const [selectedSession, setSelectedSession] = useState<SessionData | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [saving, setSaving] = useState(false);

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

    const updateAttendanceQuick = (session: SessionData, newStatus: SessionStatus) => {
        if (isReadOnly || saving) return;
        setSaving(true);
        router.put(`/tutor/calendar/${session.id}`, {
            status: newStatus,
        }, {
            preserveScroll: true,
            onFinish: () => setSaving(false),
            onSuccess: () => {
                setSelectedSession(prev => prev && prev.id === session.id ? { ...prev, status: newStatus } : prev);
            },
        });
    };

    // R8: blok warna penuh per status: Hadir = BIRU, Libur = MERAH, Tidak Hadir = KUNING
    const STATUS_BG: Record<SessionStatus, string> = {
        hadir: 'bg-blue-500 text-white',
        libur: 'bg-red-500 text-white',
        absen: 'bg-amber-400 text-gray-900',
        'akan-datang': 'bg-purple-400 text-white',
    };

    const openSessionDetail = (session: SessionData, date: number) => {
        setSelectedDate(date);
        setSelectedSession(session);
        setShowDetailModal(true);
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
        'akan-datang': monthSessions.filter(s => s.status === 'akan-datang').length,
        hadir: monthSessions.filter(s => s.status === 'hadir').length,
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <FlashToast />
            <Head title={`Kalender Siswa — ${student.name}`} />

            <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <Link href={`/tutor?student=${studentId}`} className="text-gray-600 hover:text-gray-900 mr-1" title="Kembali ke Dashboard Tutor">
                                <i className="bi bi-arrow-left text-xl" />
                            </Link>
                            <img
                                src="/images/logo-aici.png"
                                alt="AICI Logo"
                                className="h-8 w-auto object-contain"
                            />
                            <div className="border-l border-gray-300 pl-3">
                                <p className="text-xs font-semibold text-gray-600">Kalender Siswa & Absensi</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link
                                href="/tutor/teaching-calendar"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-lg text-xs font-semibold transition"
                            >
                                <i className="bi bi-calendar3" />
                                Kalender Mengajar Tutor
                            </Link>

                            {students.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <label className="text-xs text-gray-500 font-medium hidden sm:inline">Pilih Murid:</label>
                                    <select
                                        className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                                        value={studentId}
                                        onChange={e => router.get(`/tutor/calendar/${e.target.value}`)}
                                    >
                                        {students.map(s => (
                                            <option key={s.id} value={s.id}>
                                                {s.name} {s.class ? `(${s.class})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Kelola Kalender Murid</h1>
                    <p className="text-gray-600">Tandai tanggal libur, absen, hadir, atau akan datang</p>
                </div>

                <StudentLockBanner lock={lock} studentName={student.name} />

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <button
                                onClick={prevMonth}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <i className="bi bi-chevron-left" />
                            </button>
                            <h2 className="text-xl font-bold text-gray-900">
                                {months[month]} {year}
                            </h2>
                            <button
                                onClick={nextMonth}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <i className="bi bi-chevron-right" />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-2 mb-2">
                            {days.map(day => (
                                <div key={day} className="text-center font-semibold text-gray-600 text-sm py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-2">
                            {calendarDays.map((date, idx) => {
                                if (date === null) {
                                    return <div key={idx} className="aspect-square" />;
                                }
                                const session = getSessionForDate(sessions, year, month, date);
                                const colorClass = session ? STATUS_BG[session.status] : 'bg-gray-50 text-gray-400 cursor-default';
                                return (
                                    <button
                                        key={date}
                                        type="button"
                                        onClick={() => {
                                            if (session) {
                                                openSessionDetail(session, date);
                                            }
                                        }}
                                        disabled={!session}
                                        title={session ? `${session.title} (${session.status}) - Klik untuk info / ubah absensi` : 'Tidak ada jadwal sesi'}
                                        className={`aspect-square rounded-lg transition-all flex flex-col items-center justify-center relative font-medium text-sm p-1 ${colorClass} ${
                                            session ? 'hover:opacity-90 cursor-pointer shadow-xs' : 'opacity-70'
                                        }`}
                                    >
                                        <span className={`text-xs ${session ? 'font-bold' : 'font-normal text-gray-500'}`}>{date}</span>
                                        {session && (
                                            <span className="text-[10px] leading-tight truncate max-w-full text-center opacity-90 hidden sm:block">
                                                {session.status}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-8 pt-6 border-t border-gray-200">
                            <div className="flex items-center gap-2 text-sm">
                                <span className="w-5 h-5 rounded bg-blue-500 inline-block flex-shrink-0" />
                                <span className="text-gray-700">Hadir</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="w-5 h-5 rounded bg-red-500 inline-block flex-shrink-0" />
                                <span className="text-gray-700">Libur</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="w-5 h-5 rounded bg-amber-400 inline-block flex-shrink-0" />
                                <span className="text-gray-700">Tidak Hadir</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="w-5 h-5 rounded bg-purple-400 inline-block flex-shrink-0" />
                                <span className="text-gray-700">Akan Datang</span>
                            </div>
                        </div>

                        {/* Fast Attendance Action Bar for Month's Sessions */}
                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                                <i className="bi bi-clock-history text-teal-600" />
                                Input Absensi Cepat Sesi Terjadwal ({months[month]} {year})
                            </h3>
                            {monthSessions.length === 0 ? (
                                <p className="text-xs text-gray-500 italic">Belum ada sesi terjadwal di bulan ini.</p>
                            ) : (
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                                    {monthSessions.map(sess => (
                                        <div
                                            key={sess.id}
                                            className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 gap-2 transition"
                                        >
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-gray-900 truncate">
                                                    {sess.date_string || sess.date} — {sess.title}
                                                </p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold ${STATUS_BG[sess.status]}`}>
                                                        {sess.status}
                                                    </span>
                                                    {sess.admin_note_for_tutor && (
                                                        <span className="text-[11px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 truncate max-w-xs">
                                                            <i className="bi bi-pin-angle mr-1" />{sess.admin_note_for_tutor}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Quick Attendance Buttons */}
                                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                                <button
                                                    type="button"
                                                    disabled={isReadOnly || saving}
                                                    onClick={() => updateAttendanceQuick(sess, 'hadir')}
                                                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                                                        sess.status === 'hadir'
                                                            ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                                                            : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'
                                                    }`}
                                                    title="Tandai Hadir"
                                                >
                                                    <i className="bi bi-check-circle mr-1" /> Hadir
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={isReadOnly || saving}
                                                    onClick={() => updateAttendanceQuick(sess, 'absen')}
                                                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
                                                        sess.status === 'absen'
                                                            ? 'bg-amber-500 text-white ring-2 ring-amber-300'
                                                            : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50'
                                                    }`}
                                                    title="Tandai Tidak Hadir"
                                                >
                                                    <i className="bi bi-x-circle mr-1" /> Tidak Hadir
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
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
                                <p><span className="text-gray-600">Kelas:</span> <span className="font-medium text-gray-900">{student.class || 'Tanpa Kelas'}</span></p>
                                <p><span className="text-gray-600">Modul Sesi Ini:</span> <span className="font-medium text-teal-700">
                                    {Array.from(new Set(sessions.flatMap(s => s.module_ids)))
                                        .map(mid => modules.find(m => m.id === mid)?.name)
                                        .filter(Boolean)
                                        .join(', ') || 'Belum ada modul'}
                                </span></p>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <i className="bi bi-bar-chart text-orange-600 text-xl" />
                                Ringkasan Bulan Ini
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm">Total Sesi</span>
                                    <span className="font-bold text-gray-900">{monthSessions.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm flex items-center gap-1">
                                        <span className="w-3 h-3 rounded-sm bg-blue-500 inline-block flex-shrink-0" /> Hadir
                                    </span>
                                    <span className="font-bold text-blue-600">{statusCounts.hadir}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm flex items-center gap-1">
                                        <span className="w-3 h-3 rounded-sm bg-red-500 inline-block flex-shrink-0" /> Libur
                                    </span>
                                    <span className="font-bold text-red-600">{statusCounts.libur}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm flex items-center gap-1">
                                        <span className="w-3 h-3 rounded-sm bg-amber-400 inline-block flex-shrink-0" /> Tidak Hadir
                                    </span>
                                    <span className="font-bold text-amber-600">{statusCounts.absen}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm flex items-center gap-1">
                                        <span className="w-3 h-3 rounded-sm bg-purple-400 inline-block flex-shrink-0" /> Akan Datang
                                    </span>
                                    <span className="font-bold text-purple-600">{statusCounts['akan-datang']}</span>
                                </div>
                            </div>
                        </div>

                        <Link
                            href={`/tutor?student=${studentId}`}
                            className="block text-center px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                        >
                            <i className="bi bi-arrow-left mr-2" /> Kembali
                        </Link>
                    </div>
                </div>
            </div>

            {/* Modal Detail Sesi & Absensi Tutor */}
            {showDetailModal && selectedSession && selectedDate !== null && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-start justify-between mb-4 border-b border-gray-100 pb-3">
                            <div>
                                <span className="text-xs font-semibold text-teal-700 block mb-0.5">
                                    Detail Sesi Pembelajaran
                                </span>
                                <h3 className="text-lg font-bold text-gray-900 leading-snug">
                                    {selectedDate} {months[month]} {year}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowDetailModal(false);
                                    setSelectedSession(null);
                                    setSelectedDate(null);
                                }}
                                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition"
                            >
                                <i className="bi bi-x-lg text-lg" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Info Sesi (Read-Only) */}
                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200/80 space-y-2.5">
                                <div>
                                    <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide block">
                                        Judul Sesi
                                    </span>
                                    <p className="text-sm font-bold text-gray-900">
                                        {selectedSession.title}
                                    </p>
                                </div>

                                {selectedSession.module_ids && selectedSession.module_ids.length > 0 && (
                                    <div>
                                        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide block">
                                            Modul
                                        </span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {selectedSession.module_ids.map(mid => {
                                                const mod = modules.find(m => m.id === mid);
                                                return mod ? (
                                                    <span key={mid} className="text-xs bg-teal-50 text-teal-800 border border-teal-200 px-2 py-0.5 rounded-md font-medium">
                                                        {mod.name}
                                                    </span>
                                                ) : null;
                                            })}
                                        </div>
                                    </div>
                                )}

                                {selectedSession.description && (
                                    <div>
                                        <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide block">
                                            Deskripsi
                                        </span>
                                        <p className="text-xs text-gray-700 bg-white p-2.5 rounded-lg border border-gray-200 mt-1 whitespace-pre-wrap">
                                            {selectedSession.description}
                                        </p>
                                    </div>
                                )}

                                {selectedSession.admin_note_for_tutor && (
                                    <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl mt-2">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-1">
                                            <i className="bi bi-pin-angle-fill text-amber-600" />
                                            <span>Catatan Khusus Super Admin:</span>
                                        </div>
                                        <p className="text-xs text-amber-900 whitespace-pre-wrap leading-relaxed">
                                            {selectedSession.admin_note_for_tutor}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Pengaturan Status Absensi */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    Perbarui Status Kehadiran Murid
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {(['hadir', 'absen', 'libur', 'akan-datang'] as SessionStatus[]).map(st => {
                                        const isCurrent = selectedSession.status === st;
                                        return (
                                            <button
                                                key={st}
                                                type="button"
                                                disabled={isReadOnly || saving}
                                                onClick={() => updateAttendanceQuick(selectedSession, st)}
                                                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                                                    isCurrent
                                                        ? 'bg-teal-600 text-white shadow-sm ring-2 ring-teal-300'
                                                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >
                                                <span className={`w-2 h-2 rounded-full ${
                                                    st === 'hadir' ? 'bg-blue-500' :
                                                    st === 'absen' ? 'bg-amber-400' :
                                                    st === 'libur' ? 'bg-red-500' : 'bg-purple-400'
                                                }`} />
                                                <span>
                                                    {st === 'akan-datang' ? 'Akan Datang' : st === 'absen' ? 'Tidak Hadir' : st.charAt(0).toUpperCase() + st.slice(1)}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                                <p className="text-[11px] text-gray-500 mt-2 flex items-center gap-1">
                                    <i className="bi bi-info-circle text-teal-600" />
                                    <span>Penjadwalan & modul dikelola terpusat oleh Super Admin.</span>
                                </p>
                            </div>

                            <div className="pt-2 border-t border-gray-100 flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowDetailModal(false);
                                        setSelectedSession(null);
                                        setSelectedDate(null);
                                    }}
                                    className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
                                >
                                    Tutup
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
