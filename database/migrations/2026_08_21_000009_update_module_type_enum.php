<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Change module_type from numeric enum (4, 5) to string enum (robot, coding)
     */
    public function up(): void
    {
        // For SQLite, we need to create a new column and migrate data
        if (DB::getDriverName() === 'sqlite') {
            Schema::table('modules', function (Blueprint $table) {
                $table->string('module_type_new')->nullable()->after('module_type');
            });

            // Migrate data: 5 => 'robot', 4 => 'coding'
            DB::table('modules')->whereNotNull('module_type')->each(function ($module) {
                $newType = $module->module_type == 5 ? 'robot' : ($module->module_type == 4 ? 'coding' : 'general');
                DB::table('modules')->where('id', $module->id)->update(['module_type_new' => $newType]);
            });

            // Drop old column and rename new one
            Schema::table('modules', function (Blueprint $table) {
                $table->dropColumn('module_type');
            });

            Schema::table('modules', function (Blueprint $table) {
                $table->renameColumn('module_type_new', 'module_type');
            });
        } else {
            // For MySQL/PostgreSQL
            Schema::table('modules', function (Blueprint $table) {
                // Change existing enum type
                $table->string('module_type')->change();
            });

            // Migrate data: 5 => 'robot', 4 => 'coding'
            DB::statement("UPDATE modules SET module_type = CASE WHEN module_type = 5 THEN 'robot' WHEN module_type = 4 THEN 'coding' ELSE 'general' END");
        }

        // Same for grade_entries
        if (DB::getDriverName() === 'sqlite') {
            Schema::table('grade_entries', function (Blueprint $table) {
                $table->string('module_type_new')->nullable()->after('module_type');
            });

            DB::table('grade_entries')->whereNotNull('module_type')->each(function ($entry) {
                $newType = $entry->module_type == 5 ? 'robot' : ($entry->module_type == 4 ? 'coding' : 'general');
                DB::table('grade_entries')->where('id', $entry->id)->update(['module_type_new' => $newType]);
            });

            Schema::table('grade_entries', function (Blueprint $table) {
                $table->dropColumn('module_type');
            });

            Schema::table('grade_entries', function (Blueprint $table) {
                $table->renameColumn('module_type_new', 'module_type');
            });
        } else {
            Schema::table('grade_entries', function (Blueprint $table) {
                $table->string('module_type')->change();
            });

            DB::statement("UPDATE grade_entries SET module_type = CASE WHEN module_type = 5 THEN 'robot' WHEN module_type = 4 THEN 'coding' ELSE 'general' END");
        }

        // Same for comment_templates
        if (DB::getDriverName() === 'sqlite') {
            Schema::table('comment_templates', function (Blueprint $table) {
                $table->string('category_new')->nullable()->after('category');
            });

            DB::table('comment_templates')->each(function ($template) {
                DB::table('comment_templates')->where('id', $template->id)->update(['category_new' => $template->category]);
            });

            Schema::table('comment_templates', function (Blueprint $table) {
                $table->dropColumn('category');
            });

            Schema::table('comment_templates', function (Blueprint $table) {
                $table->renameColumn('category_new', 'category');
            });
        } else {
            Schema::table('comment_templates', function (Blueprint $table) {
                $table->string('category')->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert back to numeric values if needed
        if (DB::getDriverName() === 'sqlite') {
            Schema::table('modules', function (Blueprint $table) {
                $table->string('module_type_old')->nullable();
            });

            DB::table('modules')->each(function ($module) {
                $oldType = $module->module_type === 'robot' ? 5 : ($module->module_type === 'coding' ? 4 : null);
                DB::table('modules')->where('id', $module->id)->update(['module_type_old' => $oldType]);
            });

            Schema::table('modules', function (Blueprint $table) {
                $table->dropColumn('module_type');
            });

            Schema::table('modules', function (Blueprint $table) {
                $table->renameColumn('module_type_old', 'module_type');
            });
        }
    }
};
