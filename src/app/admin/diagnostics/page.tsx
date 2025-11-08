"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import DashboardLayout from "@/components/shared/DashboardLayout";


// ✅ Temporary diagnostics runner
async function fetchDiagnostics() {
  console.log("Running system diagnostics...");
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

export default function DiagnosticsPage() {
  const [loading, setLoading] = useState(false);

  const handleRunDiagnostics = async () => {
    setLoading(true);
    await fetchDiagnostics();
    setLoading(false);
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">System Diagnostics</h1>
          <Button onClick={handleRunDiagnostics} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {loading ? "Refreshing..." : "Run All Checks"}
          </Button>
        </div>

        <div className="mt-6 bg-gray-900 text-white p-4 rounded-lg">
          <p>System checks will appear here after diagnostics run.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
