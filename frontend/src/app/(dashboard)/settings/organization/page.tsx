"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { organizationService } from "@/services";
import { formatDate } from "@/lib/utils";

export default function OrganizationPage() {
  const [org, setOrg] = useState<any>(null);

  useEffect(() => {
    organizationService.get().then(setOrg).catch(() => setOrg(null));
  }, []);

  if (!org) {
    return (
      <div>
        <PageHeader title="Organization" description="Profile, business information and configuration." />
        <div className="text-sm text-muted-foreground">Loading organization settings…</div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Organization" description="Profile, business information and configuration." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Business Information</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row k="Name" v={org.name} />
            <Row k="Industry" v={org.industry} />
            <Row k="Slug" v={org.slug} />
            <Row k="Phone" v={org.phone} />
            <Row k="Email" v={org.email} />
            <Row k="Address" v={org.address} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Localization</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row k="Currency" v={org.currency ?? "USD"} />
            <Row k="Timezone" v={org.timezone ?? "UTC"} />
            <Row k="Locale" v={org.locale ?? "en"} />
            <Row k="Fiscal Year Start" v={org.fiscal_year_start ?? org.fiscalYearStart ?? "01-01"} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v?: string }) {
  return (
    <div className="flex justify-between border-b border-border py-1.5 last:border-0">
      <span className="text-muted-foreground">{k}</span>
      <span className="font-medium">{v || "—"}</span>
    </div>
  );
}
