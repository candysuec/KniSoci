import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation"; // Keep useRouter for client-side navigation
import DashboardLayout from "@/components/shared/DashboardLayout";
import { PlusCircle, LayoutDashboard, Search } from "lucide-react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/db";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    // Handle unauthorized access, e.g., redirect to login or show a message
    // For a Server Component, you might want to redirect or return a specific UI
    return (
      <DashboardLayout>
        <div className="p-6 max-w-6xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">Your Brands</h1>
          <p className="text-red-500">Please log in to view your brands.</p>
        </div>
      </DashboardLayout>
    );
  }

  const brands = await prisma.brand.findMany({
    where: { userId: session.user.id },
  });

  // Since this is a Server Component, client-side state for loading, error, and search
  // will need to be handled differently or moved to a Client Component if interactive search is desired.
  // For now, we'll remove the client-side state for brands, loading, error, and searchQuery.

  // The search functionality will need to be implemented client-side if desired,
  // or as a separate API route if server-side search is preferred.
  // For this initial conversion, we'll remove the client-side search state and filtering.

  // If you want client-side search, you'd wrap the brand display logic in a client component
  // and pass the fetched brands as props.

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Your Brands</h1>
          <Button onClick={() => useRouter().push("/brands/new")}>Create New Brand</Button>
        </div>

        {/* Search Input - This will not be functional as a Server Component directly */}
        {/* If client-side search is needed, this part should be in a separate Client Component */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search brands..."
            // value={searchQuery} // Removed client-side state
            // onChange={(e) => setSearchQuery(e.target.value)} // Removed client-side state
            className="pl-9 pr-3 py-2 border rounded-md w-full"
            disabled // Disable for now as it's not functional in a Server Component
          />
        </div>

        {brands.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg text-gray-500">
            <PlusCircle className="h-12 w-12 mb-4 text-gray-400" />
            <p className="text-xl font-semibold mb-2">No brands found</p>
            <p className="mb-4">Create your first brand to get started!</p>
            <Button onClick={() => useRouter().push("/brands/new")}>
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Brand
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {brands.map((brand) => (
              <Card key={brand.id} className="shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-lg font-semibold">{brand.name}</CardTitle>
                  <LayoutDashboard className="h-5 w-5 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{brand.description}</p>
                  <Button onClick={() => useRouter().push(`/brand/${brand.id}`)}>
                    View Brand Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}