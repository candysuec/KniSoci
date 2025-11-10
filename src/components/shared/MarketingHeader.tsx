"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react"; // For mobile menu

export function MarketingHeader() {
  return (
    <header className="absolute top-0 left-0 right-0 z-10 p-6">
      <nav className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo / Business Name */}
        <Link href="/" className="text-2xl font-bold text-brand-silver hover:text-white transition-colors">
          KniBrand
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4"> {/* Reduced space-x for buttons */}
          <Button asChild variant="ghost" className="text-gray-300 hover:text-white hover:bg-brand-slate/20">
            <Link href="/products">Products</Link>
          </Button>
          <Button asChild variant="ghost" className="text-gray-300 hover:text-white hover:bg-brand-slate/20">
            <Link href="/solutions">Solutions</Link>
          </Button>
          <Button asChild variant="ghost" className="text-gray-300 hover:text-white hover:bg-brand-slate/20">
            <Link href="/resources">Resources</Link>
          </Button>
          <Button asChild variant="ghost" className="text-gray-300 hover:text-white hover:bg-brand-slate/20">
            <Link href="/pricing">Pricing</Link>
          </Button>
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Button asChild variant="ghost" className="text-gray-300 hover:text-white hover:bg-transparent">
            <Link href="/contact">Contact Sales</Link>
          </Button>
          <Button asChild className="bg-transparent border border-brand-blue text-brand-blue hover:bg-brand-blue/20">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild className="bg-brand-blue hover:bg-blue-700 text-white">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </nav>
    </header>
  );
}