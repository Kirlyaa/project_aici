<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('student_comments', function (Blueprint $table) {
            $table->string('meeting_range', 20)->default('1-4')->after('semester');
            $table->index(['student_id', 'meeting_range']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('student_comments', function (Blueprint $table) {
            $table->dropIndex(['student_id', 'meeting_range']);
            $table->dropColumn('meeting_range');
        });
    }
};
