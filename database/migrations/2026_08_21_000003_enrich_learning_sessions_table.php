<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('learning_sessions', function (Blueprint $table) {
            $table->foreignId('tutor_id')->nullable()->constrained('users')->nullOnDelete()->after('user_id');
            $table->enum('status', ['hadir', 'absen', 'reschedule', 'libur', 'akan-datang'])->default('akan-datang')->change();
            $table->index(['user_id', 'date']);
            $table->index(['tutor_id', 'date']);
        });
    }

    public function down(): void
    {
        Schema::table('learning_sessions', function (Blueprint $table) {
            $table->dropForeign(['tutor_id']);
            $table->dropIndex(['user_id', 'date']);
            $table->dropIndex(['tutor_id', 'date']);
            $table->dropColumn('tutor_id');
        });
    }
};
