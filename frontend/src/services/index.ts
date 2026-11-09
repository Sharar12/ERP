/* =========================================================================
 * PUBLIC SERVICE FACADE
 * UI components import from HERE, never from mock-data directly.
 * Branches on DATA_PROVIDER ("mock" | "api") while preserving the same contract.
 * ========================================================================= */
import { DATA_PROVIDER } from "./config/data-provider";

// Mock Services
import {
  customerMock,
  leadMock,
  invoiceMock,
  salesOrderMock,
  supplierMock,
  purchaseOrderMock,
  productMock,
  warehouseMock,
  transactionMock,
  employeeMock,
  projectMock,
  notificationMock,
  moduleMock,
  dashboardMock,
} from "./mock";

// API Services
import {
  customerApi,
  leadApi,
  invoiceApi,
  salesOrderApi,
  supplierApi,
  purchaseOrderApi,
  productApi,
  warehouseApi,
  transactionApi,
  employeeApi,
  projectApi,
  notificationApi,
  moduleApi,
  dashboardApi,
} from "./api";

import * as apiAuth from "./api/auth.api-service";

const isApi = DATA_PROVIDER === "api";

export const customerService = isApi ? customerApi : customerMock;
export const leadService = isApi ? leadApi : leadMock;
export const invoiceService = isApi ? invoiceApi : invoiceMock;
export const salesOrderService = isApi ? salesOrderApi : salesOrderMock;
export const supplierService = isApi ? supplierApi : supplierMock;
export const purchaseOrderService = isApi ? purchaseOrderApi : purchaseOrderMock;
export const productService = isApi ? productApi : productMock;
export const warehouseService = isApi ? warehouseApi : warehouseMock;
export const transactionService = isApi ? transactionApi : transactionMock;
export const employeeService = isApi ? employeeApi : employeeMock;
export const projectService = isApi ? projectApi : projectMock;
export const notificationService = isApi ? notificationApi : notificationMock;
export const moduleService = isApi ? moduleApi : moduleMock;
export const dashboardService = isApi ? dashboardApi : dashboardMock;

export * from "./mock/extended";

export const authService = isApi
  ? apiAuth
  : {
      async login(email: string, _password: string) {
        return { user: { id: "u_001", email, name: "Sarah Chen", role: "Super Admin" }, token: "mock_token" };
      },
      async logout() { return; },
      async me() {
        return { id: "u_001", email: "sarah@acme.test", name: "Sarah Chen", role: "Super Admin" };
      },
    };
