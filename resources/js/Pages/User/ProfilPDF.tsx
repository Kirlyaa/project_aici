import { Head, Link, usePage } from '@inertiajs/react';
import Card from '@/Components/UI/Card';
import ProgressBar from '@/Components/UI/ProgressBar';

interface Props {
    studentStats: {
        name: string;
        class: string | null;
        level: string | null;
        totalSessions: number;
        attendance: { hadir: number; absen: number; reschedule: number; percentage: number };
        scores: { interaction: number; focus: number; robotBuilding: number; tools: number; coding: number };
        averagePercentage: number;
        comment: { system: string | null; notes: string | null };
    };
    filterInfo?: {
        selectedRange: string;
        activeLabel: string;
        meetingCount: number;
        availableRanges: Array<{ key: string; label: string; start: number; end: number }>;
    };
}

export default function ProfilPDF() {
    const { auth, studentStats, filterInfo } = usePage().props as any as {
        auth: any;
        studentStats: Props['studentStats'];
        filterInfo?: Props['filterInfo'];
    };

    const userName = studentStats?.name || auth?.user?.name || 'Siswa AICI';
    const stats = studentStats ?? {
        name: userName,
        class: null,
        level: null,
        totalSessions: 0,
        attendance: { hadir: 0, absen: 0, reschedule: 0, percentage: 0 },
        scores: { interaction: 0, focus: 0, robotBuilding: 0, tools: 0, coding: 0 },
        averagePercentage: 0,
        comment: { system: null, notes: null },
    };

    const { attendance, scores } = stats;
    const isSuperAdmin = auth?.user?.role === 'superadmin';

    return (
        <>
            <Head title={`Profil - ${userName}`} />

            <div className="bg-white min-h-screen">
                <div className="max-w-4xl mx-auto p-8">
                    {/* SuperAdmin Navigation Banner */}
                    {isSuperAdmin && (
                        <div className="print:hidden mb-6 flex flex-wrap items-center justify-between gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/superadmin/students"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-100 text-gray-800 text-xs font-semibold rounded-lg transition"
                                >
                                    <i className="bi bi-arrow-left" /> Kelola Murid
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-100 text-gray-800 text-xs font-semibold rounded-lg transition"
                                >
                                    Kembali
                                </button>
                            </div>
                            <span className="text-xs font-medium text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                                Mode Tinjau SuperAdmin
                            </span>
                        </div>
                    )}

                    {/* Header Card */}
                    <Card className="p-6 mb-6 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
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
                            </div>

                            {/* Periode Pertemuan Badge */}
                            {filterInfo && (
                                <div className="bg-white/10 border border-white/20 rounded-xl p-3.5 backdrop-blur-sm self-start sm:self-auto text-right">
                                    <span className="text-[11px] font-semibold text-teal-200 uppercase tracking-wider block">
                                        Periode Laporan Nilai
                                    </span>
                                    <p className="text-lg font-bold text-white mt-0.5">
                                        {filterInfo.activeLabel}
                                    </p>
                                    <p className="text-xs text-teal-100 mt-0.5">
                                        Basis perhitungan: {filterInfo.meetingCount} Pertemuan
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Komentar Sistem — full width, di atas statistik */}
                    {stats.comment.system && (
                        <div className="-mx-8 bg-[#034d52] text-white px-8 py-5 flex items-start gap-4 mb-6">
                            <i className="bi bi-cpu text-2xl flex-shrink-0 mt-0.5"></i>
                            <div>
                                <p className="font-semibold text-sm uppercase tracking-wide text-teal-200 mb-1">Komentar Sistem</p>
                                <p className="text-base leading-relaxed">{stats.comment.system}</p>
                            </div>
                        </div>
                    )}

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
                                <ProgressBar value={scores.interaction} max={5} label="Interaksi" color="bg-teal-600" />
                                <ProgressBar value={scores.focus} max={5} label="Fokus" color="bg-blue-600" />
                                <ProgressBar value={scores.robotBuilding} max={5} label="Robot Building" color="bg-green-600" />
                                <ProgressBar value={scores.tools} max={5} label="Tools Mgmt" color="bg-orange-600" />
                                <ProgressBar value={scores.coding} max={5} label="Coding" color="bg-red-600" />
                            </div>
                            <div className="mt-4 pt-4 border-t">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Rata-rata (skala 0–5)</span>
                                    <span className="text-2xl font-bold text-teal-600">{((scores.interaction + scores.focus + scores.robotBuilding + scores.tools + scores.coding) / 5).toFixed(2)}</span>
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
                                <div className="text-xs font-bold text-teal-700 mb-1">{scores.interaction.toFixed(1)}</div>
                                <div className="w-16 bg-teal-600 rounded-t" style={{ height: `${(scores.interaction / 5) * 160}px` }}></div>
                                <span className="text-xs mt-1 block">Interaksi</span>
                            </div>
                            <div className="text-center">
                                <div className="text-xs font-bold text-blue-700 mb-1">{scores.focus.toFixed(1)}</div>
                                <div className="w-16 bg-blue-600 rounded-t" style={{ height: `${(scores.focus / 5) * 160}px` }}></div>
                                <span className="text-xs mt-1 block">Fokus</span>
                            </div>
                            <div className="text-center">
                                <div className="text-xs font-bold text-green-700 mb-1">{scores.robotBuilding.toFixed(1)}</div>
                                <div className="w-16 bg-green-600 rounded-t" style={{ height: `${(scores.robotBuilding / 5) * 160}px` }}></div>
                                <span className="text-xs mt-1 block">Robot Build</span>
                            </div>
                            <div className="text-center">
                                <div className="text-xs font-bold text-orange-700 mb-1">{scores.tools.toFixed(1)}</div>
                                <div className="w-16 bg-orange-600 rounded-t" style={{ height: `${(scores.tools / 5) * 160}px` }}></div>
                                <span className="text-xs mt-1 block">Tools Mgmt</span>
                            </div>
                            <div className="text-center">
                                <div className="text-xs font-bold text-red-700 mb-1">{scores.coding.toFixed(1)}</div>
                                <div className="w-16 bg-red-600 rounded-t" style={{ height: `${(scores.coding / 5) * 160}px` }}></div>
                                <span className="text-xs mt-1 block">Coding</span>
                            </div>
                        </div>
                    </Card>

                    {/* Catatan Tutor */}
                    {stats.comment.notes && (
                        <Card className="p-6 mb-6">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <i className="bi bi-exclamation-triangle-fill text-amber-600"></i>
                                Catatan Tutor
                            </h2>
                            <div className="p-4 bg-[#fffdf2] border-l-4 border-amber-600 rounded">
                                <div className="flex items-start gap-3">
                                    <i className="bi bi-exclamation-triangle-fill text-amber-600 text-xl"></i>
                                    <div>
                                        <p className="font-medium mb-1 text-amber-800">Catatan</p>
                                        <p className="text-sm text-gray-700">{stats.comment.notes}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Footer */}
                    <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 mt-8 pb-8 border-t pt-4">
                        <p>Catatan ini dibuat pada {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} oleh sistem AICI</p>
                        <p className="mt-1 sm:mt-0 font-medium">Artificial Intelligence Center Indonesia</p>
                    </div>

                    {/* Filter switcher untuk preview langsung di halaman jika bukan mode print */}
                    {filterInfo && filterInfo.availableRanges.length > 0 && (
                        <div className="print:hidden fixed bottom-6 right-6 bg-white/95 backdrop-blur-md border border-gray-200 shadow-2xl p-4 rounded-2xl flex items-center gap-3 z-50">
                            <i className="bi bi-funnel-fill text-teal-600 text-lg" />
                            <div className="text-xs">
                                <p className="font-bold text-gray-800">Ubah Periode Rapor:</p>
                                <select
                                    value={filterInfo.selectedRange}
                                    onChange={(e) => {
                                        const currentPath = window.location.pathname;
                                        window.location.href = `${currentPath}?range=${e.target.value}`;
                                    }}
                                    className="mt-1 px-2.5 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-teal-500 font-semibold"
                                >
                                    {filterInfo.availableRanges.map(r => (
                                        <option key={r.key} value={r.key}>
                                            {r.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={() => window.print()}
                                className="ml-2 px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                            >
                                <i className="bi bi-printer" /> Print
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
