import { Head } from '@inertiajs/react';
import { useState } from 'react';
import UserLayout from '@/Layouts/UserLayout';
import ProgressBar from '@/Components/UI/ProgressBar';
import SessionCard from '@/Components/SessionCard';
import CalendarMonth from '@/Components/CalendarMonth';
import CalendarYear from '@/Components/CalendarYear';
import { SessionItem } from '@/types/session';

interface Props {
    sessions: SessionItem[];
}

export default function Beranda({ sessions }: Props) {
    const recentSessions = sessions.slice(0, 5); // Just take first 5 from database
    const [calendarView, setCalendarView] = useState<'bulanan' | 'tahunan'>('bulanan');

    return (
        <UserLayout currentPage="home">
            <Head title="Beranda" />
            
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
                {/* Calendar Toggle - Mobile Only */}
                <div className="lg:hidden flex gap-2 bg-white rounded-xl border border-gray-100 shadow-sm p-2">
                    <button
                        onClick={() => setCalendarView('bulanan')}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                            calendarView === 'bulanan'
                                ? 'bg-teal-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <i className="bi bi-calendar3 mr-1.5" />
                        Bulanan
                    </button>
                    <button
                        onClick={() => setCalendarView('tahunan')}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
                            calendarView === 'tahunan'
                                ? 'bg-teal-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <i className="bi bi-calendar-event mr-1.5" />
                        Tahunan
                    </button>
                </div>

                {/* Calendars */}
                <div className="grid lg:grid-cols-2 gap-6 auto-rows-max lg:auto-rows-1">
                    {/* Mobile: Show one at a time, Desktop: Show both */}
                    <div className={`${calendarView !== 'bulanan' && 'hidden lg:block'}`}>
                        <CalendarMonth sessions={sessions} />
                    </div>
                    <div className={`${calendarView !== 'tahunan' && 'hidden lg:block'} h-full`}>
                        <CalendarYear sessions={sessions} />
                    </div>
                </div>

                {/* Sessions Section */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Sesi Terbaru</h2>
                        <a href="/jadwal" className="text-teal-600 text-sm font-medium flex items-center gap-1">
                            Lihat semua <i className="bi bi-arrow-right" />
                        </a>
                    </div>

                    <ProgressBar value={sessions.filter(s => s.status === 'hadir').length} max={sessions.length} label="Progress Semester" />

                    <div className="mt-4 grid gap-3">
                        {recentSessions.map(session => (
                            <SessionCard
                                key={session.id}
                                session={session}
                                href={`/jadwal/${session.id}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
