/* =========================================================================
 * MOCK SERVICE IMPLEMENTATIONS
 * Every method here simulates a REST endpoint.
 * API REPLACEMENT: see file-level comments for endpoints.
 * ========================================================================= */
import type { CrudService } from "@/types";
import * as types from "@/types";
import { mockStore, mockCrud } from "./store";

/* -------- CUSTOMERS (GET /api/v1/crm/customers) -------- */
export const customerMock: CrudService<types.Customer> = mockCrud("customers", "c") as any;

/* -------- LEADS (GET /api/v1/crm/leads) -------- */
export const leadMock: CrudService<types.Lead> = mockCrud("leads", "l") as any;

/* -------- INVOICES (GET /api/v1/sales/invoices) -------- */
export const invoiceMock: CrudService<types.Invoice> = mockCrud("invoices", "inv") as any;

/* -------- SALES ORDERS (GET /api/v1/sales/orders) -------- */
export const salesOrderMock: CrudService<types.SalesOrder> = mockCrud("salesOrders", "so") as any;

/* -------- SUPPLIERS (GET /api/v1/purchases/suppliers) -------- */
export const supplierMock: CrudService<types.Supplier> = mockCrud("suppliers", "s") as any;

/* -------- PURCHASE ORDERS (GET /api/v1/purchases/orders) -------- */
export const purchaseOrderMock: CrudService<types.PurchaseOrder> = mockCrud("purchaseOrders", "po") as any;

/* -------- PRODUCTS (GET /api/v1/inventory/products) -------- */
export const productMock: CrudService<types.Product> = mockCrud("products", "p") as any;

/* -------- WAREHOUSES (GET /api/v1/inventory/warehouses) -------- */
export const warehouseMock: CrudService<types.Warehouse> = mockCrud("warehouses", "wh") as any;

/* -------- TRANSACTIONS (GET /api/v1/finance/transactions) -------- */
export const transactionMock: CrudService<types.Transaction> = mockCrud("transactions", "t") as any;

/* -------- EMPLOYEES (GET /api/v1/hr/employees) -------- */
export const employeeMock: CrudService<types.Employee> = mockCrud("employees", "emp") as any;

/* -------- PROJECTS (GET /api/v1/projects) -------- */
export const projectMock: CrudService<types.Project> = mockCrud("projects", "prj") as any;

/* -------- NOTIFICATIONS -------- */
export const notificationMock: CrudService<types.Notification> = mockCrud("notifications", "n") as any;

/* -------- MODULES -------- */
/* MOCK CONFIG — API REPLACEMENT: GET /api/v1/modules */
export const moduleMock = {
  async getAll(): Promise<types.ModuleConfig[]> {
    return structuredClone(mockStore.modules);
  },
  async toggle(key: string): Promise<types.ModuleConfig[]> {
    const m = (mockStore.modules as types.ModuleConfig[]).find((x: types.ModuleConfig) => x.key === key);
    if (!m) return structuredClone(mockStore.modules);
    m.enabled = !m.enabled;
    return structuredClone(mockStore.modules);
  },
};

/* -------- DASHBOARD AGGREGATES (MOCK SERVICE — GET /api/v1/dashboard/overview) -------- */
export const dashboardMock = {
  async getStats() {
    const invoices = (mockStore.invoices || []) as any[];
    const revenue = invoices.filter((i: any) => i.status === "paid").reduce((s: number, i: any) => s + i.total, 0);
    const outstanding = invoices.filter((i: any) => i.status !== "paid" && i.status !== "draft").reduce((s: number, i: any) => s + (i.total - i.amountPaid), 0);
    const expenses = ((mockStore.transactions || []) as any[]).filter((t: any) => t.type === "expense").reduce((s: number, t: any) => s + t.amount, 0);
    return {
      revenue, outstanding, expenses, profit: revenue - expenses,
      customers: (mockStore.customers || []).length, employees: (mockStore.employees || []).length,
      activeProjects: ((mockStore.projects || []) as any[]).filter((p: any) => p.status === "active").length,
      lowStock: ((mockStore.products || []) as any[]).filter((p: any) => p.stock <= p.reorderLevel).length,
      inventoryValue: ((mockStore.products || []) as any[]).reduce((s: number, p: any) => s + p.stock * p.costPrice, 0),
    };
  },
  async getRevenueSeries() {
    /* MOCK DATA — hardcoded demo series */
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

