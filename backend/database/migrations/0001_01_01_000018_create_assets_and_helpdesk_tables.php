<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // ── Assets ──────────────────────────────────────────────
        Schema::create('asset_categories', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->string('name');
            $t->decimal('depreciation_rate', 5, 2)->default(0);
            $t->unsignedSmallInteger('useful_life_years')->default(5);
            $t->timestamps();
        });

        Schema::create('assets', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('category_id')->nullable()->constrained('asset_categories')->nullOnDelete();
            $t->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $t->foreignId('location_id')->nullable()->constrained('locations')->nullOnDelete();
            $t->string('code', 40);
            $t->string('name');
            $t->text('description')->nullable();
            $t->string('serial_number', 80)->nullable();
            $t->date('purchase_date');
            $t->decimal('purchase_cost', 15, 2);
            $t->decimal('current_value', 15, 2);
            $t->date('warranty_expires_at')->nullable();
            $t->enum('status', ['active', 'in_repair', 'retired', 'disposed'])->default('active');
            $t->timestamps();
            $t->softDeletes();
            $t->unique(['organization_id', 'code']);
        });

        Schema::create('asset_assignments', function (Blueprint $t) {
            $t->id();
            $t->foreignId('asset_id')->constrained()->cascadeOnDelete();
            $t->foreignId('user_id')->constrained()->cascadeOnDelete();
            $t->timestamp('assigned_at');
            $t->timestamp('returned_at')->nullable();
            $t->text('notes')->nullable();
            $t->timestamps();
        });

        Schema::create('maintenance_records', function (Blueprint $t) {
            $t->id();
            $t->foreignId('asset_id')->constrained()->cascadeOnDelete();
            $t->foreignId('performed_by')->nullable()->constrained('users')->nullOnDelete();
            $t->date('date');
            $t->enum('type', ['preventive', 'corrective', 'inspection'])->default('preventive');
            $t->string('description');
            $t->decimal('cost', 15, 2)->default(0);
            $t->date('next_due_date')->nullable();
            $t->timestamps();
        });

        Schema::create('depreciation_records', function (Blueprint $t) {
            $t->id();
            $t->foreignId('asset_id')->constrained()->cascadeOnDelete();
            $t->date('period_start');
            $t->date('period_end');
            $t->decimal('amount', 15, 2);
            $t->decimal('book_value_after', 15, 2);
            $t->timestamps();
        });

        // ── Helpdesk ────────────────────────────────────────────
        Schema::create('ticket_categories', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->string('name');
            $t->string('color', 20)->nullable();
            $t->timestamps();
        });

        Schema::create('sla_policies', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->string('name');
            $t->enum('priority', ['low', 'normal', 'high', 'urgent']);
            $t->unsignedSmallInteger('response_minutes')->default(60);
            $t->unsignedSmallInteger('resolution_minutes')->default(480);
            $t->timestamps();
        });

        Schema::create('tickets', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('category_id')->nullable()->constrained('ticket_categories')->nullOnDelete();
            $t->foreignId('customer_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $t->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $t->string('number', 40);
            $t->string('subject');
            $t->text('description');
            $t->enum('priority', ['low', 'normal', 'high', 'urgent'])->default('normal');
            $t->enum('status', ['open', 'in_progress', 'waiting_customer', 'resolved', 'closed'])
                ->default('open');
            $t->timestamp('first_response_at')->nullable();
            $t->timestamp('resolved_at')->nullable();
            $t->timestamp('closed_at')->nullable();
            $t->timestamps();
            $t->softDeletes();
            $t->unique(['organization_id', 'number']);
            $t->index(['organization_id', 'status']);
        });

        Schema::create('ticket_replies', function (Blueprint $t) {
            $t->id();
            $t->foreignId('ticket_id')->constrained()->cascadeOnDelete();
            $t->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $t->text('body');
            $t->boolean('is_internal')->default(false);
            $t->timestamps();
        });

        Schema::create('knowledge_base_articles', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('category_id')->nullable()->constrained('ticket_categories')->nullOnDelete();
            $t->foreignId('author_id')->nullable()->constrained('users')->nullOnDelete();
            $t->string('title');
            $t->string('slug')->unique();
            $t->longText('body');
            $t->unsignedInteger('views')->default(0);
            $t->enum('status', ['draft', 'published', 'archived'])->default('published');
            $t->timestamps();
            $t->softDeletes();
        });
    }

    public function down(): void
    {
        foreach ([
            'knowledge_base_articles','ticket_replies','tickets','sla_policies','ticket_categories',
            'depreciation_records','maintenance_records','asset_assignments','assets','asset_categories',
        ] as $t) Schema::dropIfExists($t);
    }
};
