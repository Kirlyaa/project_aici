import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface GradeEntry {
    id: number;
    meetingNumber: number;
    moduleName: string;
    moduleType: number;
    moduleId: number | null;
    grades: Record<string, number | null>;
    average: number;
    date: string | null;
    notes: string | null;
}

interface Module {
    id: number;
    name: string;
    module_type: string;
}

interface Props {
    studentId: number;
    student: { id: number; name: string; email: string };
    gradeEntries: GradeEntry[];
    modules: Module[];
    averages: { overall: number; robot: number; coding: number; count: number };
}

const categoriesType5 = ['interaksi', 'fokus', 'robot-building', 'tools-management', 'koding'];
const categoriesType4 = ['fokus', 'tools-management', 'interaksi', 'koding'];

const getCategoryLabel = (cat: string): string => {
    const labels: Record<string, string> = {
        interaksi: 'Interaksi',
        fokus: 'Fokus',
        'robot-building': 'Robot Building',
        'tools-management': 'Tools Mgmt',
        koding: 'Coding',
    };
    return labels[cat] || cat;
};

const getCategoryColor = (cat: string): string => {
    const colors: Record<string, string> = {
        interaksi: '#0891b2',
        fokus: '#3b82f6',
        'robot-building': '#10b981',
        'tools-management': '#f59e0b',
        koding: '#ef4444',
    };
    return colors[cat] || '#6b7280';
};

