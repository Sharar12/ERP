<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('modules', function (Blueprint $t) {
            $t->id();
            $t->string('key', 40)->unique();              // 'crm', 'sales', 'inventory'
            $t->string('name');
            $t->string('icon', 40)->nullable();           // lucide icon name
            $t->string('category', 40);                   // 'core','business','operations'
            $t->text('description')->nullable();
            $t->json('default_settings')->nullable();
            $t->boolean('is_core')->default(false);       // core modules can't be disabled
            $t->timestamps();
        });

        Schema::create('module_dependencies', function (Blueprint $t) {
            $t->foreignId('module_id')->constrained()->cascadeOnDelete();
            $t->foreignId('depends_on_module_id')->constrained('modules')->cascadeOnDelete();
            $t->primary(['module_id', 'depends_on_module_id']);
        });

        Schema::create('organization_modules', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('module_id')->constrained()->cascadeOnDelete();
            $t->boolean('enabled')->default(false);
            $t->timestamp('enabled_at')->nullable();
            $t->foreignId('enabled_by')->nullable()->constrained('users')->nullOnDelete();
            $t->timestamps();
            $t->unique(['organization_id', 'module_id']);
        });

        Schema::create('module_settings', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('module_id')->constrained()->cascadeOnDelete();
            $t->json('settings')->nullable();
            $t->timestamps();
            $t->unique(['organization_id', 'module_id']);
        });

        Schema::create('organization_settings', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->string('key', 80);
            $t->json('value')->nullable();
            $t->timestamps();
            $t->unique(['organization_id', 'key']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('organization_settings');
        Schema::dropIfExists('module_settings');
        Schema::dropIfExists('organization_modules');
        Schema::dropIfExists('module_dependencies');
        Schema::dropIfExists('modules');
    }
};

