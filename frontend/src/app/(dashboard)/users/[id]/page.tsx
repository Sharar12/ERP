"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/tables/data-table";
import { MOCK_USERS, MOCK_ROLES } from "@/mock-data/seed";
import { MOCK_LOGIN_HISTORY } from "@/mock-data/extended-seed";
import { formatDate } from "@/lib/utils";

const lhColumns: Column<any>[] = [
  { key: "at", header: "When", sortValue: r => r.at, cell: r => new Date(r.at).toLocaleString() },
  { key: "ip", header: "IP", cell: r => r.ip },
  { key: "agent", header: "Agent", cell: r => r.agent },
  { key: "status", header: "Status", cell: r => <Badge tone={r.status === "success" ? "success" : "danger"}>{r.status}</Badge> },
];

export default function UserDetailPage() {
  const params = useParams();
  const [user, setUser] = useState<any>(null);
  useEffect(() => { setUser(MOCK_USERS.find(u => u.id === params.id) ?? MOCK_USERS[0]); }, [params.id]);
  if (!user) return null;
  const role = MOCK_ROLES.find(r => r.id === user.roleId);

  return (
    <div>
      <PageHeader title={user.name} description={user.email} />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Account</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row k="Status" v={<Badge tone={user.status === "active" ? "success" : "muted"}>{user.status}</Badge>} />
            <Row k="Role" v={role?.name ?? "—"} />
            <Row k="Joined" v={formatDate(user.createdAt)} />
            <Row k="Phone" v={user.phone ?? "—"} />
          </CardContent>
        </Card>
        <div className="lg:col-span-2">
          <Tabs tabs={[
            { key: "logins", label: "Login History", content: <DataTable data={MOCK_LOGIN_HISTORY} columns={lhColumns} searchKeys={["ip", "agent"]} /> },
            { key: "permissions", label: "Permissions", content: (
              <Card><CardContent className="space-y-2">
                <div className="text-sm font-medium">Assigned Role: {role?.name}</div>
                <div className="flex flex-wrap gap-1">
                  {role?.permissions.map((p: string) => <Badge key={p} tone="info">{p}</Badge>)}
                </div>
              </CardContent></Card>
            ) },
          ]} />
        </div>
      </div>
    </div>
  );
}
function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return <div className="flex justify-between border-b border-border py-1.5 last:border-0"><span className="text-muted-foreground">{k}</span><span className="font-medium">{v}</span></div>;
}

