<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\LearningSession;
use App\Models\Module;
use Carbon\Carbon;

class FixSessionModules extends Command
{
    protected $signature = 'sessions:fix-modules';
    protected $description = 'Hubungkan modul ke sesi yang belum memiliki relasi modul';

    public function handle(): int
    {
        $sessionsWithoutModule = LearningSession::doesntHave('modules')->get();
        $this->info("Menemukan {$sessionsWithoutModule->count()} sesi tanpa modul.");

        $fixed = 0;
        foreach ($sessionsWithoutModule as $session) {
            // Lewati jika status libur
            if ($session->status === 'libur') {
                continue;
            }

            // Coba tebak dari title, misal "Pertemuan 3: Motor Driver & Roda"
            $title = $session->title;
            $moduleName = null;

            if (preg_match('/Pertemuan\s+(\d+)\s*[:–-]\s*(.*)/i', $title, $matches)) {
                $num = $matches[1];
                $topic = trim($matches[2]);
                $moduleName = "Modul {$num} – {$topic}";
            } else {
                $moduleName = "Modul – {$title}";
            }

            // Cari modul yang ada atau buat baru
            $isCoding = preg_match('/coding|program|ai|algoritma|scratch|python/i', $moduleName);
            $module = Module::firstOrCreate(
                ['name' => $moduleName],
                [
                    'module_type' => $isCoding ? 'coding' : 'robot',
                    'format' => 'PDF',
                    'size' => '4.2 MB',
                ]
            );

            $session->modules()->sync([$module->id]);

            // Perbaiki date_string jika masih format ISO YYYY-MM-DD
            if ($session->date && preg_match('/^\d{4}-\d{2}-\d{2}$/', $session->date_string)) {
                $session->date_string = Carbon::parse($session->date)->translatedFormat('l, d F Y');
                $session->save();
            }

            $this->line("✅ Menghubungkan sesi '{$session->title}' -> '{$module->name}'");
            $fixed++;
        }

        $this->info("Selesai! {$fixed} sesi berhasil diperbaiki relasi modulnya.");
        return Command::SUCCESS;
    }
}
