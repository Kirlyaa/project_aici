import React, { useRef, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import Card from '@/Components/UI/Card';
import ProgressBar from '@/Components/UI/ProgressBar';

interface MeetingReport {
    id: number;
    meetingNumber: number;
    moduleName: string;
    moduleType: string;
    date: string | null;
    scores: {
        interaction: number;
        focus: number;
        robotBuilding: number | null;
        tools: number;
        coding: number;
    };
    average: number;
    tutorNotes: string | null;
}

interface Props {
    studentStats: {
        name: string;
        class: string | null;
        level: string | null;
        totalSessions: number;
        attendance: { hadir: number; absen: number; reschedule: number; percentage: number };
        scores: { interaction: number; focus: number; robotBuilding: number; tools: number; coding: number };
        overallAvg?: number;
        averagePercentage: number;
        meetings?: MeetingReport[];
        comment: { system: string | null; notes: string | null };
    };
    filterInfo?: {
        selectedRange: string;
        activeLabel: string;
        meetingCount: number;
        availableRanges: Array<{ key: string; label: string; start: number; end: number }>;
    };
}

export default function ProfilPDF() {
    const { auth, studentStats, filterInfo } = usePage().props as any as {
        auth: any;
        studentStats: Props['studentStats'];
        filterInfo?: Props['filterInfo'];
    };

    const userName = studentStats?.name || auth?.user?.name || 'Siswa AICI';
    const stats = studentStats ?? {
        name: userName,
        class: null,
        level: null,
        totalSessions: 0,
        attendance: { hadir: 0, absen: 0, reschedule: 0, percentage: 0 },
        scores: { interaction: 0, focus: 0, robotBuilding: 0, tools: 0, coding: 0 },
        overallAvg: 0,
        averagePercentage: 0,
        meetings: [],
        comment: { system: null, notes: null },
    };

    const { attendance, scores, meetings = [] } = stats;
    const isSuperAdmin = auth?.user?.role === 'superadmin';
    const reportRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownloadPdf = async () => {
        if (!reportRef.current || isDownloading) return;

        try {
            setIsDownloading(true);
            const html2pdfModule = await import('html2pdf.js');
            const html2pdf = (html2pdfModule as any).default || html2pdfModule;

            const sanitizedName = userName.replace(/[^a-zA-Z0-9_-]/g, '_');
            const rangeLabel = filterInfo?.activeLabel ? filterInfo.activeLabel.replace(/\s+/g, '_') : 'Periode';
            const filename = `Rapor_${sanitizedName}_${rangeLabel}.pdf`;

            const opt = {
                margin: [10, 10, 10, 10],
                filename: filename,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, logging: false },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
            };

            await html2pdf().set(opt).from(reportRef.current).save();
        } catch (error) {
            console.error('Error saat download PDF:', error);
            // Fallback ke window.print() jika runtime html2pdf menemui kendala
            window.print();
        } finally {
            setIsDownloading(false);
        }
    };

    // Rata-rata akurat dari backend atau perhitungan dinamis berdasarkan kriteria aktif
    const displayAverage = stats.overallAvg !== undefined && stats.overallAvg !== null
        ? Number(stats.overallAvg).toFixed(2)
        : (() => {
            const activeScores = [
                scores.interaction,
                scores.focus,
                scores.tools,
                scores.coding,
            ];
            if (scores.robotBuilding > 0) {
                activeScores.push(scores.robotBuilding);
            }
            const sum = activeScores.reduce((acc, v) => acc + v, 0);
            return (sum / (activeScores.length || 1)).toFixed(2);
        })();

    return (
        <>
            <Head title={`Rapor Siswa - ${userName}`} />

            <div className="bg-white min-h-screen">
                <div ref={reportRef} className="max-w-4xl mx-auto p-8">
                    {/* SuperAdmin Navigation Banner */}
                    {isSuperAdmin && (
                        <div className="print:hidden mb-6 flex flex-wrap items-center justify-between gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/superadmin/students"
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-100 text-gray-800 text-xs font-semibold rounded-lg transition"
                                >
                                    <i className="bi bi-arrow-left" /> Kelola Murid
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-100 text-gray-800 text-xs font-semibold rounded-lg transition"
                                >
                                    Kembali
                                </button>
                            </div>
                            <span className="text-xs font-medium text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                                Mode Tinjau SuperAdmin
                            </span>
                        </div>
                    )}

                    {/* Document Header with Logo */}
                    <div className="flex items-center justify-between pb-4 mb-5 border-b border-gray-200">
                        <img
                            src="/images/logo-aici.png"
                            alt="AICI Logo"
                            className="h-12 w-auto object-contain"
                        />
                        <div className="text-right">
                            <h2 className="text-sm font-bold text-gray-800">RAPOR CAPAIAN BELAJAR SISWA</h2>
                            <p className="text-xs text-gray-500">Artificial Intelligence Center Indonesia</p>
                        </div>
                    </div>

                    {/* Header Card */}
                    <Card className="p-6 mb-6 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                                <p className="text-teal-100 text-sm mb-1">Peserta Program</p>
                                <h1 className="text-3xl font-bold mb-1">{userName}</h1>
                                <p className="text-teal-100 mb-4">{stats.class ?? 'Belum ada kelas'}</p>
                                <div className="flex flex-wrap gap-2">
                                    {stats.level && (
                                        <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                                            <i className="bi bi-trophy-fill"></i> {stats.level}
                                        </span>
                                    )}
                                    <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                                        <i className="bi bi-check-circle-fill"></i> {stats.totalSessions} Sesi Total
                                    </span>
                                </div>
                            </div>

                            {/* Periode Pertemuan Badge */}
                            {filterInfo && (
                                <div className="bg-white/10 border border-white/20 rounded-xl p-3.5 backdrop-blur-sm self-start sm:self-auto text-right">
                                    <span className="text-[11px] font-semibold text-teal-200 uppercase tracking-wider block">
                                        Periode Laporan Nilai
                                    </span>
                                    <p className="text-lg font-bold text-white mt-0.5">
                                        {filterInfo.activeLabel}
                                    </p>
                                    <p className="text-xs text-teal-100 mt-0.5">
                                        Basis perhitungan: {filterInfo.meetingCount} Pertemuan
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Komentar Sistem (AI-Generated Evaluasi) */}
                    {stats.comment.system && (
                        <div className="mb-6 rounded-2xl bg-gradient-to-br from-teal-50/90 via-white to-emerald-50/70 border border-teal-200/90 p-5 sm:p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white border border-teal-200 p-1.5 flex items-center justify-center flex-shrink-0 shadow-sm">
                                    <img
                                        src="/images/logo-aici.png"
                                        alt="AICI Logo"
                                        className="w-full h-auto object-contain"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 bg-teal-100/70 px-2.5 py-0.5 rounded-md">
                                            AICI
                                        </span>
                                        <span className="text-xs text-gray-400">|</span>
                                        <span className="text-xs text-teal-700 font-medium">Analisis Capaian Pembelajaran</span>
                                    </div>
                                    <p className="text-sm sm:text-base text-gray-800 leading-relaxed font-normal">
                                        "{stats.comment.system}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Statistics Grid */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <Card className="p-6">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <i className="bi bi-calendar-check text-teal-600"></i>
                                Statistik Kehadiran
                            </h2>
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <div className="text-3xl font-bold text-green-600">{attendance.hadir}</div>
                                    <div className="text-sm text-gray-600">Hadir</div>
                                </div>
                                <div className="text-center p-4 bg-red-50 rounded-lg">
                                    <div className="text-3xl font-bold text-red-600">{attendance.absen}</div>
                                    <div className="text-sm text-gray-600">Absen</div>
                                </div>
                                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                    <div className="text-3xl font-bold text-yellow-600">{attendance.reschedule}</div>
                                    <div className="text-sm text-gray-600">Reschedule</div>
                                </div>
                            </div>
                            <ProgressBar value={attendance.percentage} label="Tingkat Kehadiran" color="bg-green-600" />
                            <p className="text-sm text-gray-500 mt-2">
                                {attendance.percentage}% ({attendance.hadir} dari {stats.totalSessions} sesi)
                            </p>
                        </Card>

                        <Card className="p-6">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <i className="bi bi-bar-chart-fill text-teal-600"></i>
                                Breakdown Nilai
                            </h2>
                            <div className="space-y-3">
                                <ProgressBar value={scores.interaction} max={5} label="Interaksi" color="bg-teal-600" />
                                <ProgressBar value={scores.focus} max={5} label="Fokus" color="bg-blue-600" />
                                <ProgressBar value={scores.robotBuilding} max={5} label="Robot Building" color="bg-green-600" />
                                <ProgressBar value={scores.tools} max={5} label="Tools Mgmt" color="bg-orange-600" />
                                <ProgressBar value={scores.coding} max={5} label="Coding" color="bg-red-600" />
                            </div>
                            <div className="mt-4 pt-4 border-t">
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Rata-rata (skala 0–5)</span>
                                    <span className="text-2xl font-bold text-teal-600">{displayAverage}</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* 1. Grafik Summary (Rata-rata Keseluruhan Siklus) */}
                    <Card className="p-6 mb-6 print:break-inside-avoid">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-gray-100 gap-2">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <i className="bi bi-graph-up text-teal-600"></i>
                                    Grafik 1: Rata-Rata Capaian (Summary)
                                </h2>
                                <p className="text-xs text-gray-500">Agregasi performa belajar dari seluruh pertemuan periode ini</p>
                            </div>
                            <span className="self-start sm:self-auto text-xs font-semibold px-2.5 py-1 bg-teal-50 text-teal-700 rounded-md border border-teal-200">
                                Rata-rata: {displayAverage} / 5.00
                            </span>
                        </div>

                        <div className="h-44 bg-gray-50 rounded-xl flex items-end justify-around p-4 border border-gray-100">
                            <div className="text-center">
                                <div className="text-xs font-bold text-teal-700 mb-1">{scores.interaction.toFixed(1)}</div>
                                <div className="w-14 sm:w-16 bg-teal-600 rounded-t" style={{ height: `${(scores.interaction / 5) * 120}px` }}></div>
                                <span className="text-[11px] font-medium text-gray-600 mt-2 block">Interaksi</span>
                            </div>
                            <div className="text-center">
                                <div className="text-xs font-bold text-blue-700 mb-1">{scores.focus.toFixed(1)}</div>
                                <div className="w-14 sm:w-16 bg-blue-600 rounded-t" style={{ height: `${(scores.focus / 5) * 120}px` }}></div>
                                <span className="text-[11px] font-medium text-gray-600 mt-2 block">Fokus</span>
                            </div>
                            <div className="text-center">
                                <div className="text-xs font-bold text-green-700 mb-1">{scores.robotBuilding.toFixed(1)}</div>
                                <div className="w-14 sm:w-16 bg-green-600 rounded-t" style={{ height: `${(scores.robotBuilding / 5) * 120}px` }}></div>
                                <span className="text-[11px] font-medium text-gray-600 mt-2 block">Robot Build</span>
                            </div>
                            <div className="text-center">
                                <div className="text-xs font-bold text-orange-700 mb-1">{scores.tools.toFixed(1)}</div>
                                <div className="w-14 sm:w-16 bg-orange-600 rounded-t" style={{ height: `${(scores.tools / 5) * 120}px` }}></div>
                                <span className="text-[11px] font-medium text-gray-600 mt-2 block">Tools Mgmt</span>
                            </div>
                            <div className="text-center">
                                <div className="text-xs font-bold text-red-700 mb-1">{scores.coding.toFixed(1)}</div>
                                <div className="w-14 sm:w-16 bg-red-600 rounded-t" style={{ height: `${(scores.coding / 5) * 120}px` }}></div>
                                <span className="text-[11px] font-medium text-gray-600 mt-2 block">Coding</span>
                            </div>
                        </div>
                    </Card>

                    {/* 2. Grafik Pertemuan 1 - 4 dengan Komentar Tutor Tepat di Bawah Masing-masing Grafik */}
                    <div className="space-y-6 mb-6">
                        <div className="border-b border-gray-200 pb-2">
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <i className="bi bi-calendar4-week text-teal-600"></i>
                                Grafik Capaian & Evaluasi Tutor Per Pertemuan
                            </h2>
                            <p className="text-xs text-gray-500">Evaluasi perkembangan kriteria belajar dan umpan balik langsung tutor pada setiap pertemuan</p>
                        </div>

                        {meetings && meetings.length > 0 ? (
                            meetings.map((meeting, index) => {
                                const mScores = meeting.scores;
                                return (
                                    <div
                                        key={meeting.id || index}
                                        className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs print:break-inside-avoid"
                                    >
                                        {/* Header Pertemuan */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-3 border-b border-gray-100 gap-2">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-600 text-white">
                                                        Pertemuan {meeting.meetingNumber ?? index + 1}
                                                    </span>
                                                    <h3 className="text-sm font-bold text-gray-800">
                                                        {meeting.moduleName}
                                                    </h3>
                                                </div>
                                                {meeting.date && (
                                                    <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
                                                        <i className="bi bi-calendar3" /> {meeting.date}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs text-gray-500 block">Rata-rata Sesi:</span>
                                                <span className="text-sm font-bold text-teal-700">{meeting.average.toFixed(2)} / 5.00</span>
                                            </div>
                                        </div>

                                        {/* Grafik Batang Pertemuan */}
                                        <div className="h-40 bg-gray-50/80 rounded-xl flex items-end justify-around p-3 border border-gray-100 mb-4">
                                            <div className="text-center">
                                                <div className="text-xs font-bold text-teal-700 mb-1">{mScores.interaction.toFixed(1)}</div>
                                                <div className="w-12 sm:w-14 bg-teal-600 rounded-t" style={{ height: `${(mScores.interaction / 5) * 100}px` }}></div>
                                                <span className="text-[10px] font-medium text-gray-600 mt-1.5 block">Interaksi</span>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-xs font-bold text-blue-700 mb-1">{mScores.focus.toFixed(1)}</div>
                                                <div className="w-12 sm:w-14 bg-blue-600 rounded-t" style={{ height: `${(mScores.focus / 5) * 100}px` }}></div>
                                                <span className="text-[10px] font-medium text-gray-600 mt-1.5 block">Fokus</span>
                                            </div>
                                            {mScores.robotBuilding !== null ? (
                                                <div className="text-center">
                                                    <div className="text-xs font-bold text-green-700 mb-1">{mScores.robotBuilding.toFixed(1)}</div>
                                                    <div className="w-12 sm:w-14 bg-green-600 rounded-t" style={{ height: `${(mScores.robotBuilding / 5) * 100}px` }}></div>
                                                    <span className="text-[10px] font-medium text-gray-600 mt-1.5 block">Robot Build</span>
                                                </div>
                                            ) : (
                                                <div className="text-center opacity-40">
                                                    <div className="text-xs font-bold text-gray-400 mb-1">—</div>
                                                    <div className="w-12 sm:w-14 bg-gray-200 rounded-t h-2"></div>
                                                    <span className="text-[10px] font-medium text-gray-400 mt-1.5 block">Robot Build</span>
                                                </div>
                                            )}
                                            <div className="text-center">
                                                <div className="text-xs font-bold text-orange-700 mb-1">{mScores.tools.toFixed(1)}</div>
                                                <div className="w-12 sm:w-14 bg-orange-600 rounded-t" style={{ height: `${(mScores.tools / 5) * 100}px` }}></div>
                                                <span className="text-[10px] font-medium text-gray-600 mt-1.5 block">Tools Mgmt</span>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-xs font-bold text-red-700 mb-1">{mScores.coding.toFixed(1)}</div>
                                                <div className="w-12 sm:w-14 bg-red-600 rounded-t" style={{ height: `${(mScores.coding / 5) * 100}px` }}></div>
                                                <span className="text-[10px] font-medium text-gray-600 mt-1.5 block">Coding</span>
                                            </div>
                                        </div>

                                        {/* Komentar Tutor Tepat di Bawah Grafik Pertemuan */}
                                        <div className="rounded-xl bg-amber-50/70 border border-amber-200/90 p-3.5">
                                            <div className="flex items-start gap-2.5">
                                                <div className="w-6 h-6 rounded-md bg-amber-600 text-white flex items-center justify-center flex-shrink-0 text-xs mt-0.5">
                                                    <i className="bi bi-chat-quote-fill" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[11px] font-bold text-amber-900 uppercase tracking-wide mb-0.5">
                                                        Komentar Tutor (Pertemuan {meeting.meetingNumber ?? index + 1}):
                                                    </p>
                                                    <p className="text-xs text-gray-800 leading-relaxed">
                                                        {meeting.tutorNotes || 'Belum ada catatan evaluasi khusus untuk pertemuan ini.'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-6 text-center text-sm text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                Belum ada rincian pertemuan 1 s.d. 4 pada periode ini.
                            </div>
                        )}
                    </div>

                    {/* Catatan Tutor Umum / Akhir Periode */}
                    {stats.comment.notes && (
                        <div className="mb-6 rounded-2xl bg-gradient-to-br from-amber-50/80 via-white to-orange-50/50 border border-amber-200/90 p-5 sm:p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                                    <i className="bi bi-person-lines-fill text-xl" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-md">
                                            Catatan Tutor
                                        </span>
                                    </div>
                                    <p className="text-sm sm:text-base text-gray-800 leading-relaxed font-normal">
                                        {stats.comment.notes}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                        {/* Footer */}
                        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 mt-8 pt-4 border-t border-gray-200">
                            <p>Catatan ini dibuat pada {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })} oleh sistem AICI</p>
                            <p className="mt-1 sm:mt-0 font-medium">Artificial Intelligence Center Indonesia</p>
                        </div>
                    </div>

                    {/* Widget Sticky di Sudut Kanan Bawah (Persis Tampilan Awal: Ubah Periode + Tombol Download PDF) */}
                    {filterInfo && filterInfo.availableRanges.length > 0 && (
                        <div className="print:hidden fixed bottom-6 right-6 bg-white/95 backdrop-blur-md border border-gray-200 shadow-2xl p-4 rounded-2xl flex items-center gap-4 z-50">
                            <i className="bi bi-funnel-fill text-teal-600 text-lg flex-shrink-0" />
                            <div className="text-xs">
                                <p className="font-bold text-gray-800 mb-1">Ubah Periode Rapor:</p>
                                <select
                                    value={filterInfo.selectedRange}
                                    onChange={(e) => {
                                        const currentPath = window.location.pathname;
                                        window.location.href = `${currentPath}?range=${e.target.value}`;
                                    }}
                                    className="pl-3 pr-8 py-2 border border-gray-300 rounded-xl text-xs bg-white focus:ring-2 focus:ring-teal-500 font-medium text-gray-700 shadow-2xs cursor-pointer min-w-[200px]"
                                >
                                    {filterInfo.availableRanges.map(r => (
                                        <option key={r.key} value={r.key}>
                                            {r.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="button"
                                onClick={handleDownloadPdf}
                                disabled={isDownloading}
                                className="ml-1 px-4 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer flex-shrink-0 self-end mb-0.5"
                            >
                                {isDownloading ? (
                                    <>
                                        <i className="bi bi-arrow-repeat animate-spin" /> Mengunduh...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-download" /> Download
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </>
        );
    }
