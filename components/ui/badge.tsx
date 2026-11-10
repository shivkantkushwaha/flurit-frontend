import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "risk-high" | "risk-moderate" | "risk-low";
  size?: "sm" | "md";
  showIcon?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "default",
  size = "md",
  showIcon = false,
  children,
  ...props
}) => {
  const baseStyles = "inline-flex items-center font-medium rounded-full select-none";

  const sizeStyles: Record<NonNullable<BadgeProps["size"]>, string> = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
  };

  const variantStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    outline: "border border-border text-foreground bg-transparent",
    // Accessible Semantic Risk Variants (High Contrast, Tinted Background)
    "risk-high": "bg-risk-high-muted text-risk-high border border-risk-high/30",
    "risk-moderate": "bg-risk-moderate-muted text-risk-moderate-foreground border border-risk-moderate/40",
    "risk-low": "bg-risk-low-muted text-risk-low border border-risk-low/30",
  };

  const renderIcon = () => {
    if (!showIcon) return null;
    const iconClass = "h-3.5 w-3.5 shrink-0";
    if (variant === "risk-high") return <AlertCircle className={iconClass} aria-hidden="true" />;
    if (variant === "risk-moderate") return <AlertTriangle className={iconClass} aria-hidden="true" />;
    if (variant === "risk-low") return <CheckCircle2 className={iconClass} aria-hidden="true" />;
    return null;
  };

  return (
    <span
      className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {renderIcon()}
      <span>{children}</span>
    </span>
  );
};
