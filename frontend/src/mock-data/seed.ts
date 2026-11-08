/* =========================================================================
 * MASTER MOCK SEED
 * MOCK DATA — Central seed used by all mock services.
 * API REPLACEMENT: GET /api/v1/{resource} — one endpoint per entity.
 *
 * Every mutation in mock services mutates these arrays in place. State lives
 * only for the browser session. No persistence layer beyond the session.
 * ========================================================================= */
import type {
  Organization, Branch, User, Role, Customer, Lead, Invoice, SalesOrder,
  Supplier, PurchaseOrder, Product, Warehouse, Transaction, Employee, Project,
  Notification, ModuleConfig,
} from "@/types";
import { uid } from "@/lib/utils";

const now = () => new Date().toISOString();
const base = () => ({ createdAt: now(), updatedAt: now() });

/* -------------------------------------------------------------- ORGANIZATIONS */
export const MOCK_ORGANIZATIONS: Organization[] = [
  {
    ...base(), id: "org_001", name: "Acme Manufacturing", slug: "acme",
    industry: "Manufacturing", currency: "USD", fiscalYearStart: "2024-01-01",
    taxRate: 10, address: "350 Industrial Way, Austin, TX", phone: "+1 512 555 0100",
    email: "hello@acme.example",
    enabledModules: ["crm","sales","purchases","inventory","finance","hr","projects","manufacturing","quality","reports","helpdesk"],
  },
  {
    ...base(), id: "org_002", name: "Nova Retail Group", slug: "nova",
    industry: "Retail", currency: "USD", fiscalYearStart: "2024-01-01",
    taxRate: 8, address: "12 Market St, San Francisco, CA", phone: "+1 415 555 0123",
    email: "hello@nova.example",
    enabledModules: ["crm","sales","purchases","inventory","finance","hr","reports"],
  },
  {
    ...base(), id: "org_003", name: "BlueSky Services", slug: "bluesky",
    industry: "Services", currency: "USD", fiscalYearStart: "2024-04-01",
    taxRate: 5, address: "88 Business Park, Denver, CO", phone: "+1 303 555 0456",
    email: "hello@bluesky.example",
    enabledModules: ["crm","sales","finance","hr","projects","reports","helpdesk"],
  },
];

/* --------------------------------------------------------------------- BRANCHES */
export const MOCK_BRANCHES: Branch[] = [
  { ...base(), id: "br_001", organizationId: "org_001", name: "Austin HQ", code: "AUS", address: "Austin, TX", phone: "+1 512 555 0100", isHeadOffice: true },
  { ...base(), id: "br_002", organizationId: "org_001", name: "Dallas Plant", code: "DAL", address: "Dallas, TX", phone: "+1 214 555 0101", isHeadOffice: false },
  { ...base(), id: "br_003", organizationId: "org_002", name: "SF Flagship", code: "SF1", address: "San Francisco, CA", phone: "+1 415 555 0123", isHeadOffice: true },
];

/* ------------------------------------------------------------------------ ROLES */
export const MOCK_ROLES: Role[] = [
  { ...base(), id: "role_admin", name: "Super Admin", description: "Full access", permissions: ["*"], isSystem: true },
  { ...base(), id: "role_manager", name: "Manager", description: "Operational access", permissions: ["crm.*","sales.*","inventory.read"], isSystem: false },
  { ...base(), id: "role_sales", name: "Sales Rep", description: "Sales access", permissions: ["crm.*","sales.*"], isSystem: false },
  { ...base(), id: "role_hr", name: "HR Manager", description: "HR access", permissions: ["hr.*"], isSystem: false },
  { ...base(), id: "role_viewer", name: "Viewer", description: "Read-only", permissions: ["*.read"], isSystem: false },
];

/* ------------------------------------------------------------------------ USERS */
export const MOCK_USERS: User[] = [
  { ...base(), id: "u_001", name: "Sarah Chen", email: "sarah@acme.example", roleId: "role_admin", organizationId: "org_001", status: "active", phone: "+1 512 555 1001" },
  { ...base(), id: "u_002", name: "Michael Osei", email: "michael@acme.example", roleId: "role_manager", organizationId: "org_001", status: "active" },
  { ...base(), id: "u_003", name: "Priya Raman", email: "priya@acme.example", roleId: "role_sales", organizationId: "org_001", status: "active" },
  { ...base(), id: "u_004", name: "James Walker", email: "james@acme.example", roleId: "role_hr", organizationId: "org_001", status: "active" },
  { ...base(), id: "u_005", name: "Elena Rossi", email: "elena@nova.example", roleId: "role_admin", organizationId: "org_002", status: "active" },
];

