<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tenants', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique(); // used for subdomain or header-based identification
            $table->string('domain')->nullable()->unique();
            $table->string('logo_path')->nullable();
            $table->string('business_type')->nullable();
            $table->string('registration_number')->nullable();
            $table->string('tax_id')->nullable();
            $table->string('default_currency', 3)->default('USD');
            $table->string('timezone')->default('UTC');
            $table->string('locale', 10)->default('en');
            $table->json('enabled_modules')->nullable(); // e.g. ["sales", "inventory", "accounting"]
            $table->boolean('is_active')->default(true);
            $table->json('settings')->nullable(); // flexible tenant-wide configuration
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tenants');
    }
};
