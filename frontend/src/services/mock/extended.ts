/* MOCK SERVICE IMPLEMENTATIONS — extended entities.
 * Each adds a mockCrud-driven service backed by in-memory store. */
import * as ext from "@/mock-data/extended-seed";
import { mockCrud, mockStore } from "./store";

type AnyRecord = { id: string; createdAt: string; updatedAt: string };

function ensure<K extends string, T extends AnyRecord>(key: K, arr: T[]) {
  if (!mockStore[key]) mockStore[key] = structuredClone(arr);
}

ensure("contacts", ext.MOCK_CONTACTS);
ensure("opportunities", ext.MOCK_OPPORTUNITIES);
ensure("quotations", ext.MOCK_QUOTATIONS);
ensure("salesReturns", ext.MOCK_SALES_RETURNS);
ensure("customerPayments", ext.MOCK_CUSTOMER_PAYMENTS);
ensure("salesTargets", ext.MOCK_SALES_TARGETS);
ensure("purchaseRequests", ext.MOCK_PURCHASE_REQUESTS);
ensure("rfqs", ext.MOCK_RFQS);
ensure("grns", ext.MOCK_GRNS);
ensure("supplierPayments", ext.MOCK_SUPPLIER_PAYMENTS);
ensure("stockTransfers", ext.MOCK_STOCK_TRANSFERS);
ensure("stockAdjustments", ext.MOCK_STOCK_ADJUSTMENTS);
ensure("stockMovements", ext.MOCK_STOCK_MOVEMENTS);
ensure("batches", ext.MOCK_BATCHES);
ensure("coa", ext.MOCK_COA);
ensure("journal", ext.MOCK_JOURNAL);
ensure("bankAccounts", ext.MOCK_BANK_ACCOUNTS);
ensure("budgets", ext.MOCK_BUDGETS);
ensure("attendance", ext.MOCK_ATTENDANCE);
ensure("leaves", ext.MOCK_LEAVES);
ensure("shifts", ext.MOCK_SHIFTS);
ensure("payroll", ext.MOCK_PAYROLL);
ensure("jobs", ext.MOCK_JOBS);
ensure("reviews", ext.MOCK_REVIEWS);
ensure("tasks", ext.MOCK_TASKS);
ensure("milestones", ext.MOCK_MILESTONES);
ensure("timeEntries", ext.MOCK_TIME_ENTRIES);
ensure("documents", ext.MOCK_DOCUMENTS);
ensure("boms", ext.MOCK_BOMS);
ensure("mfgOrders", ext.MOCK_MFG_ORDERS);
ensure("workCenters", ext.MOCK_WORK_CENTERS);
ensure("inspections", ext.MOCK_INSPECTIONS);
ensure("ncrs", ext.MOCK_NCRS);
ensure("assets", ext.MOCK_ASSETS);
ensure("assetMaintenance", ext.MOCK_ASSET_MAINTENANCE);
ensure("tickets", ext.MOCK_TICKETS);
ensure("kb", ext.MOCK_KB);
ensure("announcements", ext.MOCK_ANNOUNCEMENTS);
ensure("activity", ext.MOCK_ACTIVITY);
ensure("departments", ext.MOCK_DEPARTMENTS);
ensure("locations", ext.MOCK_LOCATIONS);
ensure("loginHistory", ext.MOCK_LOGIN_HISTORY);

export const contactService = mockCrud<any>("contacts", "ct");
export const opportunityService = mockCrud<any>("opportunities", "opp");
export const quotationService = mockCrud<any>("quotations", "q");
export const salesReturnService = mockCrud<any>("salesReturns", "sr");
export const customerPaymentService = mockCrud<any>("customerPayments", "cp");
export const salesTargetService = mockCrud<any>("salesTargets", "tgt");
export const purchaseRequestService = mockCrud<any>("purchaseRequests", "pr");
export const rfqService = mockCrud<any>("rfqs", "rfq");
export const grnService = mockCrud<any>("grns", "grn");
export const supplierPaymentService = mockCrud<any>("supplierPayments", "sp");
export const stockTransferService = mockCrud<any>("stockTransfers", "st");
export const stockAdjustmentService = mockCrud<any>("stockAdjustments", "adj");
export const stockMovementService = mockCrud<any>("stockMovements", "sm");
export const batchService = mockCrud<any>("batches", "batch");
export const coaService = mockCrud<any>("coa", "acct");
export const journalService = mockCrud<any>("journal", "je");
export const bankAccountService = mockCrud<any>("bankAccounts", "bank");
export const budgetService = mockCrud<any>("budgets", "bud");
export const attendanceService = mockCrud<any>("attendance", "att");
export const leaveService = mockCrud<any>("leaves", "lv");
export const shiftService = mockCrud<any>("shifts", "shift");
export const payrollService = mockCrud<any>("payroll", "pay");
export const jobService = mockCrud<any>("jobs", "job");
export const reviewService = mockCrud<any>("reviews", "rev");
export const taskService = mockCrud<any>("tasks", "task");
export const milestoneService = mockCrud<any>("milestones", "ms");
export const timeEntryService = mockCrud<any>("timeEntries", "te");
export const documentService = mockCrud<any>("documents", "doc");
export const bomService = mockCrud<any>("boms", "bom");
export const mfgOrderService = mockCrud<any>("mfgOrders", "mo");
export const workCenterService = mockCrud<any>("workCenters", "wc");
export const inspectionService = mockCrud<any>("inspections", "qi");
export const ncrService = mockCrud<any>("ncrs", "ncr");
export const assetService = mockCrud<any>("assets", "asset");
export const assetMaintenanceService = mockCrud<any>("assetMaintenance", "maint");
export const ticketService = mockCrud<any>("tickets", "tkt");
export const kbService = mockCrud<any>("kb", "kb");
export const announcementService = mockCrud<any>("announcements", "ann");
export const activityService = mockCrud<any>("activity", "act");
export const departmentService = mockCrud<any>("departments", "dept");
export const locationService = mockCrud<any>("locations", "loc");
export const loginHistoryService = mockCrud<any>("loginHistory", "lh");

export const extendedServices = {
  contactService,
  opportunityService,
  quotationService,
  salesReturnService,
  customerPaymentService,
  salesTargetService,
  purchaseRequestService,
  rfqService,
  grnService,
  supplierPaymentService,
  stockTransferService,
  stockAdjustmentService,
  stockMovementService,
  batchService,
  coaService,
  journalService,
  bankAccountService,
  budgetService,
  attendanceService,
  leaveService,
  shiftService,
  payrollService,
  jobService,
  reviewService,
  taskService,
  milestoneService,
  timeEntryService,
  documentService,
  bomService,
  mfgOrderService,
  workCenterService,
  inspectionService,
  ncrService,
  assetService,
  assetMaintenanceService,
  ticketService,
  kbService,
  announcementService,
  activityService,
  departmentService,
  locationService,
  loginHistoryService,
};

