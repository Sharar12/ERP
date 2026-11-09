<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('quality_standards', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->string('name');
            $t->text('description')->nullable();
            $t->json('checklist')->nullable();
            $t->timestamps();
        });

        Schema::create('quality_inspections', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('standard_id')->nullable()->constrained('quality_standards')->nullOnDelete();
            $t->morphs('subject');                       // MO, GRN, return
            $t->foreignId('inspector_id')->nullable()->constrained('users')->nullOnDelete();
            $t->date('inspection_date');
            $t->enum('result', ['pending', 'pass', 'fail', 'conditional'])->default('pending');
            $t->json('checklist_results')->nullable();
            $t->text('notes')->nullable();
            $t->timestamps();
        });

        Schema::create('non_conformance_reports', function (Blueprint $t) {
            $t->id();
            $t->foreignId('organization_id')->constrained()->cascadeOnDelete();
            $t->foreignId('inspection_id')->nullable()->constrained('quality_inspections')->nullOnDelete();
            $t->string('number', 40);
            $t->date('date');
            $t->text('description');
            $t->enum('severity', ['minor', 'major', 'critical'])->default('minor');
            $t->enum('status', ['open', 'under_review', 'closed'])->default('open');
            $t->foreignId('reported_by')->nullable()->constrained('users')->nullOnDelete();
            $t->timestamps();
            $t->softDeletes();
            $t->unique(['organization_id', 'number']);
        });

        Schema::create('corrective_actions', function (Blueprint $t) {
            $t->id();
            $t->foreignId('ncr_id')->constrained('non_conformance_reports')->cascadeOnDelete();
            $t->text('action');
            $t->foreignId('assigned_to')->nullable()->constrained('users')->nullOnDelete();
            $t->date('due_date')->nullable();
            $t->timestamp('completed_at')->nullable();
            $t->enum('status', ['open', 'in_progress', 'done', 'verified'])->default('open');
            $t->timestamps();
        });
    }

    public function down(): void
    {
        foreach ([
            'corrective_actions','non_conformance_reports','quality_inspections','quality_standards',
        ] as $t) Schema::dropIfExists($t);
    }
};
