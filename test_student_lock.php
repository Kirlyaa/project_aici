<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Services\StudentLock;
use Illuminate\Support\Facades\Cache;

echo "=== TEST MUTUAL-EXCLUSION STUDENT LOCK ===\n\n";

$tutor1 = User::where('role', 'tutor')->first();
$tutor2 = User::where('role', 'tutor')->skip(1)->first();
$student = User::where('role', 'user')->first();

if (!$tutor1 || !$student) {
    echo "Gagal: Data seeder tidak lengkap.\n";
    exit(1);
}

if (!$tutor2) {
    // Buat tutor dummy untuk tes
    $tutor2 = User::create([
        'name' => 'Tutor B (Test)',
        'email' => 'tutorb_test@example.com',
        'password' => bcrypt('password'),
        'role' => 'tutor',
        'status' => 'aktif',
    ]);
    echo "Dibuat tutor test: {$tutor2->name}\n";
}

echo "Tutor 1: #{$tutor1->id} - {$tutor1->name}\n";
echo "Tutor 2: #{$tutor2->id} - {$tutor2->name}\n";
echo "Murid:   #{$student->id} - {$student->name}\n\n";

// 1. Bersihkan lock lama
StudentLock::release($student->id, $tutor1);
StudentLock::release($student->id, $tutor2);
Cache::forget("student_lock:{$student->id}");
echo "1. Lock dibersihkan. Status: " . (StudentLock::current($student->id) ? 'LOCKED' : 'FREE') . "\n";

// 2. Tutor 1 buka murid -> lock acquired
$res1 = StudentLock::acquire($student->id, $tutor1, 'comments');
echo "2. Tutor 1 acquire lock: locked={$res1['locked']}\n";
$curr = StudentLock::current($student->id);
echo "   Current lock: tutor={$curr['tutor_name']} ({$curr['tutor_id']}), page={$curr['page']}\n";

// 3. Tutor 2 buka murid -> locked = true, return by info
$res2 = StudentLock::toResponse($student->id, $tutor2, 'grades');
echo "3. Tutor 2 cek response:\n";
echo "   locked: " . ($res2['locked'] ? 'true' : 'false') . "\n";
echo "   readOnly: " . ($res2['readOnly'] ? 'true' : 'false') . "\n";
echo "   by: {$res2['by']['tutorName']} pada halaman {$res2['by']['page']}\n";

// 4. Tutor 2 coba assertWritable -> harus lempar 423
try {
    StudentLock::assertWritable($student->id, $tutor2);
    echo "4. GAGAL: Tutor 2 seharusnya dicegah menulis!\n";
} catch (\Symfony\Component\HttpKernel\Exception\HttpException $e) {
    echo "4. Sukses: Tutor 2 dicegah dengan HTTP {$e->getStatusCode()}: \"{$e->getMessage()}\"\n";
}

// 5. Tutor 1 coba assertWritable -> harus lolos (tidak throw)
try {
    StudentLock::assertWritable($student->id, $tutor1);
    echo "5. Sukses: Tutor 1 boleh menulis data.\n";
} catch (\Throwable $e) {
    echo "5. Gagal: Tutor 1 seharusnya boleh menulis! {$e->getMessage()}\n";
}

// 6. Tutor 1 release lock -> Tutor 2 sekarang bisa acquire
StudentLock::release($student->id, $tutor1);
echo "6. Tutor 1 melepaskan lock.\n";
$res3 = StudentLock::toResponse($student->id, $tutor2, 'grades');
echo "   Tutor 2 cek ulang: locked=" . ($res3['locked'] ? 'true' : 'false') . "\n";
$curr2 = StudentLock::current($student->id);
echo "   Current lock sekarang milik: {$curr2['tutor_name']} ({$curr2['tutor_id']})\n";

// 7. Cleanup
StudentLock::release($student->id, $tutor2);
echo "7. Selesai dan dibersihkan.\n";
