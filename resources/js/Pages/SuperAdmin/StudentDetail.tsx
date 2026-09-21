import { Head, Link } from '@inertiajs/react';
import Card from '@/Components/UI/Card';
import ProgressBar from '@/Components/UI/ProgressBar';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface CategoryScore {
    category: string;
    label: string;
    score: number;
}

interface StudentDetailProps {
    student: {
        id: number;
        name: string;
        email: string;
        status: string;
        class: string | null;
        classroomName: string | null;
        tutorName: string | null;
        createdAt: string | null;
    };
    stats: {
        totalSessions: number;
        completedSessions: number;
        attendance: { hadir: number; absen: number; reschedule: number; percentage: number };
        overallAvg: number;
        averagePercentage: number;
        highestScore: number;
        lowestScore: number;
        scores: {
            interaction: number;
            focus: number;
            robotBuilding: number;
            tools: number;
            coding: number;
        };
    };
    recentSessions: Array<{
        id: number;
        title: string;
        date: string | null;
        status: string;
        module: string;
    }>;
    recentGrades: Array<{
        id: number;
        meetingNumber: number;
        moduleName: string;
        moduleType: string;
        average: number;
        date: string | null;
        grades: {
            fokus: number;
            robotBuilding: number | null;
            tools: number;
            interaction: number;
            coding: number;
        };
    }>;
    latestComment: {
        system: string | null;
        notes: string | null;
        semester: string | null;
        updatedAt: string | null;
    } | null;
}

