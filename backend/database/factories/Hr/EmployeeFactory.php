<?php
namespace Database\Factories\Hr;

use App\Models\Hr\Employee;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmployeeFactory extends Factory
{
    protected $model = Employee::class;

    public function definition(): array
    {
        return [
            'employee_number' => 'EMP-' . fake()->unique()->numerify('####'),
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'joining_date' => fake()->dateTimeBetween('-3 years')->format('Y-m-d'),
            'employment_type' => 'full_time',
            'base_salary' => fake()->numberBetween(3000, 15000),
            'status' => 'active',
        ];
    }
}
