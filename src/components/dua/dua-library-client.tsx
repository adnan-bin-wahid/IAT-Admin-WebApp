"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { DuaTree } from "./dua-tree";
import { DuaDetailPanel } from "./dua-detail-panel";
import { DuaEmptyState } from "./dua-empty-state";
import { Search, Plus } from "lucide-react";
import { DuaBookWithIndexes, DuaIndexWithItems, DuaItemWithCategory, DuaCategoryWithCount } from "@/types/dua";
import { BookFormDialog } from "./book-form-dialog";
import { IndexFormDialog } from "./index-form-dialog";
import { CategoryFormDialog } from "./category-form-dialog";
import { DuaItemFormDialog } from "./dua-item-form-dialog";
import { CategoryList } from "./category-list";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { DuaFilterBar } from "./dua-filter-bar";

interface DuaLibraryClientProps {
  initialBooks: DuaBookWithIndexes[];
  initialCategories: DuaCategoryWithCount[];
}

export function DuaLibraryClient({ initialBooks, initialCategories }: DuaLibraryClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  // URL search params as source of truth
  const searchQuery = searchParams.get("q") || "";
  const statusFilter = searchParams.get("status") || "all";
  const visibilityFilter = searchParams.get("visibility") || "all";
  const categoryFilter = searchParams.get("category") || "all";
  const contentTypeFilter = searchParams.get("type") || "all";

  const [selectedType, setSelectedType] = useState<"book" | "index" | "dua" | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchVal, setSearchVal] = useState(searchQuery);

  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [isAddIndexOpen, setIsAddIndexOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isAddDuaOpen, setIsAddDuaOpen] = useState(false);
  const [activeView, setActiveView] = useState<"tree" | "categories">("tree");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // Sync searchVal with URL q if it changes externally (e.g. dashboard clicks)
  const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery);
  if (searchQuery !== prevSearchQuery) {
    setPrevSearchQuery(searchQuery);
    setSearchVal(searchQuery);
  }

  const updateFilters = useCallback((updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "all" || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, [searchParams, pathname, router]);

  // Debounce search query update
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchVal !== searchQuery) {
        updateFilters({ q: searchVal || null });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchVal, searchQuery, updateFilters]);

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

  // Determine pre-selected book and index IDs for dialogs based on selection context
  let defaultBookId: string | null = null;
  let defaultIndexId: string | null = null;
  if (selectedType === "book" && selectedItem) {
    defaultBookId = selectedItem.id;
  } else if (selectedType === "index" && selectedItem) {
    defaultBookId = (selectedItem as DuaIndexWithItems).bookId;
    defaultIndexId = selectedItem.id;
  } else if (selectedType === "dua" && selectedItem) {
    defaultBookId = (selectedItem as DuaItemWithCategory).bookId;
    defaultIndexId = (selectedItem as DuaItemWithCategory).indexId;
  }

  const handleSelectNode = (
    type: "book" | "index" | "dua",
    id: string
  ) => {
    setSelectedType(type);
    setSelectedId(id);
  };

  // Comprehensive recursive search and filter tree matching algorithm
  const filterTree = (books: DuaBookWithIndexes[]): DuaBookWithIndexes[] => {
    const query = searchQuery.toLowerCase().trim();

    return books
      .map((book) => {
        const bookTextMatch = !query ||
          book.nameEn.toLowerCase().includes(query) ||
          book.nameBn.toLowerCase().includes(query) ||
          (book.subtitleEn && book.subtitleEn.toLowerCase().includes(query)) ||
          (book.subtitleBn && book.subtitleBn.toLowerCase().includes(query));

        const bookStatusMatch = statusFilter === "all" || book.status === statusFilter;
        const bookVisibilityMatch = visibilityFilter === "all" ||
          (visibilityFilter === "visible" ? book.isVisibleInApp : !book.isVisibleInApp);

        const bookMatchesDirectly = bookTextMatch && bookStatusMatch && bookVisibilityMatch;

        // Filter indexes
        const filteredIndexes = book.indexes
          .map((index) => {
            const indexTextMatch = !query ||
              index.titleEn.toLowerCase().includes(query) ||
              index.titleBn.toLowerCase().includes(query) ||
              (index.subtitleEn && index.subtitleEn.toLowerCase().includes(query)) ||
              (index.subtitleBn && index.subtitleBn.toLowerCase().includes(query));

            const indexStatusMatch = statusFilter === "all" || index.status === statusFilter;
            const indexVisibilityMatch = visibilityFilter === "all" ||
              (visibilityFilter === "visible" ? index.isVisibleInApp : !index.isVisibleInApp);

            const indexMatchesDirectly = (bookTextMatch || indexTextMatch) && indexStatusMatch && indexVisibilityMatch;

            // Filter dua items
            const filteredDuaItems = index.duaItems.filter((dua) => {
              const duaTextMatch = !query ||
                dua.titleEn.toLowerCase().includes(query) ||
                dua.titleBn.toLowerCase().includes(query) ||
                (dua.shortDescriptionEn && dua.shortDescriptionEn.toLowerCase().includes(query)) ||
                (dua.shortDescriptionBn && dua.shortDescriptionBn.toLowerCase().includes(query)) ||
                (dua.arabicText && dua.arabicText.toLowerCase().includes(query)) ||
                (dua.banglaMeaning && dua.banglaMeaning.toLowerCase().includes(query)) ||
                (dua.englishMeaning && dua.englishMeaning.toLowerCase().includes(query)) ||
                (dua.transliterationEn && dua.transliterationEn.toLowerCase().includes(query)) ||
                (dua.transliterationBn && dua.transliterationBn.toLowerCase().includes(query)) ||
                (dua.referenceEn && dua.referenceEn.toLowerCase().includes(query)) ||
                (dua.referenceBn && dua.referenceBn.toLowerCase().includes(query)) ||
                (dua.category?.nameEn && dua.category.nameEn.toLowerCase().includes(query)) ||
                (dua.category?.nameBn && dua.category.nameBn.toLowerCase().includes(query)) ||
                (dua.tagsEn && dua.tagsEn.some((t) => t.toLowerCase().includes(query))) ||
                (dua.tagsBn && dua.tagsBn.some((t) => t.toLowerCase().includes(query))) ||
                (dua.searchKeywordsEn && dua.searchKeywordsEn.toLowerCase().includes(query)) ||
                (dua.searchKeywordsBn && dua.searchKeywordsBn.toLowerCase().includes(query));

              const duaTextPassed = bookTextMatch || indexTextMatch || duaTextMatch;

              const duaStatusMatch = statusFilter === "all" || dua.status === statusFilter;
              const duaVisibilityMatch = visibilityFilter === "all" ||
                (visibilityFilter === "visible" ? dua.isVisibleInApp : !dua.isVisibleInApp);
              const duaCategoryMatch = categoryFilter === "all" || dua.categoryId === categoryFilter;

              return duaTextPassed && duaStatusMatch && duaVisibilityMatch && duaCategoryMatch;
            });

            if (contentTypeFilter === "book") return null;

            if (contentTypeFilter === "dua") {
              if (filteredDuaItems.length > 0) {
                return { ...index, duaItems: filteredDuaItems } as DuaIndexWithItems;
              }
              return null;
            }

            // contentTypeFilter is "all" or "index"
            if (filteredDuaItems.length > 0) {
              return { ...index, duaItems: filteredDuaItems } as DuaIndexWithItems;
            }

            if (indexMatchesDirectly && categoryFilter === "all") {
              return { ...index, duaItems: [] } as DuaIndexWithItems;
            }

            return null;
          })
          .filter(Boolean) as DuaIndexWithItems[];

        // Determine if book should be included
        if (contentTypeFilter === "index" || contentTypeFilter === "dua") {
          if (filteredIndexes.length > 0) {
            return { ...book, indexes: filteredIndexes } as DuaBookWithIndexes;
          }
          return null;
        }

        // contentTypeFilter is "all" or "book"
        if (filteredIndexes.length > 0) {
          return { ...book, indexes: filteredIndexes } as DuaBookWithIndexes;
        }

        if (bookMatchesDirectly && categoryFilter === "all") {
          return { ...book, indexes: [] } as DuaBookWithIndexes;
        }

        return null;
      })
      .filter(Boolean) as DuaBookWithIndexes[];
  };

  const filteredBooks = filterTree(initialBooks);

  // Determine if searching/filtering is active
  const isFilteringOrSearching =
    searchQuery.length > 0 ||
    statusFilter !== "all" ||
    visibilityFilter !== "all" ||
    categoryFilter !== "all" ||
    contentTypeFilter !== "all";

  // Auto-expand parents of matched children when filters/search query changes
  const [lastFiltersKey, setLastFiltersKey] = useState("");
  const currentFiltersKey = `${searchQuery}-${statusFilter}-${visibilityFilter}-${categoryFilter}-${contentTypeFilter}`;
  if (currentFiltersKey !== lastFiltersKey) {
    setLastFiltersKey(currentFiltersKey);
    if (isFilteringOrSearching) {
      const ids = new Set<string>();
      filteredBooks.forEach((book) => {
        if (book.indexes && book.indexes.length > 0) {
          ids.add(book.id);
          book.indexes.forEach((idx) => {
            if (idx.duaItems && idx.duaItems.length > 0) {
              ids.add(idx.id);
            }
          });
        }
      });
      setExpandedIds(ids);
    }
  }

  // Expansion controls
  const handleExpandAll = () => {
    const ids = new Set<string>();
    filteredBooks.forEach((book) => {
      ids.add(book.id);
      book.indexes?.forEach((idx) => {
        ids.add(idx.id);
      });
    });
    setExpandedIds(ids);
  };

  const handleCollapseAll = () => {
    setExpandedIds(new Set());
  };

  const handleToggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Actions */}
      <PageHeader
        title="Dua Library"
        description="Manage books, indexes, categories, and dua content for the mobile app"
        actions={
          <div className="flex flex-wrap gap-2">
            {activeView === "tree" ? (
              <>
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
                <button
                  onClick={() => setIsAddDuaOpen(true)}
                  className="bg-[#022c22] text-white hover:opacity-90 font-medium py-1.5 px-3 rounded-xl text-xs shadow-sm flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Dua
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsAddCategoryOpen(true)}
                className="bg-[#022c22] text-white hover:opacity-90 font-medium py-1.5 px-3 rounded-xl text-xs shadow-sm flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" /> Category
              </button>
            )}
          </div>
        }
      />

      {/* Sub-tab view switcher */}
      <div className="flex border-b border-slate-100 gap-6">
        <button
          onClick={() => setActiveView("tree")}
          className={cn(
            "pb-3 text-xs font-bold border-b-2 transition-all outline-none cursor-pointer",
            activeView === "tree"
              ? "border-emerald-700 text-emerald-800"
              : "border-transparent text-slate-400 hover:text-slate-600"
          )}
        >
          Library Tree
        </button>
        <button
          onClick={() => setActiveView("categories")}
          className={cn(
            "pb-3 text-xs font-bold border-b-2 transition-all outline-none cursor-pointer",
            activeView === "categories"
              ? "border-emerald-700 text-emerald-800"
              : "border-transparent text-slate-400 hover:text-slate-600"
          )}
        >
          Categories
        </button>
      </div>

      {activeView === "tree" ? (
        <>
          {/* Filters & Search Control Bar */}
          <div className="space-y-4">
            {/* Search Input Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search books, indexes, supplications (matches English, Bangla, Arabic, tags, reference, category)..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-10 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-emerald-700 focus:bg-white focus:ring-1 focus:ring-emerald-700/20 font-medium text-slate-700"
                />
                {searchVal && (
                  <button
                    type="button"
                    onClick={() => setSearchVal("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Filter Bar */}
            <DuaFilterBar
              categories={initialCategories}
              filters={{
                status: statusFilter,
                visibility: visibilityFilter,
                category: categoryFilter,
                type: contentTypeFilter,
              }}
              onFilterChange={(key, value) => updateFilters({ [key]: value })}
              onReset={() => {
                setSearchVal("");
                updateFilters({
                  q: null,
                  status: null,
                  visibility: null,
                  category: null,
                  type: null,
                });
              }}
            />
          </div>

          {/* Main split explorer content */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
            {/* Left Tree Navigator */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/60 max-h-[70vh] overflow-y-auto pr-2">
                <DuaTree
                  books={filteredBooks}
                  selectedId={selectedId}
                  selectedType={selectedType}
                  onSelectNode={handleSelectNode}
                  expandedIds={expandedIds}
                  onToggleExpand={handleToggleExpand}
                  onExpandAll={handleExpandAll}
                  onCollapseAll={handleCollapseAll}
                />
              </div>
            </div>

            {/* Right Inspector Panel */}
            <div className="lg:col-span-3 min-h-[50vh]">
              {selectedType && selectedItem ? (
                <DuaDetailPanel
                  selectedType={selectedType}
                  selectedItem={selectedItem}
                  books={bookOptions}
                  allBooks={initialBooks}
                  categories={initialCategories}
                />
              ) : (
                <DuaEmptyState />
              )}
            </div>
          </div>
        </>
      ) : (
        <CategoryList categories={initialCategories} />
      )}

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

      <CategoryFormDialog
        isOpen={isAddCategoryOpen}
        onClose={() => setIsAddCategoryOpen(false)}
      />

      <DuaItemFormDialog
        isOpen={isAddDuaOpen}
        onClose={() => setIsAddDuaOpen(false)}
        books={initialBooks}
        categories={initialCategories}
        defaultBookId={defaultBookId}
        defaultIndexId={defaultIndexId}
      />
      
      <Toaster richColors position="top-right" />
    </div>
  );
}
