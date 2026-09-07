<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add soft delete to users
        if (!Schema::hasColumn('users', 'deleted_at')) {
            Schema::table('users', function (Blueprint $table) {
                $table->softDeletes()->after('updated_at');
            });
        }

        // Add soft delete to schools
        if (!Schema::hasColumn('schools', 'deleted_at')) {
            Schema::table('schools', function (Blueprint $table) {
                $table->softDeletes()->after('updated_at');
            });
        }

        // Add soft delete to learning_sessions
        if (!Schema::hasColumn('learning_sessions', 'deleted_at')) {
            Schema::table('learning_sessions', function (Blueprint $table) {
                $table->softDeletes()->after('updated_at');
            });
        }

        // Add soft delete to grade_entries
        if (!Schema::hasColumn('grade_entries', 'deleted_at')) {
            Schema::table('grade_entries', function (Blueprint $table) {
                $table->softDeletes()->after('updated_at');
            });
        }

        // Add soft delete to student_comments
        if (!Schema::hasColumn('student_comments', 'deleted_at')) {
            Schema::table('student_comments', function (Blueprint $table) {
                $table->softDeletes()->after('updated_at');
            });
        }
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('schools', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('learning_sessions', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('grade_entries', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });

        Schema::table('student_comments', function (Blueprint $table) {
            $table->dropSoftDeletes();
        });
    }
};
