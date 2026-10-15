<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $connection = DB::connection()->getDriverName();

        if ($connection === 'mysql') {
            // 1. Sinkronkan tutor_id dan classroom_id di learning_sessions berdasarkan relasi murid (users)
            DB::statement("
                UPDATE learning_sessions ls
                INNER JOIN users u ON ls.user_id = u.id
                SET 
                    ls.tutor_id = COALESCE(ls.tutor_id, u.tutor_id),
                    ls.classroom_id = COALESCE(ls.classroom_id, u.classroom_id)
                WHERE ls.tutor_id IS NULL OR ls.classroom_id IS NULL
            ");

            // 2. Jika ada sesi yang memiliki classroom_id tetapi belum ada tutor_id, gunakan tutor_id kelas
            DB::statement("
                UPDATE learning_sessions ls
                INNER JOIN classrooms c ON ls.classroom_id = c.id
                SET ls.tutor_id = c.tutor_id
                WHERE ls.tutor_id IS NULL AND c.tutor_id IS NOT NULL
            ");
        } else {
            // SQLite / fallback for tests
            DB::statement("
                UPDATE learning_sessions
                SET 
                    tutor_id = COALESCE(tutor_id, (SELECT tutor_id FROM users WHERE users.id = learning_sessions.user_id)),
                    classroom_id = COALESCE(classroom_id, (SELECT classroom_id FROM users WHERE users.id = learning_sessions.user_id))
                WHERE tutor_id IS NULL OR classroom_id IS NULL
            ");

            DB::statement("
                UPDATE learning_sessions
                SET tutor_id = (SELECT tutor_id FROM classrooms WHERE classrooms.id = learning_sessions.classroom_id)
                WHERE tutor_id IS NULL AND classroom_id IS NOT NULL
            ");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Nothing to revert
    }
};
