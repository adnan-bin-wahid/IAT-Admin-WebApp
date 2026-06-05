import { useState } from "react";
import { StatusBadge } from "@/components/common/status-badge";
import { Calendar, Eye, EyeOff, Edit, Plus, Archive, Check } from "lucide-react";
import { DuaBookWithIndexes, DuaIndexWithItems, DuaItemWithCategory } from "@/types/dua";
import { BookFormDialog } from "./book-form-dialog";
import { ArchiveConfirmDialog } from "./archive-confirm-dialog";
import { publishDuaBook, unpublishDuaBook } from "@/server/actions/dua-book-actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface DuaDetailPanelProps {
  selectedType: "book" | "index" | "dua" | null;
  selectedItem: DuaBookWithIndexes | DuaIndexWithItems | DuaItemWithCategory;
}

// Declared outside components to avoid React render-time reset issues
function DetailRow({ label, value, bnValue, isTextarea = false }: { label: string; value: React.ReactNode; bnValue?: React.ReactNode; isTextarea?: boolean }) {
  if (value === undefined || value === null) return null;
  return (
    <div className="py-3 border-b border-slate-50 flex flex-col md:flex-row md:items-start gap-1 md:gap-4 text-sm">
      <span className="text-slate-400 font-semibold md:w-36 shrink-0">{label}</span>
      <div className="flex-1 space-y-1">
        {typeof value === "string" || typeof value === "number" ? (
          <p className={isTextarea ? "text-slate-700 whitespace-pre-wrap leading-relaxed font-medium" : "text-slate-700 font-medium"}>
            {value}
          </p>
        ) : (
          value
        )}
        {bnValue && (
          <p className={isTextarea ? "text-slate-500 whitespace-pre-wrap leading-relaxed border-l-2 border-emerald-100 pl-2 text-xs font-medium" : "text-slate-500 text-xs font-semibold border-l-2 border-emerald-100 pl-2"}>
            {bnValue}
          </p>
        )}
      </div>
    </div>
  );
}

