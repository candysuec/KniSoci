"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brand } from "@prisma/client"; // Assuming Brand type is available from Prisma client

interface BrandCardProps {
  brand: Brand;
}

export function BrandCard({ brand }: BrandCardProps) {
  return (
    <Card className="bg-brand-slate/50 border-slate-800 hover:border-brand-blue transition-colors flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-brand-silver">{brand.name}</CardTitle>
        {brand.description && (
          <CardDescription className="text-slate-400 mt-1 line-clamp-2">{brand.description}</CardDescription>
        )}
      </CardHeader>
      <CardFooter className="mt-auto">
        <Link href={`/brand/${brand.id}`} passHref className="w-full">
          <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800/40 hover:text-brand-silver">
            Manage Brand
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
