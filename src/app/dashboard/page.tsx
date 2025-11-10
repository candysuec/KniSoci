"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brand } from "@prisma/client";
import { BrandCard } from "./components/BrandCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

function DashboardLoading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-brand-slate/50 border-slate-800 rounded-2xl h-48 animate-pulse" />
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-20 bg-brand-slate/30 border-2 border-dashed border-slate-700 rounded-2xl">
      <h2 className="text-2xl font-semibold text-brand-silver">No Brands Found</h2>
      <p className="text-slate-400 mt-2 mb-6">Get started by creating your first brand.</p>
      <Link href="/brands/new" passHref>
        <Button className="bg-brand-blue hover:bg-blue-700">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Brand
        </Button>
      </Link>
    </div>
  );
}

export default function DashboardPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/brands");
        if (!response.ok) {
          throw new Error("Failed to fetch brands");
        }
        const data = await response.json();
        setBrands(data);
      } catch (error) {
        console.error(error);
        // Handle error state, e.g., show a toast
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return (
    <div className="flex-1 flex flex-col">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-brand-silver">Your Brands</h1>
          <p className="text-slate-400 mt-2">Manage your existing brands or create a new one.</p>
        </div>
        <Link href="/brands/new" passHref>
          <Button className="bg-brand-blue hover:bg-blue-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Brand
          </Button>
        </Link>
      </header>

      <main>
        {isLoading ? (
          <DashboardLoading />
        ) : brands.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((brand, i) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <BrandCard brand={brand} />
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
