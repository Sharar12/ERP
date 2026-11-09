<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('document_folders', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('parent_id')->nullable()->constrained('document_folders')->nullOnDelete();
            $t->string('name');
            $t->string('color', 20)->nullable();
            $t->timestamps();
            $t->softDeletes();
        });

        Schema::create('documents', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('folder_id')->nullable()->constrained('document_folders')->nullOnDelete();
            $t->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $t->string('name');
            $t->string('path');
            $t->string('mime_type', 80)->nullable();
            $t->unsignedBigInteger('size')->default(0);
            $t->string('category', 60)->nullable();
            $t->unsignedSmallInteger('current_version')->default(1);
            $t->enum('visibility', ['private', 'team', 'organization'])->default('organization');
            $t->timestamp('expires_at')->nullable();
            $t->timestamps();
            $t->softDeletes();
        });

        Schema::create('document_versions', function (Blueprint $t) {
            $t->id();
            $t->foreignId('document_id')->constrained()->cascadeOnDelete();
            $t->foreignId('uploaded_by')->nullable()->constrained('users')->nullOnDelete();
            $t->unsignedSmallInteger('version_number');
            $t->string('path');
            $t->unsignedBigInteger('size')->default(0);
            $t->text('notes')->nullable();
            $t->timestamps();
            $t->unique(['document_id', 'version_number']);
        });

        Schema::create('document_shares', function (Blueprint $t) {
            $t->id();
            $t->foreignId('document_id')->constrained()->cascadeOnDelete();
            $t->morphs('shareable');                     // user or role or org
            $t->enum('permission', ['view', 'comment', 'edit'])->default('view');
            $t->timestamp('expires_at')->nullable();
            $t->timestamps();
        });

        Schema::create('document_approvals', function (Blueprint $t) {
            $t->id();
            $t->foreignId('document_id')->constrained()->cascadeOnDelete();
            $t->foreignId('user_id')->constrained()->cascadeOnDelete();
            $t->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $t->text('note')->nullable();
            $t->timestamp('decided_at')->nullable();
            $t->timestamps();
        });
    }

    public function down(): void
    {
        foreach ([
            'document_approvals','document_shares','document_versions','documents','document_folders',
        ] as $t) Schema::dropIfExists($t);
    }
};
