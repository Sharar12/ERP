<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('chart_of_accounts', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('parent_id')->nullable()->constrained('chart_of_accounts')->nullOnDelete();
            $t->string('code', 20);
            $t->string('name');
            $t->enum('type', ['asset', 'liability', 'equity', 'income', 'expense']);
            $t->enum('normal_balance', ['debit', 'credit']);
            $t->boolean('is_group')->default(false);
            $t->boolean('is_active')->default(true);
            $t->decimal('opening_balance', 15, 2)->default(0);
            $t->timestamps();
            $t->unique(['organization_id', 'code']);
            $t->index(['organization_id', 'type']);
        });

        Schema::create('journal_entries', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();
            $t->string('number', 40);
            $t->date('entry_date');
            $t->string('reference')->nullable();
            $t->text('description')->nullable();
            $t->enum('status', ['draft', 'posted', 'reversed'])->default('draft');
            $t->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $t->timestamp('posted_at')->nullable();
            $t->timestamps();
            $t->softDeletes();
            $t->unique(['organization_id', 'number']);
        });

        Schema::create('journal_entry_lines', function (Blueprint $t) {
            $t->id();
            $t->foreignId('journal_entry_id')->constrained()->cascadeOnDelete();
            $t->foreignId('account_id')->constrained('chart_of_accounts')->restrictOnDelete();
            $t->decimal('debit', 15, 2)->default(0);
            $t->decimal('credit', 15, 2)->default(0);
            $t->text('description')->nullable();
            $t->timestamps();
        });

        Schema::create('bank_accounts', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('account_id')->nullable()->constrained('chart_of_accounts')->nullOnDelete();
            $t->string('name');
            $t->string('account_number', 40);
            $t->string('bank_name')->nullable();
            $t->string('iban', 40)->nullable();
            $t->string('swift', 20)->nullable();
            $t->string('currency', 3)->default('USD');
            $t->decimal('opening_balance', 15, 2)->default(0);
            $t->decimal('current_balance', 15, 2)->default(0);
            $t->boolean('is_active')->default(true);
            $t->timestamps();
            $t->softDeletes();
        });

        Schema::create('bank_transactions', function (Blueprint $t) {
            $t->id();
            $t->foreignId('bank_account_id')->constrained()->cascadeOnDelete();
            $t->date('transaction_date');
            $t->string('description');
            $t->string('reference')->nullable();
            $t->decimal('debit', 15, 2)->default(0);
            $t->decimal('credit', 15, 2)->default(0);
            $t->decimal('balance', 15, 2)->default(0);
            $t->boolean('reconciled')->default(false);
            $t->timestamps();
        });

        Schema::create('bank_reconciliations', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('bank_account_id')->constrained()->cascadeOnDelete();
            $t->date('period_start');
            $t->date('period_end');
            $t->decimal('statement_balance', 15, 2);
            $t->decimal('book_balance', 15, 2);
            $t->decimal('difference', 15, 2)->default(0);
            $t->enum('status', ['in_progress', 'completed'])->default('in_progress');
            $t->timestamps();
        });

        Schema::create('taxes', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->string('name');
            $t->decimal('rate', 5, 2);
            $t->enum('type', ['vat', 'gst', 'sales_tax', 'withholding', 'other']);
            $t->foreignId('account_id')->nullable()->constrained('chart_of_accounts')->nullOnDelete();
            $t->boolean('is_active')->default(true);
            $t->timestamps();
        });

        Schema::create('financial_periods', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->string('name');
            $t->date('start_date');
            $t->date('end_date');
            $t->enum('status', ['open', 'closed', 'locked'])->default('open');
            $t->timestamps();
        });

        Schema::create('cost_centers', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->string('name');
            $t->string('code', 30);
            $t->timestamps();
        });

        Schema::create('budgets', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('account_id')->nullable()->constrained('chart_of_accounts')->nullOnDelete();
            $t->foreignId('cost_center_id')->nullable()->constrained()->nullOnDelete();
            $t->string('name');
            $t->date('start_date');
            $t->date('end_date');
            $t->decimal('budgeted_amount', 15, 2);
            $t->decimal('actual_amount', 15, 2)->default(0);
            $t->timestamps();
            $t->softDeletes();
        });

        Schema::create('transactions', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('account_id')->nullable()->constrained('chart_of_accounts')->nullOnDelete();
            $t->foreignId('bank_account_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('customer_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('supplier_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $t->string('number', 40);
            $t->enum('type', ['income', 'expense', 'transfer', 'journal']);
            $t->date('transaction_date');
            $t->string('category', 60)->nullable();
            $t->string('description');
            $t->decimal('amount', 15, 2);
            $t->string('currency', 3)->default('USD');
            $t->string('reference')->nullable();
            $t->enum('status', ['pending', 'posted', 'void'])->default('posted');
            $t->timestamps();
            $t->softDeletes();
            $t->unique(['organization_id', 'number']);
        });

        Schema::create('ledger_entries', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('account_id')->constrained('chart_of_accounts')->cascadeOnDelete();
            $t->foreignId('journal_entry_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('transaction_id')->nullable()->constrained()->nullOnDelete();
            $t->date('entry_date');
            $t->decimal('debit', 15, 2)->default(0);
            $t->decimal('credit', 15, 2)->default(0);
            $t->text('description')->nullable();
            $t->timestamps();
            $t->index(['organization_id', 'account_id', 'entry_date']);
        });
    }

    public function down(): void
    {
        foreach ([
            'ledger_entries','transactions','budgets','cost_centers','financial_periods','taxes',
            'bank_reconciliations','bank_transactions','bank_accounts',
            'journal_entry_lines','journal_entries','chart_of_accounts',
        ] as $t) Schema::dropIfExists($t);
    }
};