/* -------------------------------------------------------------------- CUSTOMERS */
const customerSeeds = [
  ["Northwind Traders","contact@northwind.example","+1 555 0101","Retail","active",82000],
  ["Globex Corporation","sales@globex.example","+1 555 0102","Enterprise","active",145000],
  ["Soylent Foods","ops@soylent.example","+1 555 0103","Manufacturing","active",52000],
  ["Initech Systems","hello@initech.example","+1 555 0104","Technology","lead",0],
  ["Umbrella Health","care@umbrella.example","+1 555 0105","Healthcare","active",96000],
  ["Stark Industries","info@stark.example","+1 555 0106","Manufacturing","active",210000],
  ["Wayne Enterprises","contact@wayne.example","+1 555 0107","Enterprise","inactive",44000],
  ["Cyberdyne Robotics","ai@cyberdyne.example","+1 555 0108","Technology","active",128000],
  ["Tyrell Bio","bio@tyrell.example","+1 555 0109","Healthcare","active",77000],
  ["Wonka Confectionery","sweet@wonka.example","+1 555 0110","Retail","lead",0],
  ["Oscorp Labs","research@oscorp.example","+1 555 0111","Technology","active",34000],
  ["Vandelay Imports","trade@vandelay.example","+1 555 0112","Distribution","active",61000],
  ["Hooli Cloud","cloud@hooli.example","+1 555 0113","Technology","active",182000],
  ["Pied Piper","team@piedpiper.example","+1 555 0114","Technology","lead",0],
  ["Bluth Homes","homes@bluth.example","+1 555 0115","Construction","active",95000],
  ["Dunder Mifflin","paper@dunder.example","+1 555 0116","Distribution","active",48000],
  ["Prestige Worldwide","prestige@worldwide.example","+1 555 0117","Services","inactive",12000],
  ["Gekko Capital","trade@gekko.example","+1 555 0118","Finance","active",275000],
  ["Blue Ocean Travel","travel@blueocean.example","+1 555 0119","Services","active",33000],
  ["Monarch Sciences","science@monarch.example","+1 555 0120","Technology","active",102000],
];
export const MOCK_CUSTOMERS: Customer[] = customerSeeds.map(([name,email,phone,group,status,rev], i) => ({
  ...base(), id: `c_${String(i+1).padStart(3,"0")}`,
  name: name as string, email: email as string, phone: phone as string,
  company: name as string, group: group as string,
  status: status as Customer["status"], address: "United States",
  ownerId: i % 2 === 0 ? "u_001" : "u_003", organizationId: "org_001",
  totalRevenue: rev as number,
}));

/* ------------------------------------------------------------------------ LEADS */
export const MOCK_LEADS: Lead[] = [
  { ...base(), id: "l_001", name: "Linda Park", company: "Hyperion", email: "linda@hyperion.example", phone: "+1 555 2001", value: 24000, status: "new", source: "Website", ownerId: "u_003" },
  { ...base(), id: "l_002", name: "David Kim", company: "Solaris", email: "david@solaris.example", phone: "+1 555 2002", value: 62000, status: "qualified", source: "Referral", ownerId: "u_003" },
  { ...base(), id: "l_003", name: "Fatima Noor", company: "Zephyr", email: "fatima@zephyr.example", phone: "+1 555 2003", value: 18500, status: "contacted", source: "Cold Call", ownerId: "u_001" },
  { ...base(), id: "l_004", name: "Owen Brooks", company: "Meridian", email: "owen@meridian.example", phone: "+1 555 2004", value: 88000, status: "proposal", source: "Event", ownerId: "u_002" },
  { ...base(), id: "l_005", name: "Ana Silva", company: "Orion", email: "ana@orion.example", phone: "+1 555 2005", value: 34000, status: "won", source: "Website", ownerId: "u_003" },
  { ...base(), id: "l_006", name: "Raj Patel", company: "Vertex", email: "raj@vertex.example", phone: "+1 555 2006", value: 12000, status: "lost", source: "Cold Call", ownerId: "u_002" },
];

