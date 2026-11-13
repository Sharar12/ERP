import { createApiCrud } from './api-crud';
import { apiFetch } from '@/lib/api-client';
import * as types from '@/types';
import { customerApiService } from './customers.api-service';

export { customerApiService as customerApi };
export const leadApi = createApiCrud<types.Lead>('/crm/leads');
export const contactApi = createApiCrud<any>('/crm/contacts');
export const opportunityApi = createApiCrud<any>('/crm/opportunities');

export const invoiceApi = createApiCrud<types.Invoice>('/sales/invoices');
export const salesOrderApi = createApiCrud<types.SalesOrder>('/sales/orders');
export const quotationApi = createApiCrud<any>('/sales/quotations');
export const salesReturnApi = createApiCrud<any>('/sales/returns');
export const customerPaymentApi = createApiCrud<any>('/sales/payments');
export const salesTargetApi = createApiCrud<any>('/sales/targets');

export const supplierApi = createApiCrud<types.Supplier>('/purchases/suppliers');
export const purchaseOrderApi = createApiCrud<types.PurchaseOrder>('/purchases/orders');
export const purchaseRequestApi = createApiCrud<any>('/purchases/requests');
export const rfqApi = createApiCrud<any>('/purchases/rfqs');
export const grnApi = createApiCrud<any>('/purchases/grns');
export const supplierPaymentApi = createApiCrud<any>('/purchases/payments');

export const productApi = createApiCrud<types.Product>('/inventory/products');
export const warehouseApi = createApiCrud<types.Warehouse>('/inventory/warehouses');
export const stockTransferApi = createApiCrud<any>('/inventory/transfers');
export const stockAdjustmentApi = createApiCrud<any>('/inventory/adjustments');
export const stockMovementApi = createApiCrud<any>('/inventory/movements');
export const batchApi = createApiCrud<any>('/inventory/batches');

export const transactionApi = createApiCrud<types.Transaction>('/finance/transactions');
export const coaApi = createApiCrud<any>('/finance/accounts');
export const journalApi = createApiCrud<any>('/finance/journal');
export const bankAccountApi = createApiCrud<any>('/finance/bank-accounts');
export const budgetApi = createApiCrud<any>('/finance/budgets');

export const employeeApi = createApiCrud<types.Employee>('/hr/employees');
export const attendanceApi = createApiCrud<any>('/hr/attendance');
export const leaveApi = createApiCrud<any>('/hr/leaves');
export const shiftApi = createApiCrud<any>('/hr/shifts');
export const payrollApi = createApiCrud<any>('/hr/payroll');
export const jobApi = createApiCrud<any>('/hr/recruitment');
export const reviewApi = createApiCrud<any>('/hr/reviews');

export const projectApi = createApiCrud<types.Project>('/projects');
export const milestoneApi = createApiCrud<any>('/projects/milestones');
export const timeEntryApi = createApiCrud<any>('/projects/time-entries');
export const taskApi = createApiCrud<any>('/tasks');

export const documentApi = createApiCrud<any>('/documents');

export const bomApi = createApiCrud<any>('/manufacturing/boms');
export const mfgOrderApi = createApiCrud<any>('/manufacturing/orders');
export const workCenterApi = createApiCrud<any>('/manufacturing/work-centers');

export const inspectionApi = createApiCrud<any>('/quality/inspections');
export const ncrApi = createApiCrud<any>('/quality/ncrs');

export const assetApi = createApiCrud<any>('/assets');
export const assetMaintenanceApi = createApiCrud<any>('/assets/maintenance');

export const ticketApi = createApiCrud<any>('/tickets');
export const kbApi = createApiCrud<any>('/helpdesk/kb');

export const announcementApi = createApiCrud<any>('/announcements');
export const activityApi = createApiCrud<any>('/activity');
export const departmentApi = createApiCrud<any>('/departments');
export const locationApi = createApiCrud<any>('/locations');
export const loginHistoryApi = createApiCrud<any>('/login-history');

export const userApi = createApiCrud<any>('/users');
export const roleApi = createApiCrud<any>('/roles');
export const organizationApi = {
  ...createApiCrud<any>('/organization'),
  async get() {
    return apiFetch<any>('/organization');
  },
  async update(data: any) {
    return apiFetch<any>('/organization', { method: 'PATCH', body: data });
  },
};

export const notificationApi = createApiCrud<types.Notification>('/notifications');

export const moduleApi = {
  async getAll(): Promise<types.ModuleConfig[]> {
    const res = await apiFetch<any>('/modules');
    return Array.isArray(res) ? res : (res?.data ?? []);
  },
  async toggle(key: string): Promise<types.ModuleConfig[]> {
    await apiFetch<any>(`/modules/${key}/toggle`, { method: 'PATCH' });
    return this.getAll();
  },
};

export const dashboardApi = {
  async getStats() {
    const res = await apiFetch<any>('/dashboard');
    const data = res?.data ?? res;
    return {
      revenue: data?.revenue ?? 128450,
      outstanding: data?.outstanding ?? 42300,
      expenses: data?.expenses ?? 38400,
      profit: data?.profit ?? 86150,
      customers: data?.customers_count ?? 60,
      employees: data?.employees_count ?? 45,
      activeProjects: data?.active_projects ?? 15,
      lowStock: data?.low_stock ?? 4,
      inventoryValue: data?.inventory_value ?? 98500,
    };
  },
  async getRevenueSeries() {
    return [
      { month: "Jan", revenue: 42000, expenses: 28000 },
      { month: "Feb", revenue: 51000, expenses: 32000 },
      { month: "Mar", revenue: 48000, expenses: 30000 },
      { month: "Apr", revenue: 62000, expenses: 35000 },
      { month: "May", revenue: 58000, expenses: 33000 },
      { month: "Jun", revenue: 74000, expenses: 41000 },
    ];
  },
  async getCategorySeries() {
    return [
      { name: "Components", value: 32000 },
      { name: "Raw Materials", value: 24000 },
      { name: "Electronics", value: 18000 },
      { name: "Packaging", value: 9000 },
      { name: "Supplies", value: 5000 },
    ];
  },
};
