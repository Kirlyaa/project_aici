import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

interface GradeEntry {
    id: number;
    meetingNumber: number;
    moduleName: string;
    moduleType: 4 | 5;
    grades: Record<string, number>;
    average: number;
    date: string;
}

const categoriesType5 = ['interaksi', 'fokus', 'robot-building', 'tools-management', 'coding'];
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

export default function GradesManager({ studentId }: { studentId: number }) {
    const [gradeEntries, setGradeEntries] = useState<GradeEntry[]>([
        {
            id: 1,
            meetingNumber: 1,
            moduleName: 'Fantasy Zoo',
            moduleType: 5,
            grades: { interaksi: 4.4, fokus: 3.75, 'robot-building': 4.1, 'tools-management': 3.5, koding: 3.9 },
            average: 3.95,
            date: '2025-01-06'
        },
        {
            id: 2,
            meetingNumber: 2,
            moduleName: 'Robot Builder',
            moduleType: 4,
            grades: { fokus: 4.2, 'tools-management': 4.0, interaksi: 4.3, koding: 4.1 },
            average: 4.15,
            date: '2025-01-13'
        },
        {
            id: 3,
            meetingNumber: 3,
            moduleName: 'Fantasy Zoo',
            moduleType: 5,
            grades: { interaksi: 4.5, fokus: 4.0, 'robot-building': 4.3, 'tools-management': 3.8, koding: 4.2 },
            average: 4.16,
            date: '2025-01-20'
        },
        {
            id: 4,
            meetingNumber: 4,
            moduleName: 'Advanced Coding',
            moduleType: 5,
            grades: { interaksi: 4.3, fokus: 4.2, 'robot-building': 4.0, 'tools-management': 4.1, koding: 4.4 },
            average: 4.2,
            date: '2025-01-27'
        },
        {
            id: 5,
            meetingNumber: 5,
            moduleName: 'System Design',
            moduleType: 4,
            grades: { fokus: 4.4, 'tools-management': 4.3, interaksi: 4.2, koding: 4.5 },
            average: 4.35,
            date: '2025-02-03'
        },
        {
            id: 6,
            meetingNumber: 6,
            moduleName: 'Robot Builder',
            moduleType: 5,
            grades: { interaksi: 4.6, fokus: 4.3, 'robot-building': 4.5, 'tools-management': 4.2, koding: 4.4 },
            average: 4.4,
            date: '2025-02-10'
        },
        {
            id: 7,
            meetingNumber: 7,
            moduleName: 'Fantasy Zoo',
            moduleType: 4,
            grades: { fokus: 4.5, 'tools-management': 4.4, interaksi: 4.6, koding: 4.5 },
            average: 4.5,
            date: '2025-02-17'
        },
    ]);
    const [moduleType, setModuleType] = useState<4 | 5>(5);
    const [newModule, setNewModule] = useState('');
    const [showForm, setShowForm] = useState(false);

    const availableModules = [
        { name: 'Fantasy Zoo', type: 5 },
        { name: 'Robot Builder', type: 4 },
        { name: 'Advanced Coding', type: 5 },
        { name: 'System Design', type: 4 },
    ];

    const getCategories = (type: 4 | 5) => type === 5 ? categoriesType5 : categoriesType4;

    const updateGrade = (entryId: number, category: string, value: number) => {
        const updated = gradeEntries.map(e => {
            if (e.id === entryId) {
                const newGrades = { ...e.grades, [category]: Math.max(0, Math.min(5, value)) };
                const grades = Object.values(newGrades);
                const newAverage = Math.round((grades.reduce((a, b) => a + b, 0) / grades.length) * 100) / 100;
                return { ...e, grades: newGrades, average: newAverage };
            }
            return e;
        });
        setGradeEntries(updated);
    };

    const addGradeEntry = () => {
        if (!newModule.trim()) return;
        const module = availableModules.find(m => m.name === newModule);
        if (!module) return;

                const categories = getCategories(module.type as 4 | 5);
        const newEntry: GradeEntry = {
            id: Math.max(...gradeEntries.map(e => e.id), 0) + 1,
            meetingNumber: Math.max(...gradeEntries.map(e => e.meetingNumber), 0) + 1,
            moduleName: newModule,
            moduleType: module.type as 4 | 5,
            grades: Object.fromEntries(categories.map(c => [c, 0])),
            average: 0,
            date: new Date().toISOString().split('T')[0],
        };
        setGradeEntries([...gradeEntries, newEntry]);
        setNewModule('');
        setShowForm(false);
    };

    const deleteEntry = (id: number) => {
        setGradeEntries(gradeEntries.filter(e => e.id !== id));
    };

    // Calculate averages
    const allAverages = gradeEntries.map(e => e.average);
    const overallAverage = allAverages.length > 0 
        ? Math.round((allAverages.reduce((a, b) => a + b, 0) / allAverages.length) * 100) / 100 
        : 0;

    const type4Averages = gradeEntries
        .filter(e => e.moduleType === 4)
        .map(e => e.average);
    const type4Average = type4Averages.length > 0
        ? Math.round((type4Averages.reduce((a, b) => a + b, 0) / type4Averages.length) * 100) / 100
        : 0;

    const type5Averages = gradeEntries
        .filter(e => e.moduleType === 5)
        .map(e => e.average);
    const type5Average = type5Averages.length > 0
        ? Math.round((type5Averages.reduce((a, b) => a + b, 0) / type5Averages.length) * 100) / 100
        : 0;

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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Input Nilai Murid</h1>
                    <p className="text-gray-600">Input nilai per pertemuan dengan modul yang dipilih</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl shadow-sm p-6">
                        <p className="text-blue-100 text-sm mb-1">Rata-rata Nilai Keseluruhan</p>
                        <h2 className="text-4xl font-bold">{overallAverage.toFixed(2)}</h2>
                        <p className="text-blue-100 text-xs mt-2">{gradeEntries.length} pertemuan</p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-xl shadow-sm p-6">
                        <p className="text-purple-100 text-sm mb-1">Rata-rata Tipe 5 Nilai</p>
                        <h2 className="text-4xl font-bold">{type5Average.toFixed(2)}</h2>
                        <p className="text-purple-100 text-xs mt-2">{type5Averages.length} modul</p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-600 to-orange-700 text-white rounded-xl shadow-sm p-6">
                        <p className="text-orange-100 text-sm mb-1">Rata-rata Tipe 4 Nilai</p>
                        <h2 className="text-4xl font-bold">{type4Average.toFixed(2)}</h2>
                        <p className="text-orange-100 text-xs mt-2">{type4Averages.length} modul</p>
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
                                        value={newModule}
                                        onChange={e => {
                                            setNewModule(e.target.value);
                                            const mod = availableModules.find(m => m.name === e.target.value);
                                            if (mod) setModuleType(mod.type as 4 | 5);
                                        }}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    >
                                        <option value="">-- Pilih Modul --</option>
                                        {availableModules.map(m => (
                                            <option key={m.name} value={m.name}>
                                                {m.name} (Tipe {m.type})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-700">
                                        <i className="bi bi-info-circle mr-1" />
                                        Kategori: {moduleType === 5 
                                            ? 'Fokus, Robot Building, Coding Tools, Interaksi' 
                                            : 'Fokus, Tools Management, Interaksi, Koding'}
                                    </p>
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <button
                                        onClick={addGradeEntry}
                                        className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700"
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
                                        {getCategories(moduleType).map(cat => (
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
                                            {getCategories(entry.moduleType).map(cat => (
                                                <td key={cat} className="px-3 py-4 text-center">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max="5"
                                                        step="0.1"
                                                        value={entry.grades[cat]}
                                                        onChange={e => updateGrade(entry.id, cat, parseFloat(e.target.value))}
                                                        className="w-12 border border-gray-200 rounded px-2 py-1 text-center focus:outline-none focus:ring-2 focus:ring-teal-500"
                                                    />
                                                </td>
                                            ))}
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
                    <button className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2">
                        <i className="bi bi-floppy-fill" /> Simpan
                    </button>
                    <Link
                        href={`/tutor`}
                        className="flex-1 text-center px-6 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                    >
                        <i className="bi bi-arrow-left mr-2" /> Kembali
                    </Link>
                </div>
            </div>
        </div>
    );
}
