<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('suppliers', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();
            $t->string('code', 30);
            $t->string('name');
            $t->string('email')->nullable();
            $t->string('phone', 30)->nullable();
            $t->string('tax_id', 50)->nullable();
            $t->text('address')->nullable();
            $t->string('city', 100)->nullable();
            $t->string('country', 2)->nullable();
            $t->string('payment_terms', 40)->nullable();
            $t->decimal('opening_balance', 15, 2)->default(0);
            $t->enum('status', ['active', 'inactive', 'blocked'])->default('active');
            $t->timestamps();
            $t->softDeletes();
            $t->unique(['organization_id', 'code']);
        });

        Schema::create('purchase_requests', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('requested_by')->nullable()->constrained('users')->nullOnDelete();
            $t->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $t->string('number', 40);
            $t->date('request_date');
            $t->date('required_date')->nullable();
            $t->enum('status', ['draft', 'submitted', 'approved', 'rejected', 'converted'])
                ->default('draft');
            $t->text('notes')->nullable();
            $t->timestamps();
            $t->softDeletes();
            $t->unique(['organization_id', 'number']);
        });

        Schema::create('purchase_requisitions', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('purchase_request_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('requested_by')->nullable()->constrained('users')->nullOnDelete();
            $t->string('number', 40);
            $t->date('date');
            $t->enum('status', ['draft', 'submitted', 'approved', 'rejected'])->default('draft');
            $t->text('notes')->nullable();
            $t->timestamps();
            $t->softDeletes();
            $t->unique(['organization_id', 'number']);
        });

        Schema::create('rfqs', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->string('number', 40);
            $t->date('issue_date');
            $t->date('deadline')->nullable();
            $t->enum('status', ['draft', 'sent', 'awarded', 'closed'])->default('draft');
            $t->text('notes')->nullable();
            $t->timestamps();
            $t->softDeletes();
            $t->unique(['organization_id', 'number']);
        });

        Schema::create('rfq_suppliers', function (Blueprint $t) {
            $t->foreignId('rfq_id')->constrained()->cascadeOnDelete();
            $t->foreignId('supplier_id')->constrained()->cascadeOnDelete();
            $t->primary(['rfq_id', 'supplier_id']);
        });

        Schema::create('supplier_quotations', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('rfq_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('supplier_id')->constrained()->cascadeOnDelete();
            $t->string('number', 40);
            $t->date('received_date');
            $t->decimal('total', 15, 2)->default(0);
            $t->enum('status', ['received', 'accepted', 'rejected'])->default('received');
            $t->text('notes')->nullable();
            $t->timestamps();
            $t->softDeletes();
        });

        Schema::create('purchase_orders', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('supplier_id')->constrained()->restrictOnDelete();
            $t->foreignId('rfq_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $t->string('number', 40);
            $t->date('order_date');
            $t->date('expected_date')->nullable();
            $t->decimal('subtotal', 15, 2)->default(0);
            $t->decimal('tax_total', 15, 2)->default(0);
            $t->decimal('total', 15, 2)->default(0);
            $t->enum('status', ['draft', 'approved', 'sent', 'partial', 'received', 'cancelled'])
                ->default('draft');
            $t->text('notes')->nullable();
            $t->timestamps();
            $t->softDeletes();
            $t->unique(['organization_id', 'number']);
        });

        Schema::create('purchase_order_items', function (Blueprint $t) {
            $t->id();
            $t->foreignId('purchase_order_id')->constrained()->cascadeOnDelete();
            $t->foreignId('product_id')->nullable()->constrained('products')->nullOnDelete();
            $t->string('description');
            $t->decimal('quantity', 15, 3);
            $t->decimal('unit_price', 15, 2);
            $t->decimal('tax_percent', 5, 2)->default(0);
            $t->decimal('line_total', 15, 2);
            $t->unsignedSmallInteger('sort_order')->default(0);
            $t->timestamps();
        });

        Schema::create('goods_received_notes', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('purchase_order_id')->constrained()->cascadeOnDelete();
            $t->foreignId('warehouse_id')->nullable()->constrained('warehouses')->nullOnDelete();
            $t->foreignId('received_by')->nullable()->constrained('users')->nullOnDelete();
            $t->string('number', 40);
            $t->date('received_date');
            $t->enum('status', ['draft', 'received', 'cancelled'])->default('draft');
            $t->text('notes')->nullable();
            $t->timestamps();
            $t->softDeletes();
            $t->unique(['organization_id', 'number']);
        });

        Schema::create('goods_received_items', function (Blueprint $t) {
            $t->id();
            $t->foreignId('goods_received_note_id')->constrained()->cascadeOnDelete();
            $t->foreignId('product_id')->constrained()->restrictOnDelete();
            $t->decimal('quantity_ordered', 15, 3);
            $t->decimal('quantity_received', 15, 3);
            $t->timestamps();
        });

        Schema::create('purchase_invoices', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('supplier_id')->constrained()->restrictOnDelete();
            $t->foreignId('purchase_order_id')->nullable()->constrained()->nullOnDelete();
            $t->string('number', 40);
            $t->date('issue_date');
            $t->date('due_date');
            $t->decimal('total', 15, 2);
            $t->decimal('amount_paid', 15, 2)->default(0);
            $t->enum('status', ['draft', 'unpaid', 'partial', 'paid', 'void'])->default('draft');
            $t->timestamps();
            $t->softDeletes();
            $t->unique(['organization_id', 'number']);
        });

        Schema::create('purchase_returns', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('supplier_id')->constrained()->restrictOnDelete();
            $t->foreignId('goods_received_note_id')->nullable()->constrained()->nullOnDelete();
            $t->string('number', 40);
            $t->date('return_date');
            $t->decimal('total', 15, 2);
            $t->enum('status', ['draft', 'approved', 'shipped', 'refunded'])->default('draft');
            $t->text('reason')->nullable();
            $t->timestamps();
            $t->softDeletes();
            $t->unique(['organization_id', 'number']);
        });

        Schema::create('supplier_payments', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('supplier_id')->constrained()->restrictOnDelete();
            $t->foreignId('purchase_invoice_id')->nullable()->constrained()->nullOnDelete();
            $t->string('number', 40);
            $t->date('payment_date');
            $t->decimal('amount', 15, 2);
            $t->string('method', 40)->nullable();
            $t->string('reference')->nullable();
            $t->timestamps();
            $t->softDeletes();
            $t->unique(['organization_id', 'number']);
        });

        Schema::create('approval_workflows', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->string('entity_type', 60);                // 'purchase_order','invoice'
            $t->string('name');
            $t->boolean('active')->default(true);
            $t->timestamps();
        });

        Schema::create('approval_steps', function (Blueprint $t) {
            $t->id();
            $t->foreignId('workflow_id')->constrained('approval_workflows')->cascadeOnDelete();
            $t->unsignedTinyInteger('sort_order');
            $t->foreignId('role_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $t->timestamps();
        });

        Schema::create('approval_requests', function (Blueprint $t) {
            $t->id();
            $t->foreignId('workflow_id')->constrained('approval_workflows')->cascadeOnDelete();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->morphs('subject');
            $t->unsignedTinyInteger('current_step')->default(1);
            $t->enum('status', ['pending', 'approved', 'rejected', 'cancelled'])->default('pending');
            $t->timestamps();
        });
    }

    public function down(): void
    {
        foreach ([
            'approval_requests','approval_steps','approval_workflows',
            'supplier_payments','purchase_returns','purchase_invoices','goods_received_items',
            'goods_received_notes','purchase_order_items','purchase_orders','supplier_quotations',
            'rfq_suppliers','rfqs','purchase_requisitions','purchase_requests','suppliers',
        ] as $t) Schema::dropIfExists($t);
    }
};

