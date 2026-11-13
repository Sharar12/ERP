"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/tables/data-table";
import { userService, roleService, loginHistoryService } from "@/services";
import { formatDate } from "@/lib/utils";

const lhColumns: Column<any>[] = [
  { key: "at", header: "When", sortValue: r => r.logged_in_at ?? r.at, cell: r => new Date(r.logged_in_at ?? r.at).toLocaleString() },
  { key: "ip", header: "IP", cell: r => r.ip_address ?? r.ip },
  { key: "agent", header: "Agent", cell: r => r.user_agent ?? r.agent },
  { key: "status", header: "Status", cell: r => <Badge tone={r.status === "success" ? "success" : "danger"}>{r.status}</Badge> },
];

export default function UserDetailPage() {
  const params = useParams();
  const [user, setUser] = useState<any>(null);
  const [roles, setRoles] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    userService.getById(params.id as string).then(setUser).catch(() => setUser(null));
    roleService.getAll().then(setRoles).catch(() => setRoles([]));
    loginHistoryService.getAll().then(setHistory).catch(() => setHistory([]));
  }, [params.id]);

  if (!user) return null;
  const role = roles.find(r => String(r.id) === String(user.roleId ?? user.role_id)) ?? user.roles?.[0];

  return (
    <div>
      <PageHeader title={user.name} description={user.email} />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Account</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row k="Status" v={<Badge tone={user.status === "active" ? "success" : "muted"}>{user.status}</Badge>} />
            <Row k="Role" v={role?.name ?? user.role ?? "—"} />
            <Row k="Email" v={user.email} />
            <Row k="Member Since" v={formatDate(user.createdAt ?? user.created_at)} />
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Login History</CardTitle></CardHeader>
          <CardContent>
            <DataTable data={history} columns={lhColumns} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex justify-between border-b border-border py-1.5 last:border-0">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium">{v}</span>
    </div>
  );
}
