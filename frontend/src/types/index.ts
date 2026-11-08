/* =========================================================================
 * UNIVERSAL ERP — SHARED ENTITY TYPES
 * These interfaces are consumed by BOTH mock and API service implementations.
 * The UI must never depend on mock data structures directly.
 * ========================================================================= */

export type ID = string;
export type ISODate = string;

export interface BaseEntity {
  id: ID;
  createdAt: ISODate;
  updatedAt: ISODate;
}

export interface Organization extends BaseEntity {
  name: string;
  slug: string;
  industry: string;
  logoUrl?: string;
  currency: string;
  fiscalYearStart: string;
  taxRate: number;
  address: string;
  phone: string;
  email: string;
  enabledModules: string[];
}

export interface Branch extends BaseEntity {
  organizationId: ID;
  name: string;
  code: string;
  address: string;
  phone: string;
  isHeadOffice: boolean;
}

export interface Role extends BaseEntity {
  name: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
}

export interface User extends BaseEntity {
  name: string;
  email: string;
  avatarUrl?: string;
  roleId: ID;
  organizationId: ID;
  status: "active" | "inactive" | "invited";
  phone?: string;
}

export type CustomerStatus = "active" | "inactive" | "lead";
export interface Customer extends BaseEntity {
  name: string;
  email: string;
  phone: string;
  company?: string;
  group: string;
  status: CustomerStatus;
  address: string;
  ownerId: ID;
  organizationId: ID;
  totalRevenue: number;
}

export type LeadStatus = "new" | "contacted" | "qualified" | "proposal" | "won" | "lost";
export interface Lead extends BaseEntity {
  name: string;
  company: string;
  email: string;
  phone: string;
  value: number;
  status: LeadStatus;
  source: string;
  ownerId: ID;
}

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "void";
export interface InvoiceLine {
  id: ID;
  productName: string;
  quantity: number;
  unitPrice: number;
}
export interface Invoice extends BaseEntity {
  number: string;
  customerId: ID;
  customerName: string;
  issueDate: ISODate;
  dueDate: ISODate;
  status: InvoiceStatus;
  lines: InvoiceLine[];
  subtotal: number;
  tax: number;
  total: number;
  amountPaid: number;
}

export type SalesOrderStatus = "draft" | "confirmed" | "fulfilled" | "cancelled";
export interface SalesOrder extends BaseEntity {
  number: string;
  customerId: ID;
  customerName: string;
  orderDate: ISODate;
  status: SalesOrderStatus;
  total: number;
}

export interface Supplier extends BaseEntity {
  name: string;
  email: string;
  phone: string;
  contactPerson: string;
  address: string;
  category: string;
  status: "active" | "inactive";
}

export type PurchaseOrderStatus = "draft" | "pending" | "approved" | "received" | "cancelled";
export interface PurchaseOrder extends BaseEntity {
  number: string;
  supplierId: ID;
  supplierName: string;
  orderDate: ISODate;
  status: PurchaseOrderStatus;
  total: number;
}

export interface Product extends BaseEntity {
  sku: string;
  name: string;
  category: string;
  unit: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  reorderLevel: number;
  warehouseId: ID;
  status: "active" | "discontinued";
}

export interface Warehouse extends BaseEntity {
  name: string;
  code: string;
  location: string;
  managerId: ID;
  capacity: number;
  utilization: number;
}

export type TransactionType = "income" | "expense" | "transfer";
export interface Transaction extends BaseEntity {
  reference: string;
  date: ISODate;
  description: string;
  type: TransactionType;
  category: string;
  amount: number;
  account: string;
}

export type EmployeeStatus = "active" | "on_leave" | "terminated";
export interface Employee extends BaseEntity {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joinDate: ISODate;
  salary: number;
  status: EmployeeStatus;
  avatarUrl?: string;
}

export type ProjectStatus = "planning" | "active" | "on_hold" | "completed" | "cancelled";
export interface Project extends BaseEntity {
  name: string;
  code: string;
  clientId: ID;
  clientName: string;
  managerId: ID;
  status: ProjectStatus;
  startDate: ISODate;
  endDate: ISODate;
  budget: number;
  spent: number;
  progress: number;
}

export interface Notification extends BaseEntity {
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  link?: string;
}

export interface ModuleConfig {
  key: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  enabled: boolean;
  dependencies: string[];
  defaultEnabled: boolean;
}

/* =========================================================================
 * GENERIC SERVICE CONTRACT
 * Both MockServiceImpl and ApiServiceImpl must satisfy this shape.
 * ========================================================================= */
export interface CrudService<T, C = Partial<T>, U = Partial<T>> {
  getAll(): Promise<T[]>;
  getById(id: ID): Promise<T | null>;
  create(data: C): Promise<T>;
  update(id: ID, data: U): Promise<T>;
  delete(id: ID): Promise<void>;
}

