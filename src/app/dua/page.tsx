import { getDuaTree, getDuaCategoriesWithCounts } from "@/server/queries/dua-queries";
import { DuaLibraryClient } from "@/components/dua/dua-library-client";
import { Suspense } from "react";

export const revalidate = 0;

export default async function DuaLibraryPage() {
  const books = await getDuaTree();
  const categories = await getDuaCategoriesWithCounts();

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh] text-emerald-800 font-semibold">
          <span className="h-8 w-8 border-4 border-emerald-800/30 border-t-emerald-800 rounded-full animate-spin mr-3" />
          Loading library explorer...
        </div>
      }
    >
      <DuaLibraryClient initialBooks={books} initialCategories={categories} />
    </Suspense>
  );
}
