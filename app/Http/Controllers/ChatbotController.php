<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatbotController extends Controller
{
    private function getFallbackResponse(string $userMessage): string
    {
        $lowerMessage = strtolower($userMessage);

        if (str_contains($lowerMessage, 'halo') || str_contains($lowerMessage, 'hi') || str_contains($lowerMessage, 'salam')) {
            return 'Halo! 👋 Saya adalah AICI Bot. Ada yang bisa saya bantu mengenai platform AICI?';
        }

        if (str_contains($lowerMessage, 'login') || str_contains($lowerMessage, 'masuk')) {
            return 'Untuk masuk, kunjungi halaman login dengan email dan password Anda. Jika lupa password, klik "Lupa Password?" untuk reset.';
        }

        if (str_contains($lowerMessage, 'daftar') || str_contains($lowerMessage, 'register')) {
            return 'Untuk mendaftar, hubungi sekolah Anda untuk kode registrasi atau izin pembuatan akun dari admin AICI.';
        }

        if (str_contains($lowerMessage, 'modul')) {
            return 'Modul tersedia di Dashboard Tutor → Kelola Modul. Anda bisa menambah, edit, atau hapus modul pembelajaran.';
        }

        if (str_contains($lowerMessage, 'nilai') || str_contains($lowerMessage, 'grade')) {
            return 'Input nilai di Dashboard Tutor → Input Nilai. Pilih siswa dan modul, kemudian input nilai per kategori.';
        }

        if (str_contains($lowerMessage, 'komentar')) {
            return 'Komentar bisa personal atau sistem (AI-generated). Di Dashboard Tutor → Komentar, Anda bisa atur template atau tambah komentar personal per semester.';
        }

        if (str_contains($lowerMessage, 'siswa') || str_contains($lowerMessage, 'murid')) {
            return 'Admin bisa mengelola siswa di Super Admin Dashboard → Kelola Murid. Tutor hanya bisa mengakses data murid yang berada di bawah pengawasannya.';
        }

        if (str_contains($lowerMessage, 'tutor') || str_contains($lowerMessage, 'pengajar')) {
            return 'Admin bisa mengelola tutor di Super Admin Dashboard → Kelola Tutor. Tambah tutor baru dengan nama, email, dan password.';
        }

        if (str_contains($lowerMessage, 'bantuan') || str_contains($lowerMessage, 'help') || str_contains($lowerMessage, 'support')) {
            return 'Anda bisa melihat FAQ di halaman ini untuk jawaban lengkap. Jika masih ada pertanyaan, hubungi tim support kami di support@aici.id.';
        }

        if (str_contains($lowerMessage, 'error') || str_contains($lowerMessage, 'bug') || str_contains($lowerMessage, 'masalah')) {
            return 'Mohon jelaskan masalah yang Anda alami lebih detail. Error apa yang muncul? Di halaman mana? Tim support kami siap membantu! 😊';
        }

        return 'Pertanyaan bagus! Untuk informasi lebih lengkap, silakan lihat FAQ di atas atau hubungi support kami. Ada yang lain yang bisa saya bantu? 🤖';
    }

    public function chat(Request $request): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'message' => 'required|string|max:1000',
            'history' => 'nullable|array|max:20',
            'history.*.role' => 'required|string|in:user,model',
            'history.*.parts' => 'required|array',
            'history.*.parts.*.text' => 'required|string|max:2000',
        ]);

        $apiKey = config('services.gemini.api_key');
        $userMessage = $validated['message'];
        $conversationHistory = $validated['history'] ?? [];

        // Gate AI calls: guests and users without verified email get keyword
        // fallback only. Prevents API cost abuse on a public endpoint.
        if (empty($apiKey) || ! \Illuminate\Support\Facades\Auth::check() || ! \Illuminate\Support\Facades\Auth::user()->hasVerifiedEmail()) {
            return response()->json([
                'reply' => $this->getFallbackResponse($userMessage),
                'fallback' => true,
            ]);
        }

        $systemInstruction = "Anda adalah AICI Bot, asisten AI untuk platform pembelajaran robotika dan coding AICI. 
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
            - Gunakan emoji sesekali untuk ramah";

        $messages = array_merge($conversationHistory, [
            [
                'role' => 'user',
                'parts' => [['text' => $userMessage]],
            ],
        ]);

        try {
            $response = Http::timeout(15)->withHeaders([
                'Content-Type' => 'application/json',
            ])->post('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' . $apiKey, [
                'contents' => $messages,
                'systemInstruction' => [
                    'parts' => [['text' => $systemInstruction]],
                ],
                'generationConfig' => [
                    'temperature' => 0.7,
                    'topK' => 40,
                    'topP' => 0.95,
                    'maxOutputTokens' => 200,
                ],
            ]);

            if (!$response->successful()) {
                return response()->json([
                    'reply' => $this->getFallbackResponse($userMessage),
                    'fallback' => true,
                ]);
            }

            $data = $response->json();
            $reply = $data['candidates'][0]['content']['parts'][0]['text'] ?? null;

            if (empty($reply)) {
                return response()->json([
                    'reply' => $this->getFallbackResponse($userMessage),
                    'fallback' => true,
                ]);
            }

            return response()->json([
                'reply' => $reply,
                'fallback' => false,
            ]);
        } catch (\Throwable $e) {
            report($e);
            return response()->json([
                'reply' => $this->getFallbackResponse($userMessage),
                'fallback' => true,
            ]);
        }
    }
}
