"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-sky-50 to-white text-gray-900 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        <h1 className="text-5xl font-extrabold mb-4">
          Welcome to <span className="text-blue-600">KniSoci</span>
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Build, discover, and repair your brand with AI-powered insights.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            onClick={() => router.push("/brands/new")}
            className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-6 py-3 rounded-xl shadow-md transition"
          >
            Start a New Brand
          </Button>

          <Button
            onClick={() => router.push("/admin/selfrepair")}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-lg px-6 py-3 rounded-xl shadow-md transition"
          >
            Go to Admin Dashboard
          </Button>
        </div>

        <p className="mt-10 text-sm text-gray-500">
          © {new Date().getFullYear()} KniBrand / KniSoci. All rights reserved.
        </p>
      </motion.div>
    </main>
  );
}
