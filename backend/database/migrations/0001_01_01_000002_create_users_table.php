<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('users', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('branch_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('department_id')->nullable()->constrained()->nullOnDelete();
            $t->string('name');
            $t->string('email')->unique();
            $t->string('phone', 30)->nullable();
            $t->string('avatar_path')->nullable();
            $t->string('job_title')->nullable();
            $t->timestamp('email_verified_at')->nullable();
            $t->string('password');
            $t->enum('status', ['active', 'invited', 'suspended', 'inactive'])->default('active');
            $t->string('locale', 5)->default('en');
            $t->string('timezone', 50)->default('UTC');
            $t->json('preferences')->nullable();
            $t->rememberToken();
            $t->timestamps();
            $t->softDeletes();
            $t->index(['organization_id', 'status']);
        });

        Schema::create('password_reset_tokens', function (Blueprint $t) {
            $t->string('email')->primary();
            $t->string('token');
            $t->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $t) {
            $t->string('id')->primary();
            $t->foreignId('user_id')->nullable()->index();
            $t->string('ip_address', 45)->nullable();
            $t->text('user_agent')->nullable();
            $t->longText('payload');
            $t->integer('last_activity')->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};

