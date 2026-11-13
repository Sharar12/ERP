<?php
namespace App\Providers;

use App\Models\Auth\User;
use App\Models\Crm\Customer;
use App\Models\Purchase\PurchaseOrder;
use App\Models\Purchase\GoodsReceivedNote;
use App\Models\Sales\Invoice;
use App\Models\Hr\Leave;
use App\Models\Task\Task;
use App\Policies\CustomerPolicy;
use App\Policies\PurchaseOrderPolicy;
use App\Policies\GoodsReceivedNotePolicy;
use App\Policies\InvoicePolicy;
use App\Policies\LeavePolicy;
use App\Policies\TaskPolicy;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        RateLimiter::for('api', function (Request $request) {
            // Generous limit for ERP dashboard batch requests
            return Limit::perMinute(1000)->by($request->user()?->id ?: $request->ip());
        });

        // Super-admin bypasses every Gate check
        Gate::before(function (User $user, string $ability) {
            return $user->roles()->where('slug', 'super-admin')->exists() ? true : null;
        });

        Gate::policy(Customer::class, CustomerPolicy::class);
        Gate::policy(PurchaseOrder::class, PurchaseOrderPolicy::class);
        Gate::policy(GoodsReceivedNote::class, GoodsReceivedNotePolicy::class);
        Gate::policy(Invoice::class, InvoicePolicy::class);
        Gate::policy(Leave::class, LeavePolicy::class);
        Gate::policy(Task::class, TaskPolicy::class);
    }
}
