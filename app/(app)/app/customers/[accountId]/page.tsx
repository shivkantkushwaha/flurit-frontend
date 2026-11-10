"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, History, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { predictionsApi } from "@/lib/api/predictions";
import type { PersistedCustomerDetail, PersistedCustomerHistoryResponse } from "@/lib/types/api";

export default function CustomerDetailPage() {
  const { accountId } = useParams<{ accountId: string }>();
  const [customer, setCustomer] = useState<PersistedCustomerDetail | null>(null);
  const [history, setHistory] = useState<PersistedCustomerHistoryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let mounted = true;
    const id = decodeURIComponent(accountId);
    Promise.all([predictionsApi.getCustomer(id), predictionsApi.getCustomerHistory(id)])
      .then(([detail, records]) => { if (mounted) { setCustomer(detail); setHistory(records); } })
      .catch(() => { if (mounted) setError("This persisted customer record could not be loaded for your workspace."); });
    return () => { mounted = false; };
  }, [accountId]);
  if (error) return <div className="space-y-6"><PageHeader title="Customer unavailable" description={error} /><Link className="text-sm underline" href="/app/customers"><ArrowLeft className="mr-1 inline h-4 w-4" />Back to customers</Link></div>;
  const title = customer?.account_name || customer?.account_id || "Loading customer";
  return <div className="space-y-6"><PageHeader title={title} description={customer ? `${customer.industry} · ${customer.country} · persisted customer intelligence` : "Loading persisted customer intelligence"} /><Link className="text-sm text-muted-foreground hover:underline" href="/app/customers"><ArrowLeft className="mr-1 inline h-4 w-4" />Back to customers</Link>
    {customer && <><section className="grid gap-4 sm:grid-cols-3"><Metric label="Risk tier" value={customer.risk_tier || "Not assessed"} /><Metric label="Risk score" value={customer.risk_score == null ? "—" : customer.risk_score.toFixed(3)} /><Metric label="Current MRR" value={customer.current_mrr == null ? "—" : `$${customer.current_mrr.toLocaleString()}`} /></section>
    <section className="grid gap-4 lg:grid-cols-2"><Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><ShieldAlert className="h-4 w-4" />Assessment explanation</CardTitle><CardDescription>Stored model explanation from the latest persisted assessment.</CardDescription></CardHeader><CardContent className="space-y-3 text-sm"><p>{customer.explanation_summary || "No persisted explanation is available for this customer."}</p>{customer.top_risk_factors.length > 0 && <ul className="list-disc space-y-1 pl-5 text-xs text-muted-foreground">{customer.top_risk_factors.slice(0, 5).map((factor, index) => <li key={index}>{String(factor.feature_name || "Feature")} {typeof factor.attribution === "number" ? `(${factor.attribution.toFixed(4)})` : ""}</li>)}</ul>}<p className="text-xs text-muted-foreground">{customer.score_interpretation || "No model-score interpretation was returned."}</p></CardContent></Card><Card><CardHeader><CardTitle className="text-base">Subscriptions</CardTitle><CardDescription>Persisted source subscription records.</CardDescription></CardHeader><CardContent>{customer.subscriptions.length ? <ul className="space-y-2 text-sm">{customer.subscriptions.map((subscription) => <li key={subscription.subscription_id} className="rounded-md border border-border p-2"><span className="font-medium">{subscription.subscription_id}</span><span className="ml-2 text-muted-foreground">${subscription.mrr_amount.toLocaleString()} MRR · {subscription.billing_frequency}</span></li>)}</ul> : <p className="text-sm text-muted-foreground">No subscriptions were persisted.</p>}</CardContent></Card></section>
    <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><History className="h-4 w-4" />Assessment history</CardTitle><CardDescription>Historical model runs stored for this customer.</CardDescription></CardHeader><CardContent>{history?.items.length ? <ul className="space-y-2">{history.items.map((item) => <li key={item.prediction_id} className="flex flex-wrap justify-between gap-2 rounded-md border border-border p-3 text-sm"><span>{item.snapshot_date || "No snapshot date"} · {item.model_name} v{item.model_version}</span><span>{item.risk_tier} · {item.risk_score.toFixed(3)}</span></li>)}</ul> : <p className="text-sm text-muted-foreground">No stored assessment history.</p>}</CardContent></Card></>}
  </div>;
}

function Metric({ label, value }: { label: string; value: string }) { return <Card><CardHeader className="pb-2"><CardDescription>{label}</CardDescription><CardTitle className="text-xl">{value}</CardTitle></CardHeader></Card>; }
