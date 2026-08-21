import { Head, Link } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import { SessionStatus, SessionItem } from '@/types/session';

interface Props {
    session: SessionItem;
}

const statusConfig: Record<SessionStatus, { badge: string; icon: string; label: string }> = {
    hadir:         { badge: 'bg-white/20 text-white', icon: 'bi-check-circle-fill', label: 'Hadir' },
    absen:         { badge: 'bg-white/20 text-white', icon: 'bi-x-circle-fill',     label: 'Absen' },
    reschedule:    { badge: 'bg-white/20 text-white', icon: 'bi-arrow-repeat',       label: 'Reschedule' },
    libur:         { badge: 'bg-white/20 text-white', icon: 'bi-calendar-x-fill',   label: 'Libur' },
    'akan-datang': { badge: 'bg-white/20 text-white', icon: 'bi-calendar-event-fill',label: 'Akan Datang' },
};

const toolIcons: Record<string, string> = {
    'Kit Robot Dasar': 'bi-tools',
    'Laptop':          'bi-laptop',
    'Kabel USB':       'bi-usb-drive',
    'Obeng':           'bi-wrench',
    'Sensor Gerak':    'bi-broadcast',
    'Robot Proyek':    'bi-robot',
};

export default function SessionDetail({ session }: Props) {
    const cfg = statusConfig[session.status];

    return (
        <UserLayout currentPage="tugas">
            <Head title={session.title} />

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Back */}
                <Link href="/tugas" className="inline-flex items-center gap-1 text-teal-600 mb-4 text-sm font-medium">
                    <i className="bi bi-chevron-left" /> Kembali
                </Link>

                {/* Hero */}
                <div className="bg-gradient-to-br from-teal-600 to-teal-800 text-white rounded-2xl p-6 mb-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium mb-3 ${cfg.badge} border border-white/30`}>
                        <i className={`bi ${cfg.icon}`} /> {cfg.label}
                    </span>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">{session.title}</h1>
                    <p className="text-teal-100 flex items-center gap-1.5">
                        <i className="bi bi-calendar3" /> {(session as any).date_string ?? session.date}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Deskripsi */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                            <h2 className="font-bold text-gray-900 mb-3">Deskripsi</h2>
                            <p className="text-gray-700 text-sm leading-relaxed">
                                {session.description ?? '-'}
                            </p>
                        </div>

                        {/* Alat */}
                        {session.tools && session.tools.length > 0 && (
                            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                                <h2 className="font-bold text-gray-900 mb-3">Alat yang Perlu Dibawa</h2>
                                <div className="flex flex-wrap gap-2">
                                    {session.tools.map(tool => (
                                        <span key={tool} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-700">
                                            <i className={`bi ${toolIcons[tool] ?? 'bi-box'}`} />
                                            {tool}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Modul */}
                    <div>
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                            <h2 className="font-bold text-gray-900 mb-3">Modul Ajar</h2>

                            {session.modules?.map(mod => (
                                <div key={mod.id} className="flex items-center gap-3 p-3 bg-teal-50 rounded-xl mb-3 border border-teal-100 cursor-pointer hover:bg-teal-100 transition-colors">
                                    <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <i className="bi bi-book-fill text-white text-lg" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-teal-700 text-sm truncate">{mod.name}</p>
                                        {mod.format && mod.size && (
                                            <p className="text-xs text-gray-500">FORMAT {mod.format} • {mod.size}</p>
                                        )}
                                    </div>
                                    <i className="bi bi-download text-teal-600 flex-shrink-0" />
                                </div>
                            ))}

                            <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-xs text-gray-500 flex items-start gap-1.5">
                                    <i className="bi bi-info-circle mt-0.5 flex-shrink-0" />
                                    Pastikan modul sudah diunduh sebelum sesi dimulai untuk kelancaran praktik.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer back */}
                <Link href="/tugas" className="inline-flex items-center gap-1 text-teal-600 mt-6 text-sm font-medium">
                    <i className="bi bi-chevron-left" /> Kembali ke Daftar Sesi
                </Link>
            </div>
        </UserLayout>
    );
}
