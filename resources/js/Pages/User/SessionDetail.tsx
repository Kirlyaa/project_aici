import { Head, Link } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import { SessionStatus, SessionItem } from '@/types/session';

interface Props {
    session: SessionItem;
}

const statusConfig: Record<SessionStatus, { badge: string; icon: string; label: string }> = {
    hadir:         { badge: 'bg-white/20 text-white backdrop-blur-md', icon: 'bi-check-circle-fill', label: 'Hadir' },
    absen:         { badge: 'bg-white/20 text-white backdrop-blur-md', icon: 'bi-x-circle-fill',     label: 'Absen' },
    reschedule:    { badge: 'bg-white/20 text-white backdrop-blur-md', icon: 'bi-arrow-repeat',       label: 'Reschedule' },
    libur:         { badge: 'bg-white/20 text-white backdrop-blur-md', icon: 'bi-calendar-x-fill',   label: 'Libur' },
    'akan-datang': { badge: 'bg-white/20 text-white backdrop-blur-md', icon: 'bi-calendar-event-fill',label: 'Akan Datang' },
};

const toolIcons: Record<string, string> = {
    'Kit Robot Dasar': 'bi-wrench-adjustable-circle',
    'Laptop':          'bi-laptop',
    'Kabel USB':       'bi-usb-drive',
    'Modul Fisik':     'bi-book',
    'Obeng':           'bi-tools',
    'Sensor Gerak':    'bi-broadcast',
    'Robot Proyek':    'bi-robot',
};

export default function SessionDetail({ session }: Props) {
    const cfg = statusConfig[session.status] || statusConfig['hadir'];

    return (
        <UserLayout currentPage="jadwal">
            <Head title={session.title} />

            <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 space-y-5 pb-24 md:pb-12">
                {/* Back Top */}
                <Link href="/jadwal" className="inline-flex items-center gap-1.5 text-[#034d52] font-semibold text-xs sm:text-sm hover:underline">
                    <i className="bi bi-arrow-left" /> Kembali
                </Link>

                {/* Hero Banner Card - Matching Mobile Mockup */}
                <div className="relative bg-[#034d52] text-white rounded-2xl p-6 sm:p-8 shadow-md overflow-hidden">
                    <div className="absolute right-0 top-0 opacity-10 pointer-events-none translate-x-6 -translate-y-4">
                        <i className="bi bi-robot text-[180px]" />
                    </div>

                    <div className="relative z-10 space-y-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${cfg.badge} border border-white/20`}>
                            <i className={`bi ${cfg.icon}`} /> {cfg.label}
                        </span>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{session.title}</h1>
                        <p className="text-teal-100 text-xs sm:text-sm font-light">
                            {(session as any).date_string ?? session.date}
                        </p>
                    </div>
                </div>

                {/* Main Content Cards Stack */}
                <div className="space-y-5">
                    {/* Deskripsi */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 space-y-3">
                        <h2 className="font-bold text-base text-gray-900">Deskripsi</h2>
                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                            {session.description || 'Sesi perdana membahas konsep dasar robotika dan block coding. Siswa sangat antusias dan langsung mencoba membuat program sederhana. Materi mencakup pemahaman tentang sensor, aktuator, dan bagaimana logika pemrograman digunakan untuk mengontrol pergerakan robot.'}
                        </p>
                    </div>

                    {/* Modul Ajar */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 space-y-4">
                        <h2 className="font-bold text-base text-gray-900">Modul Ajar</h2>

                        {session.modules && session.modules.length > 0 ? (
                            session.modules.map(mod => (
                                <div key={mod.id} className="flex items-center gap-3 p-4 bg-[#f0f7f9] rounded-2xl border border-teal-100/80">
                                    <div className="w-10 h-10 bg-[#034d52] rounded-xl flex items-center justify-center text-white flex-shrink-0">
                                        <i className="bi bi-journal-text text-xl" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-[#034d52] text-xs sm:text-sm truncate">{mod.name}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center gap-3 p-4 bg-[#f0f7f9] rounded-2xl border border-teal-100/80">
                                <div className="w-10 h-10 bg-[#034d52] rounded-xl flex items-center justify-center text-white flex-shrink-0">
                                    <i className="bi bi-journal-text text-xl" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold text-[#034d52] text-xs sm:text-sm truncate">Modul 1 – Pengenalan Robotika</p>
                                </div>
                            </div>
                        )}

                        <div className="p-3.5 bg-[#f8fafc] rounded-xl border border-gray-100 flex items-start gap-2.5">
                            <i className="bi bi-info-circle text-gray-400 text-sm mt-0.5 flex-shrink-0" />
                            <p className="text-[11px] sm:text-xs text-gray-500 leading-relaxed">
                                Pastikan untuk membawa modul fisik selama sesi untuk kelancaran praktik.
                            </p>
                        </div>
                    </div>

                    {/* Alat yang Perlu Dibawa */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 space-y-3">
                        <h2 className="font-bold text-base text-gray-900">Alat yang Perlu Dibawa</h2>
                        <div className="flex flex-wrap gap-2.5 pt-1">
                            {(session.tools && session.tools.length > 0 ? session.tools : ['Kit Robot Dasar', 'Laptop', 'Kabel USB', 'Modul Fisik']).map(tool => (
                                <span key={tool} className="inline-flex items-center gap-2 px-4 py-2 bg-[#f0f7f9] text-[#034d52] rounded-full text-xs font-semibold border border-teal-100/80">
                                    <i className={`bi ${toolIcons[tool] ?? 'bi-box'} text-sm`} />
                                    {tool}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Back Link */}
                <div className="text-center pt-2">
                    <Link href="/jadwal" className="inline-flex items-center gap-1.5 text-[#034d52] font-semibold text-xs sm:text-sm hover:underline">
                        <i className="bi bi-chevron-left" /> Kembali ke Daftar Sesi
                    </Link>
                </div>
            </div>

            {/* Floating Red PDF Action Button (FAB) on Mobile - Matching Mobile Mockup */}
            <a
                href="/profil/pdf"
                target="_blank"
                className="fixed bottom-20 right-4 sm:right-8 bg-[#8b1e1e] text-white p-3.5 rounded-full shadow-2xl hover:bg-red-900 hover:scale-105 active:scale-95 transition-all z-40 flex items-center justify-center group"
                title="Cetak PDF / Detail"
            >
                <i className="bi bi-file-earmark-pdf-fill text-2xl" />
            </a>
        </UserLayout>
    );
}
