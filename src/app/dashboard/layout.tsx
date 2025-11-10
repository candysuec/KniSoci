"use client";

import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [greeting, setGreeting] = useState("Welcome");
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#0b0b0f] to-[#121212] text-gray-100">
        Loading dashboard...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null; // Or a more elaborate unauthorized message
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-[#0b0b0f] to-[#121212] text-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <TopBar greeting={greeting} toggleSidebar={() => setIsOpen(!isOpen)} />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
