"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MarketingHeader } from "@/components/shared/MarketingHeader";

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-300 mb-10 max-w-3xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
          </p>
        </motion.div>

        <section className="w-full max-w-3xl py-8 text-left">
          <h2 className="text-3xl font-bold text-brand-silver mb-4">1. Information We Collect</h2>
          <p className="text-gray-300 mb-4">
            We collect information you provide directly to us, such as when you create an account, use our services, or communicate with us. This may include your name, email address, and any other information you choose to provide.
          </p>
          <h2 className="text-3xl font-bold text-brand-silver mb-4">2. How We Use Your Information</h2>
          <p className="text-gray-300 mb-4">
            We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to personalize your experience.
          </p>
          <h2 className="text-3xl font-bold text-brand-silver mb-4">3. Sharing Your Information</h2>
          <p className="text-gray-300 mb-4">
            We do not share your personal information with third parties except as described in this policy or with your consent.
          </p>
        </section>
      </main>

      <footer className="px-10 py-12 bg-black text-gray-500 text-sm text-center border-t border-slate-800">
        <p>KniBrand — The AI Brand Operating System built for creators who value authenticity and intelligence.</p>
      </footer>
    </div>
  );
}