export default function StudentDetail({
    student,
    stats,
    recentSessions,
    recentGrades,
    latestComment,
}: StudentDetailProps) {
    const categoryData: CategoryScore[] = [
        { category: 'Interaction', label: 'Interaksi', score: stats.scores.interaction },
        { category: 'Focus', label: 'Fokus', score: stats.scores.focus },
        { category: 'Robot Building', label: 'Robot Building', score: stats.scores.robotBuilding },
        { category: 'Tools', label: 'Tools Mgmt', score: stats.scores.tools },
        { category: 'Coding', label: 'Coding', score: stats.scores.coding },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <Head title={`Detail Akun: ${student.name}`} />

            {/* Top Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <Link href="/superadmin/students" className="text-gray-600 hover:text-gray-900 mr-1" title="Kembali ke Manajemen Siswa">
                                <i className="bi bi-arrow-left text-xl" />
                            </Link>
                            <img
                                src="/images/logo-aici.png"
                                alt="AICI Logo"
                                className="h-8 w-auto object-contain"
                            />
                            <div className="border-l border-gray-300 pl-3">
                                <p className="text-xs font-semibold text-gray-600">Detail Siswa</p>
                            </div>
                        </div>

                        {/* Direct Quick Action Buttons Header */}
                        <div className="flex items-center gap-2">
                            <Link
                                href={`/tutor/grades/${student.id}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                            >
                                <i className="bi bi-pencil-square" /> Kelola Nilai
                            </Link>
                            <Link
                                href={`/tutor/comments/${student.id}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                            >
                                <i className="bi bi-chat-left-text" /> Kelola Komentar
                            </Link>
                            <Link
                                href={`/superadmin/students/${student.id}/report`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                            >
                                <i className="bi bi-bar-chart-line" /> Laporan Nilai
                            </Link>
                            <Link
                                href={`/superadmin/students/${student.id}/pdf`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                            >
                                <i className="bi bi-file-earmark-pdf" /> PDF Rapor
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Hero Profile Banner */}
                <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-800 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-3xl font-bold text-white flex-shrink-0">
                                {student.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-2xl sm:text-3xl font-bold">{student.name}</h1>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                                        student.status === 'aktif' ? 'bg-green-500/20 text-green-300 border border-green-400/30' : 'bg-red-500/20 text-red-300 border border-red-400/30'
                                    }`}>
                                        {student.status}
                                    </span>
                                </div>
                                <p className="text-teal-200 text-sm mt-1">{student.email}</p>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    <span className="px-3 py-1 bg-white/15 backdrop-blur-sm rounded-lg text-xs font-medium text-white flex items-center gap-1.5">
                                        <i className="bi bi-building" /> Kelas: {student.classroomName || student.class || 'Belum Ditentukan'}
                                    </span>
                                    <span className="px-3 py-1 bg-white/15 backdrop-blur-sm rounded-lg text-xs font-medium text-white flex items-center gap-1.5">
                                        <i className="bi bi-person-badge" /> Tutor: {student.tutorName || 'Belum Ada Tutor'}
                                    </span>
                                    <span className="px-3 py-1 bg-white/15 backdrop-blur-sm rounded-lg text-xs font-medium text-white flex items-center gap-1.5">
                                        <i className="bi bi-calendar3" /> Terdaftar: {student.createdAt || '—'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Box */}
                        <div className="flex flex-wrap gap-2 md:self-center">
                            <Link
                                href={`/superadmin/calendar/${student.id}`}
                                className="px-4 py-2 bg-white text-gray-800 hover:bg-gray-100 rounded-xl text-sm font-semibold shadow-sm flex items-center gap-2 transition"
                            >
                                <i className="bi bi-calendar3 text-violet-600" /> Kalender Jadwal
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Rata-rata Nilai</p>
                            <i className="bi bi-star-fill text-amber-500 text-lg" />
                        </div>
                        <p className="text-3xl font-extrabold text-gray-900 mt-2">{stats.overallAvg.toFixed(2)}</p>
                        <p className="text-xs text-gray-400 mt-1">Skala 0 - 5.00 ({stats.averagePercentage}%)</p>
                    </div>

                    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tingkat Hadir</p>
                            <i className="bi bi-check-circle-fill text-emerald-500 text-lg" />
                        </div>
                        <p className="text-3xl font-extrabold text-gray-900 mt-2">{stats.attendance.percentage}%</p>
                        <p className="text-xs text-gray-400 mt-1">{stats.attendance.hadir} Hadir / {stats.totalSessions} Sesi</p>
                    </div>

                    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pertemuan Dinilai</p>
                            <i className="bi bi-journal-check text-blue-500 text-lg" />
                        </div>
                        <p className="text-3xl font-extrabold text-gray-900 mt-2">{recentGrades.length}</p>
                        <p className="text-xs text-gray-400 mt-1">Tertinggi: {stats.highestScore.toFixed(2)}</p>
                    </div>

                    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Absen / Reschedule</p>
                            <i className="bi bi-clock-history text-rose-500 text-lg" />
                        </div>
                        <p className="text-3xl font-extrabold text-gray-900 mt-2">{stats.attendance.absen + stats.attendance.reschedule}</p>
                        <p className="text-xs text-gray-400 mt-1">{stats.attendance.absen} Absen, {stats.attendance.reschedule} Reschedule</p>
                    </div>
                </div>

                {/* Score Breakdown & Visual Chart */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Score categories bars */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                <i className="bi bi-bar-chart-fill text-teal-600" />
                                Rata-rata Skor per Kategori
                            </h2>
                            <span className="text-xs font-medium text-gray-400">Skala 0 - 5</span>
                        </div>
                        <div className="space-y-3.5">
                            <ProgressBar value={stats.scores.interaction} max={5} label="Interaksi" color="bg-teal-600" />
                            <ProgressBar value={stats.scores.focus} max={5} label="Fokus" color="bg-blue-600" />
                            <ProgressBar value={stats.scores.robotBuilding} max={5} label="Robot Building" color="bg-emerald-600" />
                            <ProgressBar value={stats.scores.tools} max={5} label="Tools Management" color="bg-amber-500" />
                            <ProgressBar value={stats.scores.coding} max={5} label="Coding" color="bg-rose-500" />
                        </div>
                    </div>

                    {/* Chart visualization */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                <i className="bi bi-graph-up text-blue-600" />
                                Grafik Penilaian
                            </h2>
                        </div>
                        <div className="h-60 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" />
                                    <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} />
                                    <Tooltip formatter={(val: any) => [Number(val).toFixed(2), 'Nilai']} />
                                    <Bar dataKey="score" fill="#0d9488" radius={[6, 6, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Tutor Comment Section */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                            <i className="bi bi-chat-quote-fill text-indigo-600" />
                            Komentar Tutor & Catatan Perkembangan
                        </h2>
                        <Link
                            href={`/tutor/comments/${student.id}`}
                            className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                        >
                            Kelola Semua Komentar &rarr;
                        </Link>
                    </div>

                    {latestComment ? (
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-4 bg-teal-50 border border-teal-100 rounded-xl">
                                <p className="text-xs font-semibold text-teal-800 uppercase tracking-wider mb-1">
                                    Komentar Sistem Otomatis ({latestComment.semester || 'Terbaru'})
                                </p>
                                <p className="text-sm text-teal-900 leading-relaxed">
                                    {latestComment.system || 'Belum ada analisis sistem otomatis.'}
                                </p>
                            </div>
                            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                                <p className="text-xs font-semibold text-indigo-800 uppercase tracking-wider mb-1">
                                    Catatan / Feedback Tutor
                                </p>
                                <p className="text-sm text-indigo-900 leading-relaxed">
                                    {latestComment.notes || 'Belum ada catatan tutor.'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <i className="bi bi-chat-dots text-3xl text-gray-300 block mb-2" />
                            Belum ada komentar yang diinput oleh tutor untuk murid ini.
                        </div>
                    )}
                </div>

                {/* Grade Table & Sessions Side-by-Side */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Recent Grades Table */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                <i className="bi bi-award-fill text-blue-600" />
                                Riwayat Nilai Pertemuan
                            </h2>
                            <Link
                                href={`/tutor/grades/${student.id}`}
                                className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                            >
                                Kelola Nilai &rarr;
                            </Link>
                        </div>

                        {recentGrades.length === 0 ? (
                            <p className="text-sm text-gray-400 italic">Belum ada data nilai.</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs">
                                    <thead className="bg-gray-50 border-b border-gray-100 text-gray-600">
                                        <tr>
                                            <th className="py-2 px-3 text-left">P#</th>
                                            <th className="py-2 px-3 text-left">Modul</th>
                                            <th className="py-2 px-3 text-center">Fokus</th>
                                            <th className="py-2 px-3 text-center">Coding</th>
                                            <th className="py-2 px-3 text-center font-bold text-gray-800">Rata2</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {recentGrades.slice(0, 8).map(g => (
                                            <tr key={g.id} className="hover:bg-gray-50">
                                                <td className="py-2.5 px-3 font-semibold text-gray-900">P{g.meetingNumber}</td>
                                                <td className="py-2.5 px-3 text-gray-700">{g.moduleName}</td>
                                                <td className="py-2.5 px-3 text-center">{g.grades.fokus.toFixed(1)}</td>
                                                <td className="py-2.5 px-3 text-center">{g.grades.coding.toFixed(1)}</td>
                                                <td className="py-2.5 px-3 text-center font-bold text-teal-700">{g.average.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Recent Sessions Table */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                <i className="bi bi-clock-history text-teal-600" />
                                Riwayat Sesi & Kehadiran
                            </h2>
                            <Link
                                href={`/superadmin/calendar/${student.id}`}
                                className="text-xs text-teal-600 hover:text-teal-800 font-semibold"
                            >
                                Atur Jadwal &rarr;
                            </Link>
                        </div>

                        {recentSessions.length === 0 ? (
                            <p className="text-sm text-gray-400 italic">Belum ada riwayat sesi.</p>
                        ) : (
                            <div className="space-y-2">
                                {recentSessions.slice(0, 8).map(s => (
                                    <div key={s.id} className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 hover:bg-gray-50">
                                        <div>
                                            <p className="text-xs font-semibold text-gray-900">{s.title}</p>
                                            <p className="text-[11px] text-gray-500">{s.date || 'Belum dijadwalkan'} • {s.module || 'Umum'}</p>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                            s.status === 'hadir' ? 'bg-green-100 text-green-700' :
                                            s.status === 'absen' ? 'bg-red-100 text-red-700' :
                                            s.status === 'reschedule' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                            {s.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Back to list */}
                <div className="pt-4">
                    <Link
                        href="/superadmin/students"
                        className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-100 transition"
                    >
                        <i className="bi bi-arrow-left" /> Kembali ke Kelola Akun Murid
                    </Link>
                </div>
            </div>
        </div>
    );
}
