<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('roles', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->nullable()->constrained()->cascadeOnDelete();
            $t->string('name');
            $t->string('slug', 60);
            $t->text('description')->nullable();
            $t->boolean('is_system')->default(false);      // system roles can't be deleted
            $t->timestamps();
            $t->softDeletes();
            $t->unique(['organization_id', 'slug']);
        });

        Schema::create('permissions', function (Blueprint $t) {
            $t->id();
            $t->string('name');                            // e.g. "Create invoice"
            $t->string('slug', 120)->unique();             // e.g. "sales.invoice.create"
            $t->string('module', 40);                      // e.g. "sales"
            $t->string('group', 40)->nullable();           // e.g. "Invoices"
            $t->text('description')->nullable();
            $t->timestamps();
            $t->index('module');
        });

        Schema::create('role_permissions', function (Blueprint $t) {
            $t->foreignId('role_id')->constrained()->cascadeOnDelete();
            $t->foreignId('permission_id')->constrained()->cascadeOnDelete();
            $t->primary(['role_id', 'permission_id']);
        });

        Schema::create('user_roles', function (Blueprint $t) {
            $t->foreignId('user_id')->constrained()->cascadeOnDelete();
            $t->foreignId('role_id')->constrained()->cascadeOnDelete();
            $t->primary(['user_id', 'role_id']);
        });

        Schema::create('user_invitations', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->string('email');
            $t->string('token', 100)->unique();
            $t->foreignId('role_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('invited_by')->nullable()->constrained('users')->nullOnDelete();
            $t->timestamp('expires_at');
            $t->timestamp('accepted_at')->nullable();
            $t->timestamps();
            $t->index(['organization_id', 'email']);
        });

        Schema::create('login_history', function (Blueprint $t) {
            $t->id();
            $t->foreignId('user_id')->constrained()->cascadeOnDelete();
            $t->string('ip_address', 45)->nullable();
            $t->text('user_agent')->nullable();
            $t->string('device', 60)->nullable();
            $t->string('location')->nullable();
            $t->enum('status', ['success', 'failed'])->default('success');
            $t->timestamp('logged_in_at');
            $t->timestamp('logged_out_at')->nullable();
            $t->index(['user_id', 'logged_in_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('login_history');
        Schema::dropIfExists('user_invitations');
        Schema::dropIfExists('user_roles');
        Schema::dropIfExists('role_permissions');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('roles');
    }
};

