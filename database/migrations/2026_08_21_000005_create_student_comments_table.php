<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('tutor_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('semester', 20);
            $table->unsignedSmallInteger('academic_year')->nullable();
            $table->text('system_comment')->nullable();
            $table->text('tutor_comment')->nullable();
            $table->decimal('average_grade', 3, 2)->nullable();
            $table->json('module_names')->nullable();
            $table->boolean('is_system_generated')->default(false);
            $table->timestamps();

            $table->unique(['student_id', 'semester']);
            $table->index(['tutor_id', 'semester']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_comments');
    }
};
