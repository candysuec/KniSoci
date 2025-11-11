"use client";

import Link from "next/link";
import { LayoutDashboard, Shield, HeartPulse, Wrench } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/safety", label: "Safety Center", icon: Shield },
  { href: "/admin/selfrepair", label: "Self Repair", icon: Wrench },
  { href: "/admin/diagnostics", label: "Diagnostics", icon: HeartPulse },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-full bg-gray-800 text-gray-200 p-4">
      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white transition-colors"
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
