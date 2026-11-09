"use client";
import { useEffect, useState, useMemo } from "react";
import {
  Banknote, TrendingUp, Users, Package, ReceiptText, AlertTriangle, FolderKanban,
  Activity, CheckSquare, Clock, UserCheck, BarChart3, Eye, EyeOff,
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { RevenueChart, CategoryChart } from "@/components/dashboard/charts";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, statusTone } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { dashboardService, invoiceService, productService, transactionService } from "@/services";
import { activityService, taskService, attendanceService } from "@/services/mock/extended";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Invoice, Product, Transaction } from "@/types";

const DATE_RANGES = ["Today", "Last 7 Days", "Last 30 Days", "This Month", "Last Month", "This Year"];

export default function DashboardPage() {
  const [stats, setStats] = useState<Awaited<ReturnType<typeof dashboardService.getStats>> | null>(null);
  const [revenue, setRevenue] = useState<{ month: string; revenue: number; expenses: number }[]>([]);
  const [categories, setCategories] = useState<{ name: string; value: number }[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [lowStock, setLowStock] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [range, setRange] = useState("Last 30 Days");
  const [hidden, setHidden] = useState<Set<string>>(new Set());

  useEffect(() => {
    Promise.all([
      dashboardService.getStats(),
      dashboardService.getRevenueSeries(),
      dashboardService.getCategorySeries(),
      invoiceService.getAll(),
      productService.getAll(),
      transactionService.getAll(),
      activityService.getAll(),
      taskService.getAll(),
      attendanceService.getAll(),
    ]).then(([s, r, c, inv, prods, tx, act, tk, att]) => {
      setStats(s);
      setRevenue(r);
      setCategories(c);
      setInvoices(inv.slice(0, 5));
      setLowStock(prods.filter((p: any) => p.stock <= p.reorderLevel).slice(0, 4));
      setTransactions(tx.slice(0, 5));
      setActivity(act.slice(0, 5));
      setTasks(tk.slice(0, 5));
      setAttendance(att);
    });
  }, [range]);

  const pendingApprovals = invoices.filter(i => i.status === "sent").length;
  const attendanceRate = useMemo(() => {
    if (!attendance.length) return 0;
    const present = attendance.filter(a => a.status === "present").length;
    return Math.round((present / attendance.length) * 100);
  }, [attendance]);

  const toggle = (key: string) => {
    const n = new Set(hidden); n.has(key) ? n.delete(key) : n.add(key); setHidden(n);
  };
  const show = (key: string) => !hidden.has(key);

  return (
    <div>
      <div className="relative mb-6 -mx-4 -mt-6 overflow-hidden border-b border-border md:-mx-6">
        <div className="absolute inset-0 bg-grid-fade opacity-60" />
        <div className="relative px-4 py-6 md:px-6">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-label">Overview</span>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight">Dashboard</h1>
            </div>
            <div className="text-right">
              <span className="text-label">Last sync</span>
              <div className="text-xs text-mono-num text-muted-foreground">Today 09:42</div>
            </div>
          </div>
        </div>
      </div>

      <PageHeader title="Dashboard" description="Organization-wide performance overview."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setHidden(new Set())}><Eye className="h-3.5 w-3.5" /> Show all widgets</Button>
            <Select value={range} onChange={e => setRange(e.target.value)} className="w-auto">
              {DATE_RANGES.map(r => <option key={r}>{r}</option>)}
            </Select>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {show("revenue") && <StatCard label="Total Revenue" value={formatCurrency(stats?.revenue ?? 0)} delta={12} icon={Banknote} tone="success" />}
        {show("outstanding") && <StatCard label="Outstanding" value={formatCurrency(stats?.outstanding ?? 0)} delta={-4} icon={ReceiptText} tone="warning" />}
        {show("profit") && <StatCard label="Net Profit" value={formatCurrency(stats?.profit ?? 0)} delta={8} icon={TrendingUp} tone="accent" />}
        {show("inventory") && <StatCard label="Inventory Value" value={formatCurrency(stats?.inventoryValue ?? 0)} icon={Package} tone="accent" />}
        {show("customers") && <StatCard label="Customers" value={String(stats?.customers ?? 0)} icon={Users} tone="accent" />}
        {show("employees") && <StatCard label="Employees" value={String(stats?.employees ?? 0)} icon={Users} tone="accent" />}
        {show("projects") && <StatCard label="Active Projects" value={String(stats?.activeProjects ?? 0)} icon={FolderKanban} tone="success" />}
        {show("lowstock") && <StatCard label="Low Stock" value={String(stats?.lowStock ?? 0)} icon={AlertTriangle} tone="danger" />}
      </div>

      <div className="mt-3 flex flex-wrap gap-1 text-xs">
        {["revenue", "outstanding", "profit", "inventory", "customers", "employees", "projects", "lowstock"].map(k => (
          <button key={k} onClick={() => toggle(k)}
            className="rounded-full border border-border px-2 py-0.5 hover:bg-muted">
            {show(k) ? <EyeOff className="mr-1 inline h-3 w-3" /> : <Eye className="mr-1 inline h-3 w-3" />}
            {k}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Revenue vs Expenses</CardTitle></CardHeader>
          <CardContent><RevenueChart data={revenue} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Sales by Category</CardTitle></CardHeader>
          <CardContent><CategoryChart data={categories} /></CardContent>
        </Card>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Monthly Sales</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <RTooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="revenue" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Cash Flow</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                <RTooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} name="Inflow" />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Outflow" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Recent Transactions</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {transactions.map(t => (
              <div key={t.id} className="flex items-center justify-between text-sm">
                <div>
                  <div className="font-medium">{t.description}</div>
                  <div className="text-xs text-muted-foreground">{formatDate(t.date)} · {t.category}</div>
                </div>
                <span className={t.type === "income" ? "text-success font-medium" : "text-destructive font-medium"}>
                  {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent Activity</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {activity.map(a => (
              <div key={a.id} className="flex items-start gap-2 text-sm">
                <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <div>
                  <div><span className="font-medium">{a.actor}</span> {a.action}</div>
                  <div className="text-xs text-muted-foreground">{new Date(a.at).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Attendance Overview</CardTitle></CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-semibold">{attendanceRate}%</div>
              <div className="text-xs text-muted-foreground">Present today</div>
              <div className="mt-3 space-y-1 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Present</span><span>{attendance.filter(a => a.status === "present").length}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">On Leave</span><span>{attendance.filter(a => a.status === "on_leave").length}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Absent</span><span>{attendance.filter(a => a.status === "absent").length}</span></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Pending Approvals</CardTitle><Badge tone="warning">{pendingApprovals}</Badge></CardHeader>
          <CardContent className="space-y-2">
            {invoices.filter(i => i.status === "sent").slice(0, 4).map(i => (
              <div key={i.id} className="flex items-center justify-between text-sm">
                <div><div className="font-medium">{i.number}</div><div className="text-xs text-muted-foreground">{i.customerName}</div></div>
                <Badge tone={statusTone(i.status)}>{i.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Upcoming Tasks</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {tasks.slice(0, 5).map(t => (
              <div key={t.id} className="flex items-center justify-between text-sm">
                <div><div className="font-medium">{t.title}</div><div className="text-xs text-muted-foreground">{t.assignee} · {t.dueDate}</div></div>
                <Badge tone={t.priority === "high" ? "danger" : t.priority === "medium" ? "warning" : "info"}>{t.priority}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Low Stock Alerts</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {lowStock.map(p => (
              <div key={p.id} className="flex items-center justify-between text-sm">
                <div><div className="font-medium">{p.name}</div><div className="text-xs text-muted-foreground">SKU {p.sku}</div></div>
                <div className="text-right"><div className="text-destructive font-medium">{p.stock}</div><div className="text-xs text-muted-foreground">reorder {p.reorderLevel}</div></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-5">
        <Card>
          <CardHeader><CardTitle>Recent Invoices</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {invoices.map(i => (
              <div key={i.id} className="flex items-center justify-between rounded-lg border border-border p-2.5 text-sm">
                <div><div className="font-medium">{i.number}</div><div className="text-xs text-muted-foreground">{i.customerName} · {formatDate(i.issueDate)}</div></div>
                <div className="text-right"><div className="font-medium">{formatCurrency(i.total)}</div><Badge tone={statusTone(i.status)}>{i.status}</Badge></div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
