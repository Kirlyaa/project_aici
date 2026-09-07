import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface Comment {
    id: number;
    semester: string;
    academic_year: number | null;
    systemComment: string | null;
    tutorComment: string | null;
    averageGrade: number | null;
    moduleNames: string[] | null;
    isSystemGenerated: boolean;
    lastUpdated: string | null;
}

interface Template {
    id: number;
    grade_range: string;
    category: string;
    template: string;
}

interface Props {
    studentId: number;
    student: { id: number; name: string; email: string };
    comments: Comment[];
    templates: Template[];
}

const GRADE_RANGES = ['<4', '4-4.99', '5'] as const;

const emptyTemplateForm = {
    grade_range: '<4' as (typeof GRADE_RANGES)[number],
    category: 'umum',
    template: '',
};

export default function CommentsManager() {
    const { studentId, student, comments, templates } = usePage().props as unknown as Props;

    const [newComment, setNewComment] = useState('');
    const [selectedSemester, setSelectedSemester] = useState('2026-01');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState('');
    const [showSystemTemplateForm, setShowSystemTemplateForm] = useState(false);
    const [editingTemplateId, setEditingTemplateId] = useState<number | null>(null);
    const [templateForm, setTemplateForm] = useState(emptyTemplateForm);

    const filteredComments = comments.filter(c => c.semester === selectedSemester);
    const semesterComment = filteredComments[0];
    const hasSystemComment = filteredComments.some(c => c.isSystemGenerated);

    const savePersonalComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        router.post('/comments', {
            student_id: studentId,
            semester: selectedSemester,
            tutor_comment: newComment,
        }, {
            onSuccess: () => setNewComment(''),
        });
    };

    const generateSystemComment = () => {
        router.post(`/comments/generate/${studentId}/${selectedSemester}`);
    };

    const updateComment = (id: number) => {
        const comment = comments.find(c => c.id === id);
        if (!comment) return;

        router.post('/comments', {
            student_id: studentId,
            semester: comment.semester,
            tutor_comment: editText,
        }, {
            onSuccess: () => {
                setEditingId(null);
                setEditText('');
            },
        });
    };

    const deleteComment = (id: number) => {
        if (window.confirm('Yakin ingin menghapus komentar ini?')) {
            router.delete(`/comments/${id}`);
        }
    };

    const openTemplateCreate = () => {
        setEditingTemplateId(null);
        setTemplateForm(emptyTemplateForm);
        setShowSystemTemplateForm(true);
    };

    const openTemplateEdit = (t: Template) => {
        setEditingTemplateId(t.id);
        setTemplateForm({ grade_range: t.grade_range as (typeof GRADE_RANGES)[number], category: t.category, template: t.template });
        setShowSystemTemplateForm(true);
    };

    const saveTemplate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!templateForm.template.trim()) return;

        if (editingTemplateId !== null) {
            router.put(`/comment-templates/${editingTemplateId}`, templateForm, {
                onSuccess: () => setShowSystemTemplateForm(false),
            });
        } else {
            router.post('/comment-templates', templateForm, {
                onSuccess: () => setShowSystemTemplateForm(false),
            });
        }
    };

    const deleteTemplate = (id: number) => {
        if (window.confirm('Yakin ingin menghapus template ini?')) {
            router.delete(`/comment-templates/${id}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Kelola Komentar" />

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <Link href="/tutor" className="text-gray-600 hover:text-gray-900">
                                <i className="bi bi-arrow-left text-xl" />
                            </Link>
                            <div>
                                <h1 className="font-bold text-lg">AICI</h1>
                                <p className="text-xs text-gray-500">Kelola Komentar: {student.name}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Kelola Komentar Murid</h1>
                    <p className="text-gray-600">Komentar sistem otomatis per semester (YYYY-MM) + komentar personal tutor</p>
                </div>

                {/* System Comment Templates Section */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-gray-900 flex items-center gap-2">
                            <i className="bi bi-gear text-blue-600" />
                            Atur Template Komentar Sistem
                        </h2>
                        <button
                            onClick={openTemplateCreate}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 flex items-center gap-1"
                        >
                            <i className="bi bi-plus-lg" /> Tambah Template
                        </button>
                    </div>

                    <div className="space-y-3">
                        {templates.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">Belum ada template.</p>
                        ) : (
                            templates.map(template => (
                                <div key={template.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-gray-900">
                                                Range nilai: {template.grade_range} · {template.category}
                                            </p>
                                            <p className="text-sm text-gray-700 mt-1">{template.template}</p>
                                        </div>
                                        <div className="flex gap-1 ml-2">
                                            <button
                                                onClick={() => openTemplateEdit(template)}
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                            >
                                                <i className="bi bi-pencil-fill text-sm" />
                                            </button>
                                            <button
                                                onClick={() => deleteTemplate(template.id)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <i className="bi bi-trash-fill text-sm" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <p className="text-xs text-gray-600 mt-3">
                        <i className="bi bi-info-circle mr-1" />
                        Gunakan {'{modules}'} untuk nama modul, {'{average}'} untuk nilai, dan {'{student}'} untuk nama murid
                    </p>
                </div>

                {/* Template Form Modal */}
                {showSystemTemplateForm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                {editingTemplateId !== null ? 'Edit Template' : 'Tambah Template Baru'}
                            </h3>

                            <form onSubmit={saveTemplate} className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Range Nilai</label>
                                        <select
                                            value={templateForm.grade_range}
                                            onChange={e => setTemplateForm({ ...templateForm, grade_range: e.target.value as (typeof GRADE_RANGES)[number] })}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {GRADE_RANGES.map(r => (
                                                <option key={r} value={r}>{r === '<4' ? 'Di bawah 4' : r === '4-4.99' ? '4 - 4.99' : '5 (Sempurna)'}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori</label>
                                        <input
                                            type="text"
                                            value={templateForm.category}
                                            onChange={e => setTemplateForm({ ...templateForm, category: e.target.value })}
                                            placeholder="umum"
                                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Template Komentar</label>
                                    <textarea
                                        value={templateForm.template}
                                        onChange={e => setTemplateForm({ ...templateForm, template: e.target.value })}
                                        placeholder="Gunakan {modules}, {average}, dan {student} sebagai placeholder"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24"
                                        required
                                    />
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                                    >
                                        {editingTemplateId !== null ? 'Update' : 'Tambah'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowSystemTemplateForm(false)}
                                        className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Semester Selector */}
                <div className="flex gap-2 mb-6 items-center flex-wrap">
                    <label className="text-sm font-semibold text-gray-700">Semester (YYYY-MM):</label>
                    <input
                        type="month"
                        value={selectedSemester}
                        onChange={e => setSelectedSemester(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                </div>

                {/* Semester Overview */}
                {semesterComment && (semesterComment.averageGrade !== null || (semesterComment.moduleNames?.length ?? 0) > 0) && (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <i className="bi bi-calendar3 text-blue-600" />
                            Ringkasan Semester {selectedSemester}
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-4 bg-gradient-to-br from-blue-50 to-teal-50 rounded-lg border border-blue-200">
                                <p className="text-sm text-gray-600">Rata-rata Nilai</p>
                                <p className="text-3xl font-bold text-blue-600">{(semesterComment.averageGrade ?? 0).toFixed(2)}</p>
                            </div>
                            <div className="p-4 bg-gradient-to-br from-teal-50 to-blue-50 rounded-lg border border-teal-200">
                                <p className="text-sm text-gray-600 mb-1">Modul Dipelajari</p>
                                <div className="flex flex-wrap gap-1">
                                    {(semesterComment.moduleNames ?? []).map((m, i) => (
                                        <span key={i} className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded">{m}</span>
                                    ))}
                                    {(semesterComment.moduleNames?.length ?? 0) === 0 && (
                                        <span className="text-xs text-gray-500">-</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add System Comment */}
                {!hasSystemComment && (
                    <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-6">
                        <p className="text-sm text-gray-700 mb-3">
                            <i className="bi bi-info-circle text-teal-600 mr-2" />
                            Sistem akan generate komentar otomatis dari nilai bulan ini + template.
                        </p>
                        <button
                            onClick={generateSystemComment}
                            className="px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 flex items-center gap-2 text-sm"
                        >
                            <i className="bi bi-magic" /> Generate Komentar Sistem
                        </button>
                    </div>
                )}

                {/* Add Personal Comment */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
                    <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <i className="bi bi-chat-left-text text-orange-600" />
                        Tambah Komentar Personal
                    </h2>
                    <form onSubmit={savePersonalComment} className="space-y-4">
                        <textarea
                            value={newComment}
                            onChange={e => setNewComment(e.target.value)}
                            placeholder="Tulis komentar pribadi tentang perkembangan murid..."
                            className="w-full border border-gray-200 rounded-lg px-4 py-3 h-24 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                            required
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
                                comment.isSystemGenerated
                                    ? 'bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200'
                                    : 'bg-white border-gray-100'
                            }`}>
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <i className={`bi ${comment.isSystemGenerated ? 'bi-robot' : 'bi-chat-left-quote'} ${
                                            comment.isSystemGenerated ? 'text-teal-600' : 'text-orange-600'
                                        } text-lg`} />
                                        <div>
                                            <p className="font-bold text-gray-900 text-sm">
                                                {comment.isSystemGenerated ? 'Komentar Sistem (Otomatis)' : 'Komentar Personal'}
                                            </p>
                                            {comment.lastUpdated && (
                                                <p className="text-xs text-gray-500">Diperbarui: {comment.lastUpdated}</p>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteComment(comment.id)}
                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Hapus"
                                    >
                                        <i className="bi bi-trash-fill" />
                                    </button>
                                </div>

                                {/* System Comment */}
                                {comment.systemComment && (
                                    <div className="mb-3 p-3 bg-white/60 rounded-lg">
                                        <p className="text-xs font-semibold text-teal-700 mb-1">Komentar Sistem:</p>
                                        <p className="text-sm text-gray-700">{comment.systemComment}</p>
                                    </div>
                                )}

                                {/* Tutor Comment */}
                                {comment.tutorComment && (
                                    editingId === comment.id ? (
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
                                        <div className="flex items-start justify-between gap-3">
                                            <p className="text-sm text-gray-700">{comment.tutorComment}</p>
                                            <button
                                                onClick={() => {
                                                    setEditingId(comment.id);
                                                    setEditText(comment.tutorComment ?? '');
                                                }}
                                                className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg shrink-0"
                                                title="Edit"
                                            >
                                                <i className="bi bi-pencil-fill text-sm" />
                                            </button>
                                        </div>
                                    )
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
