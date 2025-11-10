"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewBrandPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/brands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        throw new Error("Failed to create brand");
      }

      const brand = await response.json();
      // Redirect to the new brand's page or back to the dashboard
      router.push(`/dashboard`);
      // Optionally, you could redirect to a specific brand page:
      // router.push(`/brand/${brand.id}`);
    } catch (error) {
      console.error(error);
      // Handle error state here, e.g., show a toast notification
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <div className="mb-8">
        <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-brand-silver transition-colors">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </div>
      <Card className="bg-brand-slate/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-brand-silver text-2xl">Create a New Brand</CardTitle>
          <CardDescription className="text-slate-400">
            Give your new brand a name and a brief description to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-brand-silver">
                Brand Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., 'KniBrand OS'"
                required
                className="bg-slate-900/80 border-slate-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-brand-silver">
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., 'An AI-powered operating system for brand identity and consistency.'"
                className="bg-slate-900/80 border-slate-700 text-white"
              />
            </div>
            <Button type="submit" disabled={isLoading || !name} className="w-full bg-brand-blue hover:bg-blue-700">
              {isLoading ? "Creating..." : "Create Brand"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
