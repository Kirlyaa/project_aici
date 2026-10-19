import { Head, Link, router, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import StudentLockBanner from '@/Components/StudentLockBanner';
import { useStudentLock } from '@/Hooks/useStudentLock';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Cell,
    LabelList,
} from 'recharts';

interface GradeEntry {
    id: number;
    meetingNumber: number;
    moduleName: string;
    bookName?: string | null;
    subModuleName?: string | null;
    moduleType: string;
    moduleId: number | null;
    bookId?: number | null;
    grades: Record<string, number | null>;
    average: number;
    date: string | null;
    notes: string | null;
}

interface SubModule {
    id: number;
    name: string;
    title?: string;
    order_index?: number;
    module_type: string;
}

interface Module {
    id: number;
    name: string;
    module_type: string;
    sub_modules?: SubModule[];
}

interface StudentInfo {
    id: number;
    name: string;
    email: string;
    avatar?: string | null;
    avatar_url?: string;
    classroom?: { id: number; name: string } | null;
    school?: { id: number; name: string } | null;
}

interface Props {
    studentId: number;
    student: StudentInfo;
    gradeEntries: GradeEntry[];
    modules: Module[];
    averages: { overall: number; robot: number; coding: number; count: number };
}

const categoriesTypeRobot = ['interaksi', 'fokus', 'robot-building', 'tools-management', 'koding'];
const categoriesTypeCoding = ['fokus', 'tools-management', 'interaksi', 'koding'];
// Semua kolom yang mungkin muncul di tabel (robot punya 5 kolom, coding 4)
const categoriesAll = categoriesTypeRobot;

// Range nilai: 3, 3.5, 4, 4.5, 5 dan 0 untuk anak yang tidak hadir
const GRADE_OPTIONS: { value: number; label: string }[] = [
    { value: 0, label: '0 (Absen)' },
    { value: 3, label: '3.0' },
    { value: 3.5, label: '3.5' },
    { value: 4, label: '4.0' },
    { value: 4.5, label: '4.5' },
    { value: 5, label: '5.0' },
];

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

const getCategoryShortLabel = (cat: string): string => {
    const labels: Record<string, string> = {
        interaksi: 'Interaksi',
        fokus: 'Fokus',
        'robot-building': 'Robot Building',
        'tools-management': 'Tools Mgmt',
        koding: 'Coding',
    };
    return labels[cat] || cat;
};

const getCategoryIcon = (cat: string): string => {
    const icons: Record<string, string> = {
        interaksi: 'bi-chat-dots-fill',
        fokus: 'bi-bullseye',
        'robot-building': 'bi-robot',
        'tools-management': 'bi-tools',
        koding: 'bi-code-slash',
    };
    return icons[cat] || 'bi-bookmark-star-fill';
};

const getCategoryColor = (cat: string): string => {
    const colors: Record<string, string> = {
        interaksi: '#0284c7', // Sky 600 - calm, clear
        fokus: '#2563eb', // Blue 600 - focused
        'robot-building': '#059669', // Emerald 600 - fresh, vibrant
        'tools-management': '#d97706', // Amber 600 - warm
        koding: '#7c3aed', // Violet 600 - modern, tech
    };
    return colors[cat] || '#64748b';
};

const getCategoryDotClass = (cat: string): string => {
    const dots: Record<string, string> = {
        interaksi: 'bg-sky-500',
        fokus: 'bg-blue-500',
        'robot-building': 'bg-emerald-500',
        'tools-management': 'bg-amber-500',
        koding: 'bg-violet-500',
    };
    return dots[cat] || 'bg-slate-400';
};

const getGradeBgClass = (val: number): string => {
    if (val === 0) return 'bg-amber-50 text-amber-800 border-amber-200/80';
    if (val >= 4.5) return 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold';
    if (val >= 3.8) return 'bg-teal-50 text-teal-800 border-teal-200 font-medium';
    if (val >= 3.0) return 'bg-sky-50 text-sky-800 border-sky-200';
    return 'bg-white text-slate-800 border-slate-200';
};

