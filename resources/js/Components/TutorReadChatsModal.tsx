import React, { useState, useEffect } from 'react';

interface ReadChat {
    id: number;
    sender_name: string;
    session_title?: string | null;
    message: string;
    read_at: string | null;
    created_at: string;
}

export default function TutorReadChatsModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [readChats, setReadChats] = useState<ReadChat[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchReadHistory = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/tutor-chats/read-history');
            if (res.ok) {
                const data = await res.json();
                setReadChats(data.chats || []);
            }
        } catch (e) {
            console.error('Failed to load read chats', e);
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = () => {
        setIsOpen(true);
        fetchReadHistory();
    };

    return (
        <>
            <button
                type="button"
                onClick={handleOpen}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs rounded-lg font-medium shadow-sm transition"
            >
                <i className="bi bi-clock-history text-teal-600" />
                <span>Riwayat Chat yang Sudah Dibaca</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden">
                        {/* Modal Header */}
                        <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-teal-100 text-teal-700 rounded-lg">
                                    <i className="bi bi-chat-square-check-fill text-lg" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm">Riwayat Chat dari Super Admin</h3>
                                    <p className="text-xs text-gray-500">Pesan dan instruksi yang sebelumnya sudah Anda baca</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition"
                            >
                                <i className="bi bi-x-lg text-sm" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-5 overflow-y-auto flex-1 space-y-3">
                            {loading ? (
                                <div className="text-center py-10 text-gray-500 text-sm">
                                    <i className="bi bi-arrow-repeat animate-spin text-xl block mb-2 text-teal-600" />
                                    Memuat riwayat chat...
                                </div>
                            ) : readChats.length === 0 ? (
                                <div className="text-center py-10 text-gray-400 text-sm">
                                    <i className="bi bi-inbox text-3xl block mb-2 text-gray-300" />
                                    Belum ada riwayat chat yang sudah dibaca.
                                </div>
                            ) : (
                                readChats.map(chat => (
                                    <div
                                        key={chat.id}
                                        className="p-3.5 bg-gray-50 rounded-xl border border-gray-200/80 hover:border-teal-200 transition"
                                    >
                                        <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
                                            <div className="flex items-center gap-1.5 font-semibold text-gray-800">
                                                <i className="bi bi-person-badge text-teal-600" />
                                                <span>{chat.sender_name}</span>
                                                {chat.session_title && (
                                                    <span className="bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded text-[10px] border border-teal-200">
                                                        Sesi: {chat.session_title}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-[11px] text-gray-400">
                                                Dikirim: {chat.created_at}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap">
                                            {chat.message}
                                        </p>
                                        {chat.read_at && (
                                            <div className="mt-2 text-[10px] text-emerald-600 flex items-center gap-1 font-medium">
                                                <i className="bi bi-check2-all text-xs" />
                                                <span>Dibaca pada: {chat.read_at}</span>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-xs font-semibold transition"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
