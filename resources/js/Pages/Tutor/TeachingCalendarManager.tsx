import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
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
    student_id: number;
    student_name: string;
    student_email?: string;
    student_avatar?: string;
}

interface StudentOption {
    id: number;
    name: string;
    avatar?: string | null;
    avatar_url?: string;
    class?: string;
    classroom_id?: number | null;
}

interface ModuleOption {
    id: number;
    name: string;
    module_type?: string;
    image?: string;
}

interface Props {
    tutor: {
        id: number;
        name: string;
        email: string;
        avatar?: string | null;
        avatar_url?: string;
    };
    sessions: SessionData[];
    students: StudentOption[];
    modules: ModuleOption[];
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

const STATUS_COLOR: Record<SessionStatus, { badge: string; dot: string; text: string; label: string }> = {
    hadir: { badge: 'bg-blue-100 text-blue-800 border-blue-200', dot: 'bg-blue-500', text: 'text-blue-700', label: 'Hadir' },
    absen: { badge: 'bg-amber-100 text-amber-800 border-amber-200', dot: 'bg-amber-400', text: 'text-amber-700', label: 'Tidak Hadir' },
    libur: { badge: 'bg-red-100 text-red-800 border-red-200', dot: 'bg-red-500', text: 'text-red-700', label: 'Libur' },
    'akan-datang': { badge: 'bg-purple-100 text-purple-800 border-purple-200', dot: 'bg-purple-500', text: 'text-purple-700', label: 'Akan Datang' },
};

export default function TeachingCalendarManager({ tutor, sessions, students, modules }: Props) {
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [selectedDate, setSelectedDate] = useState<number | null>(null);
    const [selectedStudentFilter, setSelectedStudentFilter] = useState<string>('all');
    const [updatingSessionId, setUpdatingSessionId] = useState<number | null>(null);

    const year = currentYear;
    const month = currentMonth;
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    const startDay = firstDay;

    const availableYears = useMemo(() => {
        const yearsSet = new Set<number>();
        const curY = today.getFullYear();

        for (let y = curY - 5; y <= curY + 5; y++) {
            yearsSet.add(y);
        }

        sessions.forEach(s => {
            if (s.date) {
                const y = parseInt(s.date.substring(0, 4), 10);
                if (!isNaN(y)) {
                    yearsSet.add(y);
                }
            }
        });

        yearsSet.add(currentYear);

        return Array.from(yearsSet).sort((a, b) => a - b);
    }, [sessions, currentYear]);

    // Filter sessions by student if requested
    const filteredSessions = useMemo(() => {
        if (selectedStudentFilter === 'all') return sessions;
        const sId = parseInt(selectedStudentFilter, 10);
        return sessions.filter(s => s.student_id === sId);
    }, [sessions, selectedStudentFilter]);

    // Sessions for current month
    const monthSessions = useMemo(
        () => filteredSessions.filter(s => {
            const d = new Date(s.date);
            return d.getFullYear() === year && d.getMonth() === month;
        }),
        [filteredSessions, year, month],
    );

    // Group sessions by ISO date string
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

    const prevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(prev => prev - 1);
        } else {
            setCurrentMonth(prev => prev - 1);
        }
    };

    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(prev => prev + 1);
        } else {
            setCurrentMonth(prev => prev + 1);
        }
    };

    const selectedIsoDate = selectedDate !== null ? toIsoDate(year, month, selectedDate) : null;
    const selectedDateSessions = selectedIsoDate ? (sessionsByDate.get(selectedIsoDate) || []) : [];

    const handleQuickStatusChange = (session: SessionData, newStatus: SessionStatus) => {
        setUpdatingSessionId(session.id);
        router.put(`/tutor/calendar/${session.id}`, {
            status: newStatus,
        }, {
            preserveScroll: true,
            onFinish: () => setUpdatingSessionId(null),
        });
    };

    const calendarDays: { day: number; isPrevMonth?: boolean; isNextMonth?: boolean }[] = [];
    for (let i = startDay - 1; i >= 0; i--) {
        calendarDays.push({ day: prevMonthDays - i, isPrevMonth: true });
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push({ day: i, isPrevMonth: false });
    }
    const remainingDays = 42 - calendarDays.length;
    for (let i = 1; i <= remainingDays; i++) {
        calendarDays.push({ day: i, isNextMonth: true });
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
            <Head title="Kalender Mengajar Tutor — AICI" />

            {/* Header Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <Link href="/tutor" className="text-gray-600 hover:text-gray-900 mr-1" title="Kembali ke Dashboard">
                                <i className="bi bi-arrow-left text-xl" />
                            </Link>
                            <img
                                src="/images/logo-aici.png"
                                alt="AICI Logo"
                                className="h-8 w-auto object-contain"
                            />
                            <div className="border-l border-gray-300 pl-3">
                                <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                                    Kalender Mengajar Tutor
                                </span>
                            </div>
                        </div>

                        {/* Switch ke Kalender Siswa Individual */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 font-medium hidden sm:inline">Lihat Kalender Murid:</span>
                            <select
                                className="text-xs sm:text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                                value=""
                                onChange={e => {
                                    if (e.target.value) {
                                        router.get(`/tutor/calendar/${e.target.value}`);
                                    }
                                }}
                            >
                                <option value="">-- Mode Kalender Per Murid --</option>
                                {students.map(s => (
                                    <option key={s.id} value={s.id}>
                                        {s.name} ({s.class || 'Tanpa Kelas'})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                {/* Banner / Info Header */}
                <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-teal-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <img
                            src={tutor.avatar_url || tutor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.name)}&background=0B6282&color=fff&size=200`}
                            alt={tutor.name}
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-400/50 shadow-md shrink-0"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.name)}&background=0B6282&color=fff&size=200`;
                            }}
                        />
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/30 text-teal-100 border border-teal-400/30">
                                    Agenda Pengajaran
                                </span>
                                <span className="text-teal-200 text-xs">• {tutor.name}</span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                Kalender Mengajar Tutor
                            </h1>
                            <p className="text-teal-100 text-sm mt-1 max-w-2xl">
                                Pantau seluruh jadwal mengajar Anda di berbagai kelas dan murid. Jadwal ditetapkan langsung oleh Super Admin, dan Anda dapat memperbarui status kehadiran sesi belajar murid secara real-time.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs bg-white/10 border border-white/20 px-3.5 py-2 rounded-xl text-teal-100">
                        <i className="bi bi-shield-lock-fill text-amber-300 text-sm" />
                        <span>Penjadwalan dikelola terpusat oleh Super Admin</span>
                    </div>
                </div>

                {/* Filter & Ringkasan Bulan */}
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

                    {/* Ringkasan status */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs w-full md:w-auto justify-start md:justify-end">
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

                {/* Grid Layout: Kalender di kiri, Detail Sesi Hari Terpilih di kanan */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Grid Kalender */}
                    <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                        {/* Navigasi Bulan */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={prevMonth}
                                    className="p-2 hover:bg-gray-100 rounded-xl transition text-gray-600"
                                    title="Bulan Sebelumnya"
                                >
                                    <i className="bi bi-chevron-left text-lg" />
                                </button>
                                <div className="text-center min-w-36">
                                    <h2 className="text-xl font-bold text-gray-900">
                                        {months[month]}
                                    </h2>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {monthSessions.length} agenda sesi di bulan ini
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={nextMonth}
                                    className="p-2 hover:bg-gray-100 rounded-xl transition text-gray-600"
                                    title="Bulan Berikutnya"
                                >
                                    <i className="bi bi-chevron-right text-lg" />
                                </button>
                            </div>

                            <select
                                value={year}
                                onChange={e => setCurrentYear(Number(e.target.value))}
                                className="text-sm font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                            >
                                {availableYears.map(y => (
                                    <option key={y} value={y}>
                                        {y}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Nama Hari */}
                        <div className="grid grid-cols-7 gap-2 mb-2">
                            {days.map(d => (
                                <div key={d} className="text-center font-bold text-xs uppercase tracking-wider text-gray-500 py-1">
                                    {d}
                                </div>
                            ))}
                        </div>

                        {/* Kotak Tanggal */}
                        <div className="grid grid-cols-7 gap-2">
                            {calendarDays.map((item, idx) => {
                                const { day, isPrevMonth, isNextMonth } = item;
                                if (isPrevMonth || isNextMonth) {
                                    return (
                                        <div
                                            key={`other-${idx}`}
                                            className="min-h-[82px] p-2 rounded-xl border border-gray-100 bg-gray-50/50 flex flex-col justify-between opacity-40 select-none cursor-default"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full text-gray-400">
                                                    {day}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                }

                                const iso = toIsoDate(year, month, day);
                                const daySessions = sessionsByDate.get(iso) || [];
                                const isSelected = selectedDate === day;
                                const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

                                return (
                                    <div
                                        key={`date-${year}-${month}-${day}`}
                                        onClick={() => setSelectedDate(day)}
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
                                                {day}
                                            </span>

                                            {daySessions.length > 0 && (
                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                                                    {daySessions.length}
                                                </span>
                                            )}
                                        </div>

                                        {/* Preview list badge / tag */}
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
                            </div>

                            {selectedDate === null ? (
                                <div className="text-center py-10 text-gray-400">
                                    <i className="bi bi-calendar-event text-4xl block mb-2" />
                                    <p className="text-sm">Klik tanggal pada kalender untuk melihat detail sesi pengajaran.</p>
                                </div>
                            ) : selectedDateSessions.length === 0 ? (
                                <div className="text-center py-8 text-gray-400">
                                    <i className="bi bi-calendar-x text-3xl block mb-2" />
                                    <p className="text-sm">Tidak ada jadwal sesi mengajar pada tanggal ini.</p>
                                    <p className="text-xs text-gray-400 mt-1">Jadwal baru ditambahkan oleh Super Admin.</p>
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
                                                    <div className="flex items-center gap-2.5">
                                                        <img
                                                            src={session.student_avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.student_name)}&background=14b8a6&color=fff&size=100`}
                                                            alt={session.student_name}
                                                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(session.student_name)}&background=14b8a6&color=fff&size=100`;
                                                            }}
                                                        />
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
                                                    </div>

                                                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${color.badge}`}>
                                                        {color.label}
                                                    </span>
                                                </div>

                                                {session.description && (
                                                    <p className="text-xs text-gray-600 line-clamp-2 bg-white p-2 rounded-lg border border-gray-100">
                                                        {session.description}
                                                    </p>
                                                )}

                                                {/* Catatan SuperAdmin jika ada */}
                                                {session.admin_note_for_tutor && (
                                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 text-xs text-amber-900">
                                                        <span className="font-semibold block text-[10px] text-amber-700 uppercase">Catatan Admin:</span>
                                                        {session.admin_note_for_tutor}
                                                    </div>
                                                )}

                                                {/* Tools jika ada */}
                                                {session.tools && session.tools.length > 0 && (
                                                    <div className="flex flex-wrap gap-1">
                                                        {session.tools.map((t, idx) => (
                                                            <span key={idx} className="text-[10px] bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-600">
                                                                {t}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Quick Status / Actions: Tutor hanya berwenang mengubah status absensi kehadiran */}
                                                <div className="pt-2 border-t border-gray-200/80 flex items-center justify-between flex-wrap gap-2">
                                                    <div className="flex items-center gap-1">
                                                        {(['hadir', 'absen', 'libur', 'akan-datang'] as SessionStatus[]).map(st => (
                                                            <button
                                                                key={st}
                                                                type="button"
                                                                disabled={updatingSessionId === session.id}
                                                                onClick={() => handleQuickStatusChange(session, st)}
                                                                className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition ${
                                                                    session.status === st
                                                                        ? 'bg-gray-800 text-white'
                                                                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                                                                } disabled:opacity-50`}
                                                                title={`Ubah status kehadiran ke ${st}`}
                                                            >
                                                                {st === 'akan-datang' ? 'Akan Dtg' : st === 'absen' ? 'Tdk Hadir' : st.charAt(0).toUpperCase() + st.slice(1)}
                                                            </button>
                                                        ))}
                                                    </div>

                                                    <div className="flex items-center gap-1.5">
                                                        <Link
                                                            href={`/tutor/calendar/${session.student_id}`}
                                                            className="text-xs text-teal-600 hover:text-teal-800 font-semibold p-1 hover:bg-teal-50 rounded flex items-center gap-1"
                                                            title="Buka Kalender & Absensi Murid Ini"
                                                        >
                                                            <span>Detail Murid</span>
                                                            <i className="bi bi-box-arrow-up-right text-[10px]" />
                                                        </Link>
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
        </div>
    );
}
