import { Head, Link, router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';
import FlashToast from '@/Components/FlashToast';

interface Student {
    id: number;
    name: string;
    email: string;
    avatar: string;
    status: string;
    tutorId?: number | null;
    tutorName?: string | null;
}

interface Tutor {
    id: number;
    name: string;
    email: string;
    avatar: string;
}

interface ModuleItem {
    id: number;
    name: string;
    module_type?: string;
}

interface Classroom {
    id: number;
    name: string;
    photo: string;
    description: string | null;
    tutor_id?: number | null;
    tutor?: Tutor | null;
    studentsCount: number;
    students: Student[];
}

interface Props {
    classrooms: Classroom[];
    unassignedStudents: Student[];
    tutors?: Tutor[];
    modules?: ModuleItem[];
    search: string;
}

export default function ClassroomManagement() {
    const { classrooms, unassignedStudents, tutors = [], modules = [], search: initialSearch } = usePage().props as unknown as Props;

    const [searchTerm, setSearchTerm] = useState(initialSearch || '');
    const [selectedClass, setSelectedClass] = useState<Classroom | null>(classrooms[0] || null);

    // Modal Create / Edit Kelas
    const [showClassModal, setShowClassModal] = useState(false);
    const [editingClass, setEditingClass] = useState<Classroom | null>(null);
    const [className, setClassName] = useState('');
    const [classDesc, setClassDesc] = useState('');
    const [classTutorId, setClassTutorId] = useState<string>('');
    const [classPhoto, setClassPhoto] = useState<File | null>(null);
    const [classFormErrors, setClassFormErrors] = useState<Record<string, string>>({});
    const [isSubmittingClass, setIsSubmittingClass] = useState(false);

    // Modal Tambah Murid ke Kelas (Mendukung Single & Bulk)
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
    const [autoAssignTutorOnAdd, setAutoAssignTutorOnAdd] = useState(true);

    // Modal Pindah Kelas
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [studentToTransfer, setStudentToTransfer] = useState<Student | null>(null);
    const [targetClassId, setTargetClassId] = useState<string>('');
    const [autoAssignTutorOnTransfer, setAutoAssignTutorOnTransfer] = useState(true);

    // Modal Jadwalkan Sesi Sekaligus (Batch Scheduling)
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [batchForm, setBatchForm] = useState({
        title: '',
        date: new Date().toISOString().split('T')[0],
        date_string: '',
        status: 'akan-datang',
        description: '',
        admin_note_for_tutor: '',
        override_tutor_id: '',
        module_ids: [] as number[],
        tools: [] as string[],
    });
    const [toolInput, setToolInput] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/superadmin/classes', { search: searchTerm }, { preserveState: true });
    };

    const openCreateClassModal = () => {
        setEditingClass(null);
        setClassName('');
        setClassDesc('');
        setClassTutorId('');
        setClassPhoto(null);
        setClassFormErrors({});
        setShowClassModal(true);
    };

    const openEditClassModal = (cls: Classroom) => {
        setEditingClass(cls);
        setClassName(cls.name);
        setClassDesc(cls.description || '');
        setClassTutorId(cls.tutor_id ? String(cls.tutor_id) : '');
        setClassPhoto(null);
        setClassFormErrors({});
        setShowClassModal(true);
    };

    const handleClassSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setClassFormErrors({});

        if (editingClass) {
            // Jika ada foto baru yang diunggah, gunakan FormData dengan POST + _method: PUT
            if (classPhoto) {
                const formData = new FormData();
                formData.append('_method', 'PUT');
                formData.append('name', className);
                formData.append('description', classDesc);
                formData.append('tutor_id', classTutorId || '');
                formData.append('photo', classPhoto);

                router.post(`/superadmin/classes/${editingClass.id}`, formData, {
                    forceFormData: true,
                    preserveScroll: true,
                    onStart: () => setIsSubmittingClass(true),
                    onSuccess: () => {
                        setShowClassModal(false);
                    },
                    onError: (errs) => {
                        setClassFormErrors(errs);
                    },
                    onFinish: () => setIsSubmittingClass(false),
                });
            } else {
                // Jika tidak ada upload file gambar, kirim langsung via PUT JSON
                router.put(`/superadmin/classes/${editingClass.id}`, {
                    name: className,
                    description: classDesc,
                    tutor_id: classTutorId ? Number(classTutorId) : null,
                }, {
                    preserveScroll: true,
                    onStart: () => setIsSubmittingClass(true),
                    onSuccess: () => {
                        setShowClassModal(false);
                    },
                    onError: (errs) => {
                        setClassFormErrors(errs);
                    },
                    onFinish: () => setIsSubmittingClass(false),
                });
            }
        } else {
            // Mode Buat Kelas Baru
            const formData = new FormData();
            formData.append('name', className);
            formData.append('description', classDesc);
            formData.append('tutor_id', classTutorId || '');
            if (classPhoto) {
                formData.append('photo', classPhoto);
            }

            router.post('/superadmin/classes', formData, {
                forceFormData: true,
                preserveScroll: true,
                onStart: () => setIsSubmittingClass(true),
                onSuccess: () => {
                    setShowClassModal(false);
                },
                onError: (errs) => {
                    setClassFormErrors(errs);
                },
                onFinish: () => setIsSubmittingClass(false),
            });
        }
    };

    const handleDeleteClass = (cls: Classroom) => {
        if (confirm(`Yakin ingin menghapus kelas "${cls.name}"? Murid di dalamnya akan otomatis dipindahkan ke status Tanpa Kelas.`)) {
            router.delete(`/superadmin/classes/${cls.id}`, {
                onSuccess: () => {
                    if (selectedClass?.id === cls.id) {
                        setSelectedClass(classrooms.find(c => c.id !== cls.id) || null);
                    }
                },
            });
        }
    };

    const handleAssignStudent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClass || selectedStudentIds.length === 0) return;

        router.post(`/superadmin/classes/${selectedClass.id}/assign`, {
            student_ids: selectedStudentIds,
            auto_assign_tutor: autoAssignTutorOnAdd,
        }, {
            onSuccess: () => {
                setShowAssignModal(false);
                setSelectedStudentIds([]);
            },
        });
    };

    const openTransferModal = (student: Student) => {
        setStudentToTransfer(student);
        const otherClasses = classrooms.filter(c => c.id !== selectedClass?.id);
        setTargetClassId(otherClasses[0]?.id ? String(otherClasses[0].id) : '');
        setShowTransferModal(true);
    };

    const handleTransferStudent = (e: React.FormEvent) => {
        e.preventDefault();
        if (!studentToTransfer || !targetClassId) return;

        router.post('/superadmin/classes/transfer', {
            student_id: studentToTransfer.id,
            target_classroom_id: targetClassId,
            auto_assign_tutor: autoAssignTutorOnTransfer,
        }, {
            onSuccess: () => {
                setShowTransferModal(false);
                setStudentToTransfer(null);
            },
        });
    };

    const handleRemoveStudent = (student: Student) => {
        if (confirm(`Keluarkan ${student.name} dari kelas "${selectedClass?.name}"? Murid akan menjadi murid tanpa kelas.`)) {
            router.delete(`/superadmin/classes/students/${student.id}/remove`);
        }
    };

    const openScheduleModal = () => {
        if (!selectedClass) return;
        setBatchForm({
            title: `Sesi Kelas ${selectedClass.name}`,
            date: new Date().toISOString().split('T')[0],
            date_string: '',
            status: 'akan-datang',
            description: '',
            admin_note_for_tutor: '',
            override_tutor_id: selectedClass.tutor_id ? String(selectedClass.tutor_id) : '',
            module_ids: [],
            tools: [],
        });
        setToolInput('');
        setShowScheduleModal(true);
    };

    const toggleModule = (id: number) => {
        setBatchForm(prev => ({
            ...prev,
            module_ids: prev.module_ids.includes(id)
                ? prev.module_ids.filter(x => x !== id)
                : [...prev.module_ids, id],
        }));
    };

    const addTool = () => {
        const val = toolInput.trim();
        if (val && !batchForm.tools.includes(val)) {
            setBatchForm(prev => ({ ...prev, tools: [...prev.tools, val] }));
            setToolInput('');
        }
    };

    const removeTool = (item: string) => {
        setBatchForm(prev => ({ ...prev, tools: prev.tools.filter(t => t !== item) }));
    };

    const handleScheduleBatchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClass) return;

        router.post(`/superadmin/classes/${selectedClass.id}/schedule-session`, {
            title: batchForm.title,
            date: batchForm.date,
            date_string: batchForm.date_string,
            status: batchForm.status,
            description: batchForm.description,
            admin_note_for_tutor: batchForm.admin_note_for_tutor,
            override_tutor_id: batchForm.override_tutor_id ? Number(batchForm.override_tutor_id) : null,
            module_ids: batchForm.module_ids,
            tools: batchForm.tools,
        }, {
            onSuccess: () => {
                setShowScheduleModal(false);
            },
        });
    };

    // Update selectedClass after prop update
    React.useEffect(() => {
        if (selectedClass) {
            const updated = classrooms.find(c => c.id === selectedClass.id);
            if (updated) setSelectedClass(updated);
        } else if (classrooms.length > 0) {
            setSelectedClass(classrooms[0]);
        }
    }, [classrooms]);

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            <Head title="Kelola Kelas" />
            <FlashToast />

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <Link href="/superadmin" className="text-gray-600 hover:text-gray-900 transition-colors mr-1" title="Kembali ke Dashboard">
                                <i className="bi bi-arrow-left text-xl" />
                            </Link>
                            <img
                                src="/images/logo-aici.png"
                                alt="AICI Logo"
                                className="h-8 w-auto object-contain"
                            />
                            <div className="border-l border-gray-300 pl-3">
                                <p className="text-xs font-semibold text-gray-600">Kelola Kelas & Distribusi Murid</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={openCreateClassModal}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all shadow-sm"
                            >
                                <i className="bi bi-plus-lg" /> Tambah Kelas
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Header & Unassigned Stat Banner */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manajemen Kelas</h1>
                        <p className="text-gray-600 mt-1 text-sm">
                            Atur nama kelas, foto sampul, dan kelola murid (tambah, pindah, atau keluarkan).
                        </p>
                    </div>

                    <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
                            <i className="bi bi-person-exclamation text-xl" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium">Murid Tanpa Kelas</p>
                            <p className="text-lg font-bold text-gray-900">{unassignedStudents.length} Siswa</p>
                        </div>
                    </div>
                </div>

                {/* Search and Grid Layout */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column: Daftar Kelas */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-bold text-gray-900 text-base">Daftar Kelas ({classrooms.length})</h2>
                        </div>

                        {/* Search Input */}
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                placeholder="Cari nama kelas..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <i className="bi bi-search absolute left-3.5 top-2.5 text-gray-400 text-sm" />
                        </form>

                        <div className="space-y-3">
                            {classrooms.map(cls => {
                                const isSelected = selectedClass?.id === cls.id;
                                return (
                                    <div
                                        key={cls.id}
                                        onClick={() => setSelectedClass(cls)}
                                        className={`group cursor-pointer rounded-xl border transition-all p-3.5 flex items-center gap-3.5 ${
                                            isSelected
                                                ? 'bg-indigo-50/70 border-indigo-500 shadow-sm ring-1 ring-indigo-500'
                                                : 'bg-white border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <img
                                            src={cls.photo}
                                            alt={cls.name}
                                            className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-gray-100"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-sm text-gray-900 truncate">{cls.name}</h3>
                                            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                                                {cls.description || 'Tidak ada deskripsi'}
                                            </p>
                                            <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs font-semibold">
                                                <span className="text-indigo-700 flex items-center gap-1">
                                                    <i className="bi bi-people-fill" /> {cls.studentsCount} Murid
                                                </span>
                                                {cls.tutor ? (
                                                    <span className="text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded text-[11px] flex items-center gap-1">
                                                        <i className="bi bi-person-badge" /> {cls.tutor.name}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400 font-normal italic text-[11px]">
                                                        Belum ada tutor
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); openEditClassModal(cls); }}
                                                className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-white rounded transition-colors"
                                                title="Edit Kelas"
                                            >
                                                <i className="bi bi-pencil" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); handleDeleteClass(cls); }}
                                                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-white rounded transition-colors"
                                                title="Hapus Kelas"
                                            >
                                                <i className="bi bi-trash" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}

                            {classrooms.length === 0 && (
                                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                                    <i className="bi bi-folder-x text-3xl text-gray-400" />
                                    <p className="text-sm text-gray-500 mt-2">Belum ada kelas yang dibuat.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Detail Kelas Terpilih & Murid di Dalamnya */}
                    <div className="lg:col-span-2 space-y-6">
                        {selectedClass ? (
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                {/* Banner Kelas */}
                                <div className="relative h-44 w-full bg-gray-900 overflow-hidden">
                                    <img
                                        src={selectedClass.photo}
                                        alt={selectedClass.name}
                                        className="w-full h-full object-cover opacity-60"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-900/30 to-transparent" />
                                    <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                                        <div className="text-white">
                                            <div className="flex items-center gap-2">
                                                <span className="px-2.5 py-0.5 bg-indigo-500/80 backdrop-blur-md text-[11px] font-semibold rounded-full uppercase tracking-wider">
                                                    Detail Kelas
                                                </span>
                                                {selectedClass.tutor ? (
                                                    <span className="px-2.5 py-0.5 bg-teal-500/80 backdrop-blur-md text-[11px] font-semibold rounded-full flex items-center gap-1">
                                                        <i className="bi bi-person-badge" /> Wali / Tutor: {selectedClass.tutor.name}
                                                    </span>
                                                ) : (
                                                    <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-md text-[11px] font-normal rounded-full text-gray-200">
                                                        Belum ada tutor wali
                                                    </span>
                                                )}
                                            </div>
                                            <h2 className="text-2xl font-bold mt-1 text-white">{selectedClass.name}</h2>
                                            <p className="text-xs text-gray-200 mt-0.5 line-clamp-1">
                                                {selectedClass.description || 'Tidak ada deskripsi'}
                                            </p>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={openScheduleModal}
                                                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                                                title="Buat Jadwal Sesi Sekaligus untuk Seluruh Murid di Kelas Ini"
                                            >
                                                <i className="bi bi-calendar-plus" /> Buat Sesi Kelas
                                            </button>
                                            <button
                                                onClick={() => openEditClassModal(selectedClass)}
                                                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                                            >
                                                <i className="bi bi-pencil" /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClass(selectedClass)}
                                                className="px-3 py-1.5 bg-red-600/80 hover:bg-red-700 backdrop-blur-md text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                                            >
                                                <i className="bi bi-trash" /> Hapus
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Bagian Daftar Murid dalam Kelas */}
                                <div className="p-6 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">
                                                Murid di Kelas Ini ({selectedClass.students.length})
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                Kelola murid yang terdaftar di {selectedClass.name}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => setShowAssignModal(true)}
                                            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                                        >
                                            <i className="bi bi-person-plus-fill" /> Masukkan Murid
                                        </button>
                                    </div>

                                    {/* Table Murid */}
                                    <div className="overflow-x-auto border border-gray-100 rounded-xl">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold border-b border-gray-100">
                                                    <th className="py-3 px-4">Murid</th>
                                                    <th className="py-3 px-4">Tutor Pembimbing</th>
                                                    <th className="py-3 px-4">Status</th>
                                                    <th className="py-3 px-4 text-right">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 text-sm">
                                                {selectedClass.students.map(st => (
                                                    <tr key={st.id} className="hover:bg-gray-50/80 transition-colors">
                                                        <td className="py-3 px-4">
                                                            <div className="flex items-center gap-3">
                                                                <img
                                                                    src={st.avatar}
                                                                    alt={st.name}
                                                                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                                                />
                                                                <div>
                                                                    <p className="font-semibold text-gray-900">{st.name}</p>
                                                                    <p className="text-xs text-gray-500">{st.email}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            {st.tutorName ? (
                                                                <span className="text-xs font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                                                                    <i className="bi bi-person-fill" /> {st.tutorName}
                                                                </span>
                                                            ) : (
                                                                <span className="text-xs text-gray-400 italic">Belum ada</span>
                                                            )}
                                                        </td>
                                                        <td className="py-3 px-4">
                                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                                                                st.status === 'aktif' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                                {st.status === 'aktif' ? 'Aktif' : 'Pending'}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 px-4 text-right">
                                                            <div className="inline-flex items-center gap-2">
                                                                <button
                                                                    onClick={() => openTransferModal(st)}
                                                                    className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-md transition-colors"
                                                                    title="Pindahkan Murid ke Kelas Lain"
                                                                >
                                                                    <i className="bi bi-arrow-left-right mr-1" /> Pindah
                                                                </button>
                                                                <button
                                                                    onClick={() => handleRemoveStudent(st)}
                                                                    className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-md transition-colors"
                                                                    title="Keluarkan dari Kelas"
                                                                >
                                                                    <i className="bi bi-box-arrow-right mr-1" /> Keluarkan
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}

                                                {selectedClass.students.length === 0 && (
                                                    <tr>
                                                        <td colSpan={3} className="py-8 text-center text-gray-400 text-sm">
                                                            Belum ada murid di dalam kelas ini.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
                                Silakan pilih kelas di sebelah kiri atau klik Tambah Kelas.
                            </div>
                        )}

                        {/* Murid Tanpa Kelas Preview */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                                        <i className="bi bi-person-x-fill text-amber-500" />
                                        Murid Belum Memiliki Kelas ({unassignedStudents.length})
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        Daftar murid aktif yang belum dimasukkan ke kelas manapun
                                    </p>
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-3">
                                {unassignedStudents.map(st => (
                                    <div key={st.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <img
                                                src={st.avatar}
                                                alt={st.name}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                            <div className="min-w-0">
                                                <p className="font-bold text-xs text-gray-900 truncate">{st.name}</p>
                                                <p className="text-[11px] text-gray-500 truncate">{st.email}</p>
                                            </div>
                                        </div>

                                        {selectedClass && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    router.post(`/superadmin/classes/${selectedClass.id}/assign`, {
                                                        student_id: st.id,
                                                    });
                                                }}
                                                className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded text-xs font-semibold whitespace-nowrap transition-colors"
                                            >
                                                + Ke {selectedClass.name.substring(0, 10)}...
                                            </button>
                                        )}
                                    </div>
                                ))}

                                {unassignedStudents.length === 0 && (
                                    <p className="text-xs text-gray-400 italic col-span-2">Semua murid sudah memiliki kelas.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Tambah / Edit Kelas */}
            {showClassModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-lg text-gray-900">
                                {editingClass ? 'Edit Informasi Kelas' : 'Buat Kelas Baru'}
                            </h3>
                            <button
                                onClick={() => setShowClassModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <i className="bi bi-x-lg" />
                            </button>
                        </div>

                        <form onSubmit={handleClassSubmit} className="space-y-4">
                            {classFormErrors.general && (
                                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg">
                                    {classFormErrors.general}
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Nama Kelas <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Contoh: Robotics Explorer A"
                                    value={className}
                                    onChange={e => {
                                        setClassName(e.target.value);
                                        if (classFormErrors.name) {
                                            setClassFormErrors(prev => ({ ...prev, name: '' }));
                                        }
                                    }}
                                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                                        classFormErrors.name ? 'border-red-500 bg-red-50/50' : 'border-gray-300'
                                    }`}
                                />
                                {classFormErrors.name && (
                                    <p className="text-xs text-red-500 mt-1 font-medium">{classFormErrors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Tutor Wali Kelas (Opsional)
                                </label>
                                <select
                                    value={classTutorId}
                                    onChange={e => {
                                        setClassTutorId(e.target.value);
                                        if (classFormErrors.tutor_id) {
                                            setClassFormErrors(prev => ({ ...prev, tutor_id: '' }));
                                        }
                                    }}
                                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white ${
                                        classFormErrors.tutor_id ? 'border-red-500 bg-red-50/50' : 'border-gray-300'
                                    }`}
                                >
                                    <option value="">- Tanpa Tutor / Pilih Tutor -</option>
                                    {tutors.map(t => (
                                        <option key={t.id} value={t.id}>
                                            {t.name} ({t.email})
                                        </option>
                                    ))}
                                </select>
                                {classFormErrors.tutor_id && (
                                    <p className="text-xs text-red-500 mt-1 font-medium">{classFormErrors.tutor_id}</p>
                                )}
                                <p className="text-[11px] text-gray-500 mt-1">
                                    Tutor yang dipilih akan menjadi penanggung jawab / wali untuk kelas ini.
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Deskripsi (Opsional)
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Deskripsi singkat mengenai kelas..."
                                    value={classDesc}
                                    onChange={e => {
                                        setClassDesc(e.target.value);
                                        if (classFormErrors.description) {
                                            setClassFormErrors(prev => ({ ...prev, description: '' }));
                                        }
                                    }}
                                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none ${
                                        classFormErrors.description ? 'border-red-500 bg-red-50/50' : 'border-gray-300'
                                    }`}
                                />
                                {classFormErrors.description && (
                                    <p className="text-xs text-red-500 mt-1 font-medium">{classFormErrors.description}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Foto Sampul Kelas {editingClass && '(Biarkan kosong jika tidak diubah)'}
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => {
                                        setClassPhoto(e.target.files?.[0] || null);
                                        if (classFormErrors.photo) {
                                            setClassFormErrors(prev => ({ ...prev, photo: '' }));
                                        }
                                    }}
                                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                                {classFormErrors.photo && (
                                    <p className="text-xs text-red-500 mt-1 font-medium">{classFormErrors.photo}</p>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 pt-3">
                                <button
                                    type="button"
                                    disabled={isSubmittingClass}
                                    onClick={() => setShowClassModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmittingClass}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {isSubmittingClass && (
                                        <i className="bi bi-arrow-repeat animate-spin" />
                                    )}
                                    {editingClass ? (isSubmittingClass ? 'Menyimpan...' : 'Simpan Perubahan') : (isSubmittingClass ? 'Membuat...' : 'Buat Kelas')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Assign Murid ke Kelas */}
            {showAssignModal && selectedClass && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-lg text-gray-900">
                                Masukkan Murid ke {selectedClass.name}
                            </h3>
                            <button
                                onClick={() => setShowAssignModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <i className="bi bi-x-lg" />
                            </button>
                        </div>

                        <form onSubmit={handleAssignStudent} className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Pilih Murid ({selectedStudentIds.length} dipilih)
                                    </label>
                                    {unassignedStudents.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (selectedStudentIds.length === unassignedStudents.length) {
                                                    setSelectedStudentIds([]);
                                                } else {
                                                    setSelectedStudentIds(unassignedStudents.map(s => s.id));
                                                }
                                            }}
                                            className="text-[11px] font-semibold text-teal-600 hover:text-teal-800"
                                        >
                                            {selectedStudentIds.length === unassignedStudents.length ? 'Batal Semua' : 'Pilih Semua'}
                                        </button>
                                    )}
                                </div>

                                {unassignedStudents.length === 0 ? (
                                    <p className="text-xs text-gray-400 italic py-2">
                                        Semua murid sudah memiliki kelas.
                                    </p>
                                ) : (
                                    <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1">
                                        {unassignedStudents.map(st => {
                                            const isChecked = selectedStudentIds.includes(st.id);
                                            return (
                                                <label
                                                    key={st.id}
                                                    className={`flex items-center gap-2.5 p-2 rounded-lg cursor-pointer text-xs transition ${
                                                        isChecked ? 'bg-teal-50 text-teal-900 font-medium' : 'hover:bg-gray-50 text-gray-700'
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() => {
                                                            setSelectedStudentIds(prev =>
                                                                isChecked
                                                                    ? prev.filter(id => id !== st.id)
                                                                    : [...prev, st.id]
                                                            );
                                                        }}
                                                        className="rounded text-teal-600 focus:ring-teal-500"
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-semibold truncate">{st.name}</div>
                                                        <div className="text-[11px] text-gray-400 truncate">{st.email}</div>
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {selectedClass.tutor && (
                                <div className="flex items-start gap-2.5 bg-teal-50 border border-teal-200 rounded-lg p-3">
                                    <input
                                        type="checkbox"
                                        id="autoAssignTutor"
                                        checked={autoAssignTutorOnAdd}
                                        onChange={e => setAutoAssignTutorOnAdd(e.target.checked)}
                                        className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                                    />
                                    <label htmlFor="autoAssignTutor" className="text-xs text-teal-900 cursor-pointer">
                                        <span className="font-semibold block">Tugaskan Tutor Kelas ke Murid Ini</span>
                                        Otomatis set tutor pembimbing murid menjadi <strong>{selectedClass.tutor.name}</strong>.
                                    </label>
                                </div>
                            )}

                            <div className="flex justify-end gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowAssignModal(false);
                                        setSelectedStudentIds([]);
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={selectedStudentIds.length === 0}
                                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-sm"
                                >
                                    Tambahkan ({selectedStudentIds.length})
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Pindah Kelas */}
            {showTransferModal && studentToTransfer && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-lg text-gray-900">
                                Pindahkan Murid: {studentToTransfer.name}
                            </h3>
                            <button
                                onClick={() => setShowTransferModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <i className="bi bi-x-lg" />
                            </button>
                        </div>

                        <form onSubmit={handleTransferStudent} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Pilih Kelas Tujuan
                                </label>
                                <select
                                    required
                                    value={targetClassId}
                                    onChange={e => setTargetClassId(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                                >
                                    {classrooms
                                        .filter(c => c.id !== selectedClass?.id)
                                        .map(c => (
                                            <option key={c.id} value={c.id}>
                                                {c.name} ({c.studentsCount} Murid){c.tutor ? ` • Tutor: ${c.tutor.name}` : ''}
                                            </option>
                                        ))}
                                </select>
                            </div>

                            <div className="flex items-start gap-2.5 bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                                <input
                                    type="checkbox"
                                    id="autoAssignTutorOnTransfer"
                                    checked={autoAssignTutorOnTransfer}
                                    onChange={e => setAutoAssignTutorOnTransfer(e.target.checked)}
                                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                                />
                                <label htmlFor="autoAssignTutorOnTransfer" className="text-xs text-indigo-900 cursor-pointer">
                                    <span className="font-semibold block">Sinkronkan Tutor Pembimbing</span>
                                    Otomatis ubah tutor pembimbing murid sesuai tutor wali dari kelas tujuan (jika tersedia).
                                </label>
                            </div>

                            <div className="flex justify-end gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setShowTransferModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={!targetClassId}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-sm"
                                >
                                    Pindahkan Murid
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Jadwalkan Sesi Sekaligus untuk Seluruh Murid di Kelas (Batch Scheduling) */}
            {showScheduleModal && selectedClass && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl space-y-5 my-8">
                        <div className="flex items-center justify-between border-b pb-3">
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                                    <i className="bi bi-calendar-check text-indigo-600" />
                                    Jadwalkan Sesi Kelas
                                </h3>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Sesi akan dibuatkan sekaligus untuk seluruh <strong>{selectedClass.students.length} murid</strong> di kelas <strong>{selectedClass.name}</strong>.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowScheduleModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <i className="bi bi-x-lg" />
                            </button>
                        </div>

                        {selectedClass.students.length === 0 ? (
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs space-y-2">
                                <p className="font-semibold flex items-center gap-1.5">
                                    <i className="bi bi-exclamation-triangle-fill text-amber-500 text-sm" />
                                    Kelas ini belum memiliki murid!
                                </p>
                                <p>
                                    Silakan masukkan murid terlebih dahulu ke dalam kelas {selectedClass.name} sebelum membuat jadwal sesi kelas.
                                </p>
                                <div className="pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowScheduleModal(false);
                                            setShowAssignModal(true);
                                        }}
                                        className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold"
                                    >
                                        + Masukkan Murid Sekarang
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleScheduleBatchSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                        Judul Pertemuan / Sesi
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: Pertemuan 1 - Pengenalan Arduino & Sensor"
                                        value={batchForm.title}
                                        onChange={e => setBatchForm(prev => ({ ...prev, title: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                            Tanggal
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={batchForm.date}
                                            onChange={e => setBatchForm(prev => ({ ...prev, date: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                            Status Awal
                                        </label>
                                        <select
                                            value={batchForm.status}
                                            onChange={e => setBatchForm(prev => ({ ...prev, status: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                                        >
                                            <option value="akan-datang">Akan Datang</option>
                                            <option value="hadir">Hadir</option>
                                            <option value="absen">Tidak Hadir</option>
                                            <option value="libur">Libur</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                        Tutor Penanggung Jawab Sesi
                                    </label>
                                    <select
                                        value={batchForm.override_tutor_id}
                                        onChange={e => setBatchForm(prev => ({ ...prev, override_tutor_id: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
                                    >
                                        <option value="">
                                            {selectedClass.tutor
                                                ? `Gunakan Tutor Wali Kelas (${selectedClass.tutor.name}) / Tutor Masing-Masing`
                                                : 'Sesuai Tutor Masing-Masing Murid'}
                                        </option>
                                        {tutors.map(t => (
                                            <option key={t.id} value={t.id}>
                                                {t.name} ({t.email})
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-[11px] text-gray-500 mt-0.5">
                                        Pilih tutor tertentu jika sesi ini diajar oleh tutor pengganti/spesifik.
                                    </p>
                                </div>

                                {/* Modul Terkait */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Pilih Modul Pembelajaran ({batchForm.module_ids.length} dipilih)
                                    </label>
                                    <div className="max-h-36 overflow-y-auto border border-gray-200 rounded-lg p-2 bg-gray-50 space-y-1.5">
                                        {modules.map(m => {
                                            const isChecked = batchForm.module_ids.includes(m.id);
                                            return (
                                                <label
                                                    key={m.id}
                                                    className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-xs transition-colors ${
                                                        isChecked ? 'bg-indigo-100 text-indigo-900 font-semibold' : 'hover:bg-white text-gray-700'
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() => toggleModule(m.id)}
                                                        className="rounded text-indigo-600 focus:ring-indigo-500"
                                                    />
                                                    <span>{m.name}</span>
                                                    {m.module_type && (
                                                        <span className="text-[10px] uppercase font-normal px-1.5 py-0.5 bg-gray-200 rounded ml-auto text-gray-600">
                                                            {m.module_type}
                                                        </span>
                                                    )}
                                                </label>
                                            );
                                        })}
                                        {modules.length === 0 && (
                                            <p className="text-xs text-gray-400 p-2">Belum ada modul tersedia.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Tools / Peralatan */}
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                        Tools / Peralatan yang Digunakan
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Contoh: Arduino Uno, Breadboard, LED..."
                                            value={toolInput}
                                            onChange={e => setToolInput(e.target.value)}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addTool();
                                                }
                                            }}
                                            className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                        />
                                        <button
                                            type="button"
                                            onClick={addTool}
                                            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold"
                                        >
                                            + Tambah
                                        </button>
                                    </div>
                                    {batchForm.tools.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {batchForm.tools.map((item, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium"
                                                >
                                                    {item}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTool(item)}
                                                        className="hover:text-red-500 ml-0.5"
                                                    >
                                                        &times;
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                        Deskripsi / Materi Sesi (Opsional)
                                    </label>
                                    <textarea
                                        rows={2}
                                        placeholder="Tuliskan gambaran materi yang dipelajari pada sesi ini..."
                                        value={batchForm.description}
                                        onChange={e => setBatchForm(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                        Catatan Khusus Admin untuk Tutor (Opsional)
                                    </label>
                                    <textarea
                                        rows={2}
                                        placeholder="Pesan atau arahan khusus dari admin kepada tutor pengajar..."
                                        value={batchForm.admin_note_for_tutor}
                                        onChange={e => setBatchForm(prev => ({ ...prev, admin_note_for_tutor: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                    />
                                </div>

                                <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100 flex items-center justify-between text-xs text-indigo-900">
                                    <span>
                                        Total murid yang akan dijadwalkan: <strong>{selectedClass.students.length} murid</strong>
                                    </span>
                                    <span className="text-[11px] text-indigo-600 font-semibold">
                                        Otomatis terhubung ke {selectedClass.name}
                                    </span>
                                </div>

                                <div className="flex justify-end gap-2 pt-2 border-t">
                                    <button
                                        type="button"
                                        onClick={() => setShowScheduleModal(false)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-md flex items-center gap-1.5"
                                    >
                                        <i className="bi bi-send-check" /> Buat Jadwal untuk Semua Murid
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
