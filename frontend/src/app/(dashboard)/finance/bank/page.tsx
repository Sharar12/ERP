"use client";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { bankAccountService } from "@/services";
import { formatCurrency } from "@/lib/utils";

export default function BankPage() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { bankAccountService.getAll().then(setRows); }, []);
  return (
    <div>
      <PageHeader title="Bank Accounts" description="Cash position across accounts." />
      <div className="grid gap-4 md:grid-cols-3">
        {rows.map(b => (
          <Card key={b.id}>
            <CardContent>
              <div className="text-xs text-muted-foreground">{b.bank}</div>
              <div className="font-semibold">{b.name}</div>
              <div className="text-xs text-muted-foreground">{b.number}</div>
              <div className="mt-3 text-2xl font-semibold">{formatCurrency(b.balance)}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

