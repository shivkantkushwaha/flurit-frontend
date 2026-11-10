import React from "react";

export function BrandWordmark({ className = "" }: { className?: string }) {
  return <span className={`brand-wordmark ${className}`.trim()}>Flurit</span>;
}
