import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { sessions as defaultSessions } from '@/data/sessions';
import { SessionItem, SessionStatus } from '@/types/session';

const statusBadge: Record<SessionStatus, string> = {
    hadir:         'bg-green-100 text-green-700',
    absen:         'bg-red-100 text-red-700',
    reschedule:    'bg-yellow-100 text-yellow-700',
    libur:         'bg-orange-100 text-orange-700',
    'akan-datang': 'bg-blue-100 text-blue-700',
};

export default function TutorSessions() {
    const [sessions, setSessions] = useState<SessionItem[]>(defaultSessions);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleDelete = (id: number) => {
        setSessions(prev => prev.filter(s => s.id !== id));
        setDeleteId(null);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Kelola Sesi" />

            {/* Tutor Navbar */}
            <nav className="bg-teal-700 text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <i className="bi bi-cpu-fill" />
                    </div>
                    <span className="font-bold text-lg">AICI</span>
                    <span className="text-teal-200 text-sm">/ Tutor Panel</span>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/tutor/sessions" className="text-sm text-white font-medium border-b border-white pb-0.5">Sesi</Link>
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <i className="bi bi-person-fill" />
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Kelola Sesi</h1>
                        <p className="text-gray-500 text-sm mt-1">{sessions.length} sesi terdaftar</p>
                    </div>
                    <Link
                        href="/tutor/sessions/create"
                        className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors"
                    >
                        <i className="bi bi-plus-lg" /> Tambah Sesi
                    </Link>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-5 py-3 font-semibold text-gray-600">#</th>
                                <th className="text-left px-5 py-3 font-semibold text-gray-600">Judul Sesi</th>
                                <th className="text-left px-5 py-3 font-semibold text-gray-600 hidden md:table-cell">Tanggal</th>
                                <th className="text-left px-5 py-3 font-semibold text-gray-600 hidden lg:table-cell">Modul</th>
                                <th className="text-left px-5 py-3 font-semibold text-gray-600">Status</th>
                                <th className="text-right px-5 py-3 font-semibold text-gray-600">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.map((session, idx) => (
                                <tr key={session.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    <td className="px-5 py-3 text-gray-400">{idx + 1}</td>
                                    <td className="px-5 py-3 font-medium text-gray-900">{session.title}</td>
                                    <td className="px-5 py-3 text-gray-600 hidden md:table-cell">{session.date}</td>
                                    <td className="px-5 py-3 text-gray-500 hidden lg:table-cell truncate max-w-xs">{session.module}</td>
                                    <td className="px-5 py-3">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusBadge[session.status]}`}>
                                            {session.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/tutor/sessions/${session.id}/edit`}
                                                className="p-1.5 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <i className="bi bi-pencil-fill" />
                                            </Link>
                                            <button
                                                onClick={() => setDeleteId(session.id)}
                                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Hapus"
                                            >
                                                <i className="bi bi-trash-fill" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirm Modal */}
            {deleteId !== null && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="bi bi-exclamation-triangle-fill text-red-500 text-xl" />
                        </div>
                        <h3 className="font-bold text-gray-900 text-center text-lg mb-2">Hapus Sesi?</h3>
                        <p className="text-gray-500 text-sm text-center mb-6">
                            Sesi <strong>{sessions.find(s => s.id === deleteId)?.title}</strong> akan dihapus permanen.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={() => handleDelete(deleteId)}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
