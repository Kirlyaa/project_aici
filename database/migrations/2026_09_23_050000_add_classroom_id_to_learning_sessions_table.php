<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('learning_sessions', function (Blueprint $table) {
            $table->foreignId('classroom_id')
                ->nullable()
                ->after('tutor_id')
                ->constrained('classrooms')
                ->nullOnDelete();

            $table->index(['classroom_id', 'date']);
        });

        // Backfill classroom_id for existing learning_sessions from student's classroom_id
        if (DB::getDriverName() === 'mysql') {
            DB::statement('
                UPDATE learning_sessions ls
                JOIN users u ON ls.user_id = u.id
                SET ls.classroom_id = u.classroom_id
                WHERE u.classroom_id IS NOT NULL AND ls.classroom_id IS NULL
            ');
        } else {
            DB::statement('
                UPDATE learning_sessions
                SET classroom_id = (SELECT classroom_id FROM users WHERE users.id = learning_sessions.user_id)
                WHERE EXISTS (SELECT 1 FROM users WHERE users.id = learning_sessions.user_id AND users.classroom_id IS NOT NULL)
            ');
        }
    }

    public function down(): void
    {
        Schema::table('learning_sessions', function (Blueprint $table) {
            $table->dropForeign(['classroom_id']);
            $table->dropIndex(['classroom_id', 'date']);
            $table->dropColumn('classroom_id');
        });
    }
};
