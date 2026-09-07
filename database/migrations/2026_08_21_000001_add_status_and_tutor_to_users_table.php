<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('status', ['aktif', 'nonaktif', 'pending'])->default('aktif')->after('role');
            $table->foreignId('tutor_id')->nullable()->constrained('users')->nullOnDelete()->after('status');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['tutor_id']);
            $table->dropColumn(['tutor_id', 'status']);
        });
    }
};
