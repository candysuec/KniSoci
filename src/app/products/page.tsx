"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MarketingHeader } from "@/components/shared/MarketingHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, LayoutDashboard, Sparkles, Cloud } from "lucide-react"; // Icons for modules

const productModules = [
  {
    id: "knicore",
    title: "KniCore",
    tagline: "Your Brand DNA, Structured.",
    description: "Dive deep into your brand's essence with AI-powered analysis. KniCore structures your brand graph, tone engine, archetype mapping, and ethical layers to form a robust foundation.",
    icon: Brain,
    cta: "Learn More about KniCore",
    link: "/products/knicore",
  },
  {
    id: "knisoci",
    title: "KniSoci",
    tagline: "Your Intelligent Operating Dashboard.",
    description: "Gain unparalleled insights into your brand's performance. KniSoci provides advanced analytics, self-healing insights, and an integrated map of your brand's digital footprint.",
    icon: LayoutDashboard,
    cta: "Explore KniSoci Dashboard",
    link: "/products/knisoci",
  },
  {
    id: "kniai-studio",
    title: "KniAI Studio",
    tagline: "Co-Create with AI in Your Voice.",
    description: "Unleash your creativity with AI that understands your brand's unique voice. KniAI Studio assists with copy generation, campaign ideation, and creative asset development.",
    icon: Sparkles,
    cta: "Discover KniAI Studio",
    link: "/products/kniai-studio",
  },
  {
    id: "knihub",
    title: "KniHub",
    tagline: "Connect and Scale Your Ecosystem.",
    description: "Expand your brand's reach and capabilities. KniHub offers a marketplace for integrations, collaboration tools, and a robust plugin ecosystem to scale your operations.",
    icon: Cloud,
    cta: "Connect with KniHub",
    link: "/products/knihub",
  },
];

export default function ProductsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-brand-slate to-black text-gray-100 font-sans overflow-hidden relative">
      <MarketingHeader />

      <main className="flex-1 flex flex-col items-center p-6 pt-24 relative z-10">
        {/* Intro Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mb-20"
        >
          <h1 className="text-6xl font-extrabold leading-tight mb-6 text-brand-silver">
            Everything your brand needs to <span className="text-brand-blue">evolve intelligently</span>.
          </h1>
          <div className="flex justify-center space-x-8 mb-10">
            {productModules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
              >
                <module.icon className="h-16 w-16 text-brand-blue" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Product Cards Grid */}
        <section className="w-full max-w-6xl py-16">
          <div className="grid grid-cols-1 gap-10">
            {productModules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.2, duration: 0.8 }}
                className="bg-brand-slate/50 backdrop-blur-md border border-brand-slate/70 rounded-xl p-8 shadow-lg flex flex-col md:flex-row items-center gap-8"
              >
                <div className="md:w-1/3 flex flex-col items-center text-center md:text-left">
                  <module.icon className="h-20 w-20 text-brand-blue mb-4" />
                  <h3 className="text-4xl font-bold text-brand-silver mb-2">{module.title}</h3>
                  <p className="text-brand-blue text-xl">{module.tagline}</p>
                </div>
                <div className="md:w-2/3 text-center md:text-left">
                  <p className="text-gray-300 text-lg mb-6">{module.description}</p>
                  {/* Placeholder for Key Features List */}
                  <ul className="list-disc list-inside text-gray-400 text-left mb-6">
                    <li>Feature 1: Detailed explanation of KniCore's brand graph capabilities.</li>
                    <li>Feature 2: Tone engine for consistent brand voice.</li>
                    <li>Feature 3: Archetype mapping for deeper brand understanding.</li>
                  </ul>
                  <Button asChild className="bg-brand-blue hover:bg-blue-700 text-white px-8 py-3 rounded-lg">
                    <Link href={module.link}>{module.cta}</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Full Comparison Banner - Placeholder */}
        <section className="w-full max-w-6xl py-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-extrabold text-brand-silver mb-10"
          >
            Compare KniBrand to the Rest
          </motion.h2>
          <p className="text-xl text-gray-400 mb-10">
            See how KniBrand's intelligent operating system stands out against traditional tools.
          </p>
          <Button className="bg-brand-silver hover:bg-gray-400 text-black px-8 py-4 rounded-lg shadow-lg">
            View Full Comparison
          </Button>
        </section>
      </main>

      <footer className="px-10 py-12 bg-black text-gray-500 text-sm text-center border-t border-slate-800">
        <p>KniBrand — The AI Brand Operating System built for creators who value authenticity and intelligence.</p>
      </footer>
    </div>
  );
}