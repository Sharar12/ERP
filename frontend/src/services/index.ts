/* =========================================================================
 * PUBLIC SERVICE FACADE
 * UI components import from HERE. All services connect directly to the
 * real backend Laravel REST API endpoints (/api/v1/*).
 * ========================================================================= */
import * as api from './api';
import * as apiAuth from './api/auth.api-service';

export const customerService = api.customerApi;
export const leadService = api.leadApi;
export const contactService = api.contactApi;
export const opportunityService = api.opportunityApi;

export const invoiceService = api.invoiceApi;
export const salesOrderService = api.salesOrderApi;
export const quotationService = api.quotationApi;
export const salesReturnService = api.salesReturnApi;
export const customerPaymentService = api.customerPaymentApi;
export const salesTargetService = api.salesTargetApi;

export const supplierService = api.supplierApi;
export const purchaseOrderService = api.purchaseOrderApi;
export const purchaseRequestService = api.purchaseRequestApi;
export const rfqService = api.rfqApi;
export const grnService = api.grnApi;
export const supplierPaymentService = api.supplierPaymentApi;

export const productService = api.productApi;
export const warehouseService = api.warehouseApi;
export const stockTransferService = api.stockTransferApi;
export const stockAdjustmentService = api.stockAdjustmentApi;
export const stockMovementService = api.stockMovementApi;
export const batchService = api.batchApi;

export const transactionService = api.transactionApi;
export const coaService = api.coaApi;
export const journalService = api.journalApi;
export const bankAccountService = api.bankAccountApi;
export const budgetService = api.budgetApi;

export const employeeService = api.employeeApi;
export const attendanceService = api.attendanceApi;
export const leaveService = api.leaveApi;
export const shiftService = api.shiftApi;
export const payrollService = api.payrollApi;
export const jobService = api.jobApi;
export const reviewService = api.reviewApi;

export const projectService = api.projectApi;
export const milestoneService = api.milestoneApi;
export const timeEntryService = api.timeEntryApi;
export const taskService = api.taskApi;

export const documentService = api.documentApi;

export const bomService = api.bomApi;
export const mfgOrderService = api.mfgOrderApi;
export const workCenterService = api.workCenterApi;

export const inspectionService = api.inspectionApi;
export const ncrService = api.ncrApi;

export const assetService = api.assetApi;
export const assetMaintenanceService = api.assetMaintenanceApi;

export const ticketService = api.ticketApi;
export const kbService = api.kbApi;

export const announcementService = api.announcementApi;
export const activityService = api.activityApi;
export const departmentService = api.departmentApi;
export const locationService = api.locationApi;
export const loginHistoryService = api.loginHistoryApi;

export const userService = api.userApi;
export const roleService = api.roleApi;
export const organizationService = api.organizationApi;

export const notificationService = api.notificationApi;
export const moduleService = api.moduleApi;
export const dashboardService = api.dashboardApi;

export const authService = apiAuth;
