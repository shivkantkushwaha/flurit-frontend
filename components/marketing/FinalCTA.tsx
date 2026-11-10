import React from "react";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="py-16 md:py-20 border-b border-border bg-gradient-to-b from-background to-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8 sm:p-12 text-center shadow-sm">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl text-balance">
            Ready to explore explainable retention intelligence?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed text-balance">
            Inspect our transparent risk ranking tables, review SHAP directional attributions, and see how Revenue at Risk heuristics focus Customer Success resources.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#product" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto gap-2 text-base px-6">
                <span>View Sample Analysis</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </a>
            <AuthDialog label="Sign In to Platform" className="w-full sm:w-auto text-base px-6" />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
              Synthetic benchmark sandbox
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
              Zero lookahead data leakage
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
              Transparent mathematical surrogate
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
