<?php

namespace Database\Seeders;

use App\Services\HolidayAnnouncementService;
use Illuminate\Database\Seeder;

class HolidayAnnouncementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $service = new HolidayAnnouncementService();

        $service->saveAnnouncement([
            'id' => 'holiday_sample_' . date('Ymd'),
            'title' => 'Pemberitahuan Hari Libur Kegiatan Belajar Mengajar',
            'letter_number' => '024/AICI-DIR/X/2026',
            'holiday_date' => 'Rabu, 7 Oktober 2026',
            'content' => "Diberitahukan kepada seluruh siswa, orang tua murid, dan rekan tutor Artificial Intelligence Center Indonesia (AICI):\n\nSehubungan dengan agenda evaluasi kurikulum terpadu dan pemeliharaan server pusat, seluruh kegiatan belajar mengajar (KBM) daring maupun luring pada hari Rabu, 7 Oktober 2026 DITIADAKAN (LIBUR).\n\nKegiatan pembelajaran akan kembali berjalan normal seperti biasa mulai hari Kamis, 8 Oktober 2026 sesuai dengan jadwal masing-masing kelas.\n\nDemikian pemberitahuan ini kami sampaikan. Atas perhatian dan kerjasamanya, kami ucapkan terima kasih.",
            'target_role' => 'all',
            'is_active' => true,
        ]);

        $this->command?->info('Holiday Announcement Seeder berhasil dijalankan!');
    }
}
