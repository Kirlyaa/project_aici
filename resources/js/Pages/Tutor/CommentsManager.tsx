import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import StudentLockBanner from '@/Components/StudentLockBanner';
import { useStudentLock, LockInfo } from '@/Hooks/useStudentLock';

interface Comment {
    id: number;
    semester: string;
    academic_year: number | null;
    systemComment: string | null;
    tutorComment: string | null;
    strengths: string | null;
    notes: string | null;
    adminNote: string | null;
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
    template: '',
};

export default function CommentsManager() {
    const { studentId, student, comments, templates, auth } = usePage().props as unknown as Props & { auth: any };
    const isSuperAdmin = auth?.user?.role === 'superadmin';

    const { lock } = useStudentLock({ studentId, page: 'comments' });
    const isReadOnly = lock?.locked === true;

    const [commentForm, setCommentForm] = useState({
        notes: '',
        admin_note: '',
    });

    const [selectedSemester] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    });
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({
        notes: '',
        admin_note: '',
    });

    const [showSystemTemplateForm, setShowSystemTemplateForm] = useState(false);
    const [editingTemplateId, setEditingTemplateId] = useState<number | null>(null);
    const [templateForm, setTemplateForm] = useState(emptyTemplateForm);

    const savePersonalComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentForm.notes.trim() && !commentForm.admin_note.trim()) return;

        router.post('/tutor/comments', {
            student_id: studentId,
            semester: selectedSemester,
            notes: commentForm.notes,
            admin_note: commentForm.admin_note,
        }, {
            onSuccess: () => setCommentForm({ notes: '', admin_note: '' }),
        });
    };

    const updateComment = (id: number) => {
        const comment = comments.find(c => c.id === id);
        if (!comment) return;

        router.post('/tutor/comments', {
            student_id: studentId,
            semester: comment.semester,
            notes: editForm.notes,
            admin_note: editForm.admin_note,
        }, {
            onSuccess: () => {
                setEditingId(null);
                setEditForm({ notes: '', admin_note: '' });
            },
        });
    };

    const deleteComment = (id: number) => {
        if (window.confirm('Yakin ingin menghapus komentar ini?')) {
            router.delete(`/tutor/comments/${id}`);
        }
    };

    const openTemplateCreate = () => {
        setEditingTemplateId(null);
        setTemplateForm(emptyTemplateForm);
        setShowSystemTemplateForm(true);
    };

    const openTemplateEdit = (t: Template) => {
        setEditingTemplateId(t.id);
        setTemplateForm({ grade_range: t.grade_range as (typeof GRADE_RANGES)[number], template: t.template });
        setShowSystemTemplateForm(true);
    };

    const saveTemplate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!templateForm.template.trim()) return;

        const payload = {
            grade_range: templateForm.grade_range,
            category: 'umum',
            template: templateForm.template,
        };

        if (editingTemplateId !== null) {
            router.put(`/tutor/comment-templates/${editingTemplateId}`, payload, {
                onSuccess: () => setShowSystemTemplateForm(false),
            });
        } else {
            router.post('/tutor/comment-templates', payload, {
                onSuccess: () => setShowSystemTemplateForm(false),
            });
        }
    };

    const deleteTemplate = (id: number) => {
        if (window.confirm('Yakin ingin menghapus template ini?')) {
            router.delete(`/tutor/comment-templates/${id}`);
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
                            <Link href={isSuperAdmin ? `/superadmin/students/${studentId}` : '/tutor'} className="text-gray-600 hover:text-gray-900">
                                <i className="bi bi-arrow-left text-xl" />
                            </Link>
                            <div>
                                <h1 className="font-bold text-lg">AICI</h1>
                                <p className="text-xs text-gray-500">Kelola Komentar: {student.name} {isSuperAdmin ? '(Mode SuperAdmin)' : ''}</p>
                            </div>
                        </div>
                        {isSuperAdmin && (
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/superadmin/students"
                                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition"
                                >
                                    Daftar Murid
                                </Link>
                                <Link
                                    href={`/superadmin/students/${studentId}/report`}
                                    className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition"
                                >
                                    Lihat Rapor
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Kelola Komentar Murid</h1>
                    <p className="text-gray-600">Komentar personal terstruktur (Analisis Umum, Kelebihan, Catatan) untuk {student.name}</p>
                </div>

                <StudentLockBanner lock={lock} studentName={student.name} />

                {/* Template Form Modal */}
                {showSystemTemplateForm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                {editingTemplateId !== null ? 'Edit Template' : 'Tambah Template Baru'}
                            </h3>

                            <form onSubmit={saveTemplate} className="space-y-4">
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

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
                    <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <i className="bi bi-chat-left-text text-orange-600" />
                        Tambah Komentar Personal
                    </h2>
                    <form onSubmit={savePersonalComment} className="space-y-4">
                        {/* Catatan & Rekomendasi */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                                <i className="bi bi-exclamation-triangle-fill text-amber-600" /> Catatan & Rekomendasi
                            </label>
                            <textarea
                                value={commentForm.notes}
                                onChange={e => setCommentForm({ ...commentForm, notes: e.target.value })}
                                placeholder="Catatan evaluasi atau hal yang perlu ditingkatkan di sesi berikutnya..."
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none h-20"
                            />
                        </div>

                        {/* Catatan ke Admin (hanya tutor & admin yang bisa lihat) */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                                <i className="bi bi-shield-lock-fill text-indigo-600" /> Catatan ke Admin
                                <span className="ml-1 px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[10px] font-medium">Tutor & Admin Only</span>
                            </label>
                            <textarea
                                value={commentForm.admin_note}
                                onChange={e => setCommentForm({ ...commentForm, admin_note: e.target.value })}
                                placeholder="Catatan khusus untuk admin (tidak terlihat oleh murid)..."
                                className="w-full border border-indigo-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-16 bg-indigo-50/30"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isReadOnly}
                            className="px-5 py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm shadow-sm"
                            title={isReadOnly ? 'Halaman dikunci oleh tutor lain (read-only)' : undefined}
                        >
                            <i className="bi bi-check-lg" /> Simpan Komentar
                        </button>
                    </form>
                    <p className="text-xs text-gray-500 mt-3">
                        <i className="bi bi-info-circle mr-1" />
                        Gunakan {'{modules}'} untuk nama modul, {'{average}'} untuk nilai, dan {'{student}'} untuk nama murid
                    </p>
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
                                                Range nilai: {template.grade_range === '<4' ? 'Di bawah 4' : template.grade_range === '4-4.99' ? '4 – 4.99' : '5 (Sempurna)'}
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

                {/* Comments List */}
                <div className="space-y-4">
                    {comments.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
                            <i className="bi bi-inbox text-4xl text-gray-300 block mb-3" />
                            <p className="text-gray-600">Belum ada komentar untuk murid ini.</p>
                        </div>
                    ) : (
                        comments.map(comment => (
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
                                                {comment.isSystemGenerated ? 'Komentar Sistem (Otomatis)' : 'Komentar Personal Tutor'}
                                            </p>
                                            {comment.lastUpdated && (
                                                <p className="text-xs text-gray-500">Diperbarui: {comment.lastUpdated}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {!comment.isSystemGenerated && editingId !== comment.id && (
                                            <button
                                                onClick={() => {
                                                    setEditingId(comment.id);
                                                    setEditForm({
                                                        notes: comment.notes ?? comment.tutorComment ?? '',
                                                        admin_note: comment.adminNote ?? '',
                                                    });
                                                }}
                                                disabled={isReadOnly}
                                                className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
                                                title={isReadOnly ? 'Halaman dikunci oleh tutor lain' : 'Edit'}
                                            >
                                                <i className="bi bi-pencil-fill text-sm" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteComment(comment.id)}
                                            disabled={isReadOnly}
                                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                            title={isReadOnly ? 'Halaman dikunci oleh tutor lain' : 'Hapus'}
                                        >
                                            <i className="bi bi-trash-fill" />
                                        </button>
                                    </div>
                                </div>

                                {/* System Comment */}
                                {comment.systemComment && (
                                    <div className="mb-3 p-3 bg-white/60 rounded-lg">
                                        <p className="text-xs font-semibold text-teal-700 mb-1">Komentar Sistem:</p>
                                        <p className="text-sm text-gray-700">{comment.systemComment}</p>
                                    </div>
                                )}

                                {editingId === comment.id ? (
                                    <div className="space-y-3 pt-2">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">Catatan & Rekomendasi:</label>
                                            <textarea
                                                value={editForm.notes}
                                                onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
                                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none h-16"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
                                                <i className="bi bi-shield-lock-fill text-indigo-600" /> Catatan ke Admin
                                                <span className="ml-1 px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[10px] font-medium">Tutor & Admin Only</span>
                                            </label>
                                            <textarea
                                                value={editForm.admin_note}
                                                onChange={e => setEditForm({ ...editForm, admin_note: e.target.value })}
                                                placeholder="Catatan khusus untuk admin..."
                                                className="w-full border border-indigo-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none h-14 bg-indigo-50/30"
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => updateComment(comment.id)}
                                                disabled={isReadOnly}
                                                className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                                                title={isReadOnly ? 'Halaman dikunci oleh tutor lain (read-only)' : undefined}
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
                                    /* Tutor Comment (Display Mode) */
                                    <div className="space-y-2">
                                        {/* Kekuatan (data lama) */}
                                        {comment.strengths && (
                                            <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-r-lg">
                                                <p className="text-xs font-bold text-green-800 mb-0.5 flex items-center gap-1">
                                                    <i className="bi bi-star-fill text-green-600" /> Kekuatan
                                                </p>
                                                <p className="text-xs text-gray-700">{comment.strengths}</p>
                                            </div>
                                        )}
                                        {/* Catatan (notes baru, atau tutor_comment lama sebagai fallback) */}
                                        {(comment.notes || comment.tutorComment) && (
                                            <div className="bg-[#fffdf2] border-l-4 border-amber-600 p-3 rounded-r-lg">
                                                <p className="text-xs font-bold text-amber-800 mb-0.5 flex items-center gap-1">
                                                    <i className="bi bi-exclamation-triangle-fill text-amber-600" /> Catatan & Rekomendasi
                                                </p>
                                                <p className="text-xs text-gray-700">{comment.notes || comment.tutorComment}</p>
                                            </div>
                                        )}
                                        {/* Catatan ke Admin */}
                                        {comment.adminNote && (
                                            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-3 rounded-r-lg">
                                                <p className="text-xs font-bold text-indigo-800 mb-0.5 flex items-center gap-1">
                                                    <i className="bi bi-shield-lock-fill text-indigo-600" /> Catatan ke Admin
                                                    <span className="ml-1 px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[10px] font-medium">Tutor & Admin Only</span>
                                                </p>
                                                <p className="text-xs text-gray-700">{comment.adminNote}</p>
                                            </div>
                                        )}
                                        {/* Jika benar-benar kosong */}
                                        {!comment.notes && !comment.tutorComment && !comment.strengths && !comment.adminNote && (
                                            <p className="text-xs text-gray-400 italic">Belum ada catatan personal.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
