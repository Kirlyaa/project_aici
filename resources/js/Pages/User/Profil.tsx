import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import UserLayout from '@/Layouts/UserLayout';

interface CategoryScore {
    category: string;
    label: string;
    score: number; // 0 to 5 scale
}

interface MeetingScoreItem {
    id: number;
    meetingNumber: number;
    moduleName?: string;
    date?: string;
    scores: {
        interaction: number;
        focus: number;
        robotBuilding: number | null;
        tools: number;
        coding: number;
    };
}

export default function Profil() {
    const { props } = usePage();
    const auth = (props as any).auth;
    const studentStats = (props as any).studentStats;
    const gradeScale: number = (props as any).gradeScale ?? 5;
    const pdfRanges: Array<{ key: string; label: string; start: number; end: number }> =
        (props as any).pdfRanges ?? [];

    const userName = studentStats?.name || auth?.user?.name || 'Siswa AICI';
    const [activeTab, setActiveTab] = useState<'robot' | 'focus'>('robot');
    const [showPdfModal, setShowPdfModal] = useState(false);
    const [selectedRange, setSelectedRange] = useState<string>('all');

    // Data skor per pertemuan
    const meetingScores: MeetingScoreItem[] = studentStats?.meetingScores ?? [];
    const [currentMeetingIndex, setCurrentMeetingIndex] = useState<number>(0);

    const activeMeeting = meetingScores.length > 0 && meetingScores[currentMeetingIndex]
        ? meetingScores[currentMeetingIndex]
        : null;

    const scores = studentStats?.scores ?? {
        interaction: 0,
        focus: 0,
        robotBuilding: 0,
        tools: 0,
        coding: 0,
    };

    // Nilai aktif untuk grafik: jika ada data per pertemuan, pakai dataset pertemuan terpilih
    const activeScores = activeMeeting ? activeMeeting.scores : scores;

    // 5 Kategori tetap sama persis sesuai format asli
    const categoryData: CategoryScore[] = [
        { category: 'Interaction', label: 'Interact...', score: activeScores.interaction ?? 0 },
        { category: 'Focus', label: 'Focus', score: activeScores.focus ?? 0 },
        { category: 'Robot Building', label: 'Robot B...', score: activeScores.robotBuilding ?? 0 },
        { category: 'Tools', label: 'Tools', score: activeScores.tools ?? 0 },
        { category: 'Coding', label: 'Coding', score: activeScores.coding ?? 0 },
    ];

    const focusToolsData: CategoryScore[] = [
        { category: 'Focus', label: 'Focus', score: activeScores.focus ?? 0 },
        { category: 'Tools', label: 'Tools', score: activeScores.tools ?? 0 },
        { category: 'Interaction', label: 'Interact...', score: activeScores.interaction ?? 0 },
        { category: 'Robot Building', label: 'Robot B...', score: activeScores.robotBuilding ?? 0 },
        { category: 'Coding', label: 'Coding', score: activeScores.coding ?? 0 },
    ];

    // Data rata-rata kumulatif untuk card bawah
    const averageCategoryData: CategoryScore[] = [
        { category: 'Interaction', label: 'Interact...', score: scores.interaction },
        { category: 'Focus', label: 'Focus', score: scores.focus },
        { category: 'Robot Building', label: 'Robot B...', score: scores.robotBuilding },
        { category: 'Tools', label: 'Tools', score: scores.tools },
        { category: 'Coding', label: 'Coding', score: scores.coding },
    ];

    const currentScores = activeTab === 'robot' ? categoryData : focusToolsData;
    const comment = studentStats?.comment ?? {
        system: null,
        notes: null,
    };
    const sessions: { title: string | null; date: string | null; status: string | null }[] =
        studentStats?.sessions ?? [];

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
                            <i className="bi bi-bullseye" /> Coding
                        </button>
                    </div>
                </div>

                {/* 2-Column Section: Komentar Sistem & Top Chart */}
                <div className="grid md:grid-cols-2 gap-6">

                    {/* Left Card: Komentar */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm space-y-4">
                        <h2 className="text-base font-bold text-gray-900">Komentar</h2>

                        {/* Komentar Sistem (AI-Generated / Evaluasi Capaian Pembelajaran) */}
                        {comment.system && (
                            <div className="rounded-2xl bg-gradient-to-br from-teal-50/90 via-white to-emerald-50/70 border border-teal-200/90 p-4 sm:p-5 shadow-xs">
                                <div className="flex items-start gap-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-teal-200 p-1.5 flex items-center justify-center flex-shrink-0 shadow-sm">
                                        <img
                                            src="/images/logo-aici.png"
                                            alt="AICI Logo"
                                            className="w-full h-auto object-contain"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded-md">
                                                AICI
                                            </span>
                                            <span className="text-xs text-gray-300">|</span>
                                            <span className="text-xs text-teal-700 font-medium">Analisis Capaian Pembelajaran</span>
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-normal">
                                            "{comment.system}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Catatan Tutor */}
                        {comment.notes && (
                            <div className="rounded-2xl bg-gradient-to-br from-amber-50/80 via-white to-orange-50/50 border border-amber-200/90 p-4 sm:p-5 shadow-xs">
                                <div className="flex items-start gap-3.5">
                                    <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                                        <i className="bi bi-person-lines-fill text-xl" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-md">
                                                CATATAN TUTOR
                                            </span>
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-normal">
                                            {comment.notes}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Fallback jika belum ada komentar sama sekali */}
                        {!comment.system && !comment.notes && (
                            <p className="text-xs text-gray-400 italic">Belum ada komentar. Nilai akan muncul setelah sesi pertama.</p>
                        )}
                    </div>

                    {/* Right Card: Bar Chart Per Pertemuan dengan Slider Panah di Samping Kiri & Kanan */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
                        {/* Header Judul & Tag Pertemuan */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                            <div className="min-w-0">
                                <h2 className="text-base font-bold text-gray-900 truncate">
                                    {activeTab === 'robot' ? 'Robot Building' : 'Coding'}
                                </h2>
                                {activeMeeting?.moduleName && (
                                    <p className="text-xs text-gray-500 truncate mt-0.5" title={activeMeeting.moduleName}>
                                        {activeMeeting.moduleName}
                                    </p>
                                )}
                            </div>

                            {meetingScores.length > 0 && activeMeeting && (
                                <div className="text-right flex-shrink-0">
                                    <span className="inline-block text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full shadow-2xs">
                                        Pertemuan {activeMeeting.meetingNumber}
                                    </span>
                                    {activeMeeting.date && (
                                        <p className="text-[11px] text-gray-400 mt-0.5">{activeMeeting.date}</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Slider / Carousel yang mengapit chart dengan tombol panah di kiri dan kanan */}
                        <div className="relative flex items-center gap-2 sm:gap-3 w-full my-auto">
                            {/* Tombol Panah Kiri */}
                            <button
                                type="button"
                                onClick={() => setCurrentMeetingIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentMeetingIndex === 0 || meetingScores.length <= 1}
                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-200 bg-white hover:bg-teal-50 hover:border-teal-300 text-gray-700 hover:text-teal-700 disabled:opacity-20 disabled:hover:bg-white disabled:hover:border-gray-200 disabled:hover:text-gray-700 disabled:cursor-not-allowed shadow-xs transition flex items-center justify-center flex-shrink-0"
                                title="Pertemuan Sebelumnya"
                                aria-label="Pertemuan Sebelumnya"
                            >
                                <i className="bi bi-chevron-left text-sm sm:text-base font-bold" />
                            </button>

                            {/* Area Grafik di Tengah */}
                            <div className="flex-1 min-w-0">
                                <BarChartVisual data={currentScores} gradeScale={gradeScale} />
                            </div>

                            {/* Tombol Panah Kanan */}
                            <button
                                type="button"
                                onClick={() => setCurrentMeetingIndex(prev => Math.min(meetingScores.length - 1, prev + 1))}
                                disabled={currentMeetingIndex >= meetingScores.length - 1 || meetingScores.length <= 1}
                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-gray-200 bg-white hover:bg-teal-50 hover:border-teal-300 text-gray-700 hover:text-teal-700 disabled:opacity-20 disabled:hover:bg-white disabled:hover:border-gray-200 disabled:hover:text-gray-700 disabled:cursor-not-allowed shadow-xs transition flex items-center justify-center flex-shrink-0"
                                title="Pertemuan Selanjutnya"
                                aria-label="Pertemuan Selanjutnya"
                            >
                                <i className="bi bi-chevron-right text-sm sm:text-base font-bold" />
                            </button>
                        </div>

                        {/* Indikator Slider Pertemuan (Bullets) */}
                        {meetingScores.length > 1 && (
                            <div className="flex items-center justify-center gap-1.5 pt-3">
                                {meetingScores.map((m, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setCurrentMeetingIndex(idx)}
                                        className={`h-1.5 rounded-full transition-all ${
                                            idx === currentMeetingIndex
                                                ? 'w-6 bg-teal-600'
                                                : 'w-2 bg-gray-200 hover:bg-gray-300'
                                        }`}
                                        title={`Pindah ke Pertemuan ${m.meetingNumber}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Full-Width Card: Rata-rata Per Kategori */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm space-y-4">
                    <h2 className="text-base font-bold text-gray-900">Rata-rata Per Kategori</h2>

                    <BarChartVisual data={averageCategoryData} isWide gradeScale={gradeScale} />
                </div>

                {/* R9: Riwayat Sesi */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm">
                    <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <i className="bi bi-clock-history text-teal-600" /> Riwayat Sesi
                    </h2>
                    {sessions.length === 0 ? (
                        <p className="text-sm text-gray-400 italic">Belum ada riwayat sesi.</p>
                    ) : (
                        <div className="space-y-2">
                            {sessions.map((s, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <i className={`bi ${s.status === 'hadir' ? 'bi-check-circle-fill text-green-500' : s.status === 'absen' ? 'bi-x-circle-fill text-red-500' : 'bi-arrow-repeat text-yellow-500'} text-lg`} />
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">{s.title ?? '—'}</p>
                                            <p className="text-xs text-gray-500">{s.date ?? '—'}</p>
                                        </div>
                                    </div>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.status === 'hadir' ? 'bg-green-100 text-green-700' : s.status === 'absen' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {s.status ?? '—'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Red Action Button at Bottom Left */}
                <div className="pt-2">
                    <button
                        type="button"
                        onClick={() => setShowPdfModal(true)}
                        className="inline-flex items-center gap-2 bg-[#b91c1c] text-white px-5 py-2.5 rounded-xl font-bold hover:bg-red-800 transition-colors text-xs sm:text-sm shadow-md"
                    >
                        <i className="bi bi-file-earmark-pdf-fill text-base" />
                        Cetak Rapor PDF / Detail Lengkap
                    </button>
                </div>
            </div>

            {/* Modal Pilihan Rentang Pertemuan PDF */}
            {showPdfModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
                        <div className="flex items-center justify-between border-b pb-3">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                                    <i className="bi bi-file-earmark-pdf-fill text-lg" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-base text-gray-900">Pilih Periode Rapor PDF</h3>
                                    <p className="text-xs text-gray-500">Pilih rentang pertemuan nilai yang ingin dihitung & dicetak</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowPdfModal(false)}
                                className="text-gray-400 hover:text-gray-600 p-1"
                            >
                                <i className="bi bi-x-lg" />
                            </button>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Rentang Pertemuan Tersedia
                            </label>

                            {pdfRanges.length > 0 ? (
                                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                                    {pdfRanges.map(r => (
                                        <label
                                            key={r.key}
                                            className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                                                selectedRange === r.key
                                                    ? 'border-red-600 bg-red-50/70 text-red-900 ring-1 ring-red-500'
                                                    : 'border-gray-200 hover:bg-gray-50 text-gray-800'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name="pdf_range"
                                                    value={r.key}
                                                    checked={selectedRange === r.key}
                                                    onChange={() => setSelectedRange(r.key)}
                                                    className="w-4 h-4 text-red-600 focus:ring-red-500"
                                                />
                                                <div>
                                                    <p className="font-bold text-xs">{r.label}</p>
                                                    <p className="text-[11px] text-gray-500">
                                                        {r.key === 'all'
                                                            ? 'Rata-rata kumulatif seluruh pertemuan murid'
                                                            : `Rata-rata 4 pertemuan (${r.start} s/d ${r.end})`}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-600">
                                                {r.key === 'all' ? 'Semua' : '4 Pertemuan'}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 bg-gray-50 rounded-xl text-center text-xs text-gray-500">
                                    Belum ada data pertemuan nilai untuk murid ini.
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-2 pt-2 border-t">
                            <button
                                type="button"
                                onClick={() => setShowPdfModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50"
                            >
                                Batal
                            </button>
                            <a
                                href={`/profil/pdf?range=${selectedRange}`}
                                target="_blank"
                                rel="noreferrer"
                                onClick={() => setShowPdfModal(false)}
                                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold shadow-sm inline-flex items-center gap-1.5"
                            >
                                <i className="bi bi-file-earmark-pdf-fill" /> Unduh Rapor PDF
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </UserLayout>
    );
}

// Custom High-Precision Bar Chart Component matching the exact visual style of the mockup
function BarChartVisual({ data, isWide = false, gradeScale = 5 }: { data: CategoryScore[]; isWide?: boolean; gradeScale?: number }) {
    const maxScale = gradeScale;
    const ticks = [5, 4, 3, 2, 1, 0];
    const barWidthClass = isWide ? 'w-10 sm:w-16' : 'w-7 sm:w-12';

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
                            <div key={idx} className={`relative z-10 flex flex-col items-center justify-end h-full ${barWidthClass}`}>
                                {/* Track Container */}
                                <div className="w-full bg-[#f1f5f9] rounded-sm h-full flex items-end overflow-hidden">
                                    {/* Filled Bar */}
                                    <div
                                        className="w-full bg-[#529699] transition-all duration-500 rounded-t-sm"
                                        style={{ height: `${heightPercent}%` }}
                                        title={`${item.label}: ${item.score} / ${gradeScale}`}
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
                    <span key={idx} className={`${barWidthClass} text-center truncate`}>
                        {item.label}
                    </span>
                ))}
            </div>
        </div>
    );
}
