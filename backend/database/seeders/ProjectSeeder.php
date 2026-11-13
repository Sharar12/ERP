<?php
namespace Database\Seeders;

use App\Models\Core\Organization;
use App\Models\Auth\User;
use App\Models\Project\{Project, Milestone};
use App\Models\Task\Task;
use App\Models\Project\TimeEntry;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        foreach (Organization::all() as $org) {
            $users = User::where('organization_id', $org->id)->get();

            // 5 projects
            $projects = collect(range(1, 5))->map(fn ($i) => Project::create([
                'organization_id' => $org->id,
                'code' => 'PRJ-' . str_pad($i, 3, '0', STR_PAD_LEFT),
                'name' => fake()->catchPhrase(),
                'start_date' => now()->subMonths(2),
                'end_date' => now()->addMonths(2),
                'budget' => fake()->numberBetween(20000, 200000),
                'status' => fake()->randomElement(['planning', 'active', 'active']),
                'priority' => fake()->randomElement(['medium', 'high']),
            ]));

            // 6 tasks (Phase 1 count)
            $tasks = Task::factory()->count(6)->create([
                'organization_id' => $org->id,
                'project_id' => fn () => $projects->random()->id,
                'assigned_to' => fn () => $users->isNotEmpty() ? $users->random()->id : null,
            ]);

            // 4 milestones
            foreach ($projects->take(4) as $project) {
                Milestone::create([
                    'project_id' => $project->id,
                    'name' => fake()->catchPhrase(),
                    'due_date' => now()->addDays(fake()->numberBetween(10, 60)),
                ]);
            }

            // 3 time entries
            foreach ($tasks->take(3) as $task) {
                TimeEntry::create([
                    'organization_id' => $org->id,
                    'user_id' => $task->assigned_to ?? ($users->isNotEmpty() ? $users->random()->id : User::first()?->id),
                    'project_id' => $task->project_id,
                    'task_id' => $task->id,
                    'date' => now()->subDays(fake()->numberBetween(0, 7)),
                    'hours' => fake()->randomFloat(2, 1, 8),
                    'billable' => true,
                ]);
            }
        }
    }
}
