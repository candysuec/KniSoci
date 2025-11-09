"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Brain, Activity, Settings, Wrench, X } from "lucide-react";

const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Branding", href: "/dashboard/branding", icon: Brain },
  { label: "Self Repair", href: "/dashboard/selfrepair", icon: Wrench },
  { label: "Analytics", href: "/dashboard/analytics", icon: Activity },
  { label: "Admin", href: "/dashboard/admin", icon: Settings },
];

export function Sidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-gradient-to-b from-brand-slate to-black border-r border-slate-800 p-6 flex-col shadow-lg">
        <h2 className="text-2xl font-bold text-brand-silver mb-10">CandyHub</h2>
        <nav className="space-y-3">
          {menuItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                  active
                    ? "bg-brand-blue/20 text-brand-blue"
                    : "text-slate-400 hover:text-brand-silver hover:bg-slate-800/40"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden">
          <div className="absolute left-0 top-0 w-64 h-full bg-brand-slate border-r border-slate-800 p-6 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-brand-silver">CandyHub</h2>
              <button onClick={() => setIsOpen(false)}>
                <X size={22} className="text-slate-400 hover:text-brand-silver" />
              </button>
            </div>
            <nav className="space-y-4">
              {menuItems.map(({ label, href, icon: Icon }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-700/40 transition"
                >
                  <Icon size={18} /> {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}