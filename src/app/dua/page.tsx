import { getDuaTree } from "@/server/queries/dua-queries";
import { DuaLibraryClient } from "@/components/dua/dua-library-client";

export const revalidate = 0;

export default async function DuaLibraryPage() {
  const books = await getDuaTree();

  return <DuaLibraryClient initialBooks={books} />;
}
