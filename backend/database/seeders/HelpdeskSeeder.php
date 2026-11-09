<?php
// database/seeders/HelpdeskSeeder.php
namespace Database\Seeders;

use App\Models\Core\Organization;
use App\Models\Helpdesk\{Ticket, KnowledgeBaseArticle, TicketCategory};
use Illuminate\Database\Seeder;

class HelpdeskSeeder extends Seeder
{
    public function run(): void
    {
        foreach (Organization::all() as $org) {
            $categories = collect(['Technical', 'Billing', 'General'])->map(fn ($n) => TicketCategory::create([
                'organization_id' => $org->id,
                'name' => $n,
            ]));

            // 3 tickets
            for ($i = 0; $i < 3; $i++) {
                Ticket::create([
                    'organization_id' => $org->id,
                    'category_id' => $categories->random()->id,
                    'number' => 'TKT-' . str_pad($i + 1, 4, '0', STR_PAD_LEFT),
                    'subject' => fake()->sentence(4),
                    'description' => fake()->paragraph(),
                    'priority' => fake()->randomElement(['low', 'normal', 'high']),
                    'status' => fake()->randomElement(['open', 'in_progress', 'resolved']),
                ]);
            }

            // 3 KB articles
            for ($i = 0; $i < 3; $i++) {
                KnowledgeBaseArticle::create([
                    'organization_id' => $org->id,
                    'title' => fake()->sentence(4),
                    'slug' => \Str::slug(fake()->sentence(4)) . '-' . $i,
                    'body' => fake()->paragraphs(3, true),
                    'status' => 'published',
                ]);
            }
        }
    }
}
