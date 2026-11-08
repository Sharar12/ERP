/* MOCK DATA — extended seed for Phase 1 completion.
 * Each section maps to a real endpoint. Related records reference existing IDs. */
import { uid } from "@/lib/utils";
const now = () => new Date().toISOString();

const base = (id: string) => ({ id, createdAt: now(), updatedAt: now() });

/* ------- CONTACTS ------- */
export const MOCK_CONTACTS = [
  { name: "Alice Monroe", email: "alice@northwind.example", phone: "+1 555 5001", company: "Northwind Traders", title: "Procurement Manager", customerId: "c_001" },
  { name: "Bob Smith", email: "bob@globex.example", phone: "+1 555 5002", company: "Globex Corporation", title: "CTO", customerId: "c_002" },
  { name: "Carol Danvers", email: "carol@umbrella.example", phone: "+1 555 5003", company: "Umbrella Health", title: "Head of Ops", customerId: "c_005" },
].map((c, i) => ({ ...base(`ct_${i + 1}`), ...c }));

/* ------- OPPORTUNITIES ------- */
export const MOCK_OPPORTUNITIES = [
  { title: "Northwind Q3 expansion", customerId: "c_001", customerName: "Northwind Traders", value: 62000, stage: "proposal", probability: 60, closeDate: "2024-08-15", ownerId: "u_003" },
  { title: "Globex ERP rollout", customerId: "c_002", customerName: "Globex Corporation", value: 145000, stage: "negotiation", probability: 80, closeDate: "2024-07-30", ownerId: "u_002" },
  { title: "Umbrella Health deal", customerId: "c_005", customerName: "Umbrella Health", value: 48000, stage: "qualified", probability: 40, closeDate: "2024-09-10", ownerId: "u_003" },
].map((o, i) => ({ ...base(`opp_${i + 1}`), ...o }));

/* ------- QUOTATIONS ------- */
export const MOCK_QUOTATIONS = [
  { number: "Q-2401", customerId: "c_001", customerName: "Northwind Traders", date: "2024-06-01", expiry: "2024-07-01", total: 12400, status: "accepted" },
  { number: "Q-2402", customerId: "c_002", customerName: "Globex Corporation", date: "2024-06-04", expiry: "2024-07-04", total: 28600, status: "sent" },
  { number: "Q-2403", customerId: "c_006", customerName: "Stark Industries", date: "2024-06-10", expiry: "2024-07-10", total: 45000, status: "draft" },
].map((q, i) => ({ ...base(`q_${i + 1}`), ...q }));

/* ------- SALES RETURNS ------- */
export const MOCK_SALES_RETURNS = [
  { number: "SR-1001", customerId: "c_003", customerName: "Soylent Foods", date: "2024-06-03", total: 1400, reason: "Damaged goods", status: "approved" },
  { number: "SR-1002", customerId: "c_009", customerName: "Tyrell Bio", date: "2024-06-16", total: 980, reason: "Wrong item", status: "pending" },
].map((r, i) => ({ ...base(`sr_${i + 1}`), ...r }));

/* ------- CUSTOMER PAYMENTS ------- */
export const MOCK_CUSTOMER_PAYMENTS = [
  { number: "CP-5001", customerId: "c_001", customerName: "Northwind Traders", invoiceNumber: "INV-2024-001", date: "2024-06-02", amount: 13640, method: "Bank Transfer", status: "completed" },
  { number: "CP-5002", customerId: "c_005", customerName: "Umbrella Health", invoiceNumber: "INV-2024-004", date: "2024-06-12", amount: 21120, method: "Bank Transfer", status: "completed" },
  { number: "CP-5003", customerId: "c_011", customerName: "Oscorp Labs", invoiceNumber: "INV-2024-008", date: "2024-06-19", amount: 5610, method: "Credit Card", status: "completed" },
].map((p, i) => ({ ...base(`cp_${i + 1}`), ...p }));

/* ------- SALES REPRESENTATIVES & TARGETS ------- */
export const MOCK_SALES_TARGETS = [
  { repId: "u_003", repName: "Priya Raman", period: "Q2 2024", target: 250000, achieved: 184000 },
  { repId: "u_002", repName: "Michael Osei", period: "Q2 2024", target: 200000, achieved: 212000 },
].map((t, i) => ({ ...base(`tgt_${i + 1}`), ...t }));

