"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface EnvVars {
  [key: string]: boolean;
  allPresent: boolean;
}

interface ApiStatus {
  status: string;
  message?: string;
  testResponse?: string;
}

interface DbStatus {
  status: string;
  message?: string;
}

interface SelfRepairLog {
  status?: string;
  lastRun?: string;
  overallStatus?: string;
  message?: string;
}

interface DiagnosticsData {
  overallStatus: string;
  envVars: EnvVars;
  geminiApi: ApiStatus;
  database: DbStatus;
  selfRepairLog: SelfRepairLog;
}

export default function DiagnosticsPage() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDiagnostics = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/system-check");
      if (!response.ok) {
        throw new Error("Failed to fetch diagnostics");
      }
      const data: DiagnosticsData = await response.json();
      setDiagnostics(data);
    } catch (error) {
      console.error("Error fetching diagnostics:", error);
      setDiagnostics(null); // Clear diagnostics on error
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagnostics();
  }, []);

  const getStatusIcon = (status: string) => {
    if (status === "Operational" || status === "Connected" || status === "✅ All systems nominal") {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (status === "Error" || status === "Degraded") {
      return <XCircle className="h-5 w-5 text-red-500" />;
    } else {
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    if (status === "Operational" || status === "Connected" || status === "✅ All systems nominal") {
      return "text-green-400";
    } else if (status === "Error" || status === "Degraded") {
      return "text-red-400";
    } else {
      return "text-yellow-400";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-brand-silver">System Diagnostics</h1>
          <p className="text-slate-400 mt-2 max-w-2xl">
            Real-time health check of KniHub's core services and integrations.
          </p>
        </div>
        <Button onClick={fetchDiagnostics} disabled={isLoading} className="bg-brand-blue hover:bg-blue-700">
          <RefreshCw className="h-4 w-4 mr-2" />
          {isLoading ? "Refreshing..." : "Run All Checks"}
        </Button>
      </header>

      {isLoading ? (
        <div className="text-center text-slate-400">Loading diagnostics...</div>
      ) : diagnostics ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Overall Status */}
          <Card className="bg-brand-slate/50 border-slate-800">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-brand-silver">Overall Status</CardTitle>
              {getStatusIcon(diagnostics.overallStatus)}
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${getStatusColor(diagnostics.overallStatus)}`}>
                {diagnostics.overallStatus}
              </p>
            </CardContent>
          </Card>

          {/* Environment Variables */}
          <Card className="bg-brand-slate/50 border-slate-800">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-brand-silver">Environment Variables</CardTitle>
              {getStatusIcon(diagnostics.envVars.allPresent ? "Operational" : "Error")}
            </CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(diagnostics.envVars).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">{key}</span>
                  {value ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Gemini API Status */}
          <Card className="bg-brand-slate/50 border-slate-800">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-brand-silver">Gemini API</CardTitle>
              {getStatusIcon(diagnostics.geminiApi.status)}
            </CardHeader>
            <CardContent className="space-y-2">
              <p className={`text-lg font-semibold ${getStatusColor(diagnostics.geminiApi.status)}`}>
                {diagnostics.geminiApi.status}
              </p>
              {diagnostics.geminiApi.message && (
                <p className="text-sm text-red-400">{diagnostics.geminiApi.message}</p>
              )}
              {diagnostics.geminiApi.testResponse && (
                <p className="text-xs text-slate-400">Test: "{diagnostics.geminiApi.testResponse}"</p>
              )}
            </CardContent>
          </Card>

          {/* Database Status */}
          <Card className="bg-brand-slate/50 border-slate-800">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-brand-silver">Database</CardTitle>
              {getStatusIcon(diagnostics.database.status)}
            </CardHeader>
            <CardContent className="space-y-2">
              <p className={`text-lg font-semibold ${getStatusColor(diagnostics.database.status)}`}>
                {diagnostics.database.status}
              </p>
              {diagnostics.database.message && (
                <p className="text-sm text-red-400">{diagnostics.database.message}</p>
              )}
            </CardContent>
          </Card>

          {/* Self-Repair Log Status */}
          <Card className="bg-brand-slate/50 border-slate-800">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-brand-silver">Self-Repair Log</CardTitle>
              {diagnostics.selfRepairLog.overallStatus && getStatusIcon(diagnostics.selfRepairLog.overallStatus)}
            </CardHeader>
            <CardContent className="space-y-2">
              {diagnostics.selfRepairLog.lastRun && (
                <p className="text-sm text-slate-300">Last Run: {new Date(diagnostics.selfRepairLog.lastRun).toLocaleString()}</p>
              )}
              {diagnostics.selfRepairLog.overallStatus && (
                <p className={`text-lg font-semibold ${getStatusColor(diagnostics.selfRepairLog.overallStatus)}`}>
                  {diagnostics.selfRepairLog.overallStatus}
                </p>
              )}
              {diagnostics.selfRepairLog.message && (
                <p className="text-sm text-red-400">{diagnostics.selfRepairLog.message}</p>
              )}
              {!diagnostics.selfRepairLog.lastRun && !diagnostics.selfRepairLog.message && (
                <p className="text-sm text-slate-400">No self-repair logs found or could not read.</p>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-10 bg-brand-slate/30 border-2 border-dashed border-slate-700 rounded-2xl">
          <p className="text-slate-400">Failed to load diagnostics. Check console for errors.</p>
        </div>
      )}
    </motion.div>
  );
}
