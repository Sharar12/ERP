<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\Auth\AuthController;
use App\Http\Controllers\Api\V1\Organization\OrganizationController;
use App\Http\Controllers\Api\V1\Auth\UserController;
use App\Http\Controllers\Api\V1\Auth\RoleController;
use App\Http\Controllers\Api\V1\Crm\{CustomerController, LeadController, ContactController, OpportunityController};
use App\Http\Controllers\Api\V1\Sales\{InvoiceController, SalesOrderController, QuotationController, PaymentController, SalesReturnController, SalesTargetController};
use App\Http\Controllers\Api\V1\Purchase\{SupplierController, PurchaseOrderController, GrnController, SupplierPaymentController, PurchaseRequestController, RfqController, PurchaseInvoiceController};
use App\Http\Controllers\Api\V1\Inventory\{ProductController, WarehouseController, StockMovementController, StockAdjustmentController, StockLevelController, StockTransferController, BatchController};
use App\Http\Controllers\Api\V1\Finance\{ChartOfAccountController, JournalEntryController, TransactionController, BankAccountController, BudgetController};
use App\Http\Controllers\Api\V1\Hr\{EmployeeController, AttendanceController, LeaveController, PayrollController, RecruitmentController, ShiftController, PerformanceReviewController};
use App\Http\Controllers\Api\V1\Project\{ProjectController, MilestoneController, TimeEntryController};
use App\Http\Controllers\Api\V1\Task\TaskController;
use App\Http\Controllers\Api\V1\Document\DocumentController;
use App\Http\Controllers\Api\V1\Manufacturing\{BomController, ManufacturingOrderController, WorkCenterController};
use App\Http\Controllers\Api\V1\Quality\{InspectionController, NcrController};
use App\Http\Controllers\Api\V1\Asset\{AssetController, AssetMaintenanceController};
use App\Http\Controllers\Api\V1\Helpdesk\{TicketController, KnowledgeBaseController};
use App\Http\Controllers\Api\V1\System\{NotificationController, ActivityLogController, ModuleController, ReportController, DashboardController, SearchController, AnnouncementController};
use App\Http\Controllers\Api\V1\Auth\LoginHistoryController;
use App\Http\Controllers\Api\V1\Organization\LocationController;
use App\Http\Controllers\Api\V1\HealthController;