export default function GradesManager() {
    const { studentId, student, gradeEntries, modules, averages } = usePage().props as unknown as Props;
    const [showForm, setShowForm] = useState(false);
    const [selectedModuleId, setSelectedModuleId] = useState('');
    const [meetingNumber, setMeetingNumber] = useState('');
    const [meetingDate, setMeetingDate] = useState('');
    const [notes, setNotes] = useState('');

    const selectedModule = modules.find(m => String(m.id) === selectedModuleId);
    const moduleType = selectedModule?.module_type === 'robot' ? 5 : 4;

    const getCategories = (type: number) => type === 5 ? categoriesType5 : categoriesType4;

    const updateGrade = (entryId: number, category: string, value: number) => {
        const entry = gradeEntries.find(e => e.id === entryId);
        if (!entry) return;
        const grades = { ...entry.grades, [category]: Math.max(0, Math.min(5, value)) };
        const values = Object.values(grades).filter((v): v is number => v !== null);
        const average = values.length > 0 ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 100) / 100 : 0;

        router.put(`/tutor/grades/${entryId}`, {
            student_id: studentId,
            module_id: entry.moduleId,
            meeting_number: entry.meetingNumber,
            module_type: entry.moduleType === 5 ? 'robot' : 'coding',
            meeting_date: entry.date,
            fokus: grades['fokus'] ?? 0,
            robot_building: grades['robot-building'] ?? 0,
            tools_management: grades['tools-management'] ?? 0,
            interaksi: grades['interaksi'] ?? 0,
            coding: grades['koding'] ?? 0,
            notes: entry.notes,
        });
    };

    const addGradeEntry = () => {
        if (!selectedModuleId) return;

        router.post('/tutor/grades', {
            student_id: studentId,
            module_id: Number(selectedModuleId),
            meeting_number: meetingNumber ? Number(meetingNumber) : (gradeEntries.length > 0 ? Math.max(...gradeEntries.map(e => e.meetingNumber)) + 1 : 1),
            module_type: moduleType === 5 ? 'robot' : 'coding',
            meeting_date: meetingDate || null,
            fokus: 0,
            robot_building: 0,
            tools_management: 0,
            interaksi: 0,
            coding: 0,
            notes: notes || null,
        }, {
            onSuccess: () => {
                setShowForm(false);
                setSelectedModuleId('');
                setMeetingNumber('');
                setMeetingDate('');
                setNotes('');
            },
        });
    };

    const deleteEntry = (id: number) => {
        if (window.confirm('Yakin ingin menghapus data nilai ini?')) {
            router.delete(`/tutor/grades/${id}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Input Nilai" />

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <Link href={`/tutor`} className="text-gray-600 hover:text-gray-900">
                                <i className="bi bi-arrow-left text-xl" />
                            </Link>
                            <div>
                                <h1 className="font-bold text-lg">AICI</h1>
                                <p className="text-xs text-gray-500">Input Nilai</p>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Input Nilai: {student.name}</h1>
                    <p className="text-gray-600">Input nilai per pertemuan dengan modul yang dipilih</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl shadow-sm p-6">
                        <p className="text-blue-100 text-sm mb-1">Rata-rata Nilai Keseluruhan</p>
                        <h2 className="text-4xl font-bold">{averages.overall.toFixed(2)}</h2>
                        <p className="text-blue-100 text-xs mt-2">{averages.count} pertemuan</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-xl shadow-sm p-6">
                        <p className="text-purple-100 text-sm mb-1">Rata-rata Robot Building</p>
                        <h2 className="text-4xl font-bold">{averages.robot.toFixed(2)}</h2>
                    </div>

                    <div className="bg-gradient-to-br from-orange-600 to-orange-700 text-white rounded-xl shadow-sm p-6">
                        <p className="text-orange-100 text-sm mb-1">Rata-rata Coding</p>
                        <h2 className="text-4xl font-bold">{averages.coding.toFixed(2)}</h2>
                    </div>
                </div>

                {/* Add Entry Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                <i className="bi bi-plus-circle text-teal-600 mr-2" />
                                Tambah Pertemuan Baru
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Pilih Modul</label>
                                    <select
                                        value={selectedModuleId}
                                        onChange={e => setSelectedModuleId(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    >
                                        <option value="">-- Pilih Modul --</option>
                                        {modules.map(m => (
                                            <option key={m.id} value={m.id}>
                                                {m.name} ({m.module_type === 'robot' ? 'Robot Building' : 'Coding'})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nomor Pertemuan</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={meetingNumber}
                                        onChange={e => setMeetingNumber(e.target.value)}
                                        placeholder={String(gradeEntries.length > 0 ? Math.max(...gradeEntries.map(e => e.meetingNumber)) + 1 : 1)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tanggal Pertemuan</label>
                                    <input
                                        type="date"
                                        value={meetingDate}
                                        onChange={e => setMeetingDate(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Catatan</label>
                                    <textarea
                                        value={notes}
                                        onChange={e => setNotes(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none h-16"
                                    />
                                </div>

                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-700">
                                        <i className="bi bi-info-circle mr-1" />
                                        Kategori: {moduleType === 5
                                            ? 'Fokus, Robot Building, Tools Mgmt, Interaksi, Koding'
                                            : 'Fokus, Tools Management, Interaksi, Koding'}
                                    </p>
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <button
                                        onClick={addGradeEntry}
                                        disabled={!selectedModuleId}
                                        className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Lanjut Input Nilai
                                    </button>
                                    <button
                                        onClick={() => setShowForm(false)}
                                        className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Grades Table */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-8">
                    {gradeEntries.length === 0 ? (
                        <div className="p-8 text-center">
                            <i className="bi bi-inbox text-4xl text-gray-300 block mb-3" />
                            <p className="text-gray-600">Belum ada data nilai. Mulai input nilai pertemuan pertama.</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-100">
                                        <th className="text-left px-6 py-4 font-semibold text-gray-700">Pertemuan</th>
                                        <th className="text-left px-6 py-4 font-semibold text-gray-700">Modul</th>
                                        <th className="text-center px-3 py-4 font-semibold text-gray-700 text-sm">Tipe</th>
                                        {categoriesType5.map(cat => (
                                            <th key={cat} className="text-center px-3 py-4 font-semibold text-gray-700 text-sm">
                                                {getCategoryLabel(cat)}
                                            </th>
                                        ))}
                                        <th className="text-center px-6 py-4 font-semibold text-gray-700">Rata-rata</th>
                                        <th className="text-center px-4 py-4 font-semibold text-gray-700">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {gradeEntries.map((entry, idx) => (
                                        <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">
                                                <div>
                                                    <div>#{entry.meetingNumber}</div>
                                                    <p className="text-xs text-gray-400 opacity-60">{entry.date}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-gray-900">{entry.moduleName}</p>
                                                <p className="text-xs text-gray-500">Type {entry.moduleType}</p>
                                            </td>
                                            <td className="px-3 py-4 text-center">
                                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                                                    {entry.moduleType}
                                                </span>
                                            </td>
                                            {categoriesType5.map(cat => {
                                                const isEditable = getCategories(entry.moduleType).includes(cat);
                                                return (
                                                    <td key={cat} className="px-3 py-4 text-center">
                                                        {isEditable ? (
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                max="5"
                                                                step="0.1"
                                                                value={entry.grades[cat] ?? ''}
                                                                onChange={e => updateGrade(entry.id, cat, parseFloat(e.target.value) || 0)}
                                                                className="w-12 border border-gray-200 rounded px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                            />
                                                        ) : (
                                                            <span className="text-gray-300">-</span>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                            <td className="px-6 py-4 text-center">
                                                <p className="text-lg font-bold text-teal-600">{entry.average.toFixed(2)}</p>
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <button
                                                    onClick={() => deleteEntry(entry.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <i className="bi bi-trash-fill" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Chart Overview - 3 Diagram Batang Vertical */}
                {gradeEntries.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 mb-8">
                        <h3 className="font-bold text-gray-900 mb-8 flex items-center gap-2">
                            <i className="bi bi-bar-chart text-teal-600" />
                            Diagram Batang
                        </h3>

                        {/* Main Category Chart */}
                        <div className="mb-12">
                            <div className="flex items-end justify-center gap-4 h-64">
                                {getCategories(5).map(cat => {
                                    const categoryValues = gradeEntries
                                        .filter(e => e.moduleType === 5)
                                        .map(e => e.grades[cat] || 0);
                                    const avgValue = categoryValues.length > 0 
                                        ? categoryValues.reduce((a, b) => a + b, 0) / categoryValues.length 
                                        : 0;
                                    const percentage = (avgValue / 5) * 100;
                                    const barHeight = (avgValue / 5) * 200;

                                    return (
                                        <div key={cat} className="flex flex-col items-center gap-2">
                                            <div
                                                className="w-16 rounded-t-lg transition-all duration-300"
                                                style={{
                                                    height: `${barHeight}px`,
                                                    backgroundColor: getCategoryColor(cat),
                                                }}
                                                title={`${getCategoryLabel(cat)}: ${avgValue.toFixed(0)}%`}
                                            />
                                            <span className="text-sm font-semibold text-gray-700">{percentage.toFixed(0)}%</span>
                                            <span className="text-xs text-gray-600 text-center max-w-16">
                                                {getCategoryLabel(cat)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="text-center mt-4 text-sm text-gray-600">
                                Rata-rata Per Kategori (Type 5)
                            </div>
                        </div>

                        {/* Per Category Details */}
                        <div className="pt-8 border-t border-gray-200">
                            <h4 className="font-semibold text-gray-900 mb-6">Rata-rata Per Kategori</h4>
                            <div className="space-y-4">
                                {getCategories(5).map(cat => {
                                    const categoryValues = gradeEntries
                                        .filter(e => e.moduleType === 5)
                                        .map(e => e.grades[cat] || 0);
                                    const avgValue = categoryValues.length > 0 
                                        ? categoryValues.reduce((a, b) => a + b, 0) / categoryValues.length 
                                        : 0;
                                    const percentage = (avgValue / 5) * 100;

                                    return (
                                        <div key={cat}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                    <i className="bi bi-square-fill text-sm" style={{ color: getCategoryColor(cat) }} />
                                                    {getCategoryLabel(cat)}
                                                </span>
                                                <span className="text-sm font-bold text-gray-900">{percentage.toFixed(0)}%</span>
                                            </div>
                                            <div className="w-full h-6 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full transition-all duration-300 rounded-full"
                                                    style={{
                                                        width: `${percentage}%`,
                                                        backgroundColor: getCategoryColor(cat),
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 flex items-center justify-center gap-2"
                    >
                        <i className="bi bi-plus-lg" /> Tambah Pertemuan
                    </button>
                    <Link
                        href="/tutor"
                        className="flex-1 text-center px-6 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                    >
                        <i className="bi bi-arrow-left mr-2" /> Kembali
                    </Link>
                </div>
            </div>
        </div>
    );
}
