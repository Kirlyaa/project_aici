import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { SessionStatus } from '@/types/session';

const statuses: { value: SessionStatus; label: string }[] = [
    { value: 'hadir',         label: 'Hadir' },
    { value: 'absen',         label: 'Absen' },
    { value: 'reschedule',    label: 'Reschedule' },
    { value: 'libur',         label: 'Libur' },
    { value: 'akan-datang',   label: 'Akan Datang' },
];

interface Props {
    mode?: 'create' | 'edit';
    session?: {
        id?: number;
        title?: string;
        date?: string;
        module?: string;
        status?: SessionStatus;
        description?: string;
        tools?: string[];
    };
}

export default function SessionForm({ mode = 'create', session }: Props) {
    const [title, setTitle] = useState(session?.title ?? '');
    const [date, setDate] = useState(session?.date ?? '');
    const [module, setModule] = useState(session?.module ?? '');
    const [status, setStatus] = useState<SessionStatus>(session?.status ?? 'akan-datang');
    const [description, setDescription] = useState(session?.description ?? '');
    const [toolInput, setToolInput] = useState('');
    const [tools, setTools] = useState<string[]>(session?.tools ?? []);

    const addTool = () => {
        const t = toolInput.trim();
        if (t && !tools.includes(t)) {
            setTools(prev => [...prev, t]);
            setToolInput('');
        }
    };

    const removeTool = (t: string) => setTools(prev => prev.filter(x => x !== t));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: connect to backend API
        alert(`Sesi "${title}" ${mode === 'create' ? 'ditambahkan' : 'diperbarui'}!`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title={mode === 'create' ? 'Tambah Sesi' : 'Edit Sesi'} />

            {/* Tutor Navbar */}
            <nav className="bg-teal-700 text-white px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <i className="bi bi-cpu-fill" />
                    </div>
                    <span className="font-bold text-lg">AICI</span>
                    <span className="text-teal-200 text-sm">/ Tutor Panel</span>
                </div>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <i className="bi bi-person-fill" />
                </div>
            </nav>

            <div className="max-w-2xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <Link href="/tutor/sessions" className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
                        <i className="bi bi-arrow-left" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {mode === 'create' ? 'Tambah Sesi Baru' : 'Edit Sesi'}
                        </h1>
                        <p className="text-gray-500 text-sm">
                            {mode === 'create' ? 'Buat sesi pembelajaran baru' : `Edit sesi: ${session?.title}`}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Title */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <i className="bi bi-info-circle text-teal-600" /> Info Dasar
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Judul Sesi <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="contoh: Perkenalan Robot & Coding Dasar"
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tanggal <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={date}
                                        onChange={e => setDate(e.target.value)}
                                        placeholder="Sabtu, 5 Juli 2025"
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        value={status}
                                        onChange={e => setStatus(e.target.value as SessionStatus)}
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                    >
                                        {statuses.map(s => (
                                            <option key={s.value} value={s.value}>{s.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Modul</label>
                                <input
                                    type="text"
                                    value={module}
                                    onChange={e => setModule(e.target.value)}
                                    placeholder="Modul 1 – Pengenalan Robotika"
                                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <i className="bi bi-text-paragraph text-teal-600" /> Deskripsi
                        </h2>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={4}
                            placeholder="Deskripsi singkat tentang materi sesi ini..."
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                        />
                    </div>

                    {/* Tools */}
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <i className="bi bi-tools text-teal-600" /> Alat yang Perlu Dibawa
                        </h2>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={toolInput}
                                onChange={e => setToolInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTool())}
                                placeholder="Tambah alat (tekan Enter)"
                                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                            />
                            <button
                                type="button"
                                onClick={addTool}
                                className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700"
                            >
                                <i className="bi bi-plus-lg" />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {tools.map(t => (
                                <span key={t} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-sm text-gray-700">
                                    {t}
                                    <button type="button" onClick={() => removeTool(t)} className="text-gray-400 hover:text-red-500">
                                        <i className="bi bi-x" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-3">
                        <Link
                            href="/tutor/sessions"
                            className="flex-1 text-center px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700"
                        >
                            <i className={`bi ${mode === 'create' ? 'bi-plus-lg' : 'bi-check-lg'}`} />
                            {mode === 'create' ? 'Tambah Sesi' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
