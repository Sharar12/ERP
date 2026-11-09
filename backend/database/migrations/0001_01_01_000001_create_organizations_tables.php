<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('organizations', function (Blueprint $t) {
            $t->id();
            $t->string('name');
            $t->string('slug')->unique();
            $t->string('legal_name')->nullable();
            $t->string('email')->nullable();
            $t->string('phone', 30)->nullable();
            $t->string('website')->nullable();
            $t->string('logo_path')->nullable();
            $t->text('address')->nullable();
            $t->string('city', 100)->nullable();
            $t->string('state', 100)->nullable();
            $t->string('postal_code', 20)->nullable();
            $t->string('country', 2)->nullable();
            $t->string('tax_id', 50)->nullable();
            $t->string('currency', 3)->default('USD');
            $t->string('timezone', 50)->default('UTC');
            $t->string('locale', 5)->default('en');
            $t->string('industry', 50)->nullable();
            $t->string('fiscal_year_start', 5)->default('01-01');
            $t->json('settings')->nullable();
            $t->enum('status', ['active', 'suspended', 'trial'])->default('active');
            $t->timestamps();
            $t->softDeletes();
            $t->index('status');
        });

        Schema::create('branches', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->string('name');
            $t->string('code', 30);
            $t->string('email')->nullable();
            $t->string('phone', 30)->nullable();
            $t->text('address')->nullable();
            $t->string('city', 100)->nullable();
            $t->string('country', 2)->nullable();
            $t->boolean('is_headquarters')->default(false);
            $t->enum('status', ['active', 'inactive'])->default('active');
            $t->timestamps();
            $t->softDeletes();
            $t->unique(['organization_id', 'code']);
        });

        Schema::create('departments', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('parent_id')->nullable()->constrained('departments')->nullOnDelete();
            $t->string('name');
            $t->string('code', 30)->nullable();
            $t->text('description')->nullable();
            $t->timestamps();
            $t->softDeletes();
            $t->index(['organization_id', 'parent_id']);
        });

        Schema::create('business_units', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->string('name');
            $t->string('code', 30)->nullable();
            $t->text('description')->nullable();
            $t->timestamps();
            $t->softDeletes();
        });

        Schema::create('locations', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();
            $t->string('name');
            $t->enum('type', ['office', 'warehouse', 'plant', 'store', 'other'])->default('office');
            $t->text('address')->nullable();
            $t->string('city', 100)->nullable();
            $t->string('country', 2)->nullable();
            $t->decimal('latitude', 10, 6)->nullable();
            $t->decimal('longitude', 10, 6)->nullable();
            $t->timestamps();
            $t->softDeletes();
        });

        Schema::create('document_sequences', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->string('entity_type', 60);          // e.g. 'invoice', 'purchase_order'
            $t->string('prefix', 10)->default('');
            $t->unsignedInteger('next_number')->default(1);
            $t->unsignedTinyInteger('padding')->default(5);
            $t->string('fiscal_year', 10)->nullable();
            $t->timestamps();
            $t->unique(['organization_id', 'entity_type', 'fiscal_year'], 'doc_seq_org_entity_fy_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_sequences');
        Schema::dropIfExists('locations');
        Schema::dropIfExists('business_units');
        Schema::dropIfExists('departments');
        Schema::dropIfExists('branches');
        Schema::dropIfExists('organizations');
    }
};
