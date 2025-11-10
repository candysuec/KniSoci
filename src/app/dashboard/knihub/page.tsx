"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadCloud, Bot, Brush, BarChart2, FileText, MessageSquare } from "lucide-react";

const integrations = [
  {
    name: "Notion",
    description: "Export brand guides and content calendars directly to your workspace.",
    icon: FileText,
  },
  {
    name: "Google Drive",
    description: "Sync brand assets, documents, and exports with your cloud storage.",
    icon: UploadCloud,
  },
  {
    name: "Figma",
    description: "Push color palettes, typography, and component styles to your design files.",
    icon: Brush,
  },
  {
    name: "Slack",
    description: "Get real-time alerts for brand health and system status updates.",
    icon: MessageSquare,
  },
  {
    name: "Webflow",
    description: "Sync brand styles and content sections to your Webflow site.",
    icon: Bot,
  },
  {
    name: "Google Analytics",
    description: "Correlate brand activities with website traffic and user engagement.",
    icon: BarChart2,
  },
];

export default function KniHubPage() {
  return (
    <div className="flex-1 flex flex-col">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-brand-silver">KniHub Integrations</h1>
        <p className="text-slate-400 mt-2">Connect your brand to the tools you already use. Scale your ecosystem.</p>
      </header>
      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration, i) => (
          <motion.div
            key={integration.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-brand-slate/50 border-slate-800 hover:border-brand-blue transition-colors flex flex-col h-full">
              <CardHeader className="flex-row items-start gap-4 space-y-0">
                <div className="bg-brand-blue/10 p-3 rounded-lg">
                  <integration.icon className="h-6 w-6 text-brand-blue" />
                </div>
                <div>
                  <CardTitle className="text-brand-silver">{integration.name}</CardTitle>
                  <CardDescription className="text-slate-400 mt-1">{integration.description}</CardDescription>
                </div>
              </CardHeader>
              <CardFooter className="mt-auto">
                <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800/40 hover:text-brand-silver">
                  Connect
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </main>
    </div>
  );
}
