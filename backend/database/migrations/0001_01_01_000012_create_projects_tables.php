<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('customer_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('manager_id')->nullable()->constrained('users')->nullOnDelete();
            $t->string('code', 30);
            $t->string('name');
            $t->text('description')->nullable();
            $t->date('start_date');
            $t->date('end_date')->nullable();
            $t->decimal('budget', 15, 2)->default(0);
            $t->decimal('actual_cost', 15, 2)->default(0);
            $t->unsignedTinyInteger('progress')->default(0);
            $t->enum('status', ['planning', 'active', 'on_hold', 'completed', 'cancelled'])
                ->default('planning');
            $t->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $t->timestamps();
            $t->softDeletes();
            $t->unique(['organization_id', 'code']);
        });

        Schema::create('project_members', function (Blueprint $t) {
            $t->id();
            $t->foreignId('project_id')->constrained()->cascadeOnDelete();
            $t->foreignId('user_id')->constrained()->cascadeOnDelete();
            $t->string('role', 40)->default('member');
            $t->decimal('hourly_rate', 15, 2)->nullable();
            $t->timestamp('joined_at')->nullable();
            $t->timestamps();
            $t->unique(['project_id', 'user_id']);
        });

        Schema::create('milestones', function (Blueprint $t) {
            $t->id();
            $t->foreignId('project_id')->constrained()->cascadeOnDelete();
            $t->string('name');
            $t->text('description')->nullable();
            $t->date('due_date')->nullable();
            $t->timestamp('completed_at')->nullable();
            $t->decimal('amount', 15, 2)->default(0);
            $t->timestamps();
        });

        Schema::create('project_expenses', function (Blueprint $t) {
            $t->id();
            $t->foreignId('project_id')->constrained()->cascadeOnDelete();
            $t->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $t->date('date');
            $t->string('category', 60)->nullable();
            $t->string('description');
            $t->decimal('amount', 15, 2);
            $t->string('receipt_path')->nullable();
            $t->timestamps();
        });

        Schema::create('project_budgets', function (Blueprint $t) {
            $t->id();
            $t->foreignId('project_id')->constrained()->cascadeOnDelete();
            $t->string('category', 60);
            $t->decimal('budgeted', 15, 2);
            $t->decimal('actual', 15, 2)->default(0);
            $t->timestamps();
        });
    }

    public function down(): void
    {
        foreach ([
            'project_budgets','project_expenses','milestones','project_members','projects',
        ] as $t) Schema::dropIfExists($t);
    }
};