const getGradeStatus = (score: number) => {
    if (score >= 4.5) return { label: 'Sangat Baik', badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' };
    if (score >= 3.8) return { label: 'Baik', badgeClass: 'bg-blue-50 text-blue-700 border border-blue-200/60' };
    if (score >= 3.0) return { label: 'Cukup', badgeClass: 'bg-amber-50 text-amber-700 border border-amber-200/60' };
    if (score > 0) return { label: 'Perlu Latihan', badgeClass: 'bg-rose-50 text-rose-700 border border-rose-200/60' };
    return { label: 'Belum Ada', badgeClass: 'bg-slate-50 text-slate-500 border border-slate-200/60' };
};

const formatDateIndo = (dateStr: string | null | undefined): string => {
    if (!dateStr) return '—';
    try {
        const parts = dateStr.split('-');
        if (parts.length === 3) {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
            const day = parseInt(parts[2], 10);
            const monthIdx = parseInt(parts[1], 10) - 1;
            const year = parts[0];
            if (monthIdx >= 0 && monthIdx < 12) {
                return `${day} ${months[monthIdx]} ${year}`;
            }
        }
        return dateStr;
    } catch {
        return dateStr;
    }
};

const CustomCategoryTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const status = getGradeStatus(data.average);
        return (
            <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-lg border border-slate-200/80 text-xs space-y-1.5 min-w-[170px]">
                <div className="flex items-center gap-2 font-bold text-slate-800 pb-1 border-b border-slate-100">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
                    <span>{data.name}</span>
                </div>
                <div className="flex items-baseline justify-between">
                    <span className="text-slate-500 font-medium">Rata-rata:</span>
                    <span className="font-extrabold text-slate-900 text-sm">
                        {data.average.toFixed(2)} <span className="text-slate-400 text-xs font-normal">/ 5.0</span>
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Predikat:</span>
                    <span className={`px-2 py-0.5 rounded-md font-semibold text-[11px] ${status.badgeClass}`}>
                        {status.label}
                    </span>
                </div>
                <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>Total dievaluasi:</span>
                    <span className="font-semibold text-slate-600">{data.count} pertemuan</span>
                </div>
            </div>
        );
    }
    return null;
};

const CustomTrendTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-lg border border-slate-200/80 text-xs space-y-1.5 min-w-[180px]">
                <div className="font-bold text-slate-900 pb-1 border-b border-slate-100 flex items-center justify-between">
                    <span>{data.fullLabel}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{data.date}</span>
                </div>
                <p className="text-slate-600 text-[11px] line-clamp-1">{data.module}</p>
                <div className="flex items-baseline justify-between pt-1">
                    <span className="text-slate-500 font-medium">Rata-rata:</span>
                    <span className="font-extrabold text-teal-700 text-sm">{data.average.toFixed(2)} / 5.0</span>
                </div>
            </div>
        );
    }
    return null;
};

