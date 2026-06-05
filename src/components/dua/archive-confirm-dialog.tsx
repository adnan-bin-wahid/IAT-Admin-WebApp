"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { archiveDuaBook } from "@/server/actions/dua-book-actions";
import { archiveDuaIndex } from "@/server/actions/dua-index-actions";
import { toast } from "sonner";

interface ArchiveConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  name: string;
  type: "book" | "index";
  onSuccess?: () => void;
}

export function ArchiveConfirmDialog({
  isOpen,
  onClose,
  id,
  name,
  type,
  onSuccess,
}: ArchiveConfirmDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    try {
      if (type === "book") {
        await archiveDuaBook(id);
        toast.success("Book archived successfully");
      } else {
        await archiveDuaIndex(id);
        toast.success("Index archived successfully");
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : `Failed to archive ${type}`;
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in"
    >
      <div
        ref={dialogRef}
        className="bg-white w-full max-w-md rounded-2xl border border-slate-100 shadow-xl flex flex-col overflow-hidden animate-scale-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-amber-500" /> Confirm Archive
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-3">
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to archive the {type} <span className="font-bold text-slate-800">&quot;{name}&quot;</span>?
          </p>
          <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
            <p className="text-[11px] text-amber-700 font-semibold leading-relaxed">
              {type === "book"
                ? "Archiving this book will hide it from the default library view. It will not permanently delete its indexes or duas."
                : "Archiving this index will hide it from the default library view. It will not permanently delete its duas."}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-xl border border-slate-200 bg-white text-slate-500 px-4 py-2 text-xs font-semibold hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="rounded-xl bg-amber-600 text-white px-5 py-2 text-xs font-bold hover:bg-amber-700 disabled:opacity-50 flex items-center gap-1.5"
          >
            {isSubmitting ? (
              <>
                <span className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Archiving...
              </>
            ) : (
              "Confirm Archive"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
