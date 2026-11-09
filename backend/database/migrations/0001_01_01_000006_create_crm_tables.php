<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('customer_groups', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->string('name');
            $t->text('description')->nullable();
            $t->decimal('discount_percent', 5, 2)->default(0);
            $t->timestamps();
            $t->softDeletes();
        });

        Schema::create('companies', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->string('name');
            $t->string('industry', 60)->nullable();
            $t->string('website')->nullable();
            $t->string('phone', 30)->nullable();
            $t->string('email')->nullable();
            $t->text('address')->nullable();
            $t->string('city', 100)->nullable();
            $t->string('country', 2)->nullable();
            $t->timestamps();
            $t->softDeletes();
        });

        Schema::create('customers', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('company_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('customer_group_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('account_manager_id')->nullable()->constrained('users')->nullOnDelete();
            $t->string('code', 30);
            $t->string('name');
            $t->string('email')->nullable();
            $t->string('phone', 30)->nullable();
            $t->string('tax_id', 50)->nullable();
            $t->text('billing_address')->nullable();
            $t->text('shipping_address')->nullable();
            $t->decimal('credit_limit', 15, 2)->default(0);
            $t->decimal('opening_balance', 15, 2)->default(0);
            $t->enum('status', ['active', 'inactive', 'blocked'])->default('active');
            $t->json('tags')->nullable();
            $t->timestamps();
            $t->softDeletes();
            $t->unique(['organization_id', 'code']);
            $t->index(['organization_id', 'status']);
            $t->index('email');
        });

        Schema::create('leads', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('owner_id')->nullable()->constrained('users')->nullOnDelete();
            $t->foreignId('converted_customer_id')->nullable()->constrained('customers')->nullOnDelete();
            $t->string('name');
            $t->string('company_name')->nullable();
            $t->string('email')->nullable();
            $t->string('phone', 30)->nullable();
            $t->string('source', 40)->nullable();
            $t->decimal('estimated_value', 15, 2)->default(0);
            $t->enum('status', ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'])
                ->default('new');
            $t->unsignedTinyInteger('score')->default(0);
            $t->text('notes')->nullable();
            $t->timestamp('converted_at')->nullable();
            $t->timestamps();
            $t->softDeletes();
            $t->index(['organization_id', 'status']);
        });

        Schema::create('contacts', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('customer_id')->nullable()->constrained()->cascadeOnDelete();
            $t->foreignId('company_id')->nullable()->constrained()->nullOnDelete();
            $t->string('first_name');
            $t->string('last_name')->nullable();
            $t->string('email')->nullable();
            $t->string('phone', 30)->nullable();
            $t->string('job_title')->nullable();
            $t->boolean('is_primary')->default(false);
            $t->timestamps();
            $t->softDeletes();
        });

        Schema::create('pipelines', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->string('name');
            $t->boolean('is_default')->default(false);
            $t->timestamps();
        });

        Schema::create('pipeline_stages', function (Blueprint $t) {
            $t->id();
            $t->foreignId('pipeline_id')->constrained()->cascadeOnDelete();
            $t->string('name');
            $t->unsignedTinyInteger('sort_order')->default(0);
            $t->string('color', 20)->nullable();
            $t->decimal('probability', 5, 2)->default(0);
            $t->timestamps();
        });

        Schema::create('opportunities', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('customer_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('lead_id')->nullable()->constrained('leads')->nullOnDelete();
            $t->foreignId('owner_id')->nullable()->constrained('users')->nullOnDelete();
            $t->foreignId('pipeline_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('stage_id')->nullable()->constrained('pipeline_stages')->nullOnDelete();
            $t->string('name');
            $t->decimal('value', 15, 2)->default(0);
            $t->date('expected_close_date')->nullable();
            $t->enum('status', ['open', 'won', 'lost'])->default('open');
            $t->text('notes')->nullable();
            $t->timestamps();
            $t->softDeletes();
        });

        Schema::create('follow_ups', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->morphs('subject');                        // customer, lead, opportunity
            $t->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $t->string('title');
            $t->text('description')->nullable();
            $t->timestamp('due_at')->nullable();
            $t->timestamp('completed_at')->nullable();
            $t->enum('priority', ['low', 'normal', 'high'])->default('normal');
            $t->timestamps();
        });

        Schema::create('customer_activities', function (Blueprint $t) {
            $t->id();
            $t->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $t->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $t->enum('type', ['call', 'email', 'meeting', 'note', 'task', 'system']);
            $t->string('subject');
            $t->text('body')->nullable();
            $t->timestamp('occurred_at');
            $t->timestamps();
            $t->index(['customer_id', 'occurred_at']);
        });

        Schema::create('customer_notes', function (Blueprint $t) {
            $t->id();
            $t->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $t->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $t->text('body');
            $t->boolean('is_pinned')->default(false);
            $t->timestamps();
        });
    }

    public function down(): void
    {
        foreach ([
            'customer_notes','customer_activities','follow_ups','opportunities',
            'pipeline_stages','pipelines','contacts','leads','customers','companies','customer_groups',
        ] as $t) Schema::dropIfExists($t);
    }
};