/* ------- PURCHASE REQUESTS ------- */
export const MOCK_PURCHASE_REQUESTS = [
  { number: "PR-3001", requestedBy: "Tom Reyes", department: "Operations", date: "2024-06-01", items: 4, total: 8400, status: "approved" },
  { number: "PR-3002", requestedBy: "Nina Ito", department: "Engineering", date: "2024-06-08", items: 2, total: 3200, status: "pending" },
].map((p, i) => ({ ...base(`pr_${i + 1}`), ...p }));

/* ------- RFQs ------- */
export const MOCK_RFQS = [
  { number: "RFQ-4001", supplierId: "s_001", supplierName: "Apex Materials", date: "2024-06-02", responses: 3, status: "closed" },
  { number: "RFQ-4002", supplierId: "s_002", supplierName: "Meridian Components", date: "2024-06-10", responses: 1, status: "open" },
].map((r, i) => ({ ...base(`rfq_${i + 1}`), ...r }));

/* ------- GRNs ------- */
export const MOCK_GRNS = [
  { number: "GRN-6001", supplierId: "s_001", supplierName: "Apex Materials", date: "2024-06-05", poNumber: "PO-1001", items: 12, received: true },
  { number: "GRN-6002", supplierId: "s_002", supplierName: "Meridian Components", date: "2024-06-12", poNumber: "PO-1002", items: 6, received: false },
].map((g, i) => ({ ...base(`grn_${i + 1}`), ...g }));

/* ------- SUPPLIER PAYMENTS ------- */
export const MOCK_SUPPLIER_PAYMENTS = [
  { number: "SP-7001", supplierId: "s_001", supplierName: "Apex Materials", date: "2024-06-06", amount: 18400, method: "Wire", status: "completed" },
  { number: "SP-7002", supplierId: "s_002", supplierName: "Meridian Components", date: "2024-06-14", amount: 9200, method: "ACH", status: "pending" },
].map((s, i) => ({ ...base(`sp_${i + 1}`), ...s }));

/* ------- STOCK TRANSFERS ------- */
export const MOCK_STOCK_TRANSFERS = [
  { number: "ST-8001", fromWarehouse: "wh_001", toWarehouse: "wh_002", date: "2024-06-05", items: 3, status: "received" },
  { number: "ST-8002", fromWarehouse: "wh_001", toWarehouse: "wh_002", date: "2024-06-15", items: 5, status: "in_transit" },
].map((s, i) => ({ ...base(`st_${i + 1}`), ...s }));

/* ------- STOCK ADJUSTMENTS ------- */
export const MOCK_STOCK_ADJUSTMENTS = [
  { number: "ADJ-9001", productId: "p_003", productName: "Circuit Board A2", date: "2024-06-10", delta: -5, reason: "Damaged during handling" },
  { number: "ADJ-9002", productId: "p_007", productName: "Packaging Box L", date: "2024-06-18", delta: 200, reason: "Recount correction" },
].map((s, i) => ({ ...base(`adj_${i + 1}`), ...s }));

/* ------- STOCK MOVEMENTS ------- */
export const MOCK_STOCK_MOVEMENTS = Array.from({ length: 20 }, (_, i) => ({
  ...base(`sm_${i + 1}`),
  productId: `p_${String((i % 12) + 1).padStart(3, "0")}`,
  warehouseId: i % 2 === 0 ? "wh_001" : "wh_002",
  type: ["in", "out", "adjust"][i % 3] as "in" | "out" | "adjust",
  quantity: (i % 5) * 10 + 5,
  date: `2024-06-${String((i % 20) + 1).padStart(2, "0")}`,
  reference: `REF-${1000 + i}`,
}));

/* ------- BATCHES ------- */
export const MOCK_BATCHES = [
  { productId: "p_003", batchNumber: "B-CB-A2-01", quantity: 30, expiry: "2025-06-30", received: "2024-04-01" },
  { productId: "p_010", batchNumber: "B-PG-01", quantity: 60, expiry: "2026-01-31", received: "2024-03-15" },
].map((b, i) => ({ ...base(`batch_${i + 1}`), ...b }));

