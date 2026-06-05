"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { DuaTree } from "./dua-tree";
import { DuaDetailPanel } from "./dua-detail-panel";
import { DuaEmptyState } from "./dua-empty-state";
import { Search, Plus } from "lucide-react";
import { DuaBookWithIndexes, DuaIndexWithItems, DuaItemWithCategory } from "@/types/dua";
import { BookFormDialog } from "./book-form-dialog";
import { IndexFormDialog } from "./index-form-dialog";
import { Toaster } from "sonner";

interface DuaLibraryClientProps {
  initialBooks: DuaBookWithIndexes[];
}

export function DuaLibraryClient({ initialBooks }: DuaLibraryClientProps) {
  const [selectedType, setSelectedType] = useState<"book" | "index" | "dua" | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [isAddIndexOpen, setIsAddIndexOpen] = useState(false);

  // Resolve selectedItem during render to avoid synchronous state synchronization in useEffect
  let selectedItem: DuaBookWithIndexes | DuaIndexWithItems | DuaItemWithCategory | null = null;
  if (selectedId && selectedType) {
    if (selectedType === "book") {
      selectedItem = initialBooks.find((b) => b.id === selectedId) || null;
    } else if (selectedType === "index") {
      for (const book of initialBooks) {
        const idx = book.indexes.find((i) => i.id === selectedId);
        if (idx) {
          selectedItem = idx;
          break;
        }
      }
    } else if (selectedType === "dua") {
      for (const book of initialBooks) {
        for (const idx of book.indexes) {
          const d = idx.duaItems.find((item) => item.id === selectedId);
          if (d) {
            selectedItem = d;
            break;
          }
        }
        if (selectedItem) break;
      }
    }
  }

  // Extract books options array for parent selector dialogs
  const bookOptions = initialBooks.map((b) => ({
    id: b.id,
    nameEn: b.nameEn,
    nameBn: b.nameBn,
    status: b.status,
  }));

  // Determine pre-selected book ID for the Add Index dialog based on selection context
  let defaultBookId: string | null = null;
  if (selectedType === "book" && selectedItem) {
    defaultBookId = selectedItem.id;
  } else if (selectedType === "index" && selectedItem) {
    defaultBookId = (selectedItem as DuaIndexWithItems).bookId;
  } else if (selectedType === "dua" && selectedItem) {
    defaultBookId = (selectedItem as DuaItemWithCategory).bookId;
  }

  const handleSelectNode = (
    type: "book" | "index" | "dua",
    id: string
  ) => {
    setSelectedType(type);
    setSelectedId(id);
  };

  // Client-side search algorithm
  const filterTree = (books: DuaBookWithIndexes[], query: string): DuaBookWithIndexes[] => {
    if (!query) return books;
    const lowerQuery = query.toLowerCase().trim();

    return books
      .map((book) => {
        const bookMatches =
          book.nameEn.toLowerCase().includes(lowerQuery) ||
          book.nameBn.toLowerCase().includes(lowerQuery) ||
          (book.subtitleEn && book.subtitleEn.toLowerCase().includes(lowerQuery)) ||
          (book.subtitleBn && book.subtitleBn.toLowerCase().includes(lowerQuery));

        // Filter indexes
        const filteredIndexes = book.indexes
          .map((index: DuaIndexWithItems) => {
            const indexMatches =
              index.titleEn.toLowerCase().includes(lowerQuery) ||
              index.titleBn.toLowerCase().includes(lowerQuery) ||
              (index.subtitleEn && index.subtitleEn.toLowerCase().includes(lowerQuery)) ||
              (index.subtitleBn && index.subtitleBn.toLowerCase().includes(lowerQuery));

            // Filter dua items
            const filteredDuaItems = index.duaItems.filter((dua: DuaItemWithCategory) => {
              const duaMatches =
                dua.titleEn.toLowerCase().includes(lowerQuery) ||
                dua.titleBn.toLowerCase().includes(lowerQuery) ||
                (dua.referenceEn && dua.referenceEn.toLowerCase().includes(lowerQuery)) ||
                (dua.referenceBn && dua.referenceBn.toLowerCase().includes(lowerQuery)) ||
                (dua.category?.nameEn && dua.category.nameEn.toLowerCase().includes(lowerQuery)) ||
                (dua.category?.nameBn && dua.category.nameBn.toLowerCase().includes(lowerQuery));

              return duaMatches;
            });

            if (bookMatches || indexMatches || filteredDuaItems.length > 0) {
              return {
                ...index,
                duaItems: bookMatches ? index.duaItems : filteredDuaItems,
              } as DuaIndexWithItems;
            }
            return null;
          })
          .filter(Boolean) as DuaIndexWithItems[];

        if (bookMatches || filteredIndexes.length > 0) {
          return {
            ...book,
            indexes: bookMatches ? book.indexes : filteredIndexes,
          } as DuaBookWithIndexes;
        }
        return null;
      })
      .filter(Boolean) as DuaBookWithIndexes[];
  };

  const filteredBooks = filterTree(initialBooks, searchQuery);
  const isSearching = searchQuery.length > 0;

  return (
    <div className="space-y-6">
      {/* Header and Add Actions Placeholders */}
      <PageHeader
        title="Dua Library"
        description="Manage books, indexes, and dua content for the mobile app"
        actions={
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIsAddBookOpen(true)}
              className="bg-[#022c22] text-white hover:opacity-90 font-medium py-1.5 px-3 rounded-xl text-xs shadow-sm flex items-center gap-1 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Book
            </button>
            <button
              onClick={() => setIsAddIndexOpen(true)}
              className="bg-[#022c22] text-white hover:opacity-90 font-medium py-1.5 px-3 rounded-xl text-xs shadow-sm flex items-center gap-1 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Index
            </button>
            <button className="bg-slate-100 text-slate-400 cursor-not-allowed font-medium py-1.5 px-3 rounded-xl text-xs border border-slate-200/50 flex items-center gap-1" disabled>
              <Plus className="h-3.5 w-3.5" /> Dua
            </button>
          </div>
        }
      />

      {/* Top Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search books, indexes, duas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-emerald-700 focus:bg-white focus:ring-1 focus:ring-emerald-700/20"
          />
        </div>
        
        {/* Optional filter placeholder */}
        <div className="flex items-center gap-2">
          <select className="rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs outline-none text-slate-500 font-semibold cursor-not-allowed" disabled>
            <option>All Statuses</option>
          </select>
        </div>
      </div>

      {/* Main split explorer content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Left Tree Navigator */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/60 max-h-[70vh] overflow-y-auto pr-2">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 pl-1">Content Explorer</h3>
            <DuaTree
              books={filteredBooks}
              selectedId={selectedId}
              selectedType={selectedType}
              onSelectNode={handleSelectNode}
              isSearching={isSearching}
            />
          </div>
        </div>

        {/* Right Inspector Panel */}
        <div className="lg:col-span-3 min-h-[50vh]">
          {selectedType && selectedItem ? (
            <DuaDetailPanel selectedType={selectedType} selectedItem={selectedItem} books={bookOptions} />
          ) : (
            <DuaEmptyState />
          )}
        </div>
      </div>

      <BookFormDialog
        isOpen={isAddBookOpen}
        onClose={() => setIsAddBookOpen(false)}
      />
      
      <IndexFormDialog
        isOpen={isAddIndexOpen}
        onClose={() => setIsAddIndexOpen(false)}
        books={bookOptions}
        defaultBookId={defaultBookId}
      />
      
      <Toaster richColors position="top-right" />
    </div>
  );
}
