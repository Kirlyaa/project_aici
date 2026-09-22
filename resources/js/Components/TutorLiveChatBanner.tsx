import React, { useState, useEffect } from 'react';
import TutorReadChatsModal from '@/Components/TutorReadChatsModal';

interface AlertChat {
    id: number;
    sender_name: string;
    session_title?: string | null;
    message: string;
    created_at: string;
}

export default function TutorLiveChatBanner() {
    const [unreadChats, setUnreadChats] = useState<AlertChat[]>([]);
    const [isDismissed, setIsDismissed] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const fetchAlerts = async () => {
        try {
            const res = await fetch('/api/tutor-chats/active-alerts');
            if (res.ok) {
                const data = await res.json();
                setUnreadChats(data.chats || []);
            }
        } catch (e) {
            console.error('Failed to fetch tutor chat alerts', e);
        }
    };

    useEffect(() => {
        fetchAlerts();
        const interval = setInterval(fetchAlerts, 4000); // Polling real-time setiap 4 detik
        return () => clearInterval(interval);
    }, []);

    const markAllRead = async () => {
        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;
            await fetch('/api/tutor-chats/mark-read', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                    'Accept': 'application/json',
                },
            });
            setUnreadChats([]);
        } catch (e) {
            console.error('Failed to mark chats as read', e);
        }
    };

    if (unreadChats.length === 0 || isDismissed) {
        return (
            <div className="mb-6 flex justify-end">
                <TutorReadChatsModal />
            </div>
        );
    }

    const latest = unreadChats[0];

    return (
        <div className="mb-6 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white p-4 rounded-xl shadow-md border border-amber-300">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm flex-shrink-0">
                        <i className="bi bi-chat-left-dots-fill text-2xl text-white" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="bg-white text-orange-700 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                Pesan Langsung dari Super Admin ({unreadChats.length} Pesan)
                            </span>
                            <span className="text-xs text-amber-100 font-medium">{latest.created_at}</span>
                        </div>

                        {/* List semua chat */}
                        <div className="mt-3 space-y-2.5">
                            {(isExpanded ? unreadChats : unreadChats.slice(0, 1)).map((chat, idx) => (
                                <div key={chat.id} className="bg-black/15 p-3 rounded-lg border border-white/15">
                                    <div className="flex items-center justify-between text-xs text-amber-100 mb-1">
                                        <span className="font-semibold text-white">
                                            {chat.sender_name}
                                            {chat.session_title ? ` (Sesi: ${chat.session_title})` : ''}
                                        </span>
                                        <span className="text-[11px] opacity-90">{chat.created_at}</span>
                                    </div>
                                    <p className="text-sm font-medium leading-relaxed text-white">
                                        "{chat.message}"
                                    </p>
                                </div>
                            ))}
                        </div>

                        {unreadChats.length > 1 && (
                            <button
                                type="button"
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="mt-2 text-xs text-amber-100 hover:text-white underline font-semibold flex items-center gap-1"
                            >
                                <i className={`bi bi-chevron-${isExpanded ? 'up' : 'down'}`} />
                                {isExpanded
                                    ? 'Sembunyikan pesan lainnya'
                                    : `Tampilkan ${unreadChats.length - 1} pesan lainnya`}
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    <TutorReadChatsModal />
                    <button
                        type="button"
                        onClick={markAllRead}
                        className="px-3 py-1.5 bg-white text-orange-700 hover:bg-orange-50 font-semibold text-xs rounded-lg shadow-sm transition"
                    >
                        Tandai Semua Dibaca
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsDismissed(true)}
                        className="p-1.5 text-white/80 hover:text-white rounded-lg transition"
                        title="Tutup banner sementara"
                    >
                        <i className="bi bi-x-lg text-sm" />
                    </button>
                </div>
            </div>
        </div>
    );
}