/* ------- CHART OF ACCOUNTS ------- */
export const MOCK_COA = [
  { code: "1000", name: "Cash", type: "asset", balance: 42000 },
  { code: "1100", name: "Accounts Receivable", type: "asset", balance: 148000 },
  { code: "1200", name: "Inventory", type: "asset", balance: 218000 },
  { code: "2000", name: "Accounts Payable", type: "liability", balance: 62000 },
  { code: "3000", name: "Owner Equity", type: "equity", balance: 346000 },
  { code: "4000", name: "Sales Revenue", type: "revenue", balance: 480000 },
  { code: "5000", name: "Cost of Goods Sold", type: "expense", balance: 210000 },
  { code: "5100", name: "Payroll Expense", type: "expense", balance: 84000 },
  { code: "5200", name: "Rent Expense", type: "expense", balance: 24000 },
].map((c, i) => ({ ...base(`acct_${i + 1}`), ...c }));

/* ------- JOURNAL ENTRIES ------- */
export const MOCK_JOURNAL = [
  { number: "JE-1001", date: "2024-06-01", description: "Sales — Northwind invoice", debit: 13640, credit: 13640, account: "Accounts Receivable" },
  { number: "JE-1002", date: "2024-06-03", description: "Purchase — Apex PO", debit: 18400, credit: 18400, account: "Accounts Payable" },
  { number: "JE-1003", date: "2024-06-15", description: "Payroll accrual", debit: 84200, credit: 84200, account: "Payroll Expense" },
].map((j, i) => ({ ...base(`je_${i + 1}`), ...j }));

/* ------- BANK ACCOUNTS ------- */
export const MOCK_BANK_ACCOUNTS = [
  { name: "Operating Account", bank: "First National", number: "•••• 4521", balance: 128400, currency: "USD" },
  { name: "Payroll Account", bank: "First National", number: "•••• 8832", balance: 34200, currency: "USD" },
  { name: "Reserve Account", bank: "Chase Business", number: "•••• 9910", balance: 210000, currency: "USD" },
].map((b, i) => ({ ...base(`bank_${i + 1}`), ...b }));

/* ------- BUDGETS ------- */
export const MOCK_BUDGETS = [
  { name: "Q2 Operations", category: "Operations", budget: 85000, spent: 62000, period: "Q2 2024" },
  { name: "Q2 Payroll", category: "Payroll", budget: 252000, spent: 168000, period: "Q2 2024" },
  { name: "Q2 Marketing", category: "Marketing", budget: 40000, spent: 28500, period: "Q2 2024" },
  { name: "Q2 Capex", category: "Capital", budget: 120000, spent: 45000, period: "Q2 2024" },
].map((b, i) => ({ ...base(`bud_${i + 1}`), ...b }));

/* ------- ATTENDANCE ------- */
export const MOCK_ATTENDANCE = [
  { employeeId: "emp_001", date: "2024-06-24", clockIn: "08:55", clockOut: "17:05", status: "present" },
  { employeeId: "emp_002", date: "2024-06-24", clockIn: "09:02", clockOut: "17:30", status: "present" },
  { employeeId: "emp_003", date: "2024-06-24", clockIn: "08:45", clockOut: "16:55", status: "present" },
  { employeeId: "emp_008", date: "2024-06-24", clockIn: "", clockOut: "", status: "on_leave" },
  { employeeId: "emp_001", date: "2024-06-25", clockIn: "08:58", clockOut: "17:10", status: "present" },
].map((a, i) => ({ ...base(`att_${i + 1}`), ...a }));

/* ------- LEAVE REQUESTS ------- */
export const MOCK_LEAVES = [
  { employeeId: "emp_008", employeeName: "Owen Brooks", type: "Annual", from: "2024-06-20", to: "2024-06-28", days: 7, status: "approved" },
  { employeeId: "emp_003", employeeName: "Priya Raman", type: "Sick", from: "2024-06-24", to: "2024-06-25", days: 2, status: "pending" },
  { employeeId: "emp_014", employeeName: "Mark Stone", type: "Annual", from: "2024-07-15", to: "2024-07-22", days: 6, status: "pending" },
].map((l, i) => ({ ...base(`lv_${i + 1}`), ...l }));

/* ------- SHIFTS ------- */
export const MOCK_SHIFTS = [
  { name: "Morning", start: "08:00", end: "16:00", days: "Mon-Fri", employees: 8 },
  { name: "Evening", start: "16:00", end: "23:00", days: "Mon-Fri", employees: 4 },
  { name: "Weekend", start: "09:00", end: "17:00", days: "Sat-Sun", employees: 2 },
].map((s, i) => ({ ...base(`shift_${i + 1}`), ...s }));

