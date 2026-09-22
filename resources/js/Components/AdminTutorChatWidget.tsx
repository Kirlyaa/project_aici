import React, { useState, useEffect, useRef } from 'react';

interface Tutor {
    id: number;
    name: string;
    email: string;
}

interface ChatMessage {
    id: number;
    sender_id: number;
    sender_name: string;
    sender_role: string;
    receiver_id: number;
    message: string;
    is_read: boolean;
    session_title?: string | null;
    created_at: string;
    time_ago: string;
}

interface Props {
    tutors: Tutor[];
    currentUserId: number;
}

export default function AdminTutorChatWidget({ tutors, currentUserId }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTutorId, setSelectedTutorId] = useState<number | ''>(tutors[0]?.id || '');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const [editingChatId, setEditingChatId] = useState<number | null>(null);
    const [editMessageText, setEditMessageText] = useState('');
    const [contextMenu, setContextMenu] = useState<{
        x: number;
        y: number;
        chat: ChatMessage;
    } | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const fetchMessages = async (tutorId: number) => {
        try {
            const res = await fetch(`/api/tutor-chats?tutor_id=${tutorId}`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data.messages || []);
            }
        } catch (e) {
            console.error('Failed to fetch tutor chats', e);
        }
    };

    useEffect(() => {
        if (isOpen && selectedTutorId !== '') {
            fetchMessages(Number(selectedTutorId));
            const interval = setInterval(() => {
                fetchMessages(Number(selectedTutorId));
            }, 5000); // Polling real-time update
            return () => clearInterval(interval);
        }
    }, [isOpen, selectedTutorId]);

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    // Tutup context menu jika klik di luar
    useEffect(() => {
        const handleClickOutside = () => setContextMenu(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const handleContextMenu = (e: React.MouseEvent, chat: ChatMessage) => {
        // Klik kanan hanya berfungsi untuk pesan yang dikirim oleh super admin
        if (chat.sender_id !== currentUserId) return;
        e.preventDefault();
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            chat,
        });
    };

    const handleDeleteChat = async (chatId: number) => {
        setContextMenu(null);
        if (!confirm('Apakah Anda yakin ingin menghapus pesan ini?')) return;

        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;
            const res = await fetch(`/api/tutor-chats/${chatId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                    'Accept': 'application/json',
                },
            });

            if (res.ok) {
                setMessages(prev => prev.filter(m => m.id !== chatId));
            } else {
                alert('Gagal menghapus pesan.');
            }
        } catch (e) {
            console.error('Error deleting chat', e);
            alert('Terjadi kesalahan saat menghapus pesan.');
        }
    };

    const startEditChat = (chat: ChatMessage) => {
        setContextMenu(null);
        setEditingChatId(chat.id);
        setEditMessageText(chat.message);
    };

    const handleSaveEdit = async (chatId: number) => {
        if (!editMessageText.trim()) return;

        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;
            const res = await fetch(`/api/tutor-chats/${chatId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    message: editMessageText.trim(),
                }),
            });

            if (res.ok) {
                setMessages(prev => prev.map(m => (m.id === chatId ? { ...m, message: editMessageText.trim() } : m)));
                setEditingChatId(null);
                setEditMessageText('');
            } else {
                alert('Gagal mengedit pesan.');
            }
        } catch (e) {
            console.error('Error updating chat', e);
            alert('Terjadi kesalahan saat mengupdate pesan.');
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim() || !selectedTutorId || loading) return;

        const text = inputText.trim();
        setInputText('');
        setLoading(true);

        try {
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;
            const res = await fetch('/api/tutor-chats', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken || '',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    receiver_id: Number(selectedTutorId),
                    message: text,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                if (data.chat) {
                    setMessages(prev => [...prev, data.chat]);
                }
            } else {
                const errData = await res.json().catch(() => null);
                console.error('Failed to send chat response:', res.status, errData);
                setInputText(text); // Kembalikan teks jika gagal
                alert(errData?.message || 'Gagal mengirim pesan ke tutor.');
            }
        } catch (err) {
            console.error('Failed to send chat', err);
            setInputText(text);
            alert('Terjadi kesalahan jaringan saat mengirim chat.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!isOpen ? (
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2.5 px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all font-medium text-sm"
                >
                    <i className="bi bi-chat-dots-fill text-lg" />
                    <span>Chat Tutor Real-Time</span>
                </button>
            ) : (
                <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden h-[480px]">
                    {/* Header */}
                    <div className="bg-teal-600 px-4 py-3 text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <i className="bi bi-chat-text-fill text-lg" />
                            <div>
                                <h4 className="font-bold text-sm leading-none">Chat Super Admin &rarr; Tutor</h4>
                                <p className="text-[11px] text-teal-100 mt-0.5">Informasi langsung per pertemuan</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="text-white hover:text-teal-200 p-1 rounded transition"
                        >
                            <i className="bi bi-x-lg text-sm" />
                        </button>
                    </div>

                    {/* Pilih Tutor */}
                    <div className="p-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                        <label className="text-xs font-semibold text-gray-700 whitespace-nowrap">Tutor Tujuan:</label>
                        <select
                            value={selectedTutorId}
                            onChange={e => setSelectedTutorId(Number(e.target.value))}
                            className="w-full text-xs py-1.5 px-2 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-teal-500"
                        >
                            {tutors.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 p-3 overflow-y-auto space-y-2.5 bg-gray-50/50">
                        {messages.length === 0 ? (
                            <div className="text-center py-10 text-gray-400 text-xs">
                                <i className="bi bi-chat-square-dots text-3xl block mb-2 text-gray-300" />
                                Belum ada obrolan dengan tutor ini.<br />Mulai sapa tutor sekarang!
                            </div>
                        ) : (
                            messages.map(msg => {
                                const isMe = msg.sender_id === currentUserId;
                                const isEditing = editingChatId === msg.id;

                                return (
                                    <div
                                        key={msg.id}
                                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                                    >
                                        <div
                                            onContextMenu={e => handleContextMenu(e, msg)}
                                            title={isMe ? 'Klik kanan untuk Edit atau Hapus' : undefined}
                                            className={`max-w-[85%] px-3 py-2 rounded-xl text-xs select-text ${
                                                isMe
                                                    ? 'bg-teal-600 text-white rounded-br-none cursor-context-menu'
                                                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                                            }`}
                                        >
                                            {!isMe && (
                                                <p className="font-bold text-[10px] text-teal-700 mb-0.5">{msg.sender_name}</p>
                                            )}
                                            {msg.session_title && (
                                                <div className="mb-1 text-[10px] bg-black/10 px-1.5 py-0.5 rounded font-mono">
                                                    Sesi: {msg.session_title}
                                                </div>
                                            )}

                                            {isEditing ? (
                                                <div className="mt-1 space-y-1.5" onClick={e => e.stopPropagation()}>
                                                    <textarea
                                                        value={editMessageText}
                                                        onChange={e => setEditMessageText(e.target.value)}
                                                        rows={2}
                                                        className="w-full text-xs text-gray-800 bg-white p-1.5 rounded border border-teal-300 focus:outline-none"
                                                    />
                                                    <div className="flex justify-end gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => setEditingChatId(null)}
                                                            className="px-2 py-0.5 text-[10px] bg-white/20 hover:bg-white/30 text-white rounded"
                                                        >
                                                            Batal
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSaveEdit(msg.id)}
                                                            className="px-2 py-0.5 text-[10px] bg-white text-teal-700 hover:bg-gray-100 font-bold rounded"
                                                        >
                                                            Simpan
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                                            )}
                                        </div>
                                        <span className="text-[9px] text-gray-400 mt-1 px-1">
                                            {msg.time_ago}
                                        </span>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Context Menu Klik Kanan */}
                    {contextMenu && (
                        <div
                            style={{ top: Math.min(contextMenu.y, window.innerHeight - 100), left: Math.min(contextMenu.x, window.innerWidth - 150) }}
                            className="fixed z-[9999] bg-white rounded-lg shadow-xl border border-gray-200 py-1 w-36 text-xs text-gray-700"
                            onClick={e => e.stopPropagation()}
                        >
                            <button
                                type="button"
                                onClick={() => startEditChat(contextMenu.chat)}
                                className="w-full px-3 py-1.5 text-left hover:bg-teal-50 hover:text-teal-700 flex items-center gap-2"
                            >
                                <i className="bi bi-pencil-square text-teal-600" />
                                <span>Edit Chat</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDeleteChat(contextMenu.chat.id)}
                                className="w-full px-3 py-1.5 text-left hover:bg-red-50 hover:text-red-600 flex items-center gap-2 border-t border-gray-100"
                            >
                                <i className="bi bi-trash3 text-red-500" />
                                <span>Hapus Chat</span>
                            </button>
                        </div>
                    )}

                    {/* Input Footer */}
                    <form onSubmit={handleSendMessage} className="p-2.5 bg-white border-t border-gray-100 flex gap-2">
                        <input
                            type="text"
                            placeholder="Ketik instruksi/chat ke tutor..."
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            className="flex-1 text-xs px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
                        />
                        <button
                            type="submit"
                            disabled={!inputText.trim() || loading}
                            className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-semibold transition disabled:opacity-50"
                        >
                            <i className="bi bi-send-fill" />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
