import { SessionItem } from '@/types/session';

interface Props {
    sessions: SessionItem[];
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const monthsLong = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

export default function CalendarYear({ sessions }: Props) {
    const getMonthStats = (monthIdx: number) => {
        const monthName = monthsLong[monthIdx];
        const monthSessions = sessions.filter(s => s.date.includes(monthName));

        const completed = monthSessions.filter(s => ['hadir', 'absen', 'reschedule'].includes(s.status)).length;
        const pending = monthSessions.filter(s => s.status === 'akan-datang').length;

        return { completed, pending, total: monthSessions.length };
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Rekap 2025</h3>

            <div className="grid grid-cols-3 gap-4 flex-1">
                {months.map((month, idx) => {
                    const { completed, pending, total } = getMonthStats(idx);
                    const percentage = total > 0 ? (completed / total) * 100 : 0;
                    const isHighlight = percentage >= 75;

                    return (
                        <div key={month} className={`border-2 rounded-lg p-3 transition-all ${
                            isHighlight 
                                ? 'border-teal-600 bg-teal-50' 
                                : total > 0
                                ? 'border-gray-200 bg-white'
                                : 'border-gray-100 bg-gray-50'
                        }`}>
                            <h4 className="text-xs font-bold text-gray-800 mb-2.5">{month}</h4>

                            {total > 0 ? (
                                <>
                                    {/* Progress Bar */}
                                    <div className="flex items-center gap-1.5 mb-2">
                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${
                                                    isHighlight ? 'bg-teal-600' : 'bg-teal-500'
                                                }`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold text-teal-700 min-w-max">{completed}/{total}</span>
                                    </div>

                                    {/* Percentage */}
                                    <p className="text-xs text-right text-gray-600 mb-1">{Math.round(percentage)}%</p>

                                    {/* Pending indicator */}
                                    {pending > 0 && (
                                        <p className="text-xs text-blue-600 flex items-center gap-1 pt-1.5 border-t border-gray-200">
                                            <i className="bi bi-calendar-event" />
                                            {pending} upcoming
                                        </p>
                                    )}
                                </>
                            ) : (
                                <div className="h-8 flex items-center justify-center text-gray-300 text-xs font-medium">Tidak ada</div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
