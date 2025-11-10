"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MarketingHeader } from "@/components/shared/MarketingHeader";

export default function EthicsPage() {
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
            Ethical AI Statement
          </h1>
          <p className="text-lg text-gray-300 mb-10 max-w-3xl mx-auto">
            Our commitment to human-first intelligence.
          </p>
        </motion.div>

        <section className="w-full max-w-3xl py-8 text-left">
          <h2 className="text-3xl font-bold text-brand-silver mb-4">1. Human-Centric Design</h2>
          <p className="text-gray-300 mb-4">
            We design our AI systems to augment human creativity and decision-making, not replace it. Our tools are built to empower, not to control.
          </p>
          <h2 className="text-3xl font-bold text-brand-silver mb-4">2. Transparency and Accountability</h2>
          <p className="text-gray-300 mb-4">
            We are committed to transparency in how our AI models operate and the data they use. We hold ourselves accountable for the ethical implications of our technology.
          </p>
          <h2 className="text-3xl font-bold text-brand-silver mb-4">3. Fairness and Bias Mitigation</h2>
          <p className="text-gray-300 mb-4">
            We actively work to identify and mitigate biases in our AI systems to ensure fair and equitable outcomes for all users and brands.
          </p>
        </section>
      </main>

      <footer className="px-10 py-12 bg-black text-gray-500 text-sm text-center border-t border-slate-800">
        <p>KniBrand — The AI Brand Operating System built for creators who value authenticity and intelligence.</p>
      </footer>
    </div>
  );
}
