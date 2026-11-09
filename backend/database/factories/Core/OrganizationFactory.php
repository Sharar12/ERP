<?php
namespace Database\Factories\Core;

use App\Models\Core\Organization;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrganizationFactory extends Factory
{
    protected $model = Organization::class;

    public function definition(): array
    {
        $name = fake()->company();
        return [
            'name' => $name,
            'slug' => \Str::slug($name) . '-' . fake()->unique()->numberBetween(1, 9999),
            'legal_name' => $name . ' ' . fake()->companySuffix(),
            'email' => fake()->companyEmail(),
            'phone' => fake()->phoneNumber(),
            'address' => fake()->streetAddress(),
            'city' => fake()->city(),
            'country' => fake()->countryCode(),
            'currency' => 'USD',
            'timezone' => 'UTC',
            'locale' => 'en',
            'industry' => fake()->randomElement(['manufacturing','retail','software','healthcare']),
            'status' => 'active',
        ];
    }
}
