import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface TutorInfo {
    id: number;
    name: string;
    email: string;
    status: string;
    avatar: string;
    terdaftar: string | null;
}

interface AssignedStudent {
    id: number;
    name: string;
    email: string;
    avatar: string;
    status: string;
    class: string;
    sessions_count: number;
}

interface AvailableStudent {
    id: number;
    name: string;
    email: string;
    current_tutor: string | null;
    class: string;
}

interface SessionItem {
    id: number;
    title: string;
    date: string | null;
    date_raw: string | null;
    status: string;
    student_id: number;
    student_name: string;
    class: string;
    modules: string;
}

interface TutorDetailProps {
    tutor: TutorInfo;
    stats: {
        total_students: number;
        total_sessions: number;
        hadir_count: number;
        absen_count: number;
        akan_datang_count: number;
    };
    assignedStudents: AssignedStudent[];
    availableStudents: AvailableStudent[];
    recentSessions: SessionItem[];
}

const statusBadge: Record<string, string> = {
    hadir: 'bg-green-100 text-green-700',
    absen: 'bg-red-100 text-red-700',
    libur: 'bg-orange-100 text-orange-700',
    'akan-datang': 'bg-blue-100 text-blue-700',
};

export default function TutorDetail({
    tutor,
    stats,
    assignedStudents,
    availableStudents,
    recentSessions,
}: TutorDetailProps) {
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [searchStudent, setSearchStudent] = useState('');
    const [searchSession, setSearchSession] = useState('');

    const handleAssign = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStudentId) return;

        router.post(`/superadmin/tutors/${tutor.id}/assign-student`, {
            student_id: selectedStudentId,
        }, {
            onSuccess: () => {
                setShowAssignModal(false);
                setSelectedStudentId('');
            },
        });
    };

    const handleRemoveStudent = (student: AssignedStudent) => {
        if (confirm(`Yakin ingin melepas bimbingan murid "${student.name}" dari Tutor ${tutor.name}?`)) {
            router.delete(`/superadmin/tutors/${tutor.id}/students/${student.id}/remove`);
        }
    };

    const filteredStudents = assignedStudents.filter(s =>
        s.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
        s.email.toLowerCase().includes(searchStudent.toLowerCase()) ||
        s.class.toLowerCase().includes(searchStudent.toLowerCase())
    );

    const filteredSessions = recentSessions.filter(s =>
        s.title.toLowerCase().includes(searchSession.toLowerCase()) ||
        s.student_name.toLowerCase().includes(searchSession.toLowerCase()) ||
        s.class.toLowerCase().includes(searchSession.toLowerCase()) ||
        (s.date && s.date.toLowerCase().includes(searchSession.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <Head title={`Detail Tutor: ${tutor.name}`} />

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <Link href="/superadmin/tutors" className="text-gray-600 hover:text-gray-900 mr-1" title="Kembali ke Kelola Tutor">
                                <i className="bi bi-arrow-left text-xl" />
                            </Link>
                            <img
                                src="/images/logo-aici.png"
                                alt="AICI Logo"
                                className="h-8 w-auto object-contain"
                            />
                            <div className="border-l border-gray-300 pl-3">
                                <p className="text-xs font-semibold text-gray-600">Detail & Pengaturan Tutor</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowAssignModal(true)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                            >
                                <i className="bi bi-person-plus-fill" /> Tugaskan Murid Baru
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Hero Banner */}
                <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-800 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex items-start gap-4">
                            <img
                                src={tutor.avatar}
                                alt={tutor.name}
                                className="w-16 h-16 rounded-2xl object-cover border-2 border-white/30 shadow"
                            />
                            <div>
                                <div className="flex items-center gap-2.5 flex-wrap">
                                    <h1 className="text-2xl sm:text-3xl font-bold">{tutor.name}</h1>
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                                        tutor.status === 'aktif'
                                            ? 'bg-green-500/20 text-green-300 border border-green-400/30'
                                            : 'bg-red-500/20 text-red-300 border border-red-400/30'
                                    }`}>
                                        {tutor.status}
                                    </span>
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-teal-200 border border-white/20">
                                        Peran: Tutor Pengajar
                                    </span>
                                </div>
                                <p className="text-teal-100 text-sm mt-1">{tutor.email}</p>
                                <div className="flex items-center gap-4 text-xs text-teal-200/80 mt-3">
                                    <span><i className="bi bi-calendar3 mr-1" /> Terdaftar: {tutor.terdaftar || '-'}</span>
                                    <span><i className="bi bi-people-fill mr-1" /> {stats.total_students} Murid Binaan</span>
                                    <span><i className="bi bi-clock-history mr-1" /> {stats.total_sessions} Sesi Ditutori</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link
                                href={`/superadmin/calendar/tutors/${tutor.id}`}
                                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-sm border border-white/20 shadow transition flex items-center gap-2"
                            >
                                <i className="bi bi-calendar3" /> Kalender Tutor
                            </Link>
                            <button
                                onClick={() => setShowAssignModal(true)}
                                className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-gray-900 font-semibold rounded-xl text-sm shadow transition flex items-center gap-2"
                            >
                                <i className="bi bi-plus-circle-fill" /> Tambah Murid Binaan
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Murid</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total_students}</p>
                        <p className="text-xs text-gray-400 mt-0.5">diampu saat ini</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Sesi</p>
                        <p className="text-2xl font-bold text-teal-700 mt-1">{stats.total_sessions}</p>
                        <p className="text-xs text-gray-400 mt-0.5">semua riwayat</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Hadir</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">{stats.hadir_count}</p>
                        <p className="text-xs text-green-600 mt-0.5">berjalan sukses</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tidak Hadir</p>
                        <p className="text-2xl font-bold text-red-600 mt-1">{stats.absen_count}</p>
                        <p className="text-xs text-red-500 mt-0.5">tidak hadir</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Akan Datang</p>
                        <p className="text-2xl font-bold text-blue-600 mt-1">{stats.akan_datang_count}</p>
                        <p className="text-xs text-blue-600 mt-0.5">sesi terjadwal</p>
                    </div>
                </div>

                {/* Section 1: Murid yang Diampu */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <i className="bi bi-people text-teal-600" />
                                Daftar Murid Binaan ({assignedStudents.length})
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Murid-murid yang dibimbing langsung oleh {tutor.name}. Anda bisa mengatur jadwal kalender, nilai, dan komentar per murid.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                                <input
                                    type="text"
                                    placeholder="Cari murid..."
                                    value={searchStudent}
                                    onChange={e => setSearchStudent(e.target.value)}
                                    className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 w-48"
                                />
                            </div>
                            <button
                                onClick={() => setShowAssignModal(true)}
                                className="px-3 py-1.5 text-xs bg-teal-50 text-teal-700 hover:bg-teal-100 font-semibold rounded-lg border border-teal-200 flex items-center gap-1 transition"
                            >
                                <i className="bi bi-plus-lg" /> Tambah Murid
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-y border-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                <tr>
                                    <th className="px-4 py-3">Murid</th>
                                    <th className="px-4 py-3">Kelas</th>
                                    <th className="px-4 py-3 text-center">Sesi Selesai</th>
                                    <th className="px-4 py-3 text-center">Status Akun</th>
                                    <th className="px-4 py-3 text-center">Aksi Cepat</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-xs">
                                            <i className="bi bi-inbox text-3xl block mb-1 text-gray-300" />
                                            {assignedStudents.length === 0
                                                ? 'Belum ada murid yang ditugaskan ke tutor ini. Klik "Tugaskan Murid Baru" di atas.'
                                                : 'Tidak ada murid yang sesuai dengan pencarian.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map(student => (
                                        <tr key={student.id} className="hover:bg-gray-50/80 transition">
                                            <td className="px-4 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={student.avatar}
                                                        alt={student.name}
                                                        className="w-9 h-9 rounded-full object-cover border border-gray-200"
                                                    />
                                                    <div>
                                                        <Link
                                                            href={`/superadmin/students/${student.id}`}
                                                            className="font-semibold text-gray-900 hover:text-teal-600 transition"
                                                        >
                                                            {student.name}
                                                        </Link>
                                                        <p className="text-xs text-gray-500">{student.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-800 border border-teal-200">
                                                    {student.class}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 text-center font-semibold text-gray-700">
                                                {student.sessions_count} sesi
                                            </td>
                                            <td className="px-4 py-3.5 text-center">
                                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                    student.status === 'aktif'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {student.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3.5 text-center">
                                                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                                    {/* Atur Jadwal Sesi Kalender */}
                                                    <Link
                                                        href={`/superadmin/calendar/${student.id}`}
                                                        className="px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md transition flex items-center gap-1"
                                                        title="Atur Jadwal / Sesi Kalender Murid Ini"
                                                    >
                                                        <i className="bi bi-calendar-check" /> Sesi & Kalender
                                                    </Link>

                                                    {/* Input / Kelola Nilai */}
                                                    <Link
                                                        href={`/tutor/grades/${student.id}`}
                                                        className="p-1.5 text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-md transition"
                                                        title="Kelola Nilai Murid"
                                                    >
                                                        <i className="bi bi-pencil-square" />
                                                    </Link>

                                                    {/* Komentar Tutor */}
                                                    <Link
                                                        href={`/tutor/comments/${student.id}`}
                                                        className="p-1.5 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition"
                                                        title="Kelola Komentar"
                                                    >
                                                        <i className="bi bi-chat-left-text" />
                                                    </Link>

                                                    {/* Detail Profil */}
                                                    <Link
                                                        href={`/superadmin/students/${student.id}`}
                                                        className="p-1.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition"
                                                        title="Detail Siswa Lengkap"
                                                    >
                                                        <i className="bi bi-person-badge" />
                                                    </Link>

                                                    {/* Lepas Murid */}
                                                    <button
                                                        onClick={() => handleRemoveStudent(student)}
                                                        className="p-1.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition"
                                                        title="Lepas Bimbingan Murid Ini"
                                                    >
                                                        <i className="bi bi-x-circle" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Section 2: Riwayat Sesi Pembelajaran Tutor Ini */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <i className="bi bi-clock-history text-teal-600" />
                                Riwayat & Jadwal Sesi Pembelajaran ({recentSessions.length})
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Seluruh sesi pembelajaran yang ditangani oleh Tutor {tutor.name}.
                            </p>
                        </div>
                        <div className="relative">
                            <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                            <input
                                type="text"
                                placeholder="Cari judul, murid, kelas..."
                                value={searchSession}
                                onChange={e => setSearchSession(e.target.value)}
                                className="pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 w-56"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-y border-gray-100 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                <tr>
                                    <th className="px-4 py-3">Tanggal</th>
                                    <th className="px-4 py-3">Judul Sesi</th>
                                    <th className="px-4 py-3">Murid &amp; Kelas</th>
                                    <th className="px-4 py-3">Modul</th>
                                    <th className="px-4 py-3 text-center">Status</th>
                                    <th className="px-4 py-3 text-center">Aksi Kalender</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {filteredSessions.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-xs">
                                            <i className="bi bi-calendar-x text-3xl block mb-1 text-gray-300" />
                                            Belum ada sesi pembelajaran yang tercatat untuk tutor ini.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredSessions.map(session => (
                                        <tr key={session.id} className="hover:bg-gray-50/80 transition">
                                            <td className="px-4 py-3 text-xs font-medium text-gray-600 whitespace-nowrap">
                                                {session.date}
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-gray-900">
                                                {session.title}
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="font-medium text-gray-900 text-xs">{session.student_name}</p>
                                                <p className="text-[11px] text-gray-500">{session.class}</p>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-600 max-w-xs truncate">
                                                {session.modules || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                    statusBadge[session.status] || 'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {session.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {session.student_id && (
                                                    <Link
                                                        href={`/superadmin/calendar/${session.student_id}`}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition"
                                                        title="Buka Kalender Murid Ini"
                                                    >
                                                        <i className="bi bi-calendar3" /> Buka Kalender
                                                    </Link>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal Tugaskan Murid Baru */}
            {showAssignModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Tugaskan Murid ke {tutor.name}</h3>
                            <button
                                onClick={() => setShowAssignModal(false)}
                                className="text-gray-400 hover:text-gray-600 text-xl"
                            >
                                <i className="bi bi-x-lg" />
                            </button>
                        </div>

                        <p className="text-xs text-gray-500 mb-4">
                            Pilih murid yang ingin dimasukkan ke dalam bimbingan tutor ini. Jika murid sudah memiliki tutor lain, tutornya akan dialihkan ke {tutor.name}.
                        </p>

                        <form onSubmit={handleAssign} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase">
                                    Pilih Murid
                                </label>
                                <select
                                    value={selectedStudentId}
                                    onChange={e => setSelectedStudentId(e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                                    required
                                >
                                    <option value="">-- Pilih Murid --</option>
                                    {availableStudents.map(s => (
                                        <option key={s.id} value={s.id}>
                                            {s.name} ({s.class}) {s.current_tutor ? `[Tutor saat ini: ${s.current_tutor}]` : '[Belum ada tutor]'}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-2.5 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowAssignModal(false)}
                                    className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={!selectedStudentId}
                                    className="flex-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition"
                                >
                                    Tugaskan Murid
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
