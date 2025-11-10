"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MarketingHeader } from "@/components/shared/MarketingHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Assuming you have a Textarea component

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-brand-slate to-black text-gray-100 font-sans overflow-hidden relative">
      <MarketingHeader />

      <main className="flex-1 flex flex-col items-center justify-center p-6 pt-24 relative z-10">
        {/* Contact Section */}
        <section className="w-full max-w-6xl py-16 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center md:text-left"
          >
            <h1 className="text-5xl font-extrabold leading-tight mb-6 text-brand-silver">
              Your brand already has intelligence. <span className="text-brand-blue">Let’s bring it to life.</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Whether you're a creator, studio, agency, or enterprise, KniBrand is here to help you craft, protect, and evolve your brand narrative. Reach out to our sales team for a personalized consultation.
            </p>
            <p className="text-lg text-gray-400">
              Or email us directly:{" "}
              <a href="mailto:hello@knibrand.ai" className="text-brand-blue hover:underline">
                hello@knibrand.ai
              </a>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-brand-slate/50 backdrop-blur-md border border-brand-slate/70 rounded-xl p-8 shadow-lg"
          >
            <h2 className="text-3xl font-bold text-brand-silver mb-6 text-center">Book a Discovery Session</h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-300 text-sm font-bold mb-2">
                  Name
                </label>
                <Input
                  type="text"
                  id="name"
                  placeholder="Your Name"
                  className="w-full bg-brand-slate/70 border border-gray-700 text-brand-silver placeholder-gray-500 rounded-lg py-2 px-4 focus:ring-brand-blue focus:border-brand-blue"
                />
              </div>
              <div>
                <label htmlFor="company" className="block text-gray-300 text-sm font-bold mb-2">
                  Company
                </label>
                <Input
                  type="text"
                  id="company"
                  placeholder="Your Company"
                  className="w-full bg-brand-slate/70 border border-gray-700 text-brand-silver placeholder-gray-500 rounded-lg py-2 px-4 focus:ring-brand-blue focus:border-brand-blue"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Your Email"
                  className="w-full bg-brand-slate/70 border border-gray-700 text-brand-silver placeholder-gray-500 rounded-lg py-2 px-4 focus:ring-brand-blue focus:border-brand-blue"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-gray-300 text-sm font-bold mb-2">
                  Message
                </label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your brand and needs..."
                  rows={5}
                  className="w-full bg-brand-slate/70 border border-gray-700 text-brand-silver placeholder-gray-500 rounded-lg py-2 px-4 focus:ring-brand-blue focus:border-brand-blue"
                />
              </div>
              <Button type="submit" className="w-full bg-brand-blue hover:bg-blue-700 text-white text-lg px-6 py-3 rounded-lg shadow-lg">
                Send Message
              </Button>
            </form>
          </motion.div>
        </section>
      </main>

      <footer className="px-10 py-12 bg-black text-gray-500 text-sm text-center border-t border-slate-800">
        <p>KniBrand — The AI Brand Operating System built for creators who value authenticity and intelligence.</p>
      </footer>
    </div>
  );
}
