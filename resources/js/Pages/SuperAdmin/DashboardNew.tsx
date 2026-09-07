import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Cell, Pie, Tooltip, PieChart, ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Legend, Bar, LineChart, Line } from 'recharts';

interface Props {
    stats: {
        totalUsers: number;
        totalStudents: number;
        totalTutors: number;
        totalSchools: number;
        activeStudents: number;
        pendingStudents: number;
        activeTutors: number;
        avgGrade: number;
        totalGradeEntries: number;
        totalSessions: number;
    };
    charts: {
        sessionsByStatus: Record<string, number>;
        gradeDistribution: Record<string, number>;
        moduleTypeStats: Array<{ type: string; count: number; avg_grade: number }>;
        registrationTrend: Array<{ month: string; count: number }>;
        schoolStatus: Record<string, number>;
    };
    topSchools: Array<{ name: string; students_count: number; tutors_count: number }>;
    recentStudents: Array<{
        id: number;
        name: string;
        email: string;
        school: string;
        tutor: string;
        avgGrade: number;
        status: string;
    }>;
}

const COLORS = ['#14b8a6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function SuperAdminDashboard() {
    const { stats, charts, topSchools, recentStudents } = usePage().props as unknown as Props;

    // Prepare chart data
    const sessionData = Object.entries(charts.sessionsByStatus).map(([status, count]) => ({
        name: status,
        value: count,
    }));

    const gradeData = Object.entries(charts.gradeDistribution).map(([range, count]) => ({
        range,
        count,
    }));

    const schoolStatusData = Object.entries(charts.schoolStatus).map(([status, count]) => ({
        name: status,
        value: count,
    }));

    return (
        <AdminLayout>
            <Head title="Dashboard" />

            <div className="min-h-screen bg-gray-100 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard Analytics</h1>
                        <p className="text-gray-600">Ringkasan statistik dan analitik platform</p>
                    </div>

                    {/* Key Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                        <StatCard
                            title="Total Pengguna"
                            value={stats.totalUsers}
                            icon="👥"
                            bgColor="bg-blue-500"
                        />
                        <StatCard
                            title="Total Siswa"
                            value={stats.totalStudents}
                            subtitle={`${stats.activeStudents} aktif`}
                            icon="🎓"
                            bgColor="bg-green-500"
                        />
                        <StatCard
                            title="Total Tutor"
                            value={stats.totalTutors}
                            subtitle={`${stats.activeTutors} aktif`}
                            icon="👨‍🏫"
                            bgColor="bg-purple-500"
                        />
                        <StatCard
                            title="Total Sekolah"
                            value={stats.totalSchools}
                            icon="🏫"
                            bgColor="bg-orange-500"
                        />
                        <StatCard
                            title="Rata-rata Nilai"
                            value={stats.avgGrade.toFixed(2)}
                            subtitle={`${stats.totalGradeEntries} nilai input`}
                            icon="📊"
                            bgColor="bg-red-500"
                        />
                    </div>

                    {/* Charts Row 1 */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        {/* Session Status Distribution */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Status Sesi</h2>
                            {sessionData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={sessionData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, value }) =>
                                                `${name}: ${value}`
                                            }
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {sessionData.map((_, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={COLORS[index % COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-gray-500 text-center py-8">Tidak ada data</p>
                            )}
                        </div>

                        {/* Grade Distribution */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                                Distribusi Nilai
                            </h2>
                            {gradeData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={gradeData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="range" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#14b8a6" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-gray-500 text-center py-8">Tidak ada data</p>
                            )}
                        </div>

                        {/* School Status */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                                Status Sekolah
                            </h2>
                            {schoolStatusData.length > 0 ? (
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={schoolStatusData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, value }) =>
                                                `${name}: ${value}`
                                            }
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {schoolStatusData.map((_, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={COLORS[index % COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-gray-500 text-center py-8">Tidak ada data</p>
                            )}
                        </div>
                    </div>

                    {/* Charts Row 2 */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Module Type Performance */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                                Performa per Tipe Modul
                            </h2>
                            {charts.moduleTypeStats.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={charts.moduleTypeStats}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="type" />
                                        <YAxis yAxisId="left" label={{ value: 'Jumlah', angle: -90, position: 'insideLeft' }} />
                                        <YAxis yAxisId="right" orientation="right" label={{ value: 'Rata-rata Nilai', angle: 90, position: 'insideRight' }} />
                                        <Tooltip />
                                        <Legend />
                                        <Bar yAxisId="left" dataKey="count" fill="#3b82f6" name="Jumlah Nilai" />
                                        <Bar yAxisId="right" dataKey="avg_grade" fill="#10b981" name="Rata-rata" />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-gray-500 text-center py-8">Tidak ada data</p>
                            )}
                        </div>

                        {/* Registration Trend */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">
                                Tren Registrasi Siswa (12 Bulan)
                            </h2>
                            {charts.registrationTrend.length > 0 ? (
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={charts.registrationTrend}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="count"
                                            stroke="#14b8a6"
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            name="Registrasi"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-gray-500 text-center py-8">Tidak ada data</p>
                            )}
                        </div>
                    </div>

                    {/* Tables Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Top Schools */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Top Sekolah</h2>
                            {topSchools.length > 0 ? (
                                <div className="space-y-2">
                                    {topSchools.map((school, idx) => (
                                        <div
                                            key={idx}
                                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                                        >
                                            <div>
                                                <p className="font-semibold text-gray-900">
                                                    {idx + 1}. {school.name}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    👨‍🎓 {school.students_count} siswa · 👨‍🏫{' '}
                                                    {school.tutors_count} tutor
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">Tidak ada sekolah</p>
                            )}
                        </div>

                        {/* Recent Students */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Siswa Terbaru</h2>
                            {recentStudents.length > 0 ? (
                                <div className="space-y-2">
                                    {recentStudents.map((student) => (
                                        <div key={student.id} className="p-3 bg-gray-50 rounded-lg">
                                            <div className="flex justify-between items-start mb-1">
                                                <p className="font-semibold text-gray-900">
                                                    {student.name}
                                                </p>
                                                <span className="text-xs font-bold text-white bg-blue-600 px-2 py-1 rounded">
                                                    {student.avgGrade.toFixed(2)}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600">
                                                {student.school} · {student.tutor}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">
                                    Tidak ada siswa terbaru
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

interface StatCardProps {
    title: string;
    value: number | string;
    subtitle?: string;
    icon: string;
    bgColor: string;
}

function StatCard({ title, value, subtitle, icon, bgColor }: StatCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-2">
                <div>
                    <p className="text-gray-600 text-sm font-medium">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
                    {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
                </div>
                <div className={`${bgColor} text-white text-2xl w-12 h-12 rounded-lg flex items-center justify-center`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}
