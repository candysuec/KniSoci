"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DashboardLayout from "@/components/shared/DashboardLayout";

interface Brand {
  id: string;
  name: string;
  description?: string;
}

export default function AdminDashboard() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await fetch("/api/brands");
        if (!res.ok) throw new Error(`Failed to load brands: ${res.status}`);
        const data = await res.json();
        setBrands(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBrands();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Your Brands</h1>
        {loading && <p>Loading brands...</p>}
        {error && <p className="text-red-600">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {brands.map((brand) => (
            <Card key={brand.id} className="bg-gray-900 text-white">
              <CardHeader>
                <h2 className="text-xl font-bold">{brand.name}</h2>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 mb-4">
                  {brand.description || "No description provided."}
                </p>
                <Button
                  variant="secondary"
                  onClick={() => alert(`View details for ${brand.name}`)}
                >
                  View Brand Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {!loading && brands.length === 0 && (
          <p className="text-gray-500">No brands found yet. Create one to get started.</p>
        )}
      </div>
    </DashboardLayout>
  );
}