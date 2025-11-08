
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Lock, FileText, BookOpen, Code, HardDrive, Zap } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import DashboardLayout from "@/components/shared/DashboardLayout";
import LogPanel from "@/components/LogPanel";
import DailySummaryButton from "@/components/DailySummaryButton";
import SelfRepairTrend from "@/components/SelfRepairTrend";
import WeeklyRollupCard from "@/components/WeeklyRollupCard";

interface SelfRepairReport {
  timestamp: string;
  mode: string;
  overall: string;
  checks: {
    codebase?: any;
    environment?: any;
    sdk?: any;
  };
}

export default function SelfRepairDashboard() {
  const [data, setData] = useState<SelfRepairReport | null>({
    timestamp: new Date().toLocaleString(),
    mode: "development",
    overall: "✅ All systems nominal",
    checks: {
      codebase: { message: "✅ No deprecated references found", deprecatedReferences: 0 },
      environment: { file: ".env.local", message: "✅ All required environment variables set" },
      sdk: { version: "0.24.1", message: "✅ SDK connected", response: "Gemini 2.5 Flash" },
    },
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authorized, setAuthorized] = useState(false);
  const [keyInput, setKeyInput] = useState("");

  // === AUTH + FETCH LOGIC ===
  const fetchReport = async (repair = false, key?: string) => {
    const token = key || localStorage.getItem("adminKey");
    if (!token) {
      setError("No admin key found");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/generate/selfrepair${repair ? "?repair=true" : ""}`, {
        cache: "no-store",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) throw new Error("Unauthorized — invalid admin key");
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    if (!keyInput.trim()) {
      setError("Please enter your admin key.");
      return;
    }
    localStorage.setItem("adminKey", keyInput.trim());
    setAuthorized(true);
    fetchReport(false, keyInput.trim());
  };

  const handleLogout = () => {
    localStorage.removeItem("adminKey");
    setAuthorized(false);
    setData(null);
  };

  useEffect(() => {
    const storedKey = localStorage.getItem("adminKey");
    if (storedKey) {
      setAuthorized(true);
      fetchReport(false, storedKey);
    }
  }, []);

  const statusColor = (msg: string) => {
    if (msg.includes("✅")) return "text-green-600";
    if (msg.includes("⚠️")) return "text-yellow-600";
    if (msg.includes("❌")) return "text-red-600";
    return "text-gray-600";
  };

  const getStatusIndicatorColor = (msg: string) => {
    if (msg.includes("✅")) return "bg-green-500";
    if (msg.includes("⚠️")) return "bg-yellow-500";
    if (msg.includes("❌")) return "bg-red-500";
    return "bg-gray-400";
  };

  const SectionCard = ({
    title,
    body,
    icon,
  }: {
    title: string;
    body: React.ReactNode;
    icon?: React.ReactNode;
  }) => (
    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="shadow-sm border rounded-2xl mb-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 px-5 bg-gray-50 border-b rounded-t-2xl">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            {icon && <span className="text-gray-500">{icon}</span>}
            {title}
          </h2>
        </CardHeader>
        <CardContent className="p-5 space-y-2">{body}</CardContent>
      </Card>
    </motion.div>
  );

  // === AUTH SCREEN ===
  if (!authorized) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center p-6">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <Card className="p-6 w-96 text-center space-y-4">
              <Lock className="h-8 w-8 mx-auto text-gray-500" />
              <h1 className="text-2xl font-bold">Admin Login</h1>
              <p className="text-gray-600 text-sm">
                Enter your <code>ADMIN_ACCESS_KEY</code> to access the dashboard.
              </p>
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="Enter Admin Key"
                className="w-full border rounded-lg p-2 text-center outline-none focus:ring focus:ring-blue-300"
              />
<Button
  onClick={() => {
    if (!keyInput.trim()) {
      setError("Please enter your admin key.");
      return;
    }
    localStorage.setItem("adminKey", keyInput.trim());
    setAuthorized(true);
    fetchReport(false, keyInput.trim());
  }}
  className="w-full"
>
  Unlock Dashboard
</Button>

              {error && <p className="text-red-600 text-sm">{error}</p>}
            </Card>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  // === MAIN DASHBOARD ===
  return (
    <DashboardLayout>
      {data && (
        <>
          <SectionCard
            title="Overview"
            icon={<BookOpen className="h-5 w-5" />}
            body={
              <div className="space-y-1">
                <p><b>Timestamp:</b> {data.timestamp}</p>
                <p><b>Mode:</b> {data.mode}</p>
                <p className={`font-semibold flex items-center gap-2 ${statusColor(data.overall)}`}>
                  <span className={`h-3 w-3 rounded-full ${getStatusIndicatorColor(data.overall)}`}></span>
                  {data.overall}
                </p>
              </div>
            }
          />

          <SectionCard
            title="Codebase Check"
            icon={<Code className="h-5 w-5" />}
            body={
              <SyntaxHighlighter language="json" style={atomDark}>
                {JSON.stringify(data.checks.codebase, null, 2)}
              </SyntaxHighlighter>
            }
          />

          <SectionCard
            title="Environment"
            icon={<HardDrive className="h-5 w-5" />}
            body={
              <SyntaxHighlighter language="json" style={atomDark}>
                {JSON.stringify(data.checks.environment, null, 2)}
              </SyntaxHighlighter>
            }
          />

          <SectionCard
            title="SDK Diagnostics"
            icon={<Zap className="h-5 w-5" />}
            body={
              <SyntaxHighlighter language="json" style={atomDark}>
                {JSON.stringify(data.checks.sdk, null, 2)}
              </SyntaxHighlighter>
            }
          />

          <SectionCard title="System Logs" icon={<FileText className="h-5 w-5" />} body={<LogPanel />} />
        </>
      )}
    </DashboardLayout>
  );
}
