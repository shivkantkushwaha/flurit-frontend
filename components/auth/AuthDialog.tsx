"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoginPanel } from "./LoginForm";
import { SignupPanel } from "./SignupForm";

export function AuthDialog({ label = "Sign In", signup = false, className }: {
  label?: string;
  signup?: boolean;
  className?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [mode, setMode] = useState<"login" | "signup" | null>(null);

  return (
    <>
      <Button variant="outline" size="sm" className={className} onClick={() => {
        setMode(signup ? "signup" : "login");
        dialog.current?.showModal();
      }}>{label}</Button>
      <dialog ref={dialog} aria-label={mode === "signup" ? "Create account" : "Sign in to Flurit"} onClose={() => setMode(null)}
        className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-md overflow-auto rounded-xl bg-background text-foreground backdrop:bg-black/50">
        <button type="button" aria-label="Close account dialog" onClick={() => dialog.current?.close()}
          className="absolute right-3 top-3 rounded p-1 hover:bg-muted">
          <X className="h-5 w-5" />
        </button>
        {mode === "login" && <LoginPanel onSwitch={() => setMode("signup")} />}
        {mode === "signup" && <SignupPanel onSwitch={() => setMode("login")} />}
      </dialog>
    </>
  );
}
