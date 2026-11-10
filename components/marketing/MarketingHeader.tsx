"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandWordmark } from "@/components/brand/BrandWordmark";
import { AuthDialog } from "@/components/auth/AuthDialog";

export function MarketingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Product Preview", href: "#product" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Capabilities", href: "#capabilities" },
    { label: "Use Cases", href: "#use-cases" },
    { label: "Methodology", href: "#methodology" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Flurit home" className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm">
          <BrandWordmark className="text-3xl text-foreground" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm py-1 px-1"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <AuthDialog />
          <AuthDialog label="Sign Up" signup />
          <a href="#product">
            <Button variant="primary" size="sm" className="gap-1.5">
              <span>View Sample Analysis</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? "Close main menu" : "Open main menu"}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-muted"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="pt-3 border-t border-border flex flex-col gap-2">
            <AuthDialog className="w-full justify-center" />
            <AuthDialog label="Sign Up" signup className="w-full justify-center" />
            <a href="#product" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="primary" className="w-full justify-center">
                View Sample Analysis
              </Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
