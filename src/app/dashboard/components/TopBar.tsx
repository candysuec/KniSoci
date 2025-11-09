"use client";
import { Bell, Menu } from "lucide-react";

export function TopBar({
  greeting,
  toggleSidebar,
}: {
  greeting: string;
  toggleSidebar: () => void;
}) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-brand-slate/80 backdrop-blur-md">
      {/* Left Side */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 transition"
        >
          <Menu size={20} className="text-slate-300" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-brand-silver">
            {greeting}, Candy 👋
          </h1>
          <p className="text-sm text-slate-400">Your AI Brand Command Center</p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-slate-800/60 rounded-full transition">
          <Bell size={18} className="text-slate-300" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-brand-blue rounded-full" />
        </button>

        <button className="bg-gradient-to-r from-brand-blue via-sky-400 to-brand-silver text-black px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:opacity-90 transition">
          New Module
        </button>
      </div>
    </header>
  );
}