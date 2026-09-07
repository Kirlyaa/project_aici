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
}

interface Paginated<T> {
    data: T[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props {
    modules: Paginated<Module>;
    search: string;
    selectedType: string;
}

export default function ModuleManagement() {
    const { modules, search, selectedType } = usePage().props as unknown as Props;
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [newModule, setNewModule] = useState({ name: '', image: '', description: '', tools: [] as string[], newTool: '', type: 'robot' });
    const [searchTerm, setSearchTerm] = useState(search);
    const [selectedTypeFilter, setSelectedTypeFilter] = useState(selectedType);

    const applyFilters = (term: string, type: string) => {
        router.get('/tutor/modules', { search: term, type }, { preserveState: true });
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
            router.put(`/tutor/modules/${editingId}`, payload, {
                onSuccess: () => resetForm(),
            });
        } else {
            router.post('/tutor/modules', payload, {
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
            router.delete(`/tutor/modules/${id}`);
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
            <Head title="Kelola Modul" />

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <Link href="/tutor" className="text-gray-600 hover:text-gray-900">
                                <i className="bi bi-arrow-left text-xl" />
                            </Link>
                            <div>
                                <h1 className="font-bold text-lg">AICI</h1>
                                <p className="text-xs text-gray-500">Kelola Modul</p>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Kelola Modul</h1>
                        <p className="text-gray-600">Tambah, edit, atau hapus modul pembelajaran</p>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-4 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 flex items-center gap-2"
                    >
                        <i className="bi bi-plus-lg" /> Tambah Modul
                    </button>
                </div>

                {/* Search & Filter */}
                <div className="flex gap-4 mb-6">
                    <form onSubmit={e => { e.preventDefault(); applyFilters(searchTerm, selectedTypeFilter); }} className="flex-1 relative">
                        <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari modul..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                    </form>
                    <select
                        value={selectedTypeFilter}
                        onChange={e => { setSelectedTypeFilter(e.target.value); applyFilters(searchTerm, e.target.value); }}
                        className="px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    >
                        <option value="">Semua Tipe</option>
                        <option value="robot">Robot Building</option>
                        <option value="coding">Coding</option>
                        <option value="general">General</option>
                    </select>
                </div>

                {/* Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-screen overflow-y-auto">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                <i className={`bi ${editingId ? 'bi-pencil-fill' : 'bi-plus-circle'} text-teal-600 mr-2`} />
                                {editingId ? 'Edit Modul' : 'Tambah Modul Baru'}
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Nama Modul</label>
                                    <input
                                        type="text"
                                        value={newModule.name}
                                        onChange={e => setNewModule({ ...newModule, name: e.target.value })}
                                        placeholder="Cth: Fantasy Zoo"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">URL Gambar</label>
                                    <input
                                        type="url"
                                        value={newModule.image}
                                        onChange={e => setNewModule({ ...newModule, image: e.target.value })}
                                        placeholder="https://contoh.com/gambar.png"
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Tipe Modul</label>
                                    <select
                                        value={newModule.type}
                                        onChange={e => setNewModule({ ...newModule, type: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    >
                                        <option value="robot">Robot Building</option>
                                        <option value="coding">Coding</option>
                                        <option value="general">General</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Deskripsi</label>
                                    <textarea
                                        value={newModule.description}
                                        onChange={e => setNewModule({ ...newModule, description: e.target.value })}
                                        placeholder="Jelaskan modul ini..."
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none h-20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Alat yang Perlu Dibawa</label>
                                    <div className="space-y-2 mb-3">
                                        {newModule.tools.map((tool, idx) => (
                                            <div key={idx} className="flex items-center justify-between gap-2 p-2 bg-teal-50 rounded-lg">
                                                <span className="text-sm text-gray-700 flex items-center gap-2">
                                                    <i className="bi bi-tools text-teal-600" /> {tool}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeTool(idx)}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                >
                                                    <i className="bi bi-x-lg text-sm" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newModule.newTool}
                                            onChange={e => setNewModule({ ...newModule, newTool: e.target.value })}
                                            onKeyPress={e => e.key === 'Enter' && (addTool(), e.preventDefault())}
                                            placeholder="Cth: LEGO Mindstorms"
                                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={addTool}
                                            className="px-3 py-2 bg-teal-100 text-teal-600 rounded-lg hover:bg-teal-200 font-medium text-sm"
                                        >
                                            <i className="bi bi-plus-lg" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-4">
                                    <button
                                        onClick={handleSubmit}
                                        className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700"
                                    >
                                        {editingId ? 'Update' : 'Tambah'}
                                    </button>
                                    <button
                                        onClick={resetForm}
                                        className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modules Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {modules.data.length === 0 ? (
                        <div className="md:col-span-2 lg:col-span-3 bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
                            <i className="bi bi-inbox text-4xl text-gray-300 block mb-3" />
                            <p className="text-gray-600 text-lg">Belum ada modul. Tambahkan modul baru untuk memulai.</p>
                        </div>
                    ) : (
                        modules.data.map(m => (
                            <div key={m.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                {/* Image Container */}
                                <div className="h-40 bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center overflow-hidden">
                                    {m.image ? (
                                        <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-6xl">📦</span>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-900 mb-1 text-lg">{m.name}</h3>
                                    <p className="text-gray-600 text-sm mb-3">{m.description}</p>

                                    {/* Tools List */}
                                    {m.tools.length > 0 && (
                                        <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                                            <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                                <i className="bi bi-tools" /> Alat yang Diperlukan
                                            </p>
                                            <div className="space-y-1">
                                                {m.tools.map((tool, idx) => (
                                                    <p key={idx} className="text-xs text-gray-600 flex items-center gap-2">
                                                        <span className="inline-block w-1 h-1 bg-teal-600 rounded-full" />
                                                        {tool}
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Robot Building Badge */}
                                    <div className="mb-3 flex items-center gap-2">
                                        {m.type === 'robot' ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                                                <i className="bi bi-robot" /> {m.typeLabel}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                                                <i className="bi bi-code-square" /> {m.typeLabel}
                                            </span>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => editModule(m)}
                                            className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 flex items-center justify-center gap-2 text-sm"
                                        >
                                            <i className="bi bi-pencil-fill" /> Edit
                                        </button>
                                        <button
                                            onClick={() => deleteModule(m.id)}
                                            className="flex-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 flex items-center justify-center gap-2 text-sm"
                                        >
                                            <i className="bi bi-trash-fill" /> Hapus
                                        </button>
                                    </div>

                                    {/* Module ID Badge */}
                                    <p className="text-xs text-gray-500 mt-3 text-center">ID: {m.id}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Back Button */}
                <div className="mt-8">
                    <Link
                        href="/tutor"
                        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                    >
                        <i className="bi bi-arrow-left" /> Kembali ke Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
