<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('learning_session_module', function (Blueprint $table) {
            if (! Schema::hasColumn('learning_session_module', 'book_id')) {
                $table->foreignId('book_id')->nullable()->after('module_id')->constrained('modules')->nullOnDelete();
            }
        });

        Schema::table('grade_entries', function (Blueprint $table) {
            if (! Schema::hasColumn('grade_entries', 'book_id')) {
                $table->foreignId('book_id')->nullable()->after('module_id')->constrained('modules')->nullOnDelete();
            }
        });

        $sessionRows = DB::table('learning_session_module')->get();
        foreach ($sessionRows as $row) {
            $module = DB::table('modules')->where('id', $row->module_id)->first();
            DB::table('learning_session_module')
                ->where('id', $row->id)
                ->update(['book_id' => $module?->parent_id ?? $module?->id ?? null]);
        }

        $gradeRows = DB::table('grade_entries')->get();
        foreach ($gradeRows as $row) {
            $module = DB::table('modules')->where('id', $row->module_id)->first();
            DB::table('grade_entries')
                ->where('id', $row->id)
                ->update(['book_id' => $module?->parent_id ?? $module?->id ?? null]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('grade_entries', function (Blueprint $table) {
            if (Schema::hasColumn('grade_entries', 'book_id')) {
                $table->dropConstrainedForeignId('book_id');
            }
        });

        Schema::table('learning_session_module', function (Blueprint $table) {
            if (Schema::hasColumn('learning_session_module', 'book_id')) {
                $table->dropConstrainedForeignId('book_id');
            }
        });
    }
};
