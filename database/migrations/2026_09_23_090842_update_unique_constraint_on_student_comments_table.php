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
            $table->dropUnique('student_comments_student_id_semester_unique');
            $table->unique(['student_id', 'semester', 'meeting_range'], 'student_comments_student_semester_range_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('student_comments', function (Blueprint $table) {
            $table->dropUnique('student_comments_student_semester_range_unique');
            $table->unique(['student_id', 'semester'], 'student_comments_student_id_semester_unique');
        });
    }
};
