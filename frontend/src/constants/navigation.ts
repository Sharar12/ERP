import {
  LayoutDashboard, Users, ShoppingCart, Truck, Package, Wallet, UserRound,
  FolderKanban, Factory, ShieldCheck, HardDrive, Headphones, BarChart3,
  Settings, Building2, CheckSquare, Bell, FileText, Activity, type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  moduleKey?: string;
  children?: { label: string; href: string }[];
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    label: "CRM",
    href: "/crm",
    icon: Users,
    moduleKey: "crm",
    children: [
      { label: "Overview", href: "/crm" },
      { label: "Customers", href: "/crm/customers" },
      { label: "Leads", href: "/crm/leads" },
      { label: "Contacts", href: "/crm/contacts" },
      { label: "Pipeline", href: "/crm/pipeline" },
    ],
  },
  {
    label: "Sales",
    href: "/sales",
    icon: ShoppingCart,
    moduleKey: "sales",
    children: [
      { label: "Overview", href: "/sales" },
      { label: "Invoices", href: "/sales/invoices" },
      { label: "Sales Orders", href: "/sales/orders" },
      { label: "Quotations", href: "/sales/quotations" },
      { label: "Payments", href: "/sales/payments" },
      { label: "Returns", href: "/sales/returns" },
      { label: "Targets", href: "/sales/targets" },
    ],
  },
  {
    label: "Purchases",
    href: "/purchases",
    icon: Truck,
    moduleKey: "purchases",
    children: [
      { label: "Overview", href: "/purchases" },
      { label: "Suppliers", href: "/purchases/suppliers" },
      { label: "Purchase Orders", href: "/purchases/orders" },
      { label: "Purchase Requests", href: "/purchases/requests" },
      { label: "RFQs", href: "/purchases/rfqs" },
      { label: "Goods Receipt (GRN)", href: "/purchases/grns" },
      { label: "Supplier Payments", href: "/purchases/payments" },
    ],
  },
  {
    label: "Inventory",
    href: "/inventory",
    icon: Package,
    moduleKey: "inventory",
    children: [
      { label: "Overview", href: "/inventory" },
      { label: "Products", href: "/inventory/products" },
      { label: "Warehouses", href: "/inventory/warehouses" },
      { label: "Transfers", href: "/inventory/transfers" },
      { label: "Adjustments", href: "/inventory/adjustments" },
      { label: "Movements", href: "/inventory/movements" },
      { label: "Valuation", href: "/inventory/valuation" },
      { label: "Batches & Serial", href: "/inventory/batches" },
    ],
  },
  {
    label: "Finance",
    href: "/finance",
    icon: Wallet,
    moduleKey: "finance",
    children: [
      { label: "Overview", href: "/finance" },
      { label: "Chart of Accounts", href: "/finance/accounts" },
      { label: "General Ledger", href: "/finance/ledger" },
      { label: "Journal Entries", href: "/finance/journal" },
      { label: "Receivables (AR)", href: "/finance/receivables" },
      { label: "Payables (AP)", href: "/finance/payables" },
      { label: "Bank Accounts", href: "/finance/bank" },
      { label: "Reconciliation", href: "/finance/reconciliation" },
      { label: "Budgets", href: "/finance/budgets" },
      { label: "Financial Reports", href: "/finance/statements" },
      { label: "All Transactions", href: "/finance/transactions" },
    ],
  },
  {
    label: "Human Resources",
    href: "/hr",
    icon: UserRound,
    moduleKey: "hr",
    children: [
      { label: "Overview", href: "/hr" },
      { label: "Employees", href: "/hr/employees" },
      { label: "Attendance", href: "/hr/attendance" },
      { label: "Leaves", href: "/hr/leaves" },
      { label: "Shifts", href: "/hr/shifts" },
      { label: "Payroll", href: "/hr/payroll" },
      { label: "Recruitment", href: "/hr/recruitment" },
      { label: "Performance", href: "/hr/performance" },
    ],
  },
  {
    label: "Projects",
    href: "/projects",
    icon: FolderKanban,
    moduleKey: "projects",
    children: [
      { label: "Projects List", href: "/projects" },
      { label: "Kanban Board", href: "/projects/kanban" },
      { label: "All Tasks", href: "/tasks" },
    ],
  },
  {
    label: "Manufacturing",
    href: "/manufacturing",
    icon: Factory,
    moduleKey: "manufacturing",
    children: [
      { label: "Overview", href: "/manufacturing" },
      { label: "Work Orders", href: "/manufacturing/orders" },
      { label: "Bills of Materials", href: "/manufacturing/boms" },
      { label: "Work Centers", href: "/manufacturing/work-centers" },
    ],
  },
  {
    label: "Quality",
    href: "/quality",
    icon: ShieldCheck,
    moduleKey: "quality",
    children: [
      { label: "Overview", href: "/quality" },
      { label: "Inspections", href: "/quality/inspections" },
      { label: "NCR Reports", href: "/quality/ncrs" },
    ],
  },
  {
    label: "Assets",
    href: "/assets",
    icon: HardDrive,
    moduleKey: "assets",
    children: [
      { label: "Asset Register", href: "/assets" },
      { label: "Maintenance", href: "/assets/maintenance" },
    ],
  },
  {
    label: "Helpdesk",
    href: "/helpdesk",
    icon: Headphones,
    moduleKey: "helpdesk",
    children: [
      { label: "Tickets", href: "/helpdesk" },
      { label: "Knowledge Base", href: "/helpdesk/kb" },
    ],
  },
  { label: "Documents", href: "/documents", icon: FileText },
  { label: "Reports", href: "/reports", icon: BarChart3, moduleKey: "reports" },
  { label: "Announcements", href: "/announcements", icon: Bell },
  { label: "Activity Log", href: "/activity", icon: Activity },
  {
    label: "Organization",
    href: "/settings/organization",
    icon: Building2,
    children: [
      { label: "Profile", href: "/settings/organization" },
      { label: "Modules", href: "/settings/modules" },
      { label: "Departments", href: "/settings/departments" },
      { label: "Locations", href: "/settings/locations" },
      { label: "Preferences", href: "/settings/preferences" },
    ],
  },
  {
    label: "Access Control",
    href: "/users",
    icon: Users,
    children: [
      { label: "Users", href: "/users" },
      { label: "Roles & Permissions", href: "/roles" },
    ],
  },
];
