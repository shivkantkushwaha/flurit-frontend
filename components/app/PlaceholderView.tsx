import React from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  Layers, 
  Database, 
  Users, 
  LineChart, 
  Settings,
  LucideIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PlaceholderViewProps {
  title: string;
  icon: LucideIcon;
  targetPhase: string;
  description: string;
  intendedCapabilities: string[];
  currentStatus: string;
  nextScheduledStep: string;
}

export function PlaceholderView({
  title,
  icon: Icon,
  targetPhase,
  description,
  intendedCapabilities,
  currentStatus,
  nextScheduledStep,
}: PlaceholderViewProps) {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Return to Overview Link */}
      <div>
        <Link
          href="/app"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Back to Overview</span>
        </Link>
      </div>

      {/* Main Placeholder Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <CardTitle className="text-xl sm:text-2xl">{title}</CardTitle>
                <CardDescription className="mt-1">{description}</CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="font-mono text-xs shrink-0 self-start sm:self-auto">
              <Clock className="h-3 w-3 mr-1 text-muted-foreground" aria-hidden="true" />
              {targetPhase}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-2">
          {/* Status Callout */}
          <div className="rounded-lg border border-border bg-muted/40 p-4">
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <div>
                <span className="text-xs font-semibold text-foreground block">
                  Current Implementation Status
                </span>
                <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                  {currentStatus}
                </p>
              </div>
            </div>
          </div>

          {/* Planned Capabilities */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 font-mono">
              Documented Scope for Subsequent Phase
            </h3>
            <ul className="space-y-2.5">
              {intendedCapabilities.map((cap) => (
                <li key={cap} className="flex items-start gap-2.5 text-xs text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{cap}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Next Action Box */}
          <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Next Step: </span>
              {nextScheduledStep}
            </div>

            <Link href="/app">
              <Button variant="outline" size="sm">
                Return to Overview
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
