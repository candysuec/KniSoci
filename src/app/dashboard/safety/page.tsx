"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, ShieldCheck } from "lucide-react";

// Placeholder component for the Safety Score
const SafetyScoreSection = () => {
  const score = 78; // Static score for now

  return (
    <Card className="bg-brand-slate/50 border-slate-800">
      <CardHeader>
        <CardTitle className="text-brand-silver flex items-center gap-2">
          <ShieldCheck className="text-green-400" />
          Your Digital Safety Score
        </CardTitle>
        <CardDescription className="text-slate-400">
          A measure of your digital identity's security posture.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <div className="text-7xl font-bold text-green-400">{score}</div>
        <p className="text-slate-400 mt-2">Good</p>
        <p className="text-sm text-slate-500 mt-4">
          Based on connected accounts, monitoring activity, and brand completeness.
        </p>
      </CardContent>
    </Card>
  );
};

// Placeholder component for the Report & Recover Dashboard
const ReportAndRecoverSection = () => {
  const [reportedUrl, setReportedUrl] = useState("");
  const [category, setCategory] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // API call to submit the report will go here
    console.log({ reportedUrl, category, notes });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setReportedUrl("");
    setCategory("");
    setNotes("");
  };

  return (
    <Card className="bg-brand-slate/50 border-slate-800">
      <CardHeader>
        <CardTitle className="text-brand-silver flex items-center gap-2">
          <Shield className="text-red-400" />
          Report & Recover Dashboard
        </CardTitle>
        <CardDescription className="text-slate-400">
          Found a fake profile or a scam? Report it here to take action.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="reportedUrl" className="text-sm font-medium text-brand-silver mb-2 block">
              URL of Fake Profile or Scam
            </label>
            <Input
              id="reportedUrl"
              type="url"
              placeholder="https://twitter.com/fake_profile"
              value={reportedUrl}
              onChange={(e) => setReportedUrl(e.target.value)}
              required
              className="bg-slate-900/80 border-slate-700 text-white"
            />
          </div>
          <div>
            <label htmlFor="category" className="text-sm font-medium text-brand-silver mb-2 block">
              Category
            </label>
            <Select onValueChange={setCategory} value={category} required>
              <SelectTrigger className="w-full bg-slate-900/80 border-slate-700 text-white">
                <SelectValue placeholder="Select a category..." />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-700 text-white">
                <SelectItem value="IMPERSONATION">Impersonation / Fake Profile</SelectItem>
                <SelectItem value="PHISHING">Phishing Attempt</SelectItem>
                <SelectItem value="SCAM">Financial Scam</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="notes" className="text-sm font-medium text-brand-silver mb-2 block">
              Additional Notes (Optional)
            </label>
            <Textarea
              id="notes"
              placeholder="Provide any additional details..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-slate-900/80 border-slate-700 text-white"
            />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full bg-brand-blue hover:bg-blue-700">
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};


export default function SafetyCenterPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <header>
        <h1 className="text-4xl font-bold text-brand-silver">Safety Center</h1>
        <p className="text-slate-400 mt-2 max-w-2xl">
          Monitor your digital identity, manage threats, and build trust.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <SafetyScoreSection />
        </div>
        <div className="lg:col-span-2">
          <ReportAndRecoverSection />
        </div>
      </div>
    </motion.div>
  );
}
