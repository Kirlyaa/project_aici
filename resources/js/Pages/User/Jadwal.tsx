import { Head, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import UserLayout from '@/Layouts/UserLayout';
import SessionCard from '@/Components/SessionCard';
import { SessionStatus, SessionItem } from '@/types/session';

interface Props {
    sessions: SessionItem[];
}

type FilterKey = 'semua' | SessionStatus;

const filters: { key: FilterKey; label: string; icon: string }[] = [
    { key: 'semua',        label: 'Semua',       icon: 'bi-list-ul' },
    { key: 'akan-datang',  label: 'Akan Datang', icon: 'bi-calendar-event' },
    { key: 'hadir',        label: 'Hadir',       icon: 'bi-check-circle' },
    { key: 'absen',        label: 'Absen',       icon: 'bi-x-circle' },
    { key: 'reschedule',   label: 'Reschedule',  icon: 'bi-arrow-repeat' },
];

export default function Jadwal({ sessions }: Props) {
    const { auth } = usePage().props as any;
    const [filter, setFilter] = useState<FilterKey>('semua');
    const [yearFilter, setYearFilter] = useState<string>('semua');

    const years = useMemo(() => {
        const set = new Set<string>();
        sessions.forEach(s => {
            if (s.date) {
                const y = s.date.substring(0, 4);
                if (y) set.add(y);
            }
        });
        return Array.from(set).sort((a, b) => b.localeCompare(a));
    }, [sessions]);

    const filtered = sessions.filter(s => {
        const matchesStatus = filter === 'semua' || s.status === filter;
        const matchesYear = yearFilter === 'semua' || (s.date && s.date.startsWith(yearFilter));
        return matchesStatus && matchesYear;
    });

    return (
        <UserLayout currentPage="jadwal">
            <Head title="Jadwal" />

            {/* Hero Header */}
            <div className="bg-teal-600 text-white px-4 pt-6 pb-8">
                <div className="max-w-7xl mx-auto flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold">Jadwal Pembelajaran</h1>
                        <p className="text-teal-100 text-sm mt-1">
                            Jadwal dan riwayat pembelajaran {auth.user.name}
                        </p>
                    </div>
                    <span className="text-right">
                        <span className="text-3xl font-bold">{sessions.length}</span>
                        <span className="block text-teal-100 text-sm">sesi</span>
                    </span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-2 pb-8">
                {/* Filter Tabs & Selector Tahun */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 mb-6 flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex gap-1 overflow-x-auto">
                        {filters.map(f => (
                            <button
                                key={f.key}
                                onClick={() => setFilter(f.key)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors
                                    ${filter === f.key
                                        ? 'bg-teal-600 text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <i className={`bi ${f.icon}`} />
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {years.length > 0 && (
                        <div className="flex items-center gap-2 px-2">
                            <span className="text-xs text-gray-500 font-medium">Filter Tahun:</span>
                            <select
                                value={yearFilter}
                                onChange={e => setYearFilter(e.target.value)}
                                className="text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
                            >
                                <option value="semua">Semua Tahun</option>
                                {years.map(y => (
                                    <option key={y} value={y}>Tahun {y}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Session Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map(session => (
                        <SessionCard
                            key={session.id}
                            session={session}
                            href={`/jadwal/${session.id}`}
                        />
                    ))}
                </div>
            </div>
        </UserLayout>
    );
}
