import { useState, useMemo } from 'react';
import { SessionItem } from '@/types/session';

interface Props {
    sessions: SessionItem[];
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export default function CalendarYear({ sessions }: Props) {
    const todayYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState<number>(todayYear);

    // Kumpulkan daftar tahun: tahun-tahun sebelumnya, tahun berjalan, dan tahun-tahun yang akan datang
    const availableYears = useMemo(() => {
        const yearsSet = new Set<number>();

        // Sediakan minimal 3 tahun sebelumnya dan 3 tahun yang akan datang
        for (let y = todayYear - 3; y <= todayYear + 3; y++) {
            yearsSet.add(y);
        }

        // Sertakan semua tahun yang ada dari data sesi murid
        sessions.forEach(s => {
            if (s.date) {
                const y = parseInt(s.date.substring(0, 4), 10);
                if (!isNaN(y)) {
                    yearsSet.add(y);
                }
            }
        });

        return Array.from(yearsSet).sort((a, b) => a - b);
    }, [sessions, todayYear]);

    // Statistik bulanan untuk tahun yang dipilih
    const getMonthStats = (monthIdx: number) => {
        const monthStr = String(monthIdx + 1).padStart(2, '0');
        const prefix = `${selectedYear}-${monthStr}`;
        const monthSessions = sessions.filter(s => s.date && s.date.startsWith(prefix));

        const completed = monthSessions.filter(s => ['hadir', 'absen', 'reschedule'].includes(s.status)).length;
        const attended = monthSessions.filter(s => s.status === 'hadir').length;
        const pending = monthSessions.filter(s => s.status === 'akan-datang').length;

        return { completed, attended, pending, total: monthSessions.length };
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full flex flex-col">
            {/* Header: Rekap Tahun di kiri, Dropdown tahun di pojok kanan */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Rekap Tahun</h3>
                <select
                    value={selectedYear}
                    onChange={e => setSelectedYear(Number(e.target.value))}
                    className="text-sm font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                >
                    {availableYears.map(year => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>

            {/* Grid 12 Bulan */}
            <div className="grid grid-cols-3 gap-3.5 flex-1">
                {months.map((month, idx) => {
                    const { completed, pending, total } = getMonthStats(idx);
                    const percentage = total > 0 ? (completed / total) * 100 : 0;
                    const isHighlight = percentage >= 75;

                    return (
                        <div
                            key={month}
                            className={`border rounded-xl p-3 transition-all flex flex-col justify-between ${
                                isHighlight 
                                    ? 'border-teal-400 bg-teal-50/50' 
                                    : total > 0
                                    ? 'border-gray-200 bg-white'
                                    : 'border-gray-100 bg-gray-50/70'
                            }`}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-xs font-bold text-gray-800">{month}</h4>
                                {total > 0 && (
                                    <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                        {total} sesi
                                    </span>
                                )}
                            </div>

                            {total > 0 ? (
                                <div>
                                    {/* Progress Bar */}
                                    <div className="flex items-center gap-1.5 mb-1.5">
                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${
                                                    isHighlight ? 'bg-teal-600' : 'bg-teal-500'
                                                }`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="text-[11px] font-bold text-teal-700 min-w-max">
                                            {completed}/{total}
                                        </span>
                                    </div>

                                    {/* Percentage */}
                                    <div className="flex items-center justify-between text-[11px] text-gray-600">
                                        <span>Kehadiran</span>
                                        <span className="font-semibold">{Math.round(percentage)}%</span>
                                    </div>

                                    {/* Pending indicator */}
                                    {pending > 0 && (
                                        <p className="text-[10px] text-blue-600 flex items-center gap-1 pt-1 mt-1.5 border-t border-gray-100 font-medium">
                                            <i className="bi bi-calendar-event" />
                                            {pending} mendatang
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="h-8 flex items-center justify-center text-gray-300 text-xs font-medium">
                                    Tidak ada
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
