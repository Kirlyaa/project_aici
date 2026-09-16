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
}

interface Props {
    modules: Module[];
    stats: { total: number; robot: number; coding: number };
}

export default function ModulesViewer() {
    const { modules, stats } = usePage().props as unknown as Props;
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('');

    const filtered = modules.filter(m => {
        const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || (m.description ?? '').toLowerCase().includes(search.toLowerCase());
        const matchType = !typeFilter || m.type === typeFilter;
        return matchSearch && matchType;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="Daftar Modul" />

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <Link href="/tutor" className="text-gray-600 hover:text-gray-900">
                                <i className="bi bi-arrow-left text-xl" />
                            </Link>
                            <div>
                                <h1 className="font-bold text-lg">AICI</h1>
                                <p className="text-xs text-gray-500">Daftar Modul</p>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Daftar Modul</h1>
                    <p className="text-gray-600">Lihat semua modul yang tersedia untuk pembelajaran</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center">
                        <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                        <p className="text-sm text-gray-600 mt-1">Total Modul</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center">
                        <p className="text-3xl font-bold text-purple-600">{stats.robot}</p>
                        <p className="text-sm text-gray-600 mt-1">Robot Building</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center">
                        <p className="text-3xl font-bold text-orange-600">{stats.coding}</p>
                        <p className="text-sm text-gray-600 mt-1">Coding</p>
                    </div>
                </div>

                {/* Filter */}
                <div className="flex gap-3 mb-6">
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Cari modul..."
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                    />
                    <select
                        value={typeFilter}
                        onChange={e => setTypeFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                    >
                        <option value="">Semua Tipe</option>
                        <option value="robot">Robot Building</option>
                        <option value="coding">Coding</option>
                        <option value="general">General</option>
                    </select>
                </div>

                {/* Module Grid */}
                {filtered.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
                        <i className="bi bi-collection text-4xl text-gray-300 block mb-3" />
                        <p className="text-gray-600">Tidak ada modul yang ditemukan.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map(m => (
                            <div key={m.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                                <div className="flex gap-4 mb-3">
                                    <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                        {m.image?.startsWith('data:') || m.image?.startsWith('http') ? (
                                            <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-2xl">{m.image || '📘'}</span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 truncate">{m.name}</h3>
                                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mt-1 ${
                                            m.type === 'robot'
                                                ? 'bg-purple-100 text-purple-700'
                                                : m.type === 'coding'
                                                ? 'bg-orange-100 text-orange-700'
                                                : 'bg-gray-100 text-gray-700'
                                        }`}>
                                            {m.typeLabel}
                                        </span>
                                    </div>
                                </div>
                                {m.description && (
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{m.description}</p>
                                )}
                                {m.tools && m.tools.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {m.tools.map((tool, i) => (
                                            <span key={i} className="px-2 py-0.5 bg-teal-50 text-teal-700 rounded text-xs">
                                                {tool}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-6">
                    <Link
                        href="/tutor"
                        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 text-sm"
                    >
                        <i className="bi bi-arrow-left" /> Kembali ke Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