/* --------------------------------------------------------------------- INVOICES */
export const MOCK_INVOICES: Invoice[] = [
  ["INV-2024-001","c_001","Northwind Traders","2024-06-01","2024-06-30","paid",12400,1240,13640,13640],
  ["INV-2024-002","c_002","Globex Corporation","2024-06-05","2024-07-05","sent",28600,2860,31460,0],
  ["INV-2024-003","c_003","Soylent Foods","2024-05-20","2024-06-20","overdue",8400,840,9240,2000],
  ["INV-2024-004","c_005","Umbrella Health","2024-06-10","2024-07-10","paid",19200,1920,21120,21120],
  ["INV-2024-005","c_006","Stark Industries","2024-06-12","2024-07-12","sent",45000,4500,49500,0],
  ["INV-2024-006","c_008","Cyberdyne Robotics","2024-05-15","2024-06-15","overdue",15800,1580,17380,0],
  ["INV-2024-007","c_009","Tyrell Bio","2024-06-15","2024-07-15","draft",7600,760,8360,0],
  ["INV-2024-008","c_011","Oscorp Labs","2024-06-18","2024-07-18","paid",5100,510,5610,5610],
  ["INV-2024-009","c_012","Vandelay Imports","2024-06-20","2024-07-20","sent",9800,980,10780,0],
  ["INV-2024-010","c_013","Hooli Cloud","2024-06-22","2024-07-22","sent",22400,2240,24640,0],
  ["INV-2024-011","c_015","Bluth Homes","2024-05-01","2024-06-01","paid",18300,1830,20130,20130],
  ["INV-2024-012","c_018","Gekko Capital","2024-06-24","2024-07-24","draft",31200,3120,34320,0],
].map(([number,customerId,customerName,issueDate,dueDate,status,subtotal,tax,total,amountPaid], i) => ({
  ...base(), id: `inv_${String(i+1).padStart(3,"0")}`,
  number: number as string, customerId: customerId as string, customerName: customerName as string,
  issueDate: issueDate as string, dueDate: dueDate as string, status: status as Invoice["status"],
  lines: [], subtotal: subtotal as number, tax: tax as number, total: total as number, amountPaid: amountPaid as number,
}));

/* ----------------------------------------------------------------- SALES ORDERS */
export const MOCK_SALES_ORDERS: SalesOrder[] = [
  { ...base(), id: "so_001", number: "SO-2401", customerId: "c_002", customerName: "Globex Corporation", orderDate: "2024-06-01", status: "fulfilled", total: 31460 },
  { ...base(), id: "so_002", number: "SO-2402", customerId: "c_005", customerName: "Umbrella Health", orderDate: "2024-06-08", status: "confirmed", total: 21120 },
  { ...base(), id: "so_003", number: "SO-2403", customerId: "c_006", customerName: "Stark Industries", orderDate: "2024-06-10", status: "confirmed", total: 49500 },
  { ...base(), id: "so_004", number: "SO-2404", customerId: "c_013", customerName: "Hooli Cloud", orderDate: "2024-06-18", status: "draft", total: 24640 },
];

/* -------------------------------------------------------------------- SUPPLIERS */
export const MOCK_SUPPLIERS: Supplier[] = [
  { ...base(), id: "s_001", name: "Apex Materials", email: "sales@apex.example", phone: "+1 555 3001", contactPerson: "Tom Reyes", address: "Houston, TX", category: "Raw Materials", status: "active" },
  { ...base(), id: "s_002", name: "Meridian Components", email: "orders@meridian.example", phone: "+1 555 3002", contactPerson: "Kelly Wu", address: "Seattle, WA", category: "Components", status: "active" },
  { ...base(), id: "s_003", name: "Golden Logistics", email: "ship@golden.example", phone: "+1 555 3003", contactPerson: "Mark Stone", address: "Chicago, IL", category: "Logistics", status: "active" },
  { ...base(), id: "s_004", name: "Silicon Source", email: "chip@silicon.example", phone: "+1 555 3004", contactPerson: "Nina Ito", address: "San Jose, CA", category: "Electronics", status: "inactive" },
  { ...base(), id: "s_005", name: "Bright Packaging", email: "box@bright.example", phone: "+1 555 3005", contactPerson: "Sam Patel", address: "Denver, CO", category: "Packaging", status: "active" },
];

