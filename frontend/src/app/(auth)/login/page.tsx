"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Card, CardContent } from "@/components/ui/card";
import { authService } from "@/services";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("sarah@acme.example");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    /* MOCK AUTH — API REPLACEMENT: POST /api/v1/auth/login */
    await authService.login(email, password);
    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-dots bg-muted/30 p-4">
      <Card className="w-full max-w-sm">
        <CardContent className="p-6">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 h-10 w-10 rounded-xl bg-accent" />
            <h1 className="text-lg font-semibold">Sign in to Universal ERP</h1>
            <p className="mt-1 text-xs text-muted-foreground">Use any credentials — mock auth is enabled.</p>
          </div>
          <form onSubmit={submit} className="space-y-3">
            <Field label="Email" required><Input value={email} onChange={e => setEmail(e.target.value)} /></Field>
            <Field label="Password" required><Input type="password" value={password} onChange={e => setPassword(e.target.value)} /></Field>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