/* ------- PAYROLL ------- */
export const MOCK_PAYROLL = [
  { period: "June 2024", employeeCount: 15, gross: 84200, deductions: 18900, net: 65300, status: "processed" },
  { period: "May 2024", employeeCount: 15, gross: 84200, deductions: 18900, net: 65300, status: "processed" },
  { period: "July 2024", employeeCount: 15, gross: 84200, deductions: 18900, net: 65300, status: "draft" },
].map((p, i) => ({ ...base(`pay_${i + 1}`), ...p }));

/* ------- JOB POSTINGS ------- */
export const MOCK_JOBS = [
  { title: "Senior Engineer", department: "Engineering", location: "Austin, TX", applicants: 14, status: "open", postedAt: "2024-05-15" },
  { title: "Sales Manager", department: "Sales", location: "Remote", applicants: 8, status: "open", postedAt: "2024-06-01" },
  { title: "Accountant", department: "Finance", location: "Austin, TX", applicants: 5, status: "closed", postedAt: "2024-04-10" },
].map((j, i) => ({ ...base(`job_${i + 1}`), ...j }));

/* ------- PERFORMANCE REVIEWS ------- */
export const MOCK_REVIEWS = [
  { employeeId: "emp_003", employeeName: "Priya Raman", period: "2024-H1", rating: 4.5, reviewer: "Sarah Chen", status: "completed" },
  { employeeId: "emp_006", employeeName: "David Kim", period: "2024-H1", rating: 4.8, reviewer: "Sarah Chen", status: "completed" },
  { employeeId: "emp_010", employeeName: "Raj Patel", period: "2024-H1", rating: 4.2, reviewer: "Michael Osei", status: "in_progress" },
].map((r, i) => ({ ...base(`rev_${i + 1}`), ...r }));

/* ------- TASKS ------- */
export const MOCK_TASKS = [
  { title: "Review Q2 financials", projectId: "prj_001", assignee: "Sarah Chen", priority: "high", status: "in_progress", dueDate: "2024-07-01" },
  { title: "Design warehouse layout", projectId: "prj_003", assignee: "Nina Ito", priority: "medium", status: "todo", dueDate: "2024-07-10" },
  { title: "Customer onboarding call", projectId: "prj_002", assignee: "Priya Raman", priority: "high", status: "in_progress", dueDate: "2024-06-28" },
  { title: "Update brand guidelines", projectId: "prj_005", assignee: "Ana Silva", priority: "low", status: "done", dueDate: "2024-06-20" },
  { title: "Deploy staging environment", projectId: "prj_002", assignee: "David Kim", priority: "high", status: "in_review", dueDate: "2024-06-30" },
  { title: "Draft project charter", projectId: "prj_003", assignee: "Michael Osei", priority: "medium", status: "todo", dueDate: "2024-07-05" },
].map((t, i) => ({ ...base(`task_${i + 1}`), ...t }));

/* ------- MILESTONES ------- */
export const MOCK_MILESTONES = [
  { projectId: "prj_001", name: "Phase 1 kickoff", dueDate: "2024-04-15", completed: true },
  { projectId: "prj_001", name: "Midpoint review", dueDate: "2024-07-01", completed: false },
  { projectId: "prj_002", name: "Migration 50%", dueDate: "2024-06-30", completed: true },
  { projectId: "prj_002", name: "Cutover", dueDate: "2024-08-10", completed: false },
].map((m, i) => ({ ...base(`ms_${i + 1}`), ...m }));

/* ------- TIME ENTRIES ------- */
export const MOCK_TIME_ENTRIES = [
  { projectId: "prj_001", employeeId: "emp_001", date: "2024-06-24", hours: 6, description: "Financial review" },
  { projectId: "prj_001", employeeId: "emp_006", date: "2024-06-24", hours: 8, description: "Engineering design" },
  { projectId: "prj_002", employeeId: "emp_003", date: "2024-06-24", hours: 4, description: "Customer calls" },
].map((t, i) => ({ ...base(`te_${i + 1}`), ...t }));

