"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MarketingHeader } from "@/components/shared/MarketingHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react"; // Icon for features

const pricingTiers = [
  {
    name: "Creator",
    color: "brand-silver",
    description: "Basic brand DNA & tone audit",
    idealFor: "Individuals",
    features: [
      "1 Brand Core",
      "Limited Studio access",
      "Basic tone insights",
      "Community support",
    ],
    cta: "Start Free",
    link: "/signup",
  },
  {
    name: "Pro",
    color: "brand-blue",
    description: "Full brand intelligence suite",
    idealFor: "Agencies & studios",
    features: [
      "All 4 modules",
      "Advanced analytics",
      "Collaboration tools",
      "Priority support",
      "Unlimited Brand Cores",
    ],
    cta: "Get Started",
    link: "/signup",
  },
  {
    name: "Enterprise",
    color: "gradient-outline", // Custom class for gradient border
    description: "Full API & integration access",
    idealFor: "Enterprises",
    features: [
      "Custom dashboards",
      "Gemini-powered AI",
      "Dedicated account manager",
      "SLA & advanced security",
      "API access & integrations",
    ],
    cta: "Talk to Sales",
    link: "/contact",
  },
];

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-brand-slate to-black text-gray-100 font-sans overflow-hidden relative">
      <MarketingHeader />

      <main className="flex-1 flex flex-col items-center p-6 pt-24 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mb-20"
        >
          <h1 className="text-6xl font-extrabold leading-tight mb-6 text-brand-silver">
            Choose your level of <span className="text-brand-blue">brand intelligence</span>.
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Start free, scale with your growth. KniBrand offers flexible plans to empower every creator and company.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <section className="w-full max-w-6xl py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                className={`bg-brand-slate/50 backdrop-blur-md border rounded-xl p-8 shadow-lg flex flex-col justify-between ${
                  tier.color === "gradient-outline"
                    ? "border-transparent bg-gradient-to-br from-brand-blue/20 to-brand-silver/20 p-px" // Gradient border effect
                    : "border-brand-slate/70"
                }`}
              >
                <div className={tier.color === "gradient-outline" ? "bg-brand-slate/90 rounded-xl p-8" : ""}> {/* Inner div for gradient border */}
                  <h3 className="text-3xl font-bold text-brand-silver mb-4">{tier.name}</h3>
                  <p className="text-gray-300 text-lg mb-6">{tier.description}</p>
                  <p className="text-brand-blue font-semibold mb-6">{tier.idealFor}</p>
                  <ul className="text-gray-300 text-left space-y-3 mb-8">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-brand-blue" /> {feature}
                      </li>
                    ))}
                  </ul>
                  <Button asChild className={`w-full text-lg px-8 py-3 rounded-lg ${
                    tier.color === "brand-blue"
                      ? "bg-brand-blue hover:bg-blue-700 text-white"
                      : tier.color === "brand-silver"
                      ? "bg-brand-silver hover:bg-gray-400 text-black"
                      : "bg-gradient-to-r from-brand-blue to-brand-silver text-black" // For Enterprise CTA
                  }`}>
                    <Link href={tier.link}>{tier.cta}</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <footer className="px-10 py-12 bg-black text-gray-500 text-sm text-center border-t border-slate-800">
        <p>KniBrand — The AI Brand Operating System built for creators who value authenticity and intelligence.</p>
      </footer>
    </div>
  );
}
