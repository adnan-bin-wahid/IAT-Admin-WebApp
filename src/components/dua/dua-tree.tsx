import { DuaTreeBookNode } from "./dua-tree-book-node";
import { DuaBookWithIndexes, DuaIndexWithItems, DuaItemWithCategory } from "@/types/dua";

interface DuaTreeProps {
  books: DuaBookWithIndexes[];
  selectedId: string | null;
  selectedType: string | null;
  onSelectNode: (
    type: "book" | "index" | "dua",
    id: string,
    data: DuaBookWithIndexes | DuaIndexWithItems | DuaItemWithCategory
  ) => void;
  isSearching: boolean;
}

export function DuaTree({ books, selectedId, selectedType, onSelectNode, isSearching }: DuaTreeProps) {
  if (!books || books.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 text-sm bg-white rounded-2xl border border-slate-100/60 shadow-sm">
        No books, indexes, or duas match your search criteria.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {books.map((book) => (
        <DuaTreeBookNode
          key={book.id}
          bookNode={book}
          selectedId={selectedId}
          selectedType={selectedType}
          onSelectNode={onSelectNode}
          defaultExpanded={isSearching}
        />
      ))}
    </div>
  );
}
