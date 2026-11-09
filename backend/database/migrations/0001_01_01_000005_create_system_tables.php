<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $t->string('entity_type', 120);
            $t->unsignedBigInteger('entity_id');
            $t->enum('action', ['create', 'update', 'delete', 'restore', 'login', 'logout']);
            $t->json('old_values')->nullable();
            $t->json('new_values')->nullable();
            $t->string('ip_address', 45)->nullable();
            $t->string('user_agent')->nullable();
            $t->timestamp('created_at')->useCurrent();
            $t->index(['entity_type', 'entity_id']);
            $t->index(['organization_id', 'created_at']);
        });

        Schema::create('activity_logs', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $t->string('subject_type', 120)->nullable();
            $t->unsignedBigInteger('subject_id')->nullable();
            $t->string('event', 60);                      // 'customer.created', 'invoice.paid'
            $t->text('description');
            $t->json('properties')->nullable();
            $t->timestamp('created_at')->useCurrent();
            $t->index(['organization_id', 'created_at']);
            $t->index(['subject_type', 'subject_id']);
        });

        Schema::create('notifications', function (Blueprint $t) {
            $t->uuid('id')->primary();
            $t->foreignId('organization_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('user_id')->nullable()->constrained()->cascadeOnDelete();
            $t->string('type', 80);
            $t->string('title');
            $t->text('body')->nullable();
            $t->string('link')->nullable();
            $t->string('icon', 40)->nullable();
            $t->timestamp('read_at')->nullable();
            $t->json('data')->nullable();
            $t->timestamps();
            $t->index(['user_id', 'read_at']);
        });

        Schema::create('announcements', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $t->string('title');
            $t->text('body');
            $t->enum('audience', ['all', 'roles', 'users'])->default('all');
            $t->json('audience_ids')->nullable();
            $t->timestamp('published_at')->nullable();
            $t->timestamps();
        });

        Schema::create('custom_fields', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->string('entity_type', 120);               // 'App\Models\Crm\Customer'
            $t->string('key', 60);
            $t->string('label');
            $t->enum('type', ['text', 'number', 'date', 'boolean', 'select', 'multiselect']);
            $t->json('options')->nullable();
            $t->boolean('required')->default(false);
            $t->unsignedInteger('sort_order')->default(0);
            $t->timestamps();
            $t->unique(['organization_id', 'entity_type', 'key']);
        });

        Schema::create('custom_field_values', function (Blueprint $t) {
            $t->id();
            $t->foreignId('custom_field_id')->constrained()->cascadeOnDelete();
            $t->string('entity_type', 120);
            $t->unsignedBigInteger('entity_id');
            $t->text('value')->nullable();
            $t->timestamps();
            $t->unique(['custom_field_id', 'entity_type', 'entity_id']);
            $t->index(['entity_type', 'entity_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('custom_field_values');
        Schema::dropIfExists('custom_fields');
        Schema::dropIfExists('announcements');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('audit_logs');
    }
};

