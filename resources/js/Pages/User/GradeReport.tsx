import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import UserLayout from '@/Layouts/UserLayout';
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line, BarChart, Bar } from 'recharts';

interface Grade {
    id: number;
    meetingNumber: number;
    moduleName: string;
    moduleType: number;
    grades: {
        fokus: number;
        'robot-building': number | null;
        'tools-management': number;
        interaksi: number;
        koding: number;
    };
    average: number;
    date: string;
    notes: string | null;
}

interface Stats {
    total_meetings: number;
    overall_average: number;
    type5_average: number;
    type4_average: number;
    highest_score: number;
    lowest_score: number;
}

interface ModuleStats {
    name: string;
    count: number;
    average: number;
    highest: number;
    lowest: number;
}

interface Props {
    gradeEntries: Grade[];
    stats: Stats;
    byModule: ModuleStats[];
    student: {
        id: number;
        name: string;
        email: string;
    };
}

export default function GradeReport() {
    const { gradeEntries, stats, byModule, student } = usePage().props as unknown as Props;

    // Data untuk chart - trend nilai
    const chartData = gradeEntries
        .slice()
        .reverse()
        .map((entry) => ({
            meeting: `Pertemuan ${entry.meetingNumber}`,
            average: parseFloat(entry.average.toFixed(2)),
            module: entry.moduleName,
            date: entry.date,
        }));

    // Data untuk module comparison
    const moduleData = byModule.map((mod) => ({
        name: mod.name.substring(0, 10),
        fullName: mod.name,
        average: mod.average,
        highest: mod.highest,
        lowest: mod.lowest,
        count: mod.count,
    }));

    return (
        <UserLayout>
            <Head title="Laporan Nilai" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Laporan Nilai</h1>
                        <p className="text-gray-600">
                            Pantau progres pembelajaran Anda {student.name}
                        </p>
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                            <div className="text-gray-600 text-sm font-semibold uppercase">
                                Total Pertemuan
                            </div>
                            <div className="text-4xl font-bold text-blue-600 mt-2">
                                {stats.total_meetings}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                            <div className="text-gray-600 text-sm font-semibold uppercase">
                                Rata-rata Keseluruhan
                            </div>
                            <div className="text-4xl font-bold text-green-600 mt-2">
                                {stats.overall_average.toFixed(2)}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                            <div className="text-gray-600 text-sm font-semibold uppercase">
                                Nilai Tertinggi
                            </div>
                            <div className="text-4xl font-bold text-purple-600 mt-2">
                                {stats.highest_score.toFixed(2)}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-indigo-500">
                            <div className="text-gray-600 text-sm font-semibold uppercase">
                                Robot Building Avg
                            </div>
                            <div className="text-4xl font-bold text-indigo-600 mt-2">
                                {stats.type5_average.toFixed(2)}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500">
                            <div className="text-gray-600 text-sm font-semibold uppercase">
                                Coding Avg
                            </div>
                            <div className="text-4xl font-bold text-orange-600 mt-2">
                                {stats.type4_average.toFixed(2)}
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
                            <div className="text-gray-600 text-sm font-semibold uppercase">
                                Nilai Terendah
                            </div>
                            <div className="text-4xl font-bold text-red-600 mt-2">
                                {stats.lowest_score.toFixed(2)}
                            </div>
                        </div>
                    </div>

                    {/* Trend Chart */}
                    {chartData.length > 0 && (
                        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Tren Nilai Per Pertemuan
                            </h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="meeting" />
                                    <YAxis domain={[0, 5]} />
                                    <Tooltip formatter={(value: any) => Number(value ?? 0).toFixed(2)} />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="average"
                                        stroke="#3b82f6"
                                        strokeWidth={2}
                                        dot={{ r: 5 }}
                                        name="Rata-rata"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* Module Comparison */}
                    {moduleData.length > 0 && (
                        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Performa Per Modul
                            </h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={moduleData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis domain={[0, 5]} />
                                    <Tooltip formatter={(value: any) => Number(value ?? 0).toFixed(2)} />
                                    <Legend />
                                    <Bar dataKey="average" fill="#3b82f6" name="Rata-rata" />
                                    <Bar dataKey="highest" fill="#10b981" name="Tertinggi" />
                                    <Bar dataKey="lowest" fill="#ef4444" name="Terendah" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* Detailed Table */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">
                            Detail Nilai per Pertemuan
                        </h2>

                        {gradeEntries.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b-2 border-gray-200 bg-gray-50">
                                            <th className="px-4 py-3 text-left font-semibold text-gray-900">
                                                Pertemuan
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-900">
                                                Modul
                                            </th>
                                            <th className="px-4 py-3 text-left font-semibold text-gray-900">
                                                Tanggal
                                            </th>
                                            <th className="px-4 py-3 text-center font-semibold text-gray-900">
                                                Fokus
                                            </th>
                                            <th className="px-4 py-3 text-center font-semibold text-gray-900">
                                                Interaksi
                                            </th>
                                            <th className="px-4 py-3 text-center font-semibold text-gray-900">
                                                Koding
                                            </th>
                                            <th className="px-4 py-3 text-center font-semibold text-gray-900">
                                                Rata-rata
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {gradeEntries.map((entry, idx) => (
                                            <tr
                                                key={entry.id}
                                                className={`border-b border-gray-100 ${
                                                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                                } hover:bg-blue-50 transition`}
                                            >
                                                <td className="px-4 py-3 font-semibold text-gray-900">
                                                    {entry.meetingNumber}
                                                </td>
                                                <td className="px-4 py-3 text-gray-700">
                                                    {entry.moduleName}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">
                                                    {entry.date || '-'}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                                                        {entry.grades.fokus.toFixed(2)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                                                        {entry.grades.interaksi.toFixed(2)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-semibold">
                                                        {entry.grades.koding.toFixed(2)}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span
                                                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                                            entry.average >= 4.5
                                                                ? 'bg-green-100 text-green-800'
                                                                : entry.average >= 3.5
                                                                  ? 'bg-yellow-100 text-yellow-800'
                                                                  : 'bg-red-100 text-red-800'
                                                        }`}
                                                    >
                                                        {entry.average.toFixed(2)}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-600 text-lg">
                                    Belum ada data nilai. Nilai akan muncul setelah tutor memasukkan nilai Anda.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
