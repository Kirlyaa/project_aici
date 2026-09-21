import { Head, Link, router, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

interface Student {
    id: number;
    name: string;
    email: string;
    avatar: string;
    status: string;
}

interface Classroom {
    id: number;
    name: string;
    photo: string;
    description: string | null;
    studentsCount: number;
    students: Student[];
}

interface Props {
    classrooms: Classroom[];
    unassignedStudents: Student[];
    search: string;
}

export default function ClassroomManagement() {
    const { classrooms, unassignedStudents, search: initialSearch } = usePage().props as unknown as Props;

    const [searchTerm, setSearchTerm] = useState(initialSearch || '');
    const [selectedClass, setSelectedClass] = useState<Classroom | null>(classrooms[0] || null);

    // Modal Create / Edit Kelas
    const [showClassModal, setShowClassModal] = useState(false);
    const [editingClass, setEditingClass] = useState<Classroom | null>(null);
    const [className, setClassName] = useState('');
    const [classDesc, setClassDesc] = useState('');
    const [classPhoto, setClassPhoto] = useState<File | null>(null);

    // Modal Tambah Murid ke Kelas
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [studentToAssign, setStudentToAssign] = useState<string>('');

    // Modal Pindah Kelas
    const [showTransferModal, setShowTransferModal] = useState(false);
    const [studentToTransfer, setStudentToTransfer] = useState<Student | null>(null);
    const [targetClassId, setTargetClassId] = useState<string>('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/superadmin/classes', { search: searchTerm }, { preserveState: true });
    };

    const openCreateClassModal = () => {
        setEditingClass(null);
        setClassName('');
        setClassDesc('');
        setClassPhoto(null);
        setShowClassModal(true);
    };

    const openEditClassModal = (cls: Classroom) => {
        setEditingClass(cls);
        setClassName(cls.name);
        setClassDesc(cls.description || '');
        setClassPhoto(null);
        setShowClassModal(true);
    };

    const handleClassSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', className);
        formData.append('description', classDesc);
        if (classPhoto) {
            formData.append('photo', classPhoto);
        }

        if (editingClass) {
            formData.append('_method', 'PUT');
            router.post(`/superadmin/classes/${editingClass.id}`, formData, {
                onSuccess: () => {
                    setShowClassModal(false);
                },
            });
        } else {
            router.post('/superadmin/classes', formData, {
                onSuccess: () => {
                    setShowClassModal(false);
                },
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
        if (!selectedClass || !studentToAssign) return;

        router.post(`/superadmin/classes/${selectedClass.id}/assign`, {
            student_id: studentToAssign,
        }, {
            onSuccess: () => {
                setShowAssignModal(false);
                setStudentToAssign('');
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
                                            <div className="flex items-center gap-2 mt-1.5 text-xs text-indigo-700 font-semibold">
                                                <i className="bi bi-people-fill" /> {cls.studentsCount} Murid
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
                                            <span className="px-2.5 py-0.5 bg-indigo-500/80 backdrop-blur-md text-[11px] font-semibold rounded-full uppercase tracking-wider">
                                                Detail Kelas
                                            </span>
                                            <h2 className="text-2xl font-bold mt-1 text-white">{selectedClass.name}</h2>
                                            <p className="text-xs text-gray-200 mt-0.5 line-clamp-1">
                                                {selectedClass.description || 'Tidak ada deskripsi'}
                                            </p>
                                        </div>

                                        <div className="flex gap-2">
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
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Nama Kelas
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Contoh: Robotics Explorer A"
                                    value={className}
                                    onChange={e => setClassName(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Deskripsi (Opsional)
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Deskripsi singkat mengenai kelas..."
                                    value={classDesc}
                                    onChange={e => setClassDesc(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Foto Sampul Kelas {editingClass && '(Biarkan kosong jika tidak diubah)'}
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => setClassPhoto(e.target.files?.[0] || null)}
                                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setShowClassModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm"
                                >
                                    {editingClass ? 'Simpan Perubahan' : 'Buat Kelas'}
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
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Pilih Murid (Dari daftar belum memiliki kelas)
                                </label>
                                <select
                                    required
                                    value={studentToAssign}
                                    onChange={e => setStudentToAssign(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                >
                                    <option value="">-- Pilih Murid --</option>
                                    {unassignedStudents.map(st => (
                                        <option key={st.id} value={st.id}>
                                            {st.name} ({st.email})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex justify-end gap-2 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAssignModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={!studentToAssign}
                                    className="px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-sm"
                                >
                                    Tambahkan
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                >
                                    {classrooms
                                        .filter(c => c.id !== selectedClass?.id)
                                        .map(c => (
                                            <option key={c.id} value={c.id}>
                                                {c.name} ({c.studentsCount} Murid)
                                            </option>
                                        ))}
                                </select>
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
        </div>
    );
}
