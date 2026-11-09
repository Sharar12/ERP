<?php
namespace Database\Factories\Sales;

use App\Models\Sales\Invoice;
use App\Models\Crm\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

class InvoiceFactory extends Factory
{
    protected $model = Invoice::class;

    public function definition(): array
    {
        $subtotal = fake()->randomFloat(2, 500, 50000);
        $taxTotal = round($subtotal * 0.10, 2);
        $total = $subtotal + $taxTotal;

        return [
            'number' => 'INV-' . fake()->unique()->numerify('#####'),
            'customer_id' => Customer::inRandomOrder()->value('id'),
            'issue_date' => fake()->dateTimeBetween('-3 months')->format('Y-m-d'),
            'due_date' => fake()->dateTimeBetween('now', '+1 month')->format('Y-m-d'),
            'subtotal' => $subtotal,
            'discount_total' => 0,
            'tax_total' => $taxTotal,
            'total' => $total,
            'amount_paid' => 0,
            'balance_due' => $total,
            'status' => 'sent',
        ];
    }
}
