import { usePage } from '@inertiajs/react';

export default function HolidayAnnouncementBadge() {
    const { holidayAnnouncement } = usePage().props as any;

    if (!holidayAnnouncement || !holidayAnnouncement.is_active) {
        return null;
    }

    const handleOpen = () => {
        window.dispatchEvent(new CustomEvent('open-holiday-announcement'));
    };

    return (
        <button
            type="button"
            onClick={handleOpen}
            title="Buka Surat Pengumuman Libur"
            className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 group flex items-center gap-3.5 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-[#0B6282] hover:bg-[#08455c] text-white shadow-2xl shadow-[#062d3d]/30 hover:shadow-[#062d3d]/40 hover:scale-105 active:scale-95 transition-all border border-cyan-400/40"
        >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-800/90 text-amber-300 flex items-center justify-center shrink-0 border border-teal-600/60 shadow-inner group-hover:scale-105 transition-transform">
                <i className="bi bi-file-earmark-text-fill text-lg sm:text-xl text-amber-300" />
            </div>
            <div className="flex flex-col text-left">
                <span className="text-xs sm:text-sm font-extrabold text-white leading-snug tracking-tight">
                    Pengumuman Libur
                </span>
                <span className="text-[11px] sm:text-xs text-teal-200/90 font-medium">
                    {holidayAnnouncement.holiday_date}
                </span>
            </div>
        </button>
    );
}
