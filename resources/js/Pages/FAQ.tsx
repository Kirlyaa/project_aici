import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { callGeminiAPI, formatConversationHistory } from '../lib/gemini';

interface FAQItem {
    id: number;
    category: string;
    question: string;
    answer: string;
}

interface ChatMessage {
    role: 'user' | 'bot';
    text: string;
}

export default function FAQ() {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    const [chatOpen, setChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        { role: 'bot', text: 'Halo! 👋 Saya adalah AICI Bot. Ada yang bisa saya bantu?' }
    ]);
    const [chatInput, setChatInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const faqs: FAQItem[] = [
        {
            id: 1,
            category: 'Umum',
            question: 'Apa itu AICI?',
            answer: 'AICI (AI Center for Integration) adalah platform pembelajaran robotika dan coding berbasis AI yang dirancang untuk siswa, tutor, dan administrator sekolah. Platform ini menyediakan dashboard lengkap untuk manajemen pembelajaran, penilaian, dan komentar siswa.'
        },
        {
            id: 2,
            category: 'Umum',
            question: 'Berapa biaya menggunakan AICI?',
            answer: 'AICI menyediakan berbagai paket berlangganan sesuai kebutuhan. Hubungi tim sales kami untuk mendapatkan penawaran terbaik dan informasi harga yang detail.'
        },
        {
            id: 3,
            category: 'Umum',
            question: 'Apakah AICI aman untuk data siswa?',
            answer: 'Ya, AICI menggunakan sistem keamanan berlapis dengan enkripsi end-to-end untuk melindungi semua data siswa. Kami mematuhi standar keamanan internasional dan regulasi perlindungan data.'
        },
        {
            id: 4,
            category: 'Siswa',
            question: 'Bagaimana cara saya mengakses dashboard siswa?',
            answer: 'Masuk ke AICI menggunakan email dan password yang telah didaftarkan. Setelah login, Anda akan langsung diarahkan ke beranda siswa. Jika belum memiliki akun, hubungi sekolah Anda untuk pendaftaran.'
        },
        {
            id: 5,
            category: 'Siswa',
            question: 'Bisakah saya melihat nilai saya secara real-time?',
            answer: 'Ya! Dashboard siswa menampilkan nilai per modul dan pertemuan secara real-time. Anda juga bisa melihat grafik performa dan feedback dari tutor Anda.'
        },
        {
            id: 6,
            category: 'Siswa',
            question: 'Bagaimana cara mengunduh sertifikat saya?',
            answer: 'Sertifikat tersedia di halaman Profil. Anda bisa mengunduh sertifikat dalam format PDF dengan mengklik tombol "Export PDF" di halaman profil Anda.'
        },
        {
            id: 7,
            category: 'Tutor',
            question: 'Bagaimana cara membuat modul baru?',
            answer: 'Masuk ke Dashboard Tutor → Kelola Modul. Klik "Tambah Modul Baru" dan isi form dengan nama, deskripsi, gambar, dan pilih apakah modul tersebut dengan atau tanpa robot building. Setelah disimpan, modul akan tersedia untuk siswa.'
        },
        {
            id: 8,
            category: 'Tutor',
            question: 'Bagaimana cara mengisi nilai siswa?',
            answer: 'Masuk ke Dashboard Tutor → Input Nilai. Pilih siswa dan modul, kemudian input nilai untuk setiap kategori (interaksi, fokus, dll). Nilai akan otomatis terhitung rata-ratanya. Jangan lupa klik "Simpan" untuk menyimpan data.'
        },
        {
            id: 9,
            category: 'Tutor',
            question: 'Apa itu template komentar sistem?',
            answer: 'Template komentar sistem adalah template otomatis yang dibuat berdasarkan range nilai siswa. Anda bisa mengatur template untuk nilai <4, 4-4.99, dan 5. Sistem akan otomatis generate komentar sesuai nilai siswa dengan placeholder modul dan nilai rata-rata.'
        },
        {
            id: 10,
            category: 'Tutor',
            question: 'Bisakah saya edit komentar personal?',
            answer: 'Ya, komentar personal bisa diedit atau dihapus kapan saja. Klik tombol Edit atau Hapus di sebelah komentar Anda. Namun, komentar sistem (auto-generated) tidak bisa diedit.'
        },
        {
            id: 11,
            category: 'Admin',
            question: 'Bagaimana cara menambah tutor baru?',
            answer: 'Masuk ke Super Admin Dashboard → Kelola Akun Tutor. Klik "Tambah Tutor Baru" dan isi form dengan nama, email, dan password. Tutor baru akan menerima akses login dan bisa langsung menggunakan platform.'
        },
        {
            id: 12,
            category: 'Admin',
            question: 'Bagaimana cara mengelola modul master?',
            answer: 'Masuk ke Super Admin Dashboard → Lihat Semua Modul. Di halaman ModuleManagement, Anda bisa menambah, edit, atau hapus modul. Modul yang dibuat akan tersedia untuk semua tutor di platform.'
        },
        {
            id: 13,
            category: 'Admin',
            question: 'Bisakah saya menonaktifkan akun siswa?',
            answer: 'Ya, Anda bisa menonaktifkan atau mengaktifkan kembali akun siswa dari Dashboard Admin → Kelola Murid. Klik status siswa untuk toggle antara Aktif dan Nonaktif.'
        },
        {
            id: 14,
            category: 'Teknis',
            question: 'Browser apa yang didukung AICI?',
            answer: 'AICI mendukung semua browser modern: Chrome, Firefox, Safari, dan Edge. Untuk pengalaman terbaik, gunakan versi browser terbaru.'
        },
        {
            id: 15,
            category: 'Teknis',
            question: 'Apa yang harus saya lakukan jika lupa password?',
            answer: 'Di halaman login, klik "Lupa Password?" dan ikuti instruksi. Link reset password akan dikirim ke email Anda. Ikuti link tersebut untuk membuat password baru.'
        },
    ];

    const categories = ['Semua', ...new Set(faqs.map(f => f.category))];
    const filteredFAQs = selectedCategory === 'Semua' 
        ? faqs 
        : faqs.filter(f => f.category === selectedCategory);

    const toggleExpand = (id: number) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleSendMessage = async () => {
        if (!chatInput.trim()) return;

        const userMsg = chatInput;
        const newMessages: ChatMessage[] = [...chatMessages, { role: 'user', text: userMsg }];
        setChatMessages(newMessages);
        setChatInput('');
        setIsLoading(true);

        try {
            // Convert messages to Gemini format
            const conversationHistory = formatConversationHistory(newMessages.slice(0, -1));

            // Call Gemini API
            const response = await callGeminiAPI(userMsg, conversationHistory);
            setChatMessages(prev => [...prev, { role: 'bot', text: response }]);
        } catch (error) {
            console.error('Chat error:', error);
            setChatMessages(prev => [...prev, { 
                role: 'bot', 
                text: 'Maaf, terjadi kesalahan. Silakan coba lagi atau hubungi support kami. 😞' 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Head title="FAQ - AICI" />

            {/* Navigation */}
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-lg bg-teal-600 flex items-center justify-center">
                                <i className="bi bi-robot text-white text-lg" />
                            </div>
                            <span className="text-xl font-bold text-gray-900">AICI</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <Link href="/" className="text-gray-600 hover:text-gray-900">Kembali</Link>
                            <Link
                                href="/login"
                                className="px-6 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700"
                            >
                                Masuk
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Pertanyaan Umum</h1>
                    <p className="text-xl text-gray-600">Temukan jawaban untuk pertanyaan Anda tentang AICI</p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-3 mb-12 justify-center">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full font-medium transition-colors ${
                                selectedCategory === cat
                                    ? 'bg-teal-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* FAQ Items */}
                <div className="space-y-4 mb-16">
                    {filteredFAQs.map(faq => (
                        <div
                            key={faq.id}
                            className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <button
                                onClick={() => toggleExpand(faq.id)}
                                className="w-full px-6 py-4 flex items-start justify-between hover:bg-gray-50 transition-colors"
                            >
                                <div className="text-left flex-1">
                                    <div className="flex items-center gap-3">
                                        <span className="px-2 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded">
                                            {faq.category}
                                        </span>
                                        <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                                    </div>
                                </div>
                                <i className={`bi bi-chevron-down text-gray-600 mt-1 transition-transform ${
                                    expandedId === faq.id ? 'rotate-180' : ''
                                }`} />
                            </button>

                            {expandedId === faq.id && (
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Help Section */}
                <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-2xl p-12 border border-teal-200 text-center">
                    <i className="bi bi-chat-left-quote text-5xl text-teal-600 mb-4 block" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Belum menemukan jawaban?</h2>
                    <p className="text-gray-600 mb-6">Hubungi tim support kami atau gunakan chatbot di bawah untuk bantuan lebih lanjut.</p>
                    <button
                        onClick={() => setChatOpen(!chatOpen)}
                        className="px-8 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 inline-flex items-center gap-2"
                    >
                        <i className="bi bi-chat-dots" /> Tanya Chatbot
                    </button>
                </div>
            </div>

            {/* Chatbot Widget */}
            <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
                chatOpen ? 'w-96 h-[500px]' : 'w-16 h-16'
            }`}>
                {chatOpen ? (
                    <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 h-full flex flex-col">
                        {/* Chat Header */}
                        <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-4 rounded-t-2xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                                    <i className="bi bi-robot text-teal-600 text-lg" />
                                </div>
                                <div>
                                    <p className="font-bold text-white">AICI Bot</p>
                                    <p className="text-xs text-teal-100">Powered by Gemini AI</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setChatOpen(false)}
                                className="text-white hover:text-teal-100"
                            >
                                <i className="bi bi-x-lg text-xl" />
                            </button>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {chatMessages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-xs px-4 py-2 rounded-lg ${
                                        msg.role === 'user'
                                            ? 'bg-teal-600 text-white rounded-br-none'
                                            : 'bg-gray-100 text-gray-900 rounded-bl-none'
                                    }`}>
                                        <p className="text-sm">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 text-gray-900 rounded-lg rounded-bl-none px-4 py-2">
                                        <p className="text-sm">Sedang mengetik <span className="animate-bounce">.</span><span className="animate-bounce" style={{animationDelay: '0.1s'}}>.</span><span className="animate-bounce" style={{animationDelay: '0.2s'}}>.</span></p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Chat Input */}
                        <div className="border-t border-gray-200 p-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={e => setChatInput(e.target.value)}
                                    onKeyPress={e => e.key === 'Enter' && !isLoading && handleSendMessage()}
                                    placeholder="Tanya sesuatu..."
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={isLoading || !chatInput.trim()}
                                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed"
                                >
                                    <i className="bi bi-send-fill" />
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setChatOpen(true)}
                        className="w-full h-full bg-teal-600 text-white rounded-full shadow-lg hover:bg-teal-700 flex items-center justify-center group"
                        title="Open Chatbot"
                    >
                        <i className="bi bi-chat-dots text-2xl group-hover:scale-110 transition-transform" />
                    </button>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-400 py-12 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-sm">&copy; {new Date().getFullYear()} AICI. Semua hak dilindungi.</p>
                </div>
            </footer>
        </div>
    );
}
