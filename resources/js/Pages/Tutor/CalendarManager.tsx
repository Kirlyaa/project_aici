import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
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
    tools?: string[] | null;
    module_ids: number[];
}

interface Student {
    id: number;
    name: string;
    email: string;
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

export default function CalendarManager({ studentId, student, sessions, modules }: Props) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<number | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [dropdownStatus, setDropdownStatus] = useState<DateStatus>('akan-datang');
    const [dropdownModule, setDropdownModule] = useState<number | undefined>(undefined);
    const [dropdownTitle, setDropdownTitle] = useState('');
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

    const getStatusColor = (status: SessionStatus): string => {
        const colors: Record<SessionStatus, string> = {
            hadir: 'bg-green-100',
            libur: 'bg-orange-100',
            absen: 'bg-red-100',
            reschedule: 'bg-yellow-100',
            'akan-datang': 'bg-blue-100',
        };
        return colors[status];
    };

    const getStatusIcon = (status: SessionStatus): string => {
        const icons: Record<SessionStatus, string> = {
            hadir: 'bi-check-circle-fill',
            libur: 'bi-bookmark-fill',
            absen: 'bi-x-circle-fill',
            reschedule: 'bi-arrow-clockwise',
            'akan-datang': 'bi-calendar-check-fill',
        };
        return icons[status];
    };

    const openDateEditor = (date: number) => {
        const existing = getSessionForDate(sessions, year, month, date);
        setSelectedDate(date);
        setShowDropdown(true);
        if (existing) {
            setDropdownStatus(existing.status);
            setDropdownModule(existing.module_ids[0]);
            setDropdownTitle(existing.title);
        } else {
            setDropdownStatus('akan-datang');
            setDropdownModule(undefined);
            setDropdownTitle('');
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
                router.delete(`/tutor/calendar/${existing.id}`, {
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
            module_ids: dropdownModule ? [dropdownModule] : [],
        };

        if (existing) {
            router.put(`/tutor/calendar/${existing.id}`, payload, {
                preserveScroll: true,
                onFinish,
            });
        } else {
            router.post('/tutor/calendar', payload, {
                preserveScroll: true,
                onFinish,
            });
        }
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
            <Head title="Kelola Kalender" />

            <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <Link href="/tutor" className="text-gray-600 hover:text-gray-900">
                                <i className="bi bi-arrow-left text-xl" />
                            </Link>
                            <div>
                                <h1 className="font-bold text-lg">AICI</h1>
                                <p className="text-xs text-gray-500">Kelola Kalender</p>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Kelola Kalender Murid</h1>
                    <p className="text-gray-600">Tandai tanggal libur, absen, reschedule, hadir, atau akan datang</p>
                </div>

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
                                return (
                                    <button
                                        key={date}
                                        onClick={() => openDateEditor(date)}
                                        className={`aspect-square rounded-lg border-2 transition-all flex items-center justify-center relative font-medium text-sm ${
                                            session
                                                ? `${getStatusColor(session.status)} border-gray-300`
                                                : 'border-gray-200 hover:border-teal-400 hover:bg-teal-50'
                                        }`}
                                    >
                                        {session && (
                                            <i className={`bi ${getStatusIcon(session.status)} text-lg absolute top-0.5 right-0.5`} />
                                        )}
                                        <span className={session ? 'text-gray-900' : 'text-gray-600'}>{date}</span>
                                    </button>
                                );
                            })}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mt-8 pt-6 border-t border-gray-200">
                            <div className="flex items-center gap-2 text-sm">
                                <i className="bi bi-check-circle-fill text-green-600 text-lg" />
                                <span className="text-gray-700">Hadir</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <i className="bi bi-bookmark-fill text-orange-600 text-lg" />
                                <span className="text-gray-700">Libur</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <i className="bi bi-x-circle-fill text-red-600 text-lg" />
                                <span className="text-gray-700">Absen</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <i className="bi bi-arrow-clockwise text-yellow-600 text-lg" />
                                <span className="text-gray-700">Reschedule</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <i className="bi bi-calendar-check-fill text-blue-600 text-lg" />
                                <span className="text-gray-700">Akan Datang</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <div className="w-4 h-4 rounded border border-gray-300" />
                                <span className="text-gray-700">Normal</span>
                            </div>
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
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <i className="bi bi-collection text-blue-600 text-xl" />
                                    Modul Tersedia
                                </span>
                                <Link
                                    href="/tutor/modules"
                                    className="px-2 py-1 bg-teal-600 text-white rounded text-xs font-medium hover:bg-teal-700 flex items-center gap-1"
                                >
                                    <i className="bi bi-gear-fill" /> Kelola
                                </Link>
                            </h3>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                {modules.length === 0 ? (
                                    <p className="text-sm text-gray-500 italic">Belum ada modul.</p>
                                ) : (
                                    modules.map(m => (
                                        <div key={m.id} className="p-3 bg-gray-50 rounded-lg text-sm flex gap-3">
                                            <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                {m.image?.startsWith('data:') || m.image?.startsWith('http') ? (
                                                    <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-xl">{m.image || '📘'}</span>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900">{m.name}</p>
                                                {m.module_type && (
                                                    <p className="text-xs text-gray-600">{m.module_type}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
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
                                        <i className="bi bi-check-circle-fill text-green-600" /> Hadir
                                    </span>
                                    <span className="font-bold text-green-600">{statusCounts.hadir}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm flex items-center gap-1">
                                        <i className="bi bi-bookmark-fill text-orange-600" /> Libur
                                    </span>
                                    <span className="font-bold text-orange-600">{statusCounts.libur}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm flex items-center gap-1">
                                        <i className="bi bi-x-circle-fill text-red-600" /> Absen
                                    </span>
                                    <span className="font-bold text-red-600">{statusCounts.absen}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm flex items-center gap-1">
                                        <i className="bi bi-arrow-clockwise text-yellow-600" /> Reschedule
                                    </span>
                                    <span className="font-bold text-yellow-600">{statusCounts.reschedule}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm flex items-center gap-1">
                                        <i className="bi bi-calendar-check-fill text-blue-600" /> Akan Datang
                                    </span>
                                    <span className="font-bold text-blue-600">{statusCounts['akan-datang']}</span>
                                </div>
                            </div>
                        </div>

                        <Link
                            href="/tutor"
                            className="block text-center px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                        >
                            <i className="bi bi-arrow-left mr-2" /> Kembali
                        </Link>
                    </div>
                </div>
            </div>

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
        </div>
    );
}
