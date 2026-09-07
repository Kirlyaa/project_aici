import { Head, usePage } from '@inertiajs/react';
import Card from '@/Components/UI/Card';
import ProgressBar from '@/Components/UI/ProgressBar';

interface SessionItem {
    title: string | null;
    date: string | null;
    status: string | null;
}

interface Props {
    studentStats: {
        name: string;
        class: string | null;
        level: string | null;
        totalSessions: number;
        attendance: { hadir: number; absen: number; reschedule: number; percentage: number };
        scores: { interaction: number; focus: number; robotBuilding: number; tools: number; coding: number };
        averagePercentage: number;
        sessions: SessionItem[];
        comment: { general: string | null; notes: string | null };
    };
}

export default function ProfilPDF() {
    const { auth, studentStats } = usePage().props as any as { auth: any; studentStats: Props['studentStats'] };

    const userName = studentStats?.name || auth?.user?.name || 'Siswa AICI';
    const stats = studentStats ?? {
        name: userName,
        class: null,
        level: null,
        totalSessions: 0,
        attendance: { hadir: 0, absen: 0, reschedule: 0, percentage: 0 },
        scores: { interaction: 0, focus: 0, robotBuilding: 0, tools: 0, coding: 0 },
        averagePercentage: 0,
        sessions: [],
        comment: { general: null, notes: null },
    };

    const { attendance, scores } = stats;

    return (
        <>
            <Head title={`Profil - ${userName}`} />

            <div className="bg-white min-h-screen p-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header Card */}
                    <Card className="p-6 mb-6 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
                        <p className="text-teal-100 text-sm mb-1">Peserta Program</p>
                        <h1 className="text-3xl font-bold mb-1">{userName}</h1>
                        <p className="text-teal-100 mb-4">{stats.class ?? 'Belum ada kelas'}</p>
                        <div className="flex flex-wrap gap-2">
                            {stats.level && (
                                <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                                    <i className="bi bi-trophy-fill"></i> {stats.level}
                                </span>
                            )}
                            <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                                <i className="bi bi-check-circle-fill"></i> {stats.totalSessions} Sesi Total
                            </span>
                        </div>
                    </Card>

                    {/* Statistics Grid */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <Card className="p-6">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <i className="bi bi-calendar-check text-teal-600"></i>
                                Statistik Kehadiran
                            </h2>
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <div className="text-3xl font-bold text-green-600">{attendance.hadir}</div>
                                    <div className="text-sm text-gray-600">Hadir</div>
                                </div>
                                <div className="text-center p-4 bg-red-50 rounded-lg">
                                    <div className="text-3xl font-bold text-red-600">{attendance.absen}</div>
                                    <div className="text-sm text-gray-600">Absen</div>
                                </div>
                                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                    <div className="text-3xl font-bold text-yellow-600">{attendance.reschedule}</div>
                                    <div className="text-sm text-gray-600">Reschedule</div>
                                </div>
                            </div>
                            <ProgressBar value={attendance.percentage} label="Tingkat Kehadiran" color="bg-green-600" />
                            <p className="text-sm text-gray-500 mt-2">
                                {attendance.percentage}% ({attendance.hadir} dari {stats.totalSessions} sesi)
                            </p>
                        </Card>

                        <Card className="p-6">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <i className="bi bi-bar-chart-fill text-teal-600"></i>
                                Breakdown Nilai
                            </h2>
                            <div className="space-y-3">
                                <ProgressBar value={scores.interaction} label="Interaksi" color="bg-teal-600" />
                                <ProgressBar value={scores.focus} label="Fokus" color="bg-blue-600" />
                                <ProgressBar value={scores.robotBuilding} label="Robot Building" color="bg-green-600" />
                                <ProgressBar value={scores.tools} label="Tools Mgmt" color="bg-orange-600" />
                                <ProgressBar value={scores.coding} label="Coding" color="bg-red-600" />
                            </div>
                            <div className="mt-4 pt-4 border-t">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Rata-rata</span>
                                    <span className="text-2xl font-bold text-teal-600">{stats.averagePercentage}%</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Chart Section */}
                    <Card className="p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <i className="bi bi-graph-up text-teal-600"></i>
                            Grafik Perkembangan
                        </h2>
                        <div className="mb-4 space-y-2">
                            <div className="flex gap-2 text-sm">
                                <span className="font-medium">Interaksi</span>
                                <span className="text-gray-500">Fokus</span>
                                <span className="text-gray-500">Robot Build</span>
                                <span className="text-gray-500">Tools Mgmt</span>
                                <span className="text-gray-500">Coding</span>
                            </div>
                        </div>
                        <div className="h-48 bg-gray-50 rounded-lg flex items-end justify-around p-4">
                            <div className="text-center">
                                <div className="w-16 bg-teal-600 rounded-t" style={{ height: `${(scores.interaction / 100) * 180}px` }}></div>
                                <span className="text-xs mt-1 block">Interaksi</span>
                            </div>
                            <div className="text-center">
                                <div className="w-16 bg-blue-600 rounded-t" style={{ height: `${(scores.focus / 100) * 180}px` }}></div>
                                <span className="text-xs mt-1 block">Fokus</span>
                            </div>
                            <div className="text-center">
                                <div className="w-16 bg-green-600 rounded-t" style={{ height: `${(scores.robotBuilding / 100) * 180}px` }}></div>
                                <span className="text-xs mt-1 block">Robot Build</span>
                            </div>
                            <div className="text-center">
                                <div className="w-16 bg-orange-600 rounded-t" style={{ height: `${(scores.tools / 100) * 180}px` }}></div>
                                <span className="text-xs mt-1 block">Tools Mgmt</span>
                            </div>
                            <div className="text-center">
                                <div className="w-16 bg-red-600 rounded-t" style={{ height: `${(scores.coding / 100) * 180}px` }}></div>
                                <span className="text-xs mt-1 block">Coding</span>
                            </div>
                        </div>
                    </Card>

                    {/* Session History */}
                    <Card className="p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <i className="bi bi-clock-history text-teal-600"></i>
                            Riwayat Sesi
                        </h2>
                        <div className="space-y-2">
                            {stats.sessions.length === 0 ? (
                                <p className="text-sm text-gray-500 italic">Belum ada riwayat sesi.</p>
                            ) : (
                                stats.sessions.map((session, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 border-b">
                                        <div className="flex items-center gap-3">
                                            <i className={`bi ${session.status === 'hadir' ? 'bi-check-circle-fill text-green-500' : session.status === 'absen' ? 'bi-x-circle-fill text-red-500' : 'bi-arrow-repeat text-yellow-500'}`}></i>
                                            <div>
                                                <h3 className="font-bold text-sm">{session.title}</h3>
                                                <p className="text-xs text-gray-600">{session.date}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>

                    {/* System Comments */}
                    <Card className="p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <i className="bi bi-info-circle-fill text-teal-600"></i>
                            Komentar Sistem
                        </h2>
                        <div className="space-y-4">
                            <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
                                <div className="flex items-start gap-3">
                                    <i className="bi bi-check-circle-fill text-green-600 text-xl"></i>
                                    <div>
                                        <p className="font-medium mb-1">Kondisi Umum</p>
                                        <p className="text-sm text-gray-700">
                                            {stats.comment.general ?? 'Belum ada analisis sistem. Nilai akan muncul setelah sesi pertama.'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {stats.comment.notes && (
                                <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                                    <div className="flex items-start gap-3">
                                        <i className="bi bi-exclamation-triangle-fill text-yellow-600 text-xl"></i>
                                        <div>
                                            <p className="font-medium mb-1">Catatan</p>
                                            <p className="text-sm text-gray-700">{stats.comment.notes}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Footer */}
                    <div className="text-center text-sm text-gray-500 mt-8 pb-8">
                        <p>Catatan ini dibuat pada {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} oleh sistem AICI</p>
                        <p className="mt-1">Artificial Intelligence Center Indonesia</p>
                    </div>
                </div>
            </div>
        </>
    );
}