/* --------------------------------------------------------------- PURCHASE ORDERS */
export const MOCK_PURCHASE_ORDERS: PurchaseOrder[] = [
  { ...base(), id: "po_001", number: "PO-1001", supplierId: "s_001", supplierName: "Apex Materials", orderDate: "2024-06-02", status: "received", total: 18400 },
  { ...base(), id: "po_002", number: "PO-1002", supplierId: "s_002", supplierName: "Meridian Components", orderDate: "2024-06-06", status: "approved", total: 9200 },
  { ...base(), id: "po_003", number: "PO-1003", supplierId: "s_003", supplierName: "Golden Logistics", orderDate: "2024-06-14", status: "pending", total: 3200 },
  { ...base(), id: "po_004", number: "PO-1004", supplierId: "s_005", supplierName: "Bright Packaging", orderDate: "2024-06-20", status: "draft", total: 5400 },
];

/* ---------------------------------------------------------------------- PRODUCTS */
export const MOCK_PRODUCTS: Product[] = [
  ["SKU-1001","Industrial Bearing XL","Components","pcs",18,32,420,100],
  ["SKU-1002","Steel Plate 5mm","Raw Materials","sheet",42,68,180,60],
  ["SKU-1003","Circuit Board A2","Electronics","pcs",88,145,55,80],
  ["SKU-1004","Hydraulic Hose","Components","m",12,22,340,120],
  ["SKU-1005","Aluminum Rod 10mm","Raw Materials","m",9,17,610,200],
  ["SKU-1006","Sensor Module","Electronics","pcs",34,58,22,40],
  ["SKU-1007","Packaging Box L","Packaging","pcs",1.2,2.5,4200,1000],
  ["SKU-1008","Packaging Box M","Packaging","pcs",0.9,2,3100,800],
  ["SKU-1009","Coolant Fluid 5L","Supplies","bottle",6,12,88,50],
  ["SKU-1010","Precision Gear","Components","pcs",56,94,140,50],
  ["SKU-1011","Motor Unit B7","Electronics","pcs",210,340,18,30],
  ["SKU-1012","Screw Set (100)","Components","set",4,8,900,200],
].map(([sku,name,category,unit,costPrice,salePrice,stock,reorderLevel], i) => ({
  ...base(), id: `p_${String(i+1).padStart(3,"0")}`,
  sku: sku as string, name: name as string, category: category as string, unit: unit as string,
  costPrice: costPrice as number, salePrice: salePrice as number, stock: stock as number,
  reorderLevel: reorderLevel as number, warehouseId: "wh_001",
  status: "active" as const,
}));

/* ------------------------------------------------------------------- WAREHOUSES */
export const MOCK_WAREHOUSES: Warehouse[] = [
  { ...base(), id: "wh_001", name: "Main Warehouse", code: "MW-01", location: "Austin, TX", managerId: "u_002", capacity: 10000, utilization: 68 },
  { ...base(), id: "wh_002", name: "East Distribution", code: "ED-02", location: "Dallas, TX", managerId: "u_002", capacity: 6000, utilization: 42 },
];

