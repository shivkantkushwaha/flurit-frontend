import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines conditional class names and resolves conflicting Tailwind CSS utilities safely.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a numeric score in [0.0, 1.0] as a clean percentage or decimal.
 */
export function formatScore(score: number, asPercent = true): string {
  if (typeof score !== "number" || isNaN(score)) return "N/A";
  if (asPercent) {
    return `${(score * 100).toFixed(1)}%`;
  }
  return score.toFixed(4);
}

/**
 * Formats USD currency values cleanly.
 */
export function formatCurrency(amount: number): string {
  if (typeof amount !== "number" || isNaN(amount)) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
