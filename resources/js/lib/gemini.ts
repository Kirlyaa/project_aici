/**
 * Gemini API Integration Service
 * Handles communication with Google Gemini AI
 */

interface ChatMessage {
    role: 'user' | 'model';
    parts: Array<{ text: string }>;
}

interface GeminiResponse {
    candidates: Array<{
        content: {
            parts: Array<{ text: string }>;
        };
    }>;
}

export async function callGeminiAPI(userMessage: string, conversationHistory: ChatMessage[] = []): Promise<string> {
    try {
        // Get API key from environment
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        
        if (!apiKey) {
            console.warn('Gemini API key not configured. Using fallback response.');
            return getFallbackResponse(userMessage);
        }

        // Build request with conversation history
        const messages: ChatMessage[] = [
            ...conversationHistory,
            {
                role: 'user',
                parts: [{ text: userMessage }]
            }
        ];

        // Call Gemini API
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: messages,
                    systemInstruction: {
                        parts: [{
                            text: `Anda adalah AICI Bot, asisten AI untuk platform pembelajaran robotika dan coding AICI. 
                            Anda membantu menjawab pertanyaan tentang:
                            - Cara menggunakan platform AICI
                            - Fitur untuk siswa, tutor, dan admin
                            - Masalah teknis dan akun
                            - Rekomendasi pembelajaran
                            
                            Selalu:
                            - Balas dalam Bahasa Indonesia
                            - Jaga nada professional dan ramah
                            - Berikan jawaban singkat dan jelas (2-3 kalimat max)
                            - Jika tidak tahu, sarankan hubungi support kami
                            - Gunakan emoji sesekali untuk ramah
                            `
                        }]
                    },
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 200,
                    }
                })
            }
        );

        if (!response.ok) {
            console.error('Gemini API error:', response.status, response.statusText);
            return getFallbackResponse(userMessage);
        }

        const data: GeminiResponse = await response.json();
        
        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text;
        }

        return getFallbackResponse(userMessage);
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        return getFallbackResponse(userMessage);
    }
}

/**
 * Fallback responses when API is not available
 */
function getFallbackResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();

    // Pattern matching for common questions
    if (lowerMessage.includes('halo') || lowerMessage.includes('hi') || lowerMessage.includes('salam')) {
        return 'Halo! 👋 Saya adalah AICI Bot. Ada yang bisa saya bantu mengenai platform AICI?';
    }

    if (lowerMessage.includes('login') || lowerMessage.includes('masuk')) {
        return 'Untuk masuk, kunjungi halaman login dengan email dan password Anda. Jika lupa password, klik "Lupa Password?" untuk reset.';
    }

    if (lowerMessage.includes('daftar') || lowerMessage.includes('register')) {
        return 'Untuk mendaftar, klik tombol "Daftar" dan isi form dengan nama, email, dan password. Hubungi sekolah Anda untuk kode registrasi.';
    }

    if (lowerMessage.includes('modul')) {
        return 'Modul tersedia di Dashboard Tutor → Kelola Modul. Anda bisa menambah, edit, atau hapus modul pembelajaran. Pilih jenis modul: dengan robot (Type 5) atau tanpa (Type 4).';
    }

    if (lowerMessage.includes('nilai') || lowerMessage.includes('grade')) {
        return 'Input nilai di Dashboard Tutor → Input Nilai. Pilih siswa dan modul, kemudian input nilai per kategori. Nilai akan otomatis terhitung rata-ratanya. Klik "Simpan" untuk menyimpan.';
    }

    if (lowerMessage.includes('komentar')) {
        return 'Komentar bisa personal atau sistem (AI-generated). Di Dashboard Tutor → Komentar, Anda bisa atur template sistem atau tambah komentar personal per semester.';
    }

    if (lowerMessage.includes('siswa') || lowerMessage.includes('murid')) {
        return 'Admin bisa manage siswa di Super Admin Dashboard → Kelola Murid. Anda bisa tambah, edit, atau hapus akun siswa. Toggle status Aktif/Nonaktif sesuai kebutuhan.';
    }

    if (lowerMessage.includes('tutor') || lowerMessage.includes('pengajar')) {
        return 'Admin bisa manage tutor di Super Admin Dashboard → Kelola Tutor. Tambah tutor baru dengan nama, email, dan password. Tutor akan bisa langsung login dan mengajar.';
    }

    if (lowerMessage.includes('bantuan') || lowerMessage.includes('help') || lowerMessage.includes('support')) {
        return 'Anda bisa melihat FAQ di halaman ini untuk jawaban lengkap. Jika masih ada pertanyaan, hubungi tim support kami di support@aici.id atau lihat halaman Kontak.';
    }

    if (lowerMessage.includes('error') || lowerMessage.includes('bug') || lowerMessage.includes('masalah')) {
        return 'Mohon jelaskan masalah yang Anda alami lebih detail. Error apa yang muncul? Di halaman mana? Tim support kami siap membantu! 😊';
    }

    // Default response
    return 'Pertanyaan bagus! Untuk informasi lebih lengkap, silakan lihat FAQ di atas atau hubungi support kami. Ada yang lain yang bisa saya bantu? 🤖';
}

/**
 * Format conversation history for Gemini API
 */
export function formatConversationHistory(messages: Array<{ role: 'user' | 'bot', text: string }>): ChatMessage[] {
    return messages
        .filter(msg => msg.role !== 'bot' || !msg.text.includes('👋'))
        .map(msg => ({
            role: msg.role === 'bot' ? 'model' : 'user',
            parts: [{ text: msg.text }]
        }));
}
