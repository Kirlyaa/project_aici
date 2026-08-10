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
            name: 'Advanced Coding', 
            image: '💻', 
            description: 'Pembelajaran coding lanjutan tanpa robot',
            tools: ['Laptop', 'IDE Setup'],
            hasRobotBuilding: false
        },
    ]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [newModule, setNewModule] = useState({ name: '', image: '', description: '', tools: [] as string[], newTool: '', hasRobotBuilding: true });

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
        setModules(modules.filter(m => m.id !== id));
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
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Gambar/Emoji</label>
                                    
                                    {/* Image Preview */}
                                    {imagePreview && (
                                        <div className="mb-3 p-3 bg-gray-50 rounded-lg flex items-center justify-center">
                                            <img src={imagePreview} alt="Preview" className="max-w-full max-h-32 rounded" />
                                        </div>
                                    )}

                                    {/* File Upload */}
                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,.png,.jpg,.jpeg"
                                        onChange={handleImageUpload}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG (Max 2MB)</p>

                                    <div className="flex items-center gap-2 my-3">
                                        <div className="flex-1 h-px bg-gray-300" />
                                        <span className="text-xs text-gray-500">ATAU</span>
                                        <div className="flex-1 h-px bg-gray-300" />
                                    </div>

                                    {/* Emoji Input */}
                                    <input
                                        type="text"
                                        value={newModule.image && !imagePreview ? newModule.image : ''}
                                        onChange={e => {
                                            const val = e.target.value;
                                            if (val.length <= 2 && !val.startsWith('data:')) {
                                                setNewModule({ ...newModule, image: val });
                                                setImagePreview('');
                                            }
                                        }}
                                        placeholder="Atau ketik emoji (cth: 🦁)"
                                        maxLength={2}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-center text-2xl"
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
                                        onClick={addModule}
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
                    {modules.length === 0 ? (
                        <div className="md:col-span-2 lg:col-span-3 bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
                            <i className="bi bi-inbox text-4xl text-gray-300 block mb-3" />
                            <p className="text-gray-600 text-lg">Belum ada modul. Tambahkan modul baru untuk memulai.</p>
                        </div>
                    ) : (
                        modules.map(m => (
                            <div key={m.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                {/* Image Container */}
                                <div className="h-40 bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center overflow-hidden">
                                    {m.image.startsWith('data:') ? (
                                        <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-6xl">{m.image}</span>
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
                                        {m.hasRobotBuilding ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                                                <i className="bi bi-robot" /> Type 5 (Robot Building)
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                                                <i className="bi bi-code-square" /> Type 4 (Coding)
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
