import { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';

export interface HolidayAnnouncement {
    id: string;
    title: string;
    letter_number?: string | null;
    holiday_date: string;
    content: string;
    target_role: 'all' | 'user' | 'tutor';
    file_url?: string | null;
    file_name?: string | null;
    is_active: boolean;
    updated_at?: string;
}

export default function HolidayAnnouncementModal() {
    const { holidayAnnouncement, auth } = usePage().props as any;
    const announcement: HolidayAnnouncement | null = holidayAnnouncement;

    const [isOpen, setIsOpen] = useState(false);
    // Flow: 'closed' -> 'unsealing' (heart pop & flap open) -> 'sliding' (letter pulling out) -> 'unfolding' -> 'opened'
    const [animPhase, setAnimPhase] = useState<'closed' | 'unsealing' | 'sliding' | 'unfolding' | 'opened'>('closed');

    useEffect(() => {
        if (!announcement || !announcement.is_active) {
            setIsOpen(false);
            return;
        }

        const storageKey = `aici_holiday_seen_${announcement.id}_user_${auth?.user?.id || 'guest'}`;
        const hasSeen = localStorage.getItem(storageKey);

        if (!hasSeen) {
            setIsOpen(true);
            setAnimPhase('closed');
        }

        // Listener jika user ingin membuka kembali surat melalui tombol floating / menu
        const handleReopen = () => {
            setIsOpen(true);
            setAnimPhase('closed');
        };
        window.addEventListener('open-holiday-announcement', handleReopen);

        return () => {
            window.removeEventListener('open-holiday-announcement', handleReopen);
        };
    }, [announcement, auth?.user?.id]);

    const handleOpen = () => {
        if (animPhase !== 'closed') return;

        // Phase 1: Heart disappears & Flap flips open (0 - 450ms)
        setAnimPhase('unsealing');

        // Phase 2: Letter pulls up out of envelope pocket (450ms - 1050ms)
        setTimeout(() => {
            setAnimPhase('sliding');
        }, 450);

        // Phase 3: Letter expands & unfolds into readable view (1050ms - 1550ms)
        setTimeout(() => {
            setAnimPhase('unfolding');
        }, 1100);

        // Phase 4: Final readable card state
        setTimeout(() => {
            setAnimPhase('opened');
        }, 1550);
    };

    // Jika pencet "Tutup (Nanti Saja)", hanya menutup modal sementara TANPA menandai sudah selesai dibaca
    const handleDismissLater = () => {
        setIsOpen(false);
        setAnimPhase('closed');
    };

    // Jika pencet "Saya Mengerti", tandai permanen agar tidak pop-up otomatis lagi
    const handleAcknowledge = () => {
        if (announcement) {
            const storageKey = `aici_holiday_seen_${announcement.id}_user_${auth?.user?.id || 'guest'}`;
            localStorage.setItem(storageKey, 'true');
        }
        setIsOpen(false);
        setAnimPhase('closed');
    };

    if (!isOpen || !announcement) return null;

    const isEnvelopeStage = animPhase === 'closed' || animPhase === 'unsealing' || animPhase === 'sliding';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto select-none">
            {/* Custom Animations & Styles */}
            <style>{`
                @keyframes gentleFloat {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-6px) rotate(-0.3deg); }
                }
                @keyframes sealGlow {
                    0%, 100% { filter: drop-shadow(0 4px 6px rgba(0,0,0,0.25)); }
                    50% { filter: drop-shadow(0 0 14px rgba(217, 119, 6, 0.45)); }
                }
                @keyframes flapFoldUp {
                    0% { transform: rotateX(0deg); z-index: 25; }
                    49% { z-index: 25; }
                    50% { z-index: 2; }
                    100% { transform: rotateX(180deg); z-index: 2; }
                }
                @keyframes letterPullOut {
                    0% {
                        transform: translateY(10px) scale(0.94);
                        opacity: 0.9;
                    }
                    100% {
                        transform: translateY(-135px) scale(1);
                        opacity: 1;
                    }
                }
                @keyframes paperUnfoldCard {
                    0% {
                        transform: translateY(-50px) scale(0.85);
                        opacity: 0.4;
                    }
                    100% {
                        transform: translateY(0px) scale(1);
                        opacity: 1;
                    }
                }
                .anim-float {
                    animation: gentleFloat 3.5s ease-in-out infinite;
                }
                .anim-seal {
                    animation: sealGlow 2.5s ease-in-out infinite;
                }
                .anim-flap-open {
                    transform-origin: top center;
                    animation: flapFoldUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }
                .anim-letter-pull {
                    animation: letterPullOut 0.75s cubic-bezier(0.25, 1, 0.5, 1) forwards;
                }
                .anim-unfold-modal {
                    animation: paperUnfoldCard 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>

            {/* Backdrop Blur */}
            <div 
                className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300"
                onClick={handleDismissLater}
            />

            {/* Ambient Aura */}
            <div className="absolute pointer-events-none w-96 h-96 rounded-full bg-teal-500/10 blur-3xl" />

            {/* ================= STAGE 1: FORMAL ENVELOPE (CLOSED & SLIDING) ================= */}
            {isEnvelopeStage && (
                <div className="relative z-10 flex flex-col items-center max-w-sm w-full">
                    {/* Official Badge Header */}
                    <div className={`mb-4 text-center transition-all duration-300 ${animPhase === 'closed' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/90 text-slate-800 font-bold text-xs tracking-wider uppercase shadow-lg border border-slate-200/80 backdrop-blur-sm">
                            <i className="bi bi-shield-check text-[#034d52]" />
                            Pengumuman Resmi Lembaga
                        </span>
                        <p className="text-white/90 text-xs font-medium mt-1.5 drop-shadow">
                            Klik dokumen amplop untuk membuka surat
                        </p>
                    </div>

                    {/* 3D Envelope Scene Container */}
                    <div
                        onClick={handleOpen}
                        className={`relative w-72 sm:w-80 h-48 sm:h-52 cursor-pointer transition-transform duration-300 ${
                            animPhase === 'closed' ? 'anim-float hover:scale-[1.02] active:scale-95' : ''
                        }`}
                        style={{ perspective: '1200px' }}
                    >
                        {/* Floor Shadow */}
                        <div className="absolute -bottom-4 left-6 right-6 h-5 bg-black/40 rounded-full blur-md" />

                        {/* ============ LAYER 1: BACK OF ENVELOPE (Deep Regal Blue-Green Interior) ============ */}
                        <div 
                            className="absolute inset-0 rounded-xl border border-slate-700/60 shadow-2xl overflow-hidden"
                            style={{ backgroundColor: '#02383c', zIndex: 1 }}
                        />

                        {/* ============ LAYER 2: THE PHYSICAL LETTER SHEET (Sliding out) ============ */}
                        <div 
                            className={`absolute left-3.5 right-3.5 sm:left-4 sm:right-4 bg-white rounded-lg border border-slate-200 shadow-md p-3 flex flex-col items-center text-center ${
                                animPhase === 'sliding' ? 'anim-letter-pull' : 'translate-y-2 opacity-0'
                            }`}
                            style={{ 
                                zIndex: 6,
                                height: '170px',
                                top: '8px',
                            }}
                        >
                            {/* Formal Logo Header */}
                            <div className="flex items-center gap-1.5 mb-1 shrink-0">
                                <img
                                    src="/images/logo-aici.png"
                                    alt="AICI Logo"
                                    className="h-4 w-auto object-contain"
                                />
                            </div>
                            <span className="text-[8px] font-bold tracking-widest text-[#034d52] uppercase block border-b border-slate-200 pb-1 w-full">
                                SURAT PEMBERITAHUAN RESMI
                            </span>
                            <h4 className="text-[11px] font-bold text-slate-800 mt-2 line-clamp-1">
                                {announcement.title}
                            </h4>
                            <div className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-teal-50 text-[#034d52] border border-teal-200 text-[10px] font-semibold">
                                <i className="bi bi-calendar3 text-[9px]" />
                                {announcement.holiday_date}
                            </div>
                            {/* Elegant doc lines */}
                            <div className="w-full space-y-1.5 mt-3 px-2">
                                <div className="h-1 bg-slate-200 rounded-full w-full" />
                                <div className="h-1 bg-slate-100 rounded-full w-4/5 mx-auto" />
                                <div className="h-1 bg-slate-100 rounded-full w-2/3 mx-auto" />
                            </div>
                        </div>

                        {/* ============ LAYER 3: FRONT POCKET OF ENVELOPE (Formal Deep Navy/Teal with Gold Trim) ============ */}
                        <div 
                            className="absolute inset-0 rounded-xl border border-teal-700/60 pointer-events-none overflow-hidden"
                            style={{ 
                                background: 'linear-gradient(145deg, #034d52 0%, #02383c 100%)',
                                zIndex: 10 
                            }}
                        >
                            {/* Subtle Gold Inset Trim Border */}
                            <div className="absolute inset-2 sm:inset-2.5 rounded-lg border border-amber-400/40 pointer-events-none" />

                            {/* Crisp Geometric Fold Seams */}
                            <svg 
                                className="absolute inset-0 w-full h-full" 
                                viewBox="0 0 320 208" 
                                preserveAspectRatio="none"
                            >
                                <line x1="0" y1="208" x2="160" y2="116" stroke="#012427" strokeWidth="1.5" opacity="0.7" />
                                <line x1="320" y1="208" x2="160" y2="116" stroke="#012427" strokeWidth="1.5" opacity="0.7" />
                            </svg>
                        </div>

                        {/* ============ LAYER 4: TOP TRIANGLE FLAP ============ */}
                        <div 
                            className={`absolute top-0 left-0 right-0 h-1/2 ${
                                animPhase === 'unsealing' || animPhase === 'sliding' ? 'anim-flap-open' : ''
                            }`}
                            style={{ 
                                transformOrigin: 'top center',
                                zIndex: animPhase === 'closed' ? 20 : 2 
                            }}
                        >
                            <svg 
                                className="w-full h-full drop-shadow-md" 
                                viewBox="0 0 320 104" 
                                preserveAspectRatio="none"
                            >
                                <defs>
                                    <linearGradient id="flapGrad" x1="0" y1="0" x2="0" y2="100%">
                                        <stop offset="0%" stopColor="#045a60" />
                                        <stop offset="100%" stopColor="#034d52" />
                                    </linearGradient>
                                </defs>
                                <polygon 
                                    points="0,0 320,0 160,104" 
                                    fill="url(#flapGrad)" 
                                    stroke="#02383c" 
                                    strokeWidth="1.5" 
                                />
                                {/* Elegant Gold Line on Flap */}
                                <polyline 
                                    points="16,8 160,96 304,8" 
                                    fill="none" 
                                    stroke="#f59e0b" 
                                    strokeWidth="1.2" 
                                    opacity="0.6" 
                                />
                            </svg>
                        </div>

                        {/* ============ LAYER 5: FORMAL WAX SEAL IN CENTER (Gold Emblem) ============ */}
                        <div 
                            className={`absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                                animPhase === 'closed' ? 'scale-100 opacity-100 anim-seal' : 'scale-125 opacity-0 pointer-events-none'
                            }`}
                            style={{ zIndex: 30 }}
                        >
                            {/* Gold Wax Seal with Crest/Building Emblem */}
                            <div className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 p-0.5 shadow-xl flex items-center justify-center border border-amber-200">
                                <div className="w-full h-full rounded-full border border-amber-600/40 flex flex-col items-center justify-center bg-gradient-to-b from-amber-500 to-amber-600 text-white shadow-inner">
                                    <i className="bi bi-award-fill text-lg drop-shadow-sm text-amber-100" />
                                    <span className="text-[7px] font-black tracking-widest text-amber-100 uppercase">
                                        AICI
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action buttons below */}
                    {animPhase === 'closed' && (
                        <div className="flex flex-col items-center mt-5">
                            <button
                                type="button"
                                onClick={handleOpen}
                                className="px-5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold shadow-lg transition-all flex items-center gap-2 border border-slate-200 active:scale-95"
                            >
                                <i className="bi bi-envelope-open text-[#034d52]" />
                                Buka Dokumen Pengumuman
                            </button>
                            <button
                                type="button"
                                onClick={handleDismissLater}
                                className="mt-2.5 text-[11px] text-white/70 hover:text-white underline transition-colors"
                            >
                                Tutup (Nanti Saja)
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* ================= STAGE 2: FORMAL LETTER MODAL ================= */}
            {(animPhase === 'unfolding' || animPhase === 'opened') && (
                <div 
                    className={`relative z-20 w-full max-w-lg bg-white rounded-xl p-6 sm:p-7 shadow-2xl border border-slate-200 transition-all ${
                        animPhase === 'unfolding' ? 'anim-unfold-modal' : 'scale-100 opacity-100'
                    }`}
                >
                    {/* Formal Letterhead (Kop Surat Resmi) */}
                    <div className="flex items-start justify-between pb-3.5 border-b-2 border-slate-800 mb-4">
                        <div className="flex items-center gap-3">
                            <img
                                src="/images/logo-aici.png"
                                alt="AICI Logo"
                                className="h-8 w-auto object-contain"
                            />
                            <div className="border-l border-slate-300 pl-3">
                                <h4 className="text-xs font-extrabold text-[#034d52] tracking-wider uppercase">
                                    Artificial Intelligence Center Indonesia
                                </h4>
                                <p className="text-[10px] text-slate-500">
                                    Sekretariat Akademik & Operasional Pembelajaran
                                </p>
                            </div>
                        </div>

                        {/* Close button */}
                        <button
                            type="button"
                            onClick={handleDismissLater}
                            className="w-7 h-7 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center text-sm transition-colors"
                            title="Tutup"
                        >
                            <i className="bi bi-x-lg" />
                        </button>
                    </div>

                    {/* Official Letter Number & Title */}
                    <div className="text-center mb-4">
                        <span className="inline-block px-2.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-mono font-medium border border-slate-200 mb-1.5">
                            {announcement.letter_number ? `No: ${announcement.letter_number}` : 'SURAT EDARAN RESMI'}
                        </span>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                            {announcement.title}
                        </h3>
                    </div>

                    {/* Formal Date Alert Box */}
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#034d52] text-white flex flex-col items-center justify-center shrink-0">
                            <i className="bi bi-calendar-event text-base" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block">
                                Tanggal Pelaksanaan Libur
                            </span>
                            <p className="text-sm font-bold text-slate-900">
                                {announcement.holiday_date}
                            </p>
                        </div>
                    </div>

                    {/* Official Body Text */}
                    <div className="bg-white p-3.5 rounded-lg border border-slate-200/80 max-h-52 overflow-y-auto text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line mb-4">
                        {announcement.content}
                    </div>

                    {/* Attached Official Document / PDF */}
                    {announcement.file_url && (
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-3 mb-4">
                            <div className="flex items-center gap-2.5 truncate">
                                <div className="w-8 h-8 rounded bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                                    <i className="bi bi-file-earmark-pdf-fill text-base" />
                                </div>
                                <div className="truncate">
                                    <p className="text-xs font-semibold text-slate-800 truncate">
                                        {announcement.file_name || 'Surat_Pemberitahuan_Resmi.pdf'}
                                    </p>
                                    <p className="text-[10px] text-slate-500">
                                        Dokumen Resmi (PDF)
                                    </p>
                                </div>
                            </div>
                            <a
                                href={announcement.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 bg-[#034d52] hover:bg-[#02383c] text-white text-xs font-medium rounded-lg shrink-0 flex items-center gap-1.5 transition-colors"
                            >
                                <i className="bi bi-download text-xs" />
                                Unduh
                            </a>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2.5 pt-1">
                        {announcement.file_url && (
                            <a
                                href={announcement.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 py-2 px-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg text-center transition-colors flex items-center justify-center gap-1.5"
                            >
                                <i className="bi bi-eye text-slate-500" />
                                Lihat Berkas
                            </a>
                        )}

                        <button
                            type="button"
                            onClick={handleAcknowledge}
                            className="flex-1 py-2 px-4 bg-[#034d52] hover:bg-[#02383c] text-white text-xs font-semibold rounded-lg shadow-sm text-center transition-all flex items-center justify-center gap-1.5 active:scale-95"
                        >
                            <i className="bi bi-check-lg text-base" />
                            Saya Mengerti
                        </button>
                    </div>

                    <p className="text-center text-[10px] text-slate-400 mt-3">
                        Artificial Intelligence Center Indonesia &bull; Dokumen Pemberitahuan Resmi
                    </p>
                </div>
            )}
        </div>
    );
}
