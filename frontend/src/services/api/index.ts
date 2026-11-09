import { createApiCrud } from './api-crud';
import { apiFetch } from '@/lib/api-client';
import * as types from '@/types';
import { customerApiService } from './customers.api-service';

export { customerApiService as customerApi };
export const leadApi = createApiCrud<types.Lead>('/crm/leads');
export const invoiceApi = createApiCrud<types.Invoice>('/sales/invoices');
export const salesOrderApi = createApiCrud<types.SalesOrder>('/sales/orders');
export const supplierApi = createApiCrud<types.Supplier>('/purchases/suppliers');
export const purchaseOrderApi = createApiCrud<types.PurchaseOrder>('/purchases/orders');
export const productApi = createApiCrud<types.Product>('/inventory/products');
export const warehouseApi = createApiCrud<types.Warehouse>('/inventory/warehouses');
export const transactionApi = createApiCrud<types.Transaction>('/finance/transactions');
export const employeeApi = createApiCrud<types.Employee>('/hr/employees');
export const projectApi = createApiCrud<types.Project>('/projects');
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
