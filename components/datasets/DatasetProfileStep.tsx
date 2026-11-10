"use client";

import React, { useState } from "react";
import { DatasetProfile, DatasetProfileResponse } from "@/lib/types/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Database, Calendar, Key, AlertTriangle, Layers } from "lucide-react";

interface DatasetProfileStepProps {
  profileResponse: DatasetProfileResponse;
  onProceed: (profiles: DatasetProfile[]) => void;
  onBack: () => void;
}

export function DatasetProfileStep({ profileResponse, onProceed, onBack }: DatasetProfileStepProps) {
  // Normalize datasets whether backend returns array or dict
  const profiles: DatasetProfile[] = Array.isArray(profileResponse.datasets)
    ? profileResponse.datasets
    : Object.entries(profileResponse.datasets || {}).map(([name, table]) => ({
        file_name: name,
        file_size_bytes: table.file_size_bytes,
        row_count: table.row_count,
        column_count: table.column_count,
        duplicate_row_count: table.duplicate_rows,
        candidate_id_columns: table.candidate_id_columns || [],
        candidate_target_columns: table.candidate_target_columns || [],
        columns: Object.values(table.columns || {}),
        date_range: null,
      }));

  const [selectedFileIdx, setSelectedFileIdx] = useState(0);
  const activeProfile = profiles[selectedFileIdx] || profiles[0];

  const totalRows = profiles.reduce((sum, p) => sum + p.row_count, 0);
  const totalCols = profiles.reduce((sum, p) => sum + p.column_count, 0);
  const totalDups = profiles.reduce((sum, p) => sum + p.duplicate_row_count, 0);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getTypeBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case "datetime":
      case "timestamp":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200">datetime</Badge>;
      case "float":
      case "integer":
      case "number":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200">{type}</Badge>;
      case "boolean":
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200">boolean</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-xl">Step 2: Dataset Profiling & Schema Summary</CardTitle>
              <CardDescription>
                {profileResponse.message || "Automated pre-flight profiling completed successfully on the backend."}
              </CardDescription>
            </div>
            <Badge variant="outline" className="font-mono text-xs self-start sm:self-auto">
              Backend Profiler Verified
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Global Statistics Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-lg border border-border p-3 bg-muted/20">
              <span className="text-[11px] font-medium text-muted-foreground block">Uploaded Files</span>
              <span className="text-xl font-bold text-foreground mt-0.5 block">{profiles.length}</span>
            </div>
            <div className="rounded-lg border border-border p-3 bg-muted/20">
              <span className="text-[11px] font-medium text-muted-foreground block">Total Records</span>
              <span className="text-xl font-bold text-foreground mt-0.5 block">{totalRows.toLocaleString()}</span>
            </div>
            <div className="rounded-lg border border-border p-3 bg-muted/20">
              <span className="text-[11px] font-medium text-muted-foreground block">Total Columns</span>
              <span className="text-xl font-bold text-foreground mt-0.5 block">{totalCols}</span>
            </div>
            <div className="rounded-lg border border-border p-3 bg-muted/20">
              <span className="text-[11px] font-medium text-muted-foreground block">Duplicate Rows</span>
              <span className="text-xl font-bold text-foreground mt-0.5 block">{totalDups}</span>
            </div>
          </div>

          {/* File Switcher Tabs */}
          {profiles.length > 1 && (
            <div className="flex flex-wrap items-center gap-1.5 border-b border-border pb-3">
              {profiles.map((p, idx) => (
                <button
                  key={p.file_name}
                  type="button"
                  onClick={() => setSelectedFileIdx(idx)}
                  className={`px-3 py-1.5 rounded text-xs font-mono font-medium transition-colors ${
                    selectedFileIdx === idx
                      ? "bg-primary text-primary-foreground shadow-xs"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {p.file_name} ({p.row_count.toLocaleString()} rows)
                </button>
              ))}
            </div>
          )}

          {/* Active File Profile Details */}
          {activeProfile && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-lg border border-border bg-card">
                <div>
                  <h3 className="text-sm font-bold text-foreground font-mono">{activeProfile.file_name}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span>{formatFileSize(activeProfile.file_size_bytes)}</span>
                    <span>&bull;</span>
                    <span>{activeProfile.row_count.toLocaleString()} rows</span>
                    <span>&bull;</span>
                    <span>{activeProfile.column_count} columns</span>
                    {activeProfile.duplicate_row_count > 0 && (
                      <>
                        <span>&bull;</span>
                        <span className="text-amber-600 font-medium">{activeProfile.duplicate_row_count} duplicates</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Candidate IDs and Targets */}
                <div className="flex flex-wrap items-center gap-2">
                  {activeProfile.candidate_id_columns?.length > 0 && (
                    <div className="flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">
                      <Key className="h-3 w-3 text-primary" aria-hidden="true" />
                      <span>Candidate IDs: <strong>{activeProfile.candidate_id_columns.join(", ")}</strong></span>
                    </div>
                  )}
                  {activeProfile.date_range?.span_days !== undefined && (
                    <div className="flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-[11px] text-muted-foreground">
                      <Calendar className="h-3 w-3 text-primary" aria-hidden="true" />
                      <span>Date Span: <strong>{activeProfile.date_range.span_days} days</strong></span>
                    </div>
                  )}
                </div>
              </div>

              {/* Column Statistics Table */}
              <div className="rounded-lg border border-border overflow-hidden">
                <div className="max-h-[360px] overflow-y-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="sticky top-0 bg-muted/90 backdrop-blur-xs text-muted-foreground border-b border-border">
                      <tr>
                        <th scope="col" className="py-2 px-3 font-semibold">Column Name</th>
                        <th scope="col" className="py-2 px-3 font-semibold">Inferred Type</th>
                        <th scope="col" className="py-2 px-3 font-semibold">Missingness</th>
                        <th scope="col" className="py-2 px-3 font-semibold">Unique Values</th>
                        <th scope="col" className="py-2 px-3 font-semibold">Sample Values</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {activeProfile.columns.map((col) => (
                        <tr key={col.column_name} className="hover:bg-muted/30 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-medium text-foreground">
                            {col.column_name}
                          </td>
                          <td className="py-2.5 px-3">
                            {getTypeBadge(col.inferred_type)}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-muted-foreground">
                                {col.null_percentage > 0 ? `${col.null_percentage.toFixed(1)}%` : "0%"}
                              </span>
                              {col.null_percentage > 10 && (
                                <span title="High missingness">
                                  <AlertTriangle className="h-3 w-3 text-amber-500" />
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-muted-foreground">
                            {col.unique_count.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-muted-foreground max-w-xs truncate">
                            {col.sample_values?.slice(0, 3).join(", ") || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Actions */}
          <div className="pt-4 border-t border-border flex items-center justify-between">
            <Button type="button" variant="outline" onClick={onBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Back to Upload</span>
            </Button>

            <Button type="button" variant="primary" onClick={() => onProceed(profiles)} className="gap-2">
              <span>Proceed to Schema Mapping</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
