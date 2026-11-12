"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type Transition,
  type Variants,
} from "framer-motion";
import { ArrowRight, CheckCircle2, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

/* -------------------------------------------------------------------------- */
/*  Illustrative sample data (not real customers)                              */
/* -------------------------------------------------------------------------- */

// Same order for every account so the SHAP bars line up as the selection changes.
// Positive impact = pushes churn risk up, negative = pulls it down.
const FACTOR_LABELS = [
  "Usage trend",
  "Support tickets",
  "Seat utilization",
  "Login recency",
  "Contract tenure",
] as const;

type Account = {
  id: string;
  name: string;
  plan: string;
  mrr: number;
  risk: number[]; // 60-day risk %, one value per simulated refresh
  shap: number[]; // -1..1, aligned with FACTOR_LABELS
};

const ACCOUNTS: Account[] = [
  { id: "meridian", name: "Meridian Health", plan: "Enterprise", mrr: 4200, risk: [82, 84, 87, 88], shap: [0.62, 0.85, 0.35, 0.2, -0.3] },
  { id: "atlas", name: "Atlas Freight", plan: "Growth", mrr: 3100, risk: [71, 79, 85, 90], shap: [0.9, 0.28, -0.15, 0.55, -0.22] },
  { id: "northwind", name: "Northwind Labs", plan: "Growth", mrr: 1800, risk: [64, 60, 58, 55], shap: [0.12, 0.3, 0.5, -0.1, -0.45] },
  { id: "kestrel", name: "Kestrel Analytics", plan: "Enterprise", mrr: 5200, risk: [58, 63, 70, 76], shap: [0.7, 0.25, 0.6, 0.15, -0.35] },
  { id: "lumen", name: "Lumen Retail", plan: "Starter", mrr: 900, risk: [47, 44, 41, 39], shap: [-0.4, 0.2, 0.15, -0.3, -0.6] },
  { id: "orbit", name: "Orbit Payments", plan: "Growth", mrr: 2600, risk: [29, 27, 31, 33], shap: [-0.55, 0.15, -0.5, -0.2, -0.3] },
];

const FRAMES = 4;
const MAX_MRR = 6000;

type Tier = "High" | "Medium" | "Low";
const tierOf = (r: number): Tier => (r >= 70 ? "High" : r >= 45 ? "Medium" : "Low");
const TIER_BAR: Record<Tier, string> = {
  High: "bg-rose-500",
  Medium: "bg-amber-500",
  Low: "bg-emerald-500",
};
const TIER_TEXT: Record<Tier, string> = {
  High: "text-rose-600 dark:text-rose-400",
  Medium: "text-amber-600 dark:text-amber-400",
  Low: "text-emerald-600 dark:text-emerald-400",
};
const fmtMrr = (mrr: number) => `$${(mrr / 1000).toFixed(1)}k`;

/* -------------------------------------------------------------------------- */
/*  Small helpers                                                              */
/* -------------------------------------------------------------------------- */

function useFrame(count: number, active: boolean, intervalMs: number) {
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => setFrame((f) => (f + 1) % count), intervalMs);
    return () => clearInterval(id);
  }, [count, active, intervalMs]);
  return frame;
}

function Counter({ value, reduce }: { value: number; reduce: boolean }) {
  const mv = useMotionValue(value);
  const text = useTransform(mv, (v) => Math.round(v).toString());
  useEffect(() => {
    const controls = animate(mv, value, { duration: reduce ? 0 : 0.9, ease: "easeOut" });
    return () => controls.stop();
  }, [value, reduce, mv]);
  return <motion.span>{text}</motion.span>;
}

/* -------------------------------------------------------------------------- */
/*  Animated risk preview: ranking + SHAP drivers + value x risk matrix        */
/* -------------------------------------------------------------------------- */

