"use client";

export default function Sidebar() {
  return (
    <aside className="w-64 h-full bg-gray-800 text-gray-200 p-4">
      <nav className="space-y-3">
        <a href="/dashboard" className="block hover:text-white">Dashboard</a>
        <a href="/admin/selfrepair" className="block hover:text-white">Self Repair</a>
        <a href="/admin/diagnostics" className="block hover:text-white">Diagnostics</a>
      </nav>
    </aside>
  );
}
