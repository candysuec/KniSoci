"use client";

import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion"; // Added useScroll, useTransform
import { useRef } from "react"; // Added useRef
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MarketingHeader } from "@/components/shared/MarketingHeader";
import { Card, CardContent } from "@/components/ui/card"; // Added Card and CardContent imports
import { Brain, BookOpen, Wrench, BarChart2, Lightbulb, Star } from "lucide-react"; // Import icons

export default function HomePage() {
  const router = useRouter();

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity1 = useTransform(scrollYProgress, [0, 0.5], [1, 0.5]);

  const particles = Array.from({ length: 20 });

  return (
    <div ref={ref} className="bg-black text-white font-sans overflow-x-hidden relative">
      {/* Background Particles */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {particles.map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-brand-blue/10 blur-lg" // Using brand-blue
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 8 + 2}px`,
              height: `${Math.random() * 8 + 2}px`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, 20, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{ duration: Math.random() * 8 + 6, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <MarketingHeader />

      <main className="flex flex-1 flex-col items-center justify-center p-6 pt-24 relative z-10">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center min-h-screen text-center px-6 overflow-hidden z-10">
          <motion.div
            style={{ y: y1, opacity: opacity1 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 bg-gradient-to-tr from-brand-blue/40 via-brand-slate/20 to-black z-0" // Using brand colors
          />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-3xl z-10"
          >
            <h1 className="text-5xl md:text-6xl font-semibold mb-4 text-brand-silver">
              Where Your Brand Thinks, Repairs, and Grows.
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              KniBrand is an AI-powered Brand Operating System that helps creators and companies design, protect, and evolve their identity — through clarity, emotion, and intelligence.
            </p>
            <Button className="bg-brand-blue hover:bg-blue-700 text-white text-lg px-6 py-4 rounded-2xl shadow-lg">
              Start Your Brand Audit
            </Button>
          </motion.div>
        </section>

        {/* Problem Section */}
        <section className="grid md:grid-cols-2 gap-8 px-10 py-20 bg-gradient-to-b from-black via-brand-slate to-black relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-brand-silver/10 via-transparent to-brand-blue/10 blur-3xl" // Using brand colors
            style={{ y: y1 }}
          />
          <div className="z-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl font-semibold mb-4 text-brand-silver"
            >
              The Brand Drift
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-gray-400 leading-relaxed"
            >
              Most brands lose their clarity as they grow. Tone shifts. Messages blur. Teams drift. KniBrand exists to bring your identity back to center — guided by AI that understands your brand like a creative partner.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="flex items-center justify-center z-10"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="rounded-full h-64 w-64 bg-gradient-to-tr from-brand-blue/30 to-brand-silver/30 blur-2xl" // Using brand colors
            />
          </motion.div>
        </section>

        {/* Solution Section */}
        <section className="px-10 py-20 text-center bg-black relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-bl from-brand-blue/10 via-transparent to-black" // Using brand colors
            style={{ y: y1 }}
          />
          <h2 className="text-4xl font-semibold text-brand-silver mb-10 relative z-10">
            AI that protects and enhances creativity.
          </h2>
          <div className="grid md:grid-cols-4 gap-8 relative z-10">
            {[
              { title: "KniCore", desc: "Your Brand DNA, Structured." },
              { title: "KniSoci", desc: "Your Intelligent Operating Dashboard." },
              { title: "KniAI Studio", desc: "Co-Create with AI in Your Voice." },
              { title: "KniHub", desc: "Connect and Scale Your Ecosystem." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.2 }}
              >
                <Card className="bg-brand-slate/50 border-slate-700 rounded-2xl hover:border-brand-blue transition-colors"> {/* Using brand colors */}
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Process Section with Parallax */}
        <section className="relative px-10 py-20 bg-gradient-to-t from-black via-brand-slate to-black text-center overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-brand-blue/20 to-black blur-3xl" // Using brand colors
            style={{ y: y1 }}
          />
          <h2 className="text-4xl font-semibold mb-12 text-brand-silver relative z-10">
            A Clear Path to an Intelligent Brand
          </h2>
          <div className="grid md:grid-cols-3 gap-10 relative z-10">
            {[
              { step: "Define", text: "Discover your true brand DNA." },
              { step: "Align", text: "Connect your brand systems with AI intelligence." },
              { step: "Evolve", text: "Watch your brand grow with consistency and insight." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                whileHover={{ scale: 1.08 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="p-6 border border-slate-800 rounded-2xl shadow-md bg-brand-slate/40"
              >
                <h3 className="text-2xl font-semibold text-white mb-2">{item.step}</h3>
                <p className="text-gray-400 text-sm">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 text-center bg-gradient-to-r from-brand-slate to-black overflow-hidden">
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-t from-brand-blue/20 to-transparent blur-2xl" // Using brand colors
          />
          <h2 className="text-4xl font-semibold mb-6 text-brand-silver relative z-10">
            Your brand has a mind. Let’s give it clarity.
          </h2>
          <Button className="bg-brand-blue hover:bg-blue-700 text-white text-lg px-6 py-4 rounded-2xl shadow-lg relative z-10">
            Join the Beta
          </Button>
        </section>

        {/* Footer */}
        <footer className="px-10 py-12 bg-black text-gray-500 text-sm text-center border-t border-slate-800">
          <p>KniBrand — The AI Brand Operating System built for creators who value authenticity and intelligence.</p>
        </footer>
      </main>
    </div>
  );
}
