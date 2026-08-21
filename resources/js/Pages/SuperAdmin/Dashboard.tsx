import { Head, Link, router } from '@inertiajs/react';
import FlashToast from '@/Components/FlashToast';

interface DashboardStats {
    totalUsers: number;
    totalSuperAdmins: number;
    totalTutors: number;
    totalModules: number;
}

export default function SuperAdminDashboard() {
    const stats: DashboardStats = {
        totalUsers: 3,
        totalSuperAdmins: 1,
        totalTutors: 1,
        totalModules: 2,
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <FlashToast />
            <Head title="Super Admin Dashboard" />

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center">
                                <i className="bi bi-shield-check text-white text-lg" />
                            </div>
                            <div>
                                <h1 className="font-bold text-lg">AICI</h1>
                                <p className="text-xs text-gray-500">Super Admin Control Center</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">Selamat datang Super Admin</span>
                            <button className="w-10 h-10 rounded-lg bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700">
                                <i className="bi bi-person-circle text-lg" />
                            </button>
                            <button
                                type="button"
                                onClick={() => router.post('/logout', {}, { onSuccess: () => window.location.reload() })}
                                className="w-10 h-10 rounded-lg bg-gray-100 text-gray-600 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors"
                                title="Logout"
                            >
                                <i className="bi bi-box-arrow-right text-lg" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                                <p className="text-gray-600 text-sm font-medium">Super Admin</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalSuperAdmins}</p>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                                <i className="bi bi-shield-fill text-purple-600 text-xl" />
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
                                <i className="bi bi-mortarboard-fill text-green-600 text-xl" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-gray-600 text-sm font-medium">Modul Aktif</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalModules}</p>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                                <i className="bi bi-collection-fill text-orange-600 text-xl" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* User & Role Management */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <i className="bi bi-person-check-fill" />
                                Kelola Tutor
                            </h2>
                            <p className="text-teal-100 text-sm mt-1">Kelola akun Tutor dan akses Super Admin.</p>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="bg-green-50 rounded-lg p-3 text-center">
                                    <p className="text-xs text-green-600 font-semibold">Total Tutor</p>
                                    <p className="text-2xl font-bold text-green-900">{stats.totalTutors}</p>
                                </div>
                                <div className="bg-teal-50 rounded-lg p-3 text-center">
                                    <p className="text-xs text-teal-600 font-semibold">Aktif</p>
                                    <p className="text-2xl font-bold text-teal-900">1</p>
                                </div>
                            </div>

                            {/* User List Sample */}
                            <div className="border-t pt-4">
                                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Daftar Tutor Terbaru</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between p-2.5 hover:bg-gray-50 rounded">
                                        <div>
                                            <p className="font-medium text-sm text-gray-900">Aiya Putri</p>
                                            <p className="text-xs text-gray-500">aiya@aici.id</p>
                                        </div>
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">Aktif</span>
                                    </div>
                                    <div className="flex items-center justify-between p-2.5 hover:bg-gray-50 rounded">
                                        <div>
                                            <p className="font-medium text-sm text-gray-900">Budi Santoso</p>
                                            <p className="text-xs text-gray-500">budi@aici.id</p>
                                        </div>
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">Aktif</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <Link
                                href="/superadmin/tutors"
                                className="block text-center mt-6 px-4 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
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
                                    <p className="text-2xl font-bold text-blue-900">3</p>
                                </div>
                                <div className="bg-cyan-50 rounded-lg p-3 text-center">
                                    <p className="text-xs text-cyan-600 font-semibold">Aktif</p>
                                    <p className="text-2xl font-bold text-cyan-900">2</p>
                                </div>
                            </div>

                            {/* Student List Sample */}
                            <div className="border-t pt-4">
                                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Daftar Murid Terbaru</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between p-2.5 hover:bg-gray-50 rounded">
                                        <div>
                                            <p className="font-medium text-sm text-gray-900">Adi Wijaya</p>
                                            <p className="text-xs text-gray-500">adi@school.id</p>
                                        </div>
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">Aktif</span>
                                    </div>
                                    <div className="flex items-center justify-between p-2.5 hover:bg-gray-50 rounded">
                                        <div>
                                            <p className="font-medium text-sm text-gray-900">Binti Rahmah</p>
                                            <p className="text-xs text-gray-500">binti@school.id</p>
                                        </div>
                                        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded">Aktif</span>
                                    </div>
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
                                <div className="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mr-3">
                                        <span className="text-xs font-bold text-blue-600">FZ</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm text-gray-900">Fantasy Zoo</p>
                                        <p className="text-xs text-gray-600 mt-0.5">Kode: FZ-001 • Robotik Dasar</p>
                                    </div>
                                </div>
                                <div className="flex items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0 mr-3">
                                        <span className="text-xs font-bold text-purple-600">FT</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-sm text-gray-900">Future Town</p>
                                        <p className="text-xs text-gray-600 mt-0.5">Kode: FT-001 • Robotik Lanjut</p>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                                <div className="bg-orange-50 rounded-lg p-3 text-center">
                                    <p className="text-xs text-orange-600 font-semibold">Total Modul</p>
                                    <p className="text-2xl font-bold text-orange-900">{stats.totalModules}</p>
                                </div>
                                <div className="bg-red-50 rounded-lg p-3 text-center">
                                    <p className="text-xs text-red-600 font-semibold">Aktif</p>
                                    <p className="text-2xl font-bold text-red-900">2</p>
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
                </div>
            </div>
        </div>
    );
}
