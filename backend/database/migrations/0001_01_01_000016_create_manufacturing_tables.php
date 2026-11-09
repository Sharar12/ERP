<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('work_centers', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();
            $t->string('name');
            $t->string('code', 30);
            $t->decimal('capacity_per_hour', 15, 2)->default(0);
            $t->decimal('cost_per_hour', 15, 2)->default(0);
            $t->timestamps();
        });

        Schema::create('boms', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('product_id')->constrained()->cascadeOnDelete();
            $t->string('code', 40);
            $t->string('name');
            $t->decimal('quantity', 15, 3)->default(1);
            $t->enum('status', ['draft', 'active', 'archived'])->default('active');
            $t->timestamps();
            $t->softDeletes();
            $t->unique(['organization_id', 'code']);
        });

        Schema::create('bom_items', function (Blueprint $t) {
            $t->id();
            $t->foreignId('bom_id')->constrained()->cascadeOnDelete();
            $t->foreignId('component_product_id')->constrained('products')->restrictOnDelete();
            $t->decimal('quantity', 15, 3);
            $t->decimal('scrap_percent', 5, 2)->default(0);
            $t->timestamps();
        });

        Schema::create('bom_operations', function (Blueprint $t) {
            $t->id();
            $t->foreignId('bom_id')->constrained()->cascadeOnDelete();
            $t->foreignId('work_center_id')->nullable()->constrained()->nullOnDelete();
            $t->string('name');
            $t->unsignedSmallInteger('sequence')->default(1);
            $t->decimal('duration_minutes', 8, 2)->default(0);
            $t->timestamps();
        });

        Schema::create('manufacturing_orders', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('bom_id')->constrained()->restrictOnDelete();
            $t->foreignId('product_id')->constrained()->restrictOnDelete();
            $t->string('number', 40);
            $t->decimal('quantity', 15, 3);
            $t->date('start_date');
            $t->date('due_date')->nullable();
            $t->timestamp('completed_at')->nullable();
            $t->enum('status', ['draft', 'planned', 'in_progress', 'completed', 'cancelled'])
                ->default('draft');
            $t->decimal('estimated_cost', 15, 2)->default(0);
            $t->decimal('actual_cost', 15, 2)->default(0);
            $t->timestamps();
            $t->softDeletes();
            $t->unique(['organization_id', 'number']);
        });

        Schema::create('work_orders', function (Blueprint $t) {
            $t->id();
            $t->foreignId('manufacturing_order_id')->constrained()->cascadeOnDelete();
            $t->foreignId('work_center_id')->nullable()->constrained()->nullOnDelete();
            $t->string('name');
            $t->unsignedSmallInteger('sequence')->default(1);
            $t->decimal('planned_duration', 8, 2)->default(0);
            $t->decimal('actual_duration', 8, 2)->default(0);
            $t->enum('status', ['pending', 'in_progress', 'done', 'cancelled'])->default('pending');
            $t->timestamps();
        });

        Schema::create('material_consumptions', function (Blueprint $t) {
            $t->id();
            $t->foreignId('manufacturing_order_id')->constrained()->cascadeOnDelete();
            $t->foreignId('product_id')->constrained()->restrictOnDelete();
            $t->foreignId('warehouse_id')->nullable()->constrained()->nullOnDelete();
            $t->decimal('planned_qty', 15, 3);
            $t->decimal('consumed_qty', 15, 3)->default(0);
            $t->decimal('unit_cost', 15, 4)->default(0);
            $t->timestamps();
        });

        Schema::create('production_plans', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->string('name');
            $t->date('period_start');
            $t->date('period_end');
            $t->json('plan_data')->nullable();
            $t->enum('status', ['draft', 'approved', 'active', 'closed'])->default('draft');
            $t->timestamps();
        });
    }

    public function down(): void
    {
        foreach ([
            'production_plans','material_consumptions','work_orders','manufacturing_orders',
            'bom_operations','bom_items','boms','work_centers',
        ] as $t) Schema::dropIfExists($t);
    }
};
