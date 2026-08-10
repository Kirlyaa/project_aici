import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

type DateStatus = 'normal' | 'libur' | 'absen' | 'reschedule' | 'akan-datang';

interface DateMark {
    date: number;
    status: DateStatus;
    moduleId?: number;
}

interface Module {
    id: number;
    name: string;
    image: string;
    description: string;
}

export default function CalendarManager({ studentId }: { studentId: number }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [marks, setMarks] = useState<DateMark[]>([]);
    const [selectedDate, setSelectedDate] = useState<number | null>(null);
    const [modules] = useState<Module[]>([
        { id: 1, name: 'Fantasy Zoo', image: '🦁', description: 'Pembelajaran robotika dasar dengan tema hewan' },
        { id: 2, name: 'Robot Builder', image: '🤖', description: 'Membangun dan program robot tingkat lanjut' },
    ]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [dropdownStatus, setDropdownStatus] = useState<DateStatus>('akan-datang');
    const [dropdownModule, setDropdownModule] = useState<number | undefined>(undefined);

    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const prevMonth = () => setCurrentMonth(new Date(year, month - 1));
    const nextMonth = () => setCurrentMonth(new Date(year, month + 1));

    const getStatusColor = (status: DateStatus): string => {
        const colors: Record<DateStatus, string> = {
            normal: '',
            libur: 'bg-orange-100',
            absen: 'bg-red-100',
            reschedule: 'bg-yellow-100',
            'akan-datang': 'bg-blue-100',
        };
        return colors[status];
    };

    const getStatusIcon = (status: DateStatus): string => {
        const icons: Record<DateStatus, string> = {
            normal: '',
            libur: 'bi-bookmark-fill',
            absen: 'bi-x-circle-fill',
            reschedule: 'bi-arrow-clockwise',
            'akan-datang': 'bi-calendar-check-fill',
        };
        return icons[status];
    };

    const toggleDateStatus = (date: number) => {
        setSelectedDate(date);
        setShowDropdown(true);
        const existing = marks.find(m => m.date === date);
        if (existing) {
            setDropdownStatus(existing.status);
            setDropdownModule(existing.moduleId);
        } else {
            setDropdownStatus('akan-datang');
            setDropdownModule(undefined);
        }
    };

    const saveDateMark = () => {
        if (dropdownStatus === 'normal') {
            setMarks(marks.filter(m => m.date !== selectedDate));
        } else {
            const existing = marks.findIndex(m => m.date === selectedDate);
            const newMark: DateMark = { date: selectedDate!, status: dropdownStatus, moduleId: dropdownModule };
            if (existing >= 0) {
                const updated = [...marks];
                updated[existing] = newMark;
                setMarks(updated);
            } else {
                setMarks([...marks, newMark]);
            }
        }
        setShowDropdown(false);
        setSelectedDate(null);
    };

    const getMark = (date: number) => marks.find(m => m.date === date);

    // Calendar grid
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

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Kelola Kalender" />

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <Link href={`/tutor`} className="text-gray-600 hover:text-gray-900">
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
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Kelola Kalender Murid</h1>
                    <p className="text-gray-600">Tandai tanggal libur, absen, reschedule, atau akan datang</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Calendar */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        {/* Month Header */}
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

                        {/* Day Headers */}
                        <div className="grid grid-cols-7 gap-2 mb-2">
                            {days.map(day => (
                                <div key={day} className="text-center font-semibold text-gray-600 text-sm py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-2">
                            {calendarDays.map((date, idx) => {
                                if (date === null) {
                                    return <div key={idx} className="aspect-square" />;
                                }
                                const mark = getMark(date);
                                return (
                                    <button
                                        key={date}
                                        onClick={() => toggleDateStatus(date)}
                                        className={`aspect-square rounded-lg border-2 transition-all flex items-center justify-center relative font-medium text-sm ${
                                            mark
                                                ? `${getStatusColor(mark.status)} border-gray-300`
                                                : 'border-gray-200 hover:border-teal-400 hover:bg-teal-50'
                                        }`}
                                    >
                                        {mark && (
                                            <i className={`bi ${getStatusIcon(mark.status)} text-lg absolute top-0.5 right-0.5`} />
                                        )}
                                        <span className={mark ? 'text-gray-900' : 'text-gray-600'}>{date}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-8 pt-6 border-t border-gray-200">
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

                    {/* Info Sidebar */}
                    <div className="space-y-6">
                        {/* Student Info */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <i className="bi bi-person-circle text-teal-600 text-xl" />
                                Informasi Murid
                            </h3>
                            <div className="space-y-2 text-sm">
                                <p><span className="text-gray-600">Nama:</span> <span className="font-medium text-gray-900">Faris Sukirman</span></p>
                                <p><span className="text-gray-600">Level:</span> <span className="font-medium text-gray-900">Level 2</span></p>
                                <p><span className="text-gray-600">Email:</span> <span className="font-medium text-gray-900">faris@aici.id</span></p>
                            </div>
                        </div>

                    {/* Modules List - Read Only */}
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
                            <div className="space-y-2">
                                {modules.map(m => (
                                    <div key={m.id} className="p-3 bg-gray-50 rounded-lg text-sm flex gap-3">
                                        <div className="w-12 h-12 rounded bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                            {m.image.startsWith('data:') || m.image.startsWith('http') ? (
                                                <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-xl">{m.image}</span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-900">{m.name}</p>
                                            <p className="text-xs text-gray-600">{m.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Statistics */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <i className="bi bi-bar-chart text-orange-600 text-xl" />
                                Ringkasan Bulan Ini
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm">Total Tandaan</span>
                                    <span className="font-bold text-gray-900">{marks.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm flex items-center gap-1">
                                        <i className="bi bi-bookmark-fill text-orange-600" /> Libur
                                    </span>
                                    <span className="font-bold text-orange-600">{marks.filter(m => m.status === 'libur').length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm flex items-center gap-1">
                                        <i className="bi bi-x-circle-fill text-red-600" /> Absen
                                    </span>
                                    <span className="font-bold text-red-600">{marks.filter(m => m.status === 'absen').length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm flex items-center gap-1">
                                        <i className="bi bi-arrow-clockwise text-yellow-600" /> Reschedule
                                    </span>
                                    <span className="font-bold text-yellow-600">{marks.filter(m => m.status === 'reschedule').length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600 text-sm flex items-center gap-1">
                                        <i className="bi bi-calendar-check-fill text-blue-600" /> Akan Datang
                                    </span>
                                    <span className="font-bold text-blue-600">{marks.filter(m => m.status === 'akan-datang').length}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-2">
                            <button className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 flex items-center justify-center gap-2">
                                <i className="bi bi-check-lg" /> Simpan Perubahan
                            </button>
                            <Link
                                href={`/tutor`}
                                className="block text-center px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                            >
                                <i className="bi bi-arrow-left mr-2" /> Kembali
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dropdown Modal - Atur Tanggal */}
            {showDropdown && selectedDate && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                            <i className="bi bi-calendar-check text-teal-600 mr-2" />
                            Atur Tanggal: {selectedDate} {months[month]}
                        </h3>

                        <div className="space-y-4">
                            {/* Status Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                                <select
                                    value={dropdownStatus}
                                    onChange={e => setDropdownStatus(e.target.value as DateStatus)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                >
                                    <option value="normal">Normal</option>
                                    <option value="libur">Libur</option>
                                    <option value="absen">Absen</option>
                                    <option value="reschedule">Reschedule</option>
                                    <option value="akan-datang">Akan Datang</option>
                                </select>
                            </div>

                            {/* Module Selection - tampilkan untuk reschedule & akan-datang */}
                            {dropdownStatus !== 'normal' && dropdownStatus !== 'libur' && dropdownStatus !== 'absen' && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Modul</label>
                                    <select
                                        value={dropdownModule || ''}
                                        onChange={e => setDropdownModule(e.target.value ? parseInt(e.target.value) : undefined)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    >
                                        <option value="">Pilih modul (opsional)</option>
                                        {modules.map(m => {
                                            const displayImage = m.image.startsWith('data:') || m.image.startsWith('http') ? '🖼️' : m.image;
                                            return (
                                                <option key={m.id} value={m.id}>{displayImage} {m.name}</option>
                                            );
                                        })}
                                    </select>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-4">
                                <button
                                    onClick={saveDateMark}
                                    className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700"
                                >
                                    Simpan
                                </button>
                                <button
                                    onClick={() => setShowDropdown(false)}
                                    className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Module Modal - REMOVED, keluarkan ke halaman terpisah */}

        </div>
    );
}
