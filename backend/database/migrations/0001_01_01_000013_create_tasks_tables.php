<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('task_lists', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->string('name');
            $t->string('color', 20)->nullable();
            $t->timestamps();
        });

        Schema::create('tasks', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('task_list_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('project_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('milestone_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('parent_id')->nullable()->constrained('tasks')->nullOnDelete();
            $t->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $t->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $t->string('title');
            $t->text('description')->nullable();
            $t->enum('status', ['todo', 'in_progress', 'review', 'done', 'cancelled'])->default('todo');
            $t->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $t->date('due_date')->nullable();
            $t->timestamp('completed_at')->nullable();
            $t->decimal('estimated_hours', 8, 2)->nullable();
            $t->decimal('logged_hours', 8, 2)->default(0);
            $t->unsignedTinyInteger('progress')->default(0);
            $t->unsignedSmallInteger('sort_order')->default(0);
            $t->timestamps();
            $t->softDeletes();
            $t->index(['organization_id', 'status']);
            $t->index(['assigned_to', 'status']);
        });

        Schema::create('task_comments', function (Blueprint $t) {
            $t->id();
            $t->foreignId('task_id')->constrained()->cascadeOnDelete();
            $t->foreignId('user_id')->constrained()->cascadeOnDelete();
            $t->text('body');
            $t->timestamps();
        });

        Schema::create('task_attachments', function (Blueprint $t) {
            $t->id();
            $t->foreignId('task_id')->constrained()->cascadeOnDelete();
            $t->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $t->string('name');
            $t->string('path');
            $t->string('mime_type', 60)->nullable();
            $t->unsignedBigInteger('size')->default(0);
            $t->timestamps();
        });

        Schema::create('task_dependencies', function (Blueprint $t) {
            $t->foreignId('task_id')->constrained()->cascadeOnDelete();
            $t->foreignId('depends_on_task_id')->constrained('tasks')->cascadeOnDelete();
            $t->primary(['task_id', 'depends_on_task_id']);
        });

        Schema::create('task_reminders', function (Blueprint $t) {
            $t->id();
            $t->foreignId('task_id')->constrained()->cascadeOnDelete();
            $t->foreignId('user_id')->constrained()->cascadeOnDelete();
            $t->timestamp('remind_at');
            $t->boolean('sent')->default(false);
            $t->timestamps();
        });

        Schema::create('workflow_rules', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->string('name');
            $t->string('trigger_event', 60);              // 'task.created', 'invoice.paid'
            $t->json('conditions')->nullable();
            $t->json('actions');
            $t->boolean('active')->default(true);
            $t->timestamps();
        });
    }

    public function down(): void
    {
        foreach ([
            'workflow_rules','task_reminders','task_dependencies','task_attachments',
            'task_comments','tasks','task_lists','time_entries',
        ] as $t) Schema::dropIfExists($t);
    }
};
