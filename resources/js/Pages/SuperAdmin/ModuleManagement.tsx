import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface Module {
    id: number;
    name: string;
    image: string | null;
    description: string | null;
    type: string;
    typeLabel: string;
    tools: string[];
    createdBy: string;
    createdAt: string;
    sessionsCount: number;
}

interface Paginated<T> {
    data: T[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    modules: Paginated<Module>;
    search: string;
    selectedType: string;
    sortBy: string;
    stats: { total: number; robot: number; coding: number; general: number };
}

export default function ModuleManagement() {
    const { modules, search, selectedType, sortBy, stats } = usePage().props as unknown as Props;
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [newModule, setNewModule] = useState({ name: '', image: '', description: '', tools: [] as string[], newTool: '', type: 'robot' });
    const [searchTerm, setSearchTerm] = useState(search);
    const [selectedTypeFilter, setSelectedTypeFilter] = useState(selectedType);

    const applyFilters = (term: string, type: string) => {
        router.get('/superadmin/modules', { search: term, type }, { preserveState: true });
    };

    const handleSubmit = () => {
        if (!newModule.name.trim()) return;

        const payload = {
            name: newModule.name,
            description: newModule.description || null,
            image: newModule.image || null,
            type: newModule.type,
            tools: newModule.tools.length > 0 ? newModule.tools : null,
        };

        if (editingId) {
            router.put(`/superadmin/modules/${editingId}`, payload, {
                onSuccess: () => resetForm(),
            });
        } else {
            router.post('/superadmin/modules', payload, {
                onSuccess: () => resetForm(),
            });
        }
    };

    const editModule = (m: Module) => {
        setNewModule({
            name: m.name,
            image: m.image ?? '',
            description: m.description ?? '',
            tools: m.tools ?? [],
            newTool: '',
            type: m.type,
        });
        setEditingId(m.id);
        setShowForm(true);
    };

    const deleteModule = (id: number) => {
        if (window.confirm('Yakin ingin menghapus modul ini?')) {
            router.delete(`/superadmin/modules/${id}`);
        }
    };

    const resetForm = () => {
        setNewModule({ name: '', image: '', description: '', tools: [], newTool: '', type: 'robot' });
        setShowForm(false);
        setEditingId(null);
    };

    const addTool = () => {
        if (!newModule.newTool.trim()) return;
        setNewModule({
            ...newModule,
            tools: [...newModule.tools, newModule.newTool],
            newTool: ''
        });
    };

    const removeTool = (index: number) => {
        setNewModule({
            ...newModule,
            tools: newModule.tools.filter((_, i) => i !== index)
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Kelola Modul Master" />

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <Link href="/superadmin" className="text-gray-600 hover:text-gray-900">
                                <i className="bi bi-arrow-left text-xl" />
                            </Link>
                            <div>
                                <h1 className="font-bold text-lg">AICI</h1>
                                <p className="text-xs text-gray-500">Kelola Modul Master</p>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Kelola Modul Pembelajaran</h1>
                    <p className="text-gray-600">Tambah, edit, atau hapus modul ajar master untuk tutor</p>
                </div>

                {/* Search & Add Button */}
                <div className="flex gap-4 mb-6">
                    <form onSubmit={e => { e.preventDefault(); applyFilters(searchTerm, selectedTypeFilter); }} className="flex-1 relative">
                        <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari modul..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </form>
                    <select
                        value={selectedTypeFilter}
                        onChange={e => { setSelectedTypeFilter(e.target.value); applyFilters(searchTerm, e.target.value); }}
                        className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="">Semua Tipe</option>
                        <option value="robot">Robot Building</option>
                        <option value="coding">Coding</option>
                        <option value="general">General</option>
                    </select>
                    <button
                        onClick={() => {
                            resetForm();
                            setShowForm(true);
                        }}
                        className="px-6 py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 flex items-center gap-2"
                    >
                        <i className="bi bi-plus-lg" /> Tambah Modul
                    </button>
                </div>

                {/* Modules Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {modules.data.length === 0 ? (
                        <div className="col-span-full bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
                            <i className="bi bi-inbox text-4xl text-gray-300 block mb-3" />
                            <p className="text-gray-600">Belum ada modul</p>
                        </div>
                    ) : (
                        modules.data.map(module => (
                            <div key={module.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                {/* Module Image/Icon */}
                                <div className="aspect-video bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center text-6xl">
                                    {module.image ? (
                                        <img src={module.image} alt={module.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span>📦</span>
                                    )}
                                </div>

                                {/* Module Info */}
                                <div className="p-4 space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-bold text-gray-900 flex-1">{module.name}</h3>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded whitespace-nowrap ${
                                            module.type === 'robot'
                                                ? 'bg-purple-100 text-purple-700'
                                                : module.type === 'coding'
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {module.typeLabel}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-600 line-clamp-2">{module.description}</p>

                                    {/* Tools */}
                                    {module.tools.length > 0 && (
                                        <div className="pt-2 border-t">
                                            <p className="text-xs font-semibold text-gray-600 mb-2">Alat:</p>
                                            <div className="flex flex-wrap gap-1">
                                                {module.tools.map((tool, idx) => (
                                                    <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                                        {tool}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2 pt-4 border-t">
                                        <button
                                            onClick={() => editModule(module)}
                                            className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors flex items-center justify-center gap-1 text-sm"
                                        >
                                            <i className="bi bi-pencil-fill" /> Edit
                                        </button>
                                        <button
                                            onClick={() => deleteModule(module.id)}
                                            className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-1 text-sm"
                                        >
                                            <i className="bi bi-trash-fill" /> Hapus
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Pagination */}
                {modules.links.length > 3 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                        {modules.links.map((link, i) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() => link.url && router.visit(link.url)}
                                className={`px-3 py-1.5 text-sm rounded-lg ${link.active ? 'bg-orange-600 text-white' : link.url ? 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}

                {/* Back Button */}
                <div className="mt-12">
                    <Link
                        href="/superadmin"
                        className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                    >
                        <i className="bi bi-arrow-left" /> Kembali ke Dashboard
                    </Link>
                </div>
            </div>

            {/* Add/Edit Module Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl my-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">
                            {editingId ? 'Edit Modul' : 'Tambah Modul Baru'}
                        </h3>

                        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                            {/* Nama Modul */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Modul</label>
                                <input
                                    type="text"
                                    value={newModule.name}
                                    onChange={e => setNewModule({ ...newModule, name: e.target.value })}
                                    placeholder="Contoh: Fantasy Zoo"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            {/* Image/Icon */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">URL Gambar Modul</label>
                                <input
                                    type="url"
                                    value={newModule.image}
                                    onChange={e => setNewModule({ ...newModule, image: e.target.value })}
                                    placeholder="https://contoh.com/gambar.png"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                                />
                            </div>

                            {/* Deskripsi */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi</label>
                                <textarea
                                    value={newModule.description}
                                    onChange={e => setNewModule({ ...newModule, description: e.target.value })}
                                    placeholder="Jelaskan modul ini..."
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none h-20"
                                />
                            </div>

                            {/* Tipe Modul */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Tipe Modul</label>
                                <select
                                    value={newModule.type}
                                    onChange={e => setNewModule({ ...newModule, type: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="robot">Robot Building</option>
                                    <option value="coding">Coding</option>
                                    <option value="general">General</option>
                                </select>
                            </div>

                            {/* Tools */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Alat yang Diperlukan</label>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={newModule.newTool}
                                        onChange={e => setNewModule({ ...newModule, newTool: e.target.value })}
                                        placeholder="Nama alat..."
                                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                    <button
                                        onClick={addTool}
                                        className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
                                    >
                                        <i className="bi bi-plus-lg" />
                                    </button>
                                </div>
                                {newModule.tools.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {newModule.tools.map((tool, idx) => (
                                            <div key={idx} className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm flex items-center gap-2">
                                                {tool}
                                                <button
                                                    onClick={() => removeTool(idx)}
                                                    className="text-orange-600 hover:text-orange-900"
                                                >
                                                    <i className="bi bi-x-lg text-xs" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3 pt-6 border-t">
                                <button
                                    onClick={resetForm}
                                    className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
                                >
                                    {editingId ? 'Update' : 'Tambah'} Modul
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
