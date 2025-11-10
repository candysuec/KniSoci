"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MarketingHeader } from "@/components/shared/MarketingHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Lightbulb, Code, Rss } from "lucide-react"; // Icons for resources

const resourceBlocks = [
  {
    title: "Blog",
    description: "AI x Brand strategy insights, industry trends, and thought leadership.",
    icon: Rss,
    link: "/resources/blog",
  },
  {
    title: "Tutorials",
    description: "Step-by-step guides on how to use KniCore, KniSoci, and other KniBrand modules.",
    icon: BookOpen,
    link: "/resources/tutorials",
  },
  {
    title: "Prompt Library",
    description: "Ready-to-use Candy prompts and use-cases for brand automation and creative generation.",
    icon: Lightbulb,
    link: "/resources/prompt-library",
  },
  {
    title: "Whitepapers & PDFs",
    description: "Deep dives into the future of brand intelligence and human-centered AI.",
    icon: Code, // Using Code as a placeholder for now
    link: "/resources/whitepapers",
  },
];

export default function ResourcesPage() {
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
            Learn the art of <span className="text-brand-blue">intelligent branding</span>.
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Establish KniBrand as a thought leader in human-centered AI and brand intelligence.
          </p>
        </motion.div>

        {/* Content Blocks */}
        <section className="w-full max-w-6xl py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {resourceBlocks.map((block, index) => (
              <motion.div
                key={block.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                className="bg-brand-slate/50 backdrop-blur-md border border-brand-slate/70 rounded-xl p-8 shadow-lg hover:shadow-brand-blue/30 transition-shadow duration-300 flex flex-col justify-between"
              >
                <div>
                  <block.icon className="h-12 w-12 text-brand-blue mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-brand-silver mb-4">{block.title}</h3>
                  <p className="text-gray-300 mb-6">{block.description}</p>
                </div>
                <Button asChild className="bg-brand-blue hover:bg-blue-700 text-white px-8 py-3 rounded-lg">
                  <Link href={block.link}>Explore</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full max-w-6xl py-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-extrabold text-brand-silver mb-10"
          >
            Stay Ahead with Brand Intelligence
          </motion.h2>
          <p className="text-xl text-gray-400 mb-10">
            Subscribe to our digest for the latest insights on AI and brand strategy.
          </p>
          <Button className="bg-brand-blue hover:bg-blue-700 text-white px-8 py-4 rounded-lg shadow-lg">
            Subscribe to Digest
          </Button>
        </section>
      </main>

      <footer className="px-10 py-12 bg-black text-gray-500 text-sm text-center border-t border-slate-800">
        <p>KniBrand — The AI Brand Operating System built for creators who value authenticity and intelligence.</p>
      </footer>
    </div>
  );
}
