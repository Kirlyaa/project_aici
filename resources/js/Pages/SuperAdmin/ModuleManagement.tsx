import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

interface Module {
    id: number;
    name: string;
    image: string;
    description: string;
    tools: string[];
    hasRobotBuilding: boolean;
}

export default function ModuleManagement() {
    const [modules, setModules] = useState<Module[]>([
        { 
            id: 1, 
            name: 'Fantasy Zoo', 
            image: '🦁', 
            description: 'Pembelajaran robotika dasar dengan tema hewan',
            tools: ['LEGO Mindstorms', 'Laptop', 'Kabel USB'],
            hasRobotBuilding: true
        },
        { 
            id: 2, 
            name: 'Future Town', 
            image: '🏙️', 
            description: 'Pembelajaran coding lanjutan tanpa robot',
            tools: ['Laptop', 'IDE Setup'],
            hasRobotBuilding: false
        },
    ]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [newModule, setNewModule] = useState({ name: '', image: '', description: '', tools: [] as string[], newTool: '', hasRobotBuilding: true });
    const [searchTerm, setSearchTerm] = useState('');

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.size <= 2097152) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setNewModule({ ...newModule, image: result });
                setImagePreview(result);
            };
            reader.readAsDataURL(file);
        }
    };

    const addModule = () => {
        if (!newModule.name.trim() || !newModule.image.trim()) return;
        if (editingId) {
            setModules(modules.map(m => m.id === editingId ? { 
                id: editingId, 
                name: newModule.name, 
                image: newModule.image, 
                description: newModule.description,
                tools: newModule.tools,
                hasRobotBuilding: newModule.hasRobotBuilding
            } : m));
            setEditingId(null);
        } else {
            setModules([...modules, { 
                id: Math.max(...modules.map(m => m.id), 0) + 1, 
                name: newModule.name,
                image: newModule.image,
                description: newModule.description,
                tools: newModule.tools,
                hasRobotBuilding: newModule.hasRobotBuilding
            }]);
        }
        resetForm();
    };

    const editModule = (m: Module) => {
        setNewModule({ ...m, newTool: '' });
        setImagePreview(m.image.startsWith('data:') ? m.image : '');
        setEditingId(m.id);
        setShowForm(true);
    };

    const deleteModule = (id: number) => {
        if (window.confirm('Yakin ingin menghapus modul ini?')) {
            setModules(modules.filter(m => m.id !== id));
        }
    };

    const resetForm = () => {
        setNewModule({ name: '', image: '', description: '', tools: [], newTool: '', hasRobotBuilding: true });
        setImagePreview('');
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

    const filteredModules = modules.filter(m => 
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    <div className="flex-1 relative">
                        <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari modul..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                    </div>
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
                    {filteredModules.length === 0 ? (
                        <div className="col-span-full bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
                            <i className="bi bi-inbox text-4xl text-gray-300 block mb-3" />
                            <p className="text-gray-600">Belum ada modul</p>
                        </div>
                    ) : (
                        filteredModules.map(module => (
                            <div key={module.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                {/* Module Image/Icon */}
                                <div className="aspect-video bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center text-6xl">
                                    {module.image.startsWith('data:') ? (
                                        <img src={module.image} alt={module.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span>{module.image}</span>
                                    )}
                                </div>

                                {/* Module Info */}
                                <div className="p-4 space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="font-bold text-gray-900 flex-1">{module.name}</h3>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded whitespace-nowrap ${
                                            module.hasRobotBuilding
                                                ? 'bg-purple-100 text-purple-700'
                                                : 'bg-blue-100 text-blue-700'
                                        }`}>
                                            {module.hasRobotBuilding ? 'Type 5' : 'Type 4'}
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
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Gambar/Emoji Modul</label>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                                        />
                                        <p className="text-xs text-gray-600 mt-1">PNG, JPG (Max 2MB)</p>
                                    </div>
                                    {imagePreview && (
                                        <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center text-3xl overflow-hidden">
                                            {imagePreview.startsWith('data:') ? (
                                                <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <span>{newModule.image}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
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

                            {/* Robot Building Toggle */}
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div>
                                    <p className="font-semibold text-gray-900">Dengan Robot Building?</p>
                                    <p className="text-xs text-gray-600">Type 5 dengan robot, Type 4 tanpa robot</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={newModule.hasRobotBuilding}
                                        onChange={e => setNewModule({ ...newModule, hasRobotBuilding: e.target.checked })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                                </label>
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
                                    onClick={addModule}
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
