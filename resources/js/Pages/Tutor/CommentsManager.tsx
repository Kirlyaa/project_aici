import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

interface Comment {
    id: number;
    type: 'personal' | 'system';
    text: string;
    date: string;
    semester: number;
}

interface SystemCommentTemplate {
    minValue: number;
    maxValue: number;
    text: string;
}

interface MonthData {
    month: number;
    modules: string[];
    averageGrade: number;
}

export default function CommentsManager({ studentId }: { studentId: number }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [selectedSemester, setSelectedSemester] = useState(1);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState('');
    const [showSystemTemplateForm, setShowSystemTemplateForm] = useState(false);
    const [editingTemplateIdx, setEditingTemplateIdx] = useState<number | null>(null);

    // System comment templates - bisa di edit per range nilai
    const [systemCommentTemplates, setSystemCommentTemplates] = useState<SystemCommentTemplate[]>([
        {
            minValue: 0,
            maxValue: 3.99,
            text: 'Pada bulan ini, fokus pada materi {modules}. Performa masih perlu ditingkatkan dengan nilai rata-rata {average}. Sarannya: Lebih aktif bertanya dan praktik lebih intensif.'
        },
        {
            minValue: 4.0,
            maxValue: 4.99,
            text: 'Bagus! Pada bulan ini mempelajari {modules}. Nilai rata-rata {average} menunjukkan kemajuan yang baik. Lanjutkan konsistensi ini.'
        },
        {
            minValue: 5.0,
            maxValue: 5.0,
            text: 'Excellent! Pada bulan ini menguasai {modules} dengan sempurna. Nilai {average} sangat memuaskan. Pertahankan dedikasi Anda!'
        },
    ]);
    const [newTemplate, setNewTemplate] = useState<SystemCommentTemplate>({ minValue: 0, maxValue: 0, text: '' });

    // Sample month data (tiap 3 bulan = 1 quarter)
    const monthsData: MonthData[] = [
        { month: 1, modules: ['Fantasy Zoo', 'Robot Basics'], averageGrade: 4.2 },
        { month: 2, modules: ['Fantasy Zoo', 'Robot Basics'], averageGrade: 4.3 },
        { month: 3, modules: ['Robot Builder', 'Advanced Coding'], averageGrade: 4.5 },
        { month: 4, modules: ['Robot Builder', 'Advanced Coding'], averageGrade: 4.6 },
        { month: 5, modules: ['Advanced Coding', 'System Design'], averageGrade: 4.8 },
        { month: 6, modules: ['System Design'], averageGrade: 5.0 },
    ];

    // Generate system comment berdasarkan template dan nilai
    const generateSystemComment = (monthData: MonthData): string => {
        const avg = monthData.averageGrade;
        const modules = monthData.modules.join(', ');

        const template = systemCommentTemplates.find(t => avg >= t.minValue && avg <= t.maxValue);
        if (!template) return '';

        return template.text
            .replace('{modules}', modules)
            .replace('{average}', avg.toFixed(2));
    };

    // Quarterly comment (tiap 3 bulan)
    const quarterlyMonths = selectedSemester === 1 ? [1, 2, 3] : [4, 5, 6];
    const quarterlyData = monthsData.filter(m => quarterlyMonths.includes(m.month));

    const addSystemComment = () => {
        const month = selectedSemester === 1 ? 3 : 6;
        const monthData = monthsData.find(m => m.month === month);
        if (!monthData) return;

        const systemText = generateSystemComment(monthData);
        if (!systemText) return;

        const comment: Comment = {
            id: Math.max(...comments.map(c => c.id), 0) + 1,
            type: 'system',
            text: systemText,
            date: new Date().toISOString().split('T')[0],
            semester: selectedSemester,
        };
        setComments([...comments, comment]);
    };

    const addPersonalComment = () => {
        if (!newComment.trim()) return;
        const comment: Comment = {
            id: Math.max(...comments.map(c => c.id), 0) + 1,
            type: 'personal',
            text: newComment,
            date: new Date().toISOString().split('T')[0],
            semester: selectedSemester,
        };
        setComments([...comments, comment]);
        setNewComment('');
    };

    const updateComment = (id: number) => {
        setComments(comments.map(c => c.id === id ? { ...c, text: editText } : c));
        setEditingId(null);
        setEditText('');
    };

    const deleteComment = (id: number) => {
        setComments(comments.filter(c => c.id !== id));
    };

    const addOrUpdateTemplate = () => {
        if (newTemplate.minValue > newTemplate.maxValue || !newTemplate.text.trim()) return;

        if (editingTemplateIdx !== null) {
            const updated = [...systemCommentTemplates];
            updated[editingTemplateIdx] = newTemplate;
            setSystemCommentTemplates(updated);
            setEditingTemplateIdx(null);
        } else {
            setSystemCommentTemplates([...systemCommentTemplates, newTemplate].sort((a, b) => a.minValue - b.minValue));
        }
        setNewTemplate({ minValue: 0, maxValue: 0, text: '' });
        setShowSystemTemplateForm(false);
    };

    const deleteTemplate = (idx: number) => {
        setSystemCommentTemplates(systemCommentTemplates.filter((_, i) => i !== idx));
    };

    const filteredComments = comments.filter(c => c.semester === selectedSemester);
    const hasSystemComment = filteredComments.some(c => c.type === 'system');

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Kelola Komentar" />

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
                                <p className="text-xs text-gray-500">Kelola Komentar</p>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Kelola Komentar Murid</h1>
                    <p className="text-gray-600">Customize komentar sistem dan tambahkan komentar personal per semester (3 bulan)</p>
                </div>

                {/* System Comment Templates Section */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-gray-900 flex items-center gap-2">
                            <i className="bi bi-gear text-blue-600" />
                            Atur Template Komentar Sistem
                        </h2>
                        <button
                            onClick={() => {
                                setShowSystemTemplateForm(true);
                                setEditingTemplateIdx(null);
                                setNewTemplate({ minValue: 0, maxValue: 0, text: '' });
                            }}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 flex items-center gap-1"
                        >
                            <i className="bi bi-plus-lg" /> Tambah Template
                        </button>
                    </div>

                    <div className="space-y-3">
                        {systemCommentTemplates.map((template, idx) => (
                            <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-900">
                                            Nilai {template.minValue.toFixed(1)} - {template.maxValue.toFixed(1)}
                                        </p>
                                        <p className="text-sm text-gray-700 mt-1">{template.text}</p>
                                    </div>
                                    <div className="flex gap-1 ml-2">
                                        <button
                                            onClick={() => {
                                                setEditingTemplateIdx(idx);
                                                setNewTemplate(template);
                                                setShowSystemTemplateForm(true);
                                            }}
                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                        >
                                            <i className="bi bi-pencil-fill text-sm" />
                                        </button>
                                        <button
                                            onClick={() => deleteTemplate(idx)}
                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                        >
                                            <i className="bi bi-trash-fill text-sm" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="text-xs text-gray-600 mt-3">
                        <i className="bi bi-info-circle mr-1" />
                        Gunakan {'{modules}'} untuk nama modul dan {'{average}'} untuk nilai rata-rata
                    </p>
                </div>

                {/* Template Form Modal */}
                {showSystemTemplateForm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                {editingTemplateIdx !== null ? 'Edit Template' : 'Tambah Template Baru'}
                            </h3>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Nilai Min</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="5"
                                            step="0.1"
                                            value={newTemplate.minValue}
                                            onChange={e => setNewTemplate({ ...newTemplate, minValue: parseFloat(e.target.value) })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Nilai Max</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="5"
                                            step="0.1"
                                            value={newTemplate.maxValue}
                                            onChange={e => setNewTemplate({ ...newTemplate, maxValue: parseFloat(e.target.value) })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Template Komentar</label>
                                    <textarea
                                        value={newTemplate.text}
                                        onChange={e => setNewTemplate({ ...newTemplate, text: e.target.value })}
                                        placeholder="Gunakan {modules} dan {average} sebagai placeholder"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24"
                                    />
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <button
                                        onClick={addOrUpdateTemplate}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                                    >
                                        {editingTemplateIdx !== null ? 'Update' : 'Tambah'}
                                    </button>
                                    <button
                                        onClick={() => setShowSystemTemplateForm(false)}
                                        className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Semester Selector */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {[1, 2].map(sem => (
                        <button
                            key={sem}
                            onClick={() => setSelectedSemester(sem)}
                            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                                selectedSemester === sem
                                    ? 'bg-teal-600 text-white'
                                    : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                        >
                            Semester {sem}
                            <span className="text-xs ml-1">
                                ({sem === 1 ? 'Bulan 1-3' : 'Bulan 4-6'})
                            </span>
                        </button>
                    ))}
                </div>

                {/* Quarterly Overview */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <i className="bi bi-calendar3 text-blue-600" />
                        Ringkasan Semester {selectedSemester}
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        {quarterlyData.map(m => (
                            <div key={m.month} className="p-3 bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg border border-blue-200">
                                <p className="font-semibold text-gray-900 text-sm">Bulan {m.month}</p>
                                <p className="text-xs text-gray-600 mt-1">Modul:</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {m.modules.map((mod, idx) => (
                                        <span key={idx} className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded">
                                            {mod}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-sm font-bold text-blue-600 mt-2">Rata-rata: {m.averageGrade.toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Add System Comment */}
                {!hasSystemComment && (
                    <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-6">
                        <p className="text-sm text-gray-700 mb-3">
                            <i className="bi bi-info-circle text-teal-600 mr-2" />
                            Sistem akan generate komentar otomatis berdasarkan template dan performa semester ini.
                        </p>
                        <button
                            onClick={addSystemComment}
                            className="px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 flex items-center gap-2 text-sm"
                        >
                            <i className="bi bi-plus-lg" /> Generate Komentar Sistem
                        </button>
                    </div>
                )}

                {/* Add Personal Comment */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
                    <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <i className="bi bi-chat-left-text text-orange-600" />
                        Tambah Komentar Personal
                    </h2>
                    <form onSubmit={e => (e.preventDefault(), addPersonalComment())} className="space-y-4">
                        <textarea
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            placeholder="Tulis komentar pribadi tentang perkembangan murid..."
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 h-24 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 flex items-center gap-2"
                        >
                            <i className="bi bi-check-lg" /> Simpan Komentar Personal
                        </button>
                    </form>
                </div>

                {/* Comments List */}
                <div className="space-y-4">
                    {filteredComments.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
                            <i className="bi bi-inbox text-4xl text-gray-300 block mb-3" />
                            <p className="text-gray-600">Belum ada komentar untuk semester ini.</p>
                        </div>
                    ) : (
                        filteredComments.map(comment => (
                            <div key={comment.id} className={`rounded-xl border shadow-sm p-6 ${
                                comment.type === 'system'
                                    ? 'bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200'
                                    : 'bg-white border-gray-100'
                            }`}>
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <i className={`bi ${comment.type === 'system' ? 'bi-robot' : 'bi-chat-left-quote'} ${
                                            comment.type === 'system' ? 'text-teal-600' : 'text-orange-600'
                                        } text-lg`} />
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">
                                                {comment.type === 'system' ? 'Komentar Sistem (Otomatis)' : 'Komentar Personal'}
                                            </p>
                                            {comment.type === 'system' && (
                                                <p className="text-xs text-teal-600">
                                                    Dihasilkan berdasarkan performa bulan ini
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-500">{comment.date}</span>
                                </div>

                                {editingId === comment.id ? (
                                    <div className="space-y-3">
                                        <textarea
                                            value={editText}
                                            onChange={e => setEditText(e.target.value)}
                                            className="w-full border border-gray-200 rounded-lg px-4 py-3 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => updateComment(comment.id)}
                                                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center gap-2 text-sm"
                                            >
                                                <i className="bi bi-check-lg" /> Simpan
                                            </button>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="flex-1 px-3 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 flex items-center justify-center gap-2 text-sm"
                                            >
                                                <i className="bi bi-x-lg" /> Batal
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-gray-700 mb-4">{comment.text}</p>
                                        {comment.type === 'personal' && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingId(comment.id);
                                                        setEditText(comment.text);
                                                    }}
                                                    className="px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium flex items-center gap-1"
                                                >
                                                    <i className="bi bi-pencil-fill" /> Edit
                                                </button>
                                                <button
                                                    onClick={() => deleteComment(comment.id)}
                                                    className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium flex items-center gap-1"
                                                >
                                                    <i className="bi bi-trash-fill" /> Hapus
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Back Button */}
                <div className="mt-8">
                    <Link
                        href={`/tutor`}
                        className="block text-center px-6 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                    >
                        <i className="bi bi-arrow-left mr-2" /> Kembali ke Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
