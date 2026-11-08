"use client";
import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";

export default function PreferencesPage() {
  const { push } = useToast();
  const [currency, setCurrency] = useState("USD");
  const [dateFormat, setDateFormat] = useState("YYYY-MM-DD");
  const [timezone, setTimezone] = useState("America/New_York");
  const [emailNotifs, setEmailNotifs] = useState(true);

  const handleSave = () => {
    push("System preferences saved successfully!", "success");
  };

  return (
    <div>
      <PageHeader
        title="System Preferences"
        description="Configure localization, display formats, currency conventions, and notifications."
      />
      <div className="max-w-2xl space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Localization & Formats</CardTitle>
            <CardDescription>Configure currency symbols, timezone offsets, and date styling.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Base Currency</label>
              <Select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
              >
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
                <option value="JPY">JPY (¥) - Japanese Yen</option>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Date Display Format</label>
              <Select
                value={dateFormat}
                onChange={e => setDateFormat(e.target.value)}
              >
                <option value="YYYY-MM-DD">YYYY-MM-DD (2026-04-15)</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY (04/15/2026)</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY (15/04/2026)</option>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">System Timezone</label>
              <Select
                value={timezone}
                onChange={e => setTimezone(e.target.value)}
              >
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="America/New_York">America/New_York (EST)</option>
                <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                <option value="Europe/London">Europe/London (GMT/BST)</option>
                <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Default notification dispatch controls for organization members.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifs}
                onChange={e => setEmailNotifs(e.target.checked)}
                className="rounded border-border"
              />
              <span>Send transactional email digests for low stock and pending approvals</span>
            </label>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