export function DuaDetailPanel({ selectedType, selectedItem }: DuaDetailPanelProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    if (selectedType !== "book" || !selectedItem) return;
    setIsPublishing(true);
    try {
      await publishDuaBook(selectedItem.id);
      toast.success("Book published successfully");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to publish book";
      toast.error(message);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleUnpublish = async () => {
    if (selectedType !== "book" || !selectedItem) return;
    setIsPublishing(true);
    try {
      await unpublishDuaBook(selectedItem.id);
      toast.success("Book unpublished successfully");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to unpublish book";
      toast.error(message);
    } finally {
      setIsPublishing(false);
    }
  };

  if (!selectedType || !selectedItem) return null;

  const formatDate = (dateString: Date | string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isBook = selectedType === "book";
  const isIndex = selectedType === "index";
  const isDua = selectedType === "dua";

  // Eager type checking helpers
  const book = isBook ? (selectedItem as DuaBookWithIndexes) : null;
  const index = isIndex ? (selectedItem as DuaIndexWithItems) : null;
  const dua = isDua ? (selectedItem as DuaItemWithCategory) : null;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col h-full justify-between animate-fade-in">
      <div className="space-y-6">
        {/* Header Summary */}
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-700 px-2 py-0.5 rounded bg-emerald-50">
                {selectedType} Node
              </span>
              <StatusBadge status={selectedItem.status} />
              <span className="flex items-center gap-1 text-[11px] text-slate-400 font-semibold">
                {selectedItem.isVisibleInApp ? (
                  <><Eye className="h-3 w-3 text-emerald-600" /> App Visible</>
                ) : (
                  <><EyeOff className="h-3 w-3 text-slate-400" /> Hidden</>
                )}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-800">
              {book && book.nameEn}
              {index && index.titleEn}
              {dua && dua.titleEn}
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-semibold border-l-2 border-emerald-200 pl-2">
              {book && book.nameBn}
              {index && index.titleBn}
              {dua && dua.titleBn}
            </p>
          </div>
          <span className="text-xs text-slate-400 font-bold whitespace-nowrap bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-xl shrink-0">
            v{selectedItem.version || 1}
          </span>
        </div>

        {/* Detailed Fields */}
        <div className="space-y-1 overflow-y-auto max-h-[55vh] pr-1">
          {/* BOOK Fields */}
          {book && (
            <>
              <DetailRow label="Slug" value={book.slug} />
              <DetailRow label="Subtitle" value={book.subtitleEn} bnValue={book.subtitleBn} />
              <DetailRow label="Description" value={book.descriptionEn} bnValue={book.descriptionBn} isTextarea />
              <DetailRow label="Accent Color" value={book.accentColor} />
              <DetailRow label="Total Indexes" value={book._count?.indexes ?? book.indexes?.length ?? 0} />
              <DetailRow label="Total Duas" value={book._count?.duaItems ?? 0} />
            </>
          )}

          {/* INDEX Fields */}
          {index && (
            <>
              <DetailRow label="Slug" value={index.slug} />
              <DetailRow label="Parent Book" value={index.book?.nameEn || "N/A"} />
              <DetailRow label="Subtitle" value={index.subtitleEn} bnValue={index.subtitleBn} />
              <DetailRow label="Description" value={index.descriptionEn} bnValue={index.descriptionBn} isTextarea />
              <DetailRow label="Total Duas" value={index._count?.duaItems ?? index.duaItems?.length ?? 0} />
            </>
          )}

          {/* DUA Fields */}
          {dua && (
            <>
              <DetailRow label="Slug" value={dua.slug} />
              <DetailRow label="Parent Book" value={dua.book?.nameEn || "N/A"} />
              <DetailRow label="Parent Index" value={dua.index?.titleEn || "N/A"} />
              <DetailRow label="Category" value={dua.category?.nameEn} bnValue={dua.category?.nameBn} />
              <DetailRow label="Arabic Text" value={
                dua.arabicText && (
                  <p className="text-xl text-right font-medium text-[#022c22] leading-loose py-2 select-all" dir="rtl">
                    {dua.arabicText}
                  </p>
                )
              } />
              <DetailRow label="Bangla Meaning" value={dua.banglaMeaning} isTextarea />
              <DetailRow label="English Meaning" value={dua.englishMeaning} isTextarea />
              <DetailRow label="Transliteration" value={dua.transliterationEn} bnValue={dua.transliterationBn} isTextarea />
              <DetailRow label="Reference" value={dua.referenceEn} bnValue={dua.referenceBn} />
              <DetailRow label="Repeat Count" value={dua.repeatCount} />
              <DetailRow label="Benefits" value={dua.benefitsEn} bnValue={dua.benefitsBn} isTextarea />
              <DetailRow label="Notes" value={dua.notesEn} bnValue={dua.notesBn} isTextarea />
              <DetailRow label="Tags" value={dua.tagsEn && dua.tagsEn.length > 0 ? dua.tagsEn.join(", ") : null} bnValue={dua.tagsBn && dua.tagsBn.length > 0 ? dua.tagsBn.join(", ") : null} />
            </>
          )}

          {/* Timestamps */}
          <div className="pt-4 mt-4 border-t border-slate-100 space-y-2 text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              <span>Created: {formatDate(selectedItem.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5" />
              <span>Updated: {formatDate(selectedItem.updatedAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons Panel */}
      <div className="mt-8 pt-4 border-t border-slate-100 flex flex-wrap gap-3">
        {isBook && book && (
          <>
            <button
              onClick={() => setIsEditOpen(true)}
              className="flex-1 min-w-[120px] bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Edit className="h-3.5 w-3.5" /> Edit Book
            </button>
            <button
              className="flex-1 min-w-[120px] bg-slate-50 text-slate-400 border border-slate-200 cursor-not-allowed font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5"
              disabled
            >
              <Plus className="h-3.5 w-3.5" /> Add Index
            </button>
            <button
              onClick={() => setIsArchiveOpen(true)}
              disabled={book.status === "archived"}
              className={cn(
                "flex-1 min-w-[120px] font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5",
                book.status === "archived"
                  ? "bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed"
                  : "bg-white border border-red-100 text-red-600 hover:bg-red-50 cursor-pointer"
              )}
            >
              <Archive className="h-3.5 w-3.5" /> Archive Book
            </button>
            {book.status === "published" ? (
              <button
                onClick={handleUnpublish}
                disabled={isPublishing}
                className="flex-1 min-w-[120px] bg-[#022c22] text-white hover:opacity-90 font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isPublishing ? (
                  <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                ) : (
                  <Check className="h-3.5 w-3.5" />
                )}
                Unpublish
              </button>
            ) : (
              <button
                onClick={handlePublish}
                disabled={isPublishing}
                className="flex-1 min-w-[120px] bg-[#022c22] text-white hover:opacity-90 font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isPublishing ? (
                  <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin shrink-0" />
                ) : (
                  <Check className="h-3.5 w-3.5" />
                )}
                Publish Book
              </button>
            )}
          </>
        )}

        {isIndex && (
          <>
            <button className="flex-1 min-w-[120px] bg-slate-50 text-slate-400 border border-slate-200 cursor-not-allowed font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5" disabled>
              <Edit className="h-3.5 w-3.5" /> Edit Index
            </button>
            <button className="flex-1 min-w-[120px] bg-slate-50 text-slate-400 border border-slate-200 cursor-not-allowed font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5" disabled>
              <Plus className="h-3.5 w-3.5" /> Add Dua
            </button>
            <button className="flex-1 min-w-[120px] bg-slate-50 text-slate-400 border border-slate-200 cursor-not-allowed font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5" disabled>
              <Archive className="h-3.5 w-3.5" /> Archive Index
            </button>
          </>
        )}

        {isDua && (
          <>
            <button className="flex-1 min-w-[120px] bg-slate-50 text-slate-400 border border-slate-200 cursor-not-allowed font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5" disabled>
              <Edit className="h-3.5 w-3.5" /> Edit Dua
            </button>
            <button className="flex-1 min-w-[120px] bg-slate-50 text-slate-400 border border-slate-200 cursor-not-allowed font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5" disabled>
              <Archive className="h-3.5 w-3.5" /> Archive Dua
            </button>
            <button className="flex-1 min-w-[120px] bg-slate-50 text-slate-400 border border-slate-200 cursor-not-allowed font-semibold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5" disabled>
              <Check className="h-3.5 w-3.5" /> Unpublish
            </button>
          </>
        )}
      </div>

      {isBook && book && (
        <>
          <BookFormDialog
            isOpen={isEditOpen}
            onClose={() => setIsEditOpen(false)}
            initialData={{
              id: book.id,
              nameBn: book.nameBn,
              nameEn: book.nameEn,
              slug: book.slug,
              subtitleBn: book.subtitleBn || "",
              subtitleEn: book.subtitleEn || "",
              descriptionBn: book.descriptionBn || "",
              descriptionEn: book.descriptionEn || "",
              icon: book.icon || "BookOpen",
              coverImage: book.coverImage || "",
              accentColor: book.accentColor || "#022c22",
              displayOrder: book.displayOrder,
              status: book.status as "draft" | "published" | "archived",
              isVisibleInApp: book.isVisibleInApp,
            }}
          />
          <ArchiveConfirmDialog
            isOpen={isArchiveOpen}
            onClose={() => setIsArchiveOpen(false)}
            bookId={book.id}
            bookName={book.nameEn}
          />
        </>
      )}
    </div>
  );
}
