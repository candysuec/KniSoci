"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brand } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarDays, PlusCircle } from "lucide-react";
import Link from "next/link";

interface PostIdea {
  pillar: string;
  format: string;
  hook: string;
  body: string;
  cta: string;
}

export default function ContentCalendarPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch("/api/brands");
        if (response.ok) {
          const data = await response.json();
          setBrands(data);
        }
      } catch (error) {
        console.error("Failed to fetch brands:", error);
      }
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    if (selectedBrandId) {
      const brand = brands.find(b => b.id === selectedBrandId);
      setSelectedBrand(brand || null);
    } else {
      setSelectedBrand(null);
    }
  }, [selectedBrandId, brands]);

  const postIdeas: PostIdea[] = selectedBrand?.postIdeas as PostIdea[] || [];
  const hasPostIdeas = postIdeas.length > 0;

  // Simple grouping by pillar for a calendar-like view
  const ideasByPillar: { [key: string]: PostIdea[] } = postIdeas.reduce((acc, idea) => {
    if (!acc[idea.pillar]) {
      acc[idea.pillar] = [];
    }
    acc[idea.pillar].push(idea);
    return acc;
  }, {} as { [key: string]: PostIdea[] });


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <header>
        <h1 className="text-4xl font-bold text-brand-silver">Content Calendar</h1>
        <p className="text-slate-400 mt-2 max-w-2xl">
          Visualize and plan your social media content based on generated ideas.
        </p>
      </header>

      <Card className="bg-brand-slate/50 border-slate-800">
        <CardContent className="pt-6 space-y-6">
          <div>
            <label className="text-sm font-medium text-brand-silver mb-2 block">Select a Brand</label>
            <Select onValueChange={setSelectedBrandId} value={selectedBrandId}>
              <SelectTrigger className="w-full bg-slate-900/80 border-slate-700 text-white">
                <SelectValue placeholder="Choose a brand to view its content calendar..." />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700 text-white">
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedBrand && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {isLoading ? (
                <div className="text-center text-slate-400">Loading content ideas...</div>
              ) : hasPostIdeas ? (
                <div className="space-y-8">
                  {Object.entries(ideasByPillar).map(([pillar, ideas]) => (
                    <div key={pillar} className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                      <h3 className="text-xl font-semibold text-brand-blue mb-4">{pillar}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {ideas.map((idea, i) => (
                          <Card key={i} className="bg-slate-800/50 border-slate-700">
                            <CardHeader>
                              <CardTitle className="text-brand-silver text-lg">{idea.hook}</CardTitle>
                              <CardDescription className="text-slate-400 text-sm">{idea.format}</CardDescription>
                            </CardHeader>
                            <CardContent className="text-sm text-slate-300">
                              <p className="mb-2">{idea.body}</p>
                              <p className="italic">CTA: {idea.cta}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-brand-slate/30 border-2 border-dashed border-slate-700 rounded-2xl">
                  <h2 className="text-2xl font-semibold text-brand-silver">No Post Ideas Found</h2>
                  <p className="text-slate-400 mt-2 mb-6">
                    Generate post ideas for this brand on its{" "}
                    <Link href={`/brand/${selectedBrandId}`} className="text-brand-blue hover:underline">
                      brand management page
                    </Link>{" "}
                    first.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
