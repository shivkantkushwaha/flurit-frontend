
import React from "react";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const signalBars = [
  28, 42, 35, 57, 48, 67, 54, 74, 61, 82, 69, 91,
  72, 84, 63, 77, 58, 72, 49, 65, 42, 55, 34, 46,
];

const heatCells = Array.from({ length: 63 }, (_, index) => {
  const column = index % 9;
  const row = Math.floor(index / 9);

  const distance =
    Math.abs(column - 5) * 0.1 + Math.abs(row - 3) * 0.17;

  return {
    id: index,
    opacity: Math.max(0.12, 0.82 - distance),
    accent: (column * 3 + row * 5) % 11 === 0,
  };
});

function RetentionSignalVisual() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto aspect-[1.15/1] w-full max-w-[490px] overflow-hidden rounded-2xl border border-white/[0.11] bg-[#101725] shadow-[0_30px_100px_-45px_rgba(0,0,0,0.8)]"
    >
      {/* Background texture */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_35%,rgba(99,102,241,0.17),transparent_50%),radial-gradient(ellipse_at_15%_90%,rgba(124,58,237,0.12),transparent_42%)]" />

      {/* Contour lines */}
      <svg
        viewBox="0 0 490 420"
        className="absolute inset-0 h-full w-full opacity-50"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M-90 290 C40 160 120 365 250 225 S425 105 570 195"
          stroke="rgba(167,139,250,0.36)"
          strokeWidth="1"
        />
        <path
          d="M-90 315 C40 185 120 390 250 250 S425 130 570 220"
          stroke="rgba(167,139,250,0.25)"
          strokeWidth="1"
        />
        <path
          d="M-90 340 C40 210 120 415 250 275 S425 155 570 245"
          stroke="rgba(167,139,250,0.16)"
          strokeWidth="1"
        />
        <path
          d="M-50 95 C80 20 150 155 260 85 S430 20 540 90"
          stroke="rgba(129,140,248,0.18)"
          strokeWidth="1"
        />
      </svg>

      {/* Structured signal field */}
      <div className="absolute left-1/2 top-[12%] grid w-[174px] -translate-x-1/2 grid-cols-9 gap-[5px] sm:w-[195px] sm:gap-[6px]">
        {heatCells.map((cell) => (
          <span
            key={cell.id}
            className={`aspect-square rounded-[3px] ${
              cell.accent ? "bg-violet-300" : "bg-indigo-300"
            }`}
            style={{ opacity: cell.opacity }}
          />
        ))}
      </div>

      {/* Central analytical ring */}
      <div className="absolute left-1/2 top-[46%] h-36 w-36 -translate-x-1/2 -translate-y-1/2 sm:h-44 sm:w-44">
        <div className="absolute inset-0 rounded-full border border-white/[0.09]" />

        <div className="absolute inset-[12%] rounded-full border border-indigo-300/20" />

        <div className="absolute inset-[24%] rounded-full border border-violet-300/25" />

        <div className="absolute inset-[36%] rounded-full bg-gradient-to-br from-indigo-400/25 via-violet-400/10 to-transparent blur-md" />

        <div className="absolute inset-0 rounded-full border border-transparent bg-[conic-gradient(from_210deg,transparent_0deg,rgba(139,92,246,0.75)_100deg,transparent_165deg,rgba(99,102,241,0.55)_250deg,transparent_310deg)] [mask:radial-gradient(farthest-side,transparent_calc(100%-1px),black_calc(100%-1px))] motion-reduce:animate-none [animation:spin_36s_linear_infinite]" />

        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-300 shadow-[0_0_22px_5px_rgba(167,139,250,0.45)]" />
      </div>

      {/* Analytical bars */}
      <div className="absolute inset-x-7 bottom-7 flex h-[76px] items-end justify-between gap-[5px] sm:inset-x-9 sm:bottom-9 sm:h-[94px] sm:gap-2">
        {signalBars.map((height, index) => (
          <div
            key={index}
            className="flex-1 rounded-t-[3px] bg-gradient-to-t from-indigo-500/20 via-indigo-400/60 to-violet-300/90"
            style={{
              height: `${height}%`,
              opacity: index > 17 ? 0.45 : 0.85,
            }}
          />
        ))}
      </div>

      <div className="absolute inset-x-7 bottom-7 h-px bg-white/20 sm:inset-x-9 sm:bottom-9" />

      {/* Edge highlights */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/60 to-transparent" />
      <div className="absolute bottom-0 left-0 top-0 w-px bg-gradient-to-b from-transparent via-white/[0.08] to-transparent" />
    </div>
  );
}

export function FinalCTA() {
  return (
    <section className="relative isolate overflow-hidden border-y border-white/[0.08] bg-[#0a0d16] text-white">
      {/* Restrained section atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_12%_50%,rgba(79,70,229,0.13),transparent_43%),radial-gradient(ellipse_at_90%_20%,rgba(124,58,237,0.09),transparent_38%)]" />

        <div className="absolute inset-0 opacity-[0.12] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:80px_80px] [mask-image:linear-gradient(to_right,black,transparent_80%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">

          {/* CTA content */}
          <div className="max-w-[620px]">
            <h2 className="text-4xl font-bold leading-[1.1] tracking-[-0.045em] text-white text-balance sm:text-5xl lg:text-[3.4rem]">
              Ready to explore explainable retention intelligence?
            </h2>

            <p className="mt-6 max-w-[570px] text-[15px] leading-7 text-slate-300 sm:text-base">
              Inspect our transparent risk ranking tables, review SHAP directional attributions, and see how Revenue at Risk heuristics focus Customer Success resources.
            </p>

            {/* Balanced actions */}
            <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
              <a href="#product" className="w-full sm:w-[228px]">
                <Button
                  size="lg"
                  className="h-12 w-full gap-2 whitespace-nowrap rounded-md border border-white bg-white px-5 text-sm font-semibold text-slate-950 shadow-none transition-colors hover:bg-slate-200 hover:text-slate-950"
                >
                  <span>View Sample Analysis</span>
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </Button>
              </a>

              <AuthDialog
                label="Sign In to Platform"
                className="h-12 w-full whitespace-nowrap rounded-md border border-white/25 bg-white/[0.04] px-5 text-sm font-semibold text-white shadow-none transition-colors hover:border-white/50 hover:bg-white/[0.09] hover:text-white sm:w-[228px]"
              />
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex flex-wrap gap-x-7 gap-y-4 border-t border-white/[0.12] pt-6 text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                Synthetic benchmark sandbox
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                Zero lookahead data leakage
              </span>

              <span className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                Transparent mathematical surrogate
              </span>
            </div>
          </div>

          {/* Custom retention visual */}
          <div className="relative lg:pl-2">
            <div
              aria-hidden="true"
              className="absolute -inset-8 rounded-full bg-indigo-500/[0.07] blur-[80px]"
            />
            <RetentionSignalVisual />
          </div>

        </div>
      </div>
    </section>
  );
}
