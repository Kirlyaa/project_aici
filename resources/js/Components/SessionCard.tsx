import { Link } from '@inertiajs/react';
import { SessionItem, SessionStatus } from '@/types/session';

const statusConfig: Record<SessionStatus, { dot: string; badge: string; label: string; icon: string }> = {
    hadir:        { dot: 'bg-blue-500',   badge: 'bg-blue-100 text-blue-700',    label: 'Hadir',        icon: 'bi-check-circle-fill' },
    absen:        { dot: 'bg-amber-400',  badge: 'bg-amber-100 text-amber-800',  label: 'Tidak Hadir',  icon: 'bi-x-circle-fill' },
    libur:        { dot: 'bg-red-500',    badge: 'bg-red-100 text-red-700',      label: 'Libur',        icon: 'bi-calendar-x-fill' },
    'akan-datang':{ dot: 'bg-purple-400', badge: 'bg-purple-100 text-purple-700', label: 'Akan Datang', icon: 'bi-calendar-event-fill' },
};

interface Props {
    session: SessionItem;
    href: string;
}

export default function SessionCard({ session, href }: Props) {
    const cfg = statusConfig[session.status];

    return (
        <Link href={href} className="block">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
                            <h3 className="font-bold text-gray-900 truncate">{session.title}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{session.date}</p>
                        <p className="text-xs text-gray-400 mb-2 truncate">{session.module || 'Modul Pembelajaran'}</p>
                        
                        {(session.tutor || session.classroom) && (
                            <div className="flex flex-wrap items-center gap-2 mb-3 text-[11px] text-gray-500">
                                {session.tutor && (
                                    <span className="inline-flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded text-gray-600 border border-gray-100">
                                        <i className="bi bi-person-badge text-teal-700" />
                                        {session.tutor.name}
                                    </span>
                                )}
                                {session.classroom && (
                                    <span className="inline-flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded text-gray-600 border border-gray-100">
                                        <i className="bi bi-diagram-3 text-indigo-700" />
                                        {session.classroom.name}
                                    </span>
                                )}
                            </div>
                        )}

                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${cfg.badge}`}>
                            <i className={`bi ${cfg.icon}`} />
                            {cfg.label}
                        </span>
                    </div>
                    <i className="bi bi-chevron-right text-gray-400 mt-1 flex-shrink-0" />
                </div>
            </div>
        </Link>
    );
}
