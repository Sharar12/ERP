<?php
// database/seeders/ActivitySeeder.php
namespace Database\Seeders;

use App\Models\Core\Organization;
use App\Models\Auth\User;
use App\Models\System\{ActivityLog, Announcement};
use Illuminate\Database\Seeder;

class ActivitySeeder extends Seeder
{
    public function run(): void
    {
        foreach (Organization::all() as $org) {
            $users = User::where('organization_id', $org->id)->get();

            // 5 activity logs
            for ($i = 0; $i < 5; $i++) {
                ActivityLog::create([
                    'organization_id' => $org->id,
                    'user_id' => $users->isNotEmpty() ? $users->random()->id : null,
                    'event' => fake()->randomElement(['customer.created', 'invoice.paid', 'task.completed', 'user.invited']),
                    'description' => fake()->sentence(6),
                ]);
            }

            // 2 announcements
            foreach (range(1, 2) as $i) {
                Announcement::create([
                    'organization_id' => $org->id,
                    'created_by' => $users->isNotEmpty() ? $users->first()->id : null,
                    'title' => fake()->sentence(3),
                    'body' => fake()->paragraph(),
                    'published_at' => now()->subDays(fake()->numberBetween(1, 10)),
                ]);
            }
        }
    }
}
