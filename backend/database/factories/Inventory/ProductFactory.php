<?php
namespace Database\Factories\Inventory;

use App\Models\Inventory\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    public function definition(): array
    {
        $cost = fake()->randomFloat(2, 10, 500);
        return [
            'sku' => 'SKU-' . fake()->unique()->numerify('######'),
            'name' => fake()->words(3, true),
            'type' => 'product',
            'cost_price' => $cost,
            'selling_price' => round($cost * 1.4, 2),
            'tax_percent' => 10,
            'reorder_level' => 10,
            'track_stock' => true,
            'status' => 'active',
        ];
    }
}