/* ------- DOCUMENTS ------- */
export const MOCK_DOCUMENTS = [
  { name: "Q2 Financial Report.pdf", folder: "Finance", size: "2.4 MB", version: 3, owner: "Elena Rossi", updatedAt: "2024-06-20" },
  { name: "Employee Handbook.pdf", folder: "HR", size: "5.1 MB", version: 8, owner: "James Walker", updatedAt: "2024-05-01" },
  { name: "Product Catalogue.xlsx", folder: "Inventory", size: "890 KB", version: 12, owner: "Michael Osei", updatedAt: "2024-06-15" },
  { name: "Vendor Contracts.zip", folder: "Purchases", size: "18 MB", version: 2, owner: "Tom Reyes", updatedAt: "2024-06-10" },
  { name: "Customer Agreements.zip", folder: "CRM", size: "12 MB", version: 5, owner: "Priya Raman", updatedAt: "2024-06-22" },
].map((d, i) => ({ ...base(`doc_${i + 1}`), ...d }));

/* ------- BOMs ------- */
export const MOCK_BOMS = [
  { productId: "p_011", productName: "Motor Unit B7", components: 8, cost: 148, status: "active" },
  { productId: "p_003", productName: "Circuit Board A2", components: 12, cost: 62, status: "active" },
].map((b, i) => ({ ...base(`bom_${i + 1}`), ...b }));

/* ------- MANUFACTURING ORDERS ------- */
export const MOCK_MFG_ORDERS = [
  { number: "MO-1001", productName: "Motor Unit B7", quantity: 20, startDate: "2024-06-20", endDate: "2024-07-05", status: "in_progress" },
  { number: "MO-1002", productName: "Circuit Board A2", quantity: 50, startDate: "2024-06-25", endDate: "2024-07-10", status: "planned" },
].map((m, i) => ({ ...base(`mo_${i + 1}`), ...m }));

/* ------- WORK CENTERS ------- */
export const MOCK_WORK_CENTERS = [
  { name: "Assembly Line A", capacity: 120, utilization: 78, status: "active" },
  { name: "Assembly Line B", capacity: 100, utilization: 45, status: "active" },
  { name: "Paint Shop", capacity: 60, utilization: 92, status: "maintenance" },
].map((w, i) => ({ ...base(`wc_${i + 1}`), ...w }));

/* ------- QUALITY INSPECTIONS ------- */
export const MOCK_INSPECTIONS = [
  { number: "QI-1001", productName: "Motor Unit B7", date: "2024-06-20", inspector: "Nina Ito", result: "passed", notes: "All specs met" },
  { number: "QI-1002", productName: "Circuit Board A2", date: "2024-06-22", inspector: "Nina Ito", result: "failed", notes: "Solder defect on R12" },
].map((q, i) => ({ ...base(`qi_${i + 1}`), ...q }));

/* ------- NCRs ------- */
export const MOCK_NCRS = [
  { number: "NCR-2001", related: "QI-1002", severity: "major", rootCause: "Supplier defect", status: "open", corrective: "Return batch" },
  { number: "NCR-2002", related: "QI-1001", severity: "minor", rootCause: "Operator training", status: "closed", corrective: "Training" },
].map((n, i) => ({ ...base(`ncr_${i + 1}`), ...n }));

/* ------- ASSETS ------- */
export const MOCK_ASSETS = [
  { name: "Forklift A", category: "Vehicle", location: "Warehouse 1", value: 24000, assignedTo: "Tom Reyes", status: "active" },
  { name: "Server Rack", category: "IT", location: "Data Center", value: 18000, assignedTo: "David Kim", status: "active" },
  { name: "Office Furniture Set", category: "Furniture", location: "Austin HQ", value: 6200, assignedTo: "—", status: "active" },
  { name: "CNC Machine", category: "Equipment", location: "Dallas Plant", value: 180000, assignedTo: "Michael Osei", status: "maintenance" },
].map((a, i) => ({ ...base(`asset_${i + 1}`), ...a }));

/* ------- ASSET MAINTENANCE ------- */
export const MOCK_ASSET_MAINTENANCE = [
  { assetId: "asset_004", assetName: "CNC Machine", type: "preventive", scheduled: "2024-07-01", cost: 2400, status: "scheduled" },
  { assetId: "asset_001", assetName: "Forklift A", type: "repair", scheduled: "2024-06-15", cost: 800, status: "completed" },
].map((m, i) => ({ ...base(`maint_${i + 1}`), ...m }));

