"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MarketingHeader } from "@/components/shared/MarketingHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, Briefcase, Building, Users } from "lucide-react"; // Icons for use-cases

const solutionUseCases = [
  {
    title: "For Creators",
    description: "Build authentic personal brands with AI co-pilots. Find your unique voice and connect with your audience.",
    icon: User,
    benefits: [
      "Define your authentic tone.",
      "Generate engaging content ideas.",
      "Maintain consistent brand presence.",
    ],
  },
  {
    title: "For Studios",
    description: "Manage multiple brand systems under one hub. Streamline workflows and ensure visual identity consistency.",
    icon: Briefcase,
    benefits: [
      "Unify your visual identity.",
      "Centralize brand assets.",
      "Collaborate seamlessly on projects.",
    ],
  },
  {
    title: "For Agencies",
    description: "Automate audits, tone consistency, and client delivery. Scale your services with AI-powered efficiency.",
    icon: Building,
    benefits: [
      "Automate client branding.",
      "Ensure brand guideline adherence.",
      "Deliver consistent client experiences.",
    ],
  },
  {
    title: "For Companies",
    description: "Scale communication and design alignment across teams. Maintain brand integrity as you grow.",
    icon: Users,
    benefits: [
      "Scale your message intelligently.",
      "Align internal and external communications.",
      "Protect brand integrity across departments.",
    ],
  },
];

export default function SolutionsPage() {
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
            One system. <span className="text-brand-blue">Infinite brand types.</span>
          </h1>
          <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
            KniBrand adapts to your unique needs, empowering creators, studios, agencies, and companies to achieve brand intelligence.
          </p>
        </motion.div>

        {/* Solutions Use Cases Cards */}
        <section className="w-full max-w-6xl py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {solutionUseCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                className="bg-brand-slate/50 backdrop-blur-md border border-brand-slate/70 rounded-xl p-8 shadow-lg hover:shadow-brand-blue/30 transition-shadow duration-300 flex flex-col justify-between"
              >
                <div>
                  <useCase.icon className="h-12 w-12 text-brand-blue mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-brand-silver mb-4">{useCase.title}</h3>
                  <p className="text-gray-300 mb-6">{useCase.description}</p>
                  <ul className="list-disc list-inside text-gray-400 text-left space-y-1">
                    {useCase.benefits.map((benefit, i) => (
                      <li key={i}>{benefit}</li>
                    ))}
                  </ul>
                </div>
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
            Ready for a Custom BrandOS Setup?
          </motion.h2>
          <Button className="bg-brand-blue hover:bg-blue-700 text-white px-8 py-4 rounded-lg shadow-lg">
            Get a Custom BrandOS Setup
          </Button>
        </section>
      </main>

      <footer className="px-10 py-12 bg-black text-gray-500 text-sm text-center border-t border-slate-800">
        <p>KniBrand — The AI Brand Operating System built for creators who value authenticity and intelligence.</p>
      </footer>
    </div>
  );
}