/* ------------------------------------------------------------------ TRANSACTIONS */
export const MOCK_TRANSACTIONS: Transaction[] = [
  { ...base(), id: "t_001", reference: "TXN-5001", date: "2024-06-01", description: "Customer payment — Northwind", type: "income", category: "Sales", amount: 13640, account: "Operating" },
  { ...base(), id: "t_002", reference: "TXN-5002", date: "2024-06-03", description: "Supplier payment — Apex", type: "expense", category: "Purchases", amount: 18400, account: "Operating" },
  { ...base(), id: "t_003", reference: "TXN-5003", date: "2024-06-08", description: "Utilities — May", type: "expense", category: "Utilities", amount: 2400, account: "Operating" },
  { ...base(), id: "t_004", reference: "TXN-5004", date: "2024-06-12", description: "Customer payment — Umbrella", type: "income", category: "Sales", amount: 21120, account: "Operating" },
  { ...base(), id: "t_005", reference: "TXN-5005", date: "2024-06-15", description: "Payroll — June", type: "expense", category: "Payroll", amount: 84200, account: "Operating" },
  { ...base(), id: "t_006", reference: "TXN-5006", date: "2024-06-18", description: "Customer payment — Oscorp", type: "income", category: "Sales", amount: 5610, account: "Operating" },
  { ...base(), id: "t_007", reference: "TXN-5007", date: "2024-06-20", description: "Office rent", type: "expense", category: "Rent", amount: 12000, account: "Operating" },
  { ...base(), id: "t_008", reference: "TXN-5008", date: "2024-06-24", description: "Consulting revenue", type: "income", category: "Services", amount: 8800, account: "Operating" },
];

/* -------------------------------------------------------------------- EMPLOYEES */
const empSeeds = [
  ["Sarah","Chen","sarah@acme.example","Executive","CEO",2018,"2024-06-01",185000,"active"],
  ["Michael","Osei","michael@acme.example","Operations","COO",2019,"2024-06-01",155000,"active"],
  ["Priya","Raman","priya@acme.example","Sales","Sales Manager",2020,"2024-06-01",98000,"active"],
  ["James","Walker","james@acme.example","HR","HR Manager",2019,"2024-06-01",92000,"active"],
  ["Elena","Rossi","elena@acme.example","Finance","Controller",2021,"2024-06-01",105000,"active"],
  ["David","Kim","david@acme.example","Engineering","Lead Engineer",2020,"2024-06-01",128000,"active"],
  ["Fatima","Noor","fatima@acme.example","Engineering","Engineer",2022,"2024-06-01",96000,"active"],
  ["Owen","Brooks","owen@acme.example","Sales","Account Exec",2021,"2024-06-01",78000,"on_leave"],
  ["Ana","Silva","ana@acme.example","Marketing","Marketing Lead",2020,"2024-06-01",88000,"active"],
  ["Raj","Patel","raj@acme.example","Engineering","Engineer",2023,"2024-06-01",90000,"active"],
  ["Linda","Park","linda@acme.example","Operations","Ops Analyst",2022,"2024-06-01",72000,"active"],
  ["Tom","Reyes","tom@acme.example","Operations","Warehouse Lead",2019,"2024-06-01",68000,"active"],
  ["Kelly","Wu","kelly@acme.example","Finance","Accountant",2021,"2024-06-01",74000,"active"],
  ["Mark","Stone","mark@acme.example","Sales","Account Exec",2022,"2024-06-01",76000,"active"],
  ["Nina","Ito","nina@acme.example","Engineering","Designer",2023,"2024-06-01",82000,"active"],
];
export const MOCK_EMPLOYEES: Employee[] = empSeeds.map(([first,last,email,dept,desig,joinYear,joinDate,salary,status], i) => ({
  ...base(), id: `emp_${String(i+1).padStart(3,"0")}`,
  employeeId: `EMP-${String(i+1).padStart(3,"0")}`,
  firstName: first as string, lastName: last as string, email: email as string,
  phone: `+1 555 4${String(i).padStart(3,"0")}`,
  department: dept as string, designation: desig as string,
  joinDate: joinDate as string, salary: salary as number,
  status: status as Employee["status"],
}));

