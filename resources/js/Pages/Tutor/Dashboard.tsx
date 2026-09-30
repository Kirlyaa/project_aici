import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import FlashToast from '@/Components/FlashToast';
import TutorLiveChatBanner from '@/Components/TutorLiveChatBanner';
import ClassAttendanceModal, { ModuleItem } from '@/Components/Tutor/ClassAttendanceModal';

interface Student {
    id: number;
    name: string;
    email: string;
    class: string;
    classroom_id?: number | null;
    avatar?: string;
    level: string;
    progress: number;
    averageGrade: number;
    status: string;
    totalSessions: number;
    hadir: number;
    absen: number;
    libur: number;
    akanDatang: number;
}

interface ClassGroup {
    name: string;
    classroom_id?: number | null;
    total: number;
}

interface ClassMeeting {
    classroom_id?: number | null;
    class_name: string;
    date: string;
    date_string?: string;
    title: string;
    modules: Array<{
        id: number;
        name: string;
        module_type?: string | null;
    }>;
    students_count: number;
}

export default function TutorDashboard() {
    const { props } = usePage();
    const rawStudents = props.students as any;
    const students: Student[] = Array.isArray(rawStudents)
        ? rawStudents
        : (rawStudents?.data || []);
    const classes: ClassGroup[] = (props.classes as ClassGroup[]) ?? [];
    const classMeetings: ClassMeeting[] = (props.classMeetings as ClassMeeting[]) ?? [];
    const propStudentId = (props.selectedStudentId as number | null) || null;

    // Helper penentuan kelas & murid awal
    const getInitialSelection = () => {
        if (typeof window === 'undefined') {
            return { class: null, student: null };
        }

        const params = new URLSearchParams(window.location.search);
        const paramStudentId = params.get('student') ? parseInt(params.get('student')!, 10) : null;
        const targetStudentId = propStudentId || paramStudentId;

        if (targetStudentId) {
            const found = students.find(s => s.id === targetStudentId);
            if (found) {
                return { class: found.class, student: found.id };
            }
        }

        const savedStudentId = sessionStorage.getItem('tutor_selected_student_id');
        if (savedStudentId) {
            const found = students.find(s => s.id === parseInt(savedStudentId, 10));
            if (found) {
                return { class: found.class, student: found.id };
            }
        }

        const savedClass = sessionStorage.getItem('tutor_selected_class');
        if (savedClass && classes.some(c => c.name === savedClass)) {
            return { class: savedClass, student: null };
        }

        return { class: null, student: null };
    };

    const initial = getInitialSelection();
    // R4: dua level — pilih kelas dulu, lalu murid (dengan auto-restore pilihan murid/kelas)
    const [selectedClass, setSelectedClass] = useState<string | null>(initial.class);
    const [selectedStudent, setSelectedStudent] = useState<number | null>(initial.student);

    // State untuk Modal Presensi Pertemuan Kelas
    const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState<boolean>(false);
    const modules: ModuleItem[] = (props.modules as ModuleItem[]) || [];

    const studentsInClass = selectedClass
        ? students.filter(s => s.class === selectedClass)
        : students;

    const currentStudent = studentsInClass.find(s => s.id === selectedStudent) || null;

    // Pertemuan kelas untuk kelas yang sedang dipilih
    const meetingsForSelectedClass = selectedClass
        ? classMeetings.filter(m => m.class_name === selectedClass)
        : [];

    // Cari classroom_id untuk kelas yang sedang dipilih
    const selectedClassGroup = classes.find(c => c.name === selectedClass);
    const selectedClassroomId = selectedClassGroup?.classroom_id || studentsInClass[0]?.classroom_id || null;

    // Sinkronisasi pilihan aktif ke sessionStorage
    useEffect(() => {
        if (selectedStudent) {
            sessionStorage.setItem('tutor_selected_student_id', String(selectedStudent));
            if (selectedClass) {
                sessionStorage.setItem('tutor_selected_class', selectedClass);
            }
        } else {
            sessionStorage.removeItem('tutor_selected_student_id');
            if (selectedClass) {
                sessionStorage.setItem('tutor_selected_class', selectedClass);
            } else {
                sessionStorage.removeItem('tutor_selected_class');
            }
        }
    }, [selectedClass, selectedStudent]);

    // Handle jika props selectedStudentId berubah
    useEffect(() => {
        if (propStudentId) {
            const found = students.find(s => s.id === propStudentId);
            if (found) {
                setSelectedClass(found.class);
                setSelectedStudent(found.id);
            }
        }
    }, [propStudentId, students]);

    return (
        <div className="min-h-screen bg-gray-50">
            <FlashToast />
            <Head title="Dashboard Tutor" />

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
                                <span className="text-[11px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">Tutor</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="hidden md:flex items-center gap-4 text-sm font-semibold">
                                <Link href="/tutor" className="text-teal-800 font-bold">
                                    Dashboard
                                </Link>
                                <Link
                                    href="/tutor/teaching-calendar"
                                    className="text-gray-600 hover:text-teal-700 transition flex items-center gap-1.5"
                                >
                                    <i className="bi bi-calendar3" />
                                    Kalender Tutor
                                </Link>
                            </div>
                            <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
                                <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center">
                                    <i className="bi bi-person-fill text-white" />
                                </div>
                                <span className="font-medium text-sm text-gray-800">{(props.auth as any)?.user?.name || 'Tutor'}</span>
                                <button
                                    type="button"
                                    onClick={() => router.post('/logout', {}, { onSuccess: () => window.location.reload() })}
                                    className="text-gray-600 hover:text-red-600 transition-colors ml-1"
                                    title="Logout"
                                >
                                    <i className="bi bi-box-arrow-right text-xl" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Banner Notifikasi & Chat Real-Time dari Super Admin */}
                <TutorLiveChatBanner />

                {/* Header & Quick Action Kalender Tutor Mandiri */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">
                                Portal Tutor
                            </span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard Tutor</h1>
                        <p className="text-gray-500 text-sm mt-0.5">Kelola agenda mengajar tutor dan input kehadiran, nilai, serta komentar murid</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/tutor/teaching-calendar"
                            className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-semibold text-sm shadow-sm transition hover:shadow-md group"
                        >
                            <div className="w-8 h-8 rounded-lg bg-teal-600/70 flex items-center justify-center text-teal-100 group-hover:scale-105 transition-transform">
                                <i className="bi bi-calendar3 text-base" />
                            </div>
                            <div className="text-left">
                                <div className="leading-tight">Kalender Tutor</div>
                                <span className="text-[11px] text-teal-200 font-normal">Agenda &amp; Jadwal Mengajar</span>
                            </div>
                            <i className="bi bi-arrow-right ml-1 text-teal-300" />
                        </Link>
                    </div>
                </div>

                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Student Selector — R4: dua level kelas → murid */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sticky top-20">
                            <h2 className="font-bold text-gray-900 mb-4">Pilih Murid</h2>

                            {/* Level 1: Pilih Kelas */}
                            {!selectedClass ? (
                                classes.length === 0 ? (
                                    <p className="text-sm text-gray-500 italic">Belum ada data murid.</p>
                                ) : (
                                    <div className="space-y-2">
                                        {classes.map(cls => (
                                            <button
                                                key={cls.name}
                                                onClick={() => { setSelectedClass(cls.name); setSelectedStudent(null); }}
                                                className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-teal-50 hover:border-teal-300 border border-transparent transition-colors"
                                            >
                                                <p className="font-medium text-sm text-gray-900">{cls.name}</p>
                                                <p className="text-xs text-gray-500 mt-0.5">{cls.total} murid</p>
                                            </button>
                                        ))}
                                    </div>
                                )
                            ) : (
                                /* Level 2: Pilih Murid dalam Kelas */
                                <>
                                    <div className="flex items-center justify-between mb-3">
                                        <button
                                            onClick={() => { setSelectedClass(null); setSelectedStudent(null); }}
                                            className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-800 font-medium"
                                        >
                                            <i className="bi bi-arrow-left" /> Kembali
                                        </button>
                                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-700">
                                            {studentsInClass.length} Murid
                                        </span>
                                    </div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{selectedClass}</p>

                                    {/* Action Cepat: Presensi Pertemuan Kelas */}
                                    {selectedClassroomId && studentsInClass.length > 0 && (
                                        <div className="mb-3">
                                            <button
                                                type="button"
                                                onClick={() => setIsAttendanceModalOpen(true)}
                                                className="w-full py-2 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition flex items-center justify-center gap-1.5"
                                                title="Input kehadiran untuk seluruh murid dalam kelas ini sekaligus per materi/pertemuan"
                                            >
                                                <i className="bi bi-clipboard2-check text-sm" />
                                                <span>Presensi Pertemuan Kelas</span>
                                            </button>
                                        </div>
                                    )}

                                    {studentsInClass.length === 0 ? (
                                        <p className="text-sm text-gray-500 italic">Tidak ada murid di kelas ini.</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {studentsInClass.map(student => (
                                                <button
                                                    key={student.id}
                                                    onClick={() => setSelectedStudent(student.id)}
                                                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                                                        currentStudent?.id === student.id
                                                            ? 'bg-teal-600 text-white'
                                                            : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                                                    }`}
                                                >
                                                    <p className="font-medium text-sm">{student.name}</p>
                                                    <p className={`text-xs mt-0.5 ${
                                                        currentStudent?.id === student.id ? 'text-teal-100' : 'text-gray-600'
                                                    }`}>
                                                        {student.level}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {currentStudent ? (
                            <>
                                {/* Student Info Card */}
                                <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl shadow-sm p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h2 className="text-2xl font-bold">{currentStudent.name}</h2>
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm">
                                                    {currentStudent.class}
                                                </span>
                                            </div>
                                            <p className="text-teal-100">{currentStudent.email}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {selectedClassroomId && (
                                                <button
                                                    type="button"
                                                    onClick={() => setIsAttendanceModalOpen(true)}
                                                    className="px-4 py-2 rounded-xl bg-white text-teal-800 hover:bg-teal-50 font-bold text-xs shadow-sm transition flex items-center gap-2"
                                                >
                                                    <i className="bi bi-clipboard2-check text-base text-teal-600" />
                                                    <span>Presensi Kelas Ini</span>
                                                </button>
                                            )}
                                            <div className="text-right pl-3 border-l border-white/20">
                                                <p className="text-3xl font-bold">{currentStudent.progress}%</p>
                                                <p className="text-teal-100 text-xs">Progress Rata-rata</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Menu Cards Khusus Siswa */}
                                <div className="grid md:grid-cols-3 gap-4">
                                    <Link
                                        href={`/tutor/calendar/${currentStudent.id}`}
                                        className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <i className="bi bi-calendar-check text-blue-600 text-xl" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">Kalender Siswa</h3>
                                                <p className="text-sm text-gray-600">Kehadiran {currentStudent.name.split(' ')[0]}</p>
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
                                </div>

                                {/* Quick Stats — data asli per murid terpilih */}
                                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                                    <h3 className="font-bold text-gray-900 mb-4">Ringkasan Kehadiran — {currentStudent.name}</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Total Sesi</p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                {currentStudent.hadir} / {currentStudent.totalSessions}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {currentStudent.totalSessions > 0
                                                    ? `${Math.round((currentStudent.hadir / currentStudent.totalSessions) * 100)}% kehadiran`
                                                    : 'Belum ada sesi'}
                                            </p>
                                        </div>
                                        <div className="p-4 bg-green-50 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Hadir</p>
                                            <p className="text-2xl font-bold text-green-600">{currentStudent.hadir}</p>
                                        </div>
                                        <div className="p-4 bg-red-50 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Tidak Hadir</p>
                                            <p className="text-2xl font-bold text-red-600">{currentStudent.absen}</p>
                                        </div>
                                        <div className="p-4 bg-blue-50 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-1">Akan Datang</p>
                                            <p className="text-2xl font-bold text-blue-600">{currentStudent.akanDatang}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Jadwal Pertemuan & Modul untuk Kelas Ini */}
                                {selectedClass && meetingsForSelectedClass.length > 0 && (
                                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700">
                                                    <i className="bi bi-calendar-event text-base" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-base">Jadwal Pertemuan &amp; Modul Kelas</h3>
                                                    <p className="text-xs text-gray-500">Daftar pertemuan dan materi modul pada kelas {selectedClass}</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-semibold px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full">
                                                {meetingsForSelectedClass.length} Pertemuan
                                            </span>
                                        </div>

                                        <div className="space-y-3">
                                            {meetingsForSelectedClass.map((meeting, idx) => (
                                                <div
                                                    key={`${meeting.date}_${meeting.title}_${idx}`}
                                                    className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/70 hover:bg-gray-50 hover:border-gray-200 transition-colors"
                                                >
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                                                <span className="text-xs font-bold text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded">
                                                                    {meeting.date_string || meeting.date}
                                                                </span>
                                                                <span className="text-xs text-gray-500 font-medium">
                                                                    ({meeting.students_count} murid)
                                                                </span>
                                                            </div>
                                                            <h4 className="text-sm font-bold text-gray-800 truncate">
                                                                {meeting.title}
                                                            </h4>
                                                        </div>

                                                        <div className="flex items-center gap-1.5 flex-wrap">
                                                            {meeting.modules.length > 0 ? (
                                                                meeting.modules.map(mod => (
                                                                    <span
                                                                        key={mod.id}
                                                                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-sm ${
                                                                            mod.module_type === 'coding'
                                                                                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                                                                : 'bg-blue-100 text-blue-800 border border-blue-200'
                                                                        }`}
                                                                    >
                                                                        <i className={`bi ${mod.module_type === 'coding' ? 'bi-code-slash' : 'bi-robot'} text-xs`} />
                                                                        <span>{mod.name}</span>
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="text-xs text-gray-400 italic">
                                                                    Belum ada modul tertaut
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="space-y-6">
                                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
                                    <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <i className="bi bi-person-lines-fill text-teal-600 text-2xl" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                                        {selectedClass ? `Kelas: ${selectedClass}` : 'Pilih Kelas & Murid'}
                                    </h3>
                                    <p className="text-sm text-gray-500 max-w-md mx-auto mb-5">
                                        {selectedClass
                                            ? `Silakan pilih salah satu murid di samping untuk melihat rincian progres atau lakukan presensi pertemuan untuk kelas ini.`
                                            : 'Pilih kelas di sebelah kiri untuk melihat daftar murid dan mengelola kehadiran serta nilai.'}
                                    </p>

                                    {selectedClass && selectedClassroomId && studentsInClass.length > 0 && (
                                        <div>
                                            <button
                                                type="button"
                                                onClick={() => setIsAttendanceModalOpen(true)}
                                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow transition"
                                            >
                                                <i className="bi bi-clipboard2-check text-lg" />
                                                <span>Input Kehadiran Pertemuan Kelas Ini</span>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Jika kelas dipilih tapi murid belum dipilih, tetap tampilkan daftar pertemuan & modul kelas tersebut */}
                                {selectedClass && meetingsForSelectedClass.length > 0 && (
                                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-700">
                                                    <i className="bi bi-calendar-event text-base" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-base">Jadwal Pertemuan &amp; Modul — {selectedClass}</h3>
                                                    <p className="text-xs text-gray-500">Modul pembelajaran yang diajarkan pada setiap pertemuan di kelas ini</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-semibold px-2.5 py-1 bg-teal-50 text-teal-700 rounded-full">
                                                {meetingsForSelectedClass.length} Pertemuan
                                            </span>
                                        </div>

                                        <div className="space-y-3">
                                            {meetingsForSelectedClass.map((meeting, idx) => (
                                                <div
                                                    key={`${meeting.date}_${meeting.title}_${idx}`}
                                                    className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/70 hover:bg-gray-50 hover:border-gray-200 transition-colors"
                                                >
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 flex-wrap mb-1">
                                                                <span className="text-xs font-bold text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded">
                                                                    {meeting.date_string || meeting.date}
                                                                </span>
                                                                <span className="text-xs text-gray-500 font-medium">
                                                                    ({meeting.students_count} murid)
                                                                </span>
                                                            </div>
                                                            <h4 className="text-sm font-bold text-gray-800 truncate">
                                                                {meeting.title}
                                                            </h4>
                                                        </div>

                                                        <div className="flex items-center gap-1.5 flex-wrap">
                                                            {meeting.modules.length > 0 ? (
                                                                meeting.modules.map(mod => (
                                                                    <span
                                                                        key={mod.id}
                                                                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold shadow-sm ${
                                                                            mod.module_type === 'coding'
                                                                                ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                                                                : 'bg-blue-100 text-blue-800 border border-blue-200'
                                                                        }`}
                                                                    >
                                                                        <i className={`bi ${mod.module_type === 'coding' ? 'bi-code-slash' : 'bi-robot'} text-xs`} />
                                                                        <span>{mod.name}</span>
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="text-xs text-gray-400 italic">
                                                                    Belum ada modul tertaut
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Presensi Pertemuan Kelas */}
            {selectedClassroomId && (
                <ClassAttendanceModal
                    isOpen={isAttendanceModalOpen}
                    onClose={() => setIsAttendanceModalOpen(false)}
                    classroomId={selectedClassroomId}
                    className={selectedClass || 'Kelas'}
                    students={studentsInClass}
                    modules={modules}
                />
            )}
        </div>
    );
}
