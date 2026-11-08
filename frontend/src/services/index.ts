/* =========================================================================
 * PUBLIC SERVICE FACADE
 * UI components import from HERE, never from mock-data directly.
 * During Phase 3, swap the imports below to the api/* implementations.
 * ========================================================================= */
export {
  customerMock as customerService,
  leadMock as leadService,
  invoiceMock as invoiceService,
  salesOrderMock as salesOrderService,
  supplierMock as supplierService,
  purchaseOrderMock as purchaseOrderService,
  productMock as productService,
  warehouseMock as warehouseService,
  transactionMock as transactionService,
  employeeMock as employeeService,
  projectMock as projectService,
  notificationMock as notificationService,
  moduleMock as moduleService,
  dashboardMock as dashboardService,
} from "./mock";

export * from "./mock/extended";

/* MOCK DATA — Auth is faked in Phase 1. Phase 3 replaces with Laravel Sanctum. */
export const authService = {
  async login(email: string, _password: string) {
    return { id: "u_001", email, name: "Sarah Chen", role: "Super Admin" };
  },
  async logout() { return; },
};
