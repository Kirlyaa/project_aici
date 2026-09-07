/**
 * AICI Chatbot Service
 * Calls our own backend endpoint (NO client-side API key exposure!)
 * Backend will forward request to Google Gemini if API key is configured
 */

interface ChatMessageInternal {
    role: 'user' | 'model';
    parts: Array<{ text: string }>;
}

interface BackendChatResponse {
    reply: string;
    fallback: boolean;
}

export async function callGeminiAPI(
    userMessage: string,
    conversationHistory: ChatMessageInternal[] = []
): Promise<string> {
    try {
        const csrfToken = getCsrfToken();

        const response = await fetch('/api/chatbot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                message: userMessage,
                history: conversationHistory,
            }),
        });

        if (!response.ok) {
            console.warn('Chatbot endpoint error:', response.status, response.statusText);
            return getFallbackResponse(userMessage);
        }

        const data: BackendChatResponse = await response.json();
        return data.reply ?? getFallbackResponse(userMessage);
    } catch (error) {
        console.error('Error calling chatbot endpoint:', error);
        return getFallbackResponse(userMessage);
    }
}

function getCsrfToken(): string | null {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]');
    if (meta && meta.content) return meta.content;
    const cookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='));
    if (cookie) {
        return decodeURIComponent(cookie.split('=')[1]);
    }
    return null;
}

/**
 * Local fallback responses when backend endpoint is unreachable
 */
function getFallbackResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('halo') || lowerMessage.includes('hi') || lowerMessage.includes('salam')) {
        return 'Halo! 👋 Saya adalah AICI Bot. Ada yang bisa saya bantu mengenai platform AICI?';
    }

    if (lowerMessage.includes('login') || lowerMessage.includes('masuk')) {
        return 'Untuk masuk, kunjungi halaman login dengan email dan password Anda. Jika lupa password, klik "Lupa Password?" untuk reset.';
    }

    if (lowerMessage.includes('daftar') || lowerMessage.includes('register')) {
        return 'Untuk mendaftar, hubungi sekolah Anda untuk kode registrasi atau izin pembuatan akun dari admin AICI.';
    }

    if (lowerMessage.includes('modul')) {
        return 'Modul tersedia di Dashboard Tutor → Kelola Modul. Anda bisa menambah, edit, atau hapus modul pembelajaran.';
    }

    if (lowerMessage.includes('nilai') || lowerMessage.includes('grade')) {
        return 'Input nilai di Dashboard Tutor → Input Nilai. Pilih siswa dan modul, kemudian input nilai per kategori.';
    }

    if (lowerMessage.includes('komentar')) {
        return 'Komentar bisa personal atau sistem (AI-generated). Di Dashboard Tutor → Komentar, Anda bisa atur template atau tambah komentar personal per semester.';
    }

    if (lowerMessage.includes('siswa') || lowerMessage.includes('murid')) {
        return 'Admin bisa mengelola siswa di Super Admin Dashboard → Kelola Murid. Tutor hanya bisa mengakses data murid yang berada di bawah pengawasannya.';
    }

    if (lowerMessage.includes('tutor') || lowerMessage.includes('pengajar')) {
        return 'Admin bisa mengelola tutor di Super Admin Dashboard → Kelola Tutor. Tambah tutor baru dengan nama, email, dan password.';
    }

    if (lowerMessage.includes('bantuan') || lowerMessage.includes('help') || lowerMessage.includes('support')) {
        return 'Anda bisa melihat FAQ di halaman ini untuk jawaban lengkap. Jika masih ada pertanyaan, hubungi tim support kami di support@aici.id.';
    }

    if (lowerMessage.includes('error') || lowerMessage.includes('bug') || lowerMessage.includes('masalah')) {
        return 'Mohon jelaskan masalah yang Anda alami lebih detail. Error apa yang muncul? Di halaman mana? Tim support kami siap membantu! 😊';
    }

    return 'Pertanyaan bagus! Untuk informasi lebih lengkap, silakan lihat FAQ di atas atau hubungi support kami. Ada yang lain yang bisa saya bantu? 🤖';
}

/**
 * Format conversation history for backend
 */
export function formatConversationHistory(
    messages: Array<{ role: 'user' | 'bot'; text: string }>
): ChatMessageInternal[] {
    return messages
        .filter(msg => msg.role !== 'bot' || !msg.text.includes('👋'))
        .map(msg => ({
            role: msg.role === 'bot' ? 'model' : 'user',
            parts: [{ text: msg.text }],
        }));
}
