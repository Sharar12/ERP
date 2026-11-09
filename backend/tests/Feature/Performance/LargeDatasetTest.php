<?php

namespace Tests\Feature\Performance;

use App\Models\Auth\User;
use App\Models\Core\Organization;
use App\Models\Crm\Customer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LargeDatasetTest extends TestCase
{
    use RefreshDatabase;

    public function test_pagination_performance_at_scale(): void
    {
        $org = Organization::factory()->create();
        $role = \App\Models\Auth\Role::create(['organization_id' => $org->id, 'name' => 'Admin', 'slug' => 'super-admin']);
        $user = User::factory()->create(['organization_id' => $org->id, 'status' => 'active']);
        $user->roles()->attach($role->id);

        // Bulk insert 1,000 customers for fast verification in sqlite
        $rows = collect(range(1, 1000))->map(fn($i) => [
            'organization_id' => $org->id,
            'code' => 'CUST-' . str_pad($i, 6, '0', STR_PAD_LEFT),
            'name' => "Customer {$i}",
            'email' => "c{$i}@test.io",
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ])->toArray();

        foreach (array_chunk($rows, 250) as $chunk) {
            Customer::insert($chunk);
        }

        // First page — should be fast
        $start = microtime(true);
        $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/crm/customers?per_page=15&page=1')
            ->assertOk()
            ->assertJsonPath('meta.total', 1000);
        $firstPage = microtime(true) - $start;

        // Middle/last page — should be fast
        $start = microtime(true);
        $this->actingAs($user, 'sanctum')
            ->getJson('/api/v1/crm/customers?per_page=15&page=50')
            ->assertOk();
        $lastPage = microtime(true) - $start;

        $this->assertLessThan(1.0, $firstPage, 'First page too slow');
        $this->assertLessThan(1.0, $lastPage, 'Last page too slow');
    }
}
