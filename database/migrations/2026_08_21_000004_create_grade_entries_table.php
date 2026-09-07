<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grade_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('tutor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('module_id')->nullable()->constrained('modules')->nullOnDelete();
            $table->foreignId('learning_session_id')->nullable()->constrained('learning_sessions')->nullOnDelete();
            $table->unsignedTinyInteger('meeting_number')->default(1);
            $table->enum('module_type', ['robot', 'coding', 'general'])->default('general');
            $table->date('meeting_date')->nullable();
            $table->decimal('fokus', 3, 2)->default(0);
            $table->decimal('robot_building', 3, 2)->nullable();
            $table->decimal('tools_management', 3, 2)->default(0);
            $table->decimal('interaksi', 3, 2)->default(0);
            $table->decimal('coding', 3, 2)->default(0);
            $table->decimal('average', 3, 2)->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->index(['student_id', 'meeting_date']);
            $table->index(['module_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grade_entries');
    }
};
