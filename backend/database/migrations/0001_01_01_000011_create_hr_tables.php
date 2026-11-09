<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('designations', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->string('name');
            $t->string('code', 30)->nullable();
            $t->timestamps();
        });

        Schema::create('employees', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('department_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('designation_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('manager_id')->nullable()->constrained('employees')->nullOnDelete();
            $t->string('employee_number', 30);
            $t->string('first_name');
            $t->string('last_name')->nullable();
            $t->string('email')->nullable();
            $t->string('phone', 30)->nullable();
            $t->string('avatar_path')->nullable();
            $t->date('date_of_birth')->nullable();
            $t->enum('gender', ['male', 'female', 'other'])->nullable();
            $t->text('address')->nullable();
            $t->date('joining_date');
            $t->date('termination_date')->nullable();
            $t->enum('employment_type', ['full_time', 'part_time', 'contract', 'intern'])
                ->default('full_time');
            $t->decimal('base_salary', 15, 2)->default(0);
            $t->enum('status', ['active', 'on_leave', 'terminated', 'resigned'])->default('active');
            $t->timestamps();
            $t->softDeletes();
            $t->unique(['organization_id', 'employee_number']);
        });

        Schema::create('employment_contracts', function (Blueprint $t) {
            $t->id();
            $t->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $t->string('number', 40);
            $t->date('start_date');
            $t->date('end_date')->nullable();
            $t->enum('type', ['permanent', 'fixed_term', 'probation'])->default('permanent');
            $t->decimal('salary', 15, 2);
            $t->text('terms')->nullable();
            $t->timestamps();
        });

        Schema::create('shifts', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->string('name');
            $t->time('start_time');
            $t->time('end_time');
            $t->unsignedSmallInteger('break_minutes')->default(0);
            $t->timestamps();
        });

        Schema::create('attendance', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $t->foreignId('shift_id')->nullable()->constrained()->nullOnDelete();
            $t->date('date');
            $t->timestamp('check_in')->nullable();
            $t->timestamp('check_out')->nullable();
            $t->decimal('hours_worked', 6, 2)->default(0);
            $t->enum('status', ['present', 'absent', 'late', 'half_day', 'leave', 'holiday'])
                ->default('present');
            $t->text('notes')->nullable();
            $t->timestamps();
            $t->unique(['employee_id', 'date']);
            $t->index(['organization_id', 'date']);
        });

        Schema::create('leave_types', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->string('name');
            $t->unsignedSmallInteger('days_per_year')->default(0);
            $t->boolean('paid')->default(true);
            $t->string('color', 20)->nullable();
            $t->timestamps();
        });

        Schema::create('leaves', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $t->foreignId('leave_type_id')->constrained()->restrictOnDelete();
            $t->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $t->date('start_date');
            $t->date('end_date');
            $t->decimal('days', 6, 2);
            $t->text('reason')->nullable();
            $t->enum('status', ['pending', 'approved', 'rejected', 'cancelled'])->default('pending');
            $t->timestamp('approved_at')->nullable();
            $t->text('approver_note')->nullable();
            $t->timestamps();
            $t->index(['organization_id', 'status']);
        });

        Schema::create('salary_structures', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->string('name');
            $t->json('components');                      // [{type:'earning', name:'basic', amount:...}]
            $t->timestamps();
        });

        Schema::create('employee_benefits', function (Blueprint $t) {
            $t->id();
            $t->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $t->string('name');
            $t->decimal('amount', 15, 2)->default(0);
            $t->enum('frequency', ['monthly', 'yearly', 'one_time'])->default('monthly');
            $t->timestamps();
        });

        Schema::create('payroll_runs', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->string('number', 40);
            $t->string('period', 20);                    // '2025-03'
            $t->date('payment_date')->nullable();
            $t->decimal('total_gross', 15, 2)->default(0);
            $t->decimal('total_net', 15, 2)->default(0);
            $t->enum('status', ['draft', 'processing', 'approved', 'paid', 'cancelled'])->default('draft');
            $t->timestamps();
            $t->softDeletes();
            $t->unique(['organization_id', 'period']);
        });

        Schema::create('payroll_items', function (Blueprint $t) {
            $t->id();
            $t->foreignId('payroll_run_id')->constrained()->cascadeOnDelete();
            $t->foreignId('employee_id')->constrained()->restrictOnDelete();
            $t->decimal('base_salary', 15, 2);
            $t->decimal('allowances', 15, 2)->default(0);
            $t->decimal('deductions', 15, 2)->default(0);
            $t->decimal('tax', 15, 2)->default(0);
            $t->decimal('net_pay', 15, 2);
            $t->json('breakdown')->nullable();
            $t->timestamps();
        });

        Schema::create('performance_reviews', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $t->foreignId('reviewer_id')->nullable()->constrained('users')->nullOnDelete();
            $t->string('period', 20);
            $t->unsignedTinyInteger('overall_rating')->default(0);   // 1-5
            $t->json('ratings')->nullable();               // {communication:4, delivery:5}
            $t->text('strengths')->nullable();
            $t->text('improvements')->nullable();
            $t->text('goals')->nullable();
            $t->enum('status', ['draft', 'submitted', 'acknowledged'])->default('draft');
            $t->timestamps();
        });

        Schema::create('recruitment_jobs', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('department_id')->nullable()->constrained()->nullOnDelete();
            $t->string('title');
            $t->text('description')->nullable();
            $t->text('requirements')->nullable();
            $t->string('location')->nullable();
            $t->enum('type', ['full_time', 'part_time', 'contract', 'intern'])->default('full_time');
            $t->decimal('salary_range_min', 15, 2)->nullable();
            $t->decimal('salary_range_max', 15, 2)->nullable();
            $t->enum('status', ['open', 'on_hold', 'closed'])->default('open');
            $t->timestamp('posted_at')->nullable();
            $t->timestamps();
            $t->softDeletes();
        });

        Schema::create('job_applications', function (Blueprint $t) {
            $t->id();
            $t->foreignId('recruitment_job_id')->constrained()->cascadeOnDelete();
            $t->string('first_name');
            $t->string('last_name')->nullable();
            $t->string('email');
            $t->string('phone', 30)->nullable();
            $t->string('resume_path')->nullable();
            $t->text('cover_letter')->nullable();
            $t->enum('status', ['applied', 'screening', 'interview', 'offer', 'hired', 'rejected'])
                ->default('applied');
            $t->text('notes')->nullable();
            $t->timestamps();
            $t->softDeletes();
        });

        Schema::create('employee_documents', function (Blueprint $t) {
            $t->id();
            $t->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $t->string('name');
            $t->string('path');
            $t->string('mime_type', 60)->nullable();
            $t->unsignedBigInteger('size')->default(0);
            $t->timestamps();
        });

        Schema::create('onboarding_tasks', function (Blueprint $t) {
            $t->id();
            $t->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $t->string('name');
            $t->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $t->date('due_date')->nullable();
            $t->timestamp('completed_at')->nullable();
            $t->timestamps();
        });
    }

    public function down(): void
    {
        foreach ([
            'onboarding_tasks','employee_documents','job_applications','recruitment_jobs',
            'performance_reviews','payroll_items','payroll_runs','employee_benefits','salary_structures',
            'leaves','leave_types','attendance','shifts','employment_contracts','employees','designations',
        ] as $t) Schema::dropIfExists($t);
    }
};
