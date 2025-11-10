"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brand } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wand2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';

interface AdvancedAnalysisResult {
  score: number;
  report: string;
}

export default function AdvancedConsistencyCheckerPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState<string>("");
  const [contentToAnalyze, setContentToAnalyze] = useState<string>("");
  const [result, setResult] = useState<AdvancedAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch user's brands to populate the dropdown
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

  const handleCheckConsistency = async () => {
    if (!selectedBrandId || !contentToAnalyze) return;

    setIsLoading(true);
    setResult(null);
    try {
      const response = await fetch('/api/generate/advanced-consistency-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandId: selectedBrandId, contentToAnalyze }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to check advanced consistency');
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      // You could show an error toast here
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <header>
        <h1 className="text-4xl font-bold text-brand-silver">Advanced Brand Consistency Checker</h1>
        <p className="text-slate-400 mt-2 max-w-2xl">
          Get a holistic consistency score and detailed report by analyzing your content against your full brand identity.
        </p>
      </header>

      <Card className="bg-brand-slate/50 border-slate-800">
        <CardContent className="pt-6 grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-brand-silver mb-2 block">1. Select a Brand</label>
              <Select onValueChange={setSelectedBrandId} value={selectedBrandId}>
                <SelectTrigger className="w-full bg-slate-900/80 border-slate-700 text-white">
                  <SelectValue placeholder="Choose a brand to check against..." />
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
            <div>
              <label className="text-sm font-medium text-brand-silver mb-2 block">2. Paste Your Content or Describe Visuals</label>
              <Textarea
                value={contentToAnalyze}
                onChange={(e) => setContentToAnalyze(e.target.value)}
                placeholder="Paste your text (e.g., blog post, ad copy) or describe visual content (e.g., 'A social media graphic with bold typography and a vibrant color scheme')..."
                className="bg-slate-900/80 border-slate-700 text-white min-h-[200px]"
              />
            </div>
            <Button
              onClick={handleCheckConsistency}
              disabled={isLoading || !selectedBrandId || !contentToAnalyze}
              className="w-full bg-brand-blue hover:bg-blue-700 disabled:bg-slate-600"
            >
              <Wand2 className="mr-2 h-4 w-4" />
              {isLoading ? "Analyzing..." : "Check Advanced Consistency"}
            </Button>
          </div>

          <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800 flex flex-col">
            {isLoading ? (
              <div className="text-slate-400 text-center flex-grow flex items-center justify-center">Analyzing...</div>
            ) : result ? (
              <div className="space-y-4 flex-grow">
                <div className="text-center">
                  <p className="text-slate-400 text-sm">Overall Consistency Score</p>
                  <p className={`text-7xl font-bold ${getScoreColor(result.score)}`}>{result.score}</p>
                </div>
                <div className="text-slate-300 mt-4 prose prose-invert max-w-none">
                  <ReactMarkdown>{result.report}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-500 flex-grow flex items-center justify-center">
                <p>Your advanced analysis results will appear here.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}