export default function GradesManager() {
    const pageProps = usePage().props as unknown as Props & { gradeScale?: number; auth?: any };
    const { studentId, student, gradeEntries, modules, averages, auth } = pageProps;
    const isSuperAdmin = auth?.user?.role === 'superadmin';
    const gradeScale = pageProps.gradeScale ?? 5;

    const { lock } = useStudentLock({ studentId, page: 'grades' });
    const isReadOnly = lock?.locked === true;

    // Local grade state for optimistic UI (avoid bad connection on every keystroke)
    const [localGrades, setLocalGrades] = useState<Record<number, Record<string, number | null>>>({});
    const [savingIds, setSavingIds] = useState<Set<number>>(new Set());
    const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
    const debounceTimers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

    // Tab state for chart view ('category' vs 'trend')
    const [chartTab, setChartTab] = useState<'category' | 'trend'>('category');

    // Merge server grades with local overrides
    const getGrades = (entry: GradeEntry) => ({ ...entry.grades, ...(localGrades[entry.id] ?? {}) });

    // Category chart data with useMemo
    const categoryChartData = useMemo(() => {
        return categoriesAll.map(cat => {
            const values = gradeEntries
                .map(e => (localGrades[e.id]?.[cat] !== undefined ? localGrades[e.id][cat] : e.grades[cat]))
                .filter((v): v is number => v !== null && v !== undefined && v > 0);
            const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
            return {
                categoryKey: cat,
                name: getCategoryLabel(cat),
                shortName: getCategoryShortLabel(cat),
                average: Number(avg.toFixed(2)),
                color: getCategoryColor(cat),
                count: values.length,
            };
        });
    }, [gradeEntries, localGrades]);

    // Meeting trend chart data with useMemo
    const meetingTrendData = useMemo(() => {
        return gradeEntries.map(e => {
            const currentGrades = { ...e.grades, ...(localGrades[e.id] ?? {}) };
            const values = Object.values(currentGrades).filter((v): v is number => v !== null && v !== undefined && v > 0);
            const avg = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : e.average;
            return {
                meetingNumber: e.meetingNumber,
                name: `P#${e.meetingNumber}`,
                fullLabel: `Pertemuan #${e.meetingNumber}`,
                module: e.subModuleName || e.moduleName,
                date: e.date || '-',
                average: Number(avg.toFixed(2)),
            };
        });
    }, [gradeEntries, localGrades]);

    const [showForm, setShowForm] = useState(false);
    const [editingEntry, setEditingEntry] = useState<GradeEntry | null>(null);
    const [selectedModuleId, setSelectedModuleId] = useState('');
    const [selectedSubModuleId, setSelectedSubModuleId] = useState('');
    const [meetingNumber, setMeetingNumber] = useState('');
    const [meetingDate, setMeetingDate] = useState('');

    const selectedModule = modules.find(m => String(m.id) === selectedModuleId);
    const availableSubModules = selectedModule?.sub_modules ?? [];
    const selectedSubModule = availableSubModules.find(sm => String(sm.id) === selectedSubModuleId);

    const activeModuleType = selectedSubModule?.module_type || selectedModule?.module_type || 'coding';

    const getCategories = (type: string) => type === 'robot' ? categoriesTypeRobot : categoriesTypeCoding;

    const handleModuleChange = (newModuleId: string) => {
        setSelectedModuleId(newModuleId);
        setSelectedSubModuleId('');
    };

    const openAddModal = () => {
        setEditingEntry(null);
        setSelectedModuleId('');
        setSelectedSubModuleId('');
        setMeetingNumber(String(gradeEntries.length > 0 ? Math.max(...gradeEntries.map(e => e.meetingNumber)) + 1 : 1));
        setMeetingDate(new Date().toISOString().split('T')[0]);
        setShowForm(true);
    };

    const openEditModal = (entry: GradeEntry) => {
        setEditingEntry(entry);
        const parentId = entry.bookId ? String(entry.bookId) : (entry.moduleId ? String(entry.moduleId) : '');
        setSelectedModuleId(parentId);
        if (entry.subModuleName && entry.moduleId) {
            setSelectedSubModuleId(String(entry.moduleId));
        } else if (entry.bookId && entry.moduleId && entry.bookId !== entry.moduleId) {
            setSelectedSubModuleId(String(entry.moduleId));
        } else {
            setSelectedSubModuleId('');
        }
        setMeetingNumber(String(entry.meetingNumber));
        setMeetingDate(entry.date || '');
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingEntry(null);
        setSelectedModuleId('');
        setSelectedSubModuleId('');
        setMeetingNumber('');
        setMeetingDate('');
    };

    const updateGrade = (entryId: number, category: string, value: number) => {
        const entry = gradeEntries.find(e => e.id === entryId);
        if (!entry) return;

        // Validasi nilai: hanya 0 atau antara 3 sampai 5
        let validValue = value;
        const allowedNums = [0, 3, 3.5, 4, 4.5, 5];
        if (!allowedNums.includes(validValue)) {
            // cari yang terdekat
            validValue = allowedNums.reduce((prev, curr) => Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev, 0);
        }

        // Optimistic local update — UI responds instantly
        setLocalGrades(prev => ({
            ...prev,
            [entryId]: { ...(prev[entryId] ?? entry.grades), [category]: validValue },
        }));

        // Mark as saving (show indicator)
        setSavedIds(prev => { const s = new Set(prev); s.delete(entryId); return s; });
        setSavingIds(prev => new Set(prev).add(entryId));

        // Debounce: cancel previous timer for this entry, then send after 700ms idle
        if (debounceTimers.current[entryId]) {
            clearTimeout(debounceTimers.current[entryId]);
        }

        debounceTimers.current[entryId] = setTimeout(() => {
            const mergedGrades = { ...entry.grades, ...(localGrades[entryId] ?? {}), [category]: validValue };

            router.put(`/tutor/grades/${entryId}`, {
                student_id: studentId,
                module_id: entry.moduleId,
                book_id: entry.bookId ?? null,
                meeting_number: entry.meetingNumber,
                module_type: entry.moduleType === 'robot' ? 'robot' : 'coding',
                meeting_date: entry.date,
                fokus: mergedGrades['fokus'] ?? 0,
                robot_building: entry.moduleType === 'robot' ? (mergedGrades['robot-building'] ?? 0) : null,
                tools_management: mergedGrades['tools-management'] ?? 0,
                interaksi: mergedGrades['interaksi'] ?? 0,
                coding: mergedGrades['koding'] ?? 0,
                notes: entry.notes,
            }, {
                preserveScroll: true,
                onSuccess: () => {
                    setSavingIds(prev => { const s = new Set(prev); s.delete(entryId); return s; });
                    setSavedIds(prev => new Set(prev).add(entryId));
                    // Clear saved indicator after 2s
                    setTimeout(() => setSavedIds(prev => { const s = new Set(prev); s.delete(entryId); return s; }), 2000);
                },
                onError: () => {
                    setSavingIds(prev => { const s = new Set(prev); s.delete(entryId); return s; });
                },
            });
        }, 700);
    };

    const handleSaveEntry = () => {
        if (!selectedModuleId) return;

        const finalModuleId = selectedSubModuleId ? Number(selectedSubModuleId) : Number(selectedModuleId);
        const finalBookId = Number(selectedModuleId);

        if (editingEntry) {
            router.put(`/tutor/grades/${editingEntry.id}`, {
                student_id: studentId,
                module_id: finalModuleId,
                book_id: finalBookId,
                sub_module_id: selectedSubModuleId ? Number(selectedSubModuleId) : null,
                meeting_number: meetingNumber ? Number(meetingNumber) : editingEntry.meetingNumber,
                module_type: activeModuleType === 'robot' ? 'robot' : 'coding',
                meeting_date: meetingDate || null,
                fokus: editingEntry.grades['fokus'] ?? 0,
                robot_building: activeModuleType === 'robot' ? (editingEntry.grades['robot-building'] ?? 0) : null,
                tools_management: editingEntry.grades['tools-management'] ?? 0,
                interaksi: editingEntry.grades['interaksi'] ?? 0,
                coding: editingEntry.grades['koding'] ?? 0,
                notes: editingEntry.notes,
            }, {
                onSuccess: () => {
                    closeForm();
                },
            });
        } else {
            router.post('/tutor/grades', {
                student_id: studentId,
                module_id: finalModuleId,
                book_id: finalBookId,
                sub_module_id: selectedSubModuleId ? Number(selectedSubModuleId) : null,
                meeting_number: meetingNumber ? Number(meetingNumber) : (gradeEntries.length > 0 ? Math.max(...gradeEntries.map(e => e.meetingNumber)) + 1 : 1),
                module_type: activeModuleType === 'robot' ? 'robot' : 'coding',
                meeting_date: meetingDate || null,
                fokus: 0,
                robot_building: 0,
                tools_management: 0,
                interaksi: 0,
                coding: 0,
            }, {
                onSuccess: () => {
                    closeForm();
                },
            });
        }
    };

    const deleteEntry = (id: number) => {
        if (window.confirm('Yakin ingin menghapus data nilai ini?')) {
            router.delete(`/tutor/grades/${id}`);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/80">
            <Head title={`Input Nilai - ${student.name}`} />

            {/* Navbar */}
            <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 shadow-2xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <Link
                                href={isSuperAdmin ? `/superadmin/students/${studentId}` : `/tutor?student=${studentId}`}
                                className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                                title="Kembali"
                            >
                                <i className="bi bi-arrow-left text-lg" />
                            </Link>
                            <img
                                src="/images/logo-aici.png"
                                alt="AICI Logo"
                                className="h-8 w-auto object-contain"
                            />
                            <div className="border-l border-slate-200 pl-3">
                                <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                    <span>Input Nilai Evaluasi</span>
                                    {isSuperAdmin && (
                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200/60">
                                            SuperAdmin
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {isSuperAdmin && (
                                <Link
                                    href="/superadmin/students"
                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
                                >
                                    Daftar Murid
                                </Link>
                            )}
                            <Link
                                href={isSuperAdmin ? `/superadmin/students/${studentId}/report` : `/tutor/reports?student=${studentId}`}
                                className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg transition shadow-2xs flex items-center gap-1.5"
                            >
                                <i className="bi bi-file-earmark-text text-sm" />
                                <span>Lihat Rapor</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Hero / Student Banner */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <img
                            src={student.avatar_url || student.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=14b8a6&color=fff&size=200`}
                            alt={student.name}
                            className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm shrink-0"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=14b8a6&color=fff&size=200`;
                            }}
                        />
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{student.name}</h1>
                                {student.classroom && (
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200/60">
                                        {student.classroom.name}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                                Input penilaian berkala per modul & kompetensi siswa • Skala penilaian 0 – {gradeScale}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 self-start md:self-auto">
                        <button
                            onClick={openAddModal}
                            disabled={isReadOnly}
                            title={isReadOnly ? 'Murid ini sedang dibuka oleh tutor lain' : undefined}
                            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <i className="bi bi-plus-lg" />
                            <span>Tambah Pertemuan</span>
                        </button>
                    </div>
                </div>

                <StudentLockBanner lock={lock} studentName={student.name} />

                {/* Statistics Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Overall Average */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs relative overflow-hidden group hover:border-teal-300 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Rata-rata Keseluruhan
                            </span>
                            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                                <i className="bi bi-trophy-fill text-base" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-slate-900">
                                {averages.overall.toFixed(2)}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">/ 5.00</span>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                            <span>{averages.count} pertemuan dievaluasi</span>
                            <span className="font-semibold text-teal-700">
                                {((averages.overall / 5) * 100).toFixed(0)}%
                            </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                            <div
                                className="h-full bg-teal-500 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(100, (averages.overall / 5) * 100)}%` }}
                            />
                        </div>
                    </div>

                    {/* Robot Building Average */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs relative overflow-hidden group hover:border-sky-300 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Rata-rata Robot Building
                            </span>
                            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                                <i className="bi bi-cpu-fill text-base" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-slate-900">
                                {averages.robot.toFixed(2)}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">/ 5.00</span>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                            <span>Perakitan & mekanik robot</span>
                            <span className="font-semibold text-sky-700">
                                {((averages.robot / 5) * 100).toFixed(0)}%
                            </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                            <div
                                className="h-full bg-sky-500 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(100, (averages.robot / 5) * 100)}%` }}
                            />
                        </div>
                    </div>

                    {/* Coding Average */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs relative overflow-hidden group hover:border-violet-300 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Rata-rata Coding
                            </span>
                            <div className="w-9 h-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                                <i className="bi bi-code-slash text-base" />
                            </div>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-slate-900">
                                {averages.coding.toFixed(2)}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">/ 5.00</span>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                            <span>Logika, alur & sintaks</span>
                            <span className="font-semibold text-violet-700">
                                {((averages.coding / 5) * 100).toFixed(0)}%
                            </span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                            <div
                                className="h-full bg-violet-500 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(100, (averages.coding / 5) * 100)}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Add / Edit Entry Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 w-full max-w-lg">
                            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
                                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center text-sm">
                                        <i className={`bi ${editingEntry ? 'bi-pencil-square' : 'bi-plus-circle-fill'}`} />
                                    </div>
                                    <span>{editingEntry ? `Edit Pertemuan #${editingEntry.meetingNumber}` : 'Tambah Pertemuan Baru'}</span>
                                </h3>
                                <button
                                    onClick={closeForm}
                                    className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
                                >
                                    <i className="bi bi-x-lg text-sm" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                        Pilih Modul / Buku <span className="text-rose-500">*</span>
                                    </label>
                                    <select
                                        value={selectedModuleId}
                                        onChange={e => handleModuleChange(e.target.value)}
                                        className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
                                    >
                                        <option value="">-- Pilih Modul / Buku --</option>
                                        {modules.map(m => (
                                            <option key={m.id} value={m.id}>
                                                {m.name} ({m.module_type === 'robot' ? 'Robot' : 'Coding'}{m.sub_modules && m.sub_modules.length > 0 ? ` • ${m.sub_modules.length} Sub-Modul` : ''})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {selectedModule && availableSubModules.length > 0 && (
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                                            <span>Pilih Sub-Modul</span>
                                            <span className="text-teal-600 text-[11px] font-normal">
                                                {availableSubModules.length} tersedia
                                            </span>
                                        </label>
                                        <select
                                            value={selectedSubModuleId}
                                            onChange={e => setSelectedSubModuleId(e.target.value)}
                                            className="w-full px-3.5 py-2.5 text-sm border border-teal-200 bg-teal-50/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
                                        >
                                            <option value="">-- Pilih Sub Modul (Spesifik) --</option>
                                            {availableSubModules.map(sm => (
                                                <option key={sm.id} value={sm.id}>
                                                    {sm.order_index ? `${sm.order_index}. ` : ''}{sm.title || sm.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                            Nomor Pertemuan <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={meetingNumber}
                                            onChange={e => setMeetingNumber(e.target.value)}
                                            placeholder={String(gradeEntries.length > 0 ? Math.max(...gradeEntries.map(e => e.meetingNumber)) + 1 : 1)}
                                            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                            Tanggal Pertemuan
                                        </label>
                                        <input
                                            type="date"
                                            value={meetingDate}
                                            onChange={e => setMeetingDate(e.target.value)}
                                            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs space-y-1">
                                    <div className="flex items-center gap-1.5 font-medium text-slate-700">
                                        <i className="bi bi-info-circle-fill text-teal-600" />
                                        <span>Kategori penilaian aktif:</span>
                                    </div>
                                    <p className="text-slate-600 text-[11px] pl-4">
                                        {activeModuleType === 'robot'
                                            ? 'Fokus, Robot Building, Tools Management, Interaksi, Koding'
                                            : 'Fokus, Tools Management, Interaksi, Koding (tanpa Robot Building)'}
                                    </p>
                                </div>

                                <div className="flex gap-2.5 pt-3">
                                    <button
                                        onClick={handleSaveEntry}
                                        disabled={!selectedModuleId}
                                        className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-xl text-xs sm:text-sm font-semibold hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-2xs"
                                    >
                                        {editingEntry ? 'Simpan Perubahan' : 'Lanjut Input Nilai'}
                                    </button>
                                    <button
                                        onClick={closeForm}
                                        className="px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-semibold hover:bg-slate-50 transition"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Grades Table Section */}
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                <i className="bi bi-table text-teal-600" />
                                <span>Tabel Nilai Per Pertemuan</span>
                            </h3>
                            <p className="text-xs text-slate-500 mt-0.5">
                                Nilai otomatis tersimpan saat Anda memilih opsi dropdown. Pilihan nilai: 3.0, 3.5, 4.0, 4.5, 5.0, atau 0 (Absen).
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 font-medium border border-emerald-200/60">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> 4.5 - 5.0 Sangat Baik
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-teal-50 text-teal-700 font-medium border border-teal-200/60">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" /> 3.5 - 4.0 Baik
                            </span>
                        </div>
                    </div>

                    {gradeEntries.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3 text-2xl">
                                <i className="bi bi-inbox" />
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm">Belum Ada Data Nilai</h4>
                            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                                Mulai tambahkan data pertemuan pertama murid dengan menekan tombol Tambah Pertemuan di atas.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                                        <th className="px-4 py-3.5">Pertemuan</th>
                                        <th className="px-4 py-3.5">Modul & Sub-Modul</th>
                                        <th className="px-2 py-3.5 text-center">Tipe</th>
                                        {categoriesAll.map(cat => (
                                            <th key={cat} className="px-2 py-3.5 text-center">
                                                <span className="inline-flex items-center justify-center gap-1.5">
                                                    <span
                                                        className="w-2 h-2 rounded-full shrink-0"
                                                        style={{ backgroundColor: getCategoryColor(cat) }}
                                                    />
                                                    <span>{getCategoryShortLabel(cat)}</span>
                                                </span>
                                            </th>
                                        ))}
                                        <th className="px-3 py-3.5 text-center">Rata-rata</th>
                                        <th className="px-3 py-3.5 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs">
                                    {gradeEntries.map((entry) => (
                                        <tr key={entry.id} className="hover:bg-slate-50/70 transition-colors">
                                            {/* Pertemuan */}
                                            <td className="px-4 py-3.5 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-lg text-xs">
                                                        #{entry.meetingNumber}
                                                    </span>
                                                    {entry.date ? (
                                                        <span className="text-[11px] text-slate-500 font-medium">
                                                            {entry.date}
                                                        </span>
                                                    ) : (
                                                        <span className="text-[11px] text-slate-400 italic">-</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Modul */}
                                            <td className="px-4 py-3.5 max-w-[240px]">
                                                {entry.subModuleName ? (
                                                    <div>
                                                        <p className="font-semibold text-slate-900 truncate" title={entry.subModuleName}>
                                                            {entry.subModuleName}
                                                        </p>
                                                        {entry.bookName && (
                                                            <span className="inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 truncate max-w-[200px]" title={entry.bookName}>
                                                                <i className="bi bi-journal-bookmark text-teal-600" />
                                                                <span className="truncate">{entry.bookName}</span>
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="font-semibold text-slate-900 truncate" title={entry.moduleName}>
                                                        {entry.moduleName}
                                                    </p>
                                                )}
                                            </td>

                                            {/* Tipe Modul */}
                                            <td className="px-2 py-3.5 text-center whitespace-nowrap">
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                                        entry.moduleType === 'robot'
                                                            ? 'bg-sky-50 text-sky-700 border-sky-200/60'
                                                            : 'bg-indigo-50 text-indigo-700 border-indigo-200/60'
                                                    }`}
                                                >
                                                    {entry.moduleType === 'robot' ? 'Robot' : 'Coding'}
                                                </span>
                                            </td>

                                            {/* Category Score Dropdowns */}
                                            {categoriesAll.map(cat => {
                                                const isEditable = getCategories(entry.moduleType).includes(cat);
                                                const currentGrades = getGrades(entry);
                                                const val = currentGrades[cat] !== undefined && currentGrades[cat] !== null ? Number(currentGrades[cat]) : 0;

                                                return (
                                                    <td key={cat} className="px-1.5 py-3 text-center whitespace-nowrap">
                                                        {isEditable ? (
                                                            <select
                                                                disabled={isReadOnly}
                                                                value={val}
                                                                onChange={e => updateGrade(entry.id, cat, parseFloat(e.target.value))}
                                                                className={`w-[88px] text-xs font-semibold rounded-lg px-2 py-1.5 border transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:bg-slate-100 disabled:text-slate-400 ${getGradeBgClass(val)}`}
                                                            >
                                                                {GRADE_OPTIONS.map(opt => (
                                                                    <option key={opt.value} value={opt.value}>
                                                                        {opt.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        ) : (
                                                            <span className="text-slate-300 font-bold select-none">—</span>
                                                        )}
                                                    </td>
                                                );
                                            })}

                                            {/* Rata-rata */}
                                            <td className="px-3 py-3.5 text-center whitespace-nowrap">
                                                <div className="inline-flex flex-col items-center">
                                                    <span className="text-sm font-extrabold text-teal-700 bg-teal-50/80 px-2 py-0.5 rounded-md border border-teal-200/60">
                                                        {entry.average.toFixed(2)}
                                                    </span>
                                                    {savingIds.has(entry.id) && (
                                                        <span className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                                                            <i className="bi bi-arrow-repeat animate-spin" /> simpan...
                                                        </span>
                                                    )}
                                                    {savedIds.has(entry.id) && (
                                                        <span className="text-[10px] text-emerald-600 mt-1 flex items-center gap-0.5 font-medium">
                                                            <i className="bi bi-check-circle-fill text-[9px]" /> tersimpan
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Aksi */}
                                            <td className="px-3 py-3.5 text-center whitespace-nowrap">
                                                <div className="inline-flex items-center justify-center gap-1">
                                                    <button
                                                        onClick={() => openEditModal(entry)}
                                                        disabled={isReadOnly}
                                                        title={isReadOnly ? 'Murid ini sedang dibuka oleh tutor lain' : 'Edit info modul / tanggal pertemuan'}
                                                        className="w-8 h-8 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-teal-50 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                                    >
                                                        <i className="bi bi-pencil-square text-sm" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteEntry(entry.id)}
                                                        disabled={isReadOnly}
                                                        title={isReadOnly ? 'Murid ini sedang dibuka oleh tutor lain' : 'Hapus data nilai'}
                                                        className="w-8 h-8 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                                    >
                                                        <i className="bi bi-trash3 text-sm" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Chart Section - Recharts Interactive Bar Chart */}
                {gradeEntries.length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
                        {/* Chart Header with View Tabs */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center text-sm">
                                        <i className="bi bi-bar-chart-fill" />
                                    </div>
                                    <span>Diagram Perkembangan Nilai</span>
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Visualisasi perbandingan capaian kompetensi dan tren evaluasi per pertemuan (Skala 0 – {gradeScale})
                                </p>
                            </div>

                            {/* View Switcher Tabs */}
                            <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
                                <button
                                    onClick={() => setChartTab('category')}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                                        chartTab === 'category'
                                            ? 'bg-white text-slate-900 shadow-xs'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    <i className="bi bi-grid-fill text-xs" />
                                    <span>Rata-rata Kategori</span>
                                </button>
                                <button
                                    onClick={() => setChartTab('trend')}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                                        chartTab === 'trend'
                                            ? 'bg-white text-slate-900 shadow-xs'
                                            : 'text-slate-600 hover:text-slate-900'
                                    }`}
                                >
                                    <i className="bi bi-graph-up text-xs" />
                                    <span>Tren Pertemuan</span>
                                </button>
                            </div>
                        </div>

                        {/* Chart Visualization */}
                        <div className="mt-4">
                            {chartTab === 'category' ? (
                                <div>
                                    <div className="h-72 w-full pt-4">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={categoryChartData} margin={{ top: 25, right: 15, left: -15, bottom: 20 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis
                                                    dataKey="shortName"
                                                    tickLine={false}
                                                    axisLine={{ stroke: '#e2e8f0' }}
                                                    tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }}
                                                    dy={8}
                                                />
                                                <YAxis
                                                    domain={[0, 5]}
                                                    ticks={[0, 1, 2, 3, 4, 5]}
                                                    tickLine={false}
                                                    axisLine={{ stroke: '#e2e8f0' }}
                                                    tick={{ fill: '#64748b', fontSize: 11 }}
                                                    tickFormatter={(v) => v.toFixed(1)}
                                                />
                                                <Tooltip content={<CustomCategoryTooltip />} cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }} />
                                                <Bar dataKey="average" radius={[8, 8, 0, 0]} maxBarSize={56} animationDuration={600}>
                                                    {categoryChartData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                    <LabelList
                                                        dataKey="average"
                                                        position="top"
                                                        formatter={(val: any) => typeof val === 'number' && val > 0 ? val.toFixed(2) : '-'}
                                                        style={{ fill: '#334155', fontSize: 12, fontWeight: 700 }}
                                                        offset={8}
                                                    />
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <p className="text-center text-xs text-slate-400 mt-2 font-medium">
                                        Rata-rata Per Kategori Kompetensi (Skala 0 – 5.0)
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <div className="h-72 w-full pt-4">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={meetingTrendData} margin={{ top: 25, right: 15, left: -15, bottom: 20 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                                <XAxis
                                                    dataKey="name"
                                                    tickLine={false}
                                                    axisLine={{ stroke: '#e2e8f0' }}
                                                    tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }}
                                                    dy={8}
                                                />
                                                <YAxis
                                                    domain={[0, 5]}
                                                    ticks={[0, 1, 2, 3, 4, 5]}
                                                    tickLine={false}
                                                    axisLine={{ stroke: '#e2e8f0' }}
                                                    tick={{ fill: '#64748b', fontSize: 11 }}
                                                    tickFormatter={(v) => v.toFixed(1)}
                                                />
                                                <Tooltip content={<CustomTrendTooltip />} cursor={{ fill: 'rgba(241, 245, 249, 0.6)' }} />
                                                <Bar dataKey="average" fill="#0d9488" radius={[8, 8, 0, 0]} maxBarSize={48} animationDuration={600}>
                                                    <LabelList
                                                        dataKey="average"
                                                        position="top"
                                                        formatter={(val: any) => typeof val === 'number' && val > 0 ? val.toFixed(2) : '-'}
                                                        style={{ fill: '#0f766e', fontSize: 12, fontWeight: 700 }}
                                                        offset={8}
                                                    />
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <p className="text-center text-xs text-slate-400 mt-2 font-medium">
                                        Tren Rata-rata Nilai Setiap Pertemuan (P#1, P#2, dst.)
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Per Category Metric Cards */}
                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
                                Rincian Capaian 5 Kompetensi
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                                {categoryChartData.map(cat => {
                                    const percentage = Math.min(100, (cat.average / 5) * 100);
                                    const status = getGradeStatus(cat.average);

                                    return (
                                        <div
                                            key={cat.categoryKey}
                                            className="bg-slate-50/70 hover:bg-white rounded-xl p-3.5 border border-slate-200/70 transition-all shadow-2xs group"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 truncate" title={cat.name}>
                                                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                                                    <span className="truncate">{cat.shortName}</span>
                                                </span>
                                                <span className="text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200/80 shadow-2xs shrink-0">
                                                    {cat.average > 0 ? cat.average.toFixed(2) : '-'}
                                                </span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-200/70 rounded-full overflow-hidden mb-2">
                                                <div
                                                    className="h-full rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${percentage}%`,
                                                        backgroundColor: cat.color,
                                                    }}
                                                />
                                            </div>
                                            <div className="flex items-center justify-between text-[11px] text-slate-500">
                                                <span className="truncate">{cat.count > 0 ? `${cat.count}x dinilai` : 'Belum ada nilai'}</span>
                                                {cat.average > 0 && (
                                                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${status.badgeClass}`}>
                                                        {status.label}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Bottom Action Footer */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                        onClick={openAddModal}
                        disabled={isReadOnly}
                        title={isReadOnly ? 'Murid ini sedang dibuka oleh tutor lain' : undefined}
                        className="flex-1 px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition shadow-2xs"
                    >
                        <i className="bi bi-plus-lg" />
                        <span>Tambah Pertemuan Baru</span>
                    </button>
                    <Link
                        href={isSuperAdmin ? `/superadmin/students/${studentId}` : `/tutor?student=${studentId}`}
                        className="px-6 py-3 border border-slate-200 bg-white text-slate-700 rounded-xl font-semibold hover:bg-slate-50 text-center transition shadow-2xs flex items-center justify-center gap-2"
                    >
                        <i className="bi bi-arrow-left" />
                        <span>Kembali</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
