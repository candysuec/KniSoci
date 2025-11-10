"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Mail, Lock, User } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SignUpPage() {
  const particles = Array.from({ length: 10 }); // Fewer particles for a minimal look

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-brand-slate to-black text-gray-100 p-4 overflow-hidden">
      {/* Background Animated Orbs */}
      <div className="absolute inset-0 overflow-hidden z-0">
        {particles.map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-brand-blue/10 blur-lg"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{ duration: Math.random() * 6 + 4, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="bg-brand-slate/80 backdrop-blur-lg border border-brand-slate/50 shadow-xl rounded-xl p-6">
          <CardHeader className="text-center space-y-2 mb-6">
            <div className="mx-auto h-12 w-12 bg-brand-blue rounded-full flex items-center justify-center text-white text-2xl font-bold">
              K
            </div>
            <h1 className="text-3xl font-bold text-brand-silver">Join KniBrand</h1>
            <p className="text-sm text-slate-400">
              Create your account to start crafting your brand's story.
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Full Name"
                className="w-full pl-10 bg-brand-slate/50 border border-gray-700 text-brand-silver placeholder-gray-500 rounded-lg py-2 focus:ring-brand-blue focus:border-brand-blue"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="email"
                placeholder="Email"
                className="w-full pl-10 bg-brand-slate/50 border border-gray-700 text-brand-silver placeholder-gray-500 rounded-lg py-2 focus:ring-brand-blue focus:border-brand-blue"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="password"
                placeholder="Password"
                className="w-full pl-10 bg-brand-slate/50 border border-gray-700 text-brand-silver placeholder-gray-500 rounded-lg py-2 focus:ring-brand-blue focus:border-brand-blue"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 mt-6">
            <Button
              className="w-full bg-brand-blue hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
            >
              Sign Up
            </Button>
            <p className="text-sm text-slate-400">
              Already have an account?{" "}
              <Link href="/login" className="text-brand-blue hover:underline">
                Log In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </main>
  );
}