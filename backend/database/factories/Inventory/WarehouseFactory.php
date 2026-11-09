<?php
namespace Database\Factories\Inventory;

use App\Models\Inventory\Warehouse;
use Illuminate\Database\Eloquent\Factories\Factory;

class WarehouseFactory extends Factory
{
    protected $model = Warehouse::class;

    public function definition(): array
    {
        return [
            'organization_id' => 1,
            'name' => fake()->city() . ' Central Warehouse',
            'code' => 'WH-' . fake()->unique()->numerify('###'),
            'address' => fake()->address(),
            'is_default' => false,
        ];
    }
}

