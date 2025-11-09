"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { ModuleCard } from "./components/ModuleCard";
import { modules } from "./data/modules";

export default function DashboardPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [greeting, setGreeting] = useState("Welcome");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-brand-slate to-black font-sans text-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <TopBar greeting={greeting} toggleSidebar={() => setIsOpen(!isOpen)} />

        <main className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10">
          {modules.map((mod) => (
            <motion.div
              key={mod.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: mod.delay }}
            >
              <ModuleCard {...mod} />
            </motion.div>
          ))}
        </main>
      </div>
    </div>
  );
}