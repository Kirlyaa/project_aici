import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import UserLayout from '@/Layouts/UserLayout';

interface CategoryScore {
    category: string;
    label: string;
    score: number; // 0 to 5 scale
}

export default function Profil() {
    const { props } = usePage();
    const auth = (props as any).auth;
    const studentStats = (props as any).studentStats;

    const userName = studentStats?.name || auth?.user?.name || 'Siswa AICI';
    const [activeTab, setActiveTab] = useState<'robot' | 'focus'>('robot');

    const scores = studentStats?.scores ?? {
        interaction: 0,
        focus: 0,
        robotBuilding: 0,
        tools: 0,
        coding: 0,
    };

    const categoryData: CategoryScore[] = [
        { category: 'Interaction', label: 'Interact...', score: scores.interaction },
        { category: 'Focus', label: 'Focus', score: scores.focus },
        { category: 'Robot Building', label: 'Robot B...', score: scores.robotBuilding },
        { category: 'Tools', label: 'Tools', score: scores.tools },
        { category: 'Coding', label: 'Coding', score: scores.coding },
    ];

    const focusToolsData: CategoryScore[] = [
        { category: 'Focus', label: 'Focus', score: scores.focus },
        { category: 'Tools', label: 'Tools', score: scores.tools },
        { category: 'Interaction', label: 'Interact...', score: scores.interaction },
        { category: 'Robot Building', label: 'Robot B...', score: scores.robotBuilding },
        { category: 'Coding', label: 'Coding', score: scores.coding },
    ];

    const currentScores = activeTab === 'robot' ? categoryData : focusToolsData;
    const comment = studentStats?.comment ?? {
        general: null,
        strengths: null,
        notes: null,
    };

    return (
        <UserLayout currentPage="profil">
            <Head title="Profil" />

            <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 pb-24 md:pb-12 font-sans">

                {/* Dark Teal Header Card */}
                <div className="relative bg-[#034d52] text-white rounded-2xl p-6 sm:p-8 shadow-md overflow-hidden">
                    {/* Watermark Robot Image */}
                    <div className="absolute right-0 top-0 opacity-10 pointer-events-none translate-x-6 -translate-y-4">
                        <i className="bi bi-robot text-[220px]" />
                    </div>

                    <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        {/* Profile Avatar */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center flex-shrink-0">
                            <i className="bi bi-person-circle text-5xl text-white/90" />
                        </div>

                        {/* Info details */}
                        <div className="space-y-1">
                            <p className="text-teal-200 text-xs font-medium uppercase tracking-wider">PESERTA PROGRAM</p>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{userName}</h1>
                            <p className="text-teal-100 text-xs font-light">{studentStats?.class}</p>

                            {/* Stat Pills */}
                            <div className="pt-3 flex flex-wrap gap-2">
                                {studentStats?.level && (
                                    <span className="px-3.5 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium border border-white/15">
                                        {studentStats.level}
                                    </span>
                                )}
                                <span className="px-3.5 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium border border-white/15">
                                    {studentStats?.completedSessions ?? 0} Sesi Selesai
                                </span>
                                <span className="px-3.5 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-medium border border-white/15">
                                    {studentStats?.averagePercentage ?? 0}% Rata-rata
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Sub Tab Switchers inside Header Card */}
                    <div className="mt-6 flex gap-3 border-t border-white/15 pt-4">
                        <button
                            onClick={() => setActiveTab('robot')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                                activeTab === 'robot'
                                    ? 'bg-white text-[#034d52] shadow-sm'
                                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
                            }`}
                        >
                            <i className="bi bi-robot" /> Robot Building
                        </button>
                        <button
                            onClick={() => setActiveTab('focus')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                                activeTab === 'focus'
                                    ? 'bg-white text-[#034d52] shadow-sm'
                                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
                            }`}
                        >
                            <i className="bi bi-bullseye" /> Focus & Tools
                        </button>
                    </div>
                </div>

                {/* 2-Column Section: Komentar Sistem & Top Chart */}
                <div className="grid md:grid-cols-2 gap-6">

                    {/* Left Card: Komentar Sistem */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm space-y-4">
                        <h2 className="text-base font-bold text-gray-900">Komentar Sistem</h2>

                        {/* Analisis Umum */}
                        <div className="bg-[#f2f8f8] border-l-4 border-[#034d52] p-4 rounded-r-xl">
                            <h3 className="font-bold text-xs sm:text-sm text-gray-900 mb-1">Analisis Umum</h3>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                {comment.general ?? 'Belum ada analisis sistem. Nilai akan muncul setelah sesi pertama.'}
                            </p>
                        </div>

                        {/* Kelebihan */}
                        {comment.strengths && (
                            <div className="bg-[#f0faf2] border-l-4 border-emerald-600 p-4 rounded-r-xl">
                                <h3 className="font-bold text-xs sm:text-sm text-gray-900 mb-1 flex items-center gap-1.5">
                                    <i className="bi bi-check-circle-fill text-emerald-600" /> Kelebihan
                                </h3>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    {comment.strengths}
                                </p>
                            </div>
                        )}

                        {/* Catatan */}
                        {comment.notes && (
                            <div className="bg-[#fffdf2] border-l-4 border-amber-600 p-4 rounded-r-xl">
                                <h3 className="font-bold text-xs sm:text-sm text-gray-900 mb-1 flex items-center gap-1.5">
                                    <i className="bi bi-exclamation-triangle-fill text-amber-600" /> Catatan
                                </h3>
                                <p className="text-xs text-gray-600 leading-relaxed">
                                    {comment.notes}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right Card: Robot Building Bar Chart */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
                        <h2 className="text-base font-bold text-gray-900 mb-4">
                            {activeTab === 'robot' ? 'Robot Building' : 'Focus & Tools'}
                        </h2>

                        <BarChartVisual data={currentScores} />
                    </div>
                </div>

                {/* Bottom Full-Width Card: Rata-rata Per Kategori */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm space-y-4">
                    <h2 className="text-base font-bold text-gray-900">Rata-rata Per Kategori</h2>

                    <BarChartVisual data={categoryData} isWide />
                </div>

                {/* Red Action Button at Bottom Left */}
                <div className="pt-2">
                    <a
                        href="/profil/pdf"
                        target="_blank"
                        className="inline-flex items-center gap-2 bg-[#b91c1c] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-red-800 transition-colors text-xs sm:text-sm shadow-md"
                    >
                        <i className="bi bi-file-earmark-text-fill text-base" />
                        Lihat Detail Lengkap
                    </a>
                </div>
            </div>
        </UserLayout>
    );
}

// Custom High-Precision Bar Chart Component matching the exact visual style of the mockup
function BarChartVisual({ data, isWide = false }: { data: CategoryScore[]; isWide?: boolean }) {
    const maxScale = 5;
    const ticks = [5, 4, 3, 2, 1, 0];

    return (
        <div className="w-full flex flex-col pt-2">
            <div className="relative flex h-52 sm:h-60 w-full border-b border-gray-200">
                {/* Y Axis Labels */}
                <div className="flex flex-col justify-between text-[11px] text-gray-400 font-mono pr-2 select-none">
                    {ticks.map(tick => (
                        <span key={tick} className="leading-none">{tick}</span>
                    ))}
                </div>

                {/* Grid Lines & Bars Area */}
                <div className="relative flex-1 flex items-end justify-around h-full pt-2">
                    {/* Horizontal Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                        {ticks.map(tick => (
                            <div key={tick} className="border-b border-gray-100 w-full h-0" />
                        ))}
                    </div>

                    {/* Render Each Bar */}
                    {data.map((item, idx) => {
                        const heightPercent = (item.score / maxScale) * 100;
                        return (
                            <div key={idx} className="relative z-10 flex flex-col items-center justify-end h-full w-10 sm:w-16">
                                {/* Track Container */}
                                <div className="w-full bg-[#f1f5f9] rounded-sm h-full flex items-end overflow-hidden">
                                    {/* Filled Bar */}
                                    <div
                                        className="w-full bg-[#529699] transition-all duration-500 rounded-t-sm"
                                        style={{ height: `${heightPercent}%` }}
                                        title={`${item.label}: ${item.score} / 5`}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* X Axis Category Labels */}
            <div className="flex justify-around pl-4 pt-3 text-[10px] sm:text-[11px] font-semibold text-gray-600">
                {data.map((item, idx) => (
                    <span key={idx} className="w-10 sm:w-16 text-center truncate">
                        {item.label}
                    </span>
                ))}
            </div>
        </div>
    );
}