Route::prefix('v1')->group(function () {

    // ── Public ─────────────────────────────────────────────
    Route::get('/health', [HealthController::class, 'show']);
    Route::post('/auth/login', [AuthController::class, 'login'])
        ->middleware('throttle:60,1');

    // ── Authenticated ─────────────────────────────────────
    Route::middleware(['auth:sanctum', 'org.access'])->group(function () {

        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        // Dashboard
        Route::get('/dashboard', [DashboardController::class, 'index']);
        Route::get('/search', [SearchController::class, 'search']);

        // Organization & Settings
        Route::get('/organization', [OrganizationController::class, 'show']);
        Route::patch('/organization', [OrganizationController::class, 'update'])
            ->middleware('permission:settings.update');
        Route::apiResource('/branches', OrganizationController::class)->except(['show']);
        Route::apiResource('/departments', \App\Http\Controllers\Api\V1\Organization\DepartmentController::class);
        Route::apiResource('/locations', LocationController::class);
        Route::get('/settings/organization', [OrganizationController::class, 'show']);
        Route::patch('/settings/organization', [OrganizationController::class, 'update']);
        Route::put('/settings/organization', [OrganizationController::class, 'update']);

        // Modules & Configuration
        Route::get('/modules', [ModuleController::class, 'index']);
        Route::patch('/modules/{module}/toggle', [ModuleController::class, 'toggle'])
            ->middleware('permission:settings.update');

        // RBAC
        Route::apiResource('/users', UserController::class);
        Route::patch('/users/{user}/status', [UserController::class, 'toggleStatus']);
        Route::apiResource('/roles', RoleController::class);
        Route::get('/permissions', [RoleController::class, 'permissions']);

        // ── CRM ───────────────────────────────────────────
        Route::prefix('crm')->group(function () {
            Route::apiResource('/customers', CustomerController::class);
            Route::apiResource('/leads', LeadController::class);
            Route::post('/leads/{lead}/convert', [LeadController::class, 'convert']);
            Route::apiResource('/contacts', ContactController::class);
            Route::apiResource('/opportunities', OpportunityController::class);
            Route::patch('/opportunities/{opportunity}/stage', [OpportunityController::class, 'moveStage']);
        });

        // ── Sales ─────────────────────────────────────────
        Route::prefix('sales')->group(function () {
            Route::apiResource('/invoices', InvoiceController::class);
            Route::post('/invoices/{invoice}/post', [InvoiceController::class, 'post']);
            Route::post('/invoices/{invoice}/payments', [PaymentController::class, 'store']);
            Route::apiResource('/orders', SalesOrderController::class);
            Route::post('/orders/{order}/confirm', [SalesOrderController::class, 'confirm']);
            Route::apiResource('/quotations', QuotationController::class);
            Route::post('/quotations/{quotation}/accept', [QuotationController::class, 'accept']);
            Route::apiResource('/returns', SalesReturnController::class);
            Route::apiResource('/payments', PaymentController::class)->only(['index', 'show']);
            Route::apiResource('/targets', SalesTargetController::class);
        });

        // ── Purchases ─────────────────────────────────────
        Route::prefix('purchases')->group(function () {
            Route::apiResource('/suppliers', SupplierController::class);
            Route::apiResource('/requests', PurchaseRequestController::class);
            Route::post('/requests/{request}/approve', [PurchaseRequestController::class, 'approve']);
            Route::apiResource('/rfqs', RfqController::class);
            Route::post('/rfqs/{rfq}/award', [RfqController::class, 'award']);
            Route::apiResource('/orders', PurchaseOrderController::class);
            Route::post('/orders/{order}/approve', [PurchaseOrderController::class, 'approve']);
            Route::apiResource('/grns', GrnController::class);
            Route::post('/grns/{grn}/receive', [GrnController::class, 'receive']);
            Route::apiResource('/invoices', PurchaseInvoiceController::class);
            Route::post('/invoices/{invoice}/post', [PurchaseInvoiceController::class, 'post']);
            Route::apiResource('/payments', SupplierPaymentController::class);
        });

        // ── Inventory ─────────────────────────────────────
        Route::prefix('inventory')->group(function () {
            Route::apiResource('/products', ProductController::class);
            Route::apiResource('/batches', BatchController::class);
            Route::apiResource('/warehouses', WarehouseController::class);
            Route::get('/levels', [StockLevelController::class, 'index']);
            Route::apiResource('/movements', StockMovementController::class)->only(['index', 'show']);
            Route::apiResource('/transfers', StockTransferController::class);
            Route::apiResource('/adjustments', StockAdjustmentController::class);
            Route::post('/adjustments/{adjustment}/apply', [StockAdjustmentController::class, 'apply']);
        });

        // ── Finance ───────────────────────────────────────
        Route::prefix('finance')->group(function () {
            Route::apiResource('/accounts', ChartOfAccountController::class);
            Route::apiResource('/journal', JournalEntryController::class);
            Route::post('/journal/{journal}/post', [JournalEntryController::class, 'post']);
            Route::apiResource('/transactions', TransactionController::class);
            Route::apiResource('/bank-accounts', BankAccountController::class);
            Route::apiResource('/budgets', BudgetController::class);
        });

        // ── HR ────────────────────────────────────────────
        Route::prefix('hr')->group(function () {
            Route::apiResource('/employees', EmployeeController::class);
            Route::apiResource('/attendance', AttendanceController::class);
            Route::apiResource('/leaves', LeaveController::class);
            Route::patch('/leaves/{leave}/approve', [LeaveController::class, 'approve']);
            Route::patch('/leaves/{leave}/reject',  [LeaveController::class, 'reject']);
            Route::apiResource('/shifts', ShiftController::class);
            Route::apiResource('/reviews', PerformanceReviewController::class);
            Route::get('/payroll', [PayrollController::class, 'index']);
            Route::apiResource('/payrolls', PayrollController::class);
            Route::post('/payroll/generate', [PayrollController::class, 'generate']);
            Route::get('/payroll/{run}', [PayrollController::class, 'show']);
            Route::post('/payroll/{run}/approve', [PayrollController::class, 'approve']);
            Route::post('/payroll/{run}/pay', [PayrollController::class, 'pay']);
            Route::apiResource('/recruitment', RecruitmentController::class);
        });

        // ── Projects & Tasks ─────────────────────────────
        Route::apiResource('/projects', ProjectController::class);
        Route::apiResource('/projects/{project}/milestones', MilestoneController::class);
        Route::apiResource('/projects/time-entries', TimeEntryController::class);
        Route::apiResource('/tasks', TaskController::class);
        Route::patch('/tasks/{task}/move-status', [TaskController::class, 'moveStatus']);
        Route::post('/tasks/reorder', [TaskController::class, 'reorder']);

        // ── Documents ────────────────────────────────────
        Route::apiResource('/documents', DocumentController::class);

        // ── Manufacturing ────────────────────────────────
        Route::prefix('manufacturing')->group(function () {
            Route::apiResource('/boms', BomController::class);
            Route::apiResource('/orders', ManufacturingOrderController::class);
            Route::apiResource('/work-centers', WorkCenterController::class);
        });

        // ── Quality ──────────────────────────────────────
        Route::prefix('quality')->group(function () {
            Route::apiResource('/inspections', InspectionController::class);
            Route::apiResource('/ncrs', NcrController::class);
        });

        // ── Assets ───────────────────────────────────────
        Route::prefix('assets')->group(function () {
            Route::apiResource('/maintenance', AssetMaintenanceController::class);
        });
        Route::apiResource('/assets', AssetController::class);

        // ── Helpdesk ─────────────────────────────────────
        Route::apiResource('/tickets', TicketController::class);
        Route::apiResource('/helpdesk/kb', KnowledgeBaseController::class);

        // ── System ───────────────────────────────────────
        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markRead']);
        Route::patch('/notifications/read-all', [NotificationController::class, 'markAllRead']);
        Route::get('/activity', [ActivityLogController::class, 'index']);
        Route::get('/login-history', [LoginHistoryController::class, 'index']);
        Route::apiResource('/announcements', AnnouncementController::class);
        Route::get('/reports', [ReportController::class, 'catalogue']);
        Route::post('/reports/build', [ReportController::class, 'build']);
    });
});
