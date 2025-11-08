"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function GeminiTestPage() {
  const [results, setResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const routes = [
    {
      name: "Brand Discovery",
      path: "/api/generate/brand-discovery",
      body: { prompt: "Describe the ideal brand voice for an eco-friendly coffee company." },
    },
    {
      name: "Brand Book",
      path: "/api/generate/brand-book",
      body: { brandId: "test-id-123" },
    },
    {
      name: "Self Repair",
      path: "/api/generate/selfrepair",
      body: { repair: false, context: { test: "connectivity check" } },
    },
  ];

  async function testRoute(route: (typeof routes)[number]) {
    setError(null);
    setLoading(route.name);

    try {
      const res = await fetch(route.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(route.body),
      });

      const data = await res.json();
      setResults((prev) => ({ ...prev, [route.name]: data }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-2">🧪 Gemini API Test Dashboard</h1>
      <p className="text-gray-500">Click each button to test a route and view its JSON response.</p>

      <div className="grid md:grid-cols-3 gap-6">
        {routes.map((route) => (
          <Card key={route.name} className="shadow-md border">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {route.name}
                <Button
                  onClick={() => testRoute(route)}
                  disabled={!!loading}
                  className="ml-2"
                >
                  {loading === route.name ? "Testing..." : "Run Test"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {results[route.name] ? (
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                  {JSON.stringify(results[route.name], null, 2)}
                </pre>
              ) : (
                <p className="text-sm text-gray-400 italic">No data yet.</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {error && <p className="text-red-600 font-medium">⚠️ {error}</p>}
    </div>
  );
}