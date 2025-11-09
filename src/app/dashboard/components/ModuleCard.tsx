"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface ModuleCardProps {
  id: string;
  title: string;
  description: string;
  gradient: string;
  href: string;
  status?: "active" | "locked" | "coming_soon";
}

export function ModuleCard({
  title,
  description,
  gradient,
  href,
  status = "active",
}: ModuleCardProps) {
  const locked = status !== "active";

  return (
    <motion.div
      whileHover={{ scale: locked ? 1 : 1.03 }}
      className={`rounded-2xl p-6 h-56 flex flex-col justify-between shadow-lg bg-gradient-to-br ${gradient} ${
        locked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
      } border border-brand-slate/50`}
    >
      <div>
        <h3 className="text-xl font-semibold text-brand-silver mb-2">{title}</h3>
        <p className="text-sm text-brand-silver/80">{description}</p>
      </div>
      {!locked ? (
        <Link
          href={href}
          className="flex items-center justify-between text-brand-blue font-medium mt-4"
        >
          <span>Open</span> <ArrowRight size={18} />
        </Link>
      ) : (
        <p className="text-sm text-brand-silver/70 mt-4 italic">Coming Soon</p>
      )}
    </motion.div>
  );
}