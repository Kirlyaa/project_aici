import { Head, Link, router, usePage } from '@inertiajs/react';
import FlashToast from '@/Components/FlashToast';
import AdminTutorChatWidget from '@/Components/AdminTutorChatWidget';

interface Props {
    auth?: {
        user?: {
            id: number;
            name: string;
            role: string;
        };
    };
    tutorsList?: Array<{
        id: number;
        name: string;
        email: string;
    }>;
    stats: {
        totalUsers: number;
        totalStudents: number;
        totalTutors: number;
        totalModules: number;
        activeStudents: number;
        pendingStudents: number;
        activeTutors: number;
        avgGrade: number;
        totalGradeEntries: number;
        totalSessions: number;
    };
    recentStudents: Array<{
        id: number;
        name: string;
        email: string;
        tutor: string;
        avgGrade: number;
        status: string;
    }>;
    recentTutors: Array<{
        id: number;
        name: string;
        email: string;
        status: string;
    }>;
    recentModules: Array<{
        id: number;
        name: string;
        type: string;
        typeLabel: string;
        image: string | null;
    }>;
}

export default function SuperAdminDashboard() {
    const { stats, recentStudents, recentTutors, recentModules, tutorsList = [], auth } = usePage().props as unknown as Props;

    return (
        <div className="min-h-screen bg-gray-50">
            <FlashToast />
            <Head title="Super Admin Dashboard" />

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <img
                                src="/images/logo-aici.png"
                                alt="AICI Logo"
                                className="h-10 w-auto object-contain"
                            />
                            <div className="border-l border-gray-300 pl-3">
                                <span className="text-[11px] bg-red-100 text-red-700 px-2 py-0.5 rounded font-medium">Super Admin</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">Selamat datang Super Admin</span>
                            <button className="w-10 h-10 rounded-lg bg-[#0B6282] text-white flex items-center justify-center hover:bg-[#08455c] transition-colors">
                                <i className="bi bi-person-circle text-lg" />
                            </button>
                            <button
                                type="button"
                                onClick={() => router.post('/logout', {}, { onSuccess: () => window.location.reload() })}
                                className="w-10 h-10 rounded-lg bg-gray-100 text-gray-600 hover:text-[#E62C29] hover:bg-red-50 flex items-center justify-center transition-colors"
                                title="Logout"
                            >
                                <i className="bi bi-box-arrow-right text-lg" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Real-time Tutor Chat Widget */}
                {tutorsList.length > 0 && (
                    <AdminTutorChatWidget
                        tutors={tutorsList}
                        currentUserId={auth?.user?.id ?? 1}
                    />
                )}
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Super Admin</h1>
                    <p className="text-gray-600">Kelola sistem AICI, akun pengguna, dan data master</p>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Total Pengguna</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                <i className="bi bi-people-fill text-blue-600 text-xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Siswa</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalStudents}</p>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                                <i className="bi bi-mortarboard-fill text-purple-600 text-xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Tutor</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalTutors}</p>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                                <i className="bi bi-person-workspace text-green-600 text-xl" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {/* User & Role Management */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-[#0B6282] to-[#08455c] px-6 py-4">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <i className="bi bi-person-check-fill" />
                                Kelola Tutor
                            </h2>
                            <p className="text-blue-100 text-sm mt-1">Kelola akun Tutor dan akses Super Admin.</p>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="bg-green-50 rounded-lg p-3 text-center">
                                    <p className="text-xs text-green-600 font-semibold">Total Tutor</p>
                                    <p className="text-2xl font-bold text-green-900">{stats.totalTutors}</p>
                                </div>
                                <div className="bg-[#EDF2F7] rounded-lg p-3 text-center">
                                    <p className="text-xs text-[#0B6282] font-semibold">Aktif</p>
                                    <p className="text-2xl font-bold text-[#08455c]">{stats.activeTutors}</p>
                                </div>
                            </div>

                            {/* Recent Tutors */}
                            <div className="border-t pt-4">
                                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Daftar Tutor Terbaru</h3>
                                <div className="space-y-2">
                                    {recentTutors.map(t => (
                                        <div key={t.id} className="flex items-center justify-between p-2.5 hover:bg-gray-50 rounded">
                                            <div>
                                                <p className="font-medium text-sm text-gray-900">{t.name}</p>
                                                <p className="text-xs text-gray-500">{t.email}</p>
                                            </div>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded ${t.status === 'aktif' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {t.status === 'aktif' ? 'Aktif' : t.status === 'pending' ? 'Pending' : 'Nonaktif'}
                                            </span>
                                        </div>
                                    ))}
                                    {recentTutors.length === 0 && (
                                        <p className="text-sm text-gray-500">Belum ada data.</p>
                                    )}
                                </div>
                            </div>

                            {/* Action Button */}
                            <Link
                                href="/superadmin/tutors"
                                className="block text-center mt-6 px-4 py-2.5 bg-[#0B6282] text-white rounded-lg font-medium hover:bg-[#08455c] transition-colors shadow-sm"
                            >
                                <i className="bi bi-arrow-right mr-2" /> Kelola Akun Tutor
                            </Link>
                        </div>
                    </div>

                    {/* Student Management */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <i className="bi bi-people-fill" />
                                Kelola Murid
                            </h2>
                            <p className="text-blue-100 text-sm mt-1">Kelola akun Murid AICI.</p>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="bg-blue-50 rounded-lg p-3 text-center">
                                    <p className="text-xs text-blue-600 font-semibold">Total Murid</p>
                                    <p className="text-2xl font-bold text-blue-900">{stats.totalStudents}</p>
                                </div>
                                <div className="bg-cyan-50 rounded-lg p-3 text-center">
                                    <p className="text-xs text-cyan-600 font-semibold">Aktif</p>
                                    <p className="text-2xl font-bold text-cyan-900">{stats.activeStudents}</p>
                                </div>
                            </div>

                            {/* Student List Sample */}
                            <div className="border-t pt-4">
                                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Daftar Murid Terbaru</h3>
                                <div className="space-y-2">
                                    {recentStudents.slice(0, 2).map(s => (
                                        <div key={s.id} className="flex items-center justify-between p-2.5 hover:bg-gray-50 rounded">
                                            <div>
                                                <p className="font-medium text-sm text-gray-900">{s.name}</p>
                                                <p className="text-xs text-gray-500">{s.email}</p>
                                            </div>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded ${s.status === 'aktif' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                {s.status === 'aktif' ? 'Aktif' : s.status === 'pending' ? 'Pending' : 'Nonaktif'}
                                            </span>
                                        </div>
                                    ))}
                                    {recentStudents.length === 0 && (
                                        <p className="text-sm text-gray-500">Belum ada data.</p>
                                    )}
                                </div>
                            </div>

                            {/* Action Button */}
                            <Link
                                href="/superadmin/students"
                                className="block text-center mt-6 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                <i className="bi bi-arrow-right mr-2" /> Kelola Akun Murid
                            </Link>
                        </div>
                    </div>

                    {/* Classroom Management */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <i className="bi bi-building-fill" />
                                Kelola Kelas
                            </h2>
                            <p className="text-indigo-100 text-sm mt-1">Atur nama kelas, foto, dan distribusi murid.</p>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
                                <p className="text-sm font-semibold text-indigo-900">Manajemen Kelas Terpadu</p>
                                <p className="text-xs text-indigo-700 mt-1">
                                    Buat kelas baru, sesuaikan foto & deskripsi, masukkan murid atau pindahkan murid antar kelas dengan mudah.
                                </p>
                            </div>

                            <div className="border-t pt-4">
                                <ul className="space-y-2 text-xs text-gray-600">
                                    <li className="flex items-center gap-2">
                                        <i className="bi bi-check-circle-fill text-indigo-600" /> Atur foto sampul & nama kelas
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <i className="bi bi-check-circle-fill text-indigo-600" /> Masukkan murid tanpa kelas
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <i className="bi bi-check-circle-fill text-indigo-600" /> Pindahkan atau keluarkan murid
                                    </li>
                                </ul>
                            </div>

                            <Link
                                href="/superadmin/classes"
                                className="block text-center mt-6 px-4 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm"
                            >
                                <i className="bi bi-arrow-right mr-2" /> Buka Manajemen Kelas
                            </Link>
                        </div>
                    </div>

                    {/* Master Database Modul */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-4">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <i className="bi bi-book-fill" />
                                Master Database Modul
                            </h2>
                            <p className="text-orange-100 text-sm mt-1">Kelola modul ajar inti dan kode preset default untuk tutor.</p>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Module List */}
                            <div className="space-y-2">
                                {recentModules.map(m => (
                                    <div key={m.id} className="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 mr-3 ${m.type === 'robot' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                                            <span className={`text-xs font-bold ${m.type === 'robot' ? 'text-blue-600' : 'text-purple-600'}`}>
                                                {m.name.substring(0, 2).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-sm text-gray-900">{m.name}</p>
                                            <p className="text-xs text-gray-600 mt-0.5">{m.typeLabel}</p>
                                        </div>
                                    </div>
                                ))}
                                {recentModules.length === 0 && (
                                    <p className="text-sm text-gray-500">Belum ada modul.</p>
                                )}
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                                <div className="bg-orange-50 rounded-lg p-3 text-center">
                                    <p className="text-xs text-orange-600 font-semibold">Total Modul</p>
                                    <p className="text-2xl font-bold text-orange-900">{stats.totalModules}</p>
                                </div>
                                <div className="bg-red-50 rounded-lg p-3 text-center">
                                    <p className="text-xs text-red-600 font-semibold">Total Sesi</p>
                                    <p className="text-2xl font-bold text-red-900">{stats.totalSessions}</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-4 space-y-2">
                                <Link
                                    href="/superadmin/modules"
                                    className="block w-full text-center px-4 py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
                                >
                                    <i className="bi bi-plus-lg mr-2" /> Tambah Modul
                                </Link>
                                <Link
                                    href="/superadmin/modules"
                                    className="block w-full text-center px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                >
                                    <i className="bi bi-list-ul mr-2" /> Lihat Semua Modul
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Kelola Kalender Siswa */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-violet-600 to-violet-700 px-6 py-4">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <i className="bi bi-calendar3" />
                                Kelola Kalender Siswa
                            </h2>
                            <p className="text-violet-100 text-sm mt-1">Atur jadwal sesi belajar per murid, materi dan absensi.</p>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-violet-50 rounded-lg p-3 text-center">
                                    <p className="text-xs text-violet-600 font-semibold">Total Sesi</p>
                                    <p className="text-2xl font-bold text-violet-900">{stats.totalSessions}</p>
                                </div>
                                <div className="bg-indigo-50 rounded-lg p-3 text-center">
                                    <p className="text-xs text-indigo-600 font-semibold">Total Murid</p>
                                    <p className="text-2xl font-bold text-indigo-900">{stats.totalStudents}</p>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <p className="text-sm text-gray-600 mb-3">
                                    <i className="bi bi-info-circle mr-1 text-violet-500" />
                                    Pilih murid dari daftar untuk mengelola kalender sesi belajarnya:
                                </p>
                                <div className="space-y-2">
                                    {recentStudents.slice(0, 3).map(s => (
                                        <Link
                                            key={s.id}
                                            href={`/superadmin/calendar/${s.id}`}
                                            className="flex items-center justify-between p-2.5 hover:bg-violet-50 rounded-lg border border-transparent hover:border-violet-200 transition-colors"
                                        >
                                            <div>
                                                <p className="font-medium text-sm text-gray-900">{s.name}</p>
                                                <p className="text-xs text-gray-500">{s.tutor ? `Tutor: ${s.tutor}` : 'Belum ada tutor'}</p>
                                            </div>
                                            <i className="bi bi-calendar-check text-violet-500" />
                                        </Link>
                                    ))}
                                    {recentStudents.length === 0 && (
                                        <p className="text-sm text-gray-500">Belum ada murid.</p>
                                    )}
                                </div>
                            </div>

                            <Link
                                href="/superadmin/calendar"
                                className="block text-center mt-4 px-4 py-2.5 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors"
                            >
                                <i className="bi bi-calendar3 mr-2" /> Buka Kalender Siswa
                            </Link>
                        </div>
                    </div>

                    {/* Kelola Kalender Tutor */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-[#0B6282] to-[#046BD2] px-6 py-4">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <i className="bi bi-calendar-week" />
                                Kelola Kalender Tutor
                            </h2>
                            <p className="text-blue-100 text-sm mt-1">Otoritas penuh Super Admin untuk menyusun dan mengedit jadwal mengajar para tutor.</p>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-[#EDF2F7] rounded-lg p-3 text-center">
                                    <p className="text-xs text-[#0B6282] font-semibold">Tutor Aktif</p>
                                    <p className="text-2xl font-bold text-[#08455c]">{stats.activeTutors}</p>
                                </div>
                                <div className="bg-blue-50 rounded-lg p-3 text-center">
                                    <p className="text-xs text-[#046BD2] font-semibold">Total Tutor</p>
                                    <p className="text-2xl font-bold text-blue-900">{stats.totalTutors}</p>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <p className="text-sm text-gray-600 mb-3">
                                    <i className="bi bi-shield-check mr-1 text-[#0B6282]" />
                                    Hanya Super Admin yang berwenang menambah dan mengedit agenda mengajar tutor:
                                </p>
                                <div className="space-y-2">
                                    {recentTutors.slice(0, 3).map(t => (
                                        <Link
                                            key={t.id}
                                            href={`/superadmin/calendar/tutors/${t.id}`}
                                            className="flex items-center justify-between p-2.5 hover:bg-[#EDF2F7] rounded-lg border border-transparent hover:border-blue-200 transition-colors"
                                        >
                                            <div>
                                                <p className="font-medium text-sm text-gray-900">{t.name}</p>
                                                <p className="text-xs text-gray-500">{t.email}</p>
                                            </div>
                                            <i className="bi bi-calendar-event text-[#0B6282]" />
                                        </Link>
                                    ))}
                                    {recentTutors.length === 0 && (
                                        <p className="text-sm text-gray-500">Belum ada tutor terdaftar.</p>
                                    )}
                                </div>
                            </div>

                            <Link
                                href="/superadmin/calendar/tutors"
                                className="block text-center mt-4 px-4 py-2.5 bg-[#0B6282] text-white rounded-lg font-medium hover:bg-[#08455c] transition-colors shadow-sm"
                            >
                                <i className="bi bi-calendar-week mr-2" /> Buka Kelola Kalender Tutor
                            </Link>
                        </div>
                    </div>
                    {/* Pengaturan Periode Rapor PDF */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-rose-600 to-pink-700 px-6 py-4">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <i className="bi bi-file-earmark-pdf-fill" />
                                Periode Rapor PDF
                            </h2>
                            <p className="text-rose-100 text-sm mt-1">Atur pembagian pertemuan untuk cetak PDF rapor & evaluasi tutor.</p>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="bg-rose-50 rounded-lg p-4 border border-rose-100">
                                <p className="text-sm font-semibold text-rose-900">Kendali Penuh Super Admin</p>
                                <p className="text-xs text-rose-700 mt-1">
                                    Atur siklus cetak PDF menjadi per 2 pertemuan, per 3 pertemuan (1-3, 4-6), atau rentang pertemuan kustom (misal 6-7).
                                </p>
                            </div>

                            <div className="border-t pt-4">
                                <ul className="space-y-2 text-xs text-gray-600">
                                    <li className="flex items-center gap-2">
                                        <i className="bi bi-check-circle-fill text-rose-600" /> Fleksibel tentukan pertemuan awal & akhir
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <i className="bi bi-check-circle-fill text-rose-600" /> Sinkron dengan modal cetak PDF & komentar tutor
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <i className="bi bi-check-circle-fill text-rose-600" /> Tetap mendukung opsi custom rentang bebas
                                    </li>
                                </ul>
                            </div>

                            <Link
                                href="/superadmin/report-periods"
                                className="block text-center mt-6 px-4 py-2.5 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition-colors shadow-sm"
                            >
                                <i className="bi bi-sliders mr-2" /> Atur Periode Rapor PDF
                            </Link>
                        </div>
                    </div>

                    {/* Surat Pengumuman Libur (Pop-up 3D Siswa & Tutor) */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-amber-500 to-yellow-600 px-6 py-4">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <i className="bi bi-envelope-paper-heart-fill" />
                                Surat Pengumuman Libur
                            </h2>
                            <p className="text-amber-100 text-sm mt-1">Pop-up amplop 3D interaktif saat siswa/tutor login.</p>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                                <p className="text-sm font-semibold text-amber-900">Notifikasi Interaktif 3D Mail</p>
                                <p className="text-xs text-amber-700 mt-1">
                                    Umumkan tanggal libur (misal tgl 7). Saat murid membuka web, akan muncul kartu pop-up amplop 3D yang bisa diunduh surat resminya.
                                </p>
                            </div>

                            <div className="border-t pt-4">
                                <ul className="space-y-2 text-xs text-gray-600">
                                    <li className="flex items-center gap-2">
                                        <i className="bi bi-check-circle-fill text-amber-600" /> Atur tanggal libur & isi surat maklumat
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <i className="bi bi-check-circle-fill text-amber-600" /> Upload surat resmi PDF / scan dokumen
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <i className="bi bi-check-circle-fill text-amber-600" /> Otomatis tampil 1x per user (super ringan via JSON)
                                    </li>
                                </ul>
                            </div>

                            <Link
                                href="/superadmin/holiday-announcement"
                                className="block text-center mt-6 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition-colors shadow-sm"
                            >
                                <i className="bi bi-envelope-open-fill mr-2" /> Kelola Surat Libur
                            </Link>
                        </div>
                    </div>                </div>
            </div>
        </div>
    );
}
