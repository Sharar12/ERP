<?php
namespace Database\Seeders;

use App\Models\Core\Organization;
use App\Models\Document\{Document, DocumentFolder};
use Illuminate\Database\Seeder;

class DocumentSeeder extends Seeder
{
    public function run(): void
    {
        foreach (Organization::all() as $org) {
            $folders = collect(['Contracts', 'Policies', 'Templates'])
                ->map(fn ($name) => DocumentFolder::create([
                    'organization_id' => $org->id,
                    'name' => $name,
                ]));

            // 5 documents
            for ($i = 0; $i < 5; $i++) {
                Document::create([
                    'organization_id' => $org->id,
                    'folder_id' => $folders->random()->id,
                    'name' => fake()->words(3, true) . '.pdf',
                    'path' => 'documents/' . \Str::uuid() . '.pdf',
                    'mime_type' => 'application/pdf',
                    'size' => fake()->numberBetween(50000, 5000000),
                    'category' => fake()->randomElement(['contract', 'policy', 'template']),
                    'current_version' => 1,
                    'visibility' => 'organization',
                ]);
            }
        }
    }
}
