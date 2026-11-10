"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Database, Search, Users } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { predictionsApi } from "@/lib/api/predictions";
import type { PersistedCustomerListResponse } from "@/lib/types/api";

const money = (value: number | null) => value == null ? "—" : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

export default function CustomersPage() {
  const [result, setResult] = useState<PersistedCustomerListResponse | null>(null);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [riskTier, setRiskTier] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    predictionsApi.listCustomers({ page, search: query || undefined, risk_tier: riskTier || undefined })
      .then((data) => { if (mounted) { setResult(data); setError(null); } })
      .catch(() => { if (mounted) { setResult(null); setError("Customer intelligence could not be loaded. Confirm the API is available and you have workspace access."); } })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [query, page, riskTier, attempt]);

  return <div className="space-y-6">
    <PageHeader title="Customer intelligence" description="Persisted accounts, feature snapshots, and model assessments from completed dataset processing." badge={{ text: loading ? "Loading" : result ? `${result.total} persisted customers` : "Unavailable", variant: result?.total ? "default" : "outline" }} />
    <Card>
      <CardHeader className="pb-3"><div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><CardTitle className="text-base">Customer accounts</CardTitle><CardDescription>Only records durably stored for this workspace are shown.</CardDescription></div><form className="relative w-full sm:max-w-xs" onSubmit={(event) => { event.preventDefault(); setQuery(search.trim()); setPage(1); }}><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input type="search" aria-label="Search customers" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or account ID" className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm" /></form></div></CardHeader>
      <CardContent><div className="overflow-x-auto rounded-md border border-border"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-muted/50 text-xs text-muted-foreground"><tr><th className="px-4 py-3 font-medium">Customer / Account ID</th><th className="px-4 py-3 font-medium">Industry</th><th className="px-4 py-3 font-medium">Country</th><th className="px-4 py-3 font-medium">Segment</th><th className="px-4 py-3 font-medium">Risk</th><th className="px-4 py-3 font-medium">MRR</th></tr></thead><tbody>{result?.items.map((customer) => <tr key={customer.account_id} className="border-t border-border"><td className="px-4 py-3 font-medium"><Link className="hover:underline" href={`/app/customers/${encodeURIComponent(customer.account_id)}`}>{customer.account_name || customer.account_id}</Link>{customer.account_name && <p className="text-xs font-normal text-muted-foreground">{customer.account_id}</p>}</td><td className="px-4 py-3">{customer.industry}</td><td className="px-4 py-3">{customer.country}</td><td className="px-4 py-3">{customer.segment_name || "—"}</td><td className="px-4 py-3">{customer.risk_tier || "Not assessed"}</td><td className="px-4 py-3 tabular-nums">{money(customer.current_mrr)}</td></tr>)}</tbody></table></div>
      {!loading && (error || !result?.items.length) && <div className="mx-auto flex max-w-md flex-col items-center gap-3 py-12 text-center"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground"><Users className="h-5 w-5" /></span><div><p className="text-sm font-semibold">{error ? "Customer data unavailable" : "No persisted customer records"}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{error || "Run dataset processing successfully to persist customer intelligence for this workspace."}</p></div><Link href="/app/datasets"><Button size="sm" variant="outline">Configure a dataset <ArrowRight className="h-3.5 w-3.5" /></Button></Link></div>}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm">
          Risk tier
          <select value={riskTier} className="rounded border border-input bg-background p-1.5"
            onChange={(event) => { setRiskTier(event.target.value); setPage(1); }}>
            <option value="">All tiers</option>
            <option>High Risk</option>
            <option>Moderate Risk</option>
            <option>Low Risk</option>
          </select>
        </label>
        {error && <Button variant="outline" size="sm" onClick={() => setAttempt((n) => n + 1)}>Retry</Button>}
        {result && <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={loading || page <= 1} onClick={() => setPage((n) => n - 1)}>Previous</Button>
          <span className="text-xs text-muted-foreground">Page {result.page} of {Math.max(1, Math.ceil(result.total / result.page_size))}</span>
          <Button variant="outline" size="sm" disabled={loading || result.page * result.page_size >= result.total} onClick={() => setPage((n) => n + 1)}>Next</Button>
        </div>}
      </div></CardContent>
    </Card>
    <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Database className="h-4 w-4 text-muted-foreground" />Run an individual assessment</CardTitle><CardDescription>Assess a known account using a complete canonical feature snapshot.</CardDescription></CardHeader><CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-2xl text-xs leading-relaxed text-muted-foreground">An individual assessment is not automatically persisted because it has no uploaded customer source record to anchor it.</p><Link href="/app/customers/assess"><Button size="sm">Assess a customer <ArrowRight className="h-3.5 w-3.5" /></Button></Link></CardContent></Card>
  </div>;
}