/* ------- SUPPORT TICKETS ------- */
export const MOCK_TICKETS = [
  { number: "T-1001", subject: "Cannot access invoice list", customer: "Northwind Traders", priority: "high", status: "open", assignee: "Priya Raman", created: "2024-06-23" },
  { number: "T-1002", subject: "Feature request: bulk export", customer: "Globex Corporation", priority: "medium", status: "in_progress", assignee: "Michael Osei", created: "2024-06-22" },
  { number: "T-1003", subject: "Password reset issue", customer: "Umbrella Health", priority: "urgent", status: "resolved", assignee: "Sarah Chen", created: "2024-06-20" },
].map((t, i) => ({ ...base(`tkt_${i + 1}`), ...t }));

/* ------- KNOWLEDGE BASE ------- */
export const MOCK_KB = [
  { title: "How to reset your password", category: "Access", views: 248, updated: "2024-05-15" },
  { title: "Creating a purchase order", category: "Purchases", views: 142, updated: "2024-06-01" },
  { title: "Understanding inventory valuation", category: "Inventory", views: 96, updated: "2024-06-10" },
].map((k, i) => ({ ...base(`kb_${i + 1}`), ...k }));

/* ------- ANNOUNCEMENTS ------- */
export const MOCK_ANNOUNCEMENTS = [
  { title: "Q3 All-Hands Meeting", body: "Join us for the Q3 kickoff on July 8 at 10 AM.", author: "Sarah Chen", date: "2024-06-24" },
  { title: "New PTO Policy", body: "Updated PTO policy effective July 1. See HR portal for details.", author: "James Walker", date: "2024-06-20" },
].map((a, i) => ({ ...base(`ann_${i + 1}`), ...a }));

/* ------- ACTIVITY LOG ------- */
export const MOCK_ACTIVITY = [
  { actor: "Sarah Chen", action: "created invoice INV-2024-012", at: "2024-06-24T10:30:00Z", type: "sales" },
  { actor: "Michael Osei", action: "approved PO-1002", at: "2024-06-24T09:15:00Z", type: "purchases" },
  { actor: "Priya Raman", action: "converted lead Linda Park to customer", at: "2024-06-23T16:45:00Z", type: "crm" },
  { actor: "Elena Rossi", action: "processed June payroll", at: "2024-06-23T14:20:00Z", type: "hr" },
  { actor: "David Kim", action: "marked task 'Deploy staging' in review", at: "2024-06-22T11:05:00Z", type: "projects" },
].map((a, i) => ({ ...base(`act_${i + 1}`), ...a }));

/* ------- BRANCHES, DEPARTMENTS, LOCATIONS (extended) ------- */
export const MOCK_DEPARTMENTS = [
  { name: "Engineering", head: "David Kim", employeeCount: 5, organizationId: "org_001" },
  { name: "Sales", head: "Priya Raman", employeeCount: 3, organizationId: "org_001" },
  { name: "Finance", head: "Elena Rossi", employeeCount: 2, organizationId: "org_001" },
  { name: "HR", head: "James Walker", employeeCount: 1, organizationId: "org_001" },
  { name: "Operations", head: "Tom Reyes", employeeCount: 3, organizationId: "org_001" },
].map((d, i) => ({ ...base(`dept_${i + 1}`), ...d }));

export const MOCK_LOCATIONS = [
  { name: "Austin HQ", address: "350 Industrial Way", city: "Austin", country: "USA", organizationId: "org_001" },
  { name: "Dallas Plant", address: "1240 Manufacturer Pkwy", city: "Dallas", country: "USA", organizationId: "org_001" },
  { name: "Remote", address: "—", city: "—", country: "—", organizationId: "org_001" },
].map((l, i) => ({ ...base(`loc_${i + 1}`), ...l }));

/* ------- LOGIN HISTORY ------- */
export const MOCK_LOGIN_HISTORY = [
  { userId: "u_001", name: "Sarah Chen", ip: "203.0.113.42", agent: "Chrome / macOS", at: "2024-06-24T08:55:00Z", status: "success" },
  { userId: "u_002", name: "Michael Osei", ip: "203.0.113.51", agent: "Firefox / Windows", at: "2024-06-24T09:02:00Z", status: "success" },
  { userId: "u_003", name: "Priya Raman", ip: "198.51.100.72", agent: "Safari / iOS", at: "2024-06-23T14:10:00Z", status: "failed" },
].map((h, i) => ({ ...base(`lh_${i + 1}`), ...h }));

