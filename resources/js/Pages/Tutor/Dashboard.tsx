import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function TutorDashboard() {
    const [selectedStudent, setSelectedStudent] = useState<number | null>(null);

    const students = [
        { id: 1, name: 'Faris Sukirman', email: 'faris@aici.id', level: 'Level 2', progress: 78.8 },
        { id: 2, name: 'Budi Santoso', email: 'budi@aici.id', level: 'Level 1', progress: 65.5 },
        { id: 3, name: 'Siti Nurhaliza', email: 'siti@aici.id', level: 'Level 2', progress: 82.0 },
    ];

    const currentStudent = students.find(s => s.id === selectedStudent) || students[0];

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Dashboard Tutor" />

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
                                <i className="bi bi-mortarboard-fill text-white" />
                            </div>
                            <div>
                                <h1 className="font-bold text-lg">AICI</h1>
                                <p className="text-xs text-gray-500">Dashboard Tutor</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                                <i className="bi bi-person-fill text-white" />
                            </div>
                            <span className="font-medium">Aiya Putri</span>
                            <form method="POST" action="/logout">
                                <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''} />
                                <button type="submit" className="text-gray-600 hover:text-red-600 transition-colors" title="Logout">
                                    <i className="bi bi-box-arrow-right text-xl" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Tutor</h1>
                    <p className="text-gray-600">Input absensi, nilai, dan komentar untuk murid Anda</p>
                </div>

                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Student Selector */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sticky top-20">
                            <h2 className="font-bold text-gray-900 mb-4">Pilih Murid</h2>
                            <div className="space-y-2">
                                {students.map(student => (
                                    <button
                                        key={student.id}
                                        onClick={() => setSelectedStudent(student.id)}
                                        className={`w-full text-left p-3 rounded-lg transition-colors ${
                                            (selectedStudent || students[0].id) === student.id
                                                ? 'bg-teal-600 text-white'
                                                : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                                        }`}
                                    >
                                        <p className="font-medium text-sm">{student.name}</p>
                                        <p className={`text-xs mt-0.5 ${
                                            (selectedStudent || students[0].id) === student.id ? 'text-teal-100' : 'text-gray-600'
                                        }`}>
                                            {student.level}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Student Info Card */}
                        <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold mb-1">{currentStudent.name}</h2>
                                    <p className="text-teal-100">{currentStudent.email}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-3xl font-bold">{currentStudent.progress}%</p>
                                    <p className="text-teal-100 text-sm">Progress Rata-rata</p>
                                </div>
                            </div>
                        </div>

                        {/* Menu Cards */}
                        <div className="grid md:grid-cols-4 gap-4">
                            <Link
                                href={`/tutor/calendar/${currentStudent.id}`}
                                className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <i className="bi bi-calendar-event text-blue-600 text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Kelola Kalender</h3>
                                        <p className="text-sm text-gray-600">Absen, libur, reschedule</p>
                                    </div>
                                </div>
                            </Link>

                            <Link
                                href={`/tutor/grades/${currentStudent.id}`}
                                className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <i className="bi bi-pencil-square text-orange-600 text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Input Nilai</h3>
                                        <p className="text-sm text-gray-600">Per modul & kategori</p>
                                    </div>
                                </div>
                            </Link>

                            <Link
                                href={`/tutor/comments/${currentStudent.id}`}
                                className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <i className="bi bi-chat-left-text text-green-600 text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Komentar</h3>
                                        <p className="text-sm text-gray-600">Per semester & sistem</p>
                                    </div>
                                </div>
                            </Link>

                            <Link
                                href="/tutor/modules"
                                className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <i className="bi bi-collection text-purple-600 text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">Kelola Modul</h3>
                                        <p className="text-sm text-gray-600">Tambah & edit modul</p>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                            <h3 className="font-bold text-gray-900 mb-4">Ringkasan Semester</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">Total Sesi</p>
                                    <p className="text-2xl font-bold text-gray-900">13</p>
                                </div>
                                <div className="p-4 bg-green-50 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">Hadir</p>
                                    <p className="text-2xl font-bold text-green-600">8</p>
                                </div>
                                <div className="p-4 bg-red-50 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">Absen</p>
                                    <p className="text-2xl font-bold text-red-600">2</p>
                                </div>
                                <div className="p-4 bg-yellow-50 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-1">Reschedule</p>
                                    <p className="text-2xl font-bold text-yellow-600">1</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