function RiskPreview({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-80px" });
  const [pinned, setPinned] = useState<string | null>(null);

  // Advance the simulated refresh only while visible, not hovered, and motion is allowed.
  const frame = useFrame(FRAMES, inView && pinned === null && !reduce, 3200);

  const rows = useMemo(
    () => ACCOUNTS.map((a) => ({ ...a, score: a.risk[frame] })).sort((a, b) => b.score - a.score),
    [frame]
  );

  const activeId = pinned ?? rows[0].id;
  const active = rows.find((r) => r.id === activeId) ?? rows[0];

  const spring: Transition = reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 34 };
  const barT: Transition = reduce ? { duration: 0 } : { duration: 0.9, ease: "easeOut" };

  return (
    <motion.div
      ref={ref}
      variants={ITEM}
      className="relative mx-auto mt-14 max-w-5xl text-left"
    >
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {/* Panel header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              {!reduce && (
                <motion.span
                  className="absolute inset-0 rounded-full bg-emerald-500"
                  animate={{ scale: [1, 2.6], opacity: [0.5, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                />
              )}
              <span className="relative h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-sm font-medium text-foreground">
              Accounts ranked by 60-day churn risk
            </span>
          </div>
          <span className="rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-xs text-muted-foreground">
            Illustrative sample data
          </span>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:divide-x lg:divide-border">
          {/* Ranked list */}
          <ul
            className="space-y-1 p-3"
            aria-label="Sample accounts ranked by 60-day churn risk"
            onMouseLeave={() => setPinned(null)}
            onBlur={(e: React.FocusEvent<HTMLUListElement>) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPinned(null);
            }}
          >
            {rows.map((row, i) => {
              const t = tierOf(row.score);
              const isActive = row.id === activeId;
              return (
                <motion.li key={row.id} layout transition={spring}>
                  <button
                    type="button"
                    onMouseEnter={() => setPinned(row.id)}
                    onFocus={() => setPinned(row.id)}
                    onClick={() => setPinned(row.id)}
                    className={`w-full rounded-lg border px-3 py-2.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      isActive ? "border-border bg-muted/70" : "border-transparent hover:bg-muted/40"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 w-4 text-xs tabular-nums text-muted-foreground">{i + 1}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="truncate text-sm font-medium text-foreground">{row.name}</span>
                          <span className={`text-sm font-semibold tabular-nums ${TIER_TEXT[t]}`}>
                            <Counter value={row.score} reduce={reduce} />%
                          </span>
                        </div>
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                          <motion.div
                            className={`h-full rounded-full ${TIER_BAR[t]}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${row.score}%` }}
                            transition={barT}
                          />
                        </div>
                        <div className="mt-1 flex justify-between text-[11px] text-muted-foreground">
                          <span>{row.plan}</span>
                          <span>{fmtMrr(row.mrr)} MRR</span>
                        </div>
                      </div>
                    </div>
                  </button>
                </motion.li>
              );
            })}
          </ul>

          {/* Right column: SHAP drivers + matrix */}
          <div className="flex flex-col divide-y divide-border border-t border-border lg:border-t-0">
            {/* SHAP */}
            <div className="p-4">
              <div className="flex items-baseline justify-between gap-2">
                <p className="truncate text-sm font-semibold text-foreground">{active.name}</p>
                <p className="shrink-0 text-xs text-muted-foreground">Directional SHAP attribution</p>
              </div>

              <div key={active.id} className="mt-4 space-y-2">
                {FACTOR_LABELS.map((label, i) => {
                  const v = active.shap[i];
                  const up = v >= 0;
                  return (
                    <div key={label} className="flex items-center gap-3">
                      <span className="w-28 shrink-0 text-xs text-muted-foreground">{label}</span>
                      <div className="relative h-5 flex-1">
                        <span className="absolute inset-y-0 left-1/2 w-px bg-border" aria-hidden="true" />
                        <motion.span
                          className={`absolute inset-y-0.5 rounded-sm ${
                            up ? "left-1/2 bg-rose-500" : "right-1/2 bg-emerald-500"
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.abs(v) * 50}%` }}
                          transition={{
                            duration: reduce ? 0 : 0.6,
                            delay: reduce ? 0 : i * 0.07,
                            ease: "easeOut",
                          }}
                        />
                      </div>
                      <span
                        className={`w-10 text-right text-xs tabular-nums ${
                          up ? TIER_TEXT.High : TIER_TEXT.Low
                        }`}
                      >
                        {up ? "+" : "\u2212"}
                        {Math.abs(v).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-center gap-5 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-sm bg-emerald-500" aria-hidden="true" />
                  Lowers risk
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-sm bg-rose-500" aria-hidden="true" />
                  Raises risk
                </span>
              </div>
            </div>

            {/* Value x Risk matrix */}
            <div className="hidden p-4 sm:block">
              <p className="text-sm font-semibold text-foreground">Value × Risk matrix</p>
              <div className="mt-3 grid grid-cols-[auto_1fr] gap-x-2 gap-y-1">
                <span className="row-start-1 self-center text-[11px] text-muted-foreground [writing-mode:vertical-rl] rotate-180">
                  60-day risk
                </span>
                <div className="relative h-40 rounded-md border border-border bg-muted/30">
                  {/* quadrant: high value, high risk */}
                  <div className="absolute right-0 top-0 h-1/2 w-1/2 rounded-tr-md bg-rose-500/10" aria-hidden="true" />
                  <span className="absolute right-2 top-1.5 text-[11px] font-medium text-rose-600 dark:text-rose-400">
                    Act first
                  </span>
                  <span className="absolute inset-y-0 left-1/2 w-px bg-border" aria-hidden="true" />
                  <span className="absolute inset-x-0 top-1/2 h-px bg-border" aria-hidden="true" />

                  {rows.map((r, idx) => {
                    const x = Math.min(92, Math.max(8, (r.mrr / MAX_MRR) * 100));
                    const y = Math.min(92, Math.max(8, r.score));
                    const t = tierOf(r.score);
                    const hot = r.score >= 50 && r.mrr >= MAX_MRR / 2;
                    const isActive = r.id === activeId;
                    return (
                      <motion.div
                        key={r.id}
                        className="absolute h-2.5 w-2.5"
                        style={{ x: "-50%", y: "50%", zIndex: isActive ? 10 : 1 }}
                        initial={{ left: `${x}%`, bottom: "8%", opacity: 0 }}
                        animate={{ left: `${x}%`, bottom: `${y}%`, opacity: 1 }}
                        transition={
                          reduce
                            ? { duration: 0 }
                            : { type: "spring", stiffness: 55, damping: 15, delay: idx * 0.08 }
                        }
                      >
                        {hot && !reduce && (
                          <motion.span
                            aria-hidden="true"
                            className="absolute inset-0 rounded-full bg-rose-500"
                            animate={{ scale: [1, 3], opacity: [0.45, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                          />
                        )}
                        <motion.span
                          className={`relative block h-2.5 w-2.5 rounded-full ${TIER_BAR[t]} ${
                            isActive ? "ring-2 ring-foreground ring-offset-1 ring-offset-card" : ""
                          }`}
                          animate={{ scale: isActive ? 1.4 : 1 }}
                          transition={{ duration: reduce ? 0 : 0.25 }}
                        />
                        {isActive && (
                          <span
                            className={`absolute bottom-full mb-1.5 whitespace-nowrap rounded border border-border bg-card px-1.5 py-0.5 text-[10px] text-foreground shadow-xs ${
                              x > 55 ? "right-0" : "left-0"
                            }`}
                          >
                            {r.name}
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
                <span className="col-start-2 text-center text-[11px] text-muted-foreground">
                  Monthly revenue at stake
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        Illustrative accounts. Scores refresh on a simulated schedule to show how rankings re-sort. Hover a row to inspect it.
      </p>
    </motion.div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page-load orchestration + backdrop                                         */
/* -------------------------------------------------------------------------- */

const CONTAINER: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const ITEM: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

/* Retention curves: the ambient layer behind the headline. Healthy accounts stay
   high, one declines slowly, and two fall off a cliff (churn) with a pulsing marker. */
type Curve = { d: string; tone: "ok" | "warn" | "churn"; dur: number; begin: number };

const CURVES: Curve[] = [
  { d: "M0,120 C300,112 620,140 940,158 S1300,190 1440,198", tone: "ok", dur: 14, begin: 2.6 },
  { d: "M0,180 C320,176 640,214 960,236 S1320,262 1440,272", tone: "ok", dur: 17, begin: 4.1 },
  { d: "M0,240 C300,246 560,300 820,338 S1250,392 1440,408", tone: "warn", dur: 15, begin: 3.4 },
  { d: "M0,150 C260,152 520,170 700,196 C760,205 790,300 820,380 C860,470 1100,486 1440,492", tone: "churn", dur: 13, begin: 2.9 },
  { d: "M0,300 C280,304 560,318 960,336 C1030,342 1060,420 1085,470 S1240,540 1440,548", tone: "churn", dur: 16, begin: 5 },
];

// Points on the two "churn" curves where the drop happens.
const CHURN_POINTS = [
  { x: 771, y: 261 },
  { x: 1039, y: 386 },
];

const TONE_STROKE: Record<Curve["tone"], string> = {
  ok: "stroke-emerald-500/40",
  warn: "stroke-amber-500/45",
  churn: "stroke-rose-500/55",
};
const TONE_FILL: Record<Curve["tone"], string> = {
  ok: "fill-emerald-500",
  warn: "fill-amber-500",
  churn: "fill-rose-500",
};

const SIGNAL_LINKS = [
  "M180 150 C300 70 390 110 500 170",
  "M500 170 C610 220 690 95 810 120",
  "M810 120 C930 145 1010 65 1130 130",
  "M260 390 C380 310 450 390 570 330",
  "M570 330 C700 265 780 380 900 310",
  "M900 310 C1020 245 1110 340 1250 260",
  "M180 150 C200 260 230 315 260 390",
  "M500 170 C510 230 535 275 570 330",
  "M810 120 C830 190 860 250 900 310",
  "M1130 130 C1160 185 1200 225 1250 260",
];

const SIGNAL_NODES = [
  { x: 180, y: 150, tone: "ok" },
  { x: 500, y: 170, tone: "warn" },
  { x: 810, y: 120, tone: "ok" },
  { x: 1130, y: 130, tone: "churn" },
  { x: 260, y: 390, tone: "ok" },
  { x: 570, y: 330, tone: "warn" },
  { x: 900, y: 310, tone: "churn" },
  { x: 1250, y: 260, tone: "ok" },
] as const;

function RetentionCurves({ reduce }: { reduce: boolean }) {
  const mask = "radial-gradient(ellipse 95% 90% at 50% 32%, black 24%, transparent 100%)";

  return (
    <div
      className="absolute inset-x-0 top-0 h-[640px]"
      style={{ maskImage: mask, WebkitMaskImage: mask }}
      aria-hidden="true"
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1440 640"
        preserveAspectRatio="xMidYMin slice"
        fill="none"
      >
        {/* Fine telemetry connections form a quiet data network. */}
        {SIGNAL_LINKS.map((d, i) => (
          <g key={`signal-${i}`}>
            <motion.path
              d={d}
              strokeWidth={1}
              className="stroke-primary/20"
              initial={reduce ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.65 }}
              transition={{ duration: 2.2, delay: 0.25 + i * 0.09, ease: "easeInOut" }}
            />
            {!reduce && (
              <circle r="2.2" className="fill-primary/70" opacity="0">
                <animateMotion
                  dur={`${8 + (i % 4) * 2}s`}
                  begin={`${i * 0.65}s`}
                  repeatCount="indefinite"
                  path={d}
                />
                <animate
                  attributeName="opacity"
                  values="0;0.8;0.8;0"
                  keyTimes="0;0.08;0.88;1"
                  dur={`${8 + (i % 4) * 2}s`}
                  begin={`${i * 0.65}s`}
                  repeatCount="indefinite"
                />
              </circle>
            )}
          </g>
        ))}

        {/* Customer signal nodes: healthy, watchlist, and elevated-risk states. */}
        {SIGNAL_NODES.map((node, i) => {
          const tone =
            node.tone === "ok"
              ? "fill-emerald-500"
              : node.tone === "warn"
                ? "fill-amber-500"
                : "fill-rose-500";

          return (
            <g key={`node-${i}`}>
              {!reduce && (
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r="5"
                  className={tone}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: [0.08, 0.2, 0.08], scale: [0.85, 1.15, 0.85] }}
                  transition={{
                    duration: 3.8 + (i % 3) * 0.7,
                    delay: i * 0.22,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                />
              )}
              <circle cx={node.x} cy={node.y} r="2.5" className={tone} opacity="0.75" />
              {!reduce && node.tone !== "ok" && (
                <circle cx={node.x} cy={node.y} r="3" className={tone} opacity="0">
                  <animate
                    attributeName="r"
                    values="3;13"
                    dur={`${3.2 + i * 0.15}s`}
                    begin={`${i * 0.4}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.28;0"
                    dur={`${3.2 + i * 0.15}s`}
                    begin={`${i * 0.4}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              )}
            </g>
          );
        })}

        {/* Retention trajectories: green stays stable, amber weakens, rose drops. */}
        {CURVES.map((c, i) => (
          <motion.path
            key={`curve-${i}`}
            d={c.d}
            strokeWidth={1.35}
            strokeLinecap="round"
            className={TONE_STROKE[c.tone]}
            initial={reduce ? false : { pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.75 }}
            transition={{ duration: 2.4, delay: 0.5 + i * 0.22, ease: "easeInOut" }}
          />
        ))}

        {!reduce &&
          CURVES.map((c, i) => (
            <circle key={`trajectory-dot-${i}`} r="3" className={TONE_FILL[c.tone]} opacity="0">
              <animateMotion
                dur={`${c.dur}s`}
                begin={`${c.begin}s`}
                repeatCount="indefinite"
                path={c.d}
              />
              <animate
                attributeName="opacity"
                values="0;0.85;0.85;0"
                keyTimes="0;0.06;0.94;1"
                dur={`${c.dur}s`}
                begin={`${c.begin}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}

        {CHURN_POINTS.map((p, i) => (
          <g key={`churn-${i}`}>
            <motion.circle
              cx={p.x}
              cy={p.y}
              r={4}
              className="fill-rose-500"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 2.6 + i * 0.4, duration: 0.5 }}
            />
            {!reduce && (
              <circle cx={p.x} cy={p.y} r={4} className="fill-rose-500" opacity={0}>
                <animate
                  attributeName="r"
                  values="4;20"
                  dur="3s"
                  begin={`${2.8 + i * 0.5}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0.35;0"
                  dur="3s"
                  begin={`${2.8 + i * 0.5}s`}
                  repeatCount="indefinite"
                />
              </circle>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}

function Backdrop({ reduce }: { reduce: boolean }) {
  const line = "color-mix(in oklab, var(--border) 55%, transparent)";
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, ${line} 1px, transparent 1px), linear-gradient(to bottom, ${line} 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 76% 62% at 50% 0%, black 22%, transparent 76%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, black 30%, transparent 75%)",
        }}
      />
      <RetentionCurves reduce={reduce} />
      {/* Soft halo so lines stay faint directly behind the text */}
      <div className="absolute left-1/2 top-8 h-[430px] w-[880px] max-w-full -translate-x-1/2 rounded-full bg-background/60 blur-2xl" />
      <div className="absolute inset-x-0 top-0 flex justify-center">
        <motion.div
          className="h-[380px] w-[760px] max-w-full rounded-full bg-primary/[0.08] blur-3xl"
          animate={reduce ? undefined : { x: [-40, 40] }}
          transition={{ duration: 12, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

const HIGHLIGHTS = [
  { title: "60-Day Horizon", sub: "Actionable runway" },
  { title: "SHAP Explainability", sub: "Factor attribution" },
  { title: "Revenue Weighted", sub: "Value × Risk matrix" },
  { title: "Zero Data Leakage", sub: "Strict snapshot dates" },
];

/* -------------------------------------------------------------------------- */
/*  Hero                                                                       */
/* -------------------------------------------------------------------------- */

export function HeroSection() {
  const reduce = !!useReducedMotion();

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-border bg-gradient-to-b from-muted/30 to-background">
      <Backdrop reduce={reduce} />

      <motion.div
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        variants={CONTAINER}
        initial={reduce ? false : "hidden"}
        animate="show"
      >
        <div className="mx-auto max-w-3xl text-center">
          {/* Transparent Dataset Origin Pill */}
          <motion.div
            variants={ITEM}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1 text-xs text-muted-foreground shadow-xs mb-6"
          >
            <Database className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span>Built on synthetic RavenStack SaaS benchmark telemetry</span>
            <span className="inline-block h-1 w-1 rounded-full bg-border" aria-hidden="true" />
            <a
              href="#methodology"
              className="font-medium text-foreground hover:underline inline-flex items-center gap-1"
            >
              Learn more
            </a>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={ITEM}
            className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl text-balance"
          >
            Understand churn risk before customers leave.
          </motion.h1>

          {/* Value Proposition Description */}
          <motion.p
            variants={ITEM}
            className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed text-balance"
          >
            Flurit equips B2B SaaS customer success and growth teams with transparent 60-day operational risk rankings, directional SHAP factor attribution, and revenue-weighted retention prioritization.
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            variants={ITEM}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a href="#product" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="relative w-full sm:w-auto gap-2 overflow-hidden text-base font-medium px-6"
              >
                {!reduce && (
                  <motion.span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-primary-foreground/25"
                    style={{ skewX: -20 }}
                    initial={{ x: "-120%" }}
                    animate={{ x: "420%" }}
                    transition={{ duration: 1.4, ease: "easeInOut", repeat: Infinity, repeatDelay: 3.5 }}
                  />
                )}
                <span>Explore Sample Analysis</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </a>
            <a href="#how-it-works" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-base font-medium px-6">
                How Flurit Works
              </Button>
            </a>
          </motion.div>

          {/* Core Methodological Highlights */}
          <motion.div
            variants={ITEM}
            className="mt-10 grid grid-cols-2 gap-3 text-left sm:grid-cols-4 sm:gap-4 pt-8 border-t border-border/60"
          >
            {HIGHLIGHTS.map((h) => (
              <div key={h.title} className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                <div className="text-xs">
                  <span className="font-semibold text-foreground block">{h.title}</span>
                  <span className="text-muted-foreground">{h.sub}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Animated product preview */}
        <RiskPreview reduce={reduce} />
      </motion.div>
    </section>
  );
}