/* --------------------------------------------------------------------- PROJECTS */
export const MOCK_PROJECTS: Project[] = [
  { ...base(), id: "prj_001", name: "Factory Automation Phase 2", code: "PRJ-001", clientId: "c_006", clientName: "Stark Industries", managerId: "u_002", status: "active", startDate: "2024-04-01", endDate: "2024-09-30", budget: 320000, spent: 148000, progress: 46 },
  { ...base(), id: "prj_002", name: "Cloud Migration", code: "PRJ-002", clientId: "c_013", clientName: "Hooli Cloud", managerId: "u_001", status: "active", startDate: "2024-05-15", endDate: "2024-08-15", budget: 180000, spent: 92000, progress: 52 },
  { ...base(), id: "prj_003", name: "Warehouse Upgrade", code: "PRJ-003", clientId: "c_012", clientName: "Vandelay Imports", managerId: "u_002", status: "planning", startDate: "2024-07-01", endDate: "2024-12-31", budget: 95000, spent: 4000, progress: 5 },
  { ...base(), id: "prj_004", name: "ERP Rollout", code: "PRJ-004", clientId: "c_003", clientName: "Soylent Foods", managerId: "u_001", status: "completed", startDate: "2023-09-01", endDate: "2024-03-31", budget: 210000, spent: 205000, progress: 100 },
  { ...base(), id: "prj_005", name: "Brand Refresh", code: "PRJ-005", clientId: "c_020", clientName: "Monarch Sciences", managerId: "u_003", status: "on_hold", startDate: "2024-03-01", endDate: "2024-10-01", budget: 65000, spent: 30000, progress: 30 },
];

/* -------------------------------------------------------------------- NOTIFICATIONS */
export const MOCK_NOTIFICATIONS: Notification[] = [
  { ...base(), id: "n_001", title: "Invoice overdue", message: "INV-2024-003 is 12 days overdue", type: "warning", read: false, link: "/sales/invoices" },
  { ...base(), id: "n_002", title: "Low stock alert", message: "Motor Unit B7 has 18 units left", type: "error", read: false, link: "/inventory/products" },
  { ...base(), id: "n_003", title: "Payment received", message: "$21,120.00 from Umbrella Health", type: "success", read: true },
  { ...base(), id: "n_004", title: "New lead assigned", message: "David Kim — Solaris ($62,000)", type: "info", read: false, link: "/crm/leads" },
  { ...base(), id: "n_005", title: "Project milestone", message: "Cloud Migration hit 50%", type: "success", read: true, link: "/projects" },
];

/* ------------------------------------------------------------------- MODULE CONFIG */
export const MOCK_MODULES: ModuleConfig[] = [
  { key: "crm", name: "CRM", description: "Leads, contacts, customers & pipeline", icon: "Users", category: "Revenue", enabled: true, dependencies: [], defaultEnabled: true },
  { key: "sales", name: "Sales", description: "Quotations, orders, invoices & returns", icon: "ShoppingCart", category: "Revenue", enabled: true, dependencies: ["crm"], defaultEnabled: true },
  { key: "purchases", name: "Purchases", description: "Suppliers, requisitions & POs", icon: "Truck", category: "Supply", enabled: true, dependencies: ["inventory"], defaultEnabled: true },
  { key: "inventory", name: "Inventory", description: "Products, warehouses & stock", icon: "Package", category: "Supply", enabled: true, dependencies: [], defaultEnabled: true },
  { key: "finance", name: "Finance", description: "Accounts, GL, AR/AP & budgets", icon: "Wallet", category: "Financial", enabled: true, dependencies: ["sales","purchases"], defaultEnabled: true },
  { key: "hr", name: "Human Resources", description: "Employees, attendance & payroll", icon: "UserRound", category: "People", enabled: true, dependencies: [], defaultEnabled: true },
  { key: "projects", name: "Projects", description: "Projects, tasks & milestones", icon: "FolderKanban", category: "Delivery", enabled: true, dependencies: ["hr"], defaultEnabled: true },
  { key: "manufacturing", name: "Manufacturing", description: "BOM, orders & production", icon: "Factory", category: "Supply", enabled: true, dependencies: ["inventory"], defaultEnabled: false },
  { key: "quality", name: "Quality", description: "Inspections & NCRs", icon: "ShieldCheck", category: "Supply", enabled: true, dependencies: ["manufacturing"], defaultEnabled: false },
  { key: "assets", name: "Assets", description: "Asset registry & maintenance", icon: "HardDrive", category: "Operations", enabled: false, dependencies: [], defaultEnabled: false },
  { key: "helpdesk", name: "Helpdesk", description: "Support tickets & knowledge base", icon: "Headphones", category: "Operations", enabled: true, dependencies: [], defaultEnabled: true },
  { key: "reports", name: "Reports", description: "Cross-module analytics", icon: "BarChart3", category: "Insights", enabled: true, dependencies: [], defaultEnabled: true },
];

