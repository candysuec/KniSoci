"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MarketingHeader } from "@/components/shared/MarketingHeader";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-brand-slate to-black text-gray-100 font-sans overflow-hidden relative">
      <MarketingHeader />

      <main className="flex-1 flex flex-col items-center p-6 pt-24 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mb-20"
        >
          <h1 className="text-5xl font-extrabold leading-tight mb-6 text-brand-silver">
            Terms of Use
          </h1>
          <p className="text-lg text-gray-300 mb-10 max-w-3xl mx-auto">
            Please read these terms carefully before using our services.
          </p>
        </motion.div>

        <section className="w-full max-w-3xl py-8 text-left">
          <h2 className="text-3xl font-bold text-brand-silver mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-300 mb-4">
            By accessing or using KniBrand, you agree to be bound by these Terms of Use and all terms incorporated by reference.
          </p>
          <h2 className="text-3xl font-bold text-brand-silver mb-4">2. User Conduct</h2>
          <p className="text-gray-300 mb-4">
            You agree not to use the service for any unlawful purpose or in any way that could damage, disable, or impair the service.
          </p>
          <h2 className="text-3xl font-bold text-brand-silver mb-4">3. Intellectual Property</h2>
          <p className="text-gray-300 mb-4">
            All intellectual property rights in the service and its content are owned by KniBrand or its licensors.
          </p>
        </section>
      </main>

      <footer className="px-10 py-12 bg-black text-gray-500 text-sm text-center border-t border-slate-800">
        <p>KniBrand — The AI Brand Operating System built for creators who value authenticity and intelligence.</p>
      </footer>
    </div>
  );
}
