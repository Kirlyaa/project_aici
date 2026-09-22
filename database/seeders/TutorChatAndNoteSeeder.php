<?php

namespace Database\Seeders;

use App\Models\LearningSession;
use App\Models\TutorChat;
use App\Models\User;
use Illuminate\Database\Seeder;

class TutorChatAndNoteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superadmin = User::where('role', 'superadmin')->first();
        $tutor = User::where('role', 'tutor')->first();

        if (! $superadmin || ! $tutor) {
            return;
        }

        // Cari atau update sesi pembelajaran dengan catatan admin khusus
        $session = LearningSession::where('user_id', function ($q) {
            $q->select('id')->from('users')->where('role', 'user')->limit(1);
        })->first();

        if ($session) {
            $session->update([
                'admin_note_for_tutor' => 'Catatan Super Admin: Perhatikan konsentrasi murid saat materi coding looping, berikan latihan tambahan jika diperlukan.',
            ]);
        }

        // Tambahkan contoh chat Super Admin ke Tutor
        TutorChat::firstOrCreate([
            'sender_id' => $superadmin->id,
            'receiver_id' => $tutor->id,
            'message' => 'Halo Tutor! Harap pastikan modul robotik sesi berikutnya disiapkan lebih awal ya.',
        ], [
            'learning_session_id' => $session?->id,
            'is_read' => false,
            'created_at' => now(),
        ]);
    }
}
