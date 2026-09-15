<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Cache;

/**
 * Mutual-exclusion lock per murid.
 *
 * Semua tutor boleh mengakses semua murid, tetapi hanya satu tutor
 * yang boleh mengedit seorang murid pada satu waktu. Lock disimpan di
 * cache (driver database) dengan TTL, sehingga otomatis lepas jika
 * browser tutor ditutup / koneksi terputus.
 */
class StudentLock
{
    /** Lama lock bertahan tanpa heartbeat (detik). */
    public const TTL = 300;

    private static function key(int $studentId): string
    {
        return "student_lock:{$studentId}";
    }

    /**
     * Ambil data lock saat ini untuk seorang murid.
     *
     * @return array{tutor_id:int,tutor_name:string,page:string,at:int}|null
     */
    public static function current(int $studentId): ?array
    {
        $lock = Cache::get(self::key($studentId));

        return is_array($lock) ? $lock : null;
    }

    /**
     * Coba ambil/perpanjang lock untuk murid.
     *
     * @return array{locked:bool, by:?array, takenOver:bool}
     */
    public static function acquire(int $studentId, User $tutor, string $page = 'view', bool $force = false): array
    {
        $existing = self::current($studentId);

        if ($existing && (int) $existing['tutor_id'] !== (int) $tutor->id && !$force) {
            return ['locked' => true, 'by' => $existing, 'takenOver' => false];
        }

        $takenOver = $existing !== null && (int) $existing['tutor_id'] !== (int) $tutor->id;

        Cache::put(self::key($studentId), [
            'tutor_id' => (int) $tutor->id,
            'tutor_name' => $tutor->name,
            'page' => $page,
            'at' => time(),
        ], self::TTL);

        return ['locked' => false, 'by' => null, 'takenOver' => $takenOver];
    }

    /** Perpanjang umur lock, tetapi hanya jika memang milik tutor ini. */
    public static function heartbeat(int $studentId, User $tutor): bool
    {
        $existing = self::current($studentId);

        if (!$existing || (int) $existing['tutor_id'] !== (int) $tutor->id) {
            return false;
        }

        Cache::put(self::key($studentId), array_merge($existing, ['at' => time()]), self::TTL);

        return true;
    }

    /** Lepas lock, hanya jika milik tutor ini. */
    public static function release(int $studentId, User $tutor): bool
    {
        $existing = self::current($studentId);

        if ($existing && (int) $existing['tutor_id'] === (int) $tutor->id) {
            Cache::forget(self::key($studentId));

            return true;
        }

        return false;
    }

    /**
     * Pastikan tutor ini memegang lock sebelum menulis data.
     * Jika murid sedang dikunci tutor lain, request ditolak dengan pesan jelas.
     *
     * @throw \Symfony\Component\HttpKernel\Exception\HttpException
     */
    public static function assertWritable(int $studentId, User $tutor): void
    {
        if ($tutor->role === 'superadmin') {
            return;
        }

        $existing = self::current($studentId);

        if ($existing && (int) $existing['tutor_id'] !== (int) $tutor->id) {
            abort(
                423,
                "Murid ini sedang dibuka oleh tutor {$existing['tutor_name']}. "
                . 'Silakan tunggu sampai tutor tersebut selesai atau koordinasi terlebih dahulu.'
            );
        }
    }

    /**
     * Payload siap-pakai untuk dikirim ke frontend Inertia.
     *
     * @return array{locked:bool, readOnly:bool, by:?array{tutorId:int,tutorName:string,page:string,since:int}}
     */
    public static function toResponse(int $studentId, User $tutor, string $page = 'view'): array
    {
        // Superadmin tidak berpartisipasi dalam locking: tidak mengunci murid
        // dan tidak pernah terkunci oleh tutor.
        if ($tutor->role === 'superadmin') {
            return ['locked' => false, 'readOnly' => false, 'by' => null];
        }

        $result = self::acquire($studentId, $tutor, $page);

        if (!$result['locked']) {
            return ['locked' => false, 'readOnly' => false, 'by' => null];
        }

        $by = $result['by'];

        return [
            'locked' => true,
            'readOnly' => true,
            'by' => [
                'tutorId' => (int) $by['tutor_id'],
                'tutorName' => (string) $by['tutor_name'],
                'page' => (string) $by['page'],
                'since' => (int) $by['at'],
            ],
        ];
    }
}
