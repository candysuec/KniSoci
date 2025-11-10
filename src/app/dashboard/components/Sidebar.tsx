"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutGrid,
  Share2,
  Palette,
  MessageSquare,
  BookOpen,
  Sparkles,
  Cpu,
  Shield,
  Wrench,
  BarChart2,
  ChevronDown,
  X,
  CheckCheck, // Added CheckCheck icon
  CalendarDays, // Added CalendarDays icon
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { label: "KniHub", href: "/dashboard/knihub", icon: Share2 },
  { label: "Brand", href: "/dashboard/brand", icon: Palette },
  { label: "Social", href: "/dashboard/social", icon: MessageSquare },
  { label: "Content Calendar", href: "/dashboard/content-calendar", icon: CalendarDays }, // Added Content Calendar
  { label: "Learn", href: "/dashboard/learn", icon: BookOpen },
  { label: "Studio AI", href: "/dashboard/studio-ai", icon: Sparkles },
  { label: "Consistency Checker", href: "/dashboard/consistency-checker", icon: CheckCheck }, // Added Consistency Checker
  { label: "Core", href: "/dashboard/core", icon: Cpu },
  {
    label: "Admin",
    icon: Shield,
    subItems: [
      { label: "Self Repair", href: "/dashboard/admin/selfrepair", icon: Wrench },
      { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart2 },
    ],
  },
];

const NavLink = ({ item, activePath }: { item: any; activePath: string }) => {
  const active = activePath === item.href || (item.href !== "/dashboard" && activePath.startsWith(item.href));
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
        active
          ? "bg-brand-blue/20 text-brand-blue"
          : "text-slate-400 hover:text-brand-silver hover:bg-slate-800/40"
      }`}
    >
      <item.icon size={18} />
      {item.label}
    </Link>
  );
};

const CollapsibleNavLink = ({ item, activePath }: { item: any; activePath: string }) => {
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(
    item.subItems.some((subItem: any) => activePath.startsWith(subItem.href))
  );
  const isActive = item.subItems.some((subItem: any) => activePath.startsWith(subItem.href));

  return (
    <div>
      <button
        onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
        className={`flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg transition ${
          isActive
            ? "text-brand-silver bg-slate-800/40"
            : "text-slate-400 hover:text-brand-silver hover:bg-slate-800/40"
        }`}
      >
        <div className="flex items-center gap-3">
          <item.icon size={18} />
          {item.label}
        </div>
        <ChevronDown
          size={16}
          className={`transition-transform ${isSubmenuOpen ? "rotate-180" : ""}`}
        />
      </button>
      {isSubmenuOpen && (
        <div className="pl-6 mt-2 space-y-1">
          {item.subItems.map((subItem: any) => (
            <NavLink key={subItem.label} item={subItem} activePath={activePath} />
          ))}
        </div>
      )}
    </div>
  );
};


export function Sidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}) {
  const pathname = usePathname();

  const renderNavItems = (isMobile = false) =>
    navItems.map((item) => {
      if (item.subItems) {
        return <CollapsibleNavLink key={item.label} item={item} activePath={pathname} />;
      }
      return <NavLink key={item.label} item={item} activePath={pathname} />;
    });


  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-gradient-to-b from-brand-slate to-black border-r border-slate-800 p-6 flex-col shadow-lg">
        <h2 className="text-2xl font-bold text-brand-silver mb-10">KniHub</h2>
        <nav className="space-y-2">{renderNavItems()}</nav>
      </aside>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden">
          <div className="absolute left-0 top-0 w-64 h-full bg-brand-slate border-r border-slate-800 p-6 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-brand-silver">KniHub</h2>
              <button onClick={() => setIsOpen(false)}>
                <X size={22} className="text-slate-400 hover:text-brand-silver" />
              </button>
            </div>
            <nav className="space-y-2">
              {navItems.map((item) => {
                if (item.subItems) {
                  return (
                    <div key={item.label}>
                      <h3 className="px-3 pt-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">{item.label}</h3>
                      {item.subItems.map((subItem) => (
                         <Link
                            key={subItem.label}
                            href={subItem.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-700/40 transition"
                          >
                            <subItem.icon size={18} /> {subItem.label}
                          </Link>
                      ))}
                    </div>
                  )
                }
                return (
                   <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-700/40 transition"
                    >
                      <item.icon size={18} /> {item.label}
                    </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}