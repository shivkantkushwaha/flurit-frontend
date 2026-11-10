"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, Trash2, AlertCircle, ArrowRight, Loader2, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DatasetUploadStepProps {
  onFilesSelected: (files: File[]) => void;
  isLoading: boolean;
  error?: string | null;
}

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

export function DatasetUploadStep({ onFilesSelected, isLoading, error }: DatasetUploadStepProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleFiles = (incomingFiles: FileList | null) => {
    if (!incomingFiles || incomingFiles.length === 0) return;
    setValidationError(null);

    const newFiles: File[] = [];
    for (let i = 0; i < incomingFiles.length; i++) {
      const file = incomingFiles[i];

      // File type check
      if (!file.name.toLowerCase().endsWith(".csv") && file.type !== "text/csv") {
        setValidationError(`"${file.name}" is not a CSV file. Only .csv files are supported.`);
        return;
      }

      // Size check
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setValidationError(`"${file.name}" exceeds the maximum permitted size of 50 MB (${formatFileSize(file.size)}).`);
        return;
      }

      // Prevent duplicate file names
      if (!selectedFiles.some((f) => f.name === file.name)) {
        newFiles.push(file);
      }
    }

    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setValidationError(null);
  };

  const handleProceed = () => {
    if (selectedFiles.length === 0) {
      setValidationError("Please select at least one CSV dataset file to proceed.");
      return;
    }
    onFilesSelected(selectedFiles);
  };

  const getConceptTag = (name: string): string => {
    const lower = name.toLowerCase();
    if (lower.includes("account")) return "Accounts";
    if (lower.includes("sub")) return "Subscriptions";
    if (lower.includes("usage") || lower.includes("telemetry") || lower.includes("feature")) return "Feature Usage";
    if (lower.includes("ticket") || lower.includes("support")) return "Support Tickets";
    if (lower.includes("churn")) return "Churn Events";
    return "Custom Table";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Step 1: Upload CSV Datasets</CardTitle>
          <CardDescription>
            Select or drag and drop your customer, subscription, and product telemetry CSV files. Maximum 50 MB per file.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Concept Guide Callout */}
          <div className="rounded-lg border border-border bg-muted/30 p-3.5 text-xs text-muted-foreground flex items-start gap-2.5">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-1">
              <span className="font-semibold text-foreground block">Recommended B2B SaaS Tables:</span>
              <p className="leading-relaxed">
                For complete 60-day predictive scoring, upload <strong>Accounts</strong> (required) and <strong>Subscriptions</strong> (required). Optionally include <strong>Feature Usage</strong>, <strong>Support Tickets</strong>, and <strong>Churn Events</strong> for full 45-feature SHAP explainability.
              </p>
            </div>
          </div>

          {/* Drag & Drop Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50 hover:bg-muted/20"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFiles(e.target.files)}
              multiple
              accept=".csv,text/csv"
              className="hidden"
            />
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-foreground mb-3">
              <UploadCloud className="h-6 w-6 text-primary" aria-hidden="true" />
            </div>
            <div className="text-sm font-semibold text-foreground">
              Click to select or drag and drop CSV files
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Supports accounts.csv, subscriptions.csv, feature_usage.csv, support_tickets.csv, churn_events.csv
            </p>
            <div className="mt-3 text-[11px] font-mono text-muted-foreground">
              Maximum 50 MB per file &bull; Up to 500,000 rows
            </div>
          </div>

          {/* Validation or API Error Alert */}
          {(validationError || error) && (
            <div
              role="alert"
              className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive flex items-start gap-2"
            >
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
              <span>{validationError || error}</span>
            </div>
          )}

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                <span>Selected Datasets ({selectedFiles.length})</span>
                <button
                  type="button"
                  onClick={() => setSelectedFiles([])}
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  Clear all
                </button>
              </div>

              <div className="divide-y divide-border rounded-lg border border-border bg-card">
                {selectedFiles.map((file, idx) => (
                  <div key={file.name} className="flex items-center justify-between p-3 text-xs">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-muted flex items-center justify-center text-foreground shrink-0">
                        <FileText className="h-4 w-4 text-primary" aria-hidden="true" />
                      </div>
                      <div>
                        <span className="font-medium text-foreground block font-mono">{file.name}</span>
                        <div className="flex items-center gap-2 text-muted-foreground mt-0.5">
                          <span>{formatFileSize(file.size)}</span>
                          <span>&bull;</span>
                          <span className="rounded bg-muted px-1.5 py-0.2 text-[10px] font-mono text-foreground font-semibold">
                            {getConceptTag(file.name)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFile(idx)}
                      className="text-muted-foreground hover:text-destructive p-1 rounded"
                      title="Remove file"
                      aria-label={`Remove ${file.name}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-3 border-t border-border flex justify-end">
            <Button
              type="button"
              variant="primary"
              onClick={handleProceed}
              disabled={selectedFiles.length === 0 || isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>Profiling CSV Datasets on Backend...</span>
                </>
              ) : (
                <>
                  <span>Upload & Profile Datasets</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
