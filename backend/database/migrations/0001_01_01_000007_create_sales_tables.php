<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // shared line-item table used by quotations, orders, invoices, returns
        Schema::create('sales_document_items', function (Blueprint $t) {
            $t->id();
            $t->string('document_type', 30);              // 'quotation','order','invoice','return'
            $t->unsignedBigInteger('document_id');
            $t->unsignedBigInteger('product_id')->nullable();
            $t->string('description');
            $t->decimal('quantity', 15, 3)->default(1);
            $t->decimal('unit_price', 15, 2)->default(0);
            $t->decimal('discount_percent', 5, 2)->default(0);
            $t->decimal('tax_percent', 5, 2)->default(0);
            $t->decimal('line_total', 15, 2)->default(0);
            $t->unsignedSmallInteger('sort_order')->default(0);
            $t->timestamps();
            $t->index(['document_type', 'document_id']);
        });

        Schema::create('quotations', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('customer_id')->constrained()->restrictOnDelete();
            $t->foreignId('sales_rep_id')->nullable()->constrained('users')->nullOnDelete();
            $t->string('number', 40);
            $t->date('issue_date');
            $t->date('valid_until')->nullable();
            $t->decimal('subtotal', 15, 2)->default(0);
            $t->decimal('discount_total', 15, 2)->default(0);
            $t->decimal('tax_total', 15, 2)->default(0);
            $t->decimal('total', 15, 2)->default(0);
            $t->enum('status', ['draft', 'sent', 'accepted', 'rejected', 'expired'])
                ->default('draft');
            $t->text('notes')->nullable();
            $t->json('terms')->nullable();
            $t->timestamps();
            $t->softDeletes();
            $t->unique(['organization_id', 'number']);
            $t->index(['organization_id', 'status']);
        });

        Schema::create('sales_orders', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('customer_id')->constrained()->restrictOnDelete();
            $t->foreignId('quotation_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('sales_rep_id')->nullable()->constrained('users')->nullOnDelete();
            $t->string('number', 40);
            $t->date('order_date');
            $t->date('expected_delivery')->nullable();
            $t->decimal('subtotal', 15, 2)->default(0);
            $t->decimal('discount_total', 15, 2)->default(0);
            $t->decimal('tax_total', 15, 2)->default(0);
            $t->decimal('total', 15, 2)->default(0);
            $t->enum('status', ['draft', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
                ->default('draft');
            $t->text('notes')->nullable();
            $t->timestamps();
            $t->softDeletes();
            $t->unique(['organization_id', 'number']);
        });

        Schema::create('invoices', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('customer_id')->constrained()->restrictOnDelete();
            $t->foreignId('sales_order_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('sales_rep_id')->nullable()->constrained('users')->nullOnDelete();
            $t->string('number', 40);
            $t->date('issue_date');
            $t->date('due_date');
            $t->decimal('subtotal', 15, 2)->default(0);
            $t->decimal('discount_total', 15, 2)->default(0);
            $t->decimal('tax_total', 15, 2)->default(0);
            $t->decimal('total', 15, 2)->default(0);
            $t->decimal('amount_paid', 15, 2)->default(0);
            $t->decimal('balance_due', 15, 2)->default(0);
            $t->enum('status', ['draft', 'sent', 'partial', 'paid', 'overdue', 'void'])
                ->default('draft');
            $t->boolean('is_recurring')->default(false);
            $t->string('recurrence', 20)->nullable();     // 'monthly','weekly','yearly'
            $t->text('notes')->nullable();
            $t->timestamps();
            $t->softDeletes();
            $t->unique(['organization_id', 'number']);
            $t->index(['organization_id', 'status']);
            $t->index(['organization_id', 'due_date']);
        });

        Schema::create('sales_returns', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('invoice_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('customer_id')->constrained()->restrictOnDelete();
            $t->string('number', 40);
            $t->date('return_date');
            $t->decimal('total', 15, 2)->default(0);
            $t->enum('status', ['draft', 'approved', 'received', 'refunded', 'rejected'])
                ->default('draft');
            $t->text('reason')->nullable();
            $t->timestamps();
            $t->softDeletes();
            $t->unique(['organization_id', 'number']);
        });

        Schema::create('credit_notes', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('invoice_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('customer_id')->constrained()->restrictOnDelete();
            $t->string('number', 40);
            $t->date('issue_date');
            $t->decimal('amount', 15, 2)->default(0);
            $t->enum('status', ['open', 'applied', 'void'])->default('open');
            $t->text('reason')->nullable();
            $t->timestamps();
            $t->softDeletes();
        });

        Schema::create('payments', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('customer_id')->constrained()->restrictOnDelete();
            $t->morphs('payable');                        // invoice, sales_order, etc.
            $t->string('number', 40);
            $t->date('payment_date');
            $t->decimal('amount', 15, 2);
            $t->string('method', 40)->nullable();         // 'cash','bank','card','cheque'
            $t->string('reference')->nullable();
            $t->text('notes')->nullable();
            $t->timestamps();
            $t->softDeletes();
            $t->unique(['organization_id', 'number']);
        });

        Schema::create('sales_targets', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('user_id')->constrained()->cascadeOnDelete();
            $t->string('period', 20);                     // '2025-Q1' or '2025-03'
            $t->decimal('target_amount', 15, 2);
            $t->decimal('achieved_amount', 15, 2)->default(0);
            $t->timestamps();
            $t->unique(['organization_id', 'user_id', 'period']);
        });

        Schema::create('discounts', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->string('name');
            $t->enum('type', ['percent', 'fixed'])->default('percent');
            $t->decimal('value', 15, 2);
            $t->timestamp('starts_at')->nullable();
            $t->timestamp('ends_at')->nullable();
            $t->boolean('active')->default(true);
            $t->timestamps();
        });
    }

    public function down(): void
    {
        foreach ([
            'discounts','sales_targets','payments','credit_notes','sales_returns',
            'invoices','sales_orders','quotations','sales_document_items',
        ] as $t) Schema::dropIfExists($t);
    }
};

