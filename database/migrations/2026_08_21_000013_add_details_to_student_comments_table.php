<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('student_comments', function (Blueprint $table) {
            if (!Schema::hasColumn('student_comments', 'strengths')) {
                $table->text('strengths')->nullable()->after('tutor_comment');
            }
            if (!Schema::hasColumn('student_comments', 'notes')) {
                $table->text('notes')->nullable()->after('strengths');
            }
        });
    }

    public function down(): void
    {
        Schema::table('student_comments', function (Blueprint $table) {
            $table->dropColumn(['strengths', 'notes']);
        });
    }
};
