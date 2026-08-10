import { Link } from '@inertiajs/react';
import { SessionItem, SessionStatus } from '@/types/session';

const statusConfig: Record<SessionStatus, { dot: string; badge: string; label: string; icon: string }> = {
    hadir:        { dot: 'bg-green-500',  badge: 'bg-green-100 text-green-700',  label: 'Hadir',        icon: 'bi-check-circle-fill' },
    absen:        { dot: 'bg-red-500',    badge: 'bg-red-100 text-red-700',      label: 'Absen',        icon: 'bi-x-circle-fill' },
    reschedule:   { dot: 'bg-yellow-500', badge: 'bg-yellow-100 text-yellow-700',label: 'Reschedule',   icon: 'bi-arrow-repeat' },
    libur:        { dot: 'bg-orange-500', badge: 'bg-orange-100 text-orange-700',label: 'Libur',        icon: 'bi-calendar-x-fill' },
    'akan-datang':{ dot: 'bg-blue-500',   badge: 'bg-blue-100 text-blue-700',    label: 'Akan Datang',  icon: 'bi-calendar-event-fill' },
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
                        <p className="text-xs text-gray-400 mb-3">{session.module}</p>
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
