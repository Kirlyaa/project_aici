import { useState } from 'react';
import { SessionItem } from '@/types/session';

interface Props {
    sessions: SessionItem[];
}

const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export default function CalendarMonth({ sessions }: Props) {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const getSessionStatus = (day: number) => {
        const monthStr = String(currentMonth + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        const isoDate = `${currentYear}-${monthStr}-${dayStr}`;
        return sessions.find(s => s.date.startsWith(isoDate))?.status;
    };

    const statusColors = {
        hadir: 'bg-green-100 text-green-700',
        absen: 'bg-red-100 text-red-700',
        reschedule: 'bg-yellow-100 text-yellow-700',
        libur: 'bg-orange-100 text-orange-700',
        'akan-datang': 'bg-blue-100 text-blue-700',
    };

    const statusDots = {
        hadir: 'bg-green-500',
        absen: 'bg-red-500',
        reschedule: 'bg-yellow-500',
        libur: 'bg-orange-500',
        'akan-datang': 'bg-blue-500',
    };

    const statusIcons = {
        hadir: 'bi-check-circle-fill text-green-500',
        absen: 'bi-x-circle-fill text-red-500',
        reschedule: 'bi-arrow-repeat text-yellow-500',
        libur: 'bi-bookmark-fill text-orange-500',
        'akan-datang': 'bi-calendar-event-fill text-blue-500',
    };

    const prevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    // Get previous month's days
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
    const startDay = firstDay;

    const calendarDays = [];
    // Add previous month's days (grayed out)
    for (let i = startDay - 1; i >= 0; i--) {
        calendarDays.push({ day: prevMonthDays - i, isPrevMonth: true });
    }
    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push({ day: i, isPrevMonth: false });
    }
    // Add next month's days (grayed out)
    const remainingDays = 42 - calendarDays.length; // 6 rows x 7 days
    for (let i = 1; i <= remainingDays; i++) {
        calendarDays.push({ day: i, isNextMonth: true });
    }

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                    <i className="bi bi-chevron-left" />
                </button>
                <h3 className="text-lg font-bold text-gray-900">
                    {months[currentMonth]} {currentYear}
                </h3>
                <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                    <i className="bi bi-chevron-right" />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4">
                {days.map(d => (
                    <div key={d} className="text-center text-xs font-semibold text-gray-600 py-2">
                        {d}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2 mb-6">
                {calendarDays.map((item, idx) => {
                    const day = item.day;
                    const isPrevMonth = 'isPrevMonth' in item && item.isPrevMonth;
                    const isNextMonth = 'isNextMonth' in item && item.isNextMonth;
                    const status = !isPrevMonth && !isNextMonth ? getSessionStatus(day) : null;
                    const isToday = !isPrevMonth && !isNextMonth && day === new Date().getDate() && currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear();

                    const statusColorClasses: Record<string, string> = {
                        hadir: 'bg-green-500 text-white',
                        absen: 'bg-red-500 text-white',
                        reschedule: 'bg-yellow-400 text-gray-900',
                        libur: 'bg-blue-500 text-white',
                        'akan-datang': 'bg-purple-400 text-white',
                    };

                    return (
                        <div
                            key={idx}
                            className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm font-medium transition-colors relative ${
                                isPrevMonth || isNextMonth ? 'bg-gray-50 text-gray-400 opacity-40' :
                                isToday ? 'bg-teal-600 text-white font-bold' :
                                status ? (statusColorClasses[status] ?? 'bg-gray-50 text-gray-900') : 'bg-gray-50 text-gray-400'
                            }`}
                        >
                            <span className="font-bold text-xs">{day}</span>
                            {status && !isToday && (
                                <span className="text-[10px] leading-tight opacity-90">{status}</span>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2 pt-4 border-t border-gray-100 text-xs">
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-green-500 inline-block flex-shrink-0" />
                    <span className="text-gray-600">Hadir</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-red-500 inline-block flex-shrink-0" />
                    <span className="text-gray-600">Absen</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-yellow-400 inline-block flex-shrink-0" />
                    <span className="text-gray-600">Reschedule</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-blue-500 inline-block flex-shrink-0" />
                    <span className="text-gray-600">Libur</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-purple-400 inline-block flex-shrink-0" />
                    <span className="text-gray-600">Akan Datang</span>
                </div>
            </div>
        </div>
    );
}
