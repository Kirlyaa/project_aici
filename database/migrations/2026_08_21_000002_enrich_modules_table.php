<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('modules', function (Blueprint $table) {
            $table->text('description')->nullable()->after('name');
            $table->string('image')->nullable()->after('description');
            $table->json('tools')->nullable()->after('image');
            $table->enum('module_type', [4, 5])->default(5)->after('tools');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete()->after('module_type');
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('modules', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->dropColumn([
                'description',
                'image',
                'tools',
                'module_type',
                'created_by',
            ]);
            $table->dropSoftDeletes();
        });
    }
};
