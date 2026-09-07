<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comment_templates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->enum('grade_range', ['<4', '4-4.99', '5']);
            $table->enum('category', ['umum', 'fokus', 'interaksi', 'robot_building', 'tools_management', 'coding'])->default('umum');
            $table->text('template');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['grade_range', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comment_templates');
    }
};
