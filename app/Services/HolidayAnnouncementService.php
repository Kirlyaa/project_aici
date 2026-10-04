<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

class HolidayAnnouncementService
{
    private const FILE_PATH = 'holiday_announcement.json';

    /**
     * Get the active holiday announcement.
     * Returns null if file doesn't exist or is not active.
     */
    public function getActiveAnnouncement(?string $userRole = null): ?array
    {
        $data = $this->getAnnouncement();
        if (!$data || empty($data['is_active'])) {
            return null;
        }

        // Filter target role: 'all', 'user' (student), 'tutor'
        if ($userRole) {
            $target = $data['target_role'] ?? 'all';
            if ($target !== 'all' && $target !== $userRole) {
                return null;
            }
        }

        return $data;
    }

    /**
     * Get the stored announcement data (regardless of active status).
     */
    public function getAnnouncement(): ?array
    {
        if (!Storage::disk('local')->exists(self::FILE_PATH)) {
            return null;
        }

        try {
            $json = Storage::disk('local')->get(self::FILE_PATH);
            return json_decode($json, true);
        } catch (\Throwable $e) {
            return null;
        }
    }

    /**
     * Save or update holiday announcement.
     */
    public function saveAnnouncement(array $data): array
    {
        $existing = $this->getAnnouncement() ?? [];

        $record = [
            'id' => $data['id'] ?? (empty($existing['id']) ? 'holiday_' . time() : $existing['id']),
            'title' => $data['title'] ?? 'Pemberitahuan Hari Libur Kegiatan Belajar Mengajar',
            'letter_number' => $data['letter_number'] ?? null,
            'holiday_date' => $data['holiday_date'] ?? null, // misal "7 Oktober 2026" atau "2026-10-07"
            'content' => $data['content'] ?? '',
            'target_role' => $data['target_role'] ?? 'all', // 'all', 'user', 'tutor'
            'file_url' => $data['file_url'] ?? ($existing['file_url'] ?? null),
            'file_name' => $data['file_name'] ?? ($existing['file_name'] ?? null),
            'is_active' => (bool) ($data['is_active'] ?? true),
            'updated_at' => now()->toIso8601String(),
        ];

        Storage::disk('local')->put(self::FILE_PATH, json_encode($record, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        return $record;
    }

    /**
     * Delete announcement data and optional attached file.
     */
    public function clearAnnouncement(): void
    {
        $existing = $this->getAnnouncement();
        if ($existing && !empty($existing['file_url'])) {
            // If file was stored in public storage, try to clean up
            $relative = str_replace('/storage/', '', $existing['file_url']);
            Storage::disk('public')->delete($relative);
        }

        Storage::disk('local')->delete(self::FILE_PATH);
    }
}
