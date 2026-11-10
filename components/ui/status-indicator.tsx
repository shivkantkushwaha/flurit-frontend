import React from "react";
import { cn } from "@/lib/utils";
import { ReadinessStatus } from "@/lib/types/api";

export interface StatusIndicatorProps {
  status: ReadinessStatus;
  label?: string;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, label, className }) => {
  const statusStyles: Record<ReadinessStatus, { dot: string; text: string; defaultLabel: string }> = {
    READY: {
      dot: "bg-risk-low",
      text: "text-risk-low font-medium",
      defaultLabel: "Ready",
    },
    PARTIALLY_READY: {
      dot: "bg-risk-moderate",
      text: "text-risk-moderate-foreground font-medium",
      defaultLabel: "Partially Ready",
    },
    UNSUPPORTED: {
      dot: "bg-risk-high",
      text: "text-risk-high font-medium",
      defaultLabel: "Unsupported",
    },
  };

  const config = statusStyles[status];
  const displayLabel = label || config.defaultLabel;

  return (
    <span className={cn("inline-flex items-center gap-2 text-xs", className)}>
      <span className={cn("h-2 w-2 rounded-full shrink-0", config.dot)} aria-hidden="true" />
      <span className={config.text}>{displayLabel}</span>
    </span>
  );
};
