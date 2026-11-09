<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('product_categories', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('parent_id')->nullable()->constrained('product_categories')->nullOnDelete();
            $t->string('name');
            $t->string('code', 30)->nullable();
            $t->timestamps();
            $t->softDeletes();
        });

        Schema::create('uoms', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->string('name');
            $t->string('code', 10);
            $t->string('base_uom', 10)->nullable();
            $t->decimal('conversion_factor', 15, 4)->default(1);
            $t->timestamps();
        });

        Schema::create('products', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('category_id')->nullable()->constrained('product_categories')->nullOnDelete();
            $t->foreignId('uom_id')->nullable()->constrained('uoms')->nullOnDelete();
            $t->string('sku', 60);
            $t->string('barcode', 60)->nullable();
            $t->string('name');
            $t->text('description')->nullable();
            $t->string('image_path')->nullable();
            $t->enum('type', ['product', 'service', 'raw_material', 'finished_good'])
                ->default('product');
            $t->decimal('cost_price', 15, 2)->default(0);
            $t->decimal('selling_price', 15, 2)->default(0);
            $t->decimal('tax_percent', 5, 2)->default(0);
            $t->integer('reorder_level')->default(0);
            $t->integer('reorder_quantity')->default(0);
            $t->boolean('track_stock')->default(true);
            $t->boolean('track_batches')->default(false);
            $t->boolean('track_serial')->default(false);
            $t->boolean('track_expiry')->default(false);
            $t->enum('status', ['active', 'inactive', 'discontinued'])->default('active');
            $t->timestamps();
            $t->softDeletes();
            $t->unique(['organization_id', 'sku']);
            $t->index(['organization_id', 'status']);
        });

        Schema::create('product_variants', function (Blueprint $t) {
            $t->id();
            $t->foreignId('product_id')->constrained()->cascadeOnDelete();
            $t->string('sku', 60);
            $t->string('name');
            $t->json('attributes')->nullable();           // {color:'red', size:'M'}
            $t->decimal('cost_price', 15, 2)->default(0);
            $t->decimal('selling_price', 15, 2)->default(0);
            $t->timestamps();
            $t->unique(['product_id', 'sku']);
        });

        Schema::create('warehouses', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();
            $t->string('name');
            $t->string('code', 30);
            $t->text('address')->nullable();
            $t->string('manager')->nullable();
            $t->boolean('is_default')->default(false);
            $t->timestamps();
            $t->softDeletes();
            $t->unique(['organization_id', 'code']);
        });

        Schema::create('storage_locations', function (Blueprint $t) {
            $t->id();
            $t->foreignId('warehouse_id')->constrained()->cascadeOnDelete();
            $t->string('code', 30);
            $t->string('name');
            $t->string('zone', 40)->nullable();
            $t->string('aisle', 20)->nullable();
            $t->string('rack', 20)->nullable();
            $t->string('bin', 20)->nullable();
            $t->timestamps();
            $t->unique(['warehouse_id', 'code']);
        });

        Schema::create('product_batches', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('product_id')->constrained()->cascadeOnDelete();
            $t->string('batch_number', 60);
            $t->date('manufacture_date')->nullable();
            $t->date('expiry_date')->nullable();
            $t->decimal('quantity', 15, 3)->default(0);
            $t->timestamps();
            $t->unique(['product_id', 'batch_number']);
        });

        Schema::create('stock_levels', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('warehouse_id')->constrained()->cascadeOnDelete();
            $t->foreignId('product_id')->constrained()->cascadeOnDelete();
            $t->foreignId('variant_id')->nullable()->constrained('product_variants')->nullOnDelete();
            $t->decimal('quantity', 15, 3)->default(0);
            $t->decimal('reserved_quantity', 15, 3)->default(0);
            $t->decimal('avg_cost', 15, 4)->default(0);
            $t->timestamps();
            $t->unique(['warehouse_id', 'product_id', 'variant_id']);
        });

        Schema::create('stock_movements', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('warehouse_id')->constrained()->cascadeOnDelete();
            $t->foreignId('product_id')->constrained()->restrictOnDelete();
            $t->foreignId('variant_id')->nullable()->constrained('product_variants')->nullOnDelete();
            $t->foreignId('batch_id')->nullable()->constrained('product_batches')->nullOnDelete();
            $t->enum('type', ['in', 'out', 'transfer', 'adjustment', 'return']);
            $t->string('reference_type', 60)->nullable();
            $t->unsignedBigInteger('reference_id')->nullable();
            $t->decimal('quantity', 15, 3);
            $t->decimal('unit_cost', 15, 4)->default(0);
            $t->decimal('balance_after', 15, 3)->default(0);
            $t->text('notes')->nullable();
            $t->timestamp('moved_at');
            $t->timestamps();
            $t->index(['organization_id', 'moved_at']);
            $t->index(['reference_type', 'reference_id']);
        });

        Schema::create('stock_transfers', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('from_warehouse_id')->constrained('warehouses')->restrictOnDelete();
            $t->foreignId('to_warehouse_id')->constrained('warehouses')->restrictOnDelete();
            $t->string('number', 40);
            $t->date('transfer_date');
            $t->enum('status', ['draft', 'in_transit', 'received', 'cancelled'])->default('draft');
            $t->text('notes')->nullable();
            $t->timestamps();
            $t->softDeletes();
            $t->unique(['organization_id', 'number']);
        });

        Schema::create('stock_transfer_items', function (Blueprint $t) {
            $t->id();
            $t->foreignId('stock_transfer_id')->constrained()->cascadeOnDelete();
            $t->foreignId('product_id')->constrained()->restrictOnDelete();
            $t->foreignId('variant_id')->nullable()->constrained('product_variants')->nullOnDelete();
            $t->decimal('quantity', 15, 3);
            $t->timestamps();
        });

        Schema::create('stock_adjustments', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('warehouse_id')->constrained()->restrictOnDelete();
            $t->string('number', 40);
            $t->date('adjustment_date');
            $t->enum('reason', ['damage', 'theft', 'recount', 'expiry', 'other'])->default('other');
            $t->text('notes')->nullable();
            $t->timestamps();
            $t->softDeletes();
            $t->unique(['organization_id', 'number']);
        });

        Schema::create('stock_adjustment_items', function (Blueprint $t) {
            $t->id();
            $t->foreignId('stock_adjustment_id')->constrained()->cascadeOnDelete();
            $t->foreignId('product_id')->constrained()->restrictOnDelete();
            $t->decimal('quantity_before', 15, 3);
            $t->decimal('quantity_after', 15, 3);
            $t->decimal('difference', 15, 3);
            $t->timestamps();
        });

        Schema::create('serial_numbers', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('product_id')->constrained()->cascadeOnDelete();
            $t->foreignId('warehouse_id')->nullable()->constrained()->nullOnDelete();
            $t->string('serial', 80);
            $t->enum('status', ['in_stock', 'sold', 'returned', 'damaged'])->default('in_stock');
            $t->timestamps();
            $t->unique(['organization_id', 'serial']);
        });
    }

    public function down(): void
    {
        foreach ([
            'serial_numbers','stock_adjustment_items','stock_adjustments',
            'stock_transfer_items','stock_transfers','stock_movements','stock_levels',
            'product_batches','storage_locations','warehouses','product_variants','products','uoms','product_categories',
        ] as $t) Schema::dropIfExists($t);
    }
};

