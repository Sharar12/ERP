<?php
namespace Database\Factories\Crm;

use App\Models\Crm\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

class CustomerFactory extends Factory
{
    protected $model = Customer::class;

    public function definition(): array
    {
        return [
            'code' => 'CUST-' . fake()->unique()->numerify('#####'),
            'name' => fake()->company(),
            'email' => fake()->companyEmail(),
            'phone' => fake()->phoneNumber(),
            'billing_address' => fake()->address(),
            'credit_limit' => fake()->numberBetween(1000, 100000),
            'status' => fake()->randomElement(['active','active','active','inactive']),
        ];
    }
